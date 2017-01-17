var shapes=
[
	{
		shape:[
			[
				[0,1,0],
				[1,1,1]
			],
			[
				[1,0],
				[1,1],
				[1,0]
			],
			[
				[1,1,1],
				[0,1,0]
			],
			[
				[0,1],
				[1,1],
				[0,1]
			]
		],
		color:"red"
	},
	{
		shape:[
			[
				[1,1,1,1]
			],
			[
				[1],
				[1],
				[1],
				[1]
			]
		],
		color:"blue"
	}
];





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


var 旋转=function(typeIdx,currDir,dir){
	var len=shapes[typeIdx].shape.length;

	if(dir=="right"){
		currDir++;
	}else if(dir=="left"){
		currDir+=(len-1);
	}

	currDir=currDir%len;

	var x=shapes[typeIdx].shape[currDir];

	var result=[];

	return x.dim2clone();
};

var 碰撞检测=function(map,shape,xw,yh){
	for(var i=0;i<map.length;i++){
		for(var j=0;j<map[i].length;j++){

			for(var si=0;si<shape.length;si++){
				for(var sj=0;sj<shape[si].length;sj++){

					var yi=si+yh;
					var xj=sj+xw;

					if(xj<0 || xj>=map[i].length || yi>=map.length){
						return true;
					}else if(yi>=0&&yi<i && xj>=0&&xj<j){
						if(map[yi][xj]>0&&shape[si][sj]>0){
							return true;
						}
					}

				}
			}
		}
	}
	return false;
}

var 合并地图=function(map,shape,xw,yh){
	for(var i=0;i<map.length;i++){
		for(var j=0;j<map[i].length;j++){

			for(var si=0;si<shape.length;si++){
				for(var sj=0;sj<shape[si].length;sj++){

					var yi=si+yh;
					var xj=sj+xw;


				}
			}
		}
	}
}

var 随机方块=function(shapes){
	var shape=shapes[parseInt(Math.random()*shapes.length)];
	var currDir=parseInt(Math.random()*shape.shape.length);

	return {shape:shape,currDir:currDir};
}

console.log(随机方块(shapes));


var map=[
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,1,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0]
]
var shape=[
	[0,1],
	[1,1],
	[0,1]
]





//console.log(碰撞检测(map,shape,4,0));




//console.log(旋转(0,0,"left"));