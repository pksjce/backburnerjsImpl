function bookBinder(updateTemplate){
	var _binderRegistry = [];
	var _backburner = new backburner.Backburner(['sync', 'render']);
	var _watchedObjectList = [];
	var updateTemplate = updateTemplate;
	return {
		init:function(){

		},
		bind:function(templateName, object, element){
			var binderObj = {
					"templateName":templateName,
					"boundTo": object,
					"element": element
				};
			_binderRegistry.push(binderObj);
			var self = this;
			$.each(object, function(key, val){
				if(object.hasOwnProperty(key)){
					if(!object["_orig"]){
						object["_orig"] = {};
					}	
					object["_orig"][key] = object[key];
					object.__defineGetter__(key, function(){
						return object[key];
					});
					object.__defineSetter__(key, function(val){
						object["_orig"][key] = val;
						self.startChange.call(self,templateName);
						return val;
					})	
				}
				
			});
		},
		startChange: function(templateName){
			var self = this;
			this.templateName = templateName;
			_backburner.deferOnce('render',this, this._updateTemplate);
		},
		_updateTemplate:function(){
			if(!updateTemplate){
				alert('I dont know what template you wanna update!');
			} else {
				var i;
				var boundObj;
				for(i =0 ;i < _binderRegistry.length; i++){
					var bindObj = _binderRegistry[i];
					if(bindObj.templateName === this.templateName){
						boundObj = bindObj;
						break;
					}
				}
				console.log('updating');
				updateTemplate(this.templateName, boundObj["boundTo"]["_orig"], boundObj["element"]);
			}

		}
	}
};
window.bookBinder = bookBinder;