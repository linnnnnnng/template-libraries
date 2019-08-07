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
			duration:500,
			slideWidth:1,
			slideInnerWidth:1,
			slideHeight:1,
			totalSlides:1,
			selectSlide:1,
			prevSlide:1,
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
			dragDirection:'',
			dragDistance:0,
			control:false
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
			_self.find(_opts.imageHolder+' li.slide_content').each(function(index){
				$(this).attr('data-slider-order', index);
			});
			_self.find(_opts.controlHolder+' li').each(function(){
				$(this).click(function(e){
					if(!_opts.control)
						return;
					
					$.fn[pluginName].jumpTo(_self,$(this).index()+1);
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
					$.fn[pluginName].autoAnimateSlide(_self);
					
					var posX = parseInt(_self.find(_opts.imageHolder+' ul').css('left'));
					_opts.dragDirection = (_opts.dragOriX > posX) ? 'right' : 'left';
					
					if(posX < -(_opts.slideWidth*2)){
						_self.find(_opts.imageHolder+' ul').css('left', -(_opts.slideWidth*2));
						return false;
					}else if(posX >0 ){
						_self.find(_opts.imageHolder+' ul').css('left', 0);
						return false;
					}
				},
				stop: function() {
					var curX = parseInt(_self.find(_opts.imageHolder+' ul').css('left'));
					curX = Math.abs(curX);
					
					var switchArea = _opts.slideWidth/100 * 10;
					var dragDistance = curX - _opts.slideWidth;
					
					if(Math.abs(dragDistance) > switchArea){
						_opts.dragDistance = dragDistance;
						
						if(_opts.dragDirection == 'left'){
							$.fn[pluginName].toggleDirection(_self,false);
						}else{
							$.fn[pluginName].toggleDirection(_self,true);
						}
					}else{
						$.fn[pluginName].toggleAnimateTo(_self, _opts.selectSlide);	
					}
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
				if(!_opts.control)
						return;
						
				$.fn[pluginName].toggleDirection(_self,true)
				$.fn[pluginName].callbackImageSlider(_self,'nextSlide');
			});
			_self.find(_opts.navHolder+' '+_opts.navLeftHolder).unbind("click");
			_self.find(_opts.navHolder+' '+_opts.navLeftHolder).click(function(){
				if(!_opts.control)
						return;
						
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
			
			$.fn[pluginName].swapSlide(_self,true);
			_self.find(_opts.imageHolder+' ul').css('left', -_opts.slideWidth);
			
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
			_opts.control = false;
			
			var slideDirection = '';
			
			if(_opts.prevSlide != _opts.selectSlide){
				if(_opts.prevSlide == _opts.totalSlides && _opts.selectSlide == 1){
					slideDirection = 'right';	
				}else if(_opts.prevSlide == 1 && _opts.selectSlide == _opts.totalSlides){
					slideDirection = 'left';	
				}else{
					slideDirection = _opts.prevSlide < _opts.selectSlide ? 'right' : 'left';
				}
			}
			_opts.selectSlide = _opts.prevSlide = con;
			_self.find(_opts.controlHolder+' li').each(function(){
				$(this).removeClass(_opts.selectedClass);
			});
			_self.find(_opts.controlHolder+' li').eq(con-1).addClass(_opts.selectedClass);
			
			if(slideDirection == 'right'){
				$.fn[pluginName].swapSlide(_self,false);
				_self.find(_opts.imageHolder+' ul').css('left', -_opts.dragDistance);
			}else if(slideDirection == 'left'){
				$.fn[pluginName].swapSlide(_self,true);
				_self.find(_opts.imageHolder+' ul').css('left', (-(_opts.slideWidth*2))-_opts.dragDistance);
			}
			
			_opts.dragDistance = 0;
			_self.find(_opts.imageHolder+' ul').stop().animate({left:-_opts.slideWidth}, _opts.duration, function() {
				_opts.control = true;
			});
			
			$.fn[pluginName].callbackImageSlider(_self,'update');
		})
    }
	
	$.fn[pluginName].jumpTo=function(obj,index) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			$.fn[pluginName].autoAnimateSlide(_self);
			_opts.control = false;
			
			$.fn[pluginName].sortSlide(_self);
			_self.find(_opts.imageHolder+' ul').css('left', -(_opts.slideWidth * (_opts.selectSlide-1)));
			
			_self.find(_opts.controlHolder+' li').each(function(){
				$(this).removeClass(_opts.selectedClass);
			});
			_self.find(_opts.controlHolder+' li').eq(index-1).addClass(_opts.selectedClass);
			_opts.selectSlide = _opts.prevSlide = index;
			
			_self.find(_opts.imageHolder+' ul').stop().animate({left:-(_opts.slideWidth * (index-1))}, _opts.duration, function() {
				for(var n=0; n<(_opts.totalSlides - index)+2; n++){
					$.fn[pluginName].swapSlide(_self,true);	
				}
				_self.find(_opts.imageHolder+' ul').css('left', -_opts.slideWidth);
				_opts.control = true;
			});
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
	
	$.fn[pluginName].swapSlide=function(obj, con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			if(con){
				_self.find(_opts.imageHolder+" li.slide_content:eq(0)").before(_self.find(_opts.imageHolder+" li.slide_content:eq("+(_opts.totalSlides-1)+")"));
			}else{
				_self.find(_opts.imageHolder+" li.slide_content:eq("+(_opts.totalSlides-1)+")").after(_self.find(_opts.imageHolder+" li.slide_content:eq(0)"));
			}
		})
    }
	
	$.fn[pluginName].sortSlide=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			var $articles = _self.find(_opts.imageHolder+' li.slide_content');
			[].sort.call($articles, function(a,b) {
				return +$(a).attr('data-slider-order') - +$(b).attr('data-slider-order');
			});
			$articles.each(function(){
				_self.find(_opts.imageHolder+' ul').append(this);
			});
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
					$.fn[pluginName].jumpTo(_self, value);
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
				$.fn[pluginName].sortSlide(_self);
				_self.find(_opts.imageHolder+' ul').removeAttr("style");
			
				_self.find(_opts.imageHolder+' li.slide_content').each(function(index){
					$(this).removeAttr('data-slider-order');
				});
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