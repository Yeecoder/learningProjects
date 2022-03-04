
let head_links = document.getElementsByClassName("head-link");
for(let head=0;head<head_links.length;head++){
    head_links[head].addEventListener("click",headLinksClickedAlter);
}
function headLinksClickedAlter() {
    alert("即将跳转进入："+this.innerHTML + " 页面");
}

let management_center = document.getElementsByClassName("management-center")[0];
management_center.addEventListener("click",managementCenterClickedAlter);
function managementCenterClickedAlter() {
    alert("即将跳转进入：管理中心 页面");
}

// 选择课程类别
// 全部课程
let all_classes = document.getElementById("Classes-Menu-all");
all_classes.addEventListener("click",add_underline_all);
function add_underline_all() {
    clean_underline();
    all_classes.style.borderBottom="2px solid #000";
    all_classes.style.fontSize = "18px";
    all_classes.style.fontWeight = "600";
    remove_hidden_arr();
}
// HTML课程
let html_classes = document.getElementById("Classes-Menu-html");
html_classes.addEventListener("click",add_underline_html);
let html_div_classes = document.getElementsByClassName("class-HTML");
for(let html_div=0;html_div<html_div_classes.length;html_div++) {
    html_div_classes[html_div].addEventListener("click",add_underline_html);
}
function add_underline_html() {
    clean_underline();
    html_classes.style.borderBottom="2px solid #000";
    html_classes.style.fontSize = "18px";
    html_classes.style.fontWeight = "600";
    remove_hidden_arr();
    let htmlClasses = document.getElementsByClassName("Classes-list-item");
    for(let i=0;i<htmlClasses.length;i++)
    {
        if(htmlClasses[i].querySelectorAll(".class-HTML").length === 0) {
            htmlClasses[i].hidden = true;
        }
    }
}
// CSS课程
let css_classes = document.getElementById("Classes-Menu-css");
css_classes.addEventListener("click",add_underline_css);
let css_div_classes = document.getElementsByClassName("class-CSS");
for(let css_div=0;css_div<css_div_classes.length;css_div++) {
    css_div_classes[css_div].addEventListener("click",add_underline_css);
}
function add_underline_css() {
    clean_underline();
    css_classes.style.borderBottom="2px solid #000";
    css_classes.style.fontSize = "18px";
    css_classes.style.fontWeight = "600";
    remove_hidden_arr();
    let cssClasses = document.getElementsByClassName("Classes-list-item");
    for(let i=0;i<cssClasses.length;i++)
    {
        if(cssClasses[i].querySelectorAll(".class-CSS").length === 0) {
            cssClasses[i].hidden = true;
        }
    }
}
// JS课程
let js_classes = document.getElementById("Classes-Menu-js");
js_classes.addEventListener("click",add_underline_js);
let js_div_classes = document.getElementsByClassName("class-JS");
for(let js_div=0;js_div<js_div_classes.length;js_div++) {
    js_div_classes[js_div].addEventListener("click",add_underline_js);
}
function add_underline_js() {
    clean_underline();
    js_classes.style.borderBottom="2px solid #000";
    js_classes.style.fontSize = "18px";
    js_classes.style.fontWeight = "600";
    remove_hidden_arr();
    let jsClasses = document.getElementsByClassName("Classes-list-item");
    for(let i=0;i<jsClasses.length;i++)
    {
        if(jsClasses[i].querySelectorAll(".class-JS").length === 0) {
            jsClasses[i].hidden = true;
        }
    }
}
// 还原课程选择栏的下划线、加粗、字体变大等效果
function clean_underline() {
    all_classes.style.borderBottom="";
    all_classes.style.fontSize = "14px";
    all_classes.style.fontWeight = "";
    html_classes.style.borderBottom="";
    html_classes.style.fontSize = "14px";
    html_classes.style.fontWeight = "";
    css_classes.style.borderBottom="";
    css_classes.style.fontSize = "14px";
    css_classes.style.fontWeight = "";
    js_classes.style.borderBottom="";
    js_classes.style.fontSize = "14px";
    js_classes.style.fontWeight = "";
}
//删除课程元素的隐藏属性
function remove_hidden_arr() {
    let allClasses = document.getElementsByClassName("Classes-list-item");
    for(let i=0;i<allClasses.length;i++)
    {
        allClasses[i].removeAttribute("hidden");
    }
}


