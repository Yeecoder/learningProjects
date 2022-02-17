let GlobalTimeSet = {
  day : 1,
  week : 1,
  timer : undefined,
  StartTimeInterval : function() {
    //获取星期和日期，初始默认为W1,D1
    let day_elem = document.getElementsByClassName("Week-Content")[0];   
    let week_elem = document.getElementsByClassName("Weeks-Content")[0];
    let dayframe = function() {
      GlobalTimeSet.day++; 
      if(GlobalTimeSet.day < 8) {
        //等4分钟为1天，1天后，增加天数
        day_elem.innerHTML = "D" + GlobalTimeSet.day;
        //更新天数之后，重置顾客，即使得所有顾客都可以重新进入餐厅
        Customers.allCustomers = Customers.constAllCustomers;
        //重置所有全局变量
        customerAndSet = {};
        setAndCustomer = {};
        customerAndMenu = {};
        menuAndCustomerAndChef = {};
        curMenuAndCustomerQue = [];
        customerAndMenuNum = {};
        customerAndMenuOutTimeNum = {};
        customerAndMenuHaveEatNum = {};
        customerAndFree = {};
          //等候区大小，每次创建完新的等候区顾客时自减一，点击等候区后自增一
        Customers.waitingCustomersLimit = 6;
        //等候时间，相对于一天的时间设置，一般不变
        Customers.waitingTime = 500;
        //等候区队列，每次创建顾客且进入等候区时要入队，点击等候区后要出队
        Customers.waitingCustomersQue = [];
        //等候区队列的索引，每次创建等候区顾客时要入队，点击等候区后要出队
        Customers.waitingCustomersQueIndex = [];
        //等候区顾客的元素队列，每次创建等候区顾客时要入队，点击等候区后要出队
        Customers.waitingCustomersQueEle = [];
        //更新天数时重置用
        Customers.constAllCustomers = ['379339-512','379444-512','379446-512','379448-512','iconfinder_Boss-3_379348','iconfinder_Man-16_379485','iconfinder_Rasta_379441'];
        //所有可能到达餐厅的用户，每天随机从里面选取顾客
        Customers.allCustomers = ['379339-512','379444-512','379446-512','379448-512','iconfinder_Boss-3_379348','iconfinder_Man-16_379485','iconfinder_Rasta_379441'];
        //当天去过餐厅的顾客，每次创建等候区顾客成功时要自增1，当和所有用户长度一致时停止创建新顾客
        Customers.visitedCustomers = 0;
        //全部座位的数量，随着创建的座位数量变化，一般不变
        // customersSets = document.getElementsByClassName("Customer").length,
        Customers.customersSets = 6;
        //有空座位的Flag
        Customers.haveFreeSetFlag = 0;
        //有等待的顾客的Flag
        Customers.haveWaitingFlag = 0;
        //正在点菜的顾客的名字
        Customers.cur_first_customer_name = undefined;
        //三类菜单中被选择了的checkbox的索引
        Customers.coldSelectedIdx = undefined;
        Customers.hotSelectedIdx = undefined;
        Customers.drinkSelectedIdx = undefined;
        //三类菜单中是否已经被勾选
        Customers.coldChecked = 0;
        Customers.hotChecked = 0;
        Customers.drinkChecked = 0;
        //正在点菜的顾客预计花费的费用，即点了多少钱的菜
        Customers.cur_first_customer_free = 0;
        //顾客等待定时器
        Customers.waitingTimer = {};
        //顾客等候区计时器
        Customers.waitingHasNoSetTimer = {};
        //厨师做菜定时器
        Chefs.cookingTimer = {};
        //厨师工资
        Chefs.chefCost = 100;
        //厨师数量限制
        Chefs.chefNumLimit = 6;
        //解雇当前厨师需要结算的工资
        Chefs.curChefCostFee = 0;
        //厨师正在做菜的进度条
        Chefs.chefCookingTimer = {};
        //顾客吃菜进度条
        Chefs.customerEatingTimer = {};
      }
      else {
        //当天数等于8时，说明一周已经过完，重置day为1，回到周一，星期数自增1
        GlobalTimeSet.day = 1;
        day_elem.innerHTML = "D" + GlobalTimeSet.day;
        GlobalTimeSet.day++;
        GlobalTimeSet.week++;
        //一年为52周，当周数大于等于53时，结束游戏，停止计数
        if(GlobalTimeSet.week >= 53) {
          GlobalTimeSet.StopTimeInterval();
        }
        week_elem.innerHTML = "W" + GlobalTimeSet.week;
        //更新星期后，总资产减去所有厨师一共的工资
        let leftDespositNum = document.getElementsByClassName("LeftDesposit-Num")[0];
        leftDespositNum.innerHTML = parseInt(leftDespositNum.innerHTML) - Chefs.chefsNum * 100;
      }
    }
    GlobalTimeSet.timer = setInterval(dayframe,240000);
  },
  StopTimeInterval : function() {
    clearInterval(GlobalTimeSet.timer);
  },
  PauseTimeInterval : function() {
    GlobalTimeSet.StopTimeInterval();
  }
}

//获取位置信息，设置添加厨师的ChefWrap的十字标识
let rect = document.getElementsByClassName("AddChefImg")[0];
//中心位置
let center = {
    left: rect.offsetLeft + rect.offsetWidth / 2,
    top: rect.offsetTop + rect.offsetWidth / 2
}
let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

//最终的 左 和 上位置
center.left = screenLeft + center.left;
center.top = scrollTop + center.top;
let mystyle = document.createElement("style");
let textbeforeleft = document.createTextNode(".AddChef:before{left:"+ center.left +"px}");    // 添加伪类样式
let textbeforetop = document.createTextNode(".AddChef:before{top:"+ center.top +"px}");    // 添加伪类样式
mystyle.appendChild(textbeforeleft);
mystyle.appendChild(textbeforetop);
document.body.appendChild(mystyle);

let textafterleft = document.createTextNode(".AddChef:after{left:"+ center.left +"px}");    // 添加伪类样式
let textaftertop = document.createTextNode(".AddChef:after{top:"+ center.top +"px}");    // 添加伪类样式

mystyle.appendChild(textafterleft);
mystyle.appendChild(textaftertop);
document.body.appendChild(mystyle);

//设置菜单、提示等的阴影部分，一个全局的覆盖整个屏幕的黑色半透明遮罩
let cover = document.getElementsByClassName("Cover")[0];
cover.style.height = document.body.clientHeight+'px';
//设置第一次进入时的提示信息栏，一次性使用，
let AlarmFirst = document.getElementsByClassName("Alarm-Initial")[0];
let button = document.getElementsByClassName("Alarm-Confirm-Button")[0];
button.addEventListener("click",hiddwnConfirm);
function hiddwnConfirm() {
    //初始提示信息栏和遮罩为可见的，点击后将两者都变成不可见的
    AlarmFirst.style.display="none";
    cover.style.display="none";
    //点击开始，启动全局计时，
    GlobalTimeSet.StartTimeInterval();
    //开始以随机时间生成顾客，并送入等候区
    Customers.createCustomer();
    //为等候区添加EventListener，即，点击后如果有空座位，将最先来的顾客送入空座位
    Customers.addELToWaitingCustomers();
    //为添加和删除厨师添加EventListener，添加和删除厨师确认面板初始化为不可见，当有需要时修改display
    Chefs.addEventListenerToAddChef();
    Chefs.addEventListenerToRemoveChef();
    //需要一直检查是否有顾客
    Customers.checkWaitingAndFreeSet();
    Chefs.setFirstChefUnableToFire();
}
//生成minNum至maxNum之间的随机数s
function randomNum(minNum,maxNum){ 
  switch(arguments.length){ 
      case 1: {
        return parseInt(Math.random()*minNum+1,10); 
        break; 
      }
      case 2: {
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
      }
      default: {
        return 0; 
        break; 
      }
  } 
} 

//顾客和座位、座位和顾客的对应关系
customerAndSet = {};
setAndCustomer = {};
//顾客和点的菜的对应关系
customerAndMenu = {};
//顾客的菜、顾客名字和做菜的厨师之间的对应关系，可以唯一确定一个厨师的位置
menuAndCustomerAndChef = {};
//菜单和顾客的队列
curMenuAndCustomerQue = [];
//顾客点的菜的数量
customerAndMenuNum = {};
//顾客超时的菜的数量
customerAndMenuOutTimeNum = {};
//顾客吃完的菜的数量
customerAndMenuHaveEatNum = {};
//顾客和消费金额的对应关系
customerAndFree = {};

//菜和对应的成本和售价，全局变量，可修改
menuCostAndSold = {
  "凉拌SAN" : [3,6],
  "冷切DOM" : [2,4],
  "UL炖LI" : [6,12],
  "红烧HEAD" : [7,15],
  "酥炸Echarts" : [9,18],
  "炙烤CSS" : [8,16],
  "清蒸DIV" : [6,12],
  "鲜榨flex" : [2,5],
  "小程序奶茶" : [3,6]
};

//根据值删除数组中的元素
function removeByVal(arrylist,val) {
	for(let i = 0; i < arrylist.length;i++) {
		if(arrylist[i] == val) {
			arrylist.splice(i,1);
			break;
		}
	}
}


