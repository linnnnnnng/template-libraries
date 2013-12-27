/*
 * Monster Gallery Slider
 *
 * Copyright (c) 2013 Ling
 *
 */
 (function($) {
	var pluginName='monsterGallerySlider',
		defaults={
			selectThumb:1,
			totalThumbs:5,
			display:4,
			autoShowLeftRight:false,
			thumbWidth:0,
			selectPage:1,
			totalThumbPages:2,
			timer:0,
			callback:'',
			galleryHolder:'.galleryList',
			controlHolder:'.nav',
			controlLeftHolder:'.leftArrow',
			controlRightHolder:'.rightArrow',
			mainHolder:'.mainHolder',
			imgHolder:'.imgHolder',
			thumbHolder:'.thumbHolder',
			thumbLeftHolder:'.leftArrow',
			thumbRightHolder:'.rightArrow',
			selectedClass:'selected',
			oldThumbPage:1
        },
		m,sp,ep=0,_time;
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			commandGallerySlider(this, options,value,value2)
		}else{
			return this.each(function () {
				var $this=$(this);
				var _opts=$.extend({},defaults,options);
				$this.data('plugin_'+pluginName,_opts);
				$.fn[pluginName].constructGallerySlider($this);
				$.fn[pluginName].callbackGallerySlider($this,'init');
			});
		}
	}
	
	$.fn[pluginName].constructGallerySlider=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			_opts.totalThumbs=_self.find(_opts.galleryHolder+" li").length;
			_opts.thumbWidth=_self.find(_opts.galleryHolder).width();
			_opts.display=Math.floor(_opts.thumbWidth/_self.find(_opts.galleryHolder+" li").width());
			_opts.oldThumbPage=_opts.selectPage
			_opts.selectPage=1;
			_opts.totalThumbPages=_opts.totalThumbs>_opts.display?Math.ceil(_opts.totalThumbs/_opts.display):1;
			//_self.find(_opts.controlHolder+' '+_opts.controlLeftHolder).css('left',10);
			//_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).css('left',(_self.find(_opts.mainHolder).width())-(_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).width()+10));
			//_self.find(_opts.controlHolder+' '+_opts.controlLeftHolder).css('top',(_self.find(_opts.mainHolder).height()/2)-(_self.find(_opts.controlHolder+' '+_opts.controlLeftHolder).height()/2));
			//_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).css('top',(_self.find(_opts.mainHolder).height()/2)-(_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).height()/2));
			
			if(_opts.autoShowLeftRight){
				_self.find(_opts.controlHolder).hide();
				_self.find(_opts.mainHolder).mouseenter(function() {
					_self.find(_opts.controlHolder).fadeIn()
				}).mouseleave(function() {
					_self.find(_opts.controlHolder).fadeOut();
				});
			}
			
			_self.find(_opts.thumbHolder+' '+_opts.thumbRightHolder).unbind("click");
			_self.find(_opts.thumbHolder+' '+_opts.thumbRightHolder).click(function(){
				$.fn[pluginName].activeGallerySlider(_self,'thumb',true)
				$.fn[pluginName].callbackGallerySlider($this,'nextThumb');
			});
			_self.find(_opts.thumbHolder+' '+_opts.thumbLeftHolder).unbind("click");
			_self.find(_opts.thumbHolder+' '+_opts.thumbLeftHolder).click(function(){
				$.fn[pluginName].activeGallerySlider(_self,'thumb',false)
				$.fn[pluginName].callbackGallerySlider($this,'prevThumb');
			});
			_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).unbind("click");
			_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).click(function(){
				$.fn[pluginName].activeGallerySlider(_self,'main',true)
				$.fn[pluginName].callbackGallerySlider($this,'nextSlide');
			});
			_self.find(_opts.controlHolder+' '+_opts.controlLeftHolder).unbind("click");
			_self.find(_opts.controlHolder+' '+_opts.controlLeftHolder).click(function(){
				$.fn[pluginName].activeGallerySlider(_self,'main',false)
				$.fn[pluginName].callbackGallerySlider($this,'prevSlide');
			});
			m=0;
			_self.find(_opts.galleryHolder+' li').each(function(){
				if(m==0){
					$.fn[pluginName].loadSliderImage(_self)
				}
				$(this).unbind("click");
				$(this).click(function() {
					_opts.selectThumb=$(this).index()+1;
					$.fn[pluginName].loadSliderImage(_self)
					$.fn[pluginName].callbackGallerySlider($this,'goSlide');
				});
				m++
			});
			$.fn[pluginName].toggleVisible(_self);
			$.fn[pluginName].autoAnimateSlide(_self);
		});
	}
	
	$.fn[pluginName].activeGallerySlider=function(obj,e,c) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(e=="main"){
				if(c) {
					if(_opts.selectThumb<_opts.totalThumbs){
						_opts.selectThumb++;
					}
				} else {
					if(_opts.selectThumb>1){
						_opts.selectThumb--;
					}
				}
				$.fn[pluginName].loadSliderImage(_self)
			}else if(e=="automain"){
				if(c) {
					_opts.selectThumb++;
					_opts.selectThumb=_opts.selectThumb>_opts.totalThumbs?1:_opts.selectThumb
				} else {
					_opts.selectThumb--;
					_opts.selectThumb=_opts.selectThumb<1?_opts.totalThumbs:_opts.selectThumb
				}
				$.fn[pluginName].loadSliderImage(_self)
			}else if(e=="thumb"){
				if(c) {
					if(_opts.selectPage<_opts.totalThumbPages){
						_opts.selectPage++;
					}
				} else {
					if(_opts.selectPage>1){
						_opts.selectPage--;
					}
				}
				$.fn[pluginName].toggleThumbAnimate(_self)
			}
			$.fn[pluginName].toggleVisible(_self)
		});
	}
	$.fn[pluginName].toggleVisible=function(obj,e,c) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts.selectPage==1){
				_self.find(_opts.thumbHolder+' '+_opts.thumbLeftHolder).css('visibility','hidden')
			}else{
				_self.find(_opts.thumbHolder+' '+_opts.thumbLeftHolder).css('visibility','visible')
			}
			if(_opts.selectPage==_opts.totalThumbPages){
				_self.find(_opts.thumbHolder+' '+_opts.thumbRightHolder).css('visibility','hidden')
			}else{
				_self.find(_opts.thumbHolder+' '+_opts.thumbRightHolder).css('visibility','visible')
			}
			
			if(_opts.selectThumb==1){
				_self.find(_opts.controlHolder+' '+_opts.controlLeftHolder).css('visibility','hidden')
			}else{
				_self.find(_opts.controlHolder+' '+_opts.controlLeftHolder).css('visibility','visible')
			}
			if(_opts.selectThumb==_opts.totalThumbs){
				_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).css('visibility','hidden')
			}else{
				_self.find(_opts.controlHolder+' '+_opts.controlRightHolder).css('visibility','visible')
			}
		});
	}
	$.fn[pluginName].toggleThumbAnimate=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts.oldThumbPage!=_opts.selectPage){
				_opts.oldThumbPage=_opts.selectPage	
				_self.find(_opts.galleryHolder+' ul').stop().animate({left: -(_opts.thumbWidth * (_opts.selectPage-1))}, 500);
			}
		});
    }
	$.fn[pluginName].presentThumb=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			sp,ep=0
			for(m=1;m<=_opts.totalThumbPages;m++){
				sp=(_opts.display*(m-1))
				ep=(_opts.display*m)
				if(_opts.selectThumb>sp&&_opts.selectThumb<=ep){
					if(_opts.selectPage!=m){
						_opts.selectPage=m;
						m=_opts.totalThumbPages;
					}
				}	
			}
			$.fn[pluginName].toggleThumbAnimate(_self)
		});
    }
	$.fn[pluginName].loadSliderImage=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			_self.find(_opts.galleryHolder+' li').each(function(){
				$(this).removeClass(_opts.selectedClass)
			});
			$.fn[pluginName].presentThumb(_self)
			var target=_self.find(_opts.galleryHolder+' li').eq(_opts.selectThumb-1)
			target.addClass(_opts.selectedClass)
			_self.find(_opts.mainHolder).find(_opts.imgHolder+' img').attr('src', target.find('img').attr('rel'));
			$.fn[pluginName].autoAnimateSlide(_self);
			$.fn[pluginName].toggleVisible(_self);
		});
    }
	$.fn[pluginName].autoAnimateSlide=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts.timer!=0) {
				//alert('start')
				clearTimeout(_time);
				_time=setTimeout(function(){
					  $.fn[pluginName].activeGallerySlider(_self,'automain',true);
				},_opts.timer);
			}
		})
    }
	$.fn[pluginName].callbackGallerySlider=function(obj,command) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			if($.isFunction(_opts.callback)){
				var returnData={
					command:command,
					curSlide:_opts.curSlide,
					totalSlide:_opts.totalSlide
				}
				_opts.callback(returnData);
			}
		});
    }
	function commandGallerySlider(obj,command,value,value2){
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			switch(command) {
				case 'nextSlide':
					$.fn[pluginName].activeGallerySlider(_self,'main',true)
					break;
				case 'prevSlide':
					$.fn[pluginName].activeGallerySlider(_self,'main',false)
					break;
				case 'nextThumb':
					$.fn[pluginName].activeGallerySlider(_self,'thumb',true)
					break;
				case 'prevThumb':
					$.fn[pluginName].activeGallerySlider(_self,'thumb',false)
					break;
				case 'goSlide':
					_opts.selectThumb=value
					$.fn[pluginName].loadSliderImage(_self)
					break;
				default:
					if(_opts[value]!=undefined){
						_opts[value]=value2;
						$.fn[pluginName].constructGallerySlider(_self);
					}
			}
		});
	}
})(jQuery);