let school_date_module = (function(){
    
    let year_inp_flag = false;
    let school_date_flag = false;
    // 获取入学时间选择div元素
    let schoolDate = document.getElementsByClassName("SchoolDate")[0];
    //通过设置hidden属性，隐藏选择入学时间的div
    schoolDate.hidden = true;
    //删除hidden属性显示选择入学时间的div
    let showSchoolDate = function () {
        schoolDate.removeAttribute("hidden");
        div_inp.focus();
        div_inp.style.borderRadius = "10px 10px 0 0";
        div_inp.style.backgroundColor = "#fff";
    };
    //隐藏选择入学时间的div
    let hiddenSchoolDate =  function() {
    schoolDate.hidden = true;
        div_inp.style.borderRadius = "10px";
        div_inp.style.backgroundColor = "#eee";
    };

    // 分别设置移出input和div的标志变量，且当两个标志变量均为true时隐藏备选时间div元素
    let setinp_flag =  function() {
        div_inp.blur();
        year_inp_flag = true;
        judge_flag();
    };
    let setschool_flag =  function() {
        div_inp.blur();
        school_date_flag = true;
        judge_flag();
    };
    let judge_flag =  function() {
        if(year_inp_flag === true && school_date_flag === true){
            hiddenSchoolDate();
            div_inp.blur();
            year_inp_flag = false;
            school_date_flag = false;
        }
    };
    // 用户点击重新报名后，EventListener响应过一次后就不再相应，需要重新绑定，并重置相关标志变量
    let bindSchoolDateEvent =  function() {
        year_inp_flag = false;
        school_date_flag = false;
        // 获取入学时间选择div
        schoolDate = document.getElementsByClassName("SchoolDate")[0];
        //隐藏选择入学时间的div
        schoolDate.hidden = true;
        // 获取年份输入框
        div_inp = document.getElementsByClassName("select-year")[0];
        div_inp.addEventListener("mouseenter",showSchoolDate);
        div_inp.addEventListener("mouseleave",setinp_flag);
        schoolDate.addEventListener("mouseleave",setschool_flag);
        ele = document.addEventListener("click",hiddenSchoolDate);

        current = new Date().getFullYear();

        // 获取输入框中的默认入学时间
        default_year = document.getElementsByClassName("select-year");
        // 为每一个时间添加EventListener
        allCells = document.getElementsByClassName("cell");
        for(let i=0;i<allCells.length;i++){
        allCells[i].addEventListener("click",selectYear);
        }
    };
    // 获取年份输入框
    let div_inp = document.getElementsByClassName("select-year")[0];
    // 添加EventListener，当鼠标移入时，调用方法显示备选时间div元素
    div_inp.addEventListener("mouseenter",showSchoolDate);
    // 添加EventListener，当鼠标移出input时，调用方法设置鼠标已移出input框标志变量
    div_inp.addEventListener("mouseleave",setinp_flag);
    // 添加EventListener，当鼠标移出备选时间div时，调用方法设置鼠标已移出div框标志变量
    schoolDate.addEventListener("mouseleave",setschool_flag);
    // 给页面本身添加EventListener，当点击页面其他位置时，隐藏备选时间div
    document.addEventListener("click",hiddenSchoolDate);

    let leftlen = div_inp.getBoundingClientRect().left;
    let schdate = document.getElementsByClassName("SchoolDate")[0];
    schdate.style.left = leftlen + "px";

    //获取当前年份
    let current = new Date().getFullYear();




    let createSchoolDateTable =  function() {
        let tbody = document.getElementsByClassName("year-table")[0].children[0];
        for(let i=0;i<3;i++){
            let newtr = document.createElement("tr");
            for(let j=0;j<4;j++) {
                let newtd = document.createElement("td");
                newtd.setAttribute("class","available");
                let newa = document.createElement("a");
                newa.innerHTML = current + ((i+1)*(j+1)) - 12;
                newa.setAttribute("class","cell");

                newtd.appendChild(newa);

                newtr.appendChild(newtd);
            }
            tbody.appendChild(newtr);
        }
    };
    //动态创建入学时间选择框中的时间
    createSchoolDateTable();
    let selectYear =  function(event) {
        let selectedyear = event.srcElement;
        div_inp.value = selectedyear.innerHTML;
    }
    // 为每一个时间添加EventListener，将选中的时间填入到input中
    let allCells = document.getElementsByClassName("cell");
    for(let i=0;i<allCells.length;i++){
        allCells[i].addEventListener("click",selectYear);
    }


    return {
        showSchoolDate : showSchoolDate,
        hiddenSchoolDate : hiddenSchoolDate,
        setinp_flag : setinp_flag,
        setschool_flag : setschool_flag,
        judge_flag : judge_flag,
        createSchoolDateTable : createSchoolDateTable,
        selectYear : selectYear,
        bindSchoolDateEvent : bindSchoolDateEvent,
        current : current
    };
})();


