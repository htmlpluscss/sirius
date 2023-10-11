/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var showAlertUp,
		windowWidth,
		windowHeight,
		windowScrollTop,
		resizeTimeoutId,
		body = $('body'),
		main = $('.main'),
		$window = $(window);

	$window.on({
		resize: function(){
			clearTimeout(resizeTimeoutId);
			resizeTimeoutId = setTimeout(function(){
				pageResize();
			}, 100);
		},
		scroll: function(){
			windowScrollTop = $window.scrollTop();

			if(windowScrollTop > windowHeight / 2){
				body.removeClass('menu-cat-active');
				$('.menu-cat-show').removeClass('menu-top--active');
			}
		}
	});

	function pageResize(){
		windowWidth = $window.width();
		windowHeight = $window.height();
	}
	pageResize();

	$window.trigger('scroll');


// btn hover
	$('.btn').each(function(){
		var t = $(this);
		var submit = t.children('input').clone();
		t.addClass('data-hover').html('<span class="data-hover__hover">'+t.text()+'</span><span class="data-hover__text">'+t.text()+'</span>');
		if(submit !== undefined){
			t.append(submit);
		}
	});

// scroll-next
	$('.scroll-next').on('click',function(){
		$('html, body').animate({'scrollTop': windowHeight}, 1000);
	});


// img-cover
	$('.img-cover').filter('[data-img]').each(function(){
		var src = $(this).attr('data-img');
		$(this).css('background-image','url('+src+')');
	});

// menu
	$('.menu-cat-show').on('click',function(){
		if($('.menu-cat').css('display')!='none'){
			body.toggleClass('menu-cat-active');
			body.find('a').not('.menu-cat-show a, .menu-cat a').one('mouseenter',function(){
				body.removeClass('menu-cat-active');
				$('.menu-cat-show').removeClass('menu-top--active');
			});
			return false;
		}
	});

// map-address__marker
	$('#map-address').on('change',function(){
		$('.contact-block--' + $(this).val()).removeClass('hide').siblings().addClass('hide');
	});
	$('.map-address__marker').on('click',function(){
		$('#map-address').val($(this).attr('data-mod')).trigger('change');
		$(this).addClass('map-address__marker--active').siblings().removeClass('map-address__marker--active');
	});

	$('.menu-mobile-toggle').on('click',function(){
		$('#header').toggleClass('header--menu-show');
	});

// tabs
	$.fn.tabs = function(){

		var tab = function(){
			var t = $(this);
			var dt = t.children('.tabs__dt');
			var dd = t.children('.tabs__dd');
			var nav = $('<div class="tabs__nav clr notsel hidden-xs">');

			nav.html(dt.clone(true));
			t.prepend(nav);

			dt.addClass('visible-xs');

			nav.children().on('click',function(){
				var t = $(this);
				t.addClass('tabs__dt--active').siblings().removeClass('tabs__dt--active');
				dd.removeClass('tabs__dd--active').eq(nav.children().index(t)).addClass('tabs__dd--active');
			});

			dt.on('click',function(){
				$(this).toggleClass('tabs__dt--active');
			});

			nav.children('.tabs__dt--active').length > 0 ?
				nav.children('.tabs__dt--active').triggerHandler('click') :
				nav.children().first().triggerHandler('click');
		}

		return this.each(tab);

	};

	$('.tabs').tabs();


// select
	$.fn.mySelect = function(){

		var select = function(){

			var select = $(this);
			select.wrap('<div class="select notsel">');
			var select_box = select.parent();
			var c = '<span class="select__value"><span class="select__text"></span></span><div class="select__box"><ul>';
			select.children('option').each(function() {
				if($(this).val()!='none')
					c += '<li class="select__li" data-value="' + $(this).val() + '">' + $(this).text() + '</li>';
			});
			c += '</ul></div>';
			select.before(c);

			var box_ul = select.siblings('.select__box');
			var visible = select.siblings('.select__value').children();

			select_box.on('click', function() {
				select_box.hasClass('select--focus') ? box_ul.hide() : box_ul.show();
				select_box.toggleClass('select--focus');
			});

			box_ul.on('click','.select__li', function() {
				select.val($(this).attr('data-value')).trigger('change');
			});
			select.on('change',function(){
				var o = select.children(':selected');
				visible.text(o.text());
				o.attr('value')=='none' ? select_box.addClass('select--default') : select_box.removeClass('select--default');
			});

			visible.text(select.children(':selected').text());

			if(select.children(':selected').attr('value').length===0) {
				select_box.addClass('select--default');
			}

		}

		$(document).on('click', function(event) {
			$('.select--focus').not($(event.target).closest('.select')).removeClass('select--focus').find('.select__box').hide();
		});

		return this.each(select);

	};

	$('select').mySelect();

// alert_up
	$.fn.alertUp = function(){

		var box = $('.alert_up');
		var windows = box.children();

		var div = $('<div class="scroolbarwidth">');
		div.append('<p></p>');
		body.append(div);
		var w = div.width() - div.children().width();
		div.remove();
		if(w>0){
			var style = $('<style>');
			style.html('.body--alert_up__scroll{margin-left:-'+w+'px}');
			box.append(style);
		}

		box.on('click',function(event){
			var t = $(event.target);
			if(t.is('.alert_up') || t.is('.alert_up__close')){
				windows.removeClass('alert_up__window--active');
				body.removeClass('body--alert_up__show body--alert_up__scroll');
			}
		});

		showAlertUp = function (selector) {
			var a_up = windows.filter('.alert_up__window--'+selector);
			body.addClass('body--alert_up__show');
			body.toggleClass('body--alert_up__scroll', windowHeight < body.height());
			box.toggleClass('flexbox', windowHeight > a_up.outerHeight());
			windows.not(a_up).removeClass('alert_up__window--active');
			a_up.addClass('alert_up__window--active').focus();
			if(selector == 'search'){
				a_up.find('.input').focus();
			}
		}

		return this.each(function(){
			var selector = $(this).attr('data-alert-up');
			$(this).on('click',function(){
				showAlertUp(selector);
			});
		});

	};

	$('[data-alert-up]').alertUp();


// input-box
	$('.input-box__input').on({
		focus: function(){
			$(this).addClass('input-box__input--active');
		},
		change: function(){
			$(this).toggleClass('input-box__input--active', $(this).val().length!="");
		},
		blur: function(){
			$(this).toggleClass('input-box__input--active', $(this).val().length!="");
		}
	});

// product
	$('.product__img-list img').on('click', function() {
		$(this).parent().addClass('product__img-list--active').siblings().removeClass('product__img-list--active');
		$('.product__img-big').children().eq($(this).parent().index()).addClass('product__img-big__active').siblings().removeClass('product__img-big__active');
	});

// show-room
	(function(room){

		if(room){

			var img = room.find('img'),
				index = 0;

			setInterval(function(){

				img.each(function(i){

					if($(this).hasClass('is-active')){

						$(this).removeClass('is-active');

						index = i+1;

						if(index >= img.length) {

							index = 0;

						}

					}

				});

				img.eq(index).addClass('is-active');

			},5000);

		}

	})($('.show-room'));

})(jQuery);