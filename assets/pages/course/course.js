
var btn = document.querySelector('.add');
var remove = document.querySelector('.draggable');
function dragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
};
 
function dragEnter(e) {
  this.classList.add('over');
}
 
function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}
 
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}
 
function dragDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}
 
function dragEnd(e) {
  var listItens = document.querySelectorAll('.draggable');
  [].forEach.call(listItens, function(item) {
    item.classList.remove('over');
  });
  this.style.opacity = '1';
}
 
function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}

var listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function(item) {
  addEventsDragAndDrop(item);
});

var ns = $('.coursesortable').nestedSortable({
  scroll: true,
  forcePlaceholderSize: true,
  listType:"ul",
  handle: 'div',
  helper: 'clone',
  items: 'li',
  toleranceElement: 'div>',
  opacity: .6,
  placeholder: 'placeholder',
  revert: 250,
  isTree: true,
  expandOnHover: 700,
  startCollapsed: false,
  update: function(event, ui){
    var item = ui.item;
    var target = ui.item.parent().parent();
    var parent_id = target.attr("data-module_id");
    var parent_id_val = "";
    if(parent_id){
      parent_id_val = String(parent_id);
    }else{
      parent_id_val = null;
    }
    var module_id = item.attr("data-module_id");
    var level_number = item.index() + 1;
    var module_name = item.children().eq(0).children().eq(1).children().eq(1).attr("data-prev_val")
    var get_submodule_level_values = {
      module_name: String(decodeURIComponent(module_name)),
      level: parseInt(level_number), 
      course_id:String(document.getElementById("course_id").value),
      parent_id:parent_id_val
    }

    var url = API_CONTENT_URL + '/course_module/'+module_id+'/';
    var method = "PUT";
    $.ajax({
      url: url,
      type: method,
      data: JSON.stringify(get_submodule_level_values),
      headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
      success:function(response){
        console.log(response);
        location.reload();
      },
      error: function(error) {
        if (error.status === 401) {
          alert("Session Expired, Please login again.");
          logoutSession();
        }
        tags_response = "1";
        toastr.error("Response Error: " + error.message);
        console.log(error);
      }
    });
    
  }
});
function toinput(e){
    /*if(e.innerHTML.includes(". Chapter") || e.innerHTML.includes(". Lesson") || e.innerHTML.includes(". Topic") || e.innerHTML.includes(". Sub Topic") || e.innerHTML.includes("Level ") ){
      e.previousSibling.value = ''; 
    }
    if(e.innerHTML == "Add Module Name"){
      e.previousSibling.value = ''; 
    }
    e.setAttribute("style","display:none");
    e.previousSibling.setAttribute("style","display:block");
    e.previousSibling.focus();*/
    if(e.tagName == "P"){
        if(e.innerHTML.includes(". Chapter") || e.innerHTML.includes(". Lesson") || e.innerHTML.includes(". Topic") || e.innerHTML.includes(". Sub Topic") || e.innerHTML.includes("Level ") ){
          e.previousSibling.value = ''; 
        }
        if(e.innerHTML == "Add Module Name"){
          e.previousSibling.value = ''; 
        }
        e.setAttribute("style","display:none");
        e.previousSibling.setAttribute("style","display:block");
        e.previousSibling.focus();
    }else{
        if(e.innerHTML.includes(". Chapter") || e.innerHTML.includes(". Lesson") || e.innerHTML.includes(". Topic") || e.innerHTML.includes(". Sub Topic") || e.innerHTML.includes("Level ") ){
          e.parentElement.previousSibling.value = ''; 
        }
        if(e.innerHTML == "Add Module Name"){
          e.parentElement.previousSibling.value = ''; 
        }
        e.parentElement.setAttribute("style", "display:none");
        e.parentElement.previousSibling.setAttribute("style","display:block");
        e.parentElement.previousSibling.focus();
    }
}
function get_module_details(cid, module_id, mytagArray){
  $.ajax({
    url: API_CONTENT_URL + '/course_tags/?course_id='+cid+'&module_id='+module_id,
    type: 'get',
    dataType: 'json',
    success:function(response){
      var tags_response = "";
        mytagArray.forEach(function (element, index) {
        tag_exists = response.some(function(o){return o["tag_name"] === element;})
        if(!tag_exists && element){
          var tag_data = {
              "tag_name": decodeURIComponent(element),
              "module_id": module_id,
              "course_id": cid
          }
          $.ajax({
            url: API_CONTENT_URL + '/course_tags/?course_id='+cid+'&module_id='+module_id,
            type: 'POST',
            data: JSON.stringify(tag_data),
            headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
            success:function(response){
            },
            error: function(error) {
              if (error.status === 401) {
                alert("Session Expired, Please login again.");
                logoutSession();
              }
              tags_response = "1";
              toastr.error("Response Error: " + error.message);
              console.log(error);
            }
          });
        }
      });
    },
    error: function(error) {
      if (error.status === 401) {
        alert("Session Expired, Please login again.");
        logoutSession();
      }
    }
  });
}
function totext(e){
    if(e.value == ''){
        e.value = decodeURIComponent(e.nextSibling.dataset.prev_val);
    }
    if(e.value != "" && e.value != "Add Module Name"){
      var class_module_level = e.parentElement.parentElement.parentElement.classList[1];
      var first_five_char_class = class_module_level.substring(0,5);
      var get_submodule_level_values = '';
      if(e.dataset.module_id !== undefined){
        var url = API_CONTENT_URL + '/course_module/'+e.dataset.module_id+'/';
        var method = "PUT";
      }else{
        var url = API_CONTENT_URL + '/course_module/';
        var method = "POST";
      }
      if(first_five_char_class === "modul"){
        var level_number = class_module_level.split('_')[1];
        var get_submodule_level_values = {
          module_name: String(e.value),
          level: parseInt(level_number), 
          course_id:String(document.getElementById("course_id").value),
          parent_id:null
        };
      }else if(first_five_char_class === "sub_m"){
        var class_module_main_level = e.parentElement.parentElement.parentElement.classList[3];
        var class_module_sub_level = e.parentElement.parentElement.parentElement.classList[2];
        var parent_id = e.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-module_id");
        get_submodule_level_values = get_submodule_level_val(class_module_main_level, class_module_sub_level, e.value, parent_id);
      }

      let cid = e.dataset.cid;
      let module_id_val = e.dataset.module_id;
      const mytagArray = e.value.split(" ");
      var prev_tags = get_module_details(cid, module_id_val, mytagArray);
      
      e.nextSibling.dataset.prev_val = e.value;
      if(get_submodule_level_values != ''){
        var message = "";
        post_json_dat(url, get_submodule_level_values, method, e, message);
      }
    }
    if(e.nextElementSibling.childNodes[1] && e.nextElementSibling.childNodes[1].tagName == "IMG"){
        var dots = "";
        if(e.value.length > 75){
            dots = "...";
        }
        var input_value_substr = e.value.substring(0, 75)+dots;
        e.nextSibling.innerHTML = input_value_substr +`<img src="../assets/images/pen-edit.jpg" onclick="toinput(this);">`;
        e.setAttribute("style","display:none");
        e.nextSibling.setAttribute("style","display:block");
        e.nextSibling.focus();
    }else{
        var dots = "";
        if(e.value.length > 75){
            dots = "...";
        }
        var input_value_substr = e.value.substring(0, 75)+dots;
        e.nextSibling.innerHTML = input_value_substr;
        e.setAttribute("style","display:none");
        e.nextSibling.setAttribute("style","display:block");
        e.nextSibling.focus();
    }
    /*e.nextSibling.innerHTML = e.value; 
    e.setAttribute("style","display:none");
    e.nextSibling.setAttribute("style","display:block");
    e.nextSibling.focus();*/
}

function get_submodule_level_val(class_module_main_level, class_module_sub_level, ele_val, parent_id_val){
  var data_course_module = "";
  if(class_module_sub_level.indexOf('.') !== -1){
      var level_number = (class_module_sub_level.split("_module")[0]).split(".")[class_module_sub_level.split(".").length-1];
      data_course_module = {
        module_name: String(ele_val),
        level: parseInt(level_number), 
        course_id:String(document.getElementById("course_id").value),
        parent_id: parent_id_val
      }

  }else{
      var level_number = class_module_sub_level.split('_')[1];
      data_course_module = {
        module_name: String(ele_val),
        level: parseInt(level_number), 
        course_id:String(document.getElementById("course_id").value),
        parent_id: parent_id_val
      }
  }
  return data_course_module;
}