let Customers = {
  //等候区大小，每次创建完新的等候区顾客时自减一，点击等候区后自增一
  waitingCustomersLimit : 6,
  //等候时间，相对于一天的时间设置，一般不变
  waitingTime : 500,
  //等候区队列，每次创建顾客且进入等候区时要入队，点击等候区后要出队
  waitingCustomersQue : [],
  //等候区队列的索引，每次创建等候区顾客时要入队，点击等候区后要出队
  waitingCustomersQueIndex : [],
  //等候区顾客的元素队列，每次创建等候区顾客时要入队，点击等候区后要出队
  waitingCustomersQueEle : [],
  //更新天数时重置用
  constAllCustomers : ['379339-512','379444-512','379446-512','379448-512','iconfinder_Boss-3_379348','iconfinder_Man-16_379485','iconfinder_Rasta_379441'],
  //所有可能到达餐厅的用户，每天随机从里面选取顾客
  allCustomers : ['379339-512','379444-512','379446-512','379448-512','iconfinder_Boss-3_379348','iconfinder_Man-16_379485','iconfinder_Rasta_379441'],
  //当天去过餐厅的顾客，每次创建等候区顾客成功时要自增1，当和所有用户长度一致时停止创建新顾客
  visitedCustomers : 0,
  //全部座位的数量，随着创建的座位数量变化，一般不变
  // customersSets : document.getElementsByClassName("Customer").length,
  customersSets : 6,
  //有空座位的Flag
  haveFreeSetFlag : 0,
  //有等待的顾客的Flag
  haveWaitingFlag : 0,
  //正在点菜的顾客的名字
  cur_first_customer_name : undefined,
  //三类菜单中被选择了的checkbox的索引
  coldSelectedIdx : undefined,
  hotSelectedIdx : undefined,
  drinkSelectedIdx : undefined,
  //三类菜单中是否已经被勾选
  coldChecked : 0,
  hotChecked : 0,
  drinkChecked : 0,
  //正在点菜的顾客预计花费的费用，即点了多少钱的菜
  cur_first_customer_free : 0,
  //顾客等待定时器
  waitingTimer : {},
  //顾客等候区计时器
  waitingHasNoSetTimer : {},
  //生成顾客
  createCustomer : function() {
    //等待区大小如果大于0，就可以一直生成顾客
    if(Customers.waitingCustomersLimit > 1) {
      //设置随机时间新建顾客，即300-500毫秒调用一次
      let randomCreateTime = randomNum(3000,15000);
      setTimeout("Customers.createCustomer()", randomCreateTime);
    }
    else {
      //如果等候区满了，可以再生成顾客，但是这时生成的顾客不再进入等候区，而是直接离开
      //需要让当天去过餐厅的顾客数自增1，
      let idx = randomNum(0,Customers.allCustomers.length);
      while(Customers.allCustomers[idx] === undefined) {
        //随机从顾客列表中选取顾客进入餐厅，如果被选到的顾客已经去过餐厅，即在数组中为undefined，则重新生成
        //在重新生成前，要判断是否顾客列表中所有顾客都进入过了餐厅，如果是，则停止选取，并结束函数
        if(Customers.visitedCustomers === Customers.allCustomers.length) {
          return;
        }
        //如果还有顾客没进入过餐厅，则重新生成，直到满足条件
        idx = randomNum(0,Customers.allCustomers.length);
      }//选取成功后，将当前去过餐厅的顾客数自增1，并从列表中删除选取到的顾客。delete的好处在于，会移除元素，但不改变数组长度
      Customers.visitedCustomers++;
      delete Customers.allCustomers[idx];
    }//如果等候区未满，则新生成顾客，逻辑同上，
    let idx = randomNum(0,Customers.allCustomers.length);
    while(Customers.allCustomers[idx] === undefined) {
      if(Customers.visitedCustomers === Customers.allCustomers.length) {
        return;
      }
      idx = randomNum(0,Customers.allCustomers.length);
    }
    Customers.visitedCustomers++;
    //成功选取出顾客后，要将该顾客送入等候区
    //获取等待顾客列表的父元素
    let father = document.getElementsByClassName("newCustomers")[0];
    //创建等待顾客，将生成顾客在顾客列表中的顺序和wrap绑定在一起，方便识别
    let wrap = document.createElement("div");
    wrap.setAttribute("class","newCustomerWrap"+idx);
    wrap.style.cssText = "display: flex;flex-direction: column;justify-content: center;align-items: center;margin: 0 -40px 0 -40px;";
    let newcus = document.createElement("div");
    newcus.setAttribute("class","newCustomer"+idx);
    newcus.style.cssText = `height: 70px;
    width: 70px;
    margin: 25px 25px 5px 25px;;
    border: 5px solid;
    border-color: #fff;
    border-radius: 50%;
    background: linear-gradient(to right, #ddd 0%,#ddd 50%,#aaaaaa 51%,#aaaaaa 100%);`;
    let newimg = document.createElement("img");
    newimg.style.cssText = `width : 100%;height: 100%;`;
    newimg.setAttribute("src","../imgs/"+Customers.allCustomers[idx]+".png");
    //将新建的等待区顾客的名字送入等候区队列，便于进行点菜时的显示名字
    Customers.waitingCustomersQue.push(Customers.allCustomers[idx]);
    //将新建的等待区顾客的索引送入队列，方便移除
    Customers.waitingCustomersQueIndex.push(idx);
    newcus.appendChild(newimg);
    //创建进度条
    let newbox = document.createElement("div");
    newbox.setAttribute("class","progress-box"+idx);
    newbox.style.cssText = `width: 100px;
    background-color: #2693ff;
    border: 2px solid;
    border-color: #fff;
    border-radius: 25px;`;
    let newboxtext = document.createElement("div");
    newboxtext.setAttribute("class","progress-text"+idx);
    newboxtext.style.cssText = `width: 0%;
    height: 30px;
    background-color: #006dd9;
    text-align: center;
    line-height: 30px;
    color: white;
    border: 2px 0px 2px 0 solid;
    border-color: #fff;
    border-radius: 25px;`;
    //初始进度条显示内容为0%
    newboxtext.innerHTML = "0%";
    newbox.appendChild(newboxtext);
    wrap.appendChild(newcus);
    wrap.appendChild(newbox);
    father.appendChild(wrap);
    //将新建的等待区顾客元素送入队列，方便移除
    Customers.waitingCustomersQueEle.push(wrap);
    //从所有用户数组中删除已经进入过等候区的用户，后期无论队首的顾客因超时直接离开、点菜或是取消点菜离开
    //都可以保证不会当天不会再次进入，同时保持用户数组的长度，保证随机生成的idx一直能覆盖到所有
    delete Customers.allCustomers[idx];
    Customers.waitingCustomersLimit--;
    //当创建完成等候区顾客及其对应的耐心进度条后，开始移动该顾客对应的进度条，通过传递idx参数进行绑定
    Customers.move(idx);
  },
  //使进度条可以移动
  move : function (cur_progress_idx) {
    //找到当前需要移动的进度条，进度条初始宽度为0%
    let elem = document.getElementsByClassName("progress-text"+cur_progress_idx)[0];   
    let width = 0;
    // let newcustomer = document.getElementsByClassName("newCustomer"+cur_progress_idx)[0];
    // let progress = document.getElementsByClassName("progress-box"+cur_progress_idx)[0];
    let id = setInterval(frame, Customers.waitingTime);
    //
    // Customers.waitingHasNoSetTimer[cur_progress_idx] = setInterval(frame, Customers.waitingTime);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        //进度条走满之后根据对应的位置停止计数
        // Customers.stopWaitingCustomerProgress(Customers.waitingHasNoSetTimer[cur_progress_idx]);
        // newcustomer.style.display = "none";
        // progress.style.display = "none";
        //移动进度条到最后，将队首顾客、队首顾客的页面元素、队首顾客的索引分别出队列
        Customers.waitingCustomersQueEle.shift();
        Customers.waitingCustomersQueIndex.shift();
        Customers.waitingCustomersQue.shift();
        //将等候区大小自增1，即空出一个等候区的位置
        Customers.waitingCustomersLimit++;
        //从等候区移除这个顾客
        let fatherArea = document.getElementsByClassName("newCustomers");
        if(fatherArea[0].childNodes.length !== 0) {
          fatherArea[0].removeChild(fatherArea[0].childNodes[0]);
        }
        else {
          ;
        }
      } else {//如果没走满，每次将进度条的宽度增加一个百分点
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = width * 1  + '%';
      }
    }
  },
  stopWaitingCustomerProgress : function(ProgressId) {
    clearInterval(ProgressId);
  },
  //检查是否有正在等待的顾客
  checkWhetherHaveWaitingCustomer : function() {
    if(Customers.waitingCustomersQue.length !== 0) {
        return 1;
    }
    else {
      return 0;
    }
  },
  //检查是否有空座位
  checkWhetherHaveFreeSet : function() {
    if(Customers.customersSets > 0) {
        return 1;
    }
    else {
      return 0;
    }
  },
  //检查是否有空座位和正在等待的顾客，并根据检查结果进行提示，提示框可以手动点击关闭也可以自动关闭
  checkWaitingAndFreeSet : function() {
    if(Customers.checkWhetherHaveFreeSet() && Customers.checkWhetherHaveWaitingCustomer()){
      setTimeout("Customers.checkWaitingAndFreeSet()", 10000);//每秒钟检查一次
      let HaveFreeSetAndNewCustomers = document.getElementsByClassName("HaveFreeSetAndNewCustomers")[0];
      HaveFreeSetAndNewCustomers.style.display = '';
      cover.style.display='';
      function setHaveFreeAndCustomerHidden() {
          HaveFreeSetAndNewCustomers.style.display = "none";
          cover.style.display="none";
          handle = 1;
      }
      let handle = 0;
      HaveFreeSetAndNewCustomers.addEventListener("click",setHaveFreeAndCustomerHidden);
      setTimeout(function () {
          if(handle === 0) {
              setHaveFreeAndCustomerHidden();
          }
          else {
              ;
          }
      }, 2000);
    }
  },
  //为等候区添加EventListerner，在添加之前先删除，确保不会重复绑定
  addELToWaitingCustomers : function() {
    if(Customers.checkWhetherHaveWaitingCustomer()){
      let waitingCustomersArea = document.getElementsByClassName("newCustomers")[0];
      try {
        waitingCustomersArea.removeEventListener("click",Customers.removeCustomerFromWaitingQue);
      }
      catch(err) {
        ;
      }
      waitingCustomersArea.addEventListener("click",Customers.removeCustomerFromWaitingQue);
    }
  },
  //点击等候区之后将等候区队列中的队首元素出队，并从页面中删除这个元素
  removeCustomerFromWaitingQue : function() {
    let customerLookingMenuEle = Customers.waitingCustomersQueEle.shift();
    let customerLookingMenu = Customers.waitingCustomersQue.shift();
    Customers.cur_first_customer_name = customerLookingMenu;
    Customers.waitingCustomersLimit++;
    let customerLookingMenuIndex = Customers.waitingCustomersQueIndex.shift();
    console.log(customerLookingMenu,customerLookingMenuEle,customerLookingMenuIndex,Customers.waitingCustomersLimit);
    let fatherArea = document.getElementsByClassName("newCustomers")[0];
    fatherArea.removeChild(fatherArea.childNodes[0]);
    Customers.showMenu(customerLookingMenuEle);
    Customers.stopWaitingCustomerProgress(customerLookingMenuIndex);
  },
  //移除之后显示菜单，并将刚刚移出队列的用户头像放置到菜单左上角
  showMenu : function(ele) {
    //为不吃了按钮添加EventListener，同样先删再加防止重复绑定事件
    let leaveButton = document.getElementsByClassName("LeaveThere")[0];
    try {
      leaveButton.removeEventListener("click",Customers.customerLeave);
    }
    catch(err) {
      ;
    }
    leaveButton.addEventListener("click",Customers.customerLeave);
    //添加一个当前正在点菜的顾客的头像（可以用position:absolute放在菜单里，每次更新img
    let Menu = document.getElementsByClassName("Menu")[0];
    let wrap = document.createElement("div");
    let father = document.getElementsByClassName("mainGame")[0];
    wrap.setAttribute("class","curCustomerWrap");
    let newcus = document.createElement("div");
    newcus.setAttribute("class","curCustomer");
    let newimg = document.createElement("img");
    newimg.setAttribute("src",ele.children[0].children[0].getAttribute("src"));
    newcus.appendChild(newimg);
    wrap.appendChild(newcus);
    father.appendChild(wrap);
    //添加完顾客头像后，更新菜单的title，体现当前顾客正在点菜并且已经点了多少菜
    Menu.childNodes[1].innerText = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
    //当唤起点菜面板时，判断是否已经有了顾客和菜的对应关系、顾客和已经点了的菜的总数量的对应关系
    //如果没有，则添加
    //如果有，说明该顾客已经点过菜了，但同一天顾客不会来两次餐厅，所以不存在这样的情况，所以可以不考虑
    if(Customers.cur_first_customer_name in customerAndMenu === false) {
      customerAndMenu[Customers.cur_first_customer_name] = [];
      customerAndMenuNum[Customers.cur_first_customer_name] = 0;
    }
    //这时为每个checkbox添加EventListener，每次点击checkbox，状态改变后，判断是否点了这个菜、是否满足可以下单的条件
    //根据判断结果修改已点菜的总数、总预计消费
    Customers.addEventListenerToEveryCheckbox();
    //添加完上述内容后，再显示菜单，避免用户点击时还没有完成准备
    Menu.style.display = '';
    cover.style.display = '';
    //三类菜单中被选择了的checkbox的索引，有一个类被选中，则设置对应的index
    Customers.coldSelectedIdx = undefined;
    Customers.hotSelectedIdx = undefined;
    Customers.drinkSelectedIdx = undefined;
    //三类菜单中是否已经被勾选，有一个类被选中，则设置对应的为1
    Customers.coldChecked = 0;
    Customers.hotChecked = 0;
    Customers.drinkChecked = 0;
  },
  //如果顾客点菜或未点菜后选择离开，隐藏菜单，删除顾客头像
  //重置checkbox状态，重置两个button状态
  customerLeave : function () {
    let Menu = document.getElementsByClassName("Menu")[0];
    let wrap = document.getElementsByClassName("curCustomerWrap")[0];
    let father = document.getElementsByClassName("mainGame")[0];
    //顾客选择不吃了之后，将菜单和遮罩均设置为不可见
    Menu.style.display = 'none';
    cover.style.display = 'none';
    father.removeChild(wrap);//移除该顾客的头像
    Customers.cur_first_customer_free = 0;//重置当前正在点菜的顾客的名字和预计的开销
    Customers.cur_first_customer_name = undefined;
    let cold = document.getElementsByClassName("colddishcheckbox-box");
    for(let i=0;i<cold.length;i++) {
      cold[i].disabled = false;
      cold[i].checked = false;
    }//将所有checkbox复原，并移除不可选的状态
    let hot = document.getElementsByClassName("hotdishcheckbox-box");
    for(let i=0;i<hot.length;i++) {
      hot[i].disabled = false;
      hot[i].checked = false;
    }//将所有checkbox复原，并移除不可选的状态
    let drink = document.getElementsByClassName("drinkcheckbox-box");
    for(let i=0;i<drink.length;i++) {
      drink[i].disabled = false;
      drink[i].checked = false;
    }//将所有checkbox复原，并移除不可选的状态
    let finishButton = document.getElementsByClassName("Finish")[0];//将完成点餐按钮的颜色复原，因为顾客点的菜已经满足了下单要求
    finishButton.style.background = "linear-gradient(to top, #ded3ba 0%,#ded3ba 50%,#d3c6a5 51%,#d3c6a5 100%)";

  },
  //顾客点完菜后并且检查完菜单是否合适后，隐藏菜单，将顾客送入座位，空座位数量减一
  //删除顾客头像，同时重置checkbox状态，重置两个button状态
  finishButton : function () {
    Customers.customersSets--;
    let cold = document.getElementsByClassName("colddishcheckbox-box");
    for(let i=0;i<cold.length;i++) {
      cold[i].disabled = false;
      cold[i].checked = false;
    }
    let hot = document.getElementsByClassName("hotdishcheckbox-box");
    for(let i=0;i<hot.length;i++) {
      hot[i].disabled = false;
      hot[i].checked = false;
    }
    let drink = document.getElementsByClassName("drinkcheckbox-box");
    for(let i=0;i<drink.length;i++) {
      drink[i].disabled = false;
      drink[i].checked = false;
    }
    //重置完checkbox的状态后使菜单和遮罩不可见，并删除当前顾客头像
    let Menu = document.getElementsByClassName("Menu")[0];
    let wrap = document.getElementsByClassName("curCustomerWrap")[0];
    Menu.style.display = 'none';
    cover.style.display = 'none';
    let father = document.getElementsByClassName("mainGame")[0];
    //将点的菜和对应的顾客添加到菜品和顾客队列中
    for(let c=0;c<customerAndMenu[Customers.cur_first_customer_name].length;c++) {
      // tmp = {};
      // tmp[customerAndMenu[Customers.cur_first_customer_name][c]] = Customers.cur_first_customer_name;
      tmp = [];//将顾客点的所有菜，拆分成单个的，和顾客的名字一起送入到需要被制作的菜的队列中
      tmp.push(customerAndMenu[Customers.cur_first_customer_name][c]);
      tmp.push(Customers.cur_first_customer_name);
      curMenuAndCustomerQue.push(tmp);
    }
    //将顾客送入座位
    Customers.getFreeSet(wrap);
    father.removeChild(wrap);
    Customers.cur_first_customer_free = 0;
    // Customers.cur_first_customer_name = undefined;
    //点击完下单按钮之后，将按钮颜色复原，并且移除绑定的事件，防止多次绑定
    let finishButton = document.getElementsByClassName("Finish")[0];
    finishButton.style.background = "linear-gradient(to top, #ded3ba 0%,#ded3ba 50%,#d3c6a5 51%,#d3c6a5 100%)";
    Customers.showFinishedAndWaitingAlarm();//显示已经完成下单的提示，并且弹出加快速度的提醒
    finishButton.removeEventListener("click",Customers.finishButton);
  },
  //将顾客送入座位
  getFreeSet : function (cur_first_customer) {
    let allSets = document.getElementsByClassName("Customer");
    for(let i = 0;i<allSets.length;i++) {//从前往后顺序查找座位，如果有空的，即座位中没有img属性的，就是空的
      if(allSets[i].childNodes[1] === undefined){
        let newimg = document.createElement('img');
        newimg.src =  cur_first_customer.children[0].children[0].getAttribute("src");
        allSets[i].appendChild(newimg);//更新图片为刚刚送入座位的顾客的头像，并修改背景颜色
        allSets[i].style.background = "linear-gradient(to right, #ff2626 0%,#ff2626 50%,#b20000 51%,#b20000 100%)";
        //当点击完成点餐时，判断是否已经有了顾客和座位、座位和顾客的对应关系，如果没有，则添加
        //并且只有在顾客进入座位时才需要添加，顾客选择不吃了离开餐厅，不需要添加对应关系
        customerAndSet[Customers.cur_first_customer_name] = i;
        setAndCustomer[i] = Customers.cur_first_customer_name;
        //创建进度条
        let wrap = allSets[i].parentNode;
        let progresswrap = document.createElement("div");
        progresswrap.setAttribute("class","customerprogresswrap" + Customers.cur_first_customer_name);
        progresswrap.style.cssText = `    display: flex;
        flex-direction: column;
        height: 90px;
        position: absolute;
        top: 10px;
        left: 60%;`;
        wrap.appendChild(progresswrap);
        //对每一个菜都设置一个进度条，并在设置完进度条后开始移动进度条
        for(let me=0;me<customerAndMenu[Customers.cur_first_customer_name].length;me++) {
          let newbox = document.createElement("div");
          //类名由box、第几个座位、这个座位上的顾客点的菜名构成
          newbox.setAttribute("class","customerprogress-box"+i+customerAndMenu[Customers.cur_first_customer_name][me]);
          newbox.style.cssText = `
          width: 70px;
          background-color: #ff2626;
          border: 2px solid;
          border-color: #fff;
          border-radius: 25px;
          position: relative`;
          let newboxtext = document.createElement("div");
          //同样由text、第几个座位、这个座位上的顾客点的菜名构成
          newboxtext.setAttribute("class","customerprogress-text"+i+customerAndMenu[Customers.cur_first_customer_name][me]);
          newboxtext.style.cssText = `width: 0%;
          height: 30px;
          background-color: #b20000;
          text-align: center;
          line-height: 30px;
          color: white;
          border: 2px 0px 2px 0 solid;
          border-color: #fff;
          border-radius: 25px;`;
          //初始进度条显示内容为菜名
          newboxtext.innerHTML = customerAndMenu[Customers.cur_first_customer_name][me];
          newbox.appendChild(newboxtext);
          progresswrap.appendChild(newbox);
          //移动第几个座位上的某个菜的进度条
          Customers.moveCustomerProgress(i,customerAndMenu[Customers.cur_first_customer_name][me]);

        }
        //将顾客送入座位后，检查当前是否有厨师是空闲的，如果有空闲的，那么将从前往后第一个空闲的厨师分配给这个顾客点的菜
        Chefs.checkHaveMenu();
        break;//完成了上述内容，顾客已经送入座位，并且已经开始有厨师在做菜，即跳出寻找座位的循环
      }
    }
  },
  moveCustomerProgress : function(index,me) {
    let elem = document.getElementsByClassName("CustomerWrap")[index].querySelector(".customerprogress-text"+index+me);   
    let width = 0;
    let moveCustomerProgressId = setInterval(moveCustomerframe, 500);
    Customers.waitingTimer[setAndCustomer[index]+me] = moveCustomerProgressId;
    function moveCustomerframe() {
      if (width >= 100) {
        // clearInterval(moveCustomerProgressId);
        //停止进度条移动（计数）
        Customers.stopCustomerProgress(Customers.waitingTimer[setAndCustomer[index]+me]);
        // if(curMenuAndCustomerQue[index][0] === me && curMenuAndCustomerQue[index][1] === setAndCustomer[index]) {
        //   delete curMenuAndCustomerQue[index];
        // }
        elem.style.backgroundColor = "#535362";
        elem.innerHTML = me;
        //耐心条读完之后，如果这个顾客还没有菜超时未上，则添加一个
        if(setAndCustomer[index] in customerAndMenuOutTimeNum === false) {
          customerAndMenuOutTimeNum[setAndCustomer[index]] = 1;
        }
        else {//如果已经有了，则自增1
          customerAndMenuOutTimeNum[setAndCustomer[index]] += 1;
        }
        
        function removeMenuFromChef(chefindex,idx,menuName) {
          let cheffather = document.getElementsByClassName("Chef")[chefindex];
          cheffather.style.background = "linear-gradient(to right, #dddddd 0%,#dddddd 50%,#aaaaaa 51%,#aaaaaa 100%)";
          cheffather.removeChild(cheffather.children[1]);
          let chefwrap = cheffather.parentNode;
          //使对应的厨师恢复到空闲状态后，需要将空闲厨师计数器自增一
          Chefs.chefFreeNum += 1;
          chefwrap.removeChild(chefwrap.children[1]);
          let icon = document.getElementsByClassName("canEatBackGround"+idx+menuName)[0];
          let iconFather = icon.parentNode;
          iconFather.removeChild(icon);
        };
        //当顾客等待的耐心进度条走完之后，停止计数，等待0.5秒，然后删除厨师做完的这道菜，将可用的厨师数量+1
        //为了定位到对应的厨师的index，需要使用当前的菜和顾客名字
        let chefidx = menuAndCustomerAndChef[me+setAndCustomer[index]];
        if(chefidx === undefined) {
          ;
        }
        else {
        //关于顾客耐心条走完之后等待的5s时间，可以加一个，如果在这个时间内点了上菜，那么顾客不会支付这道菜的费用的功能
        //目前先不做，先做基本功能，所以把等待时间设置短一些，方便调试
        // setTimeout(function () {
          removeMenuFromChef(chefidx,index,me);
          // }, 500);
        }
        //在每次顾客对某一道菜的忍耐度走完并且等候5秒之后，即顾客的这道菜必然不会上了
        //检查是不是所有的菜都没有上并且耐心条都走完了
        //如果是，那么在顾客的左下角添加安慰图标，并对图标增加EventListener
        //并且，如果有菜没有上，那么必然customerAndMenuOutTimeNum不为空，所以不需要进行检查
        if(customerAndMenuOutTimeNum[setAndCustomer[index]] === customerAndMenuNum[setAndCustomer[index]]) {
          let cus = document.getElementsByClassName("Customer")[index];
          cus.style.background = "linear-gradient(to right, #661a00 0%,#661a00 50%,#401000 51%,#401000 100%)";
          let comfortImg = document.createElement("img");
          comfortImg.setAttribute("src","../imgs/iconfinder_Instagram_UI-07_2315589.png");
          comfortImg.style.cssText = `
          width: 60px;
          height: 60px;
          position: absolute;
          left: 10px;
          top: 60px;`;
          cus.appendChild(comfortImg);
          //给费用图标添加EventListener，点击后在总资金中增加该顾客对应的费用
          //并从顾客列表中移除该顾客，空座位数量加一
          comfortImg.addEventListener("click",(function(){Customers.removeComfortedCustomer(index);}));
        }

      } else {//如果未读完进度条，持续读，文字内容始终显示这个进度条的菜名
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = me;
      }
    }
  },
  removeComfortedCustomer : function(cusidx) {
    let cus = document.getElementsByClassName("Customer")[cusidx];
    let wrap = document.getElementsByClassName("customerprogresswrap"+setAndCustomer[cusidx])[0];
    cus.removeChild(cus.children[1]);
    cus.removeChild(cus.children[0]);
    let father = cus.parentNode;
    father.removeChild(wrap);
    cus.style.background = "linear-gradient(to right, #dddddd 0%,#dddddd 50%,#aaaaaa 51%,#aaaaaa 100%)";
    //将顾客移除、座位复原后，出现用户失望离去的提示框
    let mainfather = document.getElementsByClassName("mainGame")[0];
    let customerLeaveAlarm = document.createElement("div");
    customerLeaveAlarm.setAttribute("class","CustomerLeaveAlarm"+setAndCustomer[cusidx]);
    customerLeaveAlarm.style.cssText = `    top: 40%;
    left: 0%;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    border: 5px solid;
    border-color: #fff;
    border-radius: 25px;
    background-color: #ffb399;
    position: absolute;
    z-index: 3;
    width: -webkit-fill-available;`;
    let leaveContextEle = document.createElement("div");
    leaveContextEle.setAttribute("class","CustomerLeaveAlarm-context"+setAndCustomer[cusidx]);
    leaveContextEle.style.cssText = `    margin: 20px;
    font-size: 18px;
    font-family: -webkit-body;
    font-weight: 600;
    color: #8c6700;`;
    leaveContextEle.innerHTML = setAndCustomer[cusidx] + "失望的离开，别再让客人挨饿了";
    customerLeaveAlarm.appendChild(leaveContextEle);
    mainfather.appendChild(customerLeaveAlarm);
    function removeCustomerLeaveAlarm() {
      mainfather.removeChild(customerLeaveAlarm);
      handle = 1;
    }
    let handle = 0;
    customerLeaveAlarm.addEventListener("click",removeCustomerLeaveAlarm);
    setTimeout(function () {
        if(handle === 0) {
          removeCustomerLeaveAlarm();
        }
        else {
            ;
        }
    }, 1000);
  },
  stopCustomerProgress : function(ProgressId) {
    clearInterval(ProgressId);
  },
  //检查Cold Dish中所有checkbox的状态
  checkColdCheckboxStatus : function() {
    let cold = document.getElementsByClassName("colddishcheckbox-box");
    for(let i=0;i<cold.length;i++) {
      if(cold[i].checked) {//如果检查到有checkbox处于被勾选状态，获取当前被勾选的checkbox的位置
        Customers.coldSelectedIdx = i;
        let menuTitle = document.getElementsByClassName("Menu-title")[0];//根据当前被勾选的菜，更新菜单的title中显示的顾客预计开销
        Customers.cur_first_customer_free += parseInt(cold[i].parentNode.children[3].innerText.substr(1,));
        menuTitle.innerHTML = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
        customerAndMenu[Customers.cur_first_customer_name].push(cold[i].parentNode.children[1].innerText);
        customerAndMenuNum[Customers.cur_first_customer_name] += 1;//在顾客和菜对应关系中添加，并且该顾客点的总菜数目自增1
      }
    }
  },
  checkHotCheckboxStatus : function() {//检查Hot Dish中所有checkbox的状态
    let hot = document.getElementsByClassName("hotdishcheckbox-box");
    for(let i=0;i<hot.length;i++) {
      if(hot[i].checked) {
        Customers.hotSelectedIdx = i;
        let menuTitle = document.getElementsByClassName("Menu-title")[0];
        Customers.cur_first_customer_free += parseInt(hot[i].parentNode.children[3].innerText.substr(1,));
        menuTitle.innerHTML = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
        customerAndMenu[Customers.cur_first_customer_name].push(hot[i].parentNode.children[1].innerText);
        customerAndMenuNum[Customers.cur_first_customer_name] += 1;
      }
    }
  },
  checkDrinkCheckboxStatus : function() {//检查Drink中所有checkbox的状态
    let drink = document.getElementsByClassName("drinkcheckbox-box");
    for(let i=0;i<drink.length;i++) {
      if(drink[i].checked) {
        Customers.drinkSelectedIdx = i;
        let menuTitle = document.getElementsByClassName("Menu-title")[0];
        Customers.cur_first_customer_free += parseInt(drink[i].parentNode.children[3].innerText.substr(1,));
        menuTitle.innerHTML = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
        customerAndMenu[Customers.cur_first_customer_name].push(drink[i].parentNode.children[1].innerText);
        customerAndMenuNum[Customers.cur_first_customer_name] += 1;
      }
    }
  },
  //设置除被选了的其他checkbox不可用
  setColdCheckboxDisable : function() {//如果凉菜被勾选了，但这个时候还没有修改coldChecked为1
    let cold = document.getElementsByClassName("colddishcheckbox-box");
    if(Customers.coldChecked === 0) {//但已经设置了coldSelectedIdx，即表示已经点了凉菜，将凉菜中其他所有的checkbox设置为不可勾选
      if(Customers.coldSelectedIdx !== undefined) {
        for(let i=0;i<cold.length;i++) {
          if(i !== Customers.coldSelectedIdx) {
            cold[i].disabled = true;
          }
        }//结束后设置coldChecked为1，表示已经完成了凉菜部分的点菜
        Customers.coldChecked = 1;
      }
      else {
        ;//如果还没勾选，那么什么都不做
      }
    }
    else {//如果凉菜没有菜被勾选，即点击前是勾选了的，点击后取消勾选，则应该将该类菜中其他所有的checkbox恢复为可选
      for(let i=0;i<cold.length;i++) {
        if(i !== Customers.coldSelectedIdx) {
          cold[i].disabled = false;
        }
      }//设置为没有被勾选状态，同时从菜单title中更新取消点这个菜之后的消费预算，该顾客点菜的总数减1，从顾客和菜单对应关系中删除这一对联系
      Customers.coldChecked = 0;
      let menuTitle = document.getElementsByClassName("Menu-title")[0];
      Customers.cur_first_customer_free -= parseInt(cold[Customers.coldSelectedIdx].parentNode.children[3].innerText.substr(1,));
      menuTitle.innerHTML = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
      removeByVal(customerAndMenu[Customers.cur_first_customer_name],cold[Customers.coldSelectedIdx].parentNode.children[1].innerText);
      customerAndMenuNum[Customers.cur_first_customer_name] -= 1;
      Customers.coldSelectedIdx = undefined;
    }
  },
  setHotCheckboxDisable : function() {
    let hot = document.getElementsByClassName("hotdishcheckbox-box");
    if(Customers.hotChecked === 0) {
      if(Customers.hotSelectedIdx !== undefined) {
        for(let i=0;i<hot.length;i++) {
          if(i !== Customers.hotSelectedIdx) {
            hot[i].disabled = true;
          }
        }
        Customers.hotChecked = 1;
      }
      else {
        ;
      }
    }
    else {
      for(let i=0;i<hot.length;i++) {
        if(i !== Customers.hotSelectedIdx) {
          hot[i].disabled = false;
        }
      }
      Customers.hotChecked = 0;
      let menuTitle = document.getElementsByClassName("Menu-title")[0];
      Customers.cur_first_customer_free -= parseInt(hot[Customers.hotSelectedIdx].parentNode.children[3].innerText.substr(1,));
      menuTitle.innerHTML = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
      removeByVal(customerAndMenu[Customers.cur_first_customer_name],hot[Customers.hotSelectedIdx].parentNode.children[1].innerText);
      customerAndMenuNum[Customers.cur_first_customer_name] -= 1;
      Customers.hotSelectedIdx = undefined;
    }
  },
  setDrinkCheckboxDisable : function() {
    let drink = document.getElementsByClassName("drinkcheckbox-box");
    if(Customers.drinkChecked === 0) {
      if(Customers.drinkSelectedIdx !== undefined) {
        for(let i=0;i<drink.length;i++) {
          if(i !== Customers.drinkSelectedIdx) {
            drink[i].disabled = true;
          }
        }
        Customers.drinkChecked = 1;
      }
      else {
        ;
      }
    }
    else {
      for(let i=0;i<drink.length;i++) {
        if(i !== Customers.drinkSelectedIdx) {
          drink[i].disabled = false;
        }
      }
      Customers.drinkChecked = 0;
      let menuTitle = document.getElementsByClassName("Menu-title")[0];
      Customers.cur_first_customer_free -= parseInt(drink[Customers.drinkSelectedIdx].parentNode.children[3].innerText.substr(1,));
      menuTitle.innerHTML = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
      removeByVal(customerAndMenu[Customers.cur_first_customer_name],drink[Customers.drinkSelectedIdx].parentNode.children[1].innerText);
      customerAndMenuNum[Customers.cur_first_customer_name] -= 1;
      Customers.drinkSelectedIdx = undefined;
    }
  },
  //为每个checkbox添加EventListener
  addEventListenerToEveryCheckbox : function() {
    let cold = document.getElementsByClassName("colddishcheckbox-box");
    for(let i=0;i<cold.length;i++) {
      if(i !== Customers.coldSelectedIdx) {
        //以凉菜为例，根据当前被点击后的checkbox的状态修改当前类型的菜的被选状态，每点击一次，检查一次，如果有被勾选的，更新预计点菜开销
        cold[i].addEventListener("click",Customers.checkColdCheckboxStatus);
        //根据当前被点击后的checkbox的状态修改其他checkbox的可选状态和菜单中的信息，同样，每点击一次，检查一次
        cold[i].addEventListener("click",Customers.setColdCheckboxDisable);
        //每点击一次，检查一次是否符合下单条件，并根据是否符合，修改finishButton的可点击状态和颜色
        cold[i].addEventListener("click",Customers.checkFinish);
      }
    }
    let hot = document.getElementsByClassName("hotdishcheckbox-box");
    for(let i=0;i<hot.length;i++) {
      if(i !== Customers.hotSelectedIdx) {
        hot[i].addEventListener("click",Customers.checkHotCheckboxStatus);
        hot[i].addEventListener("click",Customers.setHotCheckboxDisable);
        hot[i].addEventListener("click",Customers.checkFinish);
      }
    }
    let drink = document.getElementsByClassName("drinkcheckbox-box");
    for(let i=0;i<drink.length;i++) {
      if(i !== Customers.drinkSelectedIdx) {
        drink[i].addEventListener("click",Customers.checkDrinkCheckboxStatus);
        drink[i].addEventListener("click",Customers.setDrinkCheckboxDisable);
        drink[i].addEventListener("click",Customers.checkFinish);
      }
    }
  },
  checkFinish : function() {
    //热菜必须点一个，凉菜和饮品可以不选
    if(Customers.coldChecked === 0 && Customers.hotChecked === 1 && Customers.drinkChecked === 0) {
      let finishButton = document.getElementsByClassName("Finish")[0];
      try {
        finishButton.removeEventListener("click",Customers.finishButton);
      }
      catch {
        ;
      }//同样在绑定事件前先删除一次，防止重复绑定。满足条件，则设置下单按钮颜色为橙色，否则为灰色
      finishButton.addEventListener("click",Customers.finishButton);
      finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";
    }
    else if(Customers.coldChecked === 1 && Customers.hotChecked === 1 && Customers.drinkChecked === 0) {
      let finishButton = document.getElementsByClassName("Finish")[0];
      try {
        finishButton.removeEventListener("click",Customers.finishButton);
      }
      catch {
        ;
      }
      finishButton.addEventListener("click",Customers.finishButton);
      finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";
    }
    else if(Customers.coldChecked === 0 && Customers.hotChecked === 1 && Customers.drinkChecked === 1) {
      let finishButton = document.getElementsByClassName("Finish")[0];
      try {
        finishButton.removeEventListener("click",Customers.finishButton);
      }
      catch {
        ;
      }
      finishButton.addEventListener("click",Customers.finishButton);
      finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";
    }
    else if(Customers.coldChecked === 1 && Customers.hotChecked === 1 && Customers.drinkChecked === 1) {
      let finishButton = document.getElementsByClassName("Finish")[0];
      try {
        finishButton.removeEventListener("click",Customers.finishButton);
      }
      catch {
        ;
      }
      finishButton.addEventListener("click",Customers.finishButton);
      finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";
    }
    else {
      let finishButton = document.getElementsByClassName("Finish")[0];
      finishButton.style.background = "linear-gradient(to top, #ded3ba 0%,#ded3ba 50%,#d3c6a5 51%,#d3c6a5 100%)";
    }
  },
  showFinishedAndWaitingAlarm : function() {
    let father = document.getElementsByClassName("mainGame")[0];
    let finishedAlarm = document.createElement("div");
    finishedAlarm.setAttribute("class","FinishedAndWaitingAlarm");
    let contextEle1 = document.createElement("div");
    contextEle1.setAttribute("class","FinishedAlarm-context1");
    contextEle1.innerHTML = Customers.cur_first_customer_name + "完成点餐，等候用餐";
    let contextEle2 = document.createElement("div");
    contextEle2.setAttribute("class","FinishedAlarm-context2");
    contextEle2.innerHTML = "疯狂点击厨师头像可以加速做菜";
    finishedAlarm.appendChild(contextEle1);
    finishedAlarm.appendChild(contextEle2);
    father.appendChild(finishedAlarm);

    function setFinishedAlarmHidden() {
      // finishedAlarm.style.display = "none";
      father.removeChild(finishedAlarm);
      handle = 1;
    }
    let handle = 0;
    finishedAlarm.addEventListener("click",setFinishedAlarmHidden);
    setTimeout(function () {
        if(handle === 0) {
          setFinishedAlarmHidden();
        }
        else {
            ;
        }
    }, 1000);
    Customers.cur_first_customer_name = undefined;
  },
  addWaitingStatus : function() {
    ;
  }
}

