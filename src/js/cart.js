
// cart

((cart) => {

	if(!cart) {

		return;

	}

	// отделяем тысячи
	function sepNumber(str) {
		str = parseInt(str, 10).toString();
		return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	}

	var form = cart.querySelector('.cart-list'),
		quantity = form.querySelectorAll('.quantity');

	var result = () => {

		var s = 0;

		Array.prototype.forEach.call(cart.querySelectorAll('.cart__item'), (el) => {

			var priceMotor = 0,
				motor = el.querySelector('.cart__motor-list .radio-btn__input:checked');

			// если есть мотор
			if(motor){

				priceMotor = parseInt(motor.getAttribute('data-price'));

			}

			var count = parseInt(el.querySelector('.quantity__count').value),
				price = parseInt(el.querySelector('.quantity__price').value) + priceMotor;

			if(isNaN(count)) {

				count = 1;
				el.querySelector('.quantity__count').value = 1;

			}

			el.querySelector('.cart__item-price').textContent = sepNumber(price) + '.00';
			el.querySelector('.cart__item-price--total').textContent = sepNumber(count * price) + '.00';

			s += count * price;

		});

		// send form

		var formData = new FormData(form),
			xhr = new XMLHttpRequest();

		xhr.open("POST", form.getAttribute('action'));
		xhr.send(formData);

	}

	result();

	if(quantity.length) {

// quantity
		Array.prototype.forEach.call(quantity, (el) => {

			var up = el.querySelector('.quantity__btn--up'),
				down = el.querySelector('.quantity__btn--down'),
				count = el.querySelector('.quantity__count'),
				value = null;

			up.addEventListener('click', () => {

				value = parseInt(count.value) + 1;

				count.value = value;

				result();

			});

			down.addEventListener('click', () => {

				value = parseInt(count.value) - 1;

				if(value < 1) {

					value = 1;

				}

				count.value = value;

				result();

			});

			count.addEventListener('blur', () => result());

			count.addEventListener('focus', () =>
				setTimeout(() =>
					count.setSelectionRange(0,9),100));

			count.addEventListener('keyup', () => {

				var val = this.value.replace(/[\D]/g, '');

				this.value = val;

				result();

			});

		});

// remove
		Array.prototype.forEach.call(cart.querySelectorAll('.cart__item-remove'), (el) => {

			var item = el.closest('.cart__item');

			el.addEventListener('click', () => {

				item.classList.add('cart__item--remove');

				setTimeout(() => {

					item.remove();
					result();

				},1000);

			});

		});

	}

// переключение способа доставки
	Array.prototype.forEach.call(cart.querySelectorAll('.toggle-delivery'), (el) => {

		el.addEventListener('change', () => {

			if(el.getAttribute('data-delivery') == 'address') {

				Array.prototype.forEach.call(cart.querySelectorAll('.toggle-delivery-warehouse'), (el) => el.classList.add('hide'));
				Array.prototype.forEach.call(cart.querySelectorAll('.toggle-delivery-address'), (el) => el.classList.remove('hide'));

			}

			if(el.getAttribute('data-delivery') == 'warehouse') {

				Array.prototype.forEach.call(cart.querySelectorAll('.toggle-delivery-warehouse'), (el) => el.classList.remove('hide'));
				Array.prototype.forEach.call(cart.querySelectorAll('.toggle-delivery-address'), (el) => el.classList.add('hide'));

			}

		});

	});

// cart-order

	const formOrder = cart.querySelector('.cart-order'),
		  formOrderError = cart.querySelector('.cart-order__text-error');

	// отправка формы

	const getTextError = (input) => {

		return input.getAttribute('data-errors') ? CartFormOrder.errors[input.getAttribute('data-errors')] : CartFormOrder.errors['required'];

	}

	const formOrderSubmit = () => {

		var novalidate = false,
			formData = new FormData(formOrder),
			textError = '';
			formRequired = formOrder.querySelectorAll('[required]'),
			formBtnSubmit = formOrder.querySelector('.cart-order__submit');

		Array.prototype.forEach.call(formRequired, (input) => {

			if(input.offsetParent === null) {

				return;

			}

			if(input.getAttribute('type') == 'checkbox') {

				if(input.checked){

					input.parentNode.classList.remove('checkbox--error');

				}
				else {

					input.parentNode.classList.add('checkbox--error');
					novalidate = true;
					textError = getTextError(input);

				}

			}

			else if(input.getAttribute('type') == 'radio') {

				var _name = input.getAttribute('name'),
					_checked = false,
					_radioGroup = document.querySelectorAll('[name="'+_name+'"]');

				Array.prototype.forEach.call(_radioGroup, (el) => {

					if(el.checked){

						_checked = true;

					}

				});

				if(!_checked){

					novalidate = true;
					textError = getTextError(input);

				}

			}

			else {

				if(!input.value){

					novalidate = true;
					input.classList.add('input--error');
					textError = getTextError(input);

				}

			}

		});

		if(!novalidate){

			var xhr = new XMLHttpRequest();

			xhr.open("POST", formOrder.getAttribute('action'));
			xhr.send(formData);

			if(formBtnSubmit) {

				formBtnSubmit.disabled = true;

			}

			xhr.onreadystatechange = () => {

				if (xhr.readyState != 4){

					return;

				}

				if (xhr.status == 200) {

					console.log('редирект?');

				} else {

		//			alert('ошибка ' + xhr.status);
					formOrderError.textContent = 'форма типа отправлена.';

				}

				if(formBtnSubmit) {

					formBtnSubmit.disabled = false;

				}

			}

		}
		else {

			formOrderError.textContent = textError;

			var isInViewport = formOrder.querySelector('.input--error').getBoundingClientRect();

			if(!isInViewport.top >= 0 && isInViewport.bottom <= window.innerHeight){

				window.scrollTo(0, formOrder.querySelector('.input--error').getBoundingClientRect().top + window.pageYOffset - 100);

			}

		}

	}


	// обработка отправки формы

	formOrder.addEventListener('submit', (e) => {

		e.preventDefault();
		formOrderSubmit();

	});

	// motor

	var radioMotor = form.querySelectorAll('.radio-btn__input');

	if(radioMotor.length) {

		Array.prototype.forEach.call(radioMotor, function(el){

			// описание мотора
			var desc = el.parentNode.querySelector('.radio-btn__desc').innerHTML;

			// цена мотора
			var price = parseInt(el.getAttribute('data-price'));

			// слушаем клик по кнопке
			el.addEventListener('change', function() {

				var item = el.closest('.cart__item'),
					descResult = item.querySelector('.cart__motor-desc');

				// выводим описание мотора
				descResult.innerHTML = desc;
				descResult.classList.remove('is-ahctung');

				result();

			});

		});
	}

})(document.querySelector('.cart'));


