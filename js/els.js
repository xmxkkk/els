// var log=console.log;
var log=function(){};

var els=function(container,opt){
	var self=this;

	this.wNum=opt.wNum||10;
	this.hNum=opt.hNum||15;
	this.wVal=opt.wVal||30;
	this.hVal=opt.hVal||30;
	this.speed=opt.speed||500;
	this.startButton=opt.startButton||null;
	this.stopButton=opt.stopButton||null;
	this.pauseButton=opt.pauseButton||null;
	this.restartButton=opt.restartButton||null;
	this.scoreText=opt.scoreText||null;
	
	//方块
	this.shapes=shapes;
	//地图
	this.map=[];
	//速度
	
	//当前形状
	this.currentShape=null;
	//上次的位置，用于判断死亡
	this.oldPos=null;

	this.intervalId=0;

	this.gameStatus="stop";

	this.defaultBackgroundColor="rgb(240,240,240)";

	this.score=0;

	this.scoreList={
		0:0,
		1:10,
		2:30,
		3:60,
		4:100
	}

	//这里生成一个下落的方块
	this.getShape=function(){
		this.currentShape=随机方块(this.shapes);
		this.currentShape.pos=
		{
			x:parseInt((this.wNum-this.currentShape.matrix[0].length)/2),
			y:-4
		};
		this.oldPos={
			x:this.currentShape.pos.x,
			y:this.currentShape.pos.y
		}
	}

	//地图初始化
	this.init=function(initVal){
		this.map=[];
		this.score=0;
		container.html("");
		if(initVal){
			//如果有值就按照数值进行初始化
			for(var i=0;i<this.hNum;i++){
				this.map[i]=[];
				for(var j=0;j<this.wNum;j++){
					var val=parseInt(initVal.substring(i*this.wNum+j,i*this.wNum+j+1));
					this.map[i][j]={
						value:val,
						color:this.defaultBackgroundColor
					};

					if(this.map[i][j].value!=0){
						this.map[i][j].color=随机颜色();
					}
				}
			}
		}else{
			for(var i=0;i<this.hNum;i++){
				this.map[i]=[];
				for(var j=0;j<this.wNum;j++){
					this.map[i][j]={
						value:0,
						color:this.defaultBackgroundColor
					};

					if(this.map[i][j].value!=0){
						this.map[i][j].color=随机颜色();
					}
				}
			}
		}
		
		container.css("width",(this.wNum*this.wVal)+"px").css("height",(this.hNum*this.hVal)+"px");

		for(var i=0;i<this.hNum;i++){
			var row=$("<div class='row' id='row"+i+"'></div>")
			for(var j=0;j<this.wNum;j++){
				row.append($("<div class='box' id='box"+j+"' style='width:"+(this.wVal-1)+"px;height:"+(this.hVal-1)+"px;'></div>"))
			}
			container.append(row);
		}
	}

	this.render=function(){
		//渲染地图
		for(var i=0;i<this.hNum;i++){
			for(var j=0;j<this.wNum;j++){
				var box=this.map[i][j];
				if(box.value==0){
					$("#row"+i+" #box"+j).css("background",this.defaultBackgroundColor);
				}else{
					$("#row"+i+" #box"+j).css("background",box.color);
				}
			}
		}

		//渲染下落方块
		log(this.currentShape);

		var matrix=this.currentShape.matrix;
		var color=this.currentShape.color;
		var pos=this.currentShape.pos;

		for(var i=0;i<matrix.length;i++){
			for(var j=0;j<matrix[i].length;j++){
				if(matrix[i][j]>0){
					$("#row"+(i+pos.y)+" #box"+(j+pos.x)).css("background",color);
				}
			}
		}
	}
	//碰撞检测和触底检测是一回事，触底只是其中一种，F
	this.check=function(map,currentShape,pos){
		var result=碰撞检测(map,currentShape,pos);
		return result;
	}

	//为什么一边形状就移动位置？
	this.change=function(dir){
		if(this.gameStatus=="stop" || this.gameStatus=="pause"){
			return;
		}

		var pos=this.currentShape.pos;log('1pos='+pos.x+","+pos.y);
		var color=this.currentShape.color;

		var newShape=旋转(this.shapes,this.currentShape.shapeType,this.currentShape.currDir,dir);
		newShape.pos=pos;
		newShape.color=color;

		var result=this.check(this.map,newShape.matrix,newShape.pos);
		log("变形碰撞检测结果="+result.touched+","+result.downed);
		if(!result.touched){
			//如果没有碰撞就变形
			this.currentShape=newShape;log('2pos='+newShape.pos.x+","+newShape.pos.y);
			this.render();
		}else{
			//不能变形
		}
		
	}

	//下落一步
	this.move=function(dir){
		if(this.gameStatus=="stop" || this.gameStatus=="pause"){
			return;
		}

		if(dir=='left'){
			this.currentShape.pos.x--;
		}else if(dir=='right'){
			this.currentShape.pos.x++;
		}else if(dir=='down'){
			this.currentShape.pos.y++;
		}

		var result=this.check(this.map,this.currentShape.matrix,this.currentShape.pos);
		
		log("移动碰撞检测结果="+result.touched+","+result.downed);

		if(!result.touched){
			//如果没有碰撞就能下降
			this.render();
		}else{
			// 触底
			if(dir=='left'){
				this.currentShape.pos.x++;
			}else if(dir=='right'){
				this.currentShape.pos.x--;
			}else if(dir=='down'){
				this.currentShape.pos.y--;
			}

			if(dir=='down'){
				var downed=触底检测(this.map,this.currentShape.matrix,this.currentShape.pos);

				if(downed){
					this.downed();
				}
			}
		}

	}

	//固化，将不能下落的方块合并固化到地图上，并且判断是否消除
	this.downed=function(){
		// this.printMap("合并前");
		合并地图(this.map,this.currentShape);
		// this.printMap("合并后");
		var lineNo=消除(this.map);
		// this.printMap("消除后");

		this.score+=this.scoreList[lineNo];

		if(this.scoreText){
			this.scoreText.html(this.score);
		}

		this.getShape();
		this.render();
	}

	this.start=function(){
		this.getShape();
		
		this.intervalId=setInterval(function(){
			var oldPosY=this.currentShape.pos.y;
			this.move('down');
			if(this.currentShape.pos.y==oldPosY){
				this.die();
			}
		},this.speed);
		this.gameStatus="running";
	}

	this.pause=function(){
		if(!(this.gameStatus=="running"||this.gameStatus=="pause")){
			return;
		}
		if(this.intervalId){
			clearInterval(this.intervalId);
			this.intervalId=0;
			this.gameStatus="pause";
		}else{
			this.intervalId=setInterval(function(){
				var oldPosY=this.currentShape.pos.y;
				this.move('down');
				if(this.currentShape.pos.y==oldPosY){
					this.die();
				}
			},this.speed);
			this.gameStatus="running";
		}
	}

	this.stop=function(){
		if(this.intervalId){
			clearInterval(this.intervalId);
			this.intervalId=0;
		}

		this.init();
		this.gameStatus="stop";
	}

	this.restart=function(){
		this.stop();
		this.start();
	}

	this.die=function(){
		clearInterval(this.intervalId);
		this.intervalId=0;
		// this.stop();
		this.gameStatus="stop";
		alert("您的分数是 "+this.score+", 点击开始重新开始。");
		// alertify.prompt( '提交分数', '您的分数是 <span style="color:red">'+this.score+'</span> 分，<br>您的姓名是：'
		// 		, ""
  //              	, function(evt, value) { 
  //              		value=value||"";
  //              		value=value.trim();
               		
  //              		if(value){
  //              			alertify.alert("没有做登录，我就不做排行榜了。");
  //              		}
  //              	}
  //              , function() { 
               		
  //       }).set({'closableByDimmer': false}); ;

	}

	this.print=function(){
		log(this.wNum+"/"+this.hNum);
		log(this.shapes);
		for(var i=0;i<this.hNum;i++){
			var temp="";
			for(var j=0;j<this.wNum;j++){
				temp+=(this.map[i][j].value+",");
			}
			log(temp);
		}
	}
	this.printMap=function(text){
		log("--------"+text+"---------");
		for(var i=0;i<this.map.length;i++){
			var line=i<10?"0"+i:i;
			line+=":";
			for(var j=0;j<this.map[i].length;j++){
				line+=this.map[i][j].value;
			}
			log(line);
		}
	}
	
	if(this.startButton)this.startButton.click(function(){self.start();});
	if(this.stopButton)this.stopButton.click(function(){self.stop()});
	if(this.pauseButton)this.pauseButton.click(function(){self.pause()});
	if(this.restartButton)this.restartButton.click(function(){self.restart()});

	return this;
}

$(function(){

	var _els=els($("#container"),
		{
			wNum:10,
			hNum:15,
			wVal:30,
			hVal:30,
			speed:500,
			startButton:$("#startButton"),
			stopButton:$("#stopButton"),
			pauseButton:$("#pauseButton"),
			restartButton:$("#restartButton"),
			scoreText:$("#scoreText")
		});

	_els.init(
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"0000000000"+
		"1111011111"+
		"1111011111"+
		"1111011111"+
		"1111011111"
		);

	$(document).keydown(function(event){
		switch (event.keyCode) {
		case 38:
			_els.change('right');
			break;//fuck
	    case 37:
	        _els.move('left');
	        break;
	    case 39:
	        _els.move('right');
	        break;
	    case 40:
	    	_els.move('down');
	    	break;
	    };
	    return false;
	});
});