let university_module = (function(){

    let university_inp_flag = false;
    let university_flag = false;
    // 获取大学选择div
    let university = document.getElementsByClassName("University")[0];
    university.hidden = true;
    let showUniversity =  function() {
        university.removeAttribute("hidden");
        div_university_inp.focus();
        div_university_inp.style.borderRadius = "10px 10px 0 0";
        div_university_inp.style.backgroundColor = "#fff";
    };
    let hiddenUniversity = function() {
        university.hidden = true;
        div_university_inp.style.borderRadius = "10px";
        div_university_inp.style.backgroundColor = "#eee";
    };
    let set_university_inp_flag = function() {
        div_university_inp.blur();
        university_inp_flag = true;
        judge_university_flag();
    };
    let set_university_flag = function() {
        div_university_inp.blur();
        university_flag = true;
        judge_university_flag();
    };
    let judge_university_flag = function() {
        if(university_inp_flag === true && university_flag === true){
            div_university_inp.blur();
            hiddenUniversity();
            university_inp_flag = false;
            university_flag = false;
        }
    };

    let bindUniversityEvent = function() {
        university_inp_flag = false;
        university_flag = false;
        // 获取大学选择div
        university = document.getElementsByClassName("University")[0];
        university.hidden = true;

        div_university_inp = document.getElementsByClassName("select-university")[0];
        div_university_inp.addEventListener("mouseenter",showUniversity);
        div_university_inp.addEventListener("mouseleave",set_university_inp_flag);
        university.addEventListener("mouseleave",set_university_flag);
        document.addEventListener("click",hiddenUniversity);

        ul_pro = document.getElementsByClassName("university-ul")[0];

        div_university_inp.addEventListener("mouseenter",showUniversity);
        div_university_inp.addEventListener("mouseleave",set_university_inp_flag);
        university.addEventListener("mouseleave",set_university_flag);
        document.addEventListener("click",hiddenUniversity);
        all_uni_cell = document.getElementsByClassName("university-cell");

        for(let c=0;c<all_uni_cell.length;c++){
            all_uni_cell[c].addEventListener("mouseenter",function(){clean_create_UniversityTable(c)});
        }

    };
    // 获取大学输入框
    let div_university_inp = document.getElementsByClassName("select-university")[0];
    let leftlen = div_university_inp.getBoundingClientRect().left;
    let uni = document.getElementsByClassName("University")[0];
    uni.style.left = leftlen + "px";
    div_university_inp.addEventListener("mouseenter",showUniversity);
    div_university_inp.addEventListener("mouseleave",set_university_inp_flag);
    university.addEventListener("mouseleave",set_university_flag);
    document.addEventListener("click",hiddenUniversity);

    let ul_pro = document.getElementsByClassName("university-ul")[0];

    let provinces_universities = {
        "请按提示选择所在大学" : []
    }

    let generateSchoolName = function(){
        for(let pro = 0;pro < 26; pro++) {
            let arr = [];
            for(let uni_count = 5;uni_count<25;uni_count++) {
                arr.push(String.fromCharCode(pro+65) + "省" + "第" + (uni_count+1).toString() + "大学");
            }
            provinces_universities[String.fromCharCode(pro+65) + "省"] = arr;
            arr = [];
        }
    };
    generateSchoolName();


    let createUniversityLi = function() {
        let province_keys = Object.keys(provinces_universities);
        for(let i = 0;i < province_keys.length;i++) {
            let newli = document.createElement("li");
            newli.setAttribute("class","university-li");
            let newa = document.createElement("a");
            newa.innerHTML = province_keys[i];
            newa.setAttribute("class","university-cell");
            newli.appendChild(newa);
            ul_pro.appendChild(newli);
        }
    };
    createUniversityLi();

    let all_uni_cell = document.getElementsByClassName("university-cell");
    // 对于div模拟的多级菜单中，鼠标移动到其他的菜单栏时清除原有的内容，并生成对应的新的信息
    for(let c=0;c<all_uni_cell.length;c++){
        all_uni_cell[c].addEventListener("mouseenter",function(){clean_create_UniversityTable(c)});
    }//addEventListener传递参数时的特别方法

    let clean_UniversityTable = function() {
        let uni_table = document.getElementsByClassName("Universities-table")[0];
        let uni_tbody = document.getElementsByClassName("Universities-tbody")[0];
        uni_table.removeChild(uni_tbody);
        let new_tbody = document.createElement("tbody");
        new_tbody.setAttribute("class","Universities-tbody");
        uni_table.appendChild(new_tbody);
    };
    let createUniversityTable = function(key) {

        let uni_tbody = document.getElementsByClassName("Universities-table")[0].children[0];
        let cols = 2;
        let province_keys = Object.keys(provinces_universities);
        let rows = provinces_universities[province_keys[key]].length / cols;
        for(let i=0;i < rows;i++) {
            let new_tr = document.createElement("tr");
            for(let j=0;j<cols;j++){
                let new_td = document.createElement("td");
                
                let new_a = document.createElement("a");
                new_a.setAttribute("class","Universities-cell");
                new_a.innerHTML = provinces_universities[province_keys[key]][i*2+j];
                new_td.appendChild(new_a);
                new_tr.appendChild(new_td);
            }
            uni_tbody.appendChild(new_tr);

        }
        let default_university = document.getElementsByClassName("select-university");

        let all_unies_cell = document.getElementsByClassName("Universities-cell");

        for(let i=0;i<all_unies_cell.length;i++){
            all_unies_cell[i].addEventListener("click",selectUniversity);
        }
        function selectUniversity(event) {
            let selectedUniversity = event.srcElement;
            default_university[0].value = selectedUniversity.innerHTML;
        }
    };
    let clean_create_UniversityTable = function(key) {
        clean_UniversityTable();
        createUniversityTable(key);
    };

    return {
        showUniversity : showUniversity,
        hiddenUniversity : hiddenUniversity,
        set_university_inp_flag : set_university_inp_flag,
        set_university_flag : set_university_flag,
        judge_university_flag : judge_university_flag,
        bindUniversityEvent : bindUniversityEvent,
        generateSchoolName : generateSchoolName,
        createUniversityLi : createUniversityLi,
        clean_UniversityTable : clean_UniversityTable,
        createUniversityTable : createUniversityTable,
        clean_create_UniversityTable : clean_create_UniversityTable
    };
})();