// input-label
((inputLabel) => {

	if(!inputLabel.length) {

		return;

	}

	var focusInputLabel = (el,required) => {

		el.parentNode.classList.toggle('input-label--no-empty', el.value);

		if(required && el.getAttribute('required') !== null) {

			el.parentNode.classList.toggle('input-label--error', !el.value);

		}

	}

	Array.prototype.forEach.call(inputLabel, (el) => {

		el.addEventListener('focus', ()=> focusInputLabel(el));
		el.addEventListener('keyup', ()=> focusInputLabel(el,true));
		el.addEventListener('blur', ()=> focusInputLabel(el,true));

		focusInputLabel(el);

		window.addEventListener("DOMContentLoaded", ()=> focusInputLabel(el));

	});

})(document.querySelectorAll('.input-label__input'));


((forms) => {

	"use strict";

	if(!forms.length) {

		return;

	}

	Array.prototype.forEach.call(forms, (form) => {

		var formRequired = form.querySelectorAll('[required]'),
			formBtnSubmit = form.querySelector('.form__submit');

		// отправка формы
		form.addEventListener('submit', (e) => {

			e.preventDefault();

			var novalidate = false,
				formData = new FormData(form);

			Array.prototype.forEach.call(formRequired, (input) => {

				if(input.offsetParent === null) {

					return;

				}

				if(input.getAttribute('type') == 'checkbox') {

					if(input.checked){

						input.parentNode.classList.remove('checkbox--error');

					}
					else {

						input.parentNode.classList.add('checkbox--error');
						novalidate = true;

					}

				}

				else {

					errorInput(input);

					if(!input.value){

						novalidate = true;

					}

				}

			});

			if(!novalidate){

				var xhr = new XMLHttpRequest();

				xhr.open("POST", form.getAttribute('action'));
				xhr.send(formData);

				if(formBtnSubmit) {

					formBtnSubmit.disabled = true;

				}

				xhr.onreadystatechange = () => {

					if (xhr.readyState != 4){

						return;

					}

					if (xhr.status == 200) {

					} else {

						alert('ошибка ' + xhr.status);

					}

					if(formBtnSubmit) {

						formBtnSubmit.disabled = false;

					}

				}

			}

		});

	});



// inputRequired

	var inputRequired = document.querySelectorAll('.input[required]');

	var errorInput = (el) => el.classList.toggle('input--error', !el.value);

	Array.prototype.forEach.call(inputRequired, (el) => {

		el.addEventListener('keyup', () => errorInput(el));
		el.addEventListener('blur', () => errorInput(el));

	});



// checked

	var checkbox = document.querySelectorAll('.checkbox');

	Array.prototype.forEach.call(checkbox, (el) => {

		var input = el.querySelector('input');

		input.addEventListener('change', () => {

			if(input.checked) {

				el.classList.remove('checkbox--error');

			}

		});

	});



})(document.querySelectorAll('.form'));