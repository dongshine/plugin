//******************************************************************************************************************************
/*
 * @自定义 Select
 * @method Select
 * @author dongshine
 * @time   2015-4-28 
 * @param {Object} ele -在当前obj对象后渲染 自定义select
 * @param {Object} checked -默认值 {名称:值}
 * @param {Number} width -宽度
 * @param {Number} height -高度		
 * @param {Boolean} clickBodyCancel -点击空白取消下拉
 * @param {Function} before - before事件
 * @param {Function} onload - onload事件
 * @param {Function} change(data) - 值改变时触发 data为 返回选中的键值对象{name,val}
 * @param {Array} options - select填充值
 * @example new Select() || Select();
*/

var select = function(config){
	
	var defaults = {		
		// 当前元素(隐藏域)
		ele         : null,		
		// 默认值 隐藏域 data-default 属性值
		checked     : null, 		
		// 宽度
		width       : 250,
		// 高度
		height      : 36,
		// 点击取消
		clickBodyCancel : true, 
		// before事件
		before      : function(){},  
		// onload事件
		onload      : function(){},
		// change事件
		change      : function(data){},
		// 数据 隐藏域 data-options 属性值   
		options     : null
	}
	
	var cfg = $.extend({},defaults,config); 
    
    cfg.options = (cfg.options || (new Function("","return "+$(cfg.ele).attr("data-options")))()) || [{name:'请选择',value:'0'}];
    
    cfg.checked = (cfg.checked || (new Function("","return "+$(cfg.ele).attr("data-checked")))()) || {name:'请选择',value:'0'};
    
    
	// 容器
	var select = null;
	
	//初始化
	var init = function(){	
		
		// 首次设置默认值		
		updateDefaultValue(cfg.checked);	

		// before事件 
		typeof cfg.before === "function" && cfg.before.call(select); 
		
		// 初始化UI
		renderUI(); 
		
		// 初始化样式
		syncUI(); 
		
		// 绑定事件
		bindUI(); 
		
		// 设置隐藏域
		setHideVal();
		
		// 在当前元素后面渲染
		cfg.ele.after(select);

		// onload事件 
		typeof cfg.onload === "function" && cfg.onload.call(select); 
	};

	// 渲染UI
	var renderUI = function(){
		select = $("<div class='custom-select'></div>");	
		var panel  = "<div class='custom-select-opt-panel' data-value='"+cfg.checked.value+"'>"+cfg.checked.name+"<div class='arr'></div></div>";
			panel += "<ol class='custom-select-opts'>";		
			for(var i = 0, data = cfg.options,leng = data.length ; i < leng; i++ ){	 		
				var name = data[i]["name"];
				var val  = data[i]["value"]; 
				val == cfg.checked.value ? panel += "<li class='custom-select-opt custom-select-opt-selected'>" : panel += "<li class='custom-select-opt'>";
				panel += "		<a class='custom-select-opt-txt' data-value='"+val+"' href='javascript:'>"+name+"</a>";
				panel += "	</li>";		
			}		
			panel += "</ol>"; 
		select.append(panel);
	};

	// 初始化样式
	var syncUI = function(){
		select.css({
			width       : cfg.width-2+'px',
			height      : cfg.height+'px'
		});
		select.find(".custom-select-opt-panel,.custom-select-opt-txt").css({
			height      : cfg.height+'px',
			lineHeight  : cfg.height+'px'
		});
	};

	// 绑定事件
	var bindUI = function(){
		var _this = this;
		
		// 点击select
		select.delegate('.custom-select-opt-panel','click',function(){	
			if($(this).hasClass("disabled")) return;
			selectToggle(); 
			return false;
		});
		
		// 点击选项
		select.delegate('.custom-select-opt-txt','click',function(){	
			if($(this).hasClass("disabled")) return;	
			setValue({name:$(this).html(),value:$(this).attr("data-value")});
			return false;		
		});
		
		// 点击空白取消
		if(cfg.clickBodyCancel){
			$("body,html").click(function(){			
				select.find(".custom-select-opts").hide();			
			});		 
		}
	};
	
	// 修改默认值
	var updateDefaultValue = function(obj){	
		if(!obj.hasOwnProperty('name')){
			cfg.checked.name = cfg.options[0]["name"];		
			cfg.checked.value = cfg.options[0]["value"];		
		}else{
			cfg.checked.name = obj.name;
			cfg.checked.value = obj.value;
		}		
	};

	//设值
	var setValue = function(obj){
		
		// 获取值索引
		var valIndex = getJsonIndex(obj);
		
		// 值改变
		if(cfg.checked.value !== obj.value){
			
			// 修改默认值
			updateDefaultValue(obj);
		
			// 设置隐藏域
			setHideVal();
			
			// 选中后设置tittle
			select.find(".custom-select-opt-panel").attr("data-value",obj.value).html(obj.name+"<span class='arr'></span>");
			
			// 选中当前opt
			select.find(".custom-select-opts li").eq(valIndex).addClass("custom-select-opt-selected").siblings().removeClass("custom-select-opt-selected");
			
			// change事件 
			typeof cfg.change === "function" && cfg.change.call(select,{name:obj.name,value:obj.value}); 
		}
		
		selectHide();		
		
	}
	// 设置隐藏域
	var setHideVal = function(){	
		cfg.ele.val(cfg.checked.value);
	}

	// 隐藏下拉
	var selectHide = function(){	
		select.find(".custom-select-opts").hide();
	}

	// 禁用
	var disabled = function(){	
		select.find(".custom-select-opt-panel").addClass("disabled");
	}

	// 取消禁用
	var enabled = function(){	
		select.find(".custom-select-opt-panel").removeClass("disabled"); 
	}

	// 隐藏显示
	var selectToggle = function(){	
		select.find(".custom-select-opts").toggle();
	}

	// 销毁
	var destory = function(){	
		select.remove();
	}

	// 获取值索引
	var getJsonIndex = function(obj){
		for(var i = 0,data = cfg.options; i< data.length; i++){			
			if(data[i]["name"] == obj.name && data[i]["value"] == obj.value){
				return i;
				break;
			}	
		}
	}
	
	// 初始化
	init();
	
	//暴露方法 
	return {		
		set      : setValue,
		destory  : destory,
		disabled : disabled,	
		enabled  : enabled	
	}; 
};
    
//******************************************************************************************************************************
//******************************************************************************************************************************    