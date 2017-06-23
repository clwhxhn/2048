var game={
  data:null,//保存数据的二维数组(将来要把数据更新到页面中)
  RN:4,//行数
  CN:4,//列数
  score:0,//保存游戏得分
  state:1,
  RUNNING:1,
  GAMEOVER:0,
  start:function(){//1.游戏初始化
    this.state=this.RUNNING;
    this.score=0;//游戏开始时
    //对象自己的方法调用自己的属性要用this.
    this.data=[];
    for(var r=0;r<this.RN;r++){
      this.data[r]=[];
      for(var c=0;c<this.CN;this.data[r][c]=0,c++);
    }
    //调用randonNum方法，在data中随机生成两个数
    this.randomNum();
    this.randomNum();
    //调用updateView方法，把数据更新到页面中
    this.updateView();
    //console.log(this.data.join("\n"));
    document.onkeydown=function(e){
     /*只要单击了键盘按键就会自动触发事件处理函数 
        相当于调用了document.onkeydowm(//this->document)*/
      switch(e.keyCode){
        case 37://左移
          this.moveLeft();
          break;
        case 39://右移
          this.moveRight();
          break;
        case 38://上移
          this.moveUp();
          break;
        case 40://下移
          this.moveDown();
          break;
      }
    }.bind(this);//此时document.onkeydown()这个回调函数中的this指的是调用start方法的对象game
  },
 //把上下左右移动(所有)中的重复代码集中定义在一个函数中
  move:function(callback){
    var before=String(this.data);
    callback.call(this);
      //因为callback()前没有用任何东西调用，所以callback()中的this默认指window,=>用call可以把this变为当前对象
        //ex:moveDown调用move方法，要保证moveDown中的this不变，就要把callback()中的this绑定为将来调用该函数的对象(即当前对象)
                                                               //或者在moveDown中通bind永久绑定this
    var after=String(this.data);
    if(before!=after){
      this.randomNum();
      if(this.isGameOver()){//如果游戏结束，修改游戏状态
        this.state=this.GAMEOVER;
      }
      this.updateView();
    }
  },    
 //下移
  moveDown:function(){//下移所有列
    this.move(function(){
      for(var c=0;c<this.CN;c++){
        this.moveDownInCol(c);
      }
    }/*或在此处.bind(this)*/);
  }, 
  moveDownInCol:function(c){//下移每一列
    for(var r=this.RN-1;r>0;r--){
      var up=this.getUpInCol(r,c);
      if(up!=-1){
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[up][c];
          this.data[up][c]=0;
          r++;
        }else{
          if(this.data[r][c]==this.data[up][c]){
            this.data[r][c]*=2;
            this.data[up][c]=0;
            this.score+=this.data[r][c];
          }
        }
      }
    }
  },
  getUpInCol:function(r,c){
    r--;
    for(;r>=0;r--){
      if(this.data[r][c]!=0){
        return r;
      }
    }
    return -1;
  },    
 //上移
  moveUp:function(){//上移所有列
    this.move(function(){
      for(var c=0;c<this.CN;c++){//遍历每一列
        this.moveUpInCol(c);
      }
    });
  },
  moveUpInCol:function(c){
    for(var r=0;r<this.RN-1;r++){
      var next=this.getNextInCol(r,c);
      if(next!=-1){
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[next][c];
          this.data[next][c]=0;
          r--;
        }else{
          if(this.data[r][c]==this.data[next][c]){
            this.data[r][c]*=2;
            this.data[next][c]=0;
            this.score+=this.data[r][c];
          }
        }
      }
    }
  },
  getNextInCol:function(r,c){
    r++;
    for(;r<this.RN;r++){
      if(this.data[r][c]!=0){
        return r;
      }
    }
    return -1;
  },
 //右移
  moveRight:function(){//右移所有行
    this.move(function(){
      for(var r=0;r<this.RN;r++){
        this.moveRightInRow(r);
      }
    });
  },
  moveRightInRow:function(r){//右移一行
    for(var c=this.CN-1;c>0;c--){//遍历当前行中的所有元素
      var prev=this.getPrevInRow(r,c);//prev是当前元素前一个不为0的下标
      if(prev!=-1){
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[r][prev];
          this.data[r][prev]=0;
          c++;
        }else{
          if(this.data[r][c]==this.data[r][prev]){
            this.data[r][c]*=2;
            this.data[r][prev]=0;
            this.score+=this.data[r][c];
          }
        }
      }
    }
  },
  getPrevInRow:function(r,c){//找前一个元素
    c--;
    for(;c>=0;c--){
      if(this.data[r][c]!=0){
        return c;
      }
    }
    return -1;
  },
 //左移
  moveLeft:function(){//左移所有行
    this.move(function(){
      for(var r=0;r<this.RN;r++){
        //调用moveLeftInRow
        this.moveLeftInRow(r);
      }
    });
  },
  moveLeftInRow:function(r){//左移一行
    for(var c=0;c<this.CN-1;c++){
      //找下一个不为0的元素的下标nextc
      var nextc=this.getNextInRow(r,c);
      if(nextc!=-1){
        if(this.data[r][c]==0){
          this.data[r][c]=this.data[r][nextc];
          this.data[r][nextc]=0;
          c--;
        }else{//现在r行c的位置的元素不为0
          if(this.data[r][c]==this.data[r][nextc]){
            this.data[r][c]*=2;
            this.data[r][nextc]=0;
            this.score+=this.data[r][c];
          }
        }
      }
    }
  },
  getNextInRow:function(r,c){//找下一个不为0的元素
    c++;
    for(;c<this.CN;c++){
      if(this.data[r][c]!=0){
        return c;
      }
    }
    return -1;
  },
 //游戏结束
  /*1.如果当前元素为0，返回false
    2.如果当前元素等于右边的元素，返回false
    3.如果当前元素等于下边的元素，返回false
    否则，返回true*/
  isGameOver:function(){
    //遍历数组
    for(var r=0;r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
        if(this.data[r][c]===0){
          return false;
        }
        if(c<this.CN-1&&(this.data[r][c]===this.data[r][c+1])){
          return false;
        }
        if(r<this.RN-1&&(this.data[r][c]===this.data[r+1][c])){
          return false;
        }
      }
    }
    return true;
  },
  randomNum:function(){//2.游戏开始时，生成两个数
    while(true){//满足条件要break
      var r=Math.floor(Math.random()*4);
      var c=Math.floor(Math.random()*4);
      //如果生成的位置有数字，就要换位，直到该位置为空为止,所以要用while循环
      if(this.data[r][c]==0){
        this.data[r][c]=Math.random()<0.5?2:4;
        break;
      }
    }
  },
  updateView:function(){//3.游戏开始时，把data中的数据更新到页面中
    for(var r=0;r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
        var div=document.getElementById("c"+r+c);
        if(this.data[r][c]!=0){
          div.innerHTML=this.data[r][c];
          div.className="cell n"+this.data[r][c];
        }else{
          div.innerHTML="";
          div.className="cell";
        }
      }
    }
    document.getElementById("score").innerHTML=this.score;
    document.getElementById("gameOver").style.display=(this.state===this.GAMEOVER)?"block":"none";
  },
};
game.start();