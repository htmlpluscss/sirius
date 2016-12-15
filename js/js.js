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
	$('.menu-cat-show').hover(function(){
		$('.menu-cat').addClass('menu-cat--active');
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
			.wrapAll('<div class="tabs__nav notsel">')
			.on('click',function(){
				var t = $(this);
				t.addClass('tabs__dt--active').siblings('.tabs__dt--active').removeClass('tabs__dt--active');
				dd.removeClass('tabs__dd--active').eq(dt.index(t)).addClass('tabs__dd--active');
			})
			.filter('.tabs__dt--active').length > 0 ?
				dt.filter('.tabs__dt--active').triggerHandler('click') :
				dt.first().triggerHandler('click');
		}

		return this.each(tab);

	};

	$('.tabs').tabs();




})(jQuery);