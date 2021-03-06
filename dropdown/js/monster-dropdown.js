/*
 * Monster Dropdown
 *
 * Copyright (c) 2016 Ling (2018/8/9)
 *
 */
 (function($) {
	var pluginName='monsterDropdown',
		defaults={
			display:'auto',
			height:0,
			index:0,
			autoHighlight:true,
			callback:''
        },
		m=0,
		c=0;
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			var $this=$(this);
			var _opts=$this.data('plugin_'+pluginName);
			if(_opts!=undefined)
				$.fn[pluginName].commandDropdown(this,options,value,value2)
		}else{
			return this.each(function () {
				var _self=$(this);
				$.fn[pluginName].destroy(_self);
				defaults.index=c;
				c++;
				var _opts=$.extend({},defaults,options);
				_self.data('plugin_' + pluginName, _opts);
				$.fn[pluginName].constructDropdown(_self);
			});
		}
	}
	
	$.fn[pluginName].constructDropdown=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var numberOfOptions = _self.children('option').length;
			_self.addClass('s-hidden');
			if(_self.parent().hasClass('select')){
				_self.parent().find('div.mdSelect').remove();
				_self.parent().find('div.mdOptionsWrapper').remove();
				_self.closest('div.select').contents().unwrap();
			}
			
			_self.wrap('<div class="select"></div>');
			_self.after('<div class="mdSelect"><span></span></div>');
			
			var $mdSelect = _self.next('div.mdSelect');
			$mdSelect.data( "index", _opts.index);
			if(_self.val()==''){
				$.fn[pluginName].highlightText(_self);
				$mdSelect.text(_self.children('option').eq(0).text());
			}else{
				$mdSelect.text(_self.val());
				_self.find('option').each(function(index, element) {
                    if($(this).val() == _self.val()){
						$mdSelect.text($(this).text());
					}
                });
			}
		
			var $list = $('<ul />', {
				'class': 'options'
			}).insertAfter($mdSelect);
			var displayHeight=_opts.height==0?'auto':_opts.height;
			$list.wrap('<div class="mdOptionsWrapper" style="overflow:auto; height:'+displayHeight+'px;"></div>');
			$.fn[pluginName].highlightText(_self);
			
			for (m = 0; m < numberOfOptions; m++) {
				$('<li />', {
					text: _self.children('option').eq(m).text(),
					rel: _self.children('option').eq(m).val()
				}).appendTo($list);
			}
			
			var $listItems = $list.children('li');
			var $mdOptions = $mdSelect.next('.mdOptionsWrapper');
			$mdSelect.click(function (e) {
				e.stopPropagation();
				
				$('div.mdSelect').each(function(index, element) {
					if($(this).data( "index") != _opts.index){
						$(element).next('.mdOptionsWrapper').hide();
					}
                });
				
				$mdOptions.toggle();
				
				var optionoff = $mdOptions.offset();
				if(_opts.display=='top'){
					$mdOptions.css('top', - ($mdOptions.height()-_self.next('div.mdSelect:after').height()));
				}else if(_opts.display=='bottom'){
					$mdOptions.css('top', _self.next('div.mdSelect:after').height());
				}else{
					if((optionoff.top+$mdOptions.height()+_self.next('div.mdSelect:after').height())>$(document).height()){
						$mdOptions.css('top', - ($mdOptions.height()-_self.next('div.mdSelect:after').height()));
					}	
				}
			});
			$mdOptions.click(function (e) {
				e.stopPropagation();
			});
			$listItems.click(function (e) {
				e.stopPropagation();
				_self.next('.mdSelect').text($(this).text());
				_self.val($(this).attr('rel'));
				_self.parent().find('.mdOptionsWrapper').hide();
				$.fn[pluginName].highlightText(_self);
				$.fn[pluginName].callbackDropdown(_self, $(this).attr('rel'));
			});
			
			if(_opts.autoHighlight){
				$.fn[pluginName].highlightText(_self);
			}
			
			$(document).click(function () {
				_self.parent().find('.mdOptionsWrapper').hide();
			});
		});
	}
	
	$.fn[pluginName].highlightText=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			
			var $mdSelect = _self.next('div.mdSelect');
			var $mdOptions = $mdSelect.next('.mdOptionsWrapper li');
			_self.parent().find('div.mdOptionsWrapper li').each(function(index, element) {
                $(this).removeClass('selected');
				
				if($(this).attr('rel') == _self.val()){
					$(this).addClass('selected');	
				}
            });
		});
	}
	
	$.fn[pluginName].callbackDropdown=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			if($.isFunction(_opts.callback)){
				_opts.callback(con);
			}
		});
	}
	
	$.fn[pluginName].hideDropdown=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			_self.parent().find('.mdOptionsWrapper').hide();
		});
	}
	
	$.fn[pluginName].commandDropdown=function(obj,command,value,value2) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			switch(command) {
				case 'destroy':
					$.fn[pluginName].destroy(_self);
				break;
				
				case 'reset':
					$.fn[pluginName].constructDropdown(_self);
				break;
				
				case 'hide':
					$.fn[pluginName].hideDropdown(_self);
				break;
				
				default:
					if(_opts[value]!=undefined){
						_opts[value]=value2;
						$.fn[pluginName].constructDropdown(_self);
					}
			}
		});
	}
	
	$.fn[pluginName].destroy=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			_self.removeClass('s-hidden');
			if(_self.parent().hasClass('select')){
				_self.parent().find('div.mdSelect').remove();
				_self.parent().find('div.mdOptionsWrapper').remove();
				_self.closest('div.select').contents().unwrap();
			}
			
			_self.removeData('plugin_' + pluginName);
		});
    }
})(jQuery);