function post_json_dat(url, data, call_method, e, message){
  fetch(url, {
    method: call_method,
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
  })
  .then((response) => response.json())
  .then((json) => {
    var module_name = "";
    //el_1 = e.parentElement.nextSibling.childNodes[1].childNodes[0].firstChild;//edit
    //el_2 = e.parentElement.nextSibling.childNodes[1].childNodes[1].firstChild;//delete
    //console.log(e.parentElement.parentElement.childNodes)
      el_1 = e.parentElement.parentElement.childNodes[1].childNodes[1];//edit
      el_2 = e.parentElement.parentElement.childNodes[4].childNodes[1].firstChild.firstChild;//delete
    el_3 = e.parentElement.parentElement.childNodes[8].firstChild;//tags
    //el_4 = e.parentElement.parentElement.childNodes[4].firstChild;//progress
    el_5 = e.parentElement.parentElement.childNodes[5].firstChild;//attachment
    el_6 = e.parentElement.parentElement.childNodes[6].firstChild;//comment
    el_7 = e.parentElement.parentElement.childNodes[7].firstChild;//assign
    el_8 = e.parentElement.parentElement.childNodes[8].firstChild;//tag
    el_9 = e.parentElement.parentElement.childNodes[9].firstChild;//add

    el_li_0 = e.parentElement.parentElement.childNodes[0];
    el_li_1 = e.parentElement.parentElement.childNodes[1];
    el_li_2 = e.parentElement.parentElement.childNodes[2];
    el_li_3 = e.parentElement.parentElement.childNodes[3];
    el_li_4 = e.parentElement.parentElement.childNodes[4];
    el_li_5 = e.parentElement.parentElement.childNodes[5];
    el_li_6 = e.parentElement.parentElement.childNodes[6];
    el_li_7 = e.parentElement.parentElement.childNodes[7];
    el_li_8 = e.parentElement.parentElement.childNodes[8];
    el_li_9 = e.parentElement.parentElement.childNodes[9];
    el_1.setAttribute("data-flinkto", "courseslistlevel");
    if(json.module_id != undefined || json.module_id != null){
      e.setAttribute("data-module_id", json.module_id);
      el_1.setAttribute("data-module_id", json.module_id);
      el_2.setAttribute("data-module_id", json.module_id);
      el_3.setAttribute("data-module_id", json.module_id);
      //el_4.setAttribute("data-module_id", json.module_id);
      el_5.setAttribute("data-module_id", json.module_id);
      el_6.setAttribute("data-module_id", json.module_id);
      el_7.setAttribute("data-module_id", json.module_id);
      el_8.setAttribute("data-module_id", json.module_id);
      el_9.setAttribute("data-module_id", json.module_id);
    }
    if(json.course_id != undefined || json.course_id != null){
      e.setAttribute("data-cid", json.course_id);
      el_1.setAttribute("data-cid", json.course_id);
      el_2.setAttribute("data-cid", json.course_id);
      el_3.setAttribute("data-cid", json.course_id);
      //el_4.setAttribute("data-cid", json.course_id);
      el_5.setAttribute("data-cid", json.course_id);
      el_6.setAttribute("data-cid", json.course_id);
      el_7.setAttribute("data-cid", json.course_id);
      el_8.setAttribute("data-cid", json.course_id);
      el_9.setAttribute("data-cid", json.course_id);
    }
    if(json.can_access == false){
      el_li_0.style.cssText = "pointer-events: none";
      el_li_1.style.cssText = "pointer-events: none";
      el_li_2.style.cssText = "pointer-events: none";
      el_li_3.style.cssText = "pointer-events: none";
      el_li_4.style.cssText = "pointer-events: none";
      el_li_5.style.cssText = "pointer-events: none";
      el_li_6.style.cssText = "pointer-events: none";
      el_li_7.style.cssText = "pointer-events: none";
      el_li_8.style.cssText = "pointer-events: none";
      el_li_9.style.cssText = "pointer-events: none";
    }
    if(json.module_name != undefined || json.module_name != null){
      el_2.setAttribute("data-name", json.module_name);
      module_name = json.module_name;
    }
    var classList = e.parentElement.parentElement.parentElement.className.split(/\s+/);
    var num = "";
    if(classList[2] == 'main_mod'){
      num = 0;
    }else{
      var index = classList[1].lastIndexOf("_");
      var res_1 = Number(classList[1].substr(index+1));
      var result = classList[1].substr(index+1)+"."+ Number(e.parentElement.parentElement.childNodes.length - 8);
      num = String(result).match(/\./g).length;
    }
    if(num === 0){
      var result_textMsg = "Module:";
    }else if(num === 1){
      var result_textMsg = "Chapter:";
    }else if(num === 2){
      var result_textMsg = "Lesson:";
    }else if(num === 3){
      var result_textMsg = "Topic:";
    }else if (num === 4){
      var result_textMsg = "Sub Topic:";
    }else if (num > 4){
      var result_textMsg = "Level:";
    }
    if(call_method == "POST"){
      toastr.success("Created successfully.");
    }else{
      toastr.success("Updated successfully.");
    }
    //
  })
  .catch(function (error) {
    console.log("Requestfailed", error);
  });
}
function check_value(e){
    var x = e.parentElement.parentElement.parentElement.lastElementChild.childNodes;
    if(e.value != ''){
        e.parentElement.parentElement.setAttribute("style","opacity:1");
        var classList = e.parentElement.parentElement.parentElement.className.split(/\s+/);
        var index = classList[1].lastIndexOf("_");
        if(classList[2] == 'main_mod_empty'){
            e.parentElement.parentElement.parentElement.classList.remove('main_mod_empty');
            e.parentElement.parentElement.parentElement.classList.add('main_mod');
            e.parentElement.parentElement.parentElement.classList.add('draggable');
            e.parentElement.parentElement.parentElement.setAttribute("style","opacity:1");
            if(e.parentElement.previousSibling.nodeName == "#text"){
                e.parentElement.parentElement.childNodes[1].firstChild.setAttribute('draggable','true');
            }else{
                e.parentElement.previousSibling.firstChild.setAttribute("draggable","true");
            }
        }
        var result = Number(classList[1].substr(index+1)) + Number(1);
    }else{
        e.parentElement.parentElement.parentElement.classList.remove('main_mod');
        e.parentElement.parentElement.parentElement.classList.add('main_mod_empty');
        e.parentElement.parentElement.parentElement.classList.remove('draggable');
        e.parentElement.parentElement.setAttribute("style","opacity:0.5");
        if(e.parentElement.previousSibling.firstChild !== null){
          e.parentElement.previousSibling.firstChild.setAttribute("draggable","true");
        }
    }
    var listItens = document.querySelectorAll('.draggable');
    [].forEach.call(listItens, function(item) {
      addEventsDragAndDrop(item);
    });

}
function add_sub(e, section){
  var classList = e.className.split(/\s+/);
  var index = classList[1].lastIndexOf("_");
  var url = API_CONTENT_URL + '/course_module/';
  var method = "POST";
  //console.log(section);
  if(section == "Sub Section"){
    var result = e.children[1].children.length+1;
    var parent_id = e.getAttribute("data-module_id");
    var get_submodule_level_values = {
      module_name: String("Special Population 1"),
      level: parseInt(result), 
      course_id:String(document.getElementById("course_id").value),
      parent_id:parent_id
    };
  }else{
  var result = Number(classList[1].substr(index+1));    
    var get_submodule_level_values = {
      module_name: String("Introduction new"),
      level: parseInt(result+1), 
      course_id:String(document.getElementById("course_id").value),
      parent_id:null
    };
  }
  fetch(url, {
        method: method,
        body: JSON.stringify(get_submodule_level_values),
        headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      })
      .then((response) => response.json())
      .then((json) => {
        $('#course_id').trigger('click');
        //location.reload();
           /*var template =`<div class='module module_${result} main_mod no_child draggable ui-droppable' id='${result}' draggable='true' style='opacity:1'>`;
              template += `<ul class='main_module module_opacity draggable ui-droppable' style='opacity:1'>`;
              template += `<li class='course_img_icon disp_in_block flt_left' style=''><img src='../assets/images/course-icon.png' class='course_icon'></li>`;
              template += `<li class='module_input disp_in_block flt_left' style=''><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='Introduction' onblur='totext(this);' style='display: none;' maxlength='256'  data-module_id='${json.module_id}' data-cid='${json.course_id}'><p onclick='toinput(this);' id='module_module_"${result}"' data-prev_val='Introduction'>Introduction</p></li>`;
              template += `<li class='expand_img_icon disp_in_block flt_right' style=''><img src='../assets/images/arrow_up_icon.png' class='expand_icon' onclick='toggle_collapse_expand(this);'></li>`;
              template += `<li class='elipsis_img_icon disp_in_block flt_right' style=''><img src='../assets/images/elipsis.png' class='elipsis_icon' onclick='hide_show_container(this);'></li>`;
              template += `<li class='dots_img_icon disp_in_block flt_right' style='${style_none}'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item' data-flinkto='courseslistlevel' data-module_id='${json.module_id}' data-cid='${json.course_id}''>Edit</a></li><li><a data-bs-toggle='modal' data-bs-target='#mAlert' data-name='Introduction' data-cid='${json.course_id}''  data-module_id='${json.module_id}' class='dropdown-item' onClick='delete_module_confirm(this)'>Delete</a></li></ul></li>`;
              //template += `<li class='progress_btn disp_in_block flt_right' style=''><p class='"+status_class+"'>"+status_text+"</p></li>`;
              template += `<li class='attach_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/attach-icon.png' class='attach_icon' onclick='show_attachment_popup(this)' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li>`;
              template += `<li class='message_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/message-icon.png' class='message_icon' onclick='show_message_popup(this)' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li>`;
              template += `<li class='user_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/user-icon.png' class='user_icon' onclick='show_assignee_popup(this)' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li></li>`;
              template += `<li class='frame_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/frame-icon.png' class='frame_icon' onclick='show_tag_popup(this)' data-getresult='tag' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li>`;
              template += `<li class='plus_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub(this);'></li></ul></div>`;

           $(this).before(template);*/
      })
      .catch(function (error) {
        console.log("Requestfailed", error);
      });
    /*var x =e.parentElement.parentElement.childNodes;
    if(x[0].nodeName == "#text"){
        var inp_val = x[5].childNodes[1].innerHTML;
    }else{
        var inp_val = x[2].childNodes[1].innerHTML;
    }
    if(inp_val != ''){
        var classList = e.parentElement.parentElement.parentElement.className.split(/\s+/);
        if(classList[2] == 'main_mod'){
            if(e.parentElement.parentElement.parentElement.parentElement.childNodes[e.parentElement.parentElement.parentElement.parentElement.childNodes.length-1].classList !== undefined && e.parentElement.parentElement.parentElement.parentElement.childNodes[e.parentElement.parentElement.parentElement.parentElement.childNodes.length-1].classList[2] == 'main_mod_empty'){
              var main_mod_level = e.parentElement.parentElement.parentElement.classList[1];
                var index = classList[1].lastIndexOf("_");
                var result = Number(classList[1].substr(index+1));
                if(e.parentElement.parentElement.childNodes[0].nodeName == '#text'){
                    var result = Number(e.parentElement.parentElement.childNodes.length)- Number(20);
                }else{
                    var result = Number(e.parentElement.parentElement.childNodes.length)- Number(9);
                }
                newHTML = "<div class='module sub_module_"+result+" sub_"+result+" "+main_mod_level+"' style='width:95%;margin-right: -2px;'>";
                newHTML += "<ul class='sub_module'>";
                newHTML += "<li class='course_img_icon disp_in_block flt_left'><img src='../assets/images/course-icon.png' class='course_icon'></li>";
                newHTML += "<li class='expand_img_icon disp_in_block flt_left'><img src='../assets/images/arrow_up_icon.png' class='expand_icon' onclick='toggle_collapse_expand(this);'></li>";
                newHTML += "<li class='module_input disp_in_block flt_left'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='Level "+result+"'onblur='totext(this);' style='display: none;' maxlength='256'><p onclick='toinput(this);' id='sub_"+result+"_"+main_mod_level+"' data-prev_val='"+result+". Chapter'>"+result+". Chapter</p></li>";
                newHTML += "<li class='dots_img_icon disp_in_block flt_right'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item'>Edit</a></li><li><a data-bs-toggle='modal' data-bs-target='#mAlert' class='dropdown-item' onClick='delete_module_confirm(this)'>Delete</a></li></ul></li>";
                newHTML += "<li class='progress_btn disp_in_block flt_right'><p class='status_new'>New</p></li>";
                newHTML += "<li class='attach_img_icon disp_in_block flt_right'><img src='../assets/images/attach-icon.png' class='attach_icon'></li>";
                newHTML += "<li class='message_img_icon disp_in_block flt_right'><img src='../assets/images/message-icon.png' class='message_icon'></li>";
                newHTML += "<li class='user_img_icon disp_in_block flt_right'><img src='../assets/images/user-icon.png' class='user_icon'></li>";
                newHTML += "<li class='plus_img_icon disp_in_block flt_right'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub_sub(this);'></li>";
                newHTML += "<li class='frame_img_icon disp_in_block flt_right'><img src='../assets/images/frame-icon.png' class='frame_icon' onclick='show_tag_popup(this)' data-getresult='tag'></li>";
                newHTML += "</ul>";
                newHTML += "</div>";
                e.parentElement.parentElement.insertAdjacentHTML('beforeend', newHTML);

                var class_module_main_level = main_mod_level;
                var class_module_sub_level = "sub_"+result;
                var input_val = "Level "+result;
                toastr.success("Chapter Added.");
                return;
            }
            if((e.parentElement.parentElement.parentElement.childNodes[0].nodeName == '#text' && e.parentElement.parentElement.parentElement.childNodes.length == 3) ||  (e.parentElement.parentElement.parentElement.childNodes[0].nodeName != '#text' && e.parentElement.parentElement.parentElement.childNodes.length == 1)){
                var index = classList[1].lastIndexOf("_");
                var result = Number(classList[1].substr(index+1));
                var result = Number(e.parentElement.parentElement.parentElement.parentElement.childNodes.length) + Number(1);
                newHTML = "<div class='module module_"+result+" main_mod_empty' style='opacity:0.5;'>";
                newHTML += "<ul class='main_module module_opacity'>";
                newHTML += "<li class='course_img_icon disp_in_block flt_left'><img src='../assets/images/course-icon.png' class='course_icon'></li>";
                newHTML += "<li class='expand_img_icon disp_in_block flt_left'><img src='../assets/images/arrow_up_icon.png' class='expand_icon' onclick='toggle_collapse_expand(this);'></li>";
                newHTML += "<li class='module_input disp_in_block flt_left'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value=''onblur='totext(this);' style='display: none;' maxlength='256'><p onclick='toinput(this);' id='module_module_"+result+"' data-prev_val='Add Module Name'>Add Module Name</p></li>";
                newHTML += "<li class='dots_img_icon disp_in_block flt_right'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item'>Edit</a></li><li><a data-bs-toggle='modal' data-bs-target='#mAlert' data-name='' data-cid=''  data-module_id='' class='dropdown-item' onClick='delete_module_confirm(this)'>Delete</a></li></ul></li>";
                newHTML += "<li class='progress_btn disp_in_block flt_right'><p class='status_new'>New</p></li>";
                newHTML += "<li class='attach_img_icon disp_in_block flt_right'><img src='../assets/images/attach-icon.png' class='attach_icon'></li>";
                newHTML += "<li class='message_img_icon disp_in_block flt_right'><img src='../assets/images/message-icon.png' class='message_icon'></li>";
                newHTML += "<li class='user_img_icon disp_in_block flt_right'><img src='../assets/images/user-icon.png' class='user_icon'></li></li>";
                newHTML += "<li class='plus_img_icon disp_in_block flt_right'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub(this);'></li>";
                newHTML += "<li class='frame_img_icon disp_in_block flt_right'><img src='../assets/images/frame-icon.png' class='frame_icon' onclick='show_tag_popup(this)' data-getresult='tag'></li>";
                newHTML += "</ul>";
                newHTML += "</div>";
                e.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML('beforeend', newHTML);
            }
        }
    }*/
}

