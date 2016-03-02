/*
 * Monster Image Slider
 *
 * Copyright (c) 2013 Ling
 *
 */
(function($) {
   var pluginName='monsterImageSlider',
		defaults={
			autoShowControl:false,
			autoShowLeftRight:false,
			timer:3000,
			slideWidth:1,
			slideHeight:1,
			totalSlides:1,
			selectSlide:1,
			callback:'',
			imageHolder:".imageList",
			controlHolder:'.imageControl',
			navHolder:'.nav',
			navLeftHolder:'.leftArrow',
			navRightHolder:'.rightArrow',
			selectedClass:'selected',
			interval:null
        },
		m=0,_class;
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			$.fn[pluginName].commandImageSlider(this, options,value,value2)
		}else{
			return this.each(function () {
				var $this=$(this);
				$.fn[pluginName].destroy($this);
				
				var _opts=$.extend({},defaults,options);
				$this.data('plugin_' + pluginName, _opts);
				$.fn[pluginName].constructImgSlider($this);
				$.fn[pluginName].callbackImageSlider($this,'init');
			});
		}
    };
	
	$.fn[pluginName].constructImgSlider=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			_opts.slideWidth=$(this).find(_opts.imageHolder).width();
			_opts.slideHeight=$(this).find(_opts.imageHolder).height();
			_opts.totalSlides = $(this).find(_opts.imageHolder+" li").length;
			_self.find(_opts.controlHolder+' li').remove();
			for(m=0;m<_opts.totalSlides;m++){
				_self.find(_opts.controlHolder+' ul').append('<li></li>');
			}
			//_self.find(_opts.controlHolder).css('margin-left',(_self.width()/2)-(_self.find(_opts.controlHolder).width()/2));
			//_self.find(_opts.controlHolder).css('margin-top',_self.height()-(_self.find(_opts.controlHolder).height()+20));
			_self.find(_opts.controlHolder+' li').each(function(){
				$(this).click(function(e){
					$.fn[pluginName].toggleAnimateTo(_self,$(this).index()+1)
					$.fn[pluginName].callbackImageSlider(_self,'goSlide');
				});
			});
			if(_opts.autoShowControl){
				_self.find(_opts.controlHolder).hide();
				_self.mouseenter(function() {
					_self.find(_opts.controlHolder).fadeIn()
				}).mouseleave(function() {
					_self.find(_opts.controlHolder).fadeOut();
				});
			}
			//_self.find(_opts.navHolder+' '+_opts.navLeftHolder).css('left',10);
			//_self.find(_opts.navHolder+' '+_opts.navRightHolder).css('left',(_opts.slideWidth)-(_self.find(_opts.navHolder+' '+_opts.navRightHolder).find('a').width()+10));
			//_self.find(_opts.navHolder+' '+_opts.navLeftHolder).css('top',(_opts.slideHeight/2)-(_self.find(_opts.navHolder+' '+_opts.navLeftHolder).find('a').height()/2));
			//_self.find(_opts.navHolder+' '+_opts.navRightHolder).css('top',(_opts.slideHeight/2)-(_self.find(_opts.navHolder+' '+_opts.navRightHolder).find('a').height()/2));
			_self.find(_opts.navHolder+' '+_opts.navRightHolder).unbind("click");
			_self.find(_opts.navHolder+' '+_opts.navRightHolder).click(function(e){
				$.fn[pluginName].toggleDirection(_self,true)
				$.fn[pluginName].callbackImageSlider(_self,'nextSlide');
			});
			_self.find(_opts.navHolder+' '+_opts.navLeftHolder).unbind("click");
			_self.find(_opts.navHolder+' '+_opts.navLeftHolder).click(function(){
				$.fn[pluginName].toggleDirection(_self,false)
				$.fn[pluginName].callbackImageSlider(_self,'prevSlide');
			});
			if(_opts.autoShowLeftRight){
				_self.find(_opts.navHolder).hide();
				_self.mouseenter(function() {
					_self.find(_opts.navHolder).fadeIn()
				}).mouseleave(function() {
					_self.find(_opts.navHolder).fadeOut();
				});
			}
			$.fn[pluginName].toggleAnimateTo(_self, _opts.selectSlide);
			$.fn[pluginName].autoAnimateSlide(_self);
		});
	}
	$.fn[pluginName].addEvent=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(con) {
				_opts.selectSlide=_opts.selectSlide<_opts.totalSlides?_opts.selectSlide+1:1;
			} else {
				_opts.selectSlide=_opts.selectSlide>1?_opts.selectSlide-1:_opts.totalSlides;
			}
			$.fn[pluginName].toggleAnimateTo(_self,_opts.selectSlide);
		});
    }
	$.fn[pluginName].toggleDirection=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(con) {
				_opts.selectSlide=_opts.selectSlide<_opts.totalSlides?_opts.selectSlide+1:1;
			} else {
				_opts.selectSlide=_opts.selectSlide>1?_opts.selectSlide-1:_opts.totalSlides;
			}
			$.fn[pluginName].toggleAnimateTo(_self,_opts.selectSlide);
		});
    }
	
	$.fn[pluginName].toggleAnimateTo=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			$.fn[pluginName].autoAnimateSlide(_self);
			_self.find(_opts.controlHolder+' li').each(function(){
				$(this).removeClass(_opts.selectedClass)
			});
			_self.find(_opts.controlHolder+' li').eq(con-1).addClass(_opts.selectedClass)
			_self.find(_opts.imageHolder+' ul').stop().animate({left: -(_opts.slideWidth * (con-1))}, 500);
		})
    }
	$.fn[pluginName].autoAnimateSlide=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts.timer!=0) {
				clearInterval(_opts.interval);
				_opts.interval=setInterval(function(){
					  $.fn[pluginName].toggleDirection(_self,true);
				},_opts.timer);
			}
		})
    }
	$.fn[pluginName].callbackImageSlider=function(obj,command) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			if($.isFunction(_opts.callback)){
				var returnData={
					command:command,
					selectSlide:_opts.selectSlide,
					totalSlides:_opts.totalSlides
				}
				_opts.callback(returnData);
			}
		});
    }
	$.fn[pluginName].commandImageSlider=function(obj,command,value,value2){
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			switch(command) {
				case 'destroy':
					$.fn[pluginName].destroy(_self);
					break;
				case 'nextSlide':
					$.fn[pluginName].toggleDirection(_self, true);
					break;
				case 'prevSlide':
					$.fn[pluginName].toggleDirection(_self, false);
					break;
				case 'goSlide':
					$.fn[pluginName].toggleAnimateTo(_self, value);
					break;
				default:
					if(_opts[value]!=undefined){
						_opts[value]=value2;
						$.fn[pluginName].constructImgSlider(_self);
					}
			}
		});
	}
	
	$.fn[pluginName].destroy=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts!=undefined){
				_self.find(_opts.controlHolder+' li').each(function(){
					$(this).unbind();
				});
				_self.find(_opts.navHolder+' '+_opts.navRightHolder).unbind("click");
				_self.find(_opts.navHolder+' '+_opts.navLeftHolder).unbind("click");
				clearInterval(_opts.interval);
			}
			_self.removeData('plugin_' + pluginName);
		});
    }
})(jQuery);