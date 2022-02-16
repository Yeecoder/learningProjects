let GlobalTimeSet = {
  day : 1,
  week : 1,
  timer : undefined,
  StartTimeInterval : function() {
    let day_elem = document.getElementsByClassName("Week-Content")[0];   
    let week_elem = document.getElementsByClassName("Weeks-Content")[0];
    // GlobalTimeSet.week = 1;
    // GlobalTimeSet.day = 1;
    let dayframe = function() {
      if(GlobalTimeSet.day < 8) {
        day_elem.innerHTML = "D" + GlobalTimeSet.day;
        GlobalTimeSet.day++; 
        //更新天数之后，重置顾客
        Customers.allCustomers = Customers.constAllCustomers;
      }
      else {
        GlobalTimeSet.day = 1;
        day_elem.innerHTML = "D" + GlobalTimeSet.day;
        GlobalTimeSet.day++;
        GlobalTimeSet.week++;
        if(GlobalTimeSet.week >= 53) {
          GlobalTimeSet.StopTimeInterval();
        }
        week_elem.innerHTML = "W" + GlobalTimeSet.week;
        //更新星期后更新减去厨师工资后的总资产
        let leftDespositNum = document.getElementsByClassName("LeftDesposit-Num")[0];
        let chefNum = document.getElementsByClassName("Chef").length;
        leftDespositNum.innerHTML = parseInt(leftDespositNum.innerHTML) - chefNum * 100;
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

//获取位置信息，设置添加厨师部分图片
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

//设置菜单、提示等的阴影部分
let cover = document.getElementsByClassName("Cover")[0];
cover.style.height = document.body.clientHeight+'px';
//设置第一次进入时的提示信息栏
let AlarmFirst = document.getElementsByClassName("Alarm-Initial")[0];
let button = document.getElementsByClassName("Alarm-Confirm-Button")[0];
button.addEventListener("click",hiddwnConfirm);
function hiddwnConfirm() {
    AlarmFirst.style.display="none";
    cover.style.display="none";
    GlobalTimeSet.StartTimeInterval();
    Customers.createCustomer();
    Customers.addELToWaitingCustomers();
    Chefs.addEventListenerToAddChef();
    Chefs.addEventListenerToRemoveChef();
}

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

//顾客和座位、顾客和菜单的对应关系
customerAndSet = {};
setAndCustomer = {};
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
//顾客和消费的对应关系
customerAndFree = {};

//菜和对应的成本和售价
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


function removeByVal(arrylist , val) {
	for(var i = 0; i < arrylist .length; i++) {
		if(arrylist [i] == val) {
			arrylist .splice(i, 1);
			break;
		}
	}
}


let Customers = {
  //等候区大小，每次创建完新的等候区顾客时自减一，点击等候区后自增一
  waitingCustomersLimit : 6,
  //等候时间，相对于一天的时间设置，一般不变
  waitingTime : 500,
  //等候区队列，每次创建等候区顾客时要入队，点击等候区后要出队
  waitingCustomersQue : [],
  //等候区队列的索引，每次创建等候区顾客时要入队，点击等候区后要出队
  waitingCustomersQueIndex : [],
  //等候区顾客的元素队列，每次创建等候区顾客时要入队，点击等候区后要出队
  waitingCustomersQueEle : [],
  //更新天数时重置用
  constAllCustomers : ['379339-512','379444-512','379446-512','379448-512','iconfinder_Boss-3_379348','iconfinder_Man-16_379485','iconfinder_Rasta_379441'],
  //所有可能到达餐厅的用户，一般不变
  allCustomers : ['379339-512','379444-512','379446-512','379448-512','iconfinder_Boss-3_379348','iconfinder_Man-16_379485','iconfinder_Rasta_379441'],
  //当天去过餐厅的顾客，每次创建等候区顾客成功时要自增1，当和所有用户长度一致时停止创建新顾客
  visitedCustomers : 0,
  //全部座位的数量，随着创建的座位数量变化，一般不变
  customersSets : document.getElementsByClassName("Customer").length,
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
  //正在点菜的顾客的费用
  cur_first_customer_free : 0,
  //顾客等待定时器
  waitingTimer : {},
  //生成顾客
  createCustomer : function() {
    if(Customers.waitingCustomersLimit > 1) {
      //设置随机时间新建顾客，即300-500毫秒调用一次
      let randomCreateTime = randomNum(3000,15000);
      setTimeout("Customers.createCustomer()", randomCreateTime);
    }
    else {
      let idx = randomNum(0,Customers.allCustomers.length);
      while(Customers.allCustomers[idx] === undefined) {
        if(Customers.visitedCustomers === Customers.allCustomers.length) {
          return;
        }
        idx = randomNum(0,Customers.allCustomers.length);
      }
      Customers.visitedCustomers++;
      delete Customers.allCustomers[idx];
    }
    let idx = randomNum(0,Customers.allCustomers.length);
    while(Customers.allCustomers[idx] === undefined) {
      if(Customers.visitedCustomers === Customers.allCustomers.length) {
        return;
      }
      idx = randomNum(0,Customers.allCustomers.length);
    }
    Customers.visitedCustomers++;
    //获取等待顾客列表的父元素
    let father = document.getElementsByClassName("newCustomers")[0];
    //创建等待顾客
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
    Customers.move(idx);
  },
  //使进度条可以移动
  move : function (cur_progress_idx) {
    let elem = document.getElementsByClassName("progress-text"+cur_progress_idx)[0];   
    let width = 0;
    let newcustomer = document.getElementsByClassName("newCustomer"+cur_progress_idx)[0];
    let progress = document.getElementsByClassName("progress-box"+cur_progress_idx)[0];
    let id = setInterval(frame, Customers.waitingTime);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        // newcustomer.style.display = "none";
        // progress.style.display = "none";
        //移动进度条到最后，将队首顾客、队首顾客的页面元素、队首顾客的索引分别出队列
        Customers.waitingCustomersQueEle.shift();
        Customers.waitingCustomersQueIndex.shift();
        Customers.waitingCustomersQue.shift();
        Customers.waitingCustomersLimit++;
        let fatherArea = document.getElementsByClassName("newCustomers");
        if(fatherArea[0].childNodes.length !== 0) {
          fatherArea[0].removeChild(fatherArea[0].childNodes[0]);
        }
        else {
          ;
        }
      } else {
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = width * 1  + '%';
      }
    }
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
      setTimeout("Customers.checkWaitingAndFreeSet()", 1000);
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
      }, 500);
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

  },
  //移除之后显示菜单，并将刚刚移出队列的用户头像放置到菜单左上角
  showMenu : function(ele) {
    let leaveButton = document.getElementsByClassName("LeaveThere")[0];
    try {
      leaveButton.removeEventListener("click",Customers.customerLeave);
    }
    catch(err) {
      ;
    }
    leaveButton.addEventListener("click",Customers.customerLeave);

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

    Menu.childNodes[1].innerText = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
    //当唤起点菜面板时，判断是否已经有了顾客和菜的对应关系，如果没有，则添加
    if(Customers.cur_first_customer_name in customerAndMenu === false) {
      customerAndMenu[Customers.cur_first_customer_name] = [];
      customerAndMenuNum[Customers.cur_first_customer_name] = 0;
    }
    Customers.addEventListenerToEveryCheckbox();
    Menu.style.display = '';
    cover.style.display = '';
    //三类菜单中被选择了的checkbox的索引
    Customers.coldSelectedIdx = undefined;
    Customers.hotSelectedIdx = undefined;
    Customers.drinkSelectedIdx = undefined;
    //三类菜单中是否已经被勾选
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

  Menu.style.display = 'none';
  cover.style.display = 'none';
  father.removeChild(wrap);
  Customers.cur_first_customer_free = 0;
  Customers.cur_first_customer_name = undefined;
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
  let finishButton = document.getElementsByClassName("Finish")[0];
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
    let Menu = document.getElementsByClassName("Menu")[0];
    let wrap = document.getElementsByClassName("curCustomerWrap")[0];
    Menu.style.display = 'none';
    cover.style.display = 'none';
    let father = document.getElementsByClassName("mainGame")[0];
    //将点的菜和对应的顾客添加到菜品和顾客队列中
    for(let c=0;c<customerAndMenu[Customers.cur_first_customer_name].length;c++) {
      // tmp = {};
      // tmp[customerAndMenu[Customers.cur_first_customer_name][c]] = Customers.cur_first_customer_name;
      tmp = [];
      tmp.push(customerAndMenu[Customers.cur_first_customer_name][c]);
      tmp.push(Customers.cur_first_customer_name);
      curMenuAndCustomerQue.push(tmp);
    }
    Customers.getFreeSet(wrap);
    father.removeChild(wrap);
    console.log("关闭菜单");
    Customers.cur_first_customer_free = 0;
    // Customers.cur_first_customer_name = undefined;
    let finishButton = document.getElementsByClassName("Finish")[0];
    finishButton.style.background = "linear-gradient(to top, #ded3ba 0%,#ded3ba 50%,#d3c6a5 51%,#d3c6a5 100%)";
    Customers.showFinishedAndWaitingAlarm();
    finishButton.removeEventListener("click",Customers.finishButton);
  },
  //将顾客送入座位
  getFreeSet : function (cur_first_customer) {
    let allSets = document.getElementsByClassName("Customer");
    for(let i = 0;i<allSets.length;i++) {
      if(allSets[i].childNodes[1] === undefined){
        let newimg = document.createElement('img');
        newimg.src =  cur_first_customer.children[0].children[0].getAttribute("src");
        allSets[i].appendChild(newimg);
        allSets[i].style.background = "linear-gradient(to right, #ff2626 0%,#ff2626 50%,#b20000 51%,#b20000 100%)";
        //当点击完成点餐时，判断是否已经有了顾客和座位的对应关系，如果没有，则添加
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
        for(let me=0;me<customerAndMenu[Customers.cur_first_customer_name].length;me++) {
          let newbox = document.createElement("div");
          newbox.setAttribute("class","customerprogress-box"+i+customerAndMenu[Customers.cur_first_customer_name][me]);
          newbox.style.cssText = `
          width: 70px;
          background-color: #ff2626;
          border: 2px solid;
          border-color: #fff;
          border-radius: 25px;
          position: relative`;
          let newboxtext = document.createElement("div");
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
          //初始进度条显示内容为0%
          newboxtext.innerHTML = customerAndMenu[Customers.cur_first_customer_name][me];
          newbox.appendChild(newboxtext);
          progresswrap.appendChild(newbox);
          Customers.moveCustomerProgress(i,customerAndMenu[Customers.cur_first_customer_name][me]);
        }
        //将顾客送入座位后，检查当前是否有厨师是空闲的，如果有空闲的，那么将
        Chefs.checkHaveMenu();
        break;
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
        Customers.stopCustomerProgress(Customers.waitingTimer[setAndCustomer[index]+me]);
        elem.style.backgroundColor = "#535362";
        elem.innerHTML = me;
        if(setAndCustomer[index] in customerAndMenuOutTimeNum === false) {
          customerAndMenuOutTimeNum[setAndCustomer[index]] = 1;
        }
        else {
          customerAndMenuOutTimeNum[setAndCustomer[index]] += 1;
        }
        function removeMenuFromChef(chefindex,idx,menuName) {
          let cheffather = document.getElementsByClassName("Chef")[chefindex];
          cheffather.style.background = "linear-gradient(to right, #dddddd 0%,#dddddd 50%,#aaaaaa 51%,#aaaaaa 100%)";
          cheffather.removeChild(cheffather.children[1]);
          let chefwrap = cheffather.parentNode;
          //使对应的厨师恢复到空闲状态后，需要将空闲厨师计数器自增一
          Chefs.chefsNum += 1;
          chefwrap.removeChild(chefwrap.children[1]);
          let icon = document.getElementsByClassName("canEatBackGround"+idx+menuName)[0];
          let iconFather = icon.parentNode;
          iconFather.removeChild(icon);
        };
        //当顾客等待的耐心进度条走完之后，停止计数，等待5秒，然后删除厨师做完的这道菜，将可用的厨师数量+1
        //为了定位到对应的厨师的index，需要使用当前的菜和顾客名字
        let chefidx = menuAndCustomerAndChef[me+setAndCustomer[index]];
        //关于顾客耐心条走完之后等待的5s时间，可以加一个，如果在这个时间内点了上菜，那么顾客不会支付这道菜的费用的功能
        //目前先不做，先做基本功能，所以把等待时间设置短一些，方便调试
        setTimeout(function () {
          removeMenuFromChef(chefidx,index,me);
        }, 500);
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

      } else {
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
  //检查所有checkbox的状态
  checkColdCheckboxStatus : function() {
    let cold = document.getElementsByClassName("colddishcheckbox-box");
    for(let i=0;i<cold.length;i++) {
      if(cold[i].checked) {
        Customers.coldSelectedIdx = i;
        let menuTitle = document.getElementsByClassName("Menu-title")[0];
        Customers.cur_first_customer_free += parseInt(cold[i].parentNode.children[3].innerText.substr(1,));
        menuTitle.innerHTML = Customers.cur_first_customer_name + "正在点菜，已点" + Customers.cur_first_customer_free + "元的菜";
        customerAndMenu[Customers.cur_first_customer_name].push(cold[i].parentNode.children[1].innerText);
        customerAndMenuNum[Customers.cur_first_customer_name] += 1;
      }
    }
  },
    checkHotCheckboxStatus : function() {
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
    checkDrinkCheckboxStatus : function() {
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
  setColdCheckboxDisable : function() {
    let cold = document.getElementsByClassName("colddishcheckbox-box");
    if(Customers.coldChecked === 0) {
      if(Customers.coldSelectedIdx !== undefined) {
        for(let i=0;i<cold.length;i++) {
          if(i !== Customers.coldSelectedIdx) {
            cold[i].disabled = true;
          }
        }
        Customers.coldChecked = 1;
      }
      else {
        ;
      }
    }
    else {
      for(let i=0;i<cold.length;i++) {
        if(i !== Customers.coldSelectedIdx) {
          cold[i].disabled = false;
        }
      }
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
        cold[i].addEventListener("click",Customers.checkColdCheckboxStatus);
        cold[i].addEventListener("click",Customers.setColdCheckboxDisable);
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
    if(Customers.coldChecked === 0 && Customers.hotChecked === 1 && Customers.drinkChecked === 0) {
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
      finishedAlarm.style.display = "none";
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
  //获取当前厨师的个数
  chefsNum : document.getElementsByClassName("Chef").length,
  //厨师做菜定时器
  cookingTimer : {},
  //厨师工资
  chefCost : 100,
  //厨师数量限制
  chefNumLimit : 6,
  //解雇当前厨师需要结算的工资
  curChefCostFee : 0,
  //
  checkHaveMenu : function() {
    if(curMenuAndCustomerQue.length !== 0) {
      if(Chefs.chefsNum !== 0) {
        Chefs.chefsNum -= 1;
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
    for(let i = 0;i<allChefs.length;i++) {
      if(allChefs[i].parentNode.childNodes[3] === undefined){
        allChefs[i].style.background = "linear-gradient(to right, #ff9122 0%,#ff9122 50%,#d96d00 51%,#d96d00 100%)";
        let curMenu = curMenuAndCustomerQue.shift();
        //创建进度条
        let wrap = allChefs[i].parentNode;
        let newbox = document.createElement("div");
        newbox.setAttribute("class","chefprogress-box"+i+curMenu[0]);
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

        newboxtext.innerHTML = curMenu[0];
        menuAndCustomerAndChef[curMenu[0]+curMenu[1]] = i;
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
    // Chefs.cookingTimer[]
    function moveChefframe() {
      if (width >= 10) {
        clearInterval(moveChefProgressId);
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
        customerFather.addEventListener("click",function () {Chefs.changeChefBackToFreeAndCustomerToEating(menu,customerFather,finishedMenuSetIdx,index);});
      } else {
        width++; 
        elem.style.width = width*10 + '%'; 
        elem.innerHTML = menu[0];
      }
    }
  },
  // stop : function() {

  // },
  //使厨师的状态回到空闲，顾客进入吃饭状态
  //传入当前顾客部分的进度条customerprogress-box、当前菜可以吃的图标、当前顾客的座位index、
  //做当前这个菜的厨师、这个厨师的index
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
      Chefs.moveCustomerEatingProgress(cusindex,menu[0]);
      Chefs.chefsNum += 1;
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
  moveCustomerEatingProgress : function(index,me) {
    let elem = document.getElementsByClassName("CustomerWrap")[index].querySelector(".customereatingprogress-text"+index+me);   
    let width = 0;
    let moveCustomerProgressId = setInterval(moveCustomerEatingframe, 500);
    function moveCustomerEatingframe() {
      if (width >= 100) {
        clearInterval(moveCustomerProgressId);
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
      freeimg.addEventListener("click",(function(){Chefs.removeFinishedCustomer(index);}));
    }
  },
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
      addSuccessContextEle.innerHTML = "招聘厨师成功，您已经有" + document.getElementsByClassName("Chef").length +"名厨师";
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
    addChef.addEventListener("click",Chefs.showAddChefConfirm);
  },
  showAddChefConfirm : function() {
    console.log("显示面板");
    //设置雇佣厨师提示信息和确认栏
    let addChefAlarm = document.getElementsByClassName("AddChefAlarm-Initial")[0];
    addChefAlarm.style.display = "";
    cover.style.display="";
  },
  addChef : function() {
    if(document.getElementsByClassName("Chef").length + 1 === Chefs.chefNumLimit){
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
      chefFather.appendChild(chefWrap);
      newChef.addEventListener("click",Chefs.showRemoveChefConfirm);
      Chefs.chefsNum +=1;
      let leftDespositNum = document.getElementsByClassName("LeftDesposit-Num")[0];
      
      // leftDespositNum.innerHTML = parseInt(leftDespositNum.innerHTML) - Chefs.
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
      // chefFather.appendChild(chefWrap);
      chefFather.insertBefore(chefWrap,chefFather.lastElementChild);
      newChef.addEventListener("click",Chefs.showRemoveChefConfirm);
      Chefs.chefsNum +=1;

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

    if(document.getElementsByClassName("Chef").length > 1) {
      if(document.getElementsByClassName("Chef").length-1 === 5) {
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
        Chefs.chefsNum -=1;
      }
      else {
        let chef = document.getElementsByClassName("Chef");
        let chefFather = chef[0].parentNode.parentNode;
        chefFather.removeChild(chefFather.children[chef.length-1]);
        Chefs.chefsNum -=1;
      }

    }
    else {
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
  }
}