function get_submodule_level_val_sub(class_module_main_level, class_module_sub_level, parent_id_val, element){
  var data_course_module = "";
  if(class_module_sub_level.indexOf('.') !== -1){
      //var level_number = (class_module_sub_level.split("_module")[0]).split(".")[class_module_sub_level.split(".").length-1];
      var level_number = element.children[1].children.length+1;
      data_course_module = {
        module_name: String("Special Population 1"),
        level: parseInt(level_number), 
        course_id:String(document.getElementById("course_id").value),
        parent_id: parent_id_val
      }

  }else{
    //console.log(element.children[1].children.length);
    var level_number = element.children[1].children.length+1;
      //var level_number = class_module_sub_level.split('_')[1];
      data_course_module = {
        module_name: String("Special Population 1"),
        level: parseInt(level_number), 
        course_id:String(document.getElementById("course_id").value),
        parent_id: parent_id_val
      }
  }
  return data_course_module;
}
function add_sub_sub(e, section){
  //console.log(e);
  //console.log(section);

  var classList = e.className.split(/\s+/);
  if(classList[2] == 'main_mod'){

  }else{
    var index = classList[1].lastIndexOf("_");
    //var result = Number(classList[1].substr(index+1));
    var url = API_CONTENT_URL + '/course_module/';
    var method = "POST";
    var class_module_main_level = e.classList[3];
    var class_module_sub_level = e.classList[2];
    var parent_id = e.getAttribute("data-module_id");
    get_submodule_level_values = get_submodule_level_val_sub(class_module_main_level, class_module_sub_level, parent_id, e);
    //console.log(get_submodule_level_values);
  }
  /*var get_submodule_level_values = {
    module_name: String("Introduction new"),
    level: parseInt(result), 
    course_id:String(document.getElementById("course_id").value),
    parent_id:null
  };*/
  fetch(url, {
        method: method,
        body: JSON.stringify(get_submodule_level_values),
        headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      })
      .then((response) => response.json())
      .then((json) => {
        $('#course_id').trigger('click');
        //location.reload();
      })
      .catch(function (error) {
        console.log("Requestfailed", error);
      });

  /*var x =e.parentElement.parentElement.childNodes;
  if(x.length == 17){
    var inp_val = x[5].childNodes[0].value;
  }
  if(x.length == 10){
    var inp_val = x[2].childNodes[0].value;
  }
  if(inp_val != ''){
    var main_mod_level = e.parentElement.parentElement.parentElement.classList[3];
    var classList = e.parentElement.parentElement.parentElement.className.split(/\s+/);
    var index = classList[1].lastIndexOf("_");
    var res_1 = Number(classList[1].substr(index+1));
    var result = classList[1].substr(index+1)+"."+ Number(e.parentElement.parentElement.childNodes.length - 9);
    var num = String(result).match(/\./g).length;
    if(num === 1){
      var result_text = Number(e.parentElement.parentElement.childNodes.length - 9)+". Lesson";
      var result_textMsg = "Lesson";
    }else if(num === 2){
      var result_text = Number(e.parentElement.parentElement.childNodes.length - 9)+". Topic";
      var result_textMsg = "Topic";
    }else if(num === 3){
      var result_text = Number(e.parentElement.parentElement.childNodes.length - 9)+". Sub Topic";
      var result_textMsg = "Sub Topic";
    }else{
      var result_text = "Level "+result;
      var result_textMsg = "Level";
    }
    newHTML = "<div class='module sub_module_"+result+" sub_"+result+" "+main_mod_level+"' style='width:95%;margin-right: -2px;'>";
    newHTML += "<ul class='sub_module'>";
    newHTML += "<li class='course_img_icon disp_in_block flt_left'><img src='../assets/images/course-icon.png' class='course_icon'></li>";
    newHTML += "<li class='expand_img_icon disp_in_block flt_left'><img src='../assets/images/arrow_up_icon.png' class='expand_icon' onclick='toggle_collapse_expand(this);'></li>";
    newHTML += "<li class='module_input disp_in_block flt_left'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='Level "+result+"'onblur='totext(this);' style='display: none;' maxlength='256'><p onclick='toinput(this);' id='sub_"+result+"_"+main_mod_level+"' data-prev_val='"+result_text+"'>"+result_text+"</p></li>";
    newHTML += "<li class='dots_img_icon disp_in_block flt_right'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item'>Edit</a></li><li><a data-bs-toggle='modal' data-bs-target='#mAlert' class='dropdown-item' onClick='delete_module_confirm(this)'>Delete</a></li></ul></li>";
    newHTML += "<li class='progress_btn disp_in_block flt_right'><p class='status_new'>New</p></li>";
    newHTML += "<li class='attach_img_icon disp_in_block flt_right'><img src='../assets/images/attach-icon.png' class='attach_icon'></li>";
    newHTML += "<li class='message_img_icon disp_in_block flt_right'><img src='../assets/images/message-icon.png' class='message_icon'></li>";
    newHTML += "<li class='user_img_icon disp_in_block flt_right'><img src='../assets/images/user-icon.png' class='user_icon'></li>";
    newHTML += "<li class='plus_img_icon disp_in_block flt_right'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub_sub(this);'></li>";
    newHTML += "<li class='frame_img_icon disp_in_block flt_right'><img src='../assets/images/frame-icon.png' class='frame_icon' onclick='show_tag_popup(this)' data-getresult='tag'></li>";
    newHTML += "</ul>";
    newHTML += "</div>";
    e.parentElement.parentElement.insertAdjacentHTML('beforeend', newHTML);
    var class_module_main_level = main_mod_level;
    var class_module_sub_level = "sub_"+result;
    var input_val = "Level "+result;
    toastr.success(result_textMsg+" Added.");
   }*/
}

