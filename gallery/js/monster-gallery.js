/*
 * Monster Gallery
 *
 * Copyright (c) 2013 Ling
 *
 */
 (function($) {
	var pluginName='monsterGallery',
		defaults={
			thumbPath:'',
			imagePath:'',
			selectThumb:1,
			totalThumbs:10,
			display:15,
			selectPage:1,
			totalPages:1,
			batch:false,
			galleryListHolder:'.galleryList',
			controlHolder:'.pageControl',
			controlPrev:'.btnPrev',
			controlNext:'.btnNext',
			overlayHolder:'.galleryOverlay',
			overlayImgHolder:'.mainImage',
			overlayPrev:'.btnPrev',
			overlayNext:'.btnNext',
			overlayClose:'.btnClose',
			callback:''
        },m,sp,ep=0;
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			var $this=$(this);
			var _opts=$this.data('plugin_'+pluginName);
			if(_opts!=undefined)
				commandGallery(this,options,value,value2)
		}else{
			return this.each(function () {
				var $this=$(this);
				_opts=$.extend({},defaults,options);
				$this.data('plugin_'+pluginName,_opts);
				$.fn[pluginName].constructGallery($this);
				$.fn[pluginName].callbackGallery($this,'init');
			});
		}
	}
	
	$.fn[pluginName].constructGallery=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var _target=''
			$.fn[pluginName].constructGalleryList(_self);
			if(_opts.batch==false)
				_opts.totalThumbs=_self.find(_opts.galleryListHolder+' li').length;
			_opts.totalPages=_opts.totalThumbs>_opts.display?Math.ceil(_opts.totalThumbs/_opts.display):1;
			_self.find(_opts.galleryListHolder+' li').each(function( index ) {
				$(this).unbind("click");
				$(this).click(function() {
					$.fn[pluginName].loadThumb(_self, $(this).index()+1);
					$.fn[pluginName].callbackGallery(_self,'openImage');
				})
			});
			_target=_self.find(_opts.controlHolder+' '+_opts.controlPrev)
			if(cE(_target))
				_target.unbind("click");
				_target.click(function() {
					$.fn[pluginName].activeGallery(_self, 'gallery', false);
					$.fn[pluginName].callbackGallery(_self,'prevPage');
				})
			_target=_self.find(_opts.controlHolder+' '+_opts.controlNext)
			if(cE(_target))
				_target.unbind("click");
				_target.click(function() {
					$.fn[pluginName].activeGallery(_self,'gallery',true);
					$.fn[pluginName].callbackGallery(_self,'nextPage');
				})
			_target=_self.find(_opts.overlayHolder+' '+_opts.overlayPrev)
			if(!cE(_target))
				_target=$(_opts.overlayHolder+' '+_opts.overlayPrev)
			if(cE(_target))
				_target.unbind("click");
				_target.click(function() {
					$.fn[pluginName].activeGallery(_self,'overlay',false);
					$.fn[pluginName].callbackGallery(_self,'prevImage');
				})
			_target=_self.find(_opts.overlayHolder+' '+_opts.overlayNext)
			if(!cE(_target))
				_target=$(_opts.overlayHolder+' '+_opts.overlayNext)
			if(cE(_target))
				_target.unbind("click");
				_target.click(function() {
					$.fn[pluginName].activeGallery(_self,'overlay',true);
					$.fn[pluginName].callbackGallery(_self,'nextImage');
				})
			_target=_self.find(_opts.overlayHolder+' '+_opts.overlayClose)
			if(!cE(_target))
				_target=$(_opts.overlayHolder+' '+_opts.overlayClose)
			if(cE(_target))
				_target.unbind("click");
				_target.click(function() {
					$.fn[pluginName].toggleOverlay(_self,false);
					$.fn[pluginName].callbackGallery(_self,'closeImage');
				})
			$.fn[pluginName].toggleControlVisible(_self);
			$.fn[pluginName].goPage(_self);
		});
	}
	$.fn[pluginName].constructGalleryList=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var rebuild=true;
			if(_opts.thumbPath!=''){
				if(_opts.batch){
					_self.find(_opts.galleryListHolder+' li').remove();
					sp=_opts.display*(_opts.selectPage-1)+1;
					ep=_opts.display*(_opts.selectPage);
					ep=ep>_opts.totalThumbs?_opts.totalThumbs:ep;
					for(m=sp;m<=ep;m++){
						_self.find(_opts.galleryListHolder+' ul').append('<li><img rel="'+_opts.imagePath.replace('[X]', m)+'" src="' + _opts.thumbPath.replace('[X]', m) + '" /></li>')
					}
				}else{
					_self.find(_opts.galleryListHolder+' li').remove();
					for(m=1;m<=_opts.totalThumbs;m++){
						_self.find(_opts.galleryListHolder+' ul').append('<li><img rel="'+_opts.imagePath.replace('[X]', m)+'" src="' + _opts.thumbPath.replace('[X]', m) + '" /></li>')
					}	
				}
			}
		});
	}
	$.fn[pluginName].activeGallery=function(obj,cas,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			var command=''
			if(cas=='gallery'){
				if(con){
					command='nextPage'
					_opts.selectPage++
					_opts.selectPage=_opts.selectPage>_opts.totalPages?_opts.totalPages:_opts.selectPage;
				}else{
					command='prevPage'
					_opts.selectPage--
					_opts.selectPage=_opts.selectPage<1?1:_opts.selectPage;
				}
				$.fn[pluginName].constructGalleryList(_self);
				$.fn[pluginName].goPage(_self);
			}else if(cas=='overlay'){
				if(con){
					command='nextImage'
					_opts.selectThumb++
					_opts.selectThumb=_opts.selectThumb>_opts.totalThumbs?_opts.totalThumbs:_opts.selectThumb;
				}else{
					command='prevImage'
					_opts.selectThumb--
					_opts.selectThumb=_opts.selectThumb<1?1:_opts.selectThumb;
				}
				$.fn[pluginName].loadThumb(_self, _opts.selectThumb);
			}
			$.fn[pluginName].toggleControlVisible(_self);
		});
	}
	$.fn[pluginName].goPage=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts.batch==false)
				_self.find(_opts.galleryListHolder+' ul').css('top',-(_self.find(_opts.galleryListHolder).height() * (_opts.selectPage-1)));
		});
	}
	$.fn[pluginName].toggleControlVisible=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var _target=_self.find(_opts.overlayHolder+' '+_opts.overlayPrev)
			if(!cE(_target))
				_target=$(_opts.overlayHolder+' '+_opts.overlayPrev)
			if(cE(_target))
				if(_opts.selectThumb==1){
					_target.addClass('disabled')
				}else{
					_target.removeClass('disabled')
				}
			_target=_self.find(_opts.overlayHolder+' '+_opts.overlayNext)
			if(!cE(_target))
				_target=$(_opts.overlayHolder+' '+_opts.overlayNext)
			if(cE(_target))
				if(_opts.selectThumb==_opts.totalThumbs){
					_target.addClass('disabled')
				}else{
					_target.removeClass('disabled')
				}
			_target=_self.find(_opts.controlHolder+' '+_opts.controlPrev)
			if(cE(_target))
				if(_opts.selectPage==1){
					_target.addClass('disabled')
				}else{
					_target.removeClass('disabled')
				}
			_target=_self.find(_opts.controlHolder+' '+_opts.controlNext)
			if(cE(_target))
				if(_opts.selectPage==_opts.totalPages){
					_target.addClass('disabled')
				}else{
					_target.removeClass('disabled')
				}
		});
	}
	
	$.fn[pluginName].loadThumb=function(obj,p) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var _target=_self.find(_opts.overlayHolder+' '+_opts.overlayImgHolder)
			if(!cE(_target))
				_target=$(_opts.overlayHolder+' '+_opts.overlayImgHolder)
			if(cE(_target)){
				_target.empty();
				$('<img />')
					.attr('src', _self.find(_opts.galleryListHolder+' li').eq(p-1).find('img').attr('rel'))
					.load(function(){
						_target.append($(this));
				});
			}
			_opts.selectThumb=p
			$.fn[pluginName].toggleOverlay(_self, true);
			$.fn[pluginName].toggleControlVisible(_self)
		});
	}
	
	$.fn[pluginName].toggleOverlay=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var _target=_self.find(_opts.overlayHolder)
			if(!cE(_target))
				_target=$(_opts.overlayHolder)
			if(cE(_target))
				if(con){
					_target.fadeIn('fast');
				}else{
					_target.fadeOut('fast');	
				}
		});
	}
	$.fn[pluginName].callbackGallery=function(obj,command,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			con=con==undefined?true:con
			if($.isFunction(_opts.callback)&&con){
				var returnData=_opts
				returnData.command=command
				_opts.callback(returnData);
			}
		});
    }
	function cE(t){
		return t.length==0?false:true
	}
	function commandGallery(obj,command,value,value2){
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			switch(command) {
				case 'nextPage':
					$.fn[pluginName].activeGallery(_self,'gallery',true);
					break;
				case 'prevPage':
					$.fn[pluginName].activeGallery(_self,'gallery',false);
					break;
				case 'nextImage':
					$.fn[pluginName].activeGallery(_self,'overlay',true);
					break;
				case 'prevImage':
					$.fn[pluginName].activeGallery(_self,'overlay',false);
					break;
				case 'openImage':
					$.fn[pluginName].loadThumb(_self,value);
					break;
				case 'closeImage':
					$.fn[pluginName].toggleOverlay(_self,false);
					break;
				default:
					if(_opts[value]!=undefined){
						_opts[value]=value2;
						$.fn[pluginName].constructGallery(_self);
					}
			}
		});
	}
})(jQuery);