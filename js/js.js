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





})(jQuery);