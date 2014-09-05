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
			callback:''
        },
		m=0;
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			var $this=$(this);
			var _opts=$this.data('plugin_'+pluginName);
			if(_opts!=undefined)
				$.fn[pluginName].commandDropdown(this,options,value,value2)
		}else{
			return this.each(function () {
				var _self=$(this);
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
				_self.parent().find('div.styledSelect').remove();
				_self.parent().find('div.optionsWrapper').remove();
				_self.closest('div.select').contents().unwrap();
			}
			
			_self.wrap('<div class="select"></div>');
			_self.after('<div class="styledSelect"><span></span></div>');
			
			var $styledSelect = _self.next('div.styledSelect');
			$styledSelect.text(_self.children('option').eq(0).text());
		
			var $list = $('<ul />', {
				'class': 'options'
			}).insertAfter($styledSelect);
			var displayHeight=_opts.height==0?'auto':_opts.height;
			$list.wrap('<div class="optionsWrapper" style="overflow:auto; height:'+displayHeight+'px;"></div>');
			
			for (m = 0; m < numberOfOptions; m++) {
				$('<li />', {
					text: _self.children('option').eq(m).text(),
					rel: _self.children('option').eq(m).val()
				}).appendTo($list);
			}
			
			var $listItems = $list.children('li');
			$styledSelect.click(function (e) {
				e.stopPropagation();
				$(this).next('div.optionsWrapper').toggle();
				var optionoff = $(this).next('div.optionsWrapper').offset();
				if(_opts.display=='top'){
					$(this).next('div.optionsWrapper').css('top', - ($(this).next('div.optionsWrapper').height()-_self.next('div.styledSelect:after').height()));
				}else if(_opts.display=='bottom'){
					$(this).next('div.optionsWrapper').css('top', _self.next('div.styledSelect:after').height());
				}else{
					if((optionoff.top+$(this).next('div.optionsWrapper').height()+_self.next('div.styledSelect:after').height())>$(document).height()){
						$(this).next('div.optionsWrapper').css('top', - ($(this).next('div.optionsWrapper').height()-_self.next('div.styledSelect:after').height()));
					}	
				}
			});
			$listItems.click(function (e) {
				e.stopPropagation();
				_self.next('.styledSelect').text($(this).text());
				_self.val($(this).attr('rel'));
				_self.parent().find('.optionsWrapper').hide();
				$.fn[pluginName].callbackDropdown(_self, $(this).attr('rel'));
			});
			
			$(document).click(function () {
				_self.parent().find('.optionsWrapper').hide();
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
})(jQuery);