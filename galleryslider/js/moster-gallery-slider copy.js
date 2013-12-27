(function($) {
    var autonav,autothumb,slider,displayThumb,curThumb,totalThumbs,maxPage,curPage,thumbWidth,maxThumb=0;
   
    $.fn.initGallerySlider = function(options) {
        var opts = $.extend({}, $.fn.initGallerySlider.defaults, options);
		slider=$(this)
		displayThumb=opts.display;
		autonav=opts.autonav;
		autothumb=opts.autothumb;
		autonav=autonav==undefined?false:autonav;
		autothumb=autothumb==undefined?false:autothumb;
		displayThumb=displayThumb==undefined?4:displayThumb;
		totalThumbs = $(this).find(".galleryList li").length;
		thumbWidth=$(this).find('.galleryList').width();
		maxThumb=Math.floor(thumbWidth/$(this).find(".galleryList li").width());
		curThumb=0;
		maxPage=0;
		curPage=1;
		maxPage=totalThumbs>maxThumb?Math.ceil(totalThumbs/maxThumb):1;
		
		$(slider).find('.nav .leftArrow').css('left',10);
		$(slider).find('.nav .rightArrow').css('left',($(slider).find('.mainHolder').width())-($(slider).find('.nav .rightArrow').width()+10));
		$(slider).find('.nav .leftArrow').css('top',($(slider).find('.mainHolder').height()/2)-($(slider).find('.nav .leftArrow').height()/2));
		$(slider).find('.nav .rightArrow').css('top',($(slider).find('.mainHolder').height()/2)-($(slider).find('.nav .rightArrow').height()/2));
		
		if(autonav){
			$('.nav').hide();
			$(slider).find('.mainHolder').mouseenter(function() {
				$('.nav').fadeIn()
			}).mouseleave(function() {
				$('.nav').fadeOut();
			});
		}
		
		$(slider).find('.thumbHolder .rightArrow').click(function(){
			$.fn.initGallerySlider.toggleThumbAnimate(true);
		});
		
		$(slider).find('.thumbHolder .leftArrow').click(function(){
			$.fn.initGallerySlider.toggleThumbAnimate(false);
		});
		
		$(slider).find('.mainHolder .rightArrow').click(function(){
			$.fn.initGallerySlider.toggleMainPic(true)
		});
		
		$(slider).find('.mainHolder .leftArrow').click(function(){
			$.fn.initGallerySlider.toggleMainPic(false)
		});
       
        var galleryCount=0
		$(slider).find('.galleryList li').each(function(){
			//load default
			if(galleryCount==0){
				$.fn.initGallerySlider.loadThumbPic($(this).find('img').attr('rel'));
			}
			$(this).click(function() {
				curThumb=$(this).index();
				$.fn.initGallerySlider.loadThumbPic($(this).find('img').attr('rel'));
			});
			galleryCount++
		});
		$.fn.initGallerySlider.toggleThumbNavVisible()
		$.fn.initGallerySlider.togglePicNavVisible()
    };
   
    $.fn.initGallerySlider.toggleThumbAnimate = function(con) {
        if(con) {
            if(curPage < maxPage){
				curPage++;
			}
        } else {
            if(curPage > 1){
				curPage--;
			}
        }
		$.fn.initGallerySlider.toggleThumbNavVisible()
		$.fn.initGallerySlider.toggleThumbAnimateTo(curPage)
    }
	
	$.fn.initGallerySlider.toggleThumbAnimateTo = function(con) {
        $(slider).find('.galleryList ul').animate({left: -(thumbWidth * (con-1))}, 500);
    }
	
	$.fn.initGallerySlider.toggleThumbPresent = function(con) {
		var startThumb,endThumb=0
		for(var i=1;i<=maxPage;i++){
			startThumb=(maxThumb*(i-1))
			endThumb=(maxThumb*i)
			if(curThumb>=startThumb&&curThumb<endThumb){
				if(curPage!=i){
					curPage=i;
					i=maxPage;
					$.fn.initGallerySlider.toggleThumbAnimateTo(curPage);
				}
			}	
		}
    }
	
	$.fn.initGallerySlider.toggleThumbNavVisible = function() {
       if(curPage==1){
			$(slider).find('.thumbHolder .leftArrow').css('visibility','hidden')
		}else{
			$(slider).find('.thumbHolder .leftArrow').css('visibility','visible')
		}
		if(curPage==maxPage){
			$(slider).find('.thumbHolder .rightArrow').css('visibility','hidden')
		}else{
			$(slider).find('.thumbHolder .rightArrow').css('visibility','visible')
		}
    }
	
	$.fn.initGallerySlider.toggleMainPic = function(con) {
		if(con) {
            if(curThumb<totalThumbs-1){
				curThumb++;
			}
        } else {
            if(curThumb>0){
				curThumb--;
			}
        }
		$.fn.initGallerySlider.togglePicNavVisible()
       $.fn.initGallerySlider.loadThumbPic($(slider).find('.galleryList li').eq(curThumb).find('img').attr('rel'));
    }
	
	$.fn.initGallerySlider.togglePicNavVisible = function() {
       if(curThumb==0){
			$(slider).find('.mainHolder .leftArrow').css('visibility','hidden')
		}else{
			$(slider).find('.mainHolder .leftArrow').css('visibility','visible')
		}
		if(curThumb==totalThumbs-1){
			$(slider).find('.mainHolder .rightArrow').css('visibility','hidden')
		}else{
			$(slider).find('.mainHolder .rightArrow').css('visibility','visible')
		}
    }
	
	$.fn.initGallerySlider.loadThumbPic = function(con) {
		$(slider).find('.galleryList li').each(function(){
			$(this).removeClass('selected')
		});
		$(slider).find('.galleryList li').eq(curThumb).addClass('selected')
		
        $(slider).find('.mainHolder').find('img').attr('src', con)
		if(autothumb){
			$.fn.initGallerySlider.toggleThumbPresent()
		}
		$.fn.initGallerySlider.togglePicNavVisible()
		$.fn.initGallerySlider.toggleThumbNavVisible()
    }
})(jQuery);