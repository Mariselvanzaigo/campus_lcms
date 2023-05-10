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
function toinput(e){
    if(e.innerHTML != "Add Module Name"){
        e.previousSibling.value = e.innerHTML; 
    }else{
        e.previousSibling.value = ''; 
    } 
    e.setAttribute("style","display:none");
    e.previousSibling.setAttribute("style","display:block");
    e.previousSibling.focus();
}
function totext(e){
    if(e.value == ''){
        e.value = "Add Module Name";
    }
    if(e.value != "" && e.value != "Add Module Name"){
      var class_module_level = e.parentElement.parentElement.parentElement.classList[1];
      var first_five_char_class = class_module_level.substring(0,5);
      var get_submodule_level_values = '';
      var url = API_CONTENT_URL + '/course_module/';
      if(first_five_char_class === "modul"){
        var level_number = class_module_level.split('_')[1];
        var get_submodule_level_values = {
          module_name: String(e.value),
          level: parseInt(level_number), 
          course_id:String(document.getElementById("course_id").value)
        }
      }else if(first_five_char_class === "sub_m"){
        var class_module_main_level = e.parentElement.parentElement.parentElement.classList[3];
        var class_module_sub_level = e.parentElement.parentElement.parentElement.classList[2];
        get_submodule_level_values = get_submodule_level_val(class_module_main_level, class_module_sub_level, e.value);
      }
      if(get_submodule_level_values != ''){
        post_json_dat(url, get_submodule_level_values);
      }
    }
    e.nextSibling.innerHTML = e.value; 
    e.setAttribute("style","display:none");
    e.nextSibling.setAttribute("style","display:block");
    e.nextSibling.focus();
}
function get_submodule_level_val(class_module_main_level, class_module_sub_level, ele_val){
  var data_course_module = "";
  if(class_module_sub_level.indexOf('.') !== -1){
     //console.log("Found . in str")
      var module_name_list = document.getElementById("module_"+class_module_main_level).innerHTML;
      var count = (class_module_sub_level.split(".").length - 1);
      var str_array = class_module_sub_level.split('.');
      var sting_concat = '';
      for (let i = 0; i < str_array.length-1; i++) {
        if(i == 0){
            sting_concat += str_array[i];
        }else{
          sting_concat += "."+str_array[i];
        }
        module_name_list += "/"+document.getElementById(sting_concat+"_"+class_module_main_level).innerHTML;
      }
      module_name_list += "/"+ele_val;
      var level_number = (class_module_sub_level.split("_module")[0]).split(".")[class_module_sub_level.split(".").length-1];
      data_course_module = {
        module_name: String(module_name_list),
        level: parseInt(level_number), 
        course_id:String(document.getElementById("course_id").value)
      }

  }else{
      //console.log("Not Found . in str")
      var module_name_list = document.getElementById("module_"+class_module_main_level).innerHTML+"/"+ele_val;
      var level_number = class_module_sub_level.split('_')[1];
      data_course_module = {
        module_name: String(module_name_list),
        level: parseInt(level_number), 
        course_id:String(document.getElementById("course_id").value)
      }
  }
  return data_course_module;
}