let email_input = document.getElementsByClassName("select-email")[0];
email_input.addEventListener("mouseenter",changeEmailInputStyleOnFocus);
email_input.addEventListener("mouseleave",changeEmailInputStyleOnBlur);
function changeEmailInputStyleOnFocus() {
    email_input.focus();
    email_input.style.backgroundColor = "#fff";
}
function changeEmailInputStyleOnBlur() {
    email_input.blur();
    email_input.style.backgroundColor = "#eee";
}

function bindSubmitEvent() {
    submit = document.getElementsByClassName("select-submit")[0];
    submit.addEventListener("click",check_module.checkInput);
    submit.addEventListener("click",check_module.checkInput);
}


let check_module = (function(){

    let finial_uni = "";
    let finial_year = "";
    let finial_email = "";
    // 检查输入
    let checkInput = function() {
        // 默认填入的信息是未通过检验的
        let true_email_flag = false;
        let true_uni_flag = false;
        let true_school_date_flag = false;
        true_uni_flag = checkUniversity();
        true_email_flag = checkEmail();
        true_school_date_flag = checkSchoolDate();
        if(true_email_flag === false || true_uni_flag === false || true_school_date_flag === false){
            insterErrorDivAfterEnroll(true_email_flag,true_uni_flag,true_school_date_flag);
            autoRemoveError();
        }
        else {
            // 只有检查通过了才保存数据
            saveFinialData();
            insertFinishDivAfterEnroll();
            addEnrollFinishDiv();
            autoRemoveFinish();
        }
    };
    // 保存信息，方便用户点击重新报名后进行修改
    let saveFinialData = function() {
        finial_uni = document.getElementsByClassName("select-university")[0].value;
        finial_year = document.getElementsByClassName("select-year")[0].value;
        finial_email = document.getElementsByClassName("select-email")[0].value;
    };
    // 将保存的信息填入
    let setLastData = function() {
        document.getElementsByClassName("select-university")[0].value = finial_uni;
        document.getElementsByClassName("select-year")[0].value = finial_year;
        document.getElementsByClassName("select-email")[0].value = finial_email;
    };
    
    let autoRemoveError = function() {
        setTimeout(function () {
            cleanError();
         }, 3000);
    };
    
    let autoRemoveFinish = function() {
        setTimeout(function () {
            cleanFinish();
         }, 5000);
    };
    
    let backToEnrollFormDiv = function() {
        let Enroll = document.getElementsByClassName("Enroll")[0];
        Enroll.innerHTML += `
        <div class="Enroll-forms-button">
            <ul class="Forms-Button">
                <li>
                    <div class="Forms-Button-infos">
                        <div class="Forms-Button-title">选择你的学校</div>
                        <input type="text" name="School" class="select-university"  value="">
                    </div>
                </li>
                <li>
                    <div class="Forms-Button-infos">
                        <div class="Forms-Button-title">选择您的入学年份</div>
                        <input type="text" name="Year" class="select-year" value="2022">
                    </div>
    
                </li>
                <li>
                    <div class="Forms-Button-infos">
                        <div class="Forms-Button-title">输入您的电子邮箱</div>
                        <input type="text" name="Email" class="select-email">
                    </div>
                </li>
                <li>
                    <div class="Forms-Button-infos">
                        <div class="Forms-Button-title"></div>
                        <input type="button" value="报名" name="Submit" class="select-submit">
                    </div>
                </li>
            </ul>
        </div>`;
        setLastData();
        rebindEvent();
    }
    
    let addEnrollFinishDiv = function() {
        let Forms_button = document.getElementsByClassName("Enroll-forms-button")[0];
        let father = Forms_button.parentNode;
        father.removeChild(Forms_button);
        let finish_alarm_div = document.createElement("div");
        finish_alarm_div.setAttribute("class","Enroll-Alarm");
        let finish_alarm = document.createElement("div");
        finish_alarm.setAttribute("class","finish_alarm");
        finish_alarm.innerHTML = "您已完成报名，开始您的学习之旅吧!";
    
        let button_div = document.createElement("div");
        button_div.setAttribute("class", "Re-Button-Div");
        let re_button = document.createElement("input");
        re_button.setAttribute("type","button");
        re_button.setAttribute("value","重新报名");
        re_button.setAttribute("name","Re");
        re_button.setAttribute("class","Re-Button");
        re_button.addEventListener("click",removeEnrollFinishDiv);
        re_button.addEventListener("click",cleanFinish)
        re_button.addEventListener("click",backToEnrollFormDiv);
        button_div.appendChild(re_button);
        finish_alarm_div.appendChild(finish_alarm);
        finish_alarm_div.appendChild(button_div);
        father.appendChild(finish_alarm_div);
    };
    
    let removeEnrollFinishDiv = function() {
        let Enroll_Alarm = document.getElementsByClassName("Enroll-Alarm")[0];
        let father = Enroll_Alarm.parentNode;
        father.removeChild(Enroll_Alarm);
    };
    
    let insertFinishDivAfterEnroll = function() {
        cleanError();
        let Enroll_Finish_div = document.createElement("div");
        Enroll_Finish_div.setAttribute("class","Enroll-Finish");
        let Enroll_Finish_info_div = document.createElement("div");
        Enroll_Finish_info_div.setAttribute("class","Enroll-Finish-info");
        let new_finish_info = document.createElement("div");
        new_finish_info.setAttribute("class","new-finish-info");
    
        let university = document.getElementsByClassName("select-university")[0].value;
        let grade = document.getElementsByClassName("select-year")[0].value;
        let email = document.getElementsByClassName("select-email")[0].value;
        new_finish_info.innerHTML = "恭喜您，来自" + university + grade + "级" + email + "同学，您的报名信息已记录，请关注您的邮件";
    
        Enroll_Finish_info_div.appendChild(new_finish_info);
        Enroll_Finish_div.appendChild(Enroll_Finish_info_div);
    
        let targetElement = document.getElementsByClassName("Enroll")[0];
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement){
              parent.appendChild(newElement);
        }
        else{
              parent.insertBefore(Enroll_Finish_div,targetElement.nextSibling);
        }    
    };
    
    // 验证邮箱的正确性
    let checkEmail = function() {
        let myemail = document.getElementsByClassName("select-email")[0].value;
        let re = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        true_email_flag = re.test(myemail);
        return true_email_flag;
    };
    
    // 验证已经选择了学校
    let checkUniversity = function() {
        let check_university_inp = document.getElementsByClassName("select-university")[0];
        if (check_university_inp.value.length === 0){
            true_uni_flag = false;
        }
        else {
            true_uni_flag = true;
        }
        return true_uni_flag;
    };
    
    let checkSchoolDate = function() {
        let myschooldate = document.getElementsByClassName("select-year")[0].value;
        if( (school_date_module.current-11) < myschooldate && myschooldate < school_date_module.current) {
            true_school_date_flag = true;
        }
        else {
            true_school_date_flag = false;
        }
        return true_school_date_flag;
    };
    
    // 添加新的错误信息前清除原有的错误信息
    let cleanError = function() {
        let father = document.getElementsByClassName("Enroll")[0].parentElement;
        let havebeenthere = document.getElementsByClassName("Enroll-Error")[0];
        if(havebeenthere === undefined){
            ;
        }
        else{
            father.removeChild(havebeenthere);
        }
    };
    
    // 重新报名前清除原有的报名成功信息
    let cleanFinish = function() {
        let father = document.getElementsByClassName("Enroll")[0].parentElement;
        let havebeenthere = document.getElementsByClassName("Enroll-Finish")[0];
        if(havebeenthere === undefined){
            ;
        }
        else{
            father.removeChild(havebeenthere);
        }
    };
    // 验证未通过
    
    let insterErrorDivAfterEnroll = function(true_email_flag,true_uni_flag,true_school_date_flag){
        cleanError();
        let Enroll_Error_div = document.createElement("div");
        Enroll_Error_div.setAttribute("class","Enroll-Error");
        let Enroll_Error_info_div = document.createElement("div");
        Enroll_Error_info_div.setAttribute("class","Enroll-Error-info");
        let new_error_info = document.createElement("div");
        new_error_info.setAttribute("class","new-error-info");
        if(true_email_flag !== true){
            if(true_uni_flag !== true){
                if(true_school_date_flag !== true) {
                    new_error_info.innerHTML = "请选择正确的学校、入学时间段，并检查邮箱地址是否符合要求(yourname@host.com)，并重新输入";
                }
                else {
                    new_error_info.innerHTML = "请选择正确的学校，并检查邮箱地址是否符合要求(yourname@host.com)，并重新输入";
                }
            }
            else {
                if(true_school_date_flag !== true) {
                    new_error_info.innerHTML = "请选择正确的入学时间段，并检查邮箱地址是否符合要求(yourname@host.com),请重新输入";
                }
                else {
                    new_error_info.innerHTML = "邮箱地址不符合要求(yourname@host.com),请重新输入";
                }
            }
        }
        else {
            if(true_uni_flag !== true) {
                if(true_school_date_flag !== true) {
                    new_error_info.innerHTML = "请选择正确的学校、入学时间段";
                }
                else {
                    new_error_info.innerHTML = "请选择正确的学校";
                }
            }
            else {
                if(true_school_date_flag !== true) {
                    new_error_info.innerHTML = "请选择正确的入学时间段";
                }
                else {
                    ;
                }
            }
        }
        Enroll_Error_info_div.appendChild(new_error_info);
        Enroll_Error_div.appendChild(Enroll_Error_info_div);
    
        let targetElement = document.getElementsByClassName("Enroll")[0];
        var parent = targetElement.parentNode;
        if(parent.lastChild == targetElement){
              parent.appendChild(newElement);
        }
        else{
              parent.insertBefore(Enroll_Error_div,targetElement.nextSibling);
        }              
    }
    
    let rebindEvent = function() {
        school_date_module.bindSchoolDateEvent();
        university_module.bindUniversityEvent();
        bindSubmitEvent();
    
    }
    return {
        checkInput : checkInput,
    };
})();

let submit = document.getElementsByClassName("select-submit")[0];
submit.addEventListener("click",check_module.checkInput);