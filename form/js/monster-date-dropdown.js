/*
 * Monster Form
 *
 * Copyright (c) 2013 Ling
 *
 */
 (function($) {
	var pluginName='monsterDateDropdown',
		defaults={
			dateFormat:'yyyy-m-d',
			monthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
			yearStart:'1920',
			yearEnd:'',
			yearDistance:0,
			yearDefault:"Year",
			monthDefault: "Month",
			dayDefault: "Date",
			yearClass:'yearlist',
			dayClass:'daylist',
			monthClass:'monthlist',
			callback:''
        },
		m,sp,ep=0,_class;
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			commandForm(this, options,value,value2)
		}else{
			return this.each(function () {
				var $this=$(this);
				var _opts=$.extend({},defaults,options);
				$this.data('plugin_' + pluginName, _opts);
				$.fn[pluginName].constructDropdown($this);
			});
		}
	}
	
	$.fn[pluginName].constructDropdown=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			_self.parent().prepend('<select id='+_self.attr('id')+'_'+_opts.dayClass+' class='+_opts.dayClass+'></select>')
			_self.parent().prepend('<select id='+_self.attr('id')+'_'+_opts.monthClass+' class='+_opts.monthClass+'></select>')
			_self.parent().prepend('<select id='+_self.attr('id')+'_'+_opts.yearClass+' class='+_opts.yearClass+'></select>')
			_self.hide();
			$.fn[pluginName].insertDropdown(_self);
		});
	}
	$.fn[pluginName].insertDropdown=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts.yearDistance!=0){
				ep=(new Date).getFullYear();
				sp=ep-_opts.yearDistance
			}else{
				sp=_opts.yearStart
				ep=_opts.yearEnd || (new Date).getFullYear();
			}
			$.fn[pluginName].insertDropdownList(_self,_self.siblings('#'+_self.attr('id')+'_'+_opts.yearClass),_opts.yearDefault,sp,ep);
			$.fn[pluginName].insertDropdownList(_self,_self.siblings('#'+_self.attr('id')+'_'+_opts.monthClass),_opts.monthDefault,sp,ep,'month');
			$.fn[pluginName].insertDropdownList(_self,_self.siblings('#'+_self.attr('id')+'_'+_opts.dayClass),_opts.dayDefault,1,31);
		});
	}
	$.fn[pluginName].insertDropdownList=function(obj,dd,d,s,e,type) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			type=type || ''
			dd.empty();
			dd.append('<option value="'+d+'">'+d+'</option>');
			if(type=='month'){
				for(m in _opts.monthNames){
					dd.append('<option value="'+(Number(m)+1)+'">'+_opts.monthNames[m]+'</option>');
				}
			}else{
				for(m=s;m<=e;m++){
					dd.append('<option value="'+m+'">'+m+'</option>');
				}
			}
			dd.unbind('change');
			dd.change(function() {
				$.fn[pluginName].changeDropdown(_self);
			});
		});
	}
	$.fn[pluginName].changeDropdown=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var year=_self.siblings('#'+_self.attr('id')+'_'+_opts.yearClass).val()
			var month=_self.siblings('#'+_self.attr('id')+'_'+_opts.monthClass).val()
			var date=_self.siblings('#'+_self.attr('id')+'_'+_opts.dayClass).val()
			var checkdate=cMonth(month,year)
			$.fn[pluginName].insertDropdownList(_self,_self.siblings('#'+_self.attr('id')+'_'+_opts.dayClass),_opts.dayDefault,1,checkdate);
			_self.siblings('#'+_self.attr('id')+'_'+_opts.dayClass).val(date);
			if(date>checkdate)
				_self.siblings('#'+_self.attr('id')+'_'+_opts.dayClass).val(checkdate);
			$.fn[pluginName].callbackDateDropdown(_self);
			
			//falt UI
			var flatdd=_self.siblings('#dk_container_'+_self.attr('id')+'_'+_opts.dayClass)
			if(cE(flatdd)){
				flatdd.find('.dk_options_inner li').each(function( index ) {
					var clist=$(this).find('a').attr('data-dk-dropdown-value')
					if(clist>checkdate){
						$(this).remove();
					}
				});
				var daylength=flatdd.find('.dk_options_inner li').length;
				var list='';
				for(m=daylength;m<=checkdate;m++){
					list+='<li><a data-dk-dropdown-value="'+m+'">'+m+'</a></li>';
				}
				flatdd.find('.dk_options_inner').append(list);
				if(date>checkdate){
					flatdd.find('.dk_options_inner li').each(function () {
						$(this).removeClass('dk_option_current');
						if ($(this).children('a').data('dk-dropdown-value') == checkdate) {
							$(this).addClass('dk_option_current');
							flatdd.find('.dk_label').text($(this).children('a').text());
						}
					});
				}
			}
			$.fn[pluginName].outputDropdown(_self);
		});
	}
	$.fn[pluginName].outputDropdown=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var year=_self.siblings('#'+_self.attr('id')+'_'+_opts.yearClass).val();
			var month=_self.siblings('#'+_self.attr('id')+'_'+_opts.monthClass).val();
			var date=_self.siblings('#'+_self.attr('id')+'_'+_opts.dayClass).val();
			if(year!=_opts.yearDefault&&month!=_opts.monthDefault&&date!=_opts.dayDefault){
				var output_arr = _opts.dateFormat.split('-');
				for(m in output_arr){
					if(output_arr[m].length > 2){
						output_arr[m] = year;
					}else if(output_arr[m].substring(0, 1) == 'm'){
						if(output_arr[m].length == 2){
							output_arr[m] = month.length == 1? '0'+month : month;
						}else{
							output_arr[m] = month;
						}
					}else if(output_arr[m].substring(0, 1) == 'd'){
						if(output_arr[m].length == 2){
							output_arr[m] = date.length == 1? '0'+date : date;
						}else{
							output_arr[m] = date;
						}
					}else{
						output_arr[m] = year.substring(2, 4);	
					}
				}
				_self.val(output_arr[0] + '-' + output_arr[1] + '-' + output_arr[2]);
			}else{
				_self.val('')
			}
		});
	}
	$.fn[pluginName].callbackDateDropdown=function(obj,command,con) {
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
	function cMonth(c,y) {
		var d = 31;
		c == 4 || c == 6 || c == 9 || c == 11 ? d = 30 : c == 2 && (d = y % 4 == 0 ? 29 : 28);
		return d
	}
	function cE(t){
		return t.length==0?false:true
	}
})(jQuery);