let Chefs = {
  //初始的时候，厨师总数和空闲状态中的厨师均为1
  //获取当前厨师的个数
  chefsNum : 1,
  //空闲厨师的个数
  chefFreeNum : 1,
  //厨师做菜定时器
  cookingTimer : {},
  //厨师工资
  chefCost : 100,
  //厨师数量限制
  chefNumLimit : 6,
  //解雇当前厨师需要结算的工资
  curChefCostFee : 0,
  //厨师正在做菜的进度条
  chefCookingTimer : {},
  //顾客吃菜进度条
  customerEatingTimer : {},
  checkHaveMenu : function() {
    if(curMenuAndCustomerQue.length !== 0) {
      if(Chefs.chefFreeNum !== 0) {
        Chefs.chefFreeNum -= 1;
        Chefs.cook();
      }
      else {
        // console.log("所有的厨师都在工作了！请等一等！！！");
        ;
      }
    }
    setTimeout("Chefs.checkHaveMenu()", 1000);
  },
  cook : function() {
    let allChefs = document.getElementsByClassName("Chef");
    for(let i = 0;i<allChefs.length;i++) {//找到第一个空闲状态的厨师
      if(allChefs[i].parentNode.childNodes[3] === undefined && i === 0){
        let curMenu = curMenuAndCustomerQue.shift();//将菜和对应的顾客名字从队列中弹出
        let checkOverTime = document.getElementsByClassName("customerprogress-text" + customerAndSet[curMenu[1]] + curMenu[0])[0];
        if(checkOverTime.style.width === "100%") {
          break;
        }
        allChefs[i].style.background = "linear-gradient(to right, #ff9122 0%,#ff9122 50%,#d96d00 51%,#d96d00 100%)";
        //创建进度条
        let wrap = allChefs[i].parentNode;
        let newbox = document.createElement("div");
        newbox.setAttribute("class","chefprogress-box"+i+curMenu[0]);//第几个厨师正在做哪一个菜
        newbox.style.cssText = `position: absolute;
        top: 70%;
        left: 15%;
        width: 100px;
        background-color: #ff9122;
        border: 2px solid;
        border-color: #fff;
        border-radius: 25px;`;
        let newboxtext = document.createElement("div");
        newboxtext.setAttribute("class","chefprogress-text"+i+curMenu[0]);
        newboxtext.style.cssText = `width: 0%;
        height: 30px;
        background-color: #d96d00;
        text-align: center;
        line-height: 30px;
        color: white;
        border: 2px 0px 2px 0 solid;
        border-color: #fff;
        border-radius: 25px;`;
        //初始进度条显示内容

        newboxtext.innerHTML = curMenu[0];//进度条显示的一直是菜名
        menuAndCustomerAndChef[curMenu[0]+curMenu[1]] = i;//菜和顾客对应的厨师就是i
        //当厨师开始做菜，即创建进度条时，从总资产中减去当前在做的菜的成本
        let leftDespositNum = document.getElementsByClassName("LeftDesposit-Num")[0];
        leftDespositNum.innerHTML = parseInt(leftDespositNum.innerHTML) - menuCostAndSold[curMenu[0]][0];
        //将进度条加入到页面中
        newbox.appendChild(newboxtext);
        wrap.appendChild(newbox);
        //移动厨师对应的进度条
        Chefs.moveChefProgress(i,curMenu);
        break;
      }
      else if(allChefs[i].parentNode.childNodes[1] === undefined && i !== 0) {
        let curMenu = curMenuAndCustomerQue.shift();//将菜和对应的顾客名字从队列中弹出
        let checkOverTime = document.getElementsByClassName("customerprogress-text" + customerAndSet[curMenu[1]] + curMenu[0])[0];
        if(checkOverTime.style.width === "100%") {
          break;
        }
        allChefs[i].style.background = "linear-gradient(to right, #ff9122 0%,#ff9122 50%,#d96d00 51%,#d96d00 100%)";
        //创建进度条
        let wrap = allChefs[i].parentNode;
        let newbox = document.createElement("div");
        newbox.setAttribute("class","chefprogress-box"+i+curMenu[0]);//第几个厨师正在做哪一个菜
        newbox.style.cssText = `position: absolute;
        top: 70%;
        left: 15%;
        width: 100px;
        background-color: #ff9122;
        border: 2px solid;
        border-color: #fff;
        border-radius: 25px;`;
        let newboxtext = document.createElement("div");
        newboxtext.setAttribute("class","chefprogress-text"+i+curMenu[0]);
        newboxtext.style.cssText = `width: 0%;
        height: 30px;
        background-color: #d96d00;
        text-align: center;
        line-height: 30px;
        color: white;
        border: 2px 0px 2px 0 solid;
        border-color: #fff;
        border-radius: 25px;`;
        //初始进度条显示内容

        newboxtext.innerHTML = curMenu[0];//进度条显示的一直是菜名
        menuAndCustomerAndChef[curMenu[0]+curMenu[1]] = i;//菜和顾客对应的厨师就是i
        //当厨师开始做菜，即创建进度条时，从总资产中减去当前在做的菜的成本
        let leftDespositNum = document.getElementsByClassName("LeftDesposit-Num")[0];
        leftDespositNum.innerHTML = parseInt(leftDespositNum.innerHTML) - menuCostAndSold[curMenu[0]][0];
        //将进度条加入到页面中
        newbox.appendChild(newboxtext);
        wrap.appendChild(newbox);
        //移动厨师对应的进度条
        Chefs.moveChefProgress(i,curMenu);
        break;
      }
    }
  },
  moveChefProgress : function(index,menu) {
    let elem = document.getElementsByClassName("ChefWrap")[index].querySelector(".chefprogress-text"+index+menu[0]);   
    let width = 0;
    let moveChefProgressId = setInterval(moveChefframe, Customers.waitingTime);
    // Chefs.chefCookingTimer[index] = setInterval(moveChefframe, Customers.waitingTime);
    function moveChefframe() {
      if (width >= 10) {
        clearInterval(moveChefProgressId);
        // Chefs.stopCookingTimer(Chefs.chefCookingTimer[index]);
        elem.style.backgroundColor = "#d96d00";
        elem.innerHTML = menu[0];
        //厨师做完菜后在厨师头像左下角添加完成的图标
        let chefFather = document.getElementsByClassName("Chef")[index];
        let finishMenuImg = document.createElement("img");
        finishMenuImg.setAttribute("class","finishMenuImg"+index);
        finishMenuImg.style.cssText = `    position: absolute;
        height: 60px;
        width: 60px;
        top: 40%;
        left: 10%;`;
        finishMenuImg.setAttribute("src","../imgs/iconfinder_Food-Dome_379366.png");
        chefFather.appendChild(finishMenuImg);
        //在对应菜的顾客所点的这个菜的右侧添加，上菜图标
        //首先获取菜对应的顾客
        //menu[1]
        //根据顾客和座位的对应关系找到座位的index
        let finishedMenuSetIdx = customerAndSet[menu[1]];
        //同时有座位的index和菜名，就可以定位到厨师刚刚完成的这道菜所对应的顾客的菜单
        //为已经完成的顾客点的菜添加图标
        let customerFather = document.getElementsByClassName("customerprogress-box" + finishedMenuSetIdx + menu[0])[0];
        let canEatBackGround = document.createElement("div");
        canEatBackGround.style.cssText = `
        position: absolute;
        left: 70px;
        top: 0%;
        height: 30px;
        width: 30px;
        border: solid;
        border-color: #fff;
        border-radius: 50%;
        background: linear-gradient(to right, #ff2626 0%,#ff2626 50%,#b20000 51%,#b20000 100%);`;
        canEatBackGround.setAttribute("class","canEatBackGround"+finishedMenuSetIdx+menu[0]);
        let canEatImg = document.createElement("img");
        canEatImg.setAttribute("class","canEatImg"+finishedMenuSetIdx+menu[0]);
        canEatImg.setAttribute("src","..//imgs/iconfinder_Food-Dome_379366.png");
        canEatImg.style.cssText = `
        height: 100%;
        width: 100%;
        `;
        canEatBackGround.appendChild(canEatImg);
        customerFather.appendChild(canEatBackGround);
        //给顾客点的菜的完成图标添加EventListener，点击后使厨师的状态回到空闲，顾客进入吃饭状态
        try {
          customerFather.removeEventListener("click",function () {Chefs.changeChefBackToFreeAndCustomerToEating(menu,customerFather,finishedMenuSetIdx,index);});

        }
        catch(err) {
          ;
        }
        customerFather.addEventListener("click",function () {Chefs.changeChefBackToFreeAndCustomerToEating(menu,customerFather,finishedMenuSetIdx,index);});
      } else {
        width++; 
        elem.style.width = width*10 + '%'; 
        elem.innerHTML = menu[0];
      }
    }
  },
  stopCookingTimer : function(moveChefProgressId) {
    clearInterval(moveChefProgressId);
  },
  //使厨师的状态回到空闲，顾客进入吃饭状态
  //传入已经做好了的菜名和顾客名的1*2的数组、当前可以吃的菜对应顾客的等待进度条、当前顾客的座位index、做当前这个菜的厨师的index
  changeChefBackToFreeAndCustomerToEating : function(menu,cusfather,cusindex,index) {
    let cuscaneat = cusfather.children[1];
    //remove之前要先停止timer
    Customers.stopCustomerProgress(Customers.waitingTimer[setAndCustomer[cusindex]+menu[0]]);
    cusfather.removeChild(cuscaneat);
    //从页面移除当前菜的等待的进度条
    let cuswrap = cusfather.parentNode;
    cuswrap.removeChild(cusfather);
    //添加新的吃菜进度条
    try {
      let newbox = document.createElement("div");
      newbox.setAttribute("class","customereatingprogress-box"+cusindex+menu[0]);
      newbox.style.cssText = `
      width: 70px;
      background-color: #ff2626;
      border: 2px solid;
      border-color: #fff;
      border-radius: 25px;
      position: relative`;
      let newboxtext = document.createElement("div");
      newboxtext.setAttribute("class","customereatingprogress-text"+cusindex+menu[0]);
      newboxtext.style.cssText = `width: 0%;
      height: 30px;
      background-color: #b20000;
      text-align: center;
      line-height: 30px;
      color: white;
      border: 2px 0px 2px 0 solid;
      border-color: #fff;
      border-radius: 25px;`;
      //初始进度条显示内容为0%
      newboxtext.innerHTML = menu[0];
      newbox.appendChild(newboxtext);
      cuswrap.appendChild(newbox);
      Chefs.moveCustomerEatingProgress(cusindex,menu[0],menu[1]);
      Chefs.chefFreeNum += 1;
    }
    catch(err) {
      ;
    }
    let cheffather = document.getElementsByClassName("Chef")[index];
    cheffather.style.background = "linear-gradient(to right, #dddddd 0%,#dddddd 50%,#aaaaaa 51%,#aaaaaa 100%)";
    cheffather.removeChild(cheffather.children[1]);
    let chefwrap = cheffather.parentNode;
    chefwrap.removeChild(chefwrap.children[1]);
    
  },
  //移动顾客正在吃的菜的进度条，传递的参数分别为当前顾客的index、正在吃的菜名、这个顾客的姓名
  moveCustomerEatingProgress : function(index,me,cusname) {
    let elem = document.getElementsByClassName("CustomerWrap")[index].querySelector(".customereatingprogress-text"+index+me);   
    let width = 0;
    let moveCustomerProgressId = setInterval(moveCustomerEatingframe, 500);
    // Chefs.customerEatingTimer[index] = setInterval(moveCustomerEatingframe, 500);
    function moveCustomerEatingframe() {
      if (width >= 100) {
        clearInterval(moveCustomerProgressId);
        // Chefs.stopCustomerEatingProgress(Chefs.customerEatingTimer[index]);
        elem.style.backgroundColor = "#00b200";
        elem.innerHTML = me;
        //吃完之后将吃完的菜的价格加入到该顾客对应的结账字典里，方便最后统一输出
        //当已经吃完的字典里没有信息时，加入，如果有则自增一
        if(setAndCustomer[index] in customerAndMenuHaveEatNum === false) {
          customerAndMenuHaveEatNum[setAndCustomer[index]] = 1;
        }
        else {
          customerAndMenuHaveEatNum[setAndCustomer[index]] += 1;
        }
        //如果顾客和账单的对应字典里不存在信息，则加入，有则增加刚刚吃完的菜的售价
        if(setAndCustomer[index] in customerAndFree === false) {
          customerAndFree[setAndCustomer[index]] = menuCostAndSold[me][1];
        }
        else {
          customerAndFree[setAndCustomer[index]] += menuCostAndSold[me][1];
        }
        Chefs.checkHaveEatAndOvertime(index,me);
      } else {
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = me;
      }
    }
  },
  stopCustomerEatingProgress : function(moveCustomerProgressId) {
    clearInterval(moveCustomerProgressId);
  },
  //检查顾客是否已经结束了用餐，每次用户吃完菜和有菜没有上都要检查，传入的参数为当前顾客的座位的index、刚刚吃完的菜名
  checkHaveEatAndOvertime : function(index, me) {
    //当顾客已经吃完的菜数量和超时的菜的数量一致时
    //说明顾客结束用餐，修改顾客背景为绿色，在顾客左下角添加收费图标
    let haveEatNum = 0;
    if(customerAndMenuHaveEatNum[setAndCustomer[index]] !== undefined) {
      haveEatNum = customerAndMenuHaveEatNum[setAndCustomer[index]];
    }
    else {
      ;
    }
    let haveOutTimeNum = 0;
    if(customerAndMenuOutTimeNum[setAndCustomer[index]] !== undefined) {
      haveOutTimeNum = customerAndMenuOutTimeNum[setAndCustomer[index]];
    }
    else {
      ;
    }
    if(haveEatNum + haveOutTimeNum === customerAndMenuNum[setAndCustomer[index]]) {
      let cus = document.getElementsByClassName("Customer")[index];
      cus.style.background = "linear-gradient(to right, #80ff00 0%,#80ff00 50%,#00b200 51%,#00b200 100%)";
      console.log(customerAndFree[setAndCustomer[index]]);
      let freeimg = document.createElement("img");
      freeimg.setAttribute("src","../imgs/iconfinder_Euro-Coin_379523.png");
      freeimg.style.cssText = `
      width: 60px;
      height: 60px;
      position: absolute;
      left: 10px;
      top: 60px;`;
      cus.appendChild(freeimg);
      //给费用图标添加EventListener，点击后在总资金中增加该顾客对应的费用
      //并从顾客列表中移除该顾客，空座位数量加一
      try {
        freeimg.removeEventListener("click",(function(){Chefs.removeFinishedCustomer(index);}));
      }
      catch(err) {
        ;
      }
      //为收费图标绑定事件，点击后从座位中移除顾客、该顾客的菜、增加总资产
      freeimg.addEventListener("click",(function(){Chefs.removeFinishedCustomer(index);}));
    }
  },
  //传入的参数为当前顾客的座位index
  removeFinishedCustomer : function(index) {
    let cus = document.getElementsByClassName("Customer")[index];
    let wrap = document.getElementsByClassName("customerprogresswrap"+setAndCustomer[index])[0];
    cus.removeChild(cus.children[1]);
    cus.removeChild(cus.children[0]);
    let father = cus.parentNode;
    father.removeChild(wrap);
    cus.style.background = "linear-gradient(to right, #dddddd 0%,#dddddd 50%,#aaaaaa 51%,#aaaaaa 100%)";
    Customers.customersSets += 1;
    let leftDespositNum = document.getElementsByClassName("LeftDesposit-Num")[0];
    leftDespositNum.innerHTML = parseInt(leftDespositNum.innerHTML) + customerAndFree[setAndCustomer[index]];
    //移除已经完成用餐后的顾客后，显示提示信息
    let mainfather = document.getElementsByClassName("mainGame")[0];
    let reveivedFreeAlarm = document.createElement("div");
    reveivedFreeAlarm.setAttribute("class","FinishedAndWaitingAlarm");
    let finishContextEle = document.createElement("div");
    finishContextEle.setAttribute("class","FinishedAlarm-context2");
    finishContextEle.innerHTML = setAndCustomer[index] + "已经完成用餐，共收获" + customerAndFree[setAndCustomer[index]];
    reveivedFreeAlarm.appendChild(finishContextEle);
    mainfather.appendChild(reveivedFreeAlarm);
    function removeReceivedFreeAlarm() {
      mainfather.removeChild(reveivedFreeAlarm);
      handle = 1;
    }
    let handle = 0;
    reveivedFreeAlarm.addEventListener("click",removeReceivedFreeAlarm);
    setTimeout(function () {
        if(handle === 0) {
          removeReceivedFreeAlarm();
        }
        else {
            ;
        }
    }, 1000);
  },
  addEventListenerToAddChef : function() {
    let addChefAlarm = document.getElementsByClassName("AddChefAlarm-Initial")[0];
    function addConfirm() {
      addChefAlarm.style.display="none";
      cover.style.display="none";
      Chefs.addChef();
      let mainfather = document.getElementsByClassName("mainGame")[0];
      let addSuccessAlarm = document.createElement("div");
      addSuccessAlarm.setAttribute("class","CantRemoveChefAlarm");
      let addSuccessContextEle = document.createElement("div");
      addSuccessContextEle.setAttribute("class","CantRemoveChefAlarm-context");
      //先完成了增加厨师的操作，再弹出提示框
      addSuccessContextEle.innerHTML = "招聘厨师成功，您已经有" + Chefs.chefsNum +"名厨师";
      addSuccessAlarm.appendChild(addSuccessContextEle);
      mainfather.appendChild(addSuccessAlarm);
      function addSuccessedAlarm() {
        mainfather.removeChild(addSuccessAlarm);
        handle = 1;
      }
      let handle = 0;
      addSuccessAlarm.addEventListener("click",addSuccessedAlarm);
      setTimeout(function () {
          if(handle === 0) {
            addSuccessedAlarm();
          }
          else {
              ;
          }
      }, 1000);
    }
    let confirmButton = document.getElementsByClassName("AddChefAlarm-Confirm-Button")[0];
    try {
      confirmButton.removeEventListener("click",addConfirm);
    }
    catch(err) {
      ;
    }
    confirmButton.addEventListener("click",addConfirm);
    function nopeConfirm() {
      addChefAlarm.style.display="none";
      cover.style.display="none";
    }
    let nopeButton = document.getElementsByClassName("AddChefAlarm-Nope-Button")[0];
    try {
      nopeButton.removeEventListener("click",nopeConfirm);
    }
    catch(err) {
      ;
    }
    nopeButton.addEventListener("click",nopeConfirm);
    let addChef = document.getElementsByClassName("AddChef")[0];
    try {
      addChef.removeEventListener("click",Chefs.showAddChefConfirm);
    }
    catch(err) {
      ;
    }
    addChef.addEventListener("click",Chefs.showAddChefConfirm);
  },
  showAddChefConfirm : function() {
    //设置雇佣厨师提示信息和确认栏
    let addChefAlarm = document.getElementsByClassName("AddChefAlarm-Initial")[0];
    addChefAlarm.style.display = "";
    cover.style.display="";
  },
  addChef : function() {
    //当厨师数量等于5时，再增加一个厨师就删去"增加厨师"的按钮，将原位置换成一个厨师
    if(Chefs.chefsNum + 1 === Chefs.chefNumLimit){
      let chefFather = document.getElementsByClassName("Chefs")[0];
      chefFather.removeChild(chefFather.lastElementChild);
      let chefWrap = document.createElement("div");
      chefWrap.setAttribute("class","ChefWrap");
      let newChef = document.createElement("div");
      newChef.setAttribute("class","Chef");
      chefWrap.style.cssText = `pointer-events:none;`;
      let newChefImg = document.createElement("img");
      newChefImg.setAttribute("src","../imgs/iconfinder_Chef-2_379358_origin.png");
      newChef.appendChild(newChefImg);
      chefWrap.appendChild(newChef);
      // chefWrap.innerHTML = "\n          ";
      chefFather.appendChild(chefWrap);
      try {
        newChef.removeEventListener("click",Chefs.showRemoveChefConfirm);
      }
      catch(err) {
        ;
      }
      newChef.addEventListener("click",Chefs.showRemoveChefConfirm);
      //新增了厨师之后，当前厨师总数+1，空闲的厨师总数+1
      Chefs.chefsNum +=1;
      Chefs.chefFreeNum += 1;      
    }
    else {
      let chefFather = document.getElementsByClassName("Chefs")[0];
      let chefWrap = document.createElement("div");
      chefWrap.setAttribute("class","ChefWrap");
      let newChef = document.createElement("div");
      newChef.setAttribute("class","Chef");
      chefWrap.style.cssText = `pointer-events:none;`;
      let newChefImg = document.createElement("img");
      newChefImg.setAttribute("src","../imgs/iconfinder_Chef-2_379358_origin.png");
      newChef.appendChild(newChefImg);
      chefWrap.appendChild(newChef);
      chefFather.insertBefore(chefWrap,chefFather.lastElementChild);
      //添加完之后
      try {
        newChef.removeEventListener("click",Chefs.showRemoveChefConfirm);
      }
      catch(err) {
        ;
      }
      newChef.addEventListener("click",Chefs.showRemoveChefConfirm);
      Chefs.chefsNum +=1;
      Chefs.chefFreeNum += 1;

    }
  },
  addEventListenerToRemoveChef : function() {
    let removeChefAlarm = document.getElementsByClassName("RemoveChefAlarm-Initial")[0];
    function addRemoveConfirm() {
      removeChefAlarm.style.display="none";
      cover.style.display="none";
      Chefs.removeChef();
      let chefCostCurDayContext = document.getElementsByClassName("ChefCostCurDay")[0];
      chefCostCurDayContext.innerHTML = "解雇当前厨师结算工资及解约金需要付出";
    }
    let confirmButton = document.getElementsByClassName("RemoveChefAlarm-Confirm-Button")[0];
    try {
      confirmButton.removeEventListener("click",addRemoveConfirm);
    }
    catch(err) {
      ;
    }
    confirmButton.addEventListener("click",addRemoveConfirm);
    function nopeRemoveConfirm() {
      removeChefAlarm.style.display="none";
      cover.style.display="none";
    }
    let nopeButton = document.getElementsByClassName("RemoveChefAlarm-Nope-Button")[0];
    try {
      nopeButton.removeEventListener("click",nopeRemoveConfirm);
    }
    catch(err) {
      ;
    }
    nopeButton.addEventListener("click",nopeRemoveConfirm);
  },
  showRemoveChefConfirm : function() {
    //设置解雇厨师提示信息和确认栏
    let removeChefAlarm = document.getElementsByClassName("RemoveChefAlarm-Initial")[0];
    removeChefAlarm.style.display = "";
    cover.style.display="";
    let curDay = parseInt(document.getElementsByClassName("Week-Content")[0].innerHTML[1]);
    let curChefCost = curDay * 10;
    let chefCostCurDayContext = document.getElementsByClassName("ChefCostCurDay")[0];
    chefCostCurDayContext.innerHTML = chefCostCurDayContext.innerHTML + (curChefCost + 100);
    Chefs.curChefCostFee = curChefCost + 100;
  },
  removeChef : function() {
    let leftDesposit = document.getElementsByClassName("LeftDesposit-Num")[0];
    if(parseInt(leftDesposit.innerHTML) < Chefs.curChefCostFee) {
      let mainfather = document.getElementsByClassName("mainGame")[0];
      let cantRemoveChefAlarm = document.createElement("div");
      cantRemoveChefAlarm.setAttribute("class","CantRemoveChefAlarm");
      let cantRemoveContextEle = document.createElement("div");
      cantRemoveContextEle.setAttribute("class","CantRemoveChefAlarm-context");
      cantRemoveContextEle.innerHTML = "你的资产已经不足支付解约金";
      cantRemoveChefAlarm.appendChild(cantRemoveContextEle);
      mainfather.appendChild(cantRemoveChefAlarm);
      function removedFalsefAlarm() {
        mainfather.removeChild(cantRemoveChefAlarm);
        handle = 1;
      }
      let handle = 0;
      cantRemoveChefAlarm.addEventListener("click",removedFalsefAlarm);
      setTimeout(function () {
          if(handle === 0) {
            removedFalsefAlarm();
          }
          else {
              ;
          }
      }, 1000);
      console.log("当前的资金不足以支付解雇厨师的费用");
    }
    else {
      leftDesposit.innerHTML = parseInt(leftDesposit.innerHTML) - Chefs.curChefCostFee;
      let mainfather = document.getElementsByClassName("mainGame")[0];
      let removeChefSuccessAlarm = document.createElement("div");
      removeChefSuccessAlarm.setAttribute("class","CantRemoveChefAlarm");
      let removeChefSuccessContextEle = document.createElement("div");
      removeChefSuccessContextEle.setAttribute("class","CantRemoveChefAlarm-context");
      removeChefSuccessContextEle.innerHTML = "解约厨师成功，解约支出"+Chefs.curChefCostFee;
      removeChefSuccessAlarm.appendChild(removeChefSuccessContextEle);
      mainfather.appendChild(removeChefSuccessAlarm);
      function removedSuccessfAlarm() {
        mainfather.removeChild(removeChefSuccessAlarm);
        handle = 1;
      }
      let handle = 0;
      removeChefSuccessAlarm.addEventListener("click",removedSuccessfAlarm);
      setTimeout(function () {
          if(handle === 0) {
            removedSuccessfAlarm();
          }
          else {
              ;
          }
      }, 1000);
    }
    //如果当前厨师的数量大于1，可以正常解雇厨师
    if(Chefs.chefsNum > 1) {
      if(Chefs.chefsNum-1 === 5) {//如果当前有6个厨师，那么解雇一个之后，需要添加一个"增加厨师"的按钮
        let chefFather = document.getElementsByClassName("Chefs")[0];
        chefFather.removeChild(chefFather.lastElementChild);
        let chefWrap = document.createElement("div");
        chefWrap.setAttribute("class","ChefWrap");
        let newChef = document.createElement("div");
        newChef.setAttribute("class","AddChef");
        let newChefImg = document.createElement("img");
        newChefImg.setAttribute("class","AddChefImg");
        newChefImg.setAttribute("src","../imgs/iconfinder_Chef-2_379358.png");
        newChef.appendChild(newChefImg);
        chefWrap.appendChild(newChef);
        chefFather.appendChild(chefWrap);
        //解雇厨师后，总数量和空闲中的厨师均减1
        Chefs.chefsNum -=1;
        Chefs.chefFreeNum -= 1;
        let addChef = document.getElementsByClassName("AddChef")[0];
        try {
          addChef.removeEventListener("click",Chefs.showAddChefConfirm);
        }
        catch(err) {
          ;
        }
        addChef.addEventListener("click",Chefs.showAddChefConfirm);
      }
      else {//如果当前不是6个厨师，那么正常解雇，不需要做特殊处理
        let chef = document.getElementsByClassName("Chef");
        let chefFather = chef[0].parentNode.parentNode;
        chefFather.removeChild(chefFather.children[chef.length-1]);
        //解雇厨师后，总数量和空闲中的厨师均减1
        Chefs.chefsNum -=1;
        Chefs.chefFreeNum -= 1;
      }
    }
    else {//如果当前厨师的数量小于等于1，那么弹出提示框，必须有一个厨师
      let mainfather = document.getElementsByClassName("mainGame")[0];
      let mustHaveOneChefAlarm = document.createElement("div");
      mustHaveOneChefAlarm.setAttribute("class","MustHaveOneChefAlarm");
      let mustHaveOneChefContextEle = document.createElement("div");
      mustHaveOneChefContextEle.setAttribute("class","MustHaveOneChefAlarm-context");
      mustHaveOneChefContextEle.innerHTML = "餐厅至少有一个厨师";
      mustHaveOneChefAlarm.appendChild(mustHaveOneChefContextEle);
      mainfather.appendChild(mustHaveOneChefAlarm);
      function removedLastChefAlarm() {
        mainfather.removeChild(mustHaveOneChefAlarm);
        handle = 1;
      }
      let handle = 0;
      reveivedFreeAlarm.addEventListener("click",removedLastChefAlarm);
      setTimeout(function () {
          if(handle === 0) {
            removedLastChefAlarm();
          }
          else {
              ;
          }
      }, 1000);
    }
  },
  checkBusyOrFree : function() {
    let chefCurrentStatus = document.getElementsByClassName("ChefWrap")[0].children;
    let flag = 0;
    if(chefCurrentStatus.length === 1) {
      flag = 0;
    }
    else {
      flag = 1;
    }

  },
  setFirstChefUnableToFire : function() {
    let firstChef = document.getElementsByClassName("Chef")[0];
    firstChef.setAttribute("class","Chef hidden-beforeAndAfter");

  }
}