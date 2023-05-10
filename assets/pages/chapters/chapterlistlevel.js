 $(document).ready(function(){

  $("#tabone,#tabtwo").click(function(){
    $(".dz-preview").remove();
    var medias = Array.prototype.slice.apply($("video"));
    medias.forEach(function(media) {
      if(event.target != media) media.pause();
    });
    var medias2 = Array.prototype.slice.apply(CKEDITOR.instances["editor1"].document.$.getElementsByTagName("video"));
    console.log(medias2);
    medias2.forEach(function(media) {
      if(event.target != media) media.pause();
    });
  });
  if(processRights("Write Content") === false){
    $("#editor1").hide();
    $("#saveTopics").hide();
    $("#convertToAudio").hide();
  }else{
    var editor  = CKEDITOR.replace("editor1",{
      height: 300,
    });
    /*CKEDITOR.config.extraPlugins = 'bgimage,base64image,backgrounds,hcard,justify,hcard,wordcount';
    CKEDITOR.config.allowedContent = true;
    CKEDITOR.config.removeButtons = 'Underline,Subscript,Superscript,Image,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Strike,CopyFormatting,RemoveFormat,BidiLtr,BidiRtl,Language,Anchor,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,About,Source,NewPage,Print,CreateDivContainer,Cut,Copy,Paste,CreateDiv,Preview,Save,ExportPdf,HorizontalRule,Styles,Format,Font,FontSize,Undo,Redo';*/

    //CKEDITOR.config.removePlugins = 'blockquote';
    //CKEDITOR.config.allowedContent = true;
    //CKEDITOR.config.removeButtons = 'Underline,Subscript,Superscript,Image,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Strike,CopyFormatting,RemoveFormat,BidiLtr,BidiRtl,Language,Anchor,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,About,Source,NewPage,Print,CreateDivContainer,Cut,Copy,Paste,CreateDiv,Preview,Save,ExportPdf,HorizontalRule,Styles,Format,Font,FontSize,Undo,Redo';
    CKEDITOR.config.removeButtons = 'BGColor,Indent,Outdent,Unlink,Subscript,Superscript,Image,Templates,PasteText,PasteFromWord,Find,Replace,Scayt,CopyFormatting,BidiLtr,BidiRtl,Language,Anchor,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,About,NewPage,Print,CreateDivContainer,Cut,Copy,Paste,CreateDiv,Preview,Save,ExportPdf,HorizontalRule,Styles,Font,FontSize,Format';
    CKEDITOR.config.extraPlugins = 'base64image,backgrounds,editorplaceholder,font,format_buttons,justify,hcard,wordcount,videoembed';
    CKEDITOR.config.removePlugins = 'iframe';

    CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;

    CKEDITOR.config.fillEmptyBlocks = false;
    CKEDITOR.config.tabSpaces = 0;
    CKEDITOR.config.basicEntities = false;
    CKEDITOR.config.allowedContent = true;

    get_content_details_case_module();
  }
  $("#role-loader").css("display", "block");
  $("#rolebox").css("display", "none");
    let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
    let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
    if(processRights("Add Audio") === false && processRights("Add Slide") === false && processRights("Add Video") === false){
      $("#demo-upload_chapter_module").hide();
    }
    var acceptedFiles = "";
    if(processRights("Add Audio") === true){
      acceptedFiles += ".mp3, .wav,";
    }
    if(processRights("Add Slide") === true){
      acceptedFiles += "image/jpeg,image/png,image/gif,image/jpg,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.ods,.odp,.odt,.rtf,";
    }
    if(processRights("Add Video") === true){
      acceptedFiles += ".mp4,.mkv,.avi,";
    }
    acceptedFiles = acceptedFiles.replace(/,\s*$/, "");
    var dropzone = new Dropzone('#demo-upload_chapter_module', {
        previewTemplate: document.querySelector('#preview-template').innerHTML,
        parallelUploads: 2,
        thumbnailHeight: 120,
        thumbnailWidth: 120,
        maxFilesize: 3,
        filesizeBase: 1000,
        acceptedFiles: acceptedFiles,
        thumbnail: function(file, dataUrl) {
            if (file.previewElement) {
              file.previewElement.classList.remove("dz-file-preview");
              var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
              for (var i = 0; i < images.length; i++) {
                  var thumbnailElement = images[i];
                  thumbnailElement.alt = file.name;
                  thumbnailElement.src = dataUrl;
              }
              //setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1000);
              file.previewElement.classList.add("dz-image-preview");
            }
        }

    });

    get_chapter_breadcrumbs();
    //setTimeout(, 1000);
    //get_chapter_search_details();
    var minSteps = 6,
        maxSteps = 60,
        timeBetweenSteps = 100,
        bytesPerStep = 100000;

    dropzone.uploadFiles = function(files) {
        var self = this;
        let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
        let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
        var formData = new FormData();
        var todayDate = new Date().toISOString().slice(0, 10);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var ext = file.name.split('.').pop();
            if(file.type.split('/')[0] !== 'image' && file.type.split('/')[0] !== 'video')

            if(ext=="pdf" || ext=="docx" || ext=="doc" || ext=="rtf" || ext=="odp" || ext=="ods" || ext=="odt" || ext=="ppt" || ext=="xls" || ext=="xlsx"){
              if (ext == "pdf") {
                  $(file.previewElement).find(".dz-image img").attr("src", `${SITE_URL_PROTOCOL}assets/images/pdf-thumbnail.png`);
              } else if (ext.indexOf("doc") != -1) {
                  $(file.previewElement).find(".dz-image img").attr("src", `${SITE_URL_PROTOCOL}assets/images/doc-thumbnail.png`);
              } else if (ext.indexOf("docx") != -1) {
                  $(file.previewElement).find(".dz-image img").attr("src", `${SITE_URL_PROTOCOL}assets/images/doc-thumbnail.png`);
              } else if (ext.indexOf("xls") != -1) {
                  $(file.previewElement).find(".dz-image img").attr("src", `${SITE_URL_PROTOCOL}assets/images/excel-thumbnail.png`);
              } else if (ext.indexOf("ppt") != -1) {
                  $(file.previewElement).find(".dz-image img").attr("src", `${SITE_URL_PROTOCOL}assets/images/ppt-thumbnail.png`);
              } else if (ext.indexOf("rtf") != -1) {
                  $(file.previewElement).find(".dz-image img").attr("src", `${SITE_URL_PROTOCOL}assets/images/rtf-thumbnail.png`);
              } else{
                  $(file.previewElement).find(".dz-image img").attr("src", `${SITE_URL_PROTOCOL}assets/images/doc-thumbnail.png`);
              }
            }
            formData.append("attachment", file);
            formData.append("attachment_type", file.type);
            formData.append("attachment_name", file.name);
            formData.append("created_date", todayDate);
            formData.append("status", 0);
            formData.append("chapter_topic_id", chapter_topic_id);
            formData.append("chapter_id", chapter_id);
            $.ajax({
              url: API_CONTENT_URL + "/chapter_topic_attachments/",
              method: "POST",
              type: 'POST', // For jQuery < 1.9
              cache: false,
              contentType: false,
              processData: false,
              data: formData,
              headers: {
                "Authorization" : "Bearer " + getUserInfo().access_token
              },
              success: function(response){
                $('#addCourses').modal('hide');
                toastr.success("File uploaded successfully.");
              },
              error: function(error) {
                toastr.error("Response Error: " + error.message);
                console.log(error);
              }
            });
            totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

            for (var step = 0; step < totalSteps; step++) {
                var duration = timeBetweenSteps * (step + 1);
                setTimeout(function(file, totalSteps, step) {
                    return function() {
                        file.upload = {
                            progress: 100 * (step + 1) / totalSteps,
                            total: file.size,
                            bytesSent: (step + 1) * file.size / totalSteps
                        };
                        self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
                        if (file.upload.progress == 100) {
                            file.status = Dropzone.SUCCESS;
                            self.emit("success", file, 'success', null);
                            self.emit("complete", file);
                            self.processQueue();
                          //document.getElementsByClassName("dz-success-mark").style.opacity = "1";
                        }
                    };
                }(file, totalSteps, step), duration);
            }
        }
    }

    $.ajax({
      url: API_CONTENT_URL + '/chapter_topic_tags/?chapter_id='+chapter_id+'&chapter_topic_id='+chapter_topic_id,
      type: 'get',
      dataType: 'json',
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      success:function(response){
        var chapter_tags = response;
        var tag_list ="";
        var tag_list_str = "";
        for(var i = 0; i < chapter_tags.length; i++){
          tag_list += '<li>'+chapter_tags[i].name+'<span class="tag__removes tag__removes_chap_level" data-tag="'+chapter_tags[i].name+'" data-tagid="'+chapter_tags[i].id+'">×</span></li>';
          tag_list_str += chapter_tags[i].name+",";
        }
        document.getElementById("tag__List_append").innerHTML = tag_list;
        document.getElementById("tag__values").value = tag_list_str;

        var sum = 0;
        $('#tag__List_append li').each(function() {
           sum += $(this).height();
        });
        if(sum > 80){
          $(".show-more").css('display','block');
        }else{
          $(".show-more").css('display','none');
        }
      },
      error: function(error) {
        if (error.status === 401) {
          alert("Session Expired, Please login again.");
          logoutSession();
        }
      }
    });

var  lastVal ="";
$("#global_search_module_chap").focus(function () {
  lastVal = $(this).val();
});
$("#global_search_module_chap").on('keyup', function (e){
  if(e.keyCode === 13)  {
    $(this).blur();
  }
});
$("#global_search_module_chap").on('blur', function (e) {
  if (e.type === 'blur')  {
    if (lastVal != $(this).val()){
      let searchvallength = $("#global_search_module_chap").val().length;
      if(searchvallength > 2){
        $('.global_search_module_chap_content').empty();
        $("#allattach-loader").removeClass("disp_none");
        $("#allattach-loader").addClass("disp_block");
        var tagName = $("#global_search_module_chap").val();
        $('.global_search_module_chap_content').empty();
        var active_tab_type = $("#active_li_chap li.active").attr('id');
        var tab4_active = (active_tab_type == "tab4") ? "active" : "";
        var attachment_all = $('<div class="tab_content '+tab4_active+'" data-tab="tab4"><div id="slide_pos"><div class="row loader"><span>Loading Image..</span></div></div><div id="video_pos"><div class="row loader"><span>Loading Video..</span></div></div><div id="audio_pos"><div class="row loader"><span>Loading Audio..</span></div></div><div id="text_pos"><div class="row loader"><span>Loading Text..</span></div></div></div>');
        console.log('execute start');
        get_search_details_bytype_all('slide', 'Slide', tagName, attachment_all);
        get_search_details_bytype_all('video', 'Video', tagName, attachment_all);
        get_search_details_bytype_all('audio', 'Audio', tagName, attachment_all);
        get_search_details_bytype_all('content', 'Text', tagName, attachment_all);
        console.log('execute end');
      }else{
        $('.global_search_module_chap_content').empty();
        $("#allattach-loader").addClass("disp_none");
        $("#allattach-loader").removeClass("disp_block");
      }
    }
  }
 });
  $("#role-loader").css("display", "none");
  $("#rolebox").css("display", "flex");
});

