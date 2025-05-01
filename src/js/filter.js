( form => {

	if(!form) {

		return;

	}

	document.querySelector('.alert_up__window--filter').append(form);

	// отделяем тысячи
	const sepNumber = str => {
		str = str.toString();
		str = str.replace(/\s+/g,'');
		return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	}

	// склеиваем тысячи
	const strToNumber = n => {
		return parseInt(n.replace(/\s+/g,''), 10);
	}

	const inputRange = form.querySelectorAll('.filter__range');

	if(inputRange.length) {

		[...inputRange].forEach( el => {

			let from = el.querySelector('.filter__range-from'),
				to = el.querySelector('.filter__range-to'),
				inputFrom = el.querySelector('.filter__range-input-from'),
				inputTo = el.querySelector('.filter__range-input-to'),
				slider = el.querySelector('.filter__slider-control'),
				minValue = strToNumber(el.querySelector('.filter__range-min').textContent),
				maxValue = strToNumber(el.querySelector('.filter__range-max').textContent),
				fromValue = strToNumber(from.value),
				toValue = strToNumber(to.value);

			inputEvent(inputFrom);
			inputEvent(inputTo);

			inputFrom.value = sepNumber(fromValue);
			inputTo.value = sepNumber(toValue);

			function inputEvent(input){

				input.value = sepNumber(input.value);

				input.addEventListener('focus', function () {

					this.value = strToNumber(this.value);

				});

				input.addEventListener('blur', function () {

					var val = strToNumber(this.value);

					if(this.classList.contains('filter__range-input-from') && val < minValue){

						val = minValue;

					}
					else if(this.classList.contains('filter__range-input-to') && val > maxValue){

						val = maxValue;

					}

					this.value = sepNumber(val);

					updateInput();

				});

				input.addEventListener('keyup', function() {

					var val = this.value.replace(/[\D]/g, '');

					this.value = val;

					updateInput();

				});

			}

			function updateInput(){

				fromValue = strToNumber(inputFrom.value);
				toValue = strToNumber(inputTo.value);

				from.value = fromValue;
				to.value = toValue;

				slider.noUiSlider.set([fromValue, toValue]);

			}

			function updateSlider(){

				from.value = fromValue;
				to.value = toValue;

				inputFrom.value = sepNumber(fromValue);
				inputTo.value = sepNumber(toValue);

			}

			noUiSlider.create(slider, {
				start: [fromValue,toValue],
				connect: true,
				range: {
					'min': minValue,
					'max': maxValue
				},
				margin: parseInt(slider.getAttribute('data-step')),
				step: parseInt(slider.getAttribute('data-step'))
			});

			slider.noUiSlider.on('slide', function(e){

				fromValue = parseInt(e[0]);
				toValue = parseInt(e[1]);
				updateSlider();

			});

		});

	}

	form.addEventListener('reset', ()=> {

		setTimeout( ()=> {

			[...inputRange].forEach( el=> {

				let from = el.querySelector('.filter__range-from'),
					to = el.querySelector('.filter__range-to'),
					inputFrom = el.querySelector('.filter__range-input-from'),
					inputTo = el.querySelector('.filter__range-input-to'),
					slider = el.querySelector('.filter__slider-control'),
					fromValue = strToNumber(inputFrom.value),
					toValue = strToNumber(inputTo.value);

				from.value = fromValue;
				to.value = toValue;
				slider.noUiSlider.set([fromValue, toValue]);

			});

		},100);

	});

})(document.querySelector('.filter-modal'));