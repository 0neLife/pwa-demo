// load plugins
const autoprefixer = require('autoprefixer'),
  browsersync = require('browser-sync').create(),
  del = require('del'),
  exec = require('child_process').exec, // run command-line programs from gulp
  cssnano = require('cssnano'),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  gulp = require('gulp'),
  babel = require('gulp-babel'),
  surge = require('gulp-surge'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  postcss = require('gulp-postcss'),
  imagemin = require('gulp-imagemin');

// load gulp api methods
const { series, src, dest, parallel } = require('gulp');

// browserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000,
    notify: false,
    files: [
      './dist/**/*.html',
      './dist/js/*.js',
      './dist/**/*.js',
      './dist/css/*.css',
      './dist/libs/*'
    ]
  });

  done();
}

// browserSync reload
function browserSyncReload(done) {
  browsersync.reload();

  done();
}

// copy all libraries
function copyLibs() {
  return (
    src([
      'src/libs/bootstrap-grid/*.css',
      'src/libs/jquery/*.js'
    ])
      .pipe(dest('dist/libs'))
  )
}

// copy manifest json
function copyJson() {
  return (
    src([
      'src/**/*.json',
    ])
      .pipe(dest('dist'))
  )
}

// copy all fonts
function copyFonts() {
  return (
    src(['src/fonts/**/*.{ttf,woff,woff2}'])
      .pipe(dest('dist/fonts/'))
  )
}

// copy font-awesome icons 
function copyFontAwesome() {
  return (
    src([
      'src/libs/font-awesome/webfonts/*.{ttf,woff,woff2,eot,svg}',
      'src/libs/font-awesome/css/all.min.css'
    ])
      .pipe(dest('dist/css/font-awesome/webfonts/'))
  )
}

// compression all images
function compressionImages() {
  return (
    src('src/img/*')
      .pipe(
        imagemin([
          imageminMozjpeg({
            quality: 85
          })
        ]))
      .pipe(dest('dist/img/'))
  )
}

// compression all images
function compressionPwaIcons() {
  return (
    src('src/img/icon/*')
      .pipe(dest('dist/img/icon/'))
  )
}

// copy scss
function styles() {
  return (
    src('src/styles/*.sass')
      .pipe(sass({
        includePaths: require('node-bourbon').includePaths
      }).on('error', sass.logError))
      .pipe(rename({ suffix: '.min', prefix: '' }))
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(dest('dist/css'))
  )
}

// copy sw js
function sWscripts() {
  return (
    src('src/**/sw.js')
      .pipe(
        babel({
          plugins: ['@babel/transform-runtime']
        }))
      .pipe(dest('dist'))
  )
}

// copy js
function scripts() {
  return (
    src('src/js/**/*.js')
      .pipe(
        babel({
          plugins: ['@babel/transform-runtime']
      }))
      .pipe(dest('dist/js'))
  )
}

// copy html
function copyHtml() {
  return (
    src('src/**/*.html')
      .pipe(dest('dist'))
  )
}

// Watch files
function watchFiles() {
  gulp.watch('src/libs/*', copyLibs);
  gulp.watch('src/styles/*.sass', styles);
  gulp.watch('src/*.json', copyJson);
  gulp.watch('src/js/*.js', scripts);
  gulp.watch('src/*.js', sWscripts);
  gulp.watch('src/*.html', copyHtml);
}

// clean build
function clean() {
  return del(['./dist']);
}

// Commit and push files to Git
function git(done) {
  return exec('git add . && git commit -m"surge deploy" && git push -u origin master');
}

// Deploy prodject to surge
function surgeDeploy(done) {
  return surge({
    project: './dist', // Path to your static build directory
    domain: null  // Your domain or Surge subdomain
  })
}

// define complex tasks
const build = series(clean, parallel(styles, copyLibs, copyJson, sWscripts, scripts, copyHtml, copyFonts, copyFontAwesome, compressionImages, compressionPwaIcons));
const watch = parallel(watchFiles, browserSync);

// export tasks
exports.copyLibs = copyLibs;
exports.copyJson = copyJson;
exports.copyFonts = copyFonts;
exports.copyFontAwesome = copyFontAwesome;
exports.compressionImages = compressionImages;
exports.compressionPwaIcons = compressionPwaIcons;
exports.styles = styles;
exports.sWscripts = sWscripts;
exports.scripts = scripts;
exports.copyHtml = copyHtml;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = series(build, watch);
exports.deploy = series(git, build, surgeDeploy);