function get_search_details_bytype_all(attachment_type, type_title, tagName, attachment_all){
  var active_tab_type = $("#active_li_chap li.active").attr('id');
  const currentRequest = $.ajax({
    type: 'GET',
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type='+attachment_type+'&per_page=6',
  });
  $.ajax({
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type='+attachment_type+'&per_page=6',
    type: 'GET',
    dataType: 'json',
    headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
    beforeSend: () => {
      currentRequest.abort();
    },
    success:function(response){
      console.log(response);
      var tab4_active = (active_tab_type == "tab4") ? "active" : "";
      //var attachment_all = $('<div class="tab_content '+tab4_active+'" data-tab="tab4"><div id="text_pos"><div id="slide_pos"></div><div id="video_pos"></div><div id="audio_pos"></div></div></div>');
      var attachment_text  = "";
      var attachment_text_all  = "";
      var attachment_video = "";
      var attachment_video_all = "";
      var attachment_audio = "";
      var attachment_audio_all = "";
      var attachment_slide = "";
      var attachment_slide_all = "";
      var video_attachment_count = 1;
      var audio_attachment_count = 0;
      var image_attachment_count = 0;
      var base_img_url = `${API_CONTENT_URL}`;
      if(attachment_type == "content"){
        tab12_active = (active_tab_type == "tab12") ? "active" : "";
        attachment_text += `<div class="tab_content ${tab12_active}" data-tab="tab12"><h5>Text (${response.total})</h5><div class="text_container">`;
        attachment_text_all += `<h5>Text (${response.total})</h5><div class="text_container_all">`;
        if(response.data.length > 0){
          response.data.forEach(function (element, index) {
            attachment_text +=`<div class="col-12 mb-3 text_content comment-wrapper">
                                <div class="tab-text relative mb-3 image_content content_show_hide"> 
                                  ${element.content}
                                </div>
                                <div class="read-more">Read more >></div>
                                <div class="read-less"><< View less</div>
                               </div>`;
            attachment_text_all +=`<div class="col-12 mb-3 text_content comment-wrapper">
                                <div class="tab-text_all relative mb-3 image_content content_show_hide"> 
                                  ${element.content}
                                </div>
                                <div class="read-more">Read more >></div>
                                <div class="read-less"><< View less</div>
                               </div>`;                               
          });
          var text_length = parseInt($(".tab-text").length)+parseInt(response.data.length);
          console.log(text_length, response.total);
          if(text_length < response.total){
            attachment_text += `<div class="load-more_audio_content mb-3" id="load_more_text" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
            attachment_text_all += `<div class="load-more_audio_content mb-3" id="load_more_text_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
          }
          attachment_text += `</div>`;
          attachment_text_all += `</div>`;
          attachment_all.find("#text_pos").empty();
          attachment_all.find("#text_pos").append(attachment_text_all);
          $(".global_search_module_chap_content").append(attachment_text);
        }else{
          attachment_text += `<p><span class="text-danger">No Content Found!</span></p></div></div>`;
          attachment_text_all += `<p><span class="text-danger">No Content Found!</span></p></div></div>`;
          attachment_all.find("#text_pos").empty();
          attachment_all.find("#text_pos").append(attachment_text_all);
          $(".global_search_module_chap_content").append(attachment_text);
        }
      }
      if(attachment_type == "slide"){
        tab10_active = (active_tab_type == "tab10") ? "active" : "";
        attachment_slide += `<div class="tab_content ${tab10_active}" data-tab="tab10"><h5>Images (${response.total})</h5><div class="slide_container">`;
        attachment_slide_all += `<h5>Images (${response.total})</h5><div class="slide_container_all">`;
        if(response.data.length > 0){
          response.data.forEach(function (element, index) {
            if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
              base_img_url = '';
            }
            if(image_attachment_count  % 3 == 0){
              attachment_slide += `<div class="row slide_content">`;
              attachment_slide_all += `<div class="row slide_content">`;
            }
            attachment_slide += `<div class="col-4 mb-3">
                                  <div class="tab-slide relative">
                                    <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 10 ? decodeURI(element.attachment_name).substring(0, 10).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                    <a href="${base_img_url}${element.attachment}" target="_blank" title="${decodeURI(element.attachment_name)}">
                                      <img class="w-100"src="${base_img_url}${element.attachment}" alt="${decodeURI(element.attachment_name)}">
                                    </a>
                                  </div>
                                </div>`;
            
            attachment_slide_all += `<div class="col-4 mb-3">
                                  <div class="tab-slide_all relative">
                                    <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 10 ? decodeURI(element.attachment_name).substring(0, 10).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                    <a href="${base_img_url}${element.attachment}" target="_blank" title="${decodeURI(element.attachment_name)}">
                                      <img class="w-100"src="${base_img_url}${element.attachment}" alt="${decodeURI(element.attachment_name)}">
                                    </a>
                                  </div>
                                </div>`;                                
            if(image_attachment_count  % 3 == 2){
              attachment_slide += `</div>`;
              attachment_slide_all += `</div>`;
            }
            image_attachment_count++;
          });
          var slide_length = parseInt($(".tab-slide").length)+parseInt(response.data.length);
          console.log(slide_length, response.total);
          if(slide_length < response.total){
            attachment_slide += `<div class="load-more_slide_content mb-3" id="load_more_slide" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
            attachment_slide_all += `<div class="load-more_slide_content mb-3" id="load_more_slide_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
          }
          attachment_slide += `</div>`;
          attachment_slide_all += `</div>`;
          attachment_all.find("#slide_pos").empty();
          attachment_all.find("#slide_pos").append(attachment_slide_all);
          $(".global_search_module_chap_content").append(attachment_slide);
        }else{
          attachment_slide += `<p><span class="text-danger">No Image Found!</span></p></div></div>`;
          attachment_slide_all += `<p><span class="text-danger">No Image Found!</span></p></div></div>`;
          attachment_all.find("#slide_pos").empty();
          attachment_all.find("#slide_pos").append(attachment_slide_all);
          $(".global_search_module_chap_content").append(attachment_slide);
        }
      }
      if(attachment_type == "video"){
        tab9_active = (active_tab_type == "tab9") ? "active" : "";
        attachment_video = `<div class="tab_content ${tab9_active}" data-tab="tab9"><h5>Videos (${response.total})</h5><div class="video_container">`;
        attachment_video_all = `<h5>Videos (${response.total})</h5><div class="video_container_all">`;
        if(response.data.length > 0){
          response.data.forEach(function (element, index) {
            if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
              base_img_url = '';
            }
            if(video_attachment_count  % 2 !== 0){
              attachment_video += `<div class="row video_content">`;
              attachment_video_all += `<div class="row video_content">`;
            }
              attachment_video += `<div class="col-6 mb-3">
                                    <div class="tab-video relative">
                                      <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 15 ? decodeURI(element.attachment_name).substring(0, 15).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                      <video id='${element.id}' controls="controls" preload='metadata' width="600" poster="" title="${decodeURI(element.attachment_name)}"><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>
                                    </div>
                                  </div>`;

              attachment_video_all += `<div class="col-6 mb-3">
                                    <div class="tab-video_all relative">
                                      <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 15 ? decodeURI(element.attachment_name).substring(0, 15).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                      <video id='${element.id}' controls="controls" preload='metadata' width="600" poster="" title="${decodeURI(element.attachment_name)}"><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>
                                    </div>
                                  </div>`;
            if(video_attachment_count  % 2 === 0){
              attachment_video += `</div>`;
              attachment_video_all += `</div>`;
            }
            video_attachment_count++;
          });
          var video_length = parseInt($(".tab-video").length)+parseInt(response.data.length);
          console.log(video_length, response.total);
          if(video_length < response.total){
            attachment_video += `<div class="load-more_video_content mb-3" id="load_more_video" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
            attachment_video_all += `<div class="load-more_video_content mb-3" id="load_more_video_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
          }
          attachment_video += `</div>`;
          attachment_video_all += `</div>`;
          attachment_all.find("#video_pos").empty();
          attachment_all.find("#video_pos").append(attachment_video_all);
          $(".global_search_module_chap_content").append(attachment_video);
        }else{
          attachment_video += `<p><span class="text-danger">No Video Found!</span></p></div></div>`;
          attachment_video_all += `<p><span class="text-danger">No Video Found!</span></p></div></div>`;
          attachment_all.find("#video_pos").empty();
          attachment_all.find("#video_pos").append(attachment_video_all);
          $(".global_search_module_chap_content").append(attachment_video);
        }
      }
      if(attachment_type == "audio"){
        tab11_active = (active_tab_type == "tab11") ? "active" : "";
        attachment_audio = `<div class="tab_content ${tab11_active}" data-tab="tab11"><h5>Audios (${response.total})</h5><div class="audio_container">`;
        attachment_audio_all = `<h5>Audios (${response.total})</h5><div class="audio_container_all">`;
        if(response.data.length > 0){
          response.data.forEach(function (element, index) {
            if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
              base_img_url = '';
            }
            attachment_audio += `<div class="col-12 mb-3 audio_content">
                                    <div class="tab-audio relative">
                                      <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 30 ? decodeURI(element.attachment_name).substring(0, 30).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                      <audio title="${decodeURI(element.attachment_name)}" controls>
                                        <source src="${base_img_url}${element.attachment}" type="audio/mpeg">
                                          Your browser does not support the audio element. 
                                      </audio>
                                    </div>
                                  </div>`;
            attachment_audio_all += `<div class="col-12 mb-3 audio_content">
                                    <div class="tab-audio_all relative">
                                      <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 30 ? decodeURI(element.attachment_name).substring(0, 30).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                      <audio title="${decodeURI(element.attachment_name)}" controls>
                                        <source src="${base_img_url}${element.attachment}" type="audio/mpeg">
                                          Your browser does not support the audio element. 
                                      </audio>
                                    </div>
                                  </div>`;
          });
          var audio_length = parseInt($(".tab-audio").length)+parseInt(response.data.length);
          console.log(audio_length, response.total);
          if(audio_length < response.total){
            attachment_audio += `<div class="load-more_audio_content mb-3" id="load_more_audio" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
            attachment_audio_all += `<div class="load-more_audio_content mb-3" id="load_more_audio_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:none"/ ></div>`;
          }
          attachment_audio += `</div>`;
          attachment_audio_all += `</div>`;
          attachment_all.find("#audio_pos").empty();
          attachment_all.find("#audio_pos").append(attachment_audio_all);
          $(".global_search_module_chap_content").append(attachment_audio);
        }else{
          attachment_audio += `<p><span class="text-danger">No Audio Found!</span></p></div></div>`;
          attachment_audio_all += `<p><span class="text-danger">No Audio Found!</span></p></div></div>`;
          attachment_all.find("#audio_pos").empty();
          attachment_all.find("#audio_pos").append(attachment_audio_all);
          $(".global_search_module_chap_content").append(attachment_audio);
        }
      }

      $(".global_search_module_chap_content").append(attachment_all);
      $("#allattach-loader").removeClass("disp_block");
      $("#allattach-loader").addClass("disp_none");
    },
    error: function(error) {
      if (error.status === 401) {
        alert("Session Expired, Please login again.");
        logoutSession();
      }
    }
  });
 }
 $(document).ready(function(){
  $(document.body).on('click', '#load_more_video' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_video(tagName, next_page, 'video');
   });
  $(document.body).on('click', '#load_more_video_all' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_video(tagName, next_page, 'all');
   });
  $(document.body).on('click', '#load_more_slide' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_slide(tagName, next_page, 'slide');
   });
  $(document.body).on('click', '#load_more_slide_all' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_slide(tagName, next_page, 'all');
   });
  $(document.body).on('click', '#load_more_audio' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_audio(tagName, next_page, 'slide');
   });
  $(document.body).on('click', '#load_more_audio_all' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_audio(tagName, next_page, 'all');
   });
  $(document.body).on('click', '#load_more_text' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_text(tagName, next_page, 'content');
   });
  $(document.body).on('click', '#load_more_text_all' ,function(){
    var page_no = parseInt($(this).attr("data-page_no"));
    var next_page = page_no+1;
    var tagName = $("#global_search_module_chap").val();
    load_more_text(tagName, next_page, 'all');
   });
 });
 function load_more_video(tagName, next_page_no, search_type){

  if(search_type == 'all'){
    $("#load_more_video_all .video_spinner").attr("style", "display:inline-block");
  }else{
    $("#load_more_video .video_spinner").attr("style", "display:inline-block");
  }
  const currentRequestvideo = $.ajax({
    type: 'GET',
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=video&per_page=6&page='+next_page_no,
  });
  $.ajax({
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=video&per_page=6&page='+next_page_no,
    type: 'GET',
    dataType: 'json',
    headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
    beforeSend: () => {
      currentRequestvideo.abort();
    },
    success:function(response){
      var attachment_video = "";
      var video_attachment_count = 1;

      response.data.forEach(function (element, index) {
        var base_img_url = `${API_CONTENT_URL}`;
        if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
          base_img_url = '';
        }
        if(video_attachment_count  % 2 !== 0){
          attachment_video += `<div class="row video_content">`;
        }
        var tab_videoclass = "tab-video";
        if(search_type == 'all'){
          tab_videoclass = "tab-video_all";
        }
          attachment_video += `<div class="col-6 mb-3">
                                <div class="${tab_videoclass} relative">
                                  <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 15 ? decodeURI(element.attachment_name).substring(0, 15).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                  <video id='${element.id}' controls="controls" preload='metadata' width="600" poster="" title="${decodeURI(element.attachment_name)}"><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>
                                </div>
                              </div>`;
        if(video_attachment_count  % 2 === 0){
          attachment_video += `</div>`;
        }
        video_attachment_count++;
      });

        if(search_type == 'all'){
          var video_length = parseInt($(".tab-video_all").length)+parseInt(response.data.length);
        }else{
          var video_length = parseInt($(".tab-video").length)+parseInt(response.data.length);
        }
      if(search_type == 'all'){
        $("#load_more_video_all").remove();
      }else{
        $("#load_more_video").remove();
      }
      if(video_length < response.total){
        if(search_type == 'all'){
          attachment_video += `<div class="load-more_video_content mb-3" id="load_more_video_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }else{
          attachment_video += `<div class="load-more_video_content mb-3" id="load_more_video" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }
      }
      if(search_type == 'all'){
        $(".video_container_all").append(attachment_video);
        $("#load_more_video_all .video_spinner").attr("style", "display:none");
      }else{
        $(".video_container").append(attachment_video);
        $("#load_more_video .video_spinner").attr("style", "display:none");
      }
    }
  });
 }
 function load_more_slide(tagName, next_page_no, search_type){

  if(search_type == 'all'){
    $("#load_more_slide_all .video_spinner").attr("style", "display:inline-block");
  }else{
    $("#load_more_slide .video_spinner").attr("style", "display:inline-block");
  }
  const currentRequestslide = $.ajax({
    type: 'GET',
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=slide&per_page=6&page='+next_page_no,
  });
  $.ajax({
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=slide&per_page=6&page='+next_page_no,
    type: 'GET',
    dataType: 'json',
    headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
    beforeSend: () => {
      currentRequestslide.abort();
    },
    success:function(response){
      console.log(response);
      var attachment_slide = "";
      var image_attachment_count = 0;

      response.data.forEach(function (element, index) {
        var base_img_url = `${API_CONTENT_URL}`;
        if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
          base_img_url = '';
        }
        if(image_attachment_count  % 3 == 0){
          attachment_slide += `<div class="row slide_content">`;
        }
        var tab_slideclass = "tab-slide";
        if(search_type == 'all'){
          tab_slideclass = "tab-slide_all";
        }
        attachment_slide += `<div class="col-4 mb-3">
                              <div class="${tab_slideclass} relative">
                                <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 10 ? decodeURI(element.attachment_name).substring(0, 10).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                <a href="${base_img_url}${element.attachment}" target="_blank" title="${decodeURI(element.attachment_name)}">
                                  <img class="w-100"src="${base_img_url}${element.attachment}" alt="${decodeURI(element.attachment_name)}">
                                  </a>
                              </div>
                            </div>`;                                
        if(image_attachment_count  % 3 == 2){
          attachment_slide += `</div>`;
        }
        image_attachment_count++;
      });

      if(search_type == 'all'){
        var slide_length = parseInt($(".tab-slide_all").length)+parseInt(response.data.length);
      }else{
        var slide_length = parseInt($(".tab-slide").length)+parseInt(response.data.length);
      }
      if(search_type == 'all'){
        $("#load_more_slide_all").remove();
      }else{
        $("#load_more_slide").remove();
      }
      if(slide_length < response.total){
        if(search_type == 'all'){
          attachment_slide += `<div class="load-more_video_content mb-3" id="load_more_slide_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }else{
          attachment_slide += `<div class="load-more_video_content mb-3" id="load_more_slide" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }
      }
      if(search_type == 'all'){
        $(".slide_container_all").append(attachment_slide);
        $("#load_more_slide_all .video_spinner").attr("style", "display:none");
      }else{
        $(".slide_container").append(attachment_slide);
        $("#load_more_slide .video_spinner").attr("style", "display:none");
      }
    }
  });
 }

 function load_more_audio(tagName, next_page_no, search_type){

  if(search_type == 'all'){
    $("#load_more_audio_all .video_spinner").attr("style", "display:inline-block");
  }else{
    $("#load_more_audio .video_spinner").attr("style", "display:inline-block");
  }
  const currentRequestaudio = $.ajax({
    type: 'GET',
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=audio&per_page=6&page='+next_page_no,
  });
  $.ajax({
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=audio&per_page=6&page='+next_page_no,
    type: 'GET',
    dataType: 'json',
    headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
    beforeSend: () => {
      currentRequestaudio.abort();
    },
    success:function(response){
      console.log(response);
      var attachment_audio = "";

      response.data.forEach(function (element, index) {
        var base_img_url = `${API_CONTENT_URL}`;
        if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
          base_img_url = '';
        }
        var tab_audioclass = "tab-audio";
        if(search_type == 'all'){
          tab_audioclass = "tab-audio_all";
        }
        attachment_audio += `<div class="col-12 mb-3 audio_content">
                                <div class="${tab_audioclass} relative">
                                <p title="${decodeURI(element.attachment_name)}">${decodeURI(element.attachment_name).length > 30 ? decodeURI(element.attachment_name).substring(0, 30).trim()+"..." : decodeURI(element.attachment_name)}</p>
                                  <audio title="${decodeURI(element.attachment_name)}" controls>
                                    <source src="${base_img_url}${element.attachment}" type="audio/mpeg">
                                      Your browser does not support the audio element. 
                                  </audio>
                                </div>
                              </div>`;
      });


        if(search_type == 'all'){
          var audio_length = parseInt($(".tab-audio_all").length)+parseInt(response.data.length);
        }else{
          var audio_length = parseInt($(".tab-audio").length)+parseInt(response.data.length);
        }
      if(search_type == 'all'){
        $("#load_more_audio_all").remove();
      }else{
        $("#load_more_audio").remove();
      }
      if(audio_length < response.total){
        if(search_type == 'all'){
          attachment_audio += `<div class="load-more_video_content mb-3" id="load_more_audio_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }else{
          attachment_audio += `<div class="load-more_video_content mb-3" id="load_more_audio" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }
      }
      if(search_type == 'all'){
        $(".audio_container_all").append(attachment_audio);
        $("#load_more_audio_all .video_spinner").attr("style", "display:none");
      }else{
        $(".audio_container").append(attachment_audio);
        $("#load_more_audio .video_spinner").attr("style", "display:none");
      }
    }
  });
 }
 function load_more_text(tagName, next_page_no, search_type){

  if(search_type == 'all'){
    $("#load_more_text_all .video_spinner").attr("style", "display:inline-block");
  }else{
    $("#load_more_text .video_spinner").attr("style", "display:inline-block");
  }
  const currentRequesttext = $.ajax({
    type: 'GET',
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=text&per_page=6&page='+next_page_no,
  });
  $.ajax({
    url: API_CONTENT_URL + '/global_search/?tag_name='+tagName+'&type=text&per_page=6&page='+next_page_no,
    type: 'GET',
    dataType: 'json',
    headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
    beforeSend: () => {
      currentRequesttext.abort();
    },
    success:function(response){
      console.log(response);
      var attachment_text = "";

      response.data.forEach(function (element, index) {
        var base_img_url = `${API_CONTENT_URL}`;
        if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
          base_img_url = '';
        }
        var tab_textclass = "tab-text";
        if(search_type == 'all'){
          tab_textclass = "tab-text_all";
        }
        attachment_text += `<div class="col-12 mb-3 text_content comment-wrapper">
                              <div class="${tab_textclass} relative mb-3 image_content content_show_hide"> 
                                ${element.content}
                              </div>
                              <div class="read-more">Read more >></div>
                              <div class="read-less"><< View less</div>
                             </div>`;
      });


      if(search_type == 'all'){
        var text_length = parseInt($(".tab-text_all").length)+parseInt(response.data.length);
      }else{
        var text_length = parseInt($(".tab-text").length)+parseInt(response.data.length);
      }
      if(search_type == 'all'){
        $("#load_more_text_all").remove();
      }else{
        $("#load_more_text").remove();
      }
      if(text_length < response.total){
        if(search_type == 'all'){
          attachment_text += `<div class="load-more_audio_content mb-3" id="load_more_text_all" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }else{
          attachment_text += `<div class="load-more_audio_content mb-3" id="load_more_text" data-page_no="${response.page}">Load More<img src="../assets/images/spinner2.gif" class="video_spinner" style="display:inline-block"/ ></div>`;
        }
      }
      if(search_type == 'all'){
        $(".text_container_all").append(attachment_text);
        $("#load_more_text_all .video_spinner").attr("style", "display:none");
      }else{
        $(".text_container").append(attachment_text);
        $("#load_more_text .video_spinner").attr("style", "display:none");
      }
    }
  });
 }