/******* Expand and collapse main and sub module Levels Starts **************/
function toggle_collapse_expand(e){
    var childrendivs = [];
    var children = e.parentElement.parentElement.nextElementSibling.children;
    var action = e.innerHTML;
    for(var i = 0; i < children.length; i++){
        if (children[i].tagName == "LI") {
          if(children[i].classList.contains('disp_none')){
              e.src="../assets/images/arrow_up_icon.png";
              children[i].classList.add('disp_block');
              children[i].classList.remove('disp_none');
              childrendivs.push(children[i]);
          }else{
              e.src="../assets/images/arrow_down_icon.png";
              children[i].classList.add('disp_none');
              children[i].classList.remove('disp_block');
              childrendivs.push(children[i]);
          }
        }
    }
}
function toggle_collapse_expand_preview(e){
    var childrendivs = [];
    var children = e.parentElement.parentElement.parentElement.parentElement.children;
    var action = e.innerHTML;
    for(var i = 0; i < children.length; i++){
        if (children[i].tagName == "DIV") {
          if(children[i].classList.contains('disp_none')){
              e.src="../assets/images/arrow_up_icon.png";
              children[i].classList.add('disp_block');
              children[i].classList.remove('disp_none');
              childrendivs.push(children[i]);
          }else{
              e.src="../assets/images/arrow_down_icon.png";
              children[i].classList.add('disp_none');
              children[i].classList.remove('disp_block');
              childrendivs.push(children[i]);
          }
        }
    }
}
function show_tag_popup(e){
  //var offsets = e.getBoundingClientRect();
  //var offset_box = document.getElementById("course_box").getBoundingClientRect();
  //var top = offsets.top + Math.max( $("html").scrollTop(), $("body").scrollTop() ) - 70;
  //var right = offset_box.left;
  const container = document.getElementById("popup_course_icon");
  const modal = new bootstrap.Modal(container, { backdrop: true, keyboard: true });
  //document.getElementById("content-courseModule").style.transform = "translate(0px, "+top+"px)";
  var url = `${SITE_URL_PROTOCOL}/assets/pages/courses/course_tag.html?t=` + Math.floor(Date.now() / 1000);
  $('.modal-content').load(url,function(result){
    $("#content-courseModule").attr("style", "height:200px;top:250px;");
    $(".modal-lg").attr("style","max-width: 50%;");
    document.getElementById("course_param").setAttribute("data-module_id", e.dataset.module_id);
    document.getElementById("course_param").setAttribute("data-uni_id", e.dataset.uni_id);
    document.getElementById("course_param").setAttribute("data-cid", e.dataset.cid);
    if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "undefined" && e.parentElement.parentElement.parentElement.getAttribute("data-is_case_delete") === "false"){
      document.getElementById("course_param").setAttribute("data-show_input", "false");
      document.getElementById("course_param").setAttribute("data-case_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id"));
    }else if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "undefined"){
      document.getElementById("course_param").setAttribute("data-show_input", "false-chapter");
      document.getElementById("course_param").setAttribute("data-chapter_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id"));
      document.getElementById("course_param").setAttribute("data-chapter_topic_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_topic_id"));
    }else{
      document.getElementById("course_param").setAttribute("data-show_input", "true");
    }
    modal.show();
  });
}

function show_attachment_popup(e){
  //var right = offset_box.left;
  const container = document.getElementById("popup_course_icon");
  const modal = new bootstrap.Modal(container, { backdrop: true, keyboard: true });
  var url = `${SITE_URL_PROTOCOL}/assets/pages/courses/attachment_popup.html?t=` + Math.floor(Date.now() / 1000);
  $('.modal-content').load(url,function(result){
    $("#content-courseModule").attr("style", "height:680px;top:25px;");
    $(".modal-lg").attr("style","max-width: 50%;");
    document.getElementById("course_param").setAttribute("data-module_id", e.dataset.module_id);
    document.getElementById("course_param").setAttribute("data-uni_id", e.dataset.uni_id);
    document.getElementById("course_param").setAttribute("data-cid", e.dataset.cid);
    document.getElementById("course_param").setAttribute("data-action_made", "false");
    if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "undefined" && e.parentElement.parentElement.parentElement.getAttribute("data-is_case_delete") === "false"){
      document.getElementById("course_param").setAttribute("data-show_input", "false");
      document.getElementById("course_param").setAttribute("data-case_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id"));
    }else if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "undefined"){
      document.getElementById("course_param").setAttribute("data-show_input", "false-chapter");
      document.getElementById("course_param").setAttribute("data-chapter_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id"));
      document.getElementById("course_param").setAttribute("data-chapter_topic_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_topic_id"));
    }else{
      document.getElementById("course_param").setAttribute("data-show_input", "true");
    }
    modal.toggle();
  });
}
function show_message_popup(e){
  //var right = offset_box.left;
  const container = document.getElementById("popup_course_icon");
  const modal = new bootstrap.Modal(container, { backdrop: true, keyboard: true });
  var url = `${SITE_URL_PROTOCOL}/assets/pages/courses/message_popup.html?t=` + Math.floor(Date.now() / 1000);
  $('.modal-content').load(url,function(result){
    $("#content-courseModule").attr("style", "height:500px;top:100px;");
    $(".modal-lg").attr("style","max-width: 50%;");
    document.getElementById("course_param").setAttribute("data-module_id", e.dataset.module_id);
    document.getElementById("course_param").setAttribute("data-uni_id", e.dataset.uni_id);
    document.getElementById("course_param").setAttribute("data-cid", e.dataset.cid);
    document.getElementById("course_param").setAttribute("data-action_made", "false");
    if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "undefined" && e.parentElement.parentElement.parentElement.getAttribute("data-is_case_delete") === "false"){
      document.getElementById("course_param").setAttribute("data-show_input", "false");
      document.getElementById("course_param").setAttribute("data-case_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id"));
    }else if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "undefined"){
      document.getElementById("course_param").setAttribute("data-show_input", "false-chapter");
      document.getElementById("course_param").setAttribute("data-chapter_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id"));
      document.getElementById("course_param").setAttribute("data-chapter_topic_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_topic_id"));
    }else{
      document.getElementById("course_param").setAttribute("data-show_input", "true");
    }
    modal.toggle();
  });
}
function show_assignee_popup(e){
  //var right = offset_box.left;
  const container = document.getElementById("popup_course_icon");
  const modal = new bootstrap.Modal(container, { backdrop: true, keyboard: true });
  var url = `${SITE_URL_PROTOCOL}/assets/pages/courses/assignee_popup.html?t=` + Math.floor(Date.now() / 1000);
  $('.modal-content').load(url,function(result){
    $("#content-courseModule").attr("style", "height:500px;top:100px;");
    $(".modal-lg").attr("style","max-width: 50%;");
    document.getElementById("course_param").setAttribute("data-module_id", e.dataset.module_id);
    document.getElementById("course_param").setAttribute("data-uni_id", e.dataset.uni_id);
    document.getElementById("course_param").setAttribute("data-cid", e.dataset.cid);
    document.getElementById("course_param").setAttribute("data-action_made", "false");
    if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id") !== "undefined" && e.parentElement.parentElement.parentElement.getAttribute("data-is_case_delete") === "false"){
      document.getElementById("course_param").setAttribute("data-show_input", "false");
      document.getElementById("course_param").setAttribute("data-case_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_case_id"));
    }else if(e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "null" && e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id") !== "undefined"){
      document.getElementById("course_param").setAttribute("data-show_input", "false-chapter");
      document.getElementById("course_param").setAttribute("data-chapter_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_id"));
      document.getElementById("course_param").setAttribute("data-chapter_topic_id", e.parentElement.parentElement.parentElement.getAttribute("data-unique_chapter_topic_id"));
    }else{
      document.getElementById("course_param").setAttribute("data-show_input", "true");
    }
    modal.toggle();
  });
}

   function updateCountsSelectedModule(bulkAssign){
    console.log('action made');
    var module_id = document.getElementById("course_param").getAttribute("data-module_id");
    var course_id = document.getElementById("course_param").getAttribute("data-c_id");
    var uni_id = document.getElementById("course_param").getAttribute("data-uni_id");
    var module_idArray = [];
    module_idArray.push({module_id: module_id, uniq_id: uni_id});
    if(bulkAssign == true){
      var module_element = document.querySelector('[data-unique_id="'+uni_id+'"]');
      var sub_module_elements = module_element.querySelectorAll('li');
      sub_module_elements.forEach(function (item){
        if((item.getAttribute("data-unique_chapter_id") == "undefined" || item.getAttribute("data-unique_chapter_id") == "null" || item.getAttribute("data-unique_chapter_id") == "")
          && ((item.getAttribute("data-unique_case_id") == "undefined" || item.getAttribute("data-unique_case_id") == "null" || item.getAttribute("data-unique_case_id") == "") || (
            (item.getAttribute("data-unique_case_id") != "undefined" && item.getAttribute("data-unique_case_id") != "null" && item.getAttribute("data-unique_case_id") != "" && item.getAttribute("data-is_case_delete") == "true")))) {
          module_idArray.push({module_id: item.getAttribute('data-module_id'), uniq_id: item.getAttribute('data-unique_id')});
        }
      });
    }
      $.each(module_idArray,function(index,value){
        $.ajax({
          url: API_CONTENT_URL + '/course/module/count/'+value.module_id,
          type: 'get',
          dataType: 'json',
          headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
          success: function (response) {
            var module_element = document.querySelector('[data-unique_id="'+value.uniq_id+'"]');
            if(module_element.firstElementChild.querySelector(".user_img_icon").querySelector(".icon_counts")){
              module_element.firstElementChild.querySelector(".user_img_icon").querySelector(".icon_counts").remove();
            }
            if(module_element.firstElementChild.querySelector(".attach_img_icon").querySelector(".icon_counts")){
              module_element.firstElementChild.querySelector(".attach_img_icon").querySelector(".icon_counts").remove();
            }
            if(module_element.firstElementChild.querySelector(".message_img_icon").querySelector(".icon_counts")){
              module_element.firstElementChild.querySelector(".message_img_icon").querySelector(".icon_counts").remove();
            }

            if(response.assign_count > 0){
              $(module_element.firstElementChild.querySelector(".user_img_icon")).append("<span class='icon_counts'>"+response.assign_count+"</span>");
            }
            if(response.attachment_count > 0){
              $(module_element.firstElementChild.querySelector(".attach_img_icon")).append("<span class='icon_counts'>"+response.attachment_count+"</span>");
            }
            if(response.comment_count > 0){
              $(module_element.firstElementChild.querySelector(".message_img_icon")).append("<span class='icon_counts'>"+response.comment_count+"</span>");
            }

          },
          error: function ( error) {
            if (error.status === 401) {
              alert("Session Expired, Please login again.");
              logoutSession();
            }
            console.log(error);
          }
        });
      });
  }