function post_json_dat(url, data){
  //console.log(data);
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .then((response) => response.json())
  .then((json) => console.log(json))
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
function add_sub(e){
    var x =e.parentElement.parentElement.childNodes;
    if(x[0].nodeName == "#text"){
        var inp_val = x[3].childNodes[1].innerHTML;
    }else{
        var inp_val = x[1].childNodes[1].innerHTML;
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
                newHTML += "<li class='module_input disp_in_block flt_left'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='Level "+result+"'onblur='totext(this);' style='display: none;' maxlength='256'><p onclick='toinput(this);' id='sub_"+result+"_"+main_mod_level+"'>Level "+result+"</p></li>";
                newHTML += "<li class='delete_img_icon disp_in_block flt_right'><i class='far fa-trash-alt' onclick='delete_sub_module(this);'></i></li>";
                newHTML += "<li class='dots_img_icon disp_in_block flt_right'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item' onclick='toggle_collapse_expand(this);'>Expand-Collapse</a></li></ul></li>";
                newHTML += "<li class='progress_btn disp_in_block flt_right'><p>In progress</p></li>";
                newHTML += "<li class='attach_img_icon disp_in_block flt_right'><img src='../assets/images/attach-icon.png' class='attach_icon'></li>";
                newHTML += "<li class='message_img_icon disp_in_block flt_right'><img src='../assets/images/message-icon.png' class='message_icon'></li>";
                newHTML += "<li class='user_img_icon disp_in_block flt_right'><img src='../assets/images/user-icon.png' class='user_icon'></li>";
                newHTML += "<li class='plus_img_icon disp_in_block flt_right'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub_sub(this);'></li>";
                newHTML += "<li class='frame_img_icon disp_in_block flt_right'><img src='../assets/images/frame-icon.png' class='frame_icon'></li>";
                newHTML += "</ul>";
                newHTML += "</div>";
                e.parentElement.parentElement.insertAdjacentHTML('beforeend', newHTML);

                var class_module_main_level = main_mod_level;
                var class_module_sub_level = "sub_"+result;
                var input_val = "Level "+result;
                var get_submodule_level_values = get_submodule_level_val(class_module_main_level, class_module_sub_level, input_val);
                var url = API_CONTENT_URL + '/course_module/';
                if(get_submodule_level_values != ''){
                  post_json_dat(url, get_submodule_level_values);
                }
                return;
            }
            if((e.parentElement.parentElement.parentElement.childNodes[0].nodeName == '#text' && e.parentElement.parentElement.parentElement.childNodes.length == 3) ||  (e.parentElement.parentElement.parentElement.childNodes[0].nodeName != '#text' && e.parentElement.parentElement.parentElement.childNodes.length == 1)){
                var index = classList[1].lastIndexOf("_");
                var result = Number(classList[1].substr(index+1));
                var result = Number(e.parentElement.parentElement.parentElement.parentElement.childNodes.length)- Number(1);
                newHTML = "<div class='module module_"+result+" main_mod_empty' style='opacity:0.5;'>";
                newHTML += "<ul class='main_module module_opacity'>";
                newHTML += "<li class='course_img_icon disp_in_block flt_left'><img src='../assets/images/course-icon.png' class='course_icon'></li>";
                newHTML += "<li class='module_input disp_in_block flt_left'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value=''onblur='totext(this);' style='display: none;' maxlength='256'><p onclick='toinput(this);' id='module_module_"+result+"'>Add Module Name</p></li>";
                newHTML += "<li class='delete_img_icon disp_in_block flt_right'><i class='far fa-trash-alt' onclick='delete_module(this);'></i></li>";
                newHTML += "<li class='dots_img_icon disp_in_block flt_right'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item' onclick='toggle_collapse_expand(this);'>Expand-Collapse</a></li></ul></li>";
                newHTML += "<li class='progress_btn disp_in_block flt_right'><p>In progress</p></li>";
                newHTML += "<li class='attach_img_icon disp_in_block flt_right'><img src='../assets/images/attach-icon.png' class='attach_icon'></li>";
                newHTML += "<li class='message_img_icon disp_in_block flt_right'><img src='../assets/images/message-icon.png' class='message_icon'></li>";
                newHTML += "<li class='user_img_icon disp_in_block flt_right'><img src='../assets/images/user-icon.png' class='user_icon'></li></li>";
                newHTML += "<li class='plus_img_icon disp_in_block flt_right'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub(this);'></li>";
                newHTML += "<li class='frame_img_icon disp_in_block flt_right'><img src='../assets/images/frame-icon.png' class='frame_icon'></li>";
                newHTML += "</ul>";
                newHTML += "</div>";
                e.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML('beforeend', newHTML);
            }else{
                var index = classList[1].lastIndexOf("_");
                var result = Number(classList[1].substr(index+1));
                if(e.parentElement.parentElement.childNodes[0].nodeName == '#text'){
                    var result = Number(e.parentElement.parentElement.childNodes.length)- Number(18);
                }else{
                    var result = Number(e.parentElement.parentElement.childNodes.length);
                }
                newHTML = "<div class='module sub_module_"+result+" sub_"+result+"' style='width:95%;margin-right: -2px;'>";
                newHTML += "<ul class='sub_module'>";
                newHTML += "<li class='course_img_icon disp_in_block flt_left'><img src='../assets/images/course-icon.png' class='course_icon'></li>";
                newHTML += "<li class='module_input disp_in_block flt_left'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='Level "+result+"'onblur='totext(this);' style='display: none;' maxlength='256'><p onclick='toinput(this);'>Level "+result+"</p></li>";
                newHTML += "<li class='delete_img_icon disp_in_block flt_right'><i class='far fa-trash-alt' onclick='delete_sub_module(this);'></i></li>";
                newHTML += "<li class='dots_img_icon disp_in_block flt_right'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item' onclick='toggle_collapse_expand(this);'>Expand-Collapse</a></li></ul></li>";
                newHTML += "<li class='progress_btn disp_in_block flt_right'><p>In progress</p></li>";
                newHTML += "<li class='attach_img_icon disp_in_block flt_right'><img src='../assets/images/attach-icon.png' class='attach_icon'></li>";
                newHTML += "<li class='message_img_icon disp_in_block flt_right'><img src='../assets/images/message-icon.png' class='message_icon'></li>";
                newHTML += "<li class='user_img_icon disp_in_block flt_right'><img src='../assets/images/user-icon.png' class='user_icon'></li>";
                newHTML += "<li class='plus_img_icon disp_in_block flt_right'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub_sub(this);'></li>";
                newHTML += "<li class='frame_img_icon disp_in_block flt_right'><img src='../assets/images/frame-icon.png' class='frame_icon'></li>";
                newHTML += "</ul>";
                newHTML += "</div>";
                e.parentElement.parentElement.insertAdjacentHTML('beforeend', newHTML);
            }
        }
    }
}