window.addEventListener('load', function() {
  $('.comment-wrapper').each(function() {
      var scrollHeight = this.getElementsByClassName('content_show_hide')[0].scrollHeight;
      var clientHeight = this.getElementsByClassName('content_show_hide')[0].clientHeight;
      var thisElem = this;
      if( scrollHeight > clientHeight ) {
         $(this).children('.read-more').show();
      } else {
         $(thisElem).find('.read-more, .read-less').hide();
      }
  });
});
$(document.body).on('click', '.read-more', function(){
  $(this).parent().find('.image_content').removeClass("content_show_hide");
  $(this).parent().find('.read-more, .read-less').toggle();
});
$(document.body).on('click', '.read-less', function(){
  $(this).parent().find('.image_content').addClass("content_show_hide");
  $(this).parent().find('.read-more, .read-less').toggle();
});
function get_chapter_search_details(){
    var tagName = $("#global_search_module").val();
    var active_tab_type = $("#active_li li.active").attr('id');
    $.ajax({
      url: API_CONTENT_URL + '/global_search/?tag_name='+tagName,
      type: 'GET',
      dataType: 'json',
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      success:function(data){
        $('.global_search_module_content').empty();
        var tab4_active = (active_tab_type == "tab4") ? "active" : "";
        var attachment_all = $('<div class="tab_content '+tab4_active+'" data-tab="tab4"></div>');
        var attachment_video = ``;
        var attachment_video_ind = ``;
        var attachment_audio = `<h5>Audio (${data.audio_attachment.length})</h5><div class="row">`;
        var attachment_audio_ind = `<h5>Audio (${data.audio_attachment.length})</h5><div class="row">`;
        var attachment_text = `<h5>Text (${data.text_attachment.length})</h5><div class="row">`;
        var attachment_text_ind = `<h5>Text (${data.text_attachment.length})</h5><div class="row">`;
        var attachment_slide = "";
        var attachment_slide_ind = "";
        var video_attachemnt_count = 1;
        var audio_attachemnt_count = 1;
        var image_attachemnt_count = 0;
        var base_img_url = `${API_CONTENT_URL}`;
        if(data.all_attachments.length > 0){
            data.all_attachments.forEach(function (element, index) {
              if(element.attachment_type){

                if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
                  base_img_url = '';
                }
                if(element.attachment_type.split('/')[0] === 'video'){
                    if(video_attachemnt_count  % 2 !== 0){
                      attachment_video += `<div class="row video_content">`;
                      attachment_video_ind += `<div class="row video_content_ind">`;
                    }
                      attachment_video += `<div class="col-6 mb-3">
                                            <div class="tab-video relative">
                                              <video id='${element.id}' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>
                                            </div>
                                          </div>`;
                      attachment_video_ind += `<div class="col-6 mb-3">
                                            <div class="tab-video relative">
                                              <video id='${element.id}' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>
                                            </div>
                                          </div>`;
                    if(video_attachemnt_count  % 2 === 0){
                      attachment_video += `</div>`;
                      attachment_video_ind += `</div>`;
                    }
                    video_attachemnt_count++;
                }else if(element.attachment_type.split('/')[0] === 'image'){
                    if(image_attachemnt_count  % 3 == 0){
                      attachment_slide += `<div class="row slide_content">`;
                      attachment_slide_ind += `<div class="row slide_content_ind">`;
                    }
                    attachment_slide += `<div class="col-4 mb-3">
                                          <div class="tab-video relative">
                                            <img class="w-100"src="${base_img_url}${element.attachment}" alt="${element.attachment_name}">
                                          </div>
                                        </div>`;
                    attachment_slide_ind += `<div class="col-4 mb-3">
                                            <div class="tab-video relative">
                                              <img class="w-100"src="${base_img_url}${element.attachment}" alt="${element.attachment_name}">
                                            </div>
                                          </div>`;
                    if(image_attachemnt_count  % 3 == 2){
                      attachment_slide += `</div>`;
                      attachment_slide_ind += `</div>`;
                    }
                    image_attachemnt_count++;
                }else if(element.attachment_type.split('/')[0] === 'audio'){
                      attachment_audio += `<div class="col-12 mb-3 audio_content">
                                            <div class="tab-audio relative">
                                              <audio controls>
                                                <source src="${base_img_url}${element.attachment}" type="audio/mpeg">
                                                  Your browser does not support the audio element. 
                                              </audio>
                                            </div>
                                          </div>`;
                      
                      attachment_audio_ind += `<div class="col-12 mb-3 audio_content_ind">
                                            <div class="tab-audio relative">
                                              <audio controls>
                                                <source src="${base_img_url}${element.attachment}" type="audio/mpeg">
                                                  Your browser does not support the audio element. 
                                              </audio>
                                            </div>
                                          </div>`;                                          
                   
                }
              }else if(element.content){
                attachment_text +=`<div class="col-12 mb-3 content_text"><div class="tab-slide relative mb-3 image_content"> 
                                  ${element.content}
                                </div></div>`;
                attachment_text_ind +=`<div class="col-12 mb-3 content_text_ind"><div class="tab-slide relative mb-3 image_content"> 
                                  ${element.content}
                                </div></div>`;
              }
            });

            if (attachment_slide.substr(-12) != '</div></div>') {
              attachment_slide += '</div>';
              attachment_slide_ind += '</div>';
            }
            if (attachment_video.substr(-12) != '</div></div>') {
              attachment_video += '</div>';
              attachment_video_ind += '</div>';
            }
            attachment_audio +=`</div><div class="show-more_audio_content">Show more >></div>`;
            attachment_audio_ind +=`</div><div class="show-more_audio_content_ind">Show more >></div>`;
            attachment_text +=`</div><div class="show-more_content_text">Show more >></div>`;
            attachment_text_ind +=`</div><div class="show-more_content_text_ind">Show more >></div>`;
            attachment_slide +=`<div class="show-more_slide_content">Show more >></div>`;
            attachment_slide_ind +=`<div class="show-more_slide_content_ind">Show more >></div>`;
            attachment_video +=`<div class="show-more_video_content">Show more >></div>`;
            attachment_video_ind +=`<div class="show-more_video_content_ind">Show more >></div>`;
            attachment_slide_count = `<h5>Slides (${image_attachemnt_count-1})</h5>`;
            attachment_video_count = `<h5>Videos (${video_attachemnt_count-1})</h5>`;
            attachment_all.append(attachment_text);
            attachment_all.append(attachment_video_count);
            attachment_all.append(attachment_video);
            attachment_all.append(attachment_audio);
            attachment_all.append(attachment_slide_count);
            attachment_all.append(attachment_slide);

            var tab5_active = (active_tab_type == "tab5") ? "active" : "";
            var attachment_videos = $('<div class="tab_content '+tab5_active+'" data-tab="tab5"></div>');
            attachment_videos.append(attachment_video_count);
            attachment_videos.append(attachment_video_ind);

            var tab6_active = (active_tab_type == "tab6") ? "active" : "";
            var attachment_slides = $('<div class="tab_content '+tab6_active+'" data-tab="tab6"></div>');
            attachment_slides.append(attachment_slide_count);
            attachment_slides.append(attachment_slide_ind);

            var tab7_active = (active_tab_type == "tab7") ? "active" : "";
            var attachment_audios = $('<div class="tab_content '+tab7_active+'" data-tab="tab7"></div>');
            attachment_audios.append(attachment_audio_ind);

            var tab8_active = (active_tab_type == "tab8") ? "active" : "";
            var attachment_texts = $('<div class="tab_content '+tab8_active+'" data-tab="tab8"></div>');
            attachment_texts.append(attachment_text_ind);

            $(".global_search_module_content").append(attachment_all);
            $(".global_search_module_content").append(attachment_videos);
            $(".global_search_module_content").append(attachment_slides);
            $(".global_search_module_content").append(attachment_audios);
            $(".global_search_module_content").append(attachment_texts);

            if ($('.content_text').length > 3) {
              $('.content_text:gt(2)').hide();
              $('.show-more_content_text').show();
            }
            if ($('.content_text_ind').length > 3) {
              $('.content_text_ind:gt(2)').hide();
              $('.show-more_content_text_ind').show();
            }

            if ($('.audio_content').length > 2) {
              $('.audio_content:gt(1)').hide();
              $('.show-more_audio_content').show();
            }
            if ($('.audio_content_ind').length > 2) {
              $('.audio_content_ind:gt(1)').hide();
              $('.show-more_audio_content_ind').show();
            }

            if ($('.slide_content').length > 2) {
              $('.slide_content:gt(1)').hide();
              $('.show-more_slide_content').show();
            }
            if ($('.slide_content_ind').length > 2) {
              $('.slide_content_ind:gt(1)').hide();
              $('.show-more_slide_content_ind').show();
            }

            if ($('.video_content').length > 2) {
              $('.video_content:gt(1)').hide();
              $('.show-more_video_content').show();
            }
            if ($('.video_content_ind').length > 2) {
              $('.video_content_ind:gt(1)').hide();
              $('.show-more_video_content_ind').show();
            }

            $('.show-more_content_text').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.content_text:gt(2)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });

            $('.show-more_content_text_ind').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.content_text_ind:gt(2)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });

            $('.show-more_audio_content').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.audio_content:gt(1)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });

            $('.show-more_audio_content_ind').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.audio_content_ind:gt(1)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });

            $('.show-more_slide_content').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.slide_content:gt(1)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });

            $('.show-more_slide_content_ind').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.slide_content_ind:gt(1)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });

            $('.show-more_video_content').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.video_content:gt(1)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });

            $('.show-more_video_content_ind').on('click', function() {
              //toggle elements with class .ty-compact-list that their index is bigger than 2
              $('.video_content_ind:gt(1)').toggle();
              //change text of show more element just for demonstration purposes to this demo
              $(this).text() === 'Show more >>' ? $(this).text('<< Show less') : $(this).text('Show more >>');
            });            
        }
        
      }
    });
}
function get_chapter_breadcrumbs(){
    let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
    let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
    $.ajax({
      url: API_CONTENT_URL + '/breadcrumbs/'+chapter_id+'/'+chapter_topic_id,
      type: 'GET',
      dataType: 'json',
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      success:function(data){
        var breadcrumbs_data = data.breadcrumbs_order;
        //document.getElementById("course_id_prefix").innerHTML = data.course_id_prefix;
        var brd_crumbs = `<li class="breadcrumb-item"><a href="chapters/chapterslist" data-flinkto="chapterslist" data-chapter_id="${data.chapter_id}">${data.course_name}</a></li>`;
        if(breadcrumbs_data.length > 0){
            breadcrumbs_data.forEach(function (elements, index) {
              brd_crumbs += `<li class="breadcrumb-item" ><a href="chapters/chapterlistlevel" data-flinkto="chapterlistlevel" data-chapter_id="${elements.course_id}" data-chapter_topic_id="${elements.module_id}">${elements.module_name}</a></li>`;
              if(index == breadcrumbs_data.length - 1){
                  document.getElementById("course_header_module").innerHTML = elements.module_name;
              }
            });
        }
        document.getElementById("module_breadcrumbs").innerHTML = brd_crumbs;
      }
    });
}
function get_content_details_case_module(){
    let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
    let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
    $.ajax({
      url: API_CONTENT_URL + '/module/'+chapter_topic_id,
      type: 'get',
      dataType: 'json',
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      success:function(response){
        var module_content = '';
        if(response.module_content.length > 0){
          module_content = response.module_content[0].content;
          module_content_id = response.module_content[0].id;
          document.getElementById("saveTopics").setAttribute("data-module_content_id", module_content_id);
        }
        //tinymce.activeEditor.setContent(module_content);
        CKEDITOR.instances["editor1"].setData(module_content);
      }
    });
}
function get_module_details_chapter_module(){
  $("#role-loader").css("display", "block");
  $("#rolebox").css("display", "none");
    let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
    let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
    $.ajax({
      url: API_CONTENT_URL + '/module/'+chapter_topic_id,
      type: 'get',
      dataType: 'json',
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
      success:function(response){
        var module_content = response.module_content;
        var module_attachments = response.module_attachments;
        var module_tags = response.module_tags;
        var module_content_html = "";
        var module_attachments_html = "";
        var module_tags_html = "";
        if(module_content.length > 0){
            module_content_html +=`<li class="has-children is-open"><ul class="acnav__list acnav__list--level2 wbg br-10"><li class="has-children mb-3">
                                <div class="acnav__label acnav__label--level2">
                                  <div class="accordionlist">
                                    <div class="row">
                                      <div class="col-md-12 acc-text" style="height:100%;">
                                        ${module_content[0].content}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li></ul>`;
        }
        if(module_attachments.length > 0){
          var base_img_url = `${API_CONTENT_URL}`;
            module_attachments.forEach(function (element, index) {
                var file_type = element.attachment_type.split('/')[0];
                
                if(element.attachment != null && element.attachment.substring(0, 7) != "/media/"){
                  base_img_url = '';
                }
                if(file_type === 'image' || file_type === 'video' || file_type === 'audio' || file_type === 'application'){
                    module_attachments_html += `<li class="has-children is-open">
                                    <ul class="acnav__list acnav__list--level2 wbg br-10">
                                      <li class="has-children">
                                        <div class="acnav__label acnav__label--level2">
                                          <div class="accordionlist">
                                            <div class="row">
                                              <div class="col-md-12 acc-text img-wrap" id="element${element.id}">
                                                <span class="attachment_delete" data-attachment_id="${element.id}" onclick="delete_attachment_chap_mod('${element.id}')"></span>`;
                    if(element.attachment_type.split('/')[0] === 'image'){
                          module_attachments_html +=`<img class="w-100"src="${base_img_url}${element.attachment}" alt="${element.attachment_name}">`;
                    }else if(element.attachment_type.split('/')[0] === 'video'){
                        module_attachments_html +=`<video id='video' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${base_img_url}${element.attachment}#t=0.5" type='video/mp4' /><p>Your user agent does not support the HTML5 Video element.</p></video>`;
                    }else if(element.attachment_type.split('/')[0] === 'audio'){
                        module_attachments_html +=`<audio controls><source src="${base_img_url}${element.attachment}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
                    }else if(element.attachment_type.split('/')[0] === 'application'){
                      var mathcount = Math.floor(Math.random() * 1000);
                       module_attachments_html +=`<object data="${base_img_url}${element.attachment}" type="${element.attachment_type}"><iframe id="${element.id}" src='https://docs.google.com/gview?url=${base_img_url}${element.attachment}&embedded=true&ignore=${mathcount}' width='100%' height='500px' frameborder='1'></iframe></object><p>If this browser does not support file. Please download the File to view it: <a href="#" onclick='window.open("${base_img_url}${element.attachment}");return false;'>Download File</a>.</p>`;
                       let embed_pdfs = {};
                         embed_pdfs['element'+element.id] = 'created';

                        $(document).find('#element'+element.id+' iframe').load(function(){
                                embed_pdfs[$(this).parents('element'+element.id).attr('id')] = 'loaded';
                                $(this).siblings('.loader').remove();
                                console.log($(this).parents('element'+element.id).attr('id') + " loaded");
                        });

                        let embed_pdf_check = setInterval(function() {
                              let remaining_embeds = 0;
                              $.each(embed_pdfs, function(key, value) {
                                  try {
                                      if ($($('#' + key)).find('iframe').contents().find("body").contents().length == 0) {
                                          remaining_embeds++;
                                          console.log(key + " resetting");
                                          $($('#' + key)).find('iframe').attr('src', src='https://docs.google.com/viewer?url=' + base_img_url+element.attachment+ '&embedded=true');
                                      }
                                  }
                                  catch(err) {
                                      console.log(key + " reloading");
                                  }
                              });
                          
                              if (!remaining_embeds) {
                                  clearInterval(embed_pdf_check);
                              }
                          }, 1000);
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
        if(module_tags.length > 0){
            module_tags_html +=`<ul class="acnav__list acnav__list--level2 wbg br-10">
                              <li class="has-children">
                                <div class="acnav__label acnav__label--level2">
                                  <div class="accordionlist">
                                    <div class="row">
                                      <div class="col-md-12 acc-text">
                                      </div>
                                      <div class="col-md-12 p-3 mtag">
                                        <div class="tag__container">
                                          <input type="text" class="tag__input" placeholder="+ Add Tag">
                                          <ul class="tag__List">`;
                                          module_tags.forEach(function (element, index) {
                                            module_tags_html +=`<li>${element.tag_name}</li>`;
                                          });
                module_tags_html +=`</ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>`;
        }

        $("#chapter_module_content").empty();
        $("#chapter_module_content").append(module_content_html);
        $("#chapter_module_content").append(module_attachments_html);
setTimeout(function() {
      $("#role-loader").css("display", "none");
      $("#rolebox").css("display", "block");
    }, 1000);
        //document.getElementById("course_module_content").innerHTML = module_content_html+module_attachments_html;

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
}

$(".show-more").on("click", function() {
  var $this = $(this); 
  var $content = $this.prev("ul.content");
  var linkText = $this.text().toUpperCase();   
  if(linkText === "MORE >>"){
      linkText = "<< Less";
      $content.switchClass("hideContent", "showContent", 400);
      $this.switchClass("showmore", "showless", 1);
  } else {
      linkText = "More >>";
      $content.switchClass("showContent", "hideContent", 400);
      $this.switchClass("showless", "showmore", 1);
  };

  $this.text(linkText);
});  
$('ul.tab-s li').click(function(){
    var $this = $(this);
    var $theTab = $(this).attr('id');
    if($this.hasClass('active')){
      // do nothing
    } else{
      $this.closest('.tabs_wrapper').find('ul.tab-s li, .tabs_container .tab_content').removeClass('active');
      $('.tabs_container .tab_content[data-tab="'+$theTab+'"], ul.tab-s li[id="'+$theTab+'"]').addClass('active');
    }
    
  });
  
/*******************multiple tag list************************/
document.addEventListener("keyup", function(e){
    if (e.keyCode === 13 && e.target.classList.contains("tag__inputs_chap_level")) {
      var errorMsg = "";
    const currentTag = e.target.value;
    if(currentTag.length > 256 || currentTag.length < 3){
      
      $(".tag__inputs_chap_level").next("span").remove();
      if(currentTag.length > 256){
          errorMsg = "Maximum 256 characters allowed";
      }else{console.log(3);
          errorMsg = "Minimum 3 characters allowed";
      }
      $(".tag__inputs_chap_level").after(`<span class='field-error'>${errorMsg}</span>`);
      return;
    }else{
      $(".tag__inputs_chap_level").next("span.field-error").remove();
    }
    if(currentTag){
      const hiddenInput = e.target.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
      const hiddenInputOldValue = hiddenInput.value;
      
      const existingTags = getExistingTagAsArray(hiddenInputOldValue);
      const isTagExistAlready = checkIfTagExistAlready(existingTags, currentTag);
      
      if(isTagExistAlready){ 
        errorMsg = "Tag Name already Exist";
        $(".tag__inputs_chap_level").after(`<span class='field-error'>${errorMsg}</span>`);
        return; 
      }else{
        $(".tag__inputs_chap_level").next("span.field-error").remove();
      }
      if(hiddenInputOldValue.length > 0){
        var tag_array_name = hiddenInputOldValue.split(',');
        console.log(tag_array_name);
        if(tag_array_name.length > 63){ 
          errorMsg = "Only 64 tags allowed";
          $(".tag__inputs_chap_level").after(`<span class='field-error'>${errorMsg}</span>`);
          return; 
        }else{
          $(".tag__inputs_chap_level").next("span.field-error").remove();
        }
      }
      
      if(hiddenInputOldValue){
        hiddenInput.value = hiddenInputOldValue + "," + currentTag;
      }else{
        hiddenInput.value = currentTag;       
      }
      
      let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
      let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
      var tag_data = {
          "name": currentTag,
          "chapter_topic_id": chapter_topic_id,
          "chapter_id": chapter_id
      }
      $.ajax({
        url: API_CONTENT_URL + '/chapter_topic_tags/?chapter_id='+chapter_id+'&chapter_topic_id='+chapter_topic_id,
        type: 'POST',
        data: JSON.stringify(tag_data),
        headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
        success:function(response){
          const newTag = ` <li>${currentTag}<span class="tag__removes tag__removes_chap_level" data-tag="${currentTag}" data-tagid="${response.id}">×</span></li>`;
          e.target.parentElement.nextElementSibling.nextElementSibling.insertAdjacentHTML("beforeend", newTag);
          e.target.value = "";
          var sum = 0;
          $('#tag__List_append li').each(function() {
             sum += $(this).height();
          });
          if(sum > 80){
            $(".show-more").css('display','block');
          }else{
            $(".show-more").css('display','none');
          }
        }
      });
    }
    }
});
function addTagBtnchapterModule(e){
  
      var errorMsg = "";
    const currentTag = e.parentElement.parentElement.children[0].children[0].value;
    if(currentTag.length > 256 || currentTag.length < 3){
      
      $(".tag__inputs_chap_level").next("span").remove();
      if(currentTag.length > 256){
          errorMsg = "Maximum 256 characters allowed";
      }else{console.log(3);
          errorMsg = "Minimum 3 characters allowed";
      }
      $(".tag__inputs_chap_level").after(`<span class='field-error'>${errorMsg}</span>`);
      return;
    }else{
      $(".tag__inputs_chap_level").next("span.field-error").remove();
    }
    if(currentTag){
      const hiddenInput = e.parentElement.nextElementSibling.nextElementSibling.nextElementSibling;
      const hiddenInputOldValue = hiddenInput.value;
      
      const existingTags = getExistingTagAsArray(hiddenInputOldValue);
      const isTagExistAlready = checkIfTagExistAlready(existingTags, currentTag);
      
      if(isTagExistAlready){ 
        errorMsg = "Tag Name already Exist";
        $(".tag__inputs_chap_level").after(`<span class='field-error'>${errorMsg}</span>`);
        return; 
      }else{
        $(".tag__inputs_chap_level").next("span.field-error").remove();
      }
      if(hiddenInputOldValue.length > 0){
        var tag_array_name = hiddenInputOldValue.split(',');
        console.log(tag_array_name);
        if(tag_array_name.length > 63){ 
          errorMsg = "Only 64 tags allowed";
          $(".tag__inputs_chap_level").after(`<span class='field-error'>${errorMsg}</span>`);
          return; 
        }else{
          $(".tag__inputs_chap_level").next("span.field-error").remove();
        }
      }
      
      if(hiddenInputOldValue){
        hiddenInput.value = hiddenInputOldValue + "," + currentTag;
      }else{
        hiddenInput.value = currentTag;       
      }
      
      let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
      let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
      var tag_data = {
          "name": currentTag,
          "chapter_topic_id": chapter_topic_id,
          "chapter_id": chapter_id
      }
      $.ajax({
        url: API_CONTENT_URL + '/chapter_topic_tags/?chapter_id='+chapter_id+'&chapter_topic_id='+chapter_topic_id,
        type: 'POST',
        data: JSON.stringify(tag_data),
        headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
        success:function(response){
          const newTag = ` <li>${currentTag}<span class="tag__removes tag__removes_chap_level" data-tag="${currentTag}" data-tagid="${response.id}">×</span></li>`;
          e.parentElement.nextElementSibling.insertAdjacentHTML("beforeend", newTag);
          e.parentElement.parentElement.children[0].children[0].value = "";
          var sum = 0;
          $('#tag__List_append li').each(function() {
             sum += $(this).height();
          });
          if(sum > 80){
            $(".show-more").css('display','block');
          }else{
            $(".show-more").css('display','none');
          }
        }
      });
    }
}
document.addEventListener("click", function(e){
    if (e.target.classList.contains("tag__removes_chap_level")) {
    const currentTag = e.target.dataset.tag;
    const hiddenInput = e.target.parentElement.parentElement.nextElementSibling.nextElementSibling;  
    const hiddenInputOldValue = hiddenInput.value;
    
    const existingTags = getExistingTagAsArray(hiddenInputOldValue);
    const isTagExistAlready = checkIfTagExistAlready(existingTags, currentTag);
    
    if(isTagExistAlready){
      const updatedInputValueAsArray = existingTags.filter((tag) => {
        return tag != currentTag 
      });
      const updatedInputValue = updatedInputValueAsArray.join(",");
      
      hiddenInput.value = updatedInputValue;
      var tag_id = e.target.dataset.tagid;
      if(tag_id !== ''){
        $.ajax({
          url: API_CONTENT_URL + '/chapter_topic_tags/'+tag_id+'/',
          type: 'DELETE',
          headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
          success:function(response){
            e.target.parentElement.remove();
            var sum = 0;
            $('#tag__List_append li').each(function() {
               sum += $(this).height();
            });
            if(sum > 80){
              $(".show-more").css('display','block');
            }else{
              $(".show-more").css('display','none');
            }
          }
        });
      }
    }
  }
});

const getExistingTagAsArray = (allTags) => {
  let existingTagsAsArray = [];
  
  if(allTags.includes(",")){
    existingTagsAsArray = allTags.split(",");
  }
  
  return existingTagsAsArray;
}

const checkIfTagExistAlready = (allTags, currentTag) => {
  if(allTags.includes(currentTag)){ 
    return true;
  }else{
    return false;
  }
}

  /*$("#saveTopics").on("click", function() {
       let cid = document.getElementById("course_module_id").getAttribute("data-cid");
       let module_id = document.getElementById("course_module_id").getAttribute("data-module_id");
      var formData = new FormData();
      var todayDate = new Date().toISOString().slice(0, 10);
      $.each($('input[name^="courseFile_module"]')[0].files, function(i, file) {
        formData.append("attachment", file);
        formData.append("attachment_type", file.type);
        formData.append("attachment_name", file.name);
        formData.append("created_date", todayDate);
        formData.append("status", 0);
        formData.append("module_id", module_id);
        formData.append("course_id", cid);
        $.ajax({
          url: API_CONTENT_URL + "/case_module_attachments/",
          method: "POST",
          type: 'POST', // For jQuery < 1.9
          cache: false,
          contentType: false,
          processData: false,
          data: formData,
          headers: {
            "Authorization" : "Bearer " + getUserInfo().access_token
          },
          success: function(response){
            $('#addCourses').modal('hide');
            toastr.success("New course information was successfully saved.");
            console.log(response);
          },
          error: function(error) {
            toastr.error("Response Error: " + error.message);
            console.log(error);
          }
        });
      });
      //for (var pair of formData.entries()) {
       //   console.log(pair[0]+ ', ' + pair[1]); 
     // }
    });*/
/*
    var trackPath = false;
      var tinyContentData;
      tinymce.remove("#tiny");
      tinyMCE.init({
        selector: "#tiny",
        height: 600,
        width: "100%",
        menubar: false,
        branding: false,
        deprecation_warnings: false,
        image_advtab: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount imagetools'
        ],
        toolbar: 'undo redo | link image media | formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent charmap | removeformat | code | trackpath',
        imagetools_cors_hosts: ['localhost', 'eicit.sa'],
        imagetools_proxy: 'proxy.php',
        extended_valid_elements : "video[controls|preload|width|height|data-setup],source[src|type]",
        image_list: [
          {title: 'Zaigo', value: 'https://www.zaigoinfotech.com/wp-content/uploads/2020/11/logo.png'},
          {title: 'Exper', value: 'https://elearning.zaigoinfotech.com/assets/images/logo.png'}
        ],
        audio_template_callback: function(data) {
          return '<audio controls>' + '\n<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + 
            ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</audio>';
        },        
        setup:function(ed) {
          ed.on('init', function (e) {
            //loadextData(ed);
            get_content_details_case_module();
          });
          ed.ui.registry.addButton('trackpath', {
            icon: 'insert-time',
            tooltip: 'Toggle Track',
            onAction: function (_) {
              // ed.insertContent(toTimeHtml(new Date()));
              console.log("Before Button : " + window.trackPath);
              if(window.trackPath) {
                window.trackPath = false;
                $(".trackBGColor").hide().prev("div").removeClass("col-8").addClass("col-12");
              } else{
                window.trackPath = true;
                $(".trackBGColor").show().prev("div").removeClass("col-12").addClass("col-8");
              }
              console.log("After Button : " + window.trackPath);
            },
            onSetup: function (buttonApi) {
              var editorEventCallback = function (eventApi) {
                // buttonApi.setDisabled(window.trackPath === false);
              };
              ed.on('NodeChange', editorEventCallback);
              // onSetup should always return the unbind handlers 
              return function (buttonApi) {
                ed.off('NodeChange', editorEventCallback);
              };
            },
          });
        }
      });*/

      /*function loadextData(ed){
        $(".trackSidebar").html("");
        var content = '';
        $.getJSON("../assets/pages/courses/data.js?t=" + Math.floor(Date.now() / 1000), function(result){
          tinyContentData = result;
          $.each(result, function(i, field){
            $(".trackSidebar").append(field.nav);
            content = field.content;
          });
          //load saved content 
          ed.setContent(content);
          //trackItems
          var selContent;
          $(".trackItems").on("click", function() {
            $(".trackItems").find("div").removeClass("active");
            var id = $(this).data("id");
            let obj = tinyContentData.find((o, i) => {
              if(o.id == id) {
                selContent = o.content;
                return true;
              }
            });
            if(selContent) {
              ed.setContent(selContent);
              $(this).find("div").addClass("active");
            }
          });
        });
      }*/
      
      $( document ).ready(function() {
        $("#saveTopics").on("click", function() {
          let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
          let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
          //var newData = tinymce.activeEditor.getContent();
          var newData = CKEDITOR.instances["editor1"].getData();
          var module_content_id = document.getElementById("saveTopics").getAttribute("data-module_content_id");
          var method_type = "POST";
          var URL  = API_CONTENT_URL + '/chapter_topic_contents/';
          if(newData !== ''){
            var content_data = {
              "chapter_id": chapter_id,
              "chapter_topic_id": chapter_topic_id,
              "content": newData,
              "revision_label":""
            }
            $.ajax({
              url: URL,
              type: method_type,
              data: JSON.stringify(content_data),
              headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
              success:function(response){
                toastr.success("Content has been saved.");
              },
                error: function(error){
                  toastr.error("Response Error: " + error.message);
                  console.log(error);
                }
            });
          }else{
            //toastr.error("Please Write a Content.");

            $.ajax({
              url: API_CONTENT_URL+'/chapter/delete/content/'+chapter_topic_id,
              type: "DELETE",
              headers: {"Authorization": "Bearer " + getUserInfo().access_token},
              success:function(response){
                toastr.success("Empty Content has been saved.");
              },
              error: function(error){
                toastr.error("Response Error: " + error.message);
                console.log(error);
              }
            });
          }
          //loadextData(tinymce.activeEditor);
        });

        $("#convertToAudio").on("click", function() {
          let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
          let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
          //var newData = tinymce.activeEditor.getContent();
          var newData = CKEDITOR.instances["editor1"].getData();
          var newTextData = newData.replace(/<[^>]+>/g, '');
          var module_content_id = document.getElementById("saveTopics").getAttribute("data-module_content_id");
          var method_type = "POST";
          var URL  = API_CONTENT_URL + '/text/audio/';
          if(newData !== ''){
            var content_data = {
              "chapter_id": chapter_id,
              "chapter_topic_id": chapter_topic_id,
              "text": newTextData,
              "speaker_id":"3"
            }
            $.ajax({
              url: URL,
              type: method_type,
              data: JSON.stringify(content_data),
              headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
              success:function(response){
                toastr.success("Convertion process is initiated.");
              },
              error: function(error){
                toastr.error("Response Error: " + error.message);
                console.log(error);
              }
            });
          }else{
            toastr.error("Please Write a Content.");
          }
          //loadextData(tinymce.activeEditor);
        });
      });
      
function save_attachment_url_chap_mod(){
  let chapter_id = document.getElementById("chapter_details").getAttribute("data-chapter_id");
  let chapter_topic_id = document.getElementById("chapter_details").getAttribute("data-chapter_topic_id");
  var attachment_url = $("#attachment_url_chap_mod").val();
  $("#attachment_url_chap_mod").removeClass("is-invalid");
  $("#attachment_url_chap_mod").next().remove();
  attachment_url_valid = 0;
  if(attachment_url == ""){
    attachment_url_valid++;
    $("#attachment_url_chap_mod").addClass("is-invalid");
    $("#attachment_url_chap_mod").after(`<em for="attachment_url_chap_mod" class="error help-block">Please Enter Media Url.</em>`);
  }else if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(attachment_url) == false){
    attachment_url_valid++;
    $("#attachment_url_chap_mod").addClass("is-invalid");
    $("#attachment_url_chap_mod").after(`<em for="attachment_url_chap_mod" class="error help-block">Please Enter Valid Media Url.</em>`);
  }else {
    var formData = new FormData();
    var todayDate = new Date().toISOString().slice(0, 10);
    formData.append("url_attachment", attachment_url);
    formData.append("attachment_type", "url");
    formData.append("created_date", todayDate);
    formData.append("status", 1);
    formData.append("chapter_topic_id", chapter_topic_id);
    formData.append("chapter_id", chapter_id);
    $.ajax({

      url: API_CONTENT_URL + "/chapter_topic_attachments/",
      method: "POST",
      type: 'POST', // For jQuery < 1.9
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      headers: { "Authorization": "Bearer " + getUserInfo().access_token },
      success:function(response){
        $("#attachment_url_chap_mod").val("");
        //$('#addCourses').modal('hide');
        toastr.success("Media URL saved successfully.");
        console.log(response);
      },
      error:function(error){
        console.log(error);
      }
    });
  }
}
function delete_attachment_chap_mod(attachment_id){
  $.ajax({
    url: API_CONTENT_URL + '/chapter_topic_attachments/'+attachment_id+'/',
    type: "DELETE",
    dataType: 'json',
    headers: {
      "Authorization": "Bearer " + getUserInfo().access_token,
      "Content-Type": "application/json"
    },
    success:function(response){
      toastr.success("Attachment Deleted Successfully");
      get_module_details_chapter_module();
    },
    error: function(error){
      //toastr.error("Response Error: " + error.message);
      console.log(error);
    }
  });
}

    $("#chapter_module_content").on("click", 'a', function(e) {
        e.preventDefault();
        if(e.target.hasAttribute("target") && e.target.getAttribute("target") == "_blank"){
          window.open(e.target.getAttribute('href'), "_blank"); 
        }
        if(e.target.hasAttribute("target") && e.target.getAttribute("target") == "_self"){
          window.open(e.target.getAttribute('href'), "_self"); 
        }
    });