$(document).ready(function(){
  var course_len = $("#course_box > li").length;
  //console.log(course_len);
  if(course_len == 0){
    //$("#clicked_event").attr("data-click_id", id);
    //$("#clicked_event").attr("data-click_level", mod_level);
    $("#course_box").removeClass( "col-md-12" ).addClass( "col-md-8" );
    $("#course_box").removeClass( "col-lg-12" ).addClass( "col-lg-8" );
    $(".elipsis_img_icon").attr("style", "display:block;");
    $(".dots_img_icon").attr("style", "display:none;");
    $(".attach_img_icon").attr("style", "display:none;");
    $(".message_img_icon").attr("style", "display:none;");
    $(".user_img_icon").attr("style", "display:none;");
    $(".frame_img_icon").attr("style", "display:none;");
    $(".plus_img_icon").attr("style", "display:none;");
    $("#right_module_menu").show();
  }
});
function moduleMobilePreview(cid){

        const container = document.getElementById("popup_course_icon");
        const modal = new bootstrap.Modal(container, { backdrop: true, keyboard: true });
        var url = `${SITE_URL_PROTOCOL}/assets/pages/course/course_preview_desktop.html?t=` + Math.floor(Date.now() / 1000);
        $('.modal-content').load(url,function(result){
          window.sharedPreviewName = "mobile";
          document.getElementById("course_param").setAttribute("data-cid", cid);
          $(".modal-lg").attr("style","max-width: 25%;");
          $(".dpc-closeh").attr("style","width: 94.2%;border-radius: 15px !important;background-color: unset;");
          $("#popup_course_icon").attr("style","top: 20px;");
          $(".desktop_prev_container audio").attr("style","width: 100%;");
          $("#content-courseModule").attr("style","height: 650px;overflow: hidden;");
          modal.toggle();
        });
  /*$("#mobile_preview").addClass("overlay_target");
  var course_id = $("#dp_course_id").val();
    var url = API_CONTENT_URL + `/course_module_detail/?course_id=`+cid;
    fetch(url, {
      method: "GET",
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token}
    })
    .then((response) => response.json())
    .then((data) => {
      var course_data_html = `<div class="course_data">
                                <div class="row">
                                  <div class="col-12 title-head">
                                  <h4 class="p-3" style="margin-bottom: -20px;">${data.course_name}</h4>
                                  </div>
                                  <div class="col-12 title-head">
                                  <p class="p-3" style="margin-bottom: 0rem !important;">${data.description}</p>
                                  </div>
                                </div>
                                <div class="row">
                                </div>
                              </div>`;
      var newDIVs = $("<div class='course' id='course_box' style='background-color: rgb(231 231 231);'></div>");
      get_list_preview( data.module_detail, newDIVs, 1, "mobile");
      var outerHtml = newDIVs.prop('outerHTML');
      document.getElementById("mp_courseData").innerHTML = course_data_html+outerHtml;
    });*/
}
function moduleDesktopPreview(cid){

        const container = document.getElementById("popup_course_icon");
        const modal = new bootstrap.Modal(container, { backdrop: true, keyboard: true });
        var url = `${SITE_URL_PROTOCOL}/assets/pages/course/course_preview_desktop_new.html?t=` + Math.floor(Date.now() / 1000);
        $('.modal-content').load(url,function(result){
          document.getElementById("course_param").setAttribute("data-cid", cid);
          $(".modal-lg").attr("style","max-width: 88%;");
          //$(".dpc-closeh").attr("style","width: 94.2%;border-radius: 15px !important;background-color: unset;");
          $("#popup_course_icon").attr("style","top: 20px;");
          window.sharedPreviewName = "desktop";
          $("#content-courseModule").attr("style","height: 650px;overflow: hidden;");
          modal.toggle();
        });
  /*$("#desktop_preview").addClass("overlay_target");
  var course_id = $("#dp_course_id").val();
  console.log(course_id);
    var url = API_CONTENT_URL + `/course_module_detail/?course_id=`+cid;
    fetch(url, {
      method: "GET",
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token}
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var course_data_html = `<div class="course_data">
                                <div class="row">
                                  <div class="col-12 title-head">
                                  <h4 class="p-3" style="margin-bottom: -20px;">${data.course_name}</h4>
                                  </div>
                                  <div class="col-12 title-head">
                                  <p class="p-3" style="margin-bottom: 0rem !important;">${data.description}</p>
                                  </div>
                                </div>
                                <div class="row">
                                </div>
                              </div>`;
      var newDIVs = $("<div class='course' id='course_box' style='background-color: rgb(231 231 231);'></div>");
      get_list_preview( data.module_detail, newDIVs, 1, "desktop");
      var outerHtml = newDIVs.prop('outerHTML');
      document.getElementById("dp_courseData").innerHTML = course_data_html+outerHtml;
    });*/
}
/***************Course Modules Get Json and assign Tree structured format and Design Starts Here*************/
function get_list_preview( a, $parent , level_count_inc, prev_type) {
  var mod_width = "width:93%;";
  if(prev_type == "mobile"){
    mod_width = "width:100%;";
  }
  var levels = '';
  var newDIV = $("<div></div>");
  for (var i = 0; i < a.length; i++) {
      if (a[i]) {
        var num = "";
          var level_count = a[i].module_name.split("/").length - 1;
          if(a[i].parent_id == null){
            var n = a[i].module_name.lastIndexOf('/');
            var input_value = a[i].module_name.substring(n + 1);
            var color = "color:#F36A10;";
            newDIV = $("<div class='module module_"+level_count_inc+" main_mod draggable' id='"+a[i].level+"' draggable='true' style='opacity:1;'></div>");
            newUl = $("<ul class='main_module module_opacity' style='opacity:1;padding-bottom: 0px;border-style: none;'></ul>");
            var module_data_html  = get_module_details_preview(a[i]);
            newUl.append(module_data_html);
          }else{
            var class_name = $parent.parent().prop('className').split(" ");
            var first_five_char_class = class_name[1].substring(0,5);
            if(first_five_char_class === "modul"){
              var levels = a[i].level;
              var color = "color:red;";
            }else{
              var levels = $parent.parent().attr('id')+"."+a[i].level;
              num = String(levels).match(/\./g).length;
              if(num == ""){
                var color = "color:#20204F;";
              }else if(num === 1){
                var color = "color:#448744;";
              }else if(num === 2){
                var color = "color:#7e2ebb;";
              }else if(num === 3){
                var color = "color:#8080bd;";
              }else if (num === 4){
                var color = "color:#8b364d;";
              }else if (num > 4){
                var color = "color:#998129;";
              }
            }
            var n = a[i].module_name.lastIndexOf('/');
            var input_value = a[i].module_name.substring(n + 1);
            //console.log(num+"= "+input_value)
            var display_prop = "";
            if($parent.parent().attr("uChapterId")){
              display_prop = "disp_none";
            }else{
              display_prop = "disp_block";
            }
            if(a[i].chapter_id && ($parent.parent().attr("uChapterId") == "null" || $parent.parent().attr("uChapterId") == null || $parent.parent().attr("uChapterId") == "")){
              newDIV = $("<div class='module sub_module_"+levels+" sub_"+levels+" module_"+(level_count_inc - 1)+" "+display_prop+"' id='"+levels+"' uChapterId='"+a[i].chapter_id+"' style='"+mod_width+"'>");
            }else{
              newDIV = $("<div class='module sub_module_"+levels+" sub_"+levels+" module_"+(level_count_inc - 1)+" "+display_prop+"' id='"+levels+"' uChapterId='' style='"+mod_width+"'>");
            }
            
            newUl = $("<ul class='sub_module' style='padding-bottom: 0px;border-style: none;'></ul>");
            const [module_content, module_attachments] = get_module_details_preview(a[i]);
            if(a[i].chapter_id && ($parent.parent().attr("uChapterId") == "null" || $parent.parent().attr("uChapterId") == null || $parent.parent().attr("uChapterId") == "") && a[i].children.length > 0){
              newUl.append("<li style='background-color: white;'><p class='mb-0' style='padding:15px;"+color+"'><b>"+input_value+" :</b><span style='float:right'><img style='width:20px;height:20px;' src='../assets/images/arrow_down_icon.png' class='expand_icon' onclick='toggle_collapse_expand_preview(this);'></span></p>"+module_content+"</li>");
            }else{
              newUl.append("<li style='background-color: white;'><p class='mb-0' style='padding:15px;"+color+"'><b>"+input_value+" :</b></p>"+module_content+"</li>");
            }
            newUl.append(module_attachments);
          }
          if(level_count === 0){  
            newDIV.append(newUl);
            $parent.append(newDIV);

            level_count_inc++;
          }else{
            newDIV.append(newUl);
            $parent.append(newDIV);
          }
          if (a[i].children){
              get_list_preview( a[i].children, newUl, level_count_inc, prev_type);
          }
      }
    $parent.append(newDIV);
  }
}
/***************Course Modules Get Json and assign Tree structured format and Design Ends Here*************/

