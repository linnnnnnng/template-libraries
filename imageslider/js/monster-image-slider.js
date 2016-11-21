/*
 * Monster Image Slider
 *
 * Copyright (c) 2016 Ling (2016/11/21)
 *
 */
(function($) {
   var pluginName='monsterImageSlider',
		defaults={
			autoShowControl:false,
			autoShowLeftRight:false,
			timer:0,
			slideWidth:1,
			slideInnerWidth:1,
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
			interval:null,
			draggable:false,
			dragX:0,
			dragOriX:0,
			dragDirection:''
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
			_opts.slideInnerWidth=_self.outerWidth()*_self.find(_opts.controlHolder+' li').length;
			_self.find(_opts.imageHolder+' ul').css('width', _opts.slideInnerWidth);
			_self.find(_opts.controlHolder+' li').each(function(){
				$(this).click(function(e){
					$.fn[pluginName].toggleAnimateTo(_self,$(this).index()+1);
					$.fn[pluginName].callbackImageSlider(_self,'goSlide');
				});
			});
			
			if ( _opts.draggable ) { 
				_self.find(_opts.imageHolder+' ul').draggable({axis:"x",
				start: function() {
					var posX = parseInt(_self.find(_opts.imageHolder+' ul').css('left'));
					_opts.dragOriX = posX;
				},
				drag: function() {
					var posX = parseInt(_self.find(_opts.imageHolder+' ul').css('left'));
					_opts.dragDirection = (_opts.dragOriX > posX) ? 'left' : 'right';
					if(posX > 0){
						_self.find(_opts.imageHolder+' ul').css('left', 0);
						return false;
					}else if(posX < -(_opts.slideInnerWidth - _opts.slideWidth)){
						_self.find(_opts.imageHolder+' ul').css('left', -(_opts.slideInnerWidth - _opts.slideWidth));
						return false;
					}
				},
				stop: function() {
					var curX = parseInt(_self.find(_opts.imageHolder+' ul').css('left'));
					curX = Math.abs(curX);
					var switchArea = _opts.slideWidth/100 * 30;
					var curSlide = -1;
					var startX;
					
					_self.find(_opts.controlHolder+' li').each(function(index, element) {
						if(_opts.dragDirection == 'left'){
							startX = ((index+1) * _opts.slideWidth/2);
							if(index > 0){
								startX = ((index) * _opts.slideWidth)+(_opts.slideWidth/2);
							}
							startX -= switchArea;
							if(curX <= startX){
								if(curSlide == -1){
									curSlide = index;
									$.fn[pluginName].toggleAnimateTo(_self, index+1);
								}
							}
						}else{
							startX = ((index+1) * _opts.slideWidth/2);
							if(index > 0){
								startX = ((index) * _opts.slideWidth);
								startX += _opts.slideWidth/2;
							}
							startX += switchArea;
							if(curX <= startX){
								if(curSlide == -1){
									curSlide = index;
									$.fn[pluginName].toggleAnimateTo(_self, index+1);
								}
							}		
						}
					});
				}});	
			}
			
			if(_opts.autoShowControl){
				_self.find(_opts.controlHolder).hide();
				_self.mouseenter(function() {
					_self.find(_opts.controlHolder).fadeIn()
				}).mouseleave(function() {
					_self.find(_opts.controlHolder).fadeOut();
				});
			}
			
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
			_opts.selectSlide = con;
			_self.find(_opts.controlHolder+' li').each(function(){
				$(this).removeClass(_opts.selectedClass)
			});
			_self.find(_opts.controlHolder+' li').eq(con-1).addClass(_opts.selectedClass);
			_self.find(_opts.imageHolder+' ul').stop().animate({left: -(_opts.slideWidth * (con-1))}, 500);
			$.fn[pluginName].callbackImageSlider(_self,'update');
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
			}else{
				clearInterval(_opts.interval);	
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
				if ( _opts.draggable ) { 
					_self.find(_opts.imageHolder+' ul').draggable( "destroy" );
				}
				clearInterval(_opts.interval);
			}
			_self.removeData('plugin_' + pluginName);
		});
    }
})(jQuery);