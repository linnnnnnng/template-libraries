(function($) {
    var autodirection,autocontrol,timer,sliderTime,curSlide,maxSlide,totalSlide,slideWidth=0;
   
    $.fn.initImageSlider = function(options) {
        var opts = $.extend({}, $.fn.initImageSlider.defaults, options);
		slider=$(this)
		autodirection=opts.autodirection;
		autodirection=autodirection==undefined?false:autodirection;
		autocontrol=opts.autocontrol;
		autocontrol=autocontrol==undefined?false:autocontrol;
		timer=opts.timer;
		timer=timer==undefined?0:timer;
		slideWidth=$(this).find('.imageList').width();
		totalSlide = $(this).find(".imageList li").length;
		curSlide=1;
		
		//build control
		$(slider).find('.control li').remove();
		for(var count=0; count<totalSlide;count++){
			$(slider).find('.control ul').append('<li></li>');
		}
		$(slider).find('.control').css('margin-left',($(slider).width()/2)-($(slider).find('.control').width()/2));
		$(slider).find('.control').css('margin-top',$(slider).height()-($(slider).find('.control').height()+20));
		$(slider).find('.control li').each(function(){
			$(this).click(function(){
				$.fn.initImageSlider.toggleAnimateTo($(this).index()+1)
			});
		});
		
		if(autocontrol){
			$('.control').hide();
			$(slider).mouseenter(function() {
				$('.control').fadeIn()
			}).mouseleave(function() {
				$('.control').fadeOut();
			});
		}
		
		//direction
		$(slider).find('.nav .leftArrow').css('left',10);
		$(slider).find('.nav .rightArrow').css('left',($(slider).width())-($(slider).find('.nav .rightArrow').width()+10));
		$(slider).find('.nav .leftArrow').css('top',($(slider).height()/2)-($(slider).find('.nav .leftArrow').height()/2));
		$(slider).find('.nav .rightArrow').css('top',($(slider).height()/2)-($(slider).find('.nav .rightArrow').height()/2));
		
		$(slider).find('.nav .rightArrow').click(function(){
			$.fn.initImageSlider.toggleDirection(true)
		});
		
		$(slider).find('.nav .leftArrow').click(function(){
			$.fn.initImageSlider.toggleDirection(false)
		});
		if(autodirection){
			$('.nav').hide();
			$(slider).mouseenter(function() {
				$('.nav').fadeIn()
			}).mouseleave(function() {
				$('.nav').fadeOut();
			});
		}
		
		$.fn.initImageSlider.toggleAnimateTo(curSlide);
		$.fn.initImageSlider.autoAnimateSlide();
    };
	
	$.fn.initImageSlider.toggleDirection = function(con) {
        if(con) {
			curSlide=curSlide<totalSlide?curSlide+1:1;
        } else {
			curSlide=curSlide>1?curSlide-1:totalSlide;
        }
		$.fn.initImageSlider.toggleAnimateTo(curSlide)
    }
	
	$.fn.initImageSlider.toggleAnimateTo = function(con) {
		$.fn.initImageSlider.autoAnimateSlide();
		$(slider).find('.control li').each(function(){
			$(this).removeClass('selected')
		});
		$(slider).find('.control li').eq(con-1).addClass('selected')
        $(slider).find('.imageList ul').animate({left: -(slideWidth * (con-1))}, 500);
    }
	
	$.fn.initImageSlider.autoAnimateSlide = function() {
        if(timer!=0) {
            clearTimeout(sliderTime);
            sliderTime=setTimeout(function(){
                  $.fn.initImageSlider.toggleDirection(true);
            },timer);
        }
    }
})(jQuery);