    //******************************************************************************************************************************
/*
 * 
 * @自定义弹出框
 * @method dialog
 * @author dongshine
 * @time   2015-5-21
 * 
 */
//******************************************************************************************************************************   
    var dialog = function(cfg){ 
		var defaults = {
            // 宽度
            width          : 350,    
            // 高度
            height         : 150,            
            // 自动宽高
            sizeAuto       : false,
            // 内容
            content        : '这是一个弹出对这是一个弹出对话框话框!',     
            // 窗口
            windowDom      : window, 
            // 延时关闭
            delay          : 0,   
            // 标题
            title          : '提示信息',
            // 关闭按钮
            closeBtn       : true,
            // 关闭按钮文字
            closeTxt       : '×',
            // 确认按钮
            sure           : true,  
            // 确认按钮文字
            sureTxt        : '确定',  
            // 取消按钮
            cancel         : true,  
            // 取消按钮文字
            cancelTxt      : '取消',  
            // 背景遮罩
            mask           : true,  
            // 是否点击遮罩关闭
            clickMaskClose : false,  
            // 关闭事件
            closeHandler   : $.noop(),
            // 确认事件
            sureHandler    : $.noop(),
            // 取消事件
            cancelHandler  : $.noop(),
            // 渲染前事件
            before         : $.noop(),
            // 渲染完成事件
            onload         : $.noop(),
            // 自定义class
            addClass       : ''
        }
        
        var config   = $.extend({},defaults,cfg);        
        var dialog   = null;
        var _mask    = null
        var handlers = []; 

        // 渲染
        var init = function(){	
            
            //渲染之前
            typeof config.before === "function" && config.before.call(dialog);
            
            //
            renderUI(); 

            // 绑定事件
            bindUI(); 

            // 初始化UI
            syncUI();
            
            // 渲染完成
            typeof config.onload === "function" && config.onload.call(dialog);
        };

        // 渲染UI
        var renderUI = function(){ 
            
            dialog = $("<div class='custom-dialog'></div>"); 
            
            // 是否有title
            config.title && titleRenderUI();	
            
            // 渲染主体
            bodyRenderUI();	

            // 渲染按钮
            buttonRenderUI();

            dialog.appendTo(config.windowDom.document.body);
            
            // 是否显示遮罩
            if(config.mask){
                _mask = $("<div class='custom-dialog-mask'></div>");
                _mask.appendTo(config.windowDom.document.body);
            }	

            // 定时消失
            config.delay && setTimeout( function(){ close(); }, config.delay ); 
        };

        // 事件bind
        var bindUI = function(){

            // 点击空白立即取消
            config.clickMaskClose && _mask && _mask.click(function(){ close();});	 

            // 绑定事件
            dialog.delegate('.sure','click',function(){                	
                fire('sure');
                destroy();	
                clearHandle();
                return false;
            });
            
            dialog.delegate('.cancel,.custom-dialog-close','click',function(){               
                fire('close');
                destroy();
                clearHandle(); 
                return false;
            });

            if(config.sureHandler){ 
                on('sure',config.sureHandler);
            }

            if(config.cancelHandler){
                on('cancel',config.cancelHandler);
            }

        }; 

        // 初始化样式
        var syncUI = function(){

            if(config.sizeAuto){
                config.height = dialog.height();
                config.width  = dialog.width();
            } 
			
            dialog.css({
                width       : config.width+'px',
                height      : config.height+'px',
                marginLeft  : -(config.width/2)+'px',
                marginTop   : -(config.height/2)+'px'
            });
            
            //修复ie6
            if ('undefined' == typeof(document.body.style.maxHeight)){                 
                dialog.css({
                    marginTop  : '0px'                     
                });
            }
            
            dialog.addClass(config.addClass);

        };

        // 提示效果title
        var titleRenderUI = function(){
            var tit = "<div class='custom-dialog-tit'>"+config.title+"</div>";               
            dialog.append(tit);
        };


        // 按钮UI
        var buttonRenderUI = function(){		
            if(config.closeBtn){
                var closeBtn = "<div class='custom-dialog-close'>"+config.closeTxt+"</div>";
                dialog.append(closeBtn); 		
            }
            if(config.sure || config.cancel){
                var btn  = "<div class='custom-dialog-button'>";		
                    if(config.sure)   btn += "<input type='button' class='btn sure' value='"+config.sureTxt+"' />";
                    if(config.cancel) btn += "<input type='button' class='btn cancel' value='"+config.cancelTxt+"' />";
                    btn += "</div>";
                dialog.append(btn);
            }
            
        };

        // body UI
        var bodyRenderUI = function(){
            var customBody = "<div class='custom-dialog-body'>"+config.content+"</div>";
            dialog.append(customBody);
        };
        
        // 关闭
        var close = function(){           
            destroy();	            
            clearHandle();
        };

        // 销毁
        var destroy = function(){
            _mask  && _mask.remove();
            dialog && dialog.remove(); 
            dialog  = null; 
            typeof config.closeHandler === "function" && config.closeHandler.call(dialog);
        };

        // 清除事件
        var clearHandle = function(){
            handlers = [];  
        };

        //绑定事件
        var on = function(type,handler){	
            if (typeof handlers[type] === "undefined") {		
                handlers[type] = [];
            }
            if (typeof handler === "function") {
                handlers[type].push(handler);		
            }    
            return this; 
        };

        // 触发事件
        var fire = function(type){	
            var arrayEvent = handlers[type];
            if (arrayEvent instanceof Array) { 
                for (var i=0; i < arrayEvent.length; i++) {
                    if (typeof arrayEvent[i] === "function"){
                        arrayEvent[i]({type: type});  

                        //执行后删除事件
                        arrayEvent.splice(i,1); 
                    } 
                }
            }    
            return this;  
        };

        // 初始化
        init();
        
        return {
            close:close 
        }

    };
    
//******************************************************************************************************************************
//******************************************************************************************************************************       