function get_module_details_preview(module_data){
        var module_content = module_data.content;
        var module_attachments = module_data.attachments;
        var module_content_html = "";
        var module_attachments_html = "";
        if(module_content){
            module_content_html +=`<li class="has-children is-open"><ul class="acnav__list acnav__list--level2 wbg br-10" style="border-left: none;padding-left: 0px;"><li class="has-children">
                                <div class="acnav__label acnav__label--level2" style="border:none;">
                                  <div class="accordionlist">
                                    <div class="row">
                                      <div class="col-md-12 acc-text">

                                        ${module_content.content}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li></ul>`;
        }
        if(module_attachments.length > 0){
          var base_img_url = `${API_CONTENT_URL}`;
            module_attachments.forEach(function (element, index) {
                if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
                  base_img_url = '';
                }
                var file_type = element.attachment_type.split('/')[0];
                if(file_type === 'image'|| file_type === 'application'){
                    module_attachments_html += `<li class="has-children is-open" style="margin-top: 10px;">
                                    <ul class="acnav__list acnav__list--level2 wbg br-10" style="border-left: none;">
                                      <li class="has-children">
                                        <div class="acnav__label acnav__label--level2" style="border:none;">
                                          <div class="accordionlist">
                                            <div class="row">
                                              <div class="col-md-12 acc-text">`;
                    if(element.attachment_type.split('/')[0] === 'image'){
                          module_attachments_html +=`<img class="w-100"src="${base_img_url}${element.attachment}" alt="${element.attachment_name}">`;
                    }else if(element.attachment_type.split('/')[0] === 'video'){

                        //module_attachments_html +=`<video id='video' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>`;
                    }else if(element.attachment_type.split('/')[0] === 'audio'){
                        //module_attachments_html +=`<audio controls><source src="${base_img_url}${element.attachment}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                    }else if(element.attachment_type.split('/')[0] === 'application'){
                      var mathcount = Math.floor(Math.random() * 1000);
                       module_attachments_html +=`<iframe id="${element.id}" src='https://docs.google.com/gview?url=${base_img_url}${element.attachment}&embedded=true&ignore=${mathcount}' width='100%' height='500px' frameborder='1'></iframe><p>If this browser does not support file. Please download the File to view it: <a href="${base_img_url}${element.attachment}" target="_blank">Download File</a>.</p>`;
                    }
                    module_attachments_html +=`</div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>`;
                }
                if(file_type === 'video'|| file_type === 'audio'){
                    module_attachments_html += `<li class="has-children is-open" style="margin-top: 10px;">
                                    <ul class="acnav__list acnav__list--level2 wbg br-10" style="border-left: none;">
                                      <li class="has-children">
                                        <div class="acnav__label acnav__label--level2" style="border:none;">
                                          <div class="accordionlist">
                                            <div class="row">
                                              <div class="col-md-12 acc-text">`;
                    if(element.attachment_type.split('/')[0] === 'video'){
                      module_attachments_html += `<p style="float:left;">${decodeURI(element.attachment_name)}</p><a class="previewView" onclick="showVideo(this, '${base_img_url}${element.attachment}');">View</a>`;
                      //module_attachments_html +=`<video id='video' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>`;
                    }else if(element.attachment_type.split('/')[0] === 'audio'){
                      module_attachments_html += `<p style="float:left;">${decodeURI(element.attachment_name)}</p><a class="previewView" onclick="showAudio(this, '${base_img_url}${element.attachment}');">View</a>`;
                      //module_attachments_html +=`<audio controls><source src="${base_img_url}${element.attachment}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                    }
                    module_attachments_html +=`</div>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </li>`;
                }
          });
        }
        return [module_content_html, module_attachments_html];

}
$(document).ready(function(){
  $("#desktop-preview-close").on("click", function() {
    $("#desktop_preview").removeClass("overlay_target");
  });
  $("#mobile-preview-close").on("click", function() {
    $("#mobile_preview").removeClass("overlay_target");
  });
  $( "#popup_course_icon" ).on('hidden.bs.modal', function(){
    var medias = Array.prototype.slice.apply($("video"));
    console.log(medias);
    medias.forEach(function(media) {
      if(event.target != media) media.pause();
    });
  });
  $( "#mAlertcourseDelete" ).on('hidden.bs.modal', function(){
    $("#course_id").click();
  });
});

/*document.addEventListener('play', function (e) {
    alert(1);
    var medias = Array.prototype.slice.apply(document.querySelectorAll('.player'));
    console.log(medias);
    medias.forEach(function(media) {
      media.addEventListener('play', function(event) {
        medias.forEach(function(media) {
          if(event.target != media) media.pause();
        });
      });
    });
});*/
function showVideo(e, fileUrl){
  console.log('afsf');
  if(e.parentElement.querySelector(".player")){
    e.parentElement.querySelector(".player").remove();
  }
  //$(e.parentElement).append(`<div style="position:relative;"><video class="mt-3" id='video' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${fileUrl}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video><button type="button" class="btn-close" onclick="close_previewView(this)" style="position:absolute;margin-left: -50px;margin-top: 20px;"></button></div>`);
  $(e.parentElement).append(`<video class="player mt-3" id='video' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${fileUrl}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>`);
}
function close_previewView(e){
  e.parentElement.parentElement.parentElement.querySelector(".previewView").classList.remove("disable-click");
  e.parentElement.remove();
}
function showAudio(e, fileUrl){
  if(e.parentElement.querySelector(".player")){
    e.parentElement.querySelector(".player").remove();
  }
  if(sharedPreviewName == "mobile"){
    $(e.parentElement).append(`<span class="player" style="width:100%; float:left;"><audio style="margin-top:10px;width:100%;" controls><source src="${fileUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio></span>`);
  }else{
    $(e.parentElement).append(`<span class="player" style="width:100%; float:left;"><audio controls><source src="${fileUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio></span>`);
  }
  //$(e.parentElement).append(`<div style="position:relative;"><audio controls><source src="${fileUrl}" type="audio/mpeg">Your browser does not support the audio element.</audio><button type="button" class="btn-close" onclick="close_previewView(this)" style="position:absolute;margin-left: -50px;margin-top: 20px;"></button></div>`);
  
}
function close_previewView(e){
  e.parentElement.parentElement.parentElement.querySelector(".previewView").classList.remove("disable-click");
  e.parentElement.remove();
}
function delete_module_confirm(e){

  const container = document.getElementById("mAlertcourseDelete");
  const modal = new bootstrap.Modal(container, { backdrop: true, keyboard: true });
  var url = `${SITE_URL_PROTOCOL}/assets/pages/courses/delete.html?t=` + Math.floor(Date.now() / 1000);
  $('.delete_courseModule').load(url,function(result){
    //$("#content-courseModule").attr("style", "height: 380px;top: 135px;width: 500px;border-radius: 8px !important;");
    //$(".modal-lg").attr("style","max-width: 30%;");
    var element = e;
    $("#mAlertName").text("Are you sure you want to delete module '"+e.dataset.name+"'?");
    var module_name = e.dataset.name;
    var classList = e.parentElement.parentElement.parentElement.parentElement.parentElement.className.split(/\s+/);
    var num = "";
    if(classList[2] == 'main_mod'){
      num = 0;
    }else{
      var index = classList[1].lastIndexOf("_");
      var res_1 = Number(classList[1].substr(index+1));
      var result = classList[1].substr(index+1)+"."+ Number(e.parentElement.parentElement.parentElement.parentElement.childNodes.length - 8);
      num = String(result).match(/\./g).length;
    }
    if(num === 0){
      var result_textMsg = "Module:";
    }else if(num === 1){
      var result_textMsg = "Chapter:";
    }else if(num === 2){
      var result_textMsg = "Lesson:";
    }else if(num === 3){
      var result_textMsg = "Topic:";
    }else if (num === 4){
      var result_textMsg = "Sub Topic:";
    }else if (num > 4){
      var result_textMsg = "Level:";
    }
    
    var toastr_message = result_textMsg+" "+module_name+" Deleted successfully.";
    var module_id = e.dataset.module_id;
    var module_name = e.dataset.name;
    var case_id = e.dataset.case_id;
    $("#mAlertDeleteCM").attr("data-module_id", module_id);
    modal.toggle();
  });
  /*var element = e;
  $("#mAlertName").text(e.dataset.name);
  var module_name = e.dataset.name;
  var classList = e.parentElement.parentElement.parentElement.parentElement.parentElement.className.split(/\s+/);
  var num = "";
  if(classList[2] == 'main_mod'){
    num = 0;
  }else{
    var index = classList[1].lastIndexOf("_");
    var res_1 = Number(classList[1].substr(index+1));
    var result = classList[1].substr(index+1)+"."+ Number(e.parentElement.parentElement.parentElement.parentElement.childNodes.length - 8);
    num = String(result).match(/\./g).length;
  }
  if(num === 0){
    var result_textMsg = "Module:";
  }else if(num === 1){
    var result_textMsg = "Chapter:";
  }else if(num === 2){
    var result_textMsg = "Lesson:";
  }else if(num === 3){
    var result_textMsg = "Topic:";
  }else if (num === 4){
    var result_textMsg = "Sub Topic:";
  }else if (num > 4){
    var result_textMsg = "Level:";
  }
  
  var toastr_message = result_textMsg+" "+module_name+" Deleted successfully.";
  var module_id = e.dataset.module_id;
  var module_name = e.dataset.name;
  var case_id = e.dataset.case_id;
  loadAlertModal_delete_course(toastr_message, module_id, module_name, case_id, num);*/
}

