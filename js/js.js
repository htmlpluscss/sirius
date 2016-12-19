/* UTF-8

© kovrigin
Все права разрешены
красивый дизайн должен иметь красивый код®

http://htmlpluscss.ru

*/

(function($){

	var windowWidth,
		windowHeight,
		windowScrollTop,
		resizeTimeoutId,
		body = $('body'),
		main = $('.main'),
		menuCat = $('.menu-cat'),
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
				menuCat.removeClass('menu-cat--active');
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

// img-cover
	$('.img-cover').filter('[data-img]').each(function(){
		var src = $(this).attr('data-img');
		$(this).css('background-image','url('+src+')');
	});

// scroll-next
	$('.scroll-next').on('click',function(){
		$('html, body').animate({'scrollTop': windowHeight}, 1000);
	});

// menu
	$('.menu-cat-show').on('click',function(){
		menuCat.toggleClass('menu-cat--active');
		$(this).toggleClass('menu-top--active');
		$('#header').find('a').not('.menu-cat-show a, .menu-cat a').one('mouseenter',function(){
			menuCat.removeClass('menu-cat--active');
			$('.menu-cat-show').removeClass('menu-top--active');
		});
	});

// map-address__marker
	$('.map-address__marker').on('click',function(){
		$('.contact-block--' + $(this).attr('data-mod')).removeClass('hide').siblings().addClass('hide');
		$(this).addClass('map-address__marker--active').siblings().removeClass('map-address__marker--active');
	});

//	$('.menu-mobile-toggle').on('click',function(){
//		$('#header').toggleClass('header--menu-show');
//	});

// tabs
	$.fn.tabs = function(){

		var tab = function(){
			var t = $(this);
			var dt = t.children('.tabs__dt');
			var dd = t.children('.tabs__dd');
			t.append(dd);
			dt
			.wrapAll('<div class="tabs__nav clr notsel">')
			.on('click',function(){
				var t = $(this);
				t.addClass('tabs__dt--active').siblings().removeClass('tabs__dt--active');
				dd.removeClass('tabs__dd--active').eq(dt.index(t)).addClass('tabs__dd--active');
			})
			.filter('.tabs__dt--active').length > 0 ?
				dt.filter('.tabs__dt--active').triggerHandler('click') :
				dt.first().triggerHandler('click');
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
			}).trigger('change');

		}

		$(document).on('click', function(event) {
			$('.select--focus').not($(event.target).closest('.select')).removeClass('select--focus').find('.select__box').hide();
		});

		return this.each(select);

	};

	$('select').mySelect();

})(jQuery);