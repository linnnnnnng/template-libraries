/*
 * Monster Form
 *
 * Copyright (c) 2017 Ling (2017/11/23)
 *
 */
 (function($) {
	var pluginName='monsterForm',
		defaults={
			numberOnlyClass:'numberOnly',
			placeholderClass:'placeholder',
			submitID:'#formSubmit',
			callback:''
        },
		m=0,fieldResult=[];
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			$.fn[pluginName].commandForm(this, options,value,value2)
		}else{
			return this.each(function () {
				var $this=$(this);
				var _opts=$.extend({},defaults,options);
				$this.data('plugin_' + pluginName, _opts);
				$.fn[pluginName].constructForm($this);
			});
		}
	}
	
	$.fn[pluginName].constructForm=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			_self.find('input,textarea').each(function(){
				if($(this).attr('placeholder') !== undefined)
					$.fn[pluginName].constructField($(this));
				if($(this).hasClass(_opts.numberOnlyClass))
					$.fn[pluginName].constructField($(this),'number');
			});
			_self.find(_opts.submitID).unbind("click");
			_self.find(_opts.submitID).click(function(){
				$.fn[pluginName].checkFieldGroup(_self);
			});
		});
	}
	
	$.fn[pluginName].checkFieldGroup=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			var groupError=false;
			fieldResult=[]
			$('#'+_self.attr('id')+' [required]').each(function(){
				$.fn[pluginName].validateField($(this));
				groupError=$.fn[pluginName].validateField($(this))
				if(groupError.error){
					var exist=false
					for(var n=0;n<fieldResult.length;n++){
						if(fieldResult[n].name==groupError.name){
							exist=true;
						}
					}
					if(exist==false)
						fieldResult.push(groupError)
				}
			});
			
			if($.isFunction(_opts.callback)){
				var returnData={
					form:_self,
					errorlist:fieldResult
				}
				_opts.callback(returnData);
			}
		});
	}
	
	$.fn[pluginName].validateField=function(obj) {
		var fieldError=false;
		var result={name:'',type:'input',error:fieldError,validate:''}
		var disabled=$(obj).attr('disabled')==undefined?false:true;
		if($(obj).attr('required')&&disabled==false){
			result.name=$(obj).attr('name')
			if($(obj).attr('type')=='file'){
				var filesize = $(obj).attr('filesize');
				var filetype = $(obj).attr('filetype');
				
				if ($(obj).val()==""){
					fieldError=true;
					result.type='fileupload';
					result.validate='fileupload';
				}else if(filesize!=undefined&&$(obj)[0].files[0].size>filesize){
					fieldError=true;
					result.type='filesize';
					result.validate='filesize';
				}else if(filetype!=undefined&&$.fn[pluginName].validateFileType(filetype, $(obj)[0].files[0].name)==false){
					fieldError=true;
					result.type='filetype';
					result.validate='filetype';
				}
			}else if($(obj).attr('type')=='radio'){
				//Radio validation
				var radioboxName = $(obj).attr('name')  || '';
				var radiobox=$("input[name='"+radioboxName+"']:checked").val();
				if (radiobox==undefined){
					fieldError=true;
				}else if(radiobox.length == 0){
					fieldError=true;
				}
				result.type='radio';
			}else if($(obj).attr('type')=='checkbox'){
				//Checkboxes validation
				var checkboxName = $(obj).attr('name')  || '';
				var checkboxField = $("input[name='"+checkboxName+"']").serializeArray();						
				if (checkboxField.length == 0){
					fieldError=true;
				}
				result.type='checkbox';
			}else if($(obj).attr('validate') == 'email'){
				if($(obj).val()== $(obj).attr('placeholder') || $(obj).val()== ""){
					fieldError=true;
				}else if(!$.fn[pluginName].validateEmail($(obj).val())){	
					fieldError=true;
					result.validate='email'
				}
				result.type='input'
			}else {	
				if($(obj).val()== $(obj).attr('placeholder') || $(obj).val()==""){
					fieldError=true;
				}else if($(obj).attr('minlength')){
					if($.fn[pluginName].validateMinLength($(obj).val(),$(obj).attr('minlength'))){	
						fieldError=true;
						result.validate='minlength';
						result.minlength=$(obj).attr('minlength');
					}
				}
				result.type='input'
				if($(obj).is('textarea')){
					result.type='textarea'
				}else if($(obj).is('select')){
					result.type='select'
				}
			}
		}
		result.error=fieldError;
		return result;
	}
	$.fn[pluginName].constructField=function(obj,type) {
		if(type=='number'){
			$(obj).keydown(function(event) {
				if ( $.inArray(event.keyCode,[46,8,9,27,13,190]) !== -1 ||
					(event.keyCode == 65 && event.ctrlKey === true) ||
					(event.keyCode >= 35 && event.keyCode <= 39)) {
						 return;
				}else{
					if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
						event.preventDefault(); 
					}   
				}
			});
		}else{
			if($(obj).val()=='')
				$(obj).val($(obj).attr('placeholder'));
			$(obj).on('focus', function(){
				if($(obj).val()==$(obj).attr('placeholder')){
					$(obj).val('');
				}
				$.fn[pluginName].togglePlaceholderClass(obj);
			}).on('blur', function(){
				if($(obj).val()==''){
					var inputtitle=$(obj).attr('placeholder');
					$(obj).val(inputtitle);
				}
				$.fn[pluginName].togglePlaceholderClass(obj);
			}).on("input change", function() {
				$.fn[pluginName].togglePlaceholderClass(obj);
			});
			$.fn[pluginName].togglePlaceholderClass(obj);
		}
	}
	$.fn[pluginName].togglePlaceholderClass=function(obj) {
		if(obj.attr('placeholder') !== undefined){
			if($(obj).val()==$(obj).attr('placeholder') || $(obj).val() == ''){
				$(obj).addClass('placeholder');
			}else{
				$(obj).removeClass('placeholder');
			}
		}
	}
	$.fn[pluginName].validateMinLength=function(value, length){
		if(value.length<length){
			return true;
		}else{
			return false;
		}
	}
	$.fn[pluginName].validateEmail=function($email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if( !emailReg.test( $email ) ) {
			return false;
		} else {
			return true;
		}		
	}
	$.fn[pluginName].validateFileType=function(type, name) {
		var allowedExtensions = type.split(',');
		var value = name,
			file = value.toLowerCase(),
			extension = file.substring(file.lastIndexOf('.') + 1);
		if ($.inArray(extension, allowedExtensions) == -1) {
			return false;
		} else {
			return true;
		}
	}
	$.fn[pluginName].reset=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			
			$('#'+_self.attr('id')+' input, #'+_self.attr('id')+' textarea').each(function(){
				if($(this).attr('type')=='radio'){
					$(this)
					.removeAttr('checked');
				}else if($(this).attr('type')=='checkbox'){
					$(this)
					.removeAttr('checked');
				}else{
					$(this)
					.val('')
					.removeAttr('checked')
					.removeAttr('selected');
				}	
			});
		});
	}
	$.fn[pluginName].commandForm=function(obj,command,value,value2){
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			switch(command) {
				case 'reset':
					$.fn[pluginName].reset(_self);
				break;
				
				default:
				/*default:
				if(_opts[value]!=undefined){
					_opts[value]=value2;
					$.fn[pluginName].constructPaginate(_self);
				}*/
			}
		});
	}
})(jQuery);