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
  //生成顾客
  createCustomer : function() {
    if(Customers.waitingCustomersLimit > 1) {
      //设置随机时间新建顾客，即300-500毫秒调用一次
      let randomCreateTime = randomNum(300,500);
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
        newcustomer.style.display = "none";
        progress.style.display = "none";
        Customers.waitingCustomersQue.shift();
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
    Customers.waitingCustomersLimit++;
    let customerLookingMenuIndex = Customers.waitingCustomersQueIndex.shift();
    console.log(customerLookingMenu,customerLookingMenuEle,customerLookingMenuIndex,Customers.waitingCustomersLimit);
    let fatherArea = document.getElementsByClassName("newCustomers")[0];
    fatherArea.removeChild(fatherArea.childNodes[0]);
    Customers.showMenu(customerLookingMenuEle,customerLookingMenu);
  },
  //移除之后显示菜单
  showMenu : function(ele,name) {
    let leaveButton = document.getElementsByClassName("LeaveThere")[0];
    leaveButton.addEventListener("click",Customers.CustomerLeave);

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

    Menu.childNodes[1].innerText = name + "正在点菜，已点" + "cur_first_customer_free" + "元的菜";

    // setMenuCheckboxesClickEvents();
    Menu.style.display = '';
    cover.style.display = '';
  },
  CustomerLeave : function () {
  let Menu = document.getElementsByClassName("Menu")[0];
  let wrap = document.getElementsByClassName("curCustomerWrap")[0];
  Menu.style.display = 'none';
  cover.style.display = 'none';
  wrap.style.display = 'none';
}
}

// //获取当前有多少空座位、有多少等待的顾客、有多少已经走了的顾客、当前处于队头的顾客的index
// //当前顾客的队列、队首顾客、暂停flag、当前顾客点菜的金额
// // let freeSet = document.getElementsByClassName("Customer").length;
// let allnewcus = 0;
// let leavedcus = 0;
// let cur_new_idx = 0;
// let cur_all_new_customer_que = [];
// let cur_all_new_customer_name = [];
// let cur_first_customer = undefined;
// let cur_first_customer_name = undefined;

// let cur_first_customer_free = 0;
// let max_curstomer_waiting = 6;

// //显示菜单栏
// function showMenu() {
//     let leaveButton = document.getElementsByClassName("LeaveThere")[0];
//     leaveButton.addEventListener("click",CustomerLeave);

//     let Menu = document.getElementsByClassName("Menu")[0];
//     let wrap = document.createElement("div");
//     let father = document.getElementsByClassName("mainGame")[0];
//     wrap.setAttribute("class","curCustomerWrap");
//     let newcus = document.createElement("div");
//     newcus.setAttribute("class","curCustomer");
//     let newimg = document.createElement("img");
//     newimg.setAttribute("src",cur_first_customer.children[0].children[0].getAttribute("src"));
//     newcus.appendChild(newimg);
//     wrap.appendChild(newcus);
//     father.appendChild(wrap);

//     Menu.childNodes[1].innerText = cur_first_customer_name + "正在点菜，已点" + cur_first_customer_free + "元的菜";

//     setMenuCheckboxesClickEvents();
//     Menu.style.display = '';
//     cover.style.display = '';
// }
// //顾客点击菜单后选择不吃了，离开
// function CustomerLeave() {
//   let Menu = document.getElementsByClassName("Menu")[0];
//   let wrap = document.getElementsByClassName("curCustomerWrap")[0];
//   Menu.style.display = 'none';
//   cover.style.display = 'none';
//   wrap.style.display = 'none';
// }
// //顾客点完菜后并且检查完菜单是否合适后，将顾客送入座位
// function FinishButton() {
//   let Menu = document.getElementsByClassName("Menu")[0];
//   let wrap = document.getElementsByClassName("curCustomerWrap")[0];
//   Menu.style.display = 'none';
//   cover.style.display = 'none';
//   let father = document.getElementsByClassName("mainGame")[0];
//   father.removeChild(wrap);
//   GetFreeSet();
//   cur_first_customer_free = 0;
//   let cold = document.getElementsByClassName("colddishcheckbox-box");
//   for(let i=0;i<cold.length;i++) {
//     cold[i].disabled = false;
//     cold[i].removeEventListener("click",function(){changeColdCheckboxesStatus(i,colddishes);});
//     cold[i].removeEventListener("click",changeColdFlagAndCheckStatus);
//     cold[i].checked = false;
//   }
//   let hot = document.getElementsByClassName("hotdishcheckbox-box");
//   for(let i=0;i<hot.length;i++) {
//     hot[i].disabled = false;
//     hot[i].removeEventListener("click",function(){changeColdCheckboxesStatus(i,hotdishes);});
//     hot[i].removeEventListener("click",changeColdFlagAndCheckStatus);
//     hot[i].checked = false;
//   }
//   let drink = document.getElementsByClassName("drinkcheckbox-box");
//   for(let i=0;i<drink.length;i++) {
//     drink[i].disabled = false;
//     drink[i].removeEventListener("click",function(){changeColdCheckboxesStatus(i,drinks);});
//     drink[i].removeEventListener("click",changeColdFlagAndCheckStatus);
//     drink[i].checked = false;
//   }
// }


