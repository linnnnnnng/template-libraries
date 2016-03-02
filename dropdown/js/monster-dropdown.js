/*
 * Monster Dropdown
 *
 * Copyright (c) 2014 Ling
 *
 */
 (function($) {
	var pluginName='monsterDropdown',
		defaults={
			display:'auto',
			height:0,
			index:0,
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
			if(_self.val()==''){
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
			
			for (m = 0; m < numberOfOptions; m++) {
				$('<li />', {
					text: _self.children('option').eq(m).text(),
					rel: _self.children('option').eq(m).val()
				}).appendTo($list);
			}
			
			var $listItems = $list.children('li');
			$mdSelect.click(function (e) {
				e.stopPropagation();
				
				$('div.mdSelect').each(function(index, element) {
                    if(index != _opts.index){
						$(element).next('div.mdOptionsWrapper').hide();
					}
                });
				
				var targetOptions = $(this).next('div.mdOptionsWrapper');
				
				targetOptions.toggle();
				
				
				var optionoff = targetOptions.offset();
				if(_opts.display=='top'){
					targetOptions.css('top', - (targetOptions.height()-_self.next('div.mdSelect:after').height()));
				}else if(_opts.display=='bottom'){
					targetOptions.css('top', _self.next('div.mdSelect:after').height());
				}else{
					if((optionoff.top+targetOptions.height()+_self.next('div.mdSelect:after').height())>$(document).height()){
						targetOptions.css('top', - (targetOptions.height()-_self.next('div.mdSelect:after').height()));
					}	
				}
			});
			$listItems.click(function (e) {
				e.stopPropagation();
				_self.next('.mdSelect').text($(this).text());
				_self.val($(this).attr('rel'));
				_self.parent().find('.mdOptionsWrapper').hide();
				$.fn[pluginName].callbackDropdown(_self, $(this).attr('rel'));
			});
			
			$(document).click(function () {
				_self.parent().find('.mdOptionsWrapper').hide();
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