function add_sub_sub(e){
  var x =e.parentElement.parentElement.childNodes;
  if(x.length == 15){
    var inp_val = x[3].childNodes[0].value;
  }
  if(x.length == 9){
    var inp_val = x[1].childNodes[0].value;
  }
  if(inp_val != ''){
    var main_mod_level = e.parentElement.parentElement.parentElement.classList[3];
    var classList = e.parentElement.parentElement.parentElement.className.split(/\s+/);
    var index = classList[1].lastIndexOf("_");
    var res_1 = Number(classList[1].substr(index+1));
    var result = classList[1].substr(index+1)+"."+ Number(e.parentElement.parentElement.childNodes.length - 9);
    newHTML = "<div class='module sub_module_"+result+" sub_"+result+" "+main_mod_level+"' style='width:95%;margin-right: -2px;'>";
    newHTML += "<ul class='sub_module'>";
    newHTML += "<li class='course_img_icon disp_in_block flt_left'><img src='../assets/images/course-icon.png' class='course_icon'></li>";
    newHTML += "<li class='module_input disp_in_block flt_left'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='Level "+result+"'onblur='totext(this);' style='display: none;' maxlength='256'><p onclick='toinput(this);' id='sub_"+result+"_"+main_mod_level+"'>Level "+result+"</p></li>";
    newHTML += "<li class='delete_img_icon disp_in_block flt_right'><i class='far fa-trash-alt' onclick='delete_sub_module(this);'></i></li>";
    newHTML += "<li class='dots_img_icon disp_in_block flt_right'><button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button><ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'><li><a class='dropdown-item' onclick='toggle_collapse_expand(this);'>Expand-Collapse</a></li></ul></li>";
    newHTML += "<li class='progress_btn disp_in_block flt_right'><p>In progress</p></li>";
    newHTML += "<li class='attach_img_icon disp_in_block flt_right'><img src='../assets/images/attach-icon.png' class='attach_icon'></li>";
    newHTML += "<li class='message_img_icon disp_in_block flt_right'><img src='../assets/images/message-icon.png' class='message_icon'></li>";
    newHTML += "<li class='user_img_icon disp_in_block flt_right'><img src='../assets/images/user-icon.png' class='user_icon'></li>";
    newHTML += "<li class='plus_img_icon disp_in_block flt_right'><img src='../assets/images/plus-icon.png' class='plus_icon' onClick='add_sub_sub(this);'></li>";
    newHTML += "<li class='frame_img_icon disp_in_block flt_right'><img src='../assets/images/frame-icon.png' class='frame_icon'></li>";
    newHTML += "</ul>";
    newHTML += "</div>";
    e.parentElement.parentElement.insertAdjacentHTML('beforeend', newHTML);
    var class_module_main_level = main_mod_level;
    var class_module_sub_level = "sub_"+result;
    var input_val = "Level "+result;
    var get_submodule_level_values = get_submodule_level_val(class_module_main_level, class_module_sub_level, input_val);
    var url = API_CONTENT_URL + '/course_module/';
    if(get_submodule_level_values != ''){
      post_json_dat(url, get_submodule_level_values);
    }
   }
}
function delete_module(e){
  var x =e.parentElement.parentElement.childNodes;
  if(x[0].nodeName == "#text"){
      var inp_val = x[3].childNodes[1].innerHTML;
  }else{
      var inp_val = x[1].childNodes[0].value;
  }
  if(inp_val != '' && inp_val != "Add Module Name"){

    var result = [],
    node = e.parentNode.parentNode.parentNode.parentNode.firstChild;
    while ( node ) {
        if (node.nodeType === Node.ELEMENT_NODE ) 
          result.push( node );
        node = node.nextElementSibling || node.nextSibling;
    }
    if(result.length > 1){
      e.parentNode.parentNode.parentNode.remove();
      var result2 = [],
      node2 = document.getElementById('course_box').firstChild;
      while ( node2 ) {
          if (node2.nodeType === Node.ELEMENT_NODE ) 
            result2.push( node2 );
          node2 = node2.nextElementSibling || node2.nextSibling;
      }
      var key = 1;
      result2.forEach(function(item){
        item.classList.replace(item.classList[1], "module_"+key);
        key++;
      });
    }
  }
}