// //将顾客送入座位
// function GetFreeSet() {
//   let allsets = document.getElementsByClassName("Customer");
//   for(let i = 0;i<allsets.length;i++) {
//     if(allsets[i].childNodes[1] === undefined){
//       let newimg = document.createElement('img');
//       newimg.src =  cur_first_customer.children[0].children[0].getAttribute("src");
//       allsets[i].appendChild(newimg);
//       cur_first_customer = undefined;
//       cur_first_customer_name = undefined;
//       break;
//     }
//   }
// }
// //三类菜品的flag，表示当前是否满足下单的条件
// let coldFlag = 0;
// let hotFlag = 0;
// let drinkFlag = 0;
// //为三类菜品分别设置修改flag的方法
// function changeColdFlagAndCheckStatus() {
//   if(this.checked){
//     coldFlag++;
//   }
//   else{
//     coldFlag--;
//   }
//   CheckStatus();
// }

// function changeHotFlagAndCheckStatus() {
//   if(this.checked){
//     hotFlag++;
//   }
//   else{
//     hotFlag--;
//   }
//   CheckStatus();
// }

// function changeDrinkFlagAndCheckStatus() {
//   if(this.checked){
//     drinkFlag++;
//   }
//   else{
//     drinkFlag--;
//   }
//   CheckStatus();
// }
// //检查菜单当前是否满足条件，每点击一次，就检查一次
// function CheckStatus() {
//   if(coldFlag === 0 && hotFlag === 1 && drinkFlag ===0){
//     let finishButton = document.getElementsByClassName("Finish")[0];
//     finishButton.addEventListener("click",FinishButton);
//     finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";
//   }
//   else if(coldFlag === 1 && hotFlag === 1 && drinkFlag ===0) {
//     let finishButton = document.getElementsByClassName("Finish")[0];
//     finishButton.addEventListener("click",FinishButton);
//     finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";

//   }
//   else if(coldFlag === 1 && hotFlag === 1 && drinkFlag === 1) {
//     let finishButton = document.getElementsByClassName("Finish")[0];
//     finishButton.addEventListener("click",FinishButton);
//     finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";

//   }
//   else if(coldFlag === 0 && hotFlag === 1 && drinkFlag === 1) {
//     let finishButton = document.getElementsByClassName("Finish")[0];
//     finishButton.addEventListener("click",FinishButton);
//     finishButton.style.background = "linear-gradient(to top, #ffd24d 0%,#ffd24d 50%,#ffe699 51%,#ffe699 100%)";
//     // finishButton.removeEventListener("click",function(){changeHotCheckboxesStatus(i,hotdishes);});
//   }
//   else {
//     let finishButton = document.getElementsByClassName("Finish")[0];
//     finishButton.style.background = "linear-gradient(to top, #ded3ba 0%,#ded3ba 50%,#d3c6a5 51%,#d3c6a5 100%)";
//     console.log("check the menu");
//   }
// }
// function changeColdCheckboxesStatus(idx,dishes) {
//   if(coldcheckflag === 0) {
//     for(let i=0;i<dishes.length;i++){
//       if(i !== idx) {
//         dishes[i].disabled = true;
//       }
//       coldcheckflag = 1;
//     }
//     cur_first_customer_free += parseInt(dishes[idx].parentNode.children[3].innerText.substr(1,));
//     let Menu = document.getElementsByClassName("Menu")[0];
//     Menu.childNodes[1].innerText = cur_first_customer_name + "正在点菜，已点" + cur_first_customer_free + "元的菜";
//   }
//   else if(coldcheckflag === 1) {
//     for(let i=0;i<dishes.length;i++){
//       dishes[i].disabled = false;
//     }
//     coldcheckflag = 0;
//     cur_first_customer_free -= parseInt(dishes[idx].parentNode.children[3].innerText.substr(1,));
//     let Menu = document.getElementsByClassName("Menu")[0];
//     Menu.childNodes[1].innerText = cur_first_customer_name + "正在点菜，已点" + cur_first_customer_free + "元的菜";  
//   }
// }
// function changeHotCheckboxesStatus(idx,dishes) {
//   if(hotcheckflag === 0) {
//     for(let i=0;i<dishes.length;i++){
//       if(i !== idx) {
//         dishes[i].disabled = true;
//       }
//       hotcheckflag = 1;
//     }
//     cur_first_customer_free = cur_first_customer_free + parseInt(dishes[idx].parentNode.children[3].innerText.substr(1,));
//     let Menu = document.getElementsByClassName("Menu")[0];
//     Menu.childNodes[1].innerText = cur_first_customer_name + "正在点菜，已点" + cur_first_customer_free + "元的菜";
//   }
//   else if(hotcheckflag === 1) {
//     for(let i=0;i<dishes.length;i++){
//       dishes[i].disabled = false;
//     }
//     hotcheckflag = 0;
//     cur_first_customer_free -= parseInt(dishes[idx].parentNode.children[3].innerText.substr(1,));
//     let Menu = document.getElementsByClassName("Menu")[0];
//     Menu.childNodes[1].innerText = cur_first_customer_name + "正在点菜，已点" + cur_first_customer_free + "元的菜";
//   }

// }
// function changeDrinkCheckboxesStatus(idx,dishes) {
//   if(drinkcheckflag === 0) {
//     for(let i=0;i<dishes.length;i++){
//       if(i !== idx) {
//         dishes[i].disabled = true;
//       }
//       drinkcheckflag = 1;
//     }
//     cur_first_customer_free += parseInt(dishes[idx].parentNode.children[3].innerText.substr(1,));
//     let Menu = document.getElementsByClassName("Menu")[0];
//     Menu.childNodes[1].innerText = cur_first_customer_name + "正在点菜，已点" + cur_first_customer_free + "元的菜";
//   }
//   else if(drinkcheckflag === 1) {
//     for(let i=0;i<dishes.length;i++){
//       dishes[i].disabled = false;
//     }
//     drinkcheckflag = 0;
//     cur_first_customer_free -= parseInt(dishes[idx].parentNode.children[3].innerText.substr(1,));
//     let Menu = document.getElementsByClassName("Menu")[0];
//     Menu.childNodes[1].innerText = cur_first_customer_name + "正在点菜，已点" + cur_first_customer_free + "元的菜";
//   }
// }

// let coldcheckflag = 0;
// let hotcheckflag = 0;
// let drinkcheckflag = 0;
// //为每个checkbox添加eventlistener，便于进行菜单状态检查和下单按钮状态的修改
// function setMenuCheckboxesClickEvents() {
//   let colddishes = document.getElementsByClassName("colddishcheckbox-box");
//   let hotdishes = document.getElementsByClassName("hotdishcheckbox-box");
//   let drinks = document.getElementsByClassName("drinkcheckbox-box");

//   for(let i=0;i<colddishes.length;i++){
//     colddishes[i].addEventListener("click",changeColdFlagAndCheckStatus);
//     colddishes[i].addEventListener("click",function(){changeColdCheckboxesStatus(i,colddishes);});
//   }
//   for(let i=0;i<hotdishes.length;i++){
//     hotdishes[i].addEventListener("click",changeHotFlagAndCheckStatus);
//     hotdishes[i].addEventListener("click",function(){changeHotCheckboxesStatus(i,hotdishes);});

//   }
//   for(let i=0;i<drinks.length;i++){
//     drinks[i].addEventListener("click",changeDrinkFlagAndCheckStatus);
//     drinks[i].addEventListener("click",function(){changeDrinkCheckboxesStatus(i,drinks);});
//   }
// }