function loadAlertModal_delete_course(toastr_message, module_id, module_name, case_id, level_num){
  $('#mAlert').on('shown.bs.modal', function (event) {
    $("#mAlertCancelCM").focus();
    $("#mAlertDeleteCM").click(function(e){
        var url_api = API_CONTENT_URL + '/course_module/'+module_id+'/';
        var method = "DELETE";
        $.ajax({
          url: url_api,
          type: method,
          dataType: 'json',
          headers: {
            "Authorization": "Bearer " + getUserInfo().access_token,
            "Content-Type": "application/json"
          },
          success:function(response){
            $("#mAlertCancelCM").click();
            toastr.success("Deleted Successfully");
            $("#course_id").trigger("click");
            //location.reload();
          },
          error: function(error) {
            if (error.status === 401) {
              alert("Session Expired, Please login again.");
              logoutSession();
            }
            toastr.error("Response Error: " + error.message);
            console.log(error);
          }
        });
    });
    //mAlertCancelCM
    $(document).on('click', '#mAlertCancelCM', function() {
      $(document).off('click', '#mAlertCancelCM');
      $(document).off('click', '#mAlertDeleteCM');
    });
    
  });
  
  //hidden.bs.modal 
  $('#mAlert').on('hidden.bs.modal', function (event) {
    $(document).off('click', '#mAlertCancelCM');
    $(document).off('click', '#mAlertDeleteCM');
    var modal = $(this);
    modal.find('.modal-content input').val(null);
    modal.find('.modal-content #mAlertName').html("Loading...");
  });
}
//To Get all values for Delete Case Study(modules inside cases)
function delete_module_confirm_cases(e){
  var element = e;
  $("#mAlertName").text("Are you sure you want to delete case '"+e.dataset.name+"'?");
  var module_name = e.dataset.name;
  var classList = e.parentElement.parentElement.parentElement.parentElement.parentElement.className.split(/\s+/);
  var num = "";
  if(classList[2] == 'main_mod'){
    num = 0;
  }else{
    var index = classList[1].lastIndexOf("_");
    var res_1 = Number(classList[1].substr(index+1));
    var result = classList[1].substr(index+1)+"."+ Number(e.parentElement.parentElement.parentElement.parentElement.childNodes.length - 8);
    num = String(result).match(/\./g).length;
  }
  if(num === 0){
    var result_textMsg = "Module:";
  }else if(num === 1){
    var result_textMsg = "Chapter:";
  }else if(num === 2){
    var result_textMsg = "Lesson:";
  }else if(num === 3){
    var result_textMsg = "Topic:";
  }else if (num === 4){
    var result_textMsg = "Sub Topic:";
  }else if (num > 4){
    var result_textMsg = "Level:";
  }
  var toastr_message = result_textMsg+" "+module_name+" Deleted successfully.";
  var module_id = e.dataset.module_id;
  var module_name = e.dataset.name;
  var case_id = e.dataset.case_id;
  loadAlertModal_delete_case(toastr_message, module_id, module_name, case_id, num);
}
//To Delete Case Study(modules inside cases) removing modules inside case By case_id as null
function loadAlertModal_delete_case(toastr_message, module_id, module_name, case_id, level_num){
  $('#mAlertcourseSubDelete').on('shown.bs.modal', function (event) {
    $("#mAlertCancelCM").focus();
    $("#mAlertDeleteCM").click(function(e){
        var url = API_CONTENT_URL + '/course_module/'+module_id+'/';
        var method = "PUT";

        var data = {
          module_name: String(module_name),
          level: parseInt(level_num), 
          course_id:String(document.getElementById("course_id").value),
          case_id:null
        };
        fetch(url, {
          method: method,
          body: JSON.stringify(data),
          headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
        })
        .then((response) => response.json())
        .then((json) => {
          toastr.success("Case Deleted successfully");
          $("#mAlertCancelCM").click();
            $("#course_id").trigger("click");
            //location.reload();
          //getCoursePage(e);
        })
        .catch(function (error) {
          console.log("Requestfailed", error);
        });
    });
    //mAlertCancelCM
    $(document).on('click', '#mAlertCancelCM', function() {
      $(document).off('click', '#mAlertCancelCM');
      $(document).off('click', '#mAlertDeleteCM');
    });
    
  });
  
  //hidden.bs.modal 
  $('#mAlert').on('hidden.bs.modal', function (event) {
    $(document).off('click', '#mAlertCancelCM');
    $(document).off('click', '#mAlertDeleteCM');
    var modal = $(this);
    modal.find('.modal-content input').val(null);
    modal.find('.modal-content #mAlertName').html("Loading...");
  });
}

//To Get all values for Delete Chapter
function delete_module_confirm_chapters(e){
  var element = e;
  $("#mAlertName").text("Are you sure you want to delete chapter '"+e.dataset.name+"'?");
  var module_name = e.dataset.name;
  var classList = e.parentElement.parentElement.parentElement.parentElement.parentElement.className.split(/\s+/);
  var num = "";
  if(classList[2] == 'main_mod'){
    num = 0;
  }else{
    var index = classList[1].lastIndexOf("_");
    var res_1 = Number(classList[1].substr(index+1));
    var result = classList[1].substr(index+1)+"."+ Number(e.parentElement.parentElement.parentElement.parentElement.childNodes.length - 8);
    num = String(result).match(/\./g).length;
  }
  if(num === 0){
    var result_textMsg = "Module:";
  }else if(num === 1){
    var result_textMsg = "Chapter:";
  }else if(num === 2){
    var result_textMsg = "Lesson:";
  }else if(num === 3){
    var result_textMsg = "Topic:";
  }else if (num === 4){
    var result_textMsg = "Sub Topic:";
  }else if (num > 4){
    var result_textMsg = "Level:";
  }
  var toastr_message = result_textMsg+" "+module_name+" Deleted successfully.";
  var module_id = e.dataset.module_id;
  var module_name = e.dataset.name;
  var case_id = e.dataset.case_id;
  loadAlertModal_delete_chapter(toastr_message, module_id, module_name, case_id, num);
}
//To Delete Chapter
function loadAlertModal_delete_chapter(toastr_message, module_id, module_name, case_id, level_num){
  $('#mAlertcourseSubDelete').on('shown.bs.modal', function (event) {
    $("#mAlertCancelCM").focus();
    $("#mAlertDeleteCM").click(function(e){
          var chapter_data = {
              "case_id": String(case_id),
              "course_id": String(document.getElementById("course_id").value),
              "case_module_id": String(module_id)
          }
          //console.log(chapter_data);
        $.ajax({
          url: API_CONTENT_URL + '/cases/remove/chapter/',
          type: 'POST',
          data: JSON.stringify(chapter_data),
          headers: {
            "Authorization": "Bearer " + getUserInfo().access_token,
            "Content-Type": "application/json"
          },
          success:function(response){
            //console.log(response);
            toastr.success("Chapter Deleted Successfully.");
            $("#mAlertCancelCM").click();
            $("#course_id").trigger("click");
            //location.reload();
          },
          error: function(error) {
            if (error.status === 401) {
              alert("Session Expired, Please login again.");
              logoutSession();
            }
            toastr.error("Response Error: " + error.message);
            console.log(error);
          }
        });
    });
    //mAlertCancelCM
    $(document).on('click', '#mAlertCancelCM', function() {
      $(document).off('click', '#mAlertCancelCM');
      $(document).off('click', '#mAlertDeleteCM');
    });
    
  });
  
  //hidden.bs.modal 
  $('#mAlert').on('hidden.bs.modal', function (event) {
    $(document).off('click', '#mAlertCancelCM');
    $(document).off('click', '#mAlertDeleteCM');
    var modal = $(this);
    modal.find('.modal-content input').val(null);
    modal.find('.modal-content #mAlertName').html("Loading...");
  });
}

$( ".module-section" ).draggable({
    revert: "invalid",
    stack: ".draggable",
    helper: 'clone'});
