/*
 * Monster Paginate
 *
 * Copyright (c) 2016 Ling (2017/5/11)
 *
 */
 (function($) {
	var pluginName='monsterPaginate',
		defaults={
			selectPage:1,
			totalPages:15,
			display:5,
			nextText:">",
			prevText:"<",
			nextPaginateText:">>",
			prevPaginateText:"<<",
			firstText:"First",
			lastText:"Last",
			showPrevNext:true,
			autoPrevNext:false,
			showPrevNextPaginate:true,
			autoPrevNextPaginate:false,
			showFirstLast:true,
			autoFirstLast:false,
			autoFollowOrderPage:true,
			curPaginate:1,
			maxPaginate:1,
			callback:'',
			pageLink:'paginateButton',
			pageClass:'page',
			prevClass:'prevPage',
			nextClass:'nextPage',
			prevPaginateClass:'prevPaginatePage',
			nextPaginateClass:'nextPaginatePage',
			firstClass:'firstPage',
			lastClass:'lastPage',
			disabledClass:'disabled',
			selectedClass:'selected',
			init:false,
			command:''
        },
		m,sp,ep=0,_class;
	
	$.fn[pluginName]=function(options,value,value2) {
		if(typeof options=='string'){
			var $this=$(this);
			var _opts=$this.data('plugin_'+pluginName);
			if(_opts!=undefined)
				$.fn[pluginName].commandPaginate(this,options,value,value2)
		}else{
			return this.each(function () {
				var $this=$(this);
				$.fn[pluginName].destroy($this);
				var _opts=$.extend({},defaults,options);
				$this.data('plugin_' + pluginName, _opts);
				_opts.command = '';
				$.fn[pluginName].presentPaginate($this);
				$.fn[pluginName].constructPaginate($this);
				$.fn[pluginName].callbackPaginate($this,'init');
			});
		}
	}
	
	$.fn[pluginName].constructPaginate=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			_opts.maxPaginate=_opts.totalPages>_opts.display?Math.ceil(_opts.totalPages/_opts.display):1;
			
			//within paginate
			
			
			sp=(_opts.curPaginate*_opts.display)-(_opts.display-1);
			ep=_opts.curPaginate*_opts.display;
			ep=ep>_opts.totalPages?_opts.totalPages:ep;
			_self.find('ul').remove();
			_self.append('<ul></ul>');
			
			if(_opts.autoFollowOrderPage){
				if(_opts.command == 'nextPaginatePage'){
					_opts.selectPage = sp;		
				}else if(_opts.command == 'prevPaginatePage'){
					_opts.selectPage = ep;		
				}else if(_opts.command == 'firstPage'){
					_opts.selectPage = 1;		
				}else if(_opts.command == 'lastPage'){
					_opts.selectPage = _opts.totalPages;		
				}
			}
			
			if(!_opts.init){
				_opts.init=true;
			}
			
			for(m=sp;m<=ep;m++){
				_class=_opts.pageClass;
				if(_opts.selectPage==m)
					_class+=' '+_opts.selectedClass;
				_self.find('ul').append('<li class="'+_class+'"><a class="'+_opts.pageLink+'">'+m+'</a></li>');
			}
			var disStatus;
			if(_opts.showPrevNext){
				_class=_opts.prevClass;
				disStatus=false;
				if(_opts.selectPage==1)
					_class+=' '+_opts.disabledClass;
				if(_opts.autoPrevNext){
					if(_class!=_opts.prevClass)
						disStatus=true;
				}
				if(!disStatus)
					_self.find('ul').prepend('<li class="'+_class+'"><a class="'+_opts.pageLink+'">'+_opts.prevText+'</a></li>');
				_class=_opts.nextClass;
				disStatus=false;
				if(_opts.selectPage==_opts.totalPages)
					_class+=' '+_opts.disabledClass;
				if(_opts.autoPrevNext){
					if(_class!=_opts.nextClass)
						disStatus=true;
				}
				if(!disStatus)
					_self.find('ul').append('<li class="'+_class+'"><a class="'+_opts.pageLink+'">'+_opts.nextText+'</a></li>');
			}
			if(_opts.showPrevNextPaginate){
				_class=_opts.prevPaginateClass;
				disStatus=false;
				if(_opts.curPaginate==1)
					_class+=' '+_opts.disabledClass;
				if(_opts.autoPrevNextPaginate){
					if(_class!=_opts.prevPaginateClass)
						disStatus=true;
				}
				if(!disStatus)
					_self.find('ul').prepend('<li class="'+_class+'"><a class="'+_opts.pageLink+'">'+_opts.prevPaginateText+'</a></li>');
				_class=_opts.nextPaginateClass;
				disStatus=false;
				if(_opts.curPaginate==_opts.maxPaginate)
					_class+=' '+_opts.disabledClass;
				if(_opts.autoPrevNextPaginate){
					if(_class!=_opts.nextPaginateClass)
						disStatus=true;
				}
				if(!disStatus)
					_self.find('ul').append('<li class="'+_class+'"><a class="'+_opts.pageLink+'">'+_opts.nextPaginateText+'</a></li>');
			}
			if(_opts.showFirstLast){
				_class=_opts.firstClass;
				disStatus=false;
				if(_opts.curPaginate==1)
					_class+=' '+_opts.disabledClass;
				if(_opts.autoFirstLast){
					if(_class!=_opts.firstClass)
						disStatus=true;
				}
				if(!disStatus)
					_self.find('ul').prepend('<li class="'+_class+'"><a class="'+_opts.pageLink+'">'+_opts.firstText+'</a></li>')
				_class=_opts.lastClass;
				disStatus=false;
				if(_opts.curPaginate==_opts.maxPaginate)
					_class+=' '+_opts.disabledClass;
				if(_opts.autoFirstLast){
					if(_class!=_opts.lastClass)
						disStatus=true;
				}
				if(!disStatus)
					_self.find('ul').append('<li class="'+_class+'"><a class="'+_opts.pageLink+'">'+_opts.lastText+'</a></li>')	
			}
			//var tW=0
			_self.find('li').each(function( index ) {
				//tW+=parseInt($(this).css('width'))+(parseInt($(this).css('margin-left'))*2)+(parseInt($(this).css('padding-left'))*2);
				//tW+=parseInt($(this).outerWidth(true));
				if(!$(this).hasClass(_opts.disabledClass)){
					$(this).click(function() {
						if(!$(this).hasClass(_opts.selectedClass)){
							$.fn[pluginName].activePaginate(_self, $(this));
						}
					})	
				}
			});
			
			_opts.command = '';
			//_self.css('width', tW+5)
		});
	}
	
	$.fn[pluginName].activePaginate=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			var command=''
			if($(con).hasClass(_opts.nextClass)){
				command='nextPage';
				$.fn[pluginName].togglePaginate(_self, true);
			}else if($(con).hasClass(_opts.prevClass)){
				command='prevPage'
				$.fn[pluginName].togglePaginate(_self, false);
			}if($(con).hasClass(_opts.nextPaginateClass)){
				command='nextPaginatePage'
				_opts.curPaginate++
				_opts.curPaginate=_opts.curPaginate>_opts.maxPaginate?_opts.maxPaginate:_opts.curPaginate
			}else if($(con).hasClass(_opts.prevPaginateClass)){
				command='prevPaginatePage'
				_opts.curPaginate--
				_opts.curPaginate=_opts.curPaginate<1?1:_opts.curPaginate
			}else if($(con).hasClass(_opts.firstClass)){
				command='firstPage'
				_opts.curPaginate=1
			}else if($(con).hasClass(_opts.lastClass)){
				command='lastPage'
				_opts.curPaginate=_opts.maxPaginate
			}else if($(con).hasClass(_opts.pageClass)){
				command='page'
				_opts.selectPage=pageControl=$(con).find('a').html();
			}
			
			_opts.command = command;
			$.fn[pluginName].constructPaginate(_self);
			$.fn[pluginName].callbackPaginate(_self,command);
		});
    }
	$.fn[pluginName].togglePaginate=function(obj,con) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data( 'plugin_' + pluginName);
			_opts.selectPage=con==true?Number(_opts.selectPage)+1:Number(_opts.selectPage)-1;
			_opts.selectPage=_opts.selectPage>_opts.totalPages?_opts.totalPages:_opts.selectPage;
			_opts.selectPage=_opts.selectPage<1?1:_opts.selectPage;
			$.fn[pluginName].presentPaginate(_self);
		});
    }
	
	$.fn[pluginName].goPaginate=function(obj,p) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			_opts.selectPage=p
			$.fn[pluginName].presentPaginate(_self);
			$.fn[pluginName].constructPaginate(_self);
		});
    }
	
	$.fn[pluginName].presentPaginate=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			_opts.maxPaginate=_opts.totalPages>_opts.display?Math.ceil(_opts.totalPages/_opts.display):1;
			for(m=1;m<=_opts.maxPaginate;m++){
				sp=(m*_opts.display)-(_opts.display-1)
				ep=m*_opts.display
				if(_opts.selectPage>=sp&&_opts.selectPage<=ep){
					_opts.curPaginate=m
				}
			}
		});
	}
	$.fn[pluginName].callbackPaginate=function(obj,command,con) {
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
	$.fn[pluginName].commandPaginate=function(obj,command,value,value2){
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			switch(command) {
				case 'destroy':
					$.fn[pluginName].destroy(_self);
					break;
				case 'nextPage':
					$.fn[pluginName].togglePaginate(_self, true);
					$.fn[pluginName].constructPaginate(_self);
					$.fn[pluginName].callbackPaginate(_self,command);
					break;
				case 'prevPage':
					$.fn[pluginName].togglePaginate(_self, false);
					$.fn[pluginName].constructPaginate(_self);
					$.fn[pluginName].callbackPaginate(_self,command);
					break;
				case 'goPage':
					$.fn[pluginName].goPaginate(_self, value);
					break;
				default:
					if(_opts[value]!=undefined){
						_opts[value]=value2;
						$.fn[pluginName].constructPaginate(_self);
					}
			}
		});
	}
	
	
	$.fn[pluginName].destroy=function(obj) {
		return obj.each(function(){
			var _self=$(this);
			var _opts=_self.data('plugin_'+pluginName);
			if(_opts!=undefined){
				_opts.init=false;
				_self.css('width','auto');
				_self.find('li').each(function( index ) {
					$(this).unbind();
				});
			}
			_self.removeData('plugin_' + pluginName);
		});
    }
})(jQuery);