$(function () {
	var main = {
		config: {
			quantityStep: 100,
			quantityMinValue: 200,
			quantityMaxValue: 15000,
			updateRangeSlider: function (el, currentVal, maxVal) {
				el.val(currentVal);
				el.attr('value', currentVal);
				$('label[for="range-slider"]').text(currentVal + ' грн');
				el.css(
					'background',
					'linear-gradient(to right, #56CCF2 0%, #2F80ED ' + ((currentVal / maxVal) * 100) + '%, #D7DEEE ' + ((currentVal / maxVal) * 100) + '%, #D7DEEE 100%)');
			},
			updateQuantity: function (el, nextValue) {
				el.val(nextValue);
				el.attr('value', nextValue);
			}
		},
		opt: {
			accordion: $('.accordion__btn'),
			decrementQuantity: $('[data-quantity="minus"]'),
			incrementQuantity: $('[data-quantity="plus"]'),
			inputQuantity: $('input[name=quantity]'),
			rangeSlider: $('.range-slider')
		},
		accordion: function (el) {
			el.on('click', function (e) {
				e.preventDefault();
				$(this).parent().toggleClass('active');
				var isActive = $(this).parent().hasClass('active');
				isActive ? $(this).next().slideDown(200) : $(this).next().slideUp(200);
			});
		},
		decrementQuantity: function (el) {
			el.on('click', function (e) {
				// Stop acting like a button
				e.preventDefault();
				var fieldName = el.attr('data-field'),
					inputField = $('input[name=' + fieldName + ']'),
					currentVal = parseInt(inputField.val()),
					nextValue = currentVal - main.config.quantityStep
				rangeSlider = $('.range-slider');
				if (nextValue >= main.config.quantityMinValue) {
					main.config.updateQuantity(inputField, nextValue);
					main.config.updateRangeSlider(rangeSlider, nextValue, main.config.quantityMaxValue);
				}
			});
		},
		incrementQuantity: function (el) {
			el.on('click', function (e) {
				// Stop acting like a button
				e.preventDefault();
				var fieldName = el.attr('data-field'),
					inputField = $('input[name=' + fieldName + ']'),
					currentVal = parseInt(inputField.val()),
					nextValue = currentVal + main.config.quantityStep,
					rangeSlider = $('.range-slider');
				if (nextValue <= main.config.quantityMaxValue) {
					main.config.updateQuantity(inputField, nextValue);
					main.config.updateRangeSlider(rangeSlider, nextValue, main.config.quantityMaxValue);
				}
			});
		},
		inputQuantity: function (el) {
			el.on('blur', function (e) {
				e.preventDefault();
				var currentValue = Math.ceil(parseInt(el.val()) / 100) * 100,
					rangeSlider = $('.range-slider');
				if (!currentValue || currentValue < main.config.quantityMinValue) {
					main.config.updateQuantity(el, main.config.quantityMinValue);
					main.config.updateRangeSlider(rangeSlider, main.config.quantityMinValue, main.config.quantityMaxValue);
				} else if (currentValue > main.config.quantityMaxValue) {
					main.config.updateQuantity(el, main.config.quantityMaxValue);
					main.config.updateRangeSlider(rangeSlider, main.config.quantityMaxValue, main.config.quantityMaxValue);
				} else {
					main.config.updateQuantity(el, currentValue);
					main.config.updateRangeSlider(rangeSlider, currentValue, main.config.quantityMaxValue);
				}
			});
		},
		rangeSlider: function (el) {
			el.on('input', function (e) {
				e.preventDefault();
				var currentVal = parseInt(el.val()),
					inputField = $('input[name="quantity"');
				main.config.updateRangeSlider(el, currentVal, main.config.quantityMaxValue);
				main.config.updateQuantity(inputField, currentVal);
			})
		},
		init: function () {
			// accordion init
			this.accordion(this.opt.accordion);

			// stepper quantity
			this.decrementQuantity(this.opt.decrementQuantity);
			this.incrementQuantity(this.opt.incrementQuantity);
			this.inputQuantity(this.opt.inputQuantity);

			// range slider
			this.rangeSlider(this.opt.rangeSlider);
		}
	};

	//E-mail Ajax Send
	// $("form").submit(function () {
	// 	var th = $(this);
	// 	$.ajax({
	// 		type: "POST",
	// 		url: "mail.php",
	// 		data: th.serialize()
	// 	}).done(function () {
	// 		alert("Thank you!");
	// 		setTimeout(function () {
	// 			th.trigger("reset");
	// 		}, 1000);
	// 	});
	// 	return false;
	// });


	$(document).ready(function () {
		main.init();
	});
});

$(window).load(function () {
	$('.backdrop').removeClass('active');
});