$( ".main_mod_empty" ).droppable({
    accept: ".module-section",
    drop: function( event, ui ) {
       var droppable = $(this);
       var draggable = ui.draggable;
       var draggable_id = draggable.attr("id");
       var numItems = $('.main_mod').length+1;
       var container_size = document.getElementById("course_box").classList[0];
       var style_none = "display:block;";
       if(container_size == "col-lg-8"){
         style_none = "display:none;";
       }
        var classList_1 = $(this).attr('class').split(' ')[1];
        var index = classList_1.lastIndexOf("_");
        //console.log(index);
        var result = Number(classList_1.substr(index+1))+ Number(1);
        //console.log(result);
        var url = API_CONTENT_URL + '/course_module/';
        var method = "POST";
        var get_submodule_level_values = {
          module_name: String("Introduction"),
          level: parseInt(result), 
          course_id:String(document.getElementById("course_id").value),
          parent_id:null
        };

      fetch(url, {
        method: method,
        body: JSON.stringify(get_submodule_level_values),
        headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      })
      .then((response) => response.json())
      .then((json) => {
           var template =`<div class='module module_${numItems} main_mod no_child draggable ui-droppable' data-module_id='${json.module_id}' id='${result}' data-unique_id="module_${numItems}${json.module_id}"draggable='true' style='opacity:1'>`;
              template += `<ul class='main_module module_opacity draggable ui-droppable' style='opacity:1'>`;
              template += `<li class='course_img_icon disp_in_block flt_left' style=''><img src='../assets/images/course-icon.png' class='course_icon'></li>`;
              template += `<li class='module_input disp_in_block flt_left' style=''><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='Introduction' onblur='totext(this);' style='display: none;' maxlength='256'  data-module_id='${json.module_id}' data-cid='${json.course_id}'><p onclick='toinput(this);' id='module_module_"${result}"' data-prev_val='Introduction'>Introduction</p></li>`;
              template += `<li class='expand_img_icon disp_in_block flt_right' style=''><img src='../assets/images/arrow_up_icon.png' class='expand_icon' onclick='toggle_collapse_expand(this);'></li>`;
              template += `<li class='elipsis_img_icon disp_in_block flt_right' style=''><img src='../assets/images/elipsis.png' class='elipsis_icon' onclick='hide_show_container(this);'></li>`;
              template += `<li class='dots_img_icon disp_in_block flt_right' style='${style_none}'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item' data-flinkto='courseslistlevel' data-module_id='${json.module_id}' data-cid='${json.course_id}''>Edit</a></li><li><a data-name='Introduction' data-cid='${json.course_id}''  data-module_id='${json.module_id}' class='dropdown-item' onClick='delete_module_confirm(this)'>Delete</a></li></ul></li>`;
              //template += `<li class='progress_btn disp_in_block flt_right' style=''><p class='"+status_class+"'>"+status_text+"</p></li>`;
              template += `<li class='attach_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/attach-icon.png' class='attach_icon' onclick='show_attachment_popup(this)' data-uni_id='module_${numItems}${json.module_id}' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li>`;
              template += `<li class='message_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/message-icon.png' class='message_icon' onclick='show_message_popup(this)' data-uni_id='module_${numItems}${json.module_id}' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li>`;
              template += `<li class='user_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/user-icon.png' class='user_icon' onclick='show_assignee_popup(this)' data-uni_id='module_${numItems}${json.module_id}' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li></li>`;
              template += `<li class='frame_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/frame-icon.png' class='frame_icon' onclick='show_tag_popup(this)' data-uni_id='module_${numItems}${json.module_id}' data-getresult='tag' data-module_id='${json.module_id}' data-cid='${json.course_id}''></li>`;
              template += `<li class='plus_img_icon disp_in_block flt_right' style='${style_none}'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick="add_module(this, 'module_${numItems}${json.module_id}', 'sub');"></li></ul></div>`;
           $(this).before(template);
          hide_show_container();
      })
      .catch(function (error) {
        console.log("Requestfailed", error);
      });
    }
});
$(".module-section").click(function(){
  if($('.main_mod').length  == 0){
       var container_size = document.getElementById("course_box").classList[0];
       var style_none = "display:block;";
       if(container_size == "col-lg-8"){
         style_none = "display:none;";
       }
        var url = API_CONTENT_URL + '/course_module/';
        var method = "POST";
        var get_submodule_level_values = {
          module_name: String("Introduction"),
          level: 1, 
          course_id:String(document.getElementById("course_id").value),
          parent_id:null
        };

      fetch(url, {
        method: method,
        body: JSON.stringify(get_submodule_level_values),
        headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      })
      .then((response) => response.json())
      .then((json) => {
        $("#course_id").trigger("click");
            location.reload();
      })
      .catch(function (error) {
        console.log("Requestfailed", error);
      });
    }
});
function hide_show_container(){
    $("#right_module_menu").hide();
    $("#course_box").removeClass( "col-md-8" ).addClass( "col-md-12" );
    $("#course_box").removeClass( "col-lg-8" ).addClass( "col-lg-12" );
    $(".elipsis_img_icon").attr("style", "display:none;");
    $(".dots_img_icon").attr("style", "display:inline_block;");
    $(".attach_img_icon").attr("style", "display:inline_block;");
    $(".message_img_icon").attr("style", "display:inline_block;");
    $(".user_img_icon").attr("style", "display:inline_block;");
    $(".frame_img_icon").attr("style", "display:inline_block;");
    $(".plus_img_icon").attr("style", "display:inline_block;");
}
function add_module(e, id, mod_level){
    var element = document.querySelector('[data-unique_id="'+id+'"]');
    var module_id =  element.getAttribute("data-module_id");
    var selected_case_id = element.getAttribute("data-unique_case_id");
    //console.log(selected_case_id);
    if(selected_case_id !== "null" && selected_case_id !== "undefined" ){
      $(".mod-module").show();
      $(".mod-section").hide();
      $(".mod-sub_section").hide();
      $(".mod-case_study").hide();
    }else{
      $(".mod-module").hide();
      $(".mod-section").show();
      $(".mod-sub_section").show();
      $(".mod-case_study").show();
    }
    //console.log(mod_level);
    if(mod_level == "sub_sub"){
      $(".mod-section").hide();
    }else{
      $(".mod-section").show();
    }
    $("#clicked_event").attr("data-click_id", id);
    $("#clicked_event").attr("data-click_level", mod_level);
    $("#course_box").removeClass( "col-md-12" ).addClass( "col-md-8" );
    $("#course_box").removeClass( "col-lg-12" ).addClass( "col-lg-8" );
    $(".elipsis_img_icon").attr("style", "display:block;");
    $(".dots_img_icon").attr("style", "display:none;");
    $(".attach_img_icon").attr("style", "display:none;");
    $(".message_img_icon").attr("style", "display:none;");
    $(".user_img_icon").attr("style", "display:none;");
    $(".frame_img_icon").attr("style", "display:none;");
    $(".plus_img_icon").attr("style", "display:none;");
    $("#right_module_menu").show();
}
$(".module-sec").click(function(e){
  if($('.main_mod').length  > 0){
    var e = this;
    var clicked_elem_id = document.getElementById("clicked_event").getAttribute("data-click_id");
    var clicked_elem_level = document.getElementById("clicked_event").getAttribute("data-click_level");
    var element = document.querySelector('[data-unique_id="'+clicked_elem_id+'"]');
    console.log(element.getAttribute("data-unique_case_id"));
    /*console.log(clicked_elem_level);
    console.log(clicked_elem_id);
    console.log(e.childNodes);
    console.log(e.childNodes[3]);*/
    var selected_module = e.childNodes[3].textContent;
    $("#right_module_menu").hide();
    $("#course_box").removeClass( "col-md-8" ).addClass( "col-md-12" );
    $("#course_box").removeClass( "col-lg-8" ).addClass( "col-lg-12" );
    $(".elipsis_img_icon").attr("style", "display:none;");
    $(".dots_img_icon").attr("style", "display:inline_block;");
    $(".attach_img_icon").attr("style", "display:inline_block;");
    $(".message_img_icon").attr("style", "display:inline_block;");
    $(".user_img_icon").attr("style", "display:inline_block;");
    $(".frame_img_icon").attr("style", "display:inline_block;");
    $(".plus_img_icon").attr("style", "display:inline_block;");
    if(element.getAttribute("data-unique_case_id") == "null" && selected_module == "Module"){
      toastr.error("Chapter can only be added for Case Levels");
      return false;
    }
    if(clicked_elem_level == "sub_sub" && selected_module == "Section"){
      toastr.error("Can't add Section inside Sub Module");
    }else{
      if(selected_module == "Section" || selected_module == "Sub Section"){
        if(clicked_elem_level == "sub"){
          add_sub(element, selected_module);
        }else{
          add_sub_sub(element, selected_module);
        }
      }else if(selected_module == "Module"){
        const container = document.getElementById("popup_course_icon");
        const modal = new bootstrap.Modal(container);
        var url = `${SITE_URL_PROTOCOL}/assets/pages/cases/module_list.html?t=` + Math.floor(Date.now() / 1000);
        $('.modal-content').load(url,function(result){
          modal.show();
        });
      }else if(selected_module == "Case Study"){
        const container = document.getElementById("popup_course_icon");
        const modal = new bootstrap.Modal(container);
        var url = `${SITE_URL_PROTOCOL}/assets/pages/cases/case_study_list.html?t=` + Math.floor(Date.now() / 1000);
        $('.modal-content').load(url,function(result){
          $(".modal-lg").attr("style","max-width: 80%;");
          $("#popup_course_icon").attr("style","top: 20px;");
          modal.show();
        });
      }
    }
  }
});
$(document).ready(function() {
  /*$('#course_box').sortable({
    helper: 'clone',
    items: 'ul',
    toleranceElement: '> ul',
    forcePlaceholderSize: true,
    disableParentChange:false,
    doNotClear:false,
    isTree: true,
    expandOnHover: 700,
    startCollapsed: false,
    listType:"ul",
    tolerance: 'pointer',
    drag: function(e){
      console.log(e);
      console.log('dragged item');
    },
    drop: function(e){
      console.log(e);
      console.log('Relocated item');
    }
  });*/

      /*var ns = $('ul.sortable').nestedSortable({
        forcePlaceholderSize: true,
        handle: 'div',
        helper: 'clone',
        items: 'li',
        opacity: .6,
        placeholder: 'placeholder',
        revert: 250,
        tabSize: 25,
        tolerance: 'pointer',
        toleranceElement: '> div',
        maxLevels: 4,
        isTree: true,
        expandOnHover: 700,
        startCollapsed: false,
        change: function(){
          console.log('Relocated item');
        }
      });*/
});

/*$( ".module" ).draggable({
  revert: "invalid",
  stack: ".draggable",
  connectToSortable: "ul"
});

$('.course, .module, main_module, sub_module').sortable({
  accept: ".module",
  revert: true,
  update: function(event, ui) {
    var item = ui.item;
    var target = ui.item.prev();
    console.log(target);
  }
});
$( ".course, .module, main_module, sub_module" ).droppable({
  accept: ".module",
  drop: function( event, ui ) {
     var droppable = $(this);
     var draggable = ui.draggable;
     var draggable_id = draggable.attr("id");
     var numItems = $('.main_mod').length;
   }
});*/
/*
$( ".sub_mods" ).draggable({
  revert: "invalid",
  stack: ".draggable",
  connectToSortable: ".main_module"
});
$('.main_module').sortable({
  accept: ".sub_mods",
  revert: true,
  update: function(event, ui) {
    var item = ui.item;
    var target = ui.item.prev();
    console.log(target);
  }
});
$( ".main_module" ).droppable({
  accept: ".sub_mods",
  drop: function( event, ui ) {
     var droppable = $(this);
     var draggable = ui.draggable;
     var draggable_id = draggable.attr("id");
     var numItems = $('.main_mod').length;
   }
});*/