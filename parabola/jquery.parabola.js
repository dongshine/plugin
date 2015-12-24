(function($){
	/*
		抛物线公式
		y = ax*x + b*x + c;
		a > 0时开口向上
		a < 0时开口向下 

		已知 起点和终点 坐标
		设起点经过原点 
		=>
		y = a*x*x + b*x + 0;
		b*x = y - a*x*x 
		b = (y - a*x*x) / x 

		// 顶点公式
		p = -b*-b/4a 


	*/
	$.fn.parabola = function(_config){			
		return this.each(function(){                
			$.parabola(this,_config);                
		});
	}		
	$.parabola = function(_this,_config){

		var defaults = { 
			// 元素
			ele            : $(_this), 
			// 目标X
			targetX        : 0, 
			// 目标Y
			targetY        : 0, 
			// 
			setp           : 10,
			// 曲率 值越大 曲线越弯
			rate           : 0.001,
			// 开口方向 =>   < 0时开口向下, > 0时开口向上
			direction      : -1,
			//
			offsetX        : -10,
			//
			offsetY        : -10,
			//
			time           : 16.7,
			//
			complete       : $.noop()
		}            

		//  格式化两位小数
		var formatNumber = function(_num){		
			var _num = parseFloat(_num);                
			return /^(-)?[0-9]*$/.test(_num) ? _num : /^(-)?[0-9]*(\.[0-9]*)?$/.test(_num) ? _num.toFixed(2) : 0 ; 		
		}        

		var cfg  = $.extend({},defaults,_config);			
		//  重置原点坐标
		var originX = 0;
		var originY = 0;	
		var _startX = 0; 
		var _timer  = null; 

		// 	目标坐标
		var eleLeft = cfg.ele.offset().left;
		var eleTop = cfg.ele.offset().top;

		// 防止左右滚动条
		cfg.targetX > 0 ? cfg.targetX > $(window).width() ? (cfg.targetX = $(window).width()-cfg.ele.width()): "" : "";

		// 相对坐标
		var relativeX = cfg.targetX - eleLeft;  
		var relativeY = eleTop - cfg.targetY; 

		// 
		relativeX < 0 ? cfg.setp = -cfg.setp : ""; 

		//
		var b = (relativeY - cfg.rate * cfg.direction * (relativeX - originX) * (relativeX - originX)) / (relativeX - originX);

		var move = function (){

			window.requestAnimationFrame && clearTimeout(_timer);  

			_startX = _startX + cfg.setp; 

			var _startY =  cfg.rate * cfg.direction * _startX * _startX + b * _startX; 

			_startX = formatNumber(_startX); 

			_startY = formatNumber(_startY); 		

			_startY < 0 ? _startY =  Math.abs(_startY) + originY + eleTop : _startY =  originY + eleTop - _startY ;		

			cfg.ele.css({left:_startX + eleLeft + cfg.offsetX + "px",top:_startY + cfg.offsetY + "px"});			

			if(relativeX < 0 && _startX <= relativeX || _startX >= Math.abs(relativeX)){  

				typeof cfg.complete == "function" && cfg.complete.call(null,_this); 

				return;  

			}else{
				if(window.requestAnimationFrame){	

					window.requestAnimationFrame(move);

				}else{ 
					_timer = setTimeout(function(){

					   move();

					},cfg.time)                        
				}
			};
		}

		move();

	}

}($));