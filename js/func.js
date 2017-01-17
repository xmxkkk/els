Array.prototype.dim1clone = function() {
	var x=[];
	for(var i=0;i<this.length;i++){
		x[i]=this[i];
	}
	return x;
};

Array.prototype.dim2clone = function() {
	var x=[];
	for(var i=0;i<this.length;i++){
		x[i]=[];
		for(var j=0;j<this[i].length;j++){
			x[i][j]=this[i][j];
		}
	}
	return x;
};
String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

var 触底检测=function(map,shape,pos){
	var mapHeight=map.length;
	var mapWidth=map[0].length;

	for(var i=0;i<map.length;i++){
		for(var j=0;j<map[i].length;j++){

			for(var si=0;si<shape.length;si++){
				for(var sj=0;sj<shape[si].length;sj++){
					if(shape[si][sj]==0)continue;

					var yi=si+pos.y+1;
					var xj=sj+pos.x;

					if(yi>=map.length){
						return true;
					}else if(
						yi>=0&&yi<mapHeight && xj>=0&&xj<mapWidth
						&&
						shape[si][sj]>0 && map[yi][xj].value>0){
						return true;
					}
				}
			}
		}
	}
	return false;
}

//返回是否碰撞,这个函数还要返回shape碰撞的位置，如果是-4，那就是死了
var 碰撞检测=function(map,shape,pos){
//这个只能检测是否已经碰撞，不能判断是否触底
	var mapHeight=map.length;
	var mapWidth=map[0].length;

	for(var i=0;i<map.length;i++){
		for(var j=0;j<map[i].length;j++){

			for(var si=0;si<shape.length;si++){
				for(var sj=0;sj<shape[si].length;sj++){
					if(shape[si][sj]==0)continue;

					var yi=si+pos.y;
					var xj=sj+pos.x;

					if(xj<0 || xj>=map[i].length){
						return {touched:true,downed:false};
					}else if(yi>=map.length){
						return {touched:true,downed:true};
					}else if(yi>=0&&yi<mapHeight && xj>=0&&xj<mapWidth){
						if(map[yi][xj].value>0&&shape[si][sj]>0){
							return {touched:true,downed:true};
						}
					}

				}
			}
		}
	}
	return {touched:false,downed:false};
}

var 合并地图=function(map,shape){
	var mapHeight=map.length;
	var mapWidth=map[0].length;

	var matrix=shape.matrix;
	var color=shape.color;
	var pos=shape.pos;

	for(var i=0;i<map.length;i++){
		for(var j=0;j<map[i].length;j++){

			for(var si=0;si<matrix.length;si++){
				for(var sj=0;sj<matrix[si].length;sj++){

					var yi=si+pos.y;
					var xj=sj+pos.x;

					if(matrix[si][sj]>0){
						if(yi>=0&&yi<mapHeight && xj>=0&&xj<mapWidth){
							map[yi][xj]={
								value:1,
								color:color
							}
						}
					}
				}
			}
		}
	}
}

var 随机方块=function(shapes){
	var shapeType=parseInt(Math.random()*shapes.length);
	var shape=shapes[shapeType];
	var currDir=parseInt(Math.random()*shape.shape.length);
	var matrix=shapes[shapeType].shape[currDir];
	var color=随机颜色();

	return {shape:shape,matrix:matrix,currDir:currDir,shapeType:shapeType,color:color};
}

var 旋转=function(shapes,shapeType,currDir,dir){
	
	var shape=shapes[shapeType];

	var len=shapes[shapeType].shape.length;
	
	if(dir=="right"){
		currDir++;
	}else if(dir=="left"){
		currDir+=(len-1);
	}

	currDir=currDir%len;

	var matrix=shapes[shapeType].shape[currDir];
	return {shape:shape,matrix:matrix,currDir:currDir,shapeType:shapeType};
}
var 消除=function(map){
	var delLines=[];
	for(var i=0;i<map.length;i++){
		var len=map[0].length;

		for(var j=0;j<map[i].length;j++){
			if(map[i][j].value>0){
				len--;
			}
		}
		if(len == 0){
			delLines[delLines.length]=i;
		}
	}
	console.log('消除了吗='+delLines);

	for(var i=0;i<delLines.length;i++){
		for(var line=delLines[i];line>=0;line--){
			if(line==0){
				var len=map[0].length;
				var temp=[];
				for(var x=0;x<len;x++){
					temp[temp.length]={
						value:0,
						color:"rgb("+random(66,66)+","+random(66,66)+","+random(66,66)+")"
					}
				}
				map[0]=temp;
			}else{
				map[line]=map[line-1];
			}
		}
	}
	return delLines.length;
}
//怎么判断死亡呢？
var 死亡判断=function(map,shape){

}

var random=function(start,end){
	return parseInt(Math.random()*(end-start))+start;
}

var 随机颜色=function(){
	return 'rgb('+random(0,180)+','+random(0,180)+','+random(0,180)+')';
}

var printArray=function(arr){
	for(var i=0;i<arr.length;i++){
		var temp=i<10?"0"+i:i;
		temp+=":";
		for(var j=0;j<arr[i].length;j++){
			temp+=arr[i][j];
		}
		console.log(temp);
	}
}