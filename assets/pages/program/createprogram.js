
var program_param = getUrlParamquery();
console.log(program_param);
//var org_id = cms_ins_param.org_id;
var program_id = program_param.program_id;
var section_id = program_param.section_id;
var page_from = program_param.page_from;
var ins_id = program_param.ins_id;
var stream_list = function () {
var tmp_stream = null;
$.ajax({
    'async': false,
    url: API_BASE_URL + 'stream/details',
    type: 'get',
    global: false,
    dataType: 'json',
    headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
    success: function (response) {
    tmp_stream = response?.data;
    }
}); 
return tmp_stream;
}();

var course_list = function () {
var tmp_course = null;
$.ajax({
    'async': false,
    url: API_BASE_URL + 'course_type/details',
    type: 'get',
    global: false,
    dataType: 'json',
    headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
    success: function (response) {
    tmp_course = response?.data;
    }
}); 
return tmp_course;
}();
$(document).ready(function(){
    if(program_id){
        $("#academic_container").empty();
        $("#create_program_header").text("Edit Program");
        $("#submit_program").text("Update");
        //display_edit_program(program_data);
        $.ajax({
            url: API_CMS_URL + 'program/details/'+program_id,
            type: "GET",
            headers: {
            "Authorization": "Bearer " + getUserInfo().access_token,
            "Content-Type": "application/json"
            },
            success:function(response){
            console.log(response)
            if(response){
                display_edit_program(response);
            }
            },
            error:function(error){
                if (error.status === 401) {
                    alert("Session Expired, Please login again.");
                    logoutSession();
                  }
                  //toastr.error("Response Error: " + error.message);
                  console.log(error);
            }
        });
    }else{
        stream_list_select(stream_list, "");
        course_list_select(course_list, "");
        $("#academic_container").empty();
        $("#create_program_header").text("Create Program");
        $("#submit_program").text("Submit");
        add_academic_section("");
        // $("#noofacademicyear").val(1);
    }
});
function display_edit_program(program_data){
    console.log(program_data);
    $("#program_name").val(program_data.name);
    $("#organization_id").val(program_data.organization_id);
    $("#institute_id").val(program_data.institute_id);
    console.log(stream_list);
    stream_list_select(stream_list, program_data.stream_id);
    course_list_select(course_list, program_data.course_type_id);
    console.log(program_data.academic_years);
    if(program_data.academic_years.length > 0){
        add_academic_section(program_data.academic_years);
    }

}
function add_academic(){
    add_academic_section();
    var total_academic_box = $(".academic_section_box").length;
    console.log(total_academic_box);
    // $("#noofacademicyear").val(total_academic_box);
}
// function noofacademicyearchange(e){
//     var noofacademicyear = e.value;
//     var total_academic_box = $(".academic_section_box").length;
//     for (let i = 0; i < cars.length; i++) {
//     }

// }
function add_academic_section(academic_data){
    if(academic_data){
        var academic_template = "";
        console.log(academic_year_options);
        $.each( academic_data, function( i, val ) {
            academic_template += `<div class="academic_section_box mt-3">
                                        <div class="academic_box searchbar greybg p-3">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="academic_name_container mt-3">
                                                        <input type="text" class="form-control academic_name_input academic_year_inp_1 d-none" id="academic_year" placeholder="Enter Academic Name" value="${val.academic_name}" onblur="totext(this);" maxlength="256">
                                                        <h4 class="academic_name_element">${val.academic_name}<span class="ms-3 edit_icon" onclick="toinput(this);"><i class="fas fa-edit"></i></span></h4>
                                                    </div>
                                                </div>
                                                <div class="col-md-2">
                                                    <div class="mb-3">
                                                        <label>Select Academic Year</label>
                                                        <div class="dropdown-select bgwhite">
                                                            <select class="sort-select form-control academic_year_list">`;
                                                            academic_template +=`<option value="">Select Academic Year</option>`;
                                                            $.each( academic_year_options, function( aci, acval ) {
                                                                if(acval.year == val.year){
                                                                    academic_template +=`<option value="${acval.year}" selected>${acval.year}</option>`;
                                                                }else{
                                                                    academic_template +=`<option value="${acval.year}">${acval.year}</option>`;
                                                                }
                                                            });
                                                            academic_template +=`</select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-2">
                                                    <div class="mb-3">
                                                        <label>Start Date</label>
                                                        <input class="form-control start_date" type="date" value="${val.start_date}" onclick="this.showPicker()" placeholder="">
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 cc-right">
                                                    <div class="advance-close">
                                                    <span class="close-dot delete_academic" onclick="delete_academic_section(this);"><a><i class="fas fa-trash"></i></a></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="greybg p-4">
                                            <div class="section_container">`;
                                            if(val.batch_details.length > 0){
                                                $.each( val.batch_details, function( bai, baval ) {
                                                    academic_template += `<div class="row section_box">
                                                        <div class="col-md-6">
                                                            <div class="mb-3">
                                                                <label>Section Name</label>
                                                                <input class="form-control section_name" value="${baval.section_name}" type="text" placeholder="Section Name">
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <div class="mb-3">
                                                                <label>No of Student</label>
                                                                <input class="form-control noofstudents" value="${baval.batch_student_count}" type="number" placeholder="No of Student">
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2 cc-right pl-0">
                                                            <div class="advance-close">
                                                            <span class="close-dot" onclick="delete_section(this);"><a><i class="fas fa-times"></i></a></span>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-2 col-md-2"></div>
                                                    </div>`;
                                                });
                                            }
                        academic_template += `</div><p class="mt-3 disp_block">                                        
                                                <h6><a class="orange-text" onclick="addSection(this)"><i class="fas fa-plus"></i> Add Section</a></h6>
                                            </p>
                                        </div>
                                    </div>`;
        });
        $("#academic_container").append(academic_template)
    }else{
        console.log(academic_year_options);
        var academic_template = `<div class="academic_section_box mt-3">
                                    <div class="academic_box searchbar greybg p-3">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="academic_name_container mt-3">
                                                    <input type="text" class="form-control academic_name_input academic_year_inp_1 d-none" id="academic_year" placeholder="Enter Academic Name" value="" onblur="totext(this);" maxlength="256">
                                                    <h4 class="academic_name_element">Academic Name<span class="ms-3 edit_icon" onclick="toinput(this);"><i class="fas fa-edit"></i></span></h4>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="mb-3">
                                                    <label>Select Academic Year</label>
                                                    <div class="dropdown-select bgwhite">
                                                        <select class="sort-select form-control academic_year_list">`;
                                                        academic_template +=`<option value="">Select Academic Year</option>`;
                                                        $.each( academic_year_options, function( aci, acval ) {
                                                            academic_template +=`<option value="${acval.year}">${acval.year}</option>`;
                                                        });
                                                        academic_template +=`</select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="mb-3">
                                                    <label>Start Date</label>
                                                    <input class="form-control start_date" type="date" onclick="this.showPicker()" placeholder="">
                                                </div>
                                            </div>
                                            <div class="col-lg-2 col-md-2 cc-right">
                                                <div class="advance-close">
                                                <span class="close-dot delete_academic" onclick="delete_academic_section(this);"><a><i class="fas fa-trash"></i></a></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="greybg p-4">
                                        <div class="section_container">
                                            <div class="row section_box">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label>Section Name</label>
                                                        <input class="form-control section_name" type="text" placeholder="Section Name">
                                                    </div>
                                                </div>
                                                <div class="col-md-2">
                                                    <div class="mb-3">
                                                        <label>No of Student</label>
                                                        <input class="form-control noofstudents" type="number" placeholder="No of Student">
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2 cc-right pl-0">
                                                    <div class="advance-close">
                                                    <span class="close-dot" onclick="delete_section(this);"><a><i class="fas fa-times"></i></a></span>
                                                    </div>
                                                </div>
                                                <div class="col-lg-2 col-md-2"></div>
                                            </div>
                                        </div>
                                        <p class="mt-3 disp_block">                                        
                                            <h6><a class="orange-text" onclick="addSection(this)"><i class="fas fa-plus"></i> Add Section</a></h6>
                                        </p>
                                    </div>
                                </div>`;
        $("#academic_container").append(academic_template);
    }

}
function addSection(e){
    var academic_section_template = `<div class="row section_box">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label>Section Name</label>
                                                <input class="form-control section_name" type="text" placeholder="Section Name">
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="mb-3">
                                                <label>No of Student</label>
                                                <input class="form-control noofstudents" type="number" placeholder="No of Student">
                                            </div>
                                        </div>
                                        <div class="col-lg-2 col-md-2 cc-right pl-0">
                                            <div class="advance-close">
                                            <span class="close-dot" onclick="delete_section(this);"><a><i class="fas fa-times"></i></a></span>
                                            </div>
                                        </div>
                                        <div class="col-lg-2 col-md-2"></div>
                                    </div>`;
    $(e).closest(".greybg").find(".section_container").append(academic_section_template);
    $(e).closest(".greybg").find(".section_container_error").remove();

}
function delete_section(e){

    var section_box_len = $(e).closest(".section_container").find(".section_box").length;
    console.log(section_box_len);
    if(section_box_len == 1){
        $(e).closest(".section_container").after(`<em for="section_container" class="section_container_error error help-block" style="margin-left:10px;">Add Section</em>`)
    }
    $(e).closest(".section_box").remove();
}
function delete_academic_section(e){
    $(e).closest(".academic_section_box").remove();
    var total_academic_box = $(".academic_section_box").length;
    console.log(total_academic_box);
    $("#noofacademicyear").val(total_academic_box);
}
function stream_list_select(stream_list_data, stream_selected_list){
    $("#stream_list").empty();
    var stream_list = `<option value="">Select Stream</option>`;
    $.each(stream_list_data, function( i, val ) {
      if (stream_selected_list === val.id) {
        stream_list +=`<option value="${val.id}" selected>${val.name}</option>`;
      }else{
        stream_list +=`<option value="${val.id}">${val.name}</option>`;
      }
    });
    $("#stream_list").append(stream_list);
}
function course_list_select(course_list_data, course_selected_list){
    $("#course_list").empty();
    var course_list = `<option value="">Select Course Type</option>`;
    $.each(course_list_data, function( i, val ) {
      if (course_selected_list === val.id) {
        course_list +=`<option value="${val.id}" selected>${val.name}</option>`;
      }else{
        course_list +=`<option value="${val.id}">${val.name}</option>`;
      }
    });
    $("#course_list").append(course_list);
}
function toinput(e){
    $(e).closest(".academic_name_container").find(".academic_name_element").addClass("d-none");
    $(e).closest(".academic_name_container").find(".academic_name_input").removeClass("d-none");
    $(e).closest(".academic_name_container").find(".academic_name_input").focus();
}

function totext(e){
    $(e).closest(".academic_name_container").next().remove();
    $(e).removeClass("is-invalid");
    if(e.value.trim() != ""){
        $(e).closest(".academic_name_container").find(".academic_name_element").html(e.value.trim()+`<span class="ms-3 edit_icon" onclick="toinput(this);"><i class="fas fa-edit"></i></span>`);
        $(e).closest(".academic_name_container").find(".academic_name_element").removeClass("d-none");
        $(e).closest(".academic_name_container").find(".academic_name_input").addClass("d-none");
    }else{
        $(e).addClass("is-invalid");
        $(e).closest(".academic_name_container").after(`<em for="academic_name" class="academic_name_error error help-block" style="margin-left:10px;">Enter Academic Name</em>`);
    }
}
function program_name_blur(){
    $("#program_name").removeClass("is-invalid");
    $("#program_name").closest("div").find(".program_name_error").remove();
    var error = 0;
    if($("#program_name").val().trim() == ""){
        error = 1;
        $("#program_name").addClass("is-invalid");
        $("#program_name").after(`<em for="program_name" class="program_name_error error help-block">Enter Program Name</em>`);
    }
    return error;
}
function stream_change(){
    $("#stream_list").removeClass("is-invalid");
    $("#stream_list").closest("div").find(".stream_list_error").remove();
    var error = 0;
    if($("#stream_list").val() == ""){
        error = 1;
        $("#stream_list").addClass("is-invalid");
        $("#stream_list").after(`<em for="stream_list" class="stream_list_error error help-block">Select Stream</em>`);
    }
    return error;
}
function course_type_change(){
    $("#course_list").removeClass("is-invalid");
    $("#course_list").closest("div").find(".course_list_error").remove();
    var error = 0;
    if($("#course_list").val() == ""){
        error = 1;
        $("#course_list").addClass("is-invalid");
        $("#course_list").after(`<em for="course_type" class="course_list_error error help-block">Select Stream</em>`);
    }
    return error;
}
var validate_program_form_fun = function(){
    var error_count = 0;
    if(program_name_blur()){
        error_count++;
    }
    if(stream_change()){
        error_count++;
    }
    if(course_type_change()){
        error_count++;
    }
    return error_count;
}
$(document).on("change", ".academic_year_list", function(e){

    $(this).removeClass("is-invalid");
    $(this).parent().find(".academic_year_error").remove();
    if($(this).val() == ""){
        $(this).addClass("is-invalid");
        $(this).after(`<em for="academic_year" class="academic_year_error error help-block">Select Academic year</em>`);
    }
});
$(document).on("blur", ".section_name", function(e){

    $(this).removeClass("is-invalid");
    $(this).parent().find(".section_name_error").remove();
    if($(this).val() == ""){
        $(this).addClass("is-invalid");
        $(this).after(`<em for="section_name" class="section_name_error error help-block">Enter Section Name</em>`);
    }
});
$(document).on("change", ".noofstudents", function(e){

    $(this).removeClass("is-invalid");
    $(this).parent().find(".noofstudents_error").remove();
    if($(this).val() == ""){
        $(this).addClass("is-invalid");
        $(this).after(`<em for="noofstudents" class="noofstudents_error error help-block">Enter No of Student</em>`);
    }
});
function submit_program(){

    var current_element = $(this);
    current_element.prop('disabled', true);
    var err_count = validate_program_form_fun();
    console.log(err_count);
    var total_error = 0;
    if(err_count > 0){
    total_error = total_error+err_count;
    }
    var academic_years = [];
    if($(".academic_section_box").length > 0){
        $('.academic_section_box').each(function(index, element) {
            $(element).find(".academic_name_input").removeClass("is-invalid");
            $(element).find(".academic_name_error").remove();

            $(element).find(".academic_year_list").removeClass("is-invalid");
            $(element).find(".academic_year_error").remove();

            $(element).find(".start_date").removeClass("is-invalid");
            $(element).find(".start_date_error").remove();

            // $(element).find(".end_date").removeClass("is-invalid");
            // $(element).find(".end_date_error").remove();

            var academic_name = $(element).find(".academic_name_input").val().trim();
            if(academic_name == ""){
                total_error++;
                $(element).find(".academic_name_input").addClass("is-invalid");
                $(element).find(".academic_name_container").after(`<em for="academic_name" class="academic_name_error error help-block" style="margin-left:10px;">Enter Academic Name</em>`);
            }

            var academic_year = $(element).find(".academic_year_list").val();
            if(academic_year == ""){
                total_error++;
                $(element).find(".academic_year_list").addClass("is-invalid");
                $(element).find(".academic_year_list").after(`<em for="academic_year" class="academic_year_error error help-block">Select Academic year</em>`);
            }

            var start_date = $(element).find(".start_date").val();
            if(start_date == ""){
                total_error++;
                $(element).find(".start_date").addClass("is-invalid");
                $(element).find(".start_date").after(`<em for="start_date" class="start_date_error error help-block">Select Start Date</em>`);
            }
            // var end_date = $(element).find(".end_date").val();
            // if(end_date == ""){
            //     total_error++;
            //     $(element).find(".end_date").addClass("is-invalid");
            //     $(element).find(".end_date").after(`<em for="end_date" class="end_date_error error help-block">Select End Date</em>`);
            // }
            var section_boxlen = $(element).find(".section_box").length;

            $(element).find(".section_container_error").remove();
            if(section_boxlen == 0){
                $(element).find(".section_container").after(`<em for="section_container" class="section_container_error error help-block">Add Section</em>`)
            }
            var batch = [];
            $(element).find(".section_box").each(function(indexs, elements) {
                
                $(elements).find(".section_name").removeClass("is-invalid");
                $(elements).find(".section_name").next().remove();

                $(elements).find(".noofstudents").removeClass("is-invalid");
                $(elements).find(".noofstudents").next().remove();

                var section_name = $(elements).find(".section_name").val();
                if(section_name == ""){
                    total_error++;
                    $(elements).find(".section_name").addClass("is-invalid");
                    $(elements).find(".section_name").after(`<em for="section_name" class="section_name_error error help-block">Enter Section Name</em>`);
                }

                var noofstudents = $(elements).find(".noofstudents").val();
                if(noofstudents == ""){
                    total_error++;
                    $(elements).find(".noofstudents").addClass("is-invalid");
                    $(elements).find(".noofstudents").after(`<em for="noofstudents" class="noofstudents_error error help-block">Enter No of Student</em>`);
                }
                if(section_name != "" && noofstudents != ""){
                    batch.push({"section_name": section_name, "batch_student_count":  noofstudents});
                }
                
            });
            if(academic_name != "" && academic_year != "" && start_date != "" && batch.length > 0){

                var start_date_val = new Date(start_date);
                start_date_val.setDate(start_date_val.getDate() + 330);
                var end_date = start_date_val.toInputFormat();
                academic_years.push({"academic_name": academic_name, "year":academic_year, "start_date": start_date, "end_date": end_date, "batch_details":batch});
            }

        });
    }else{
        toastr.error("Add minimum one Academic for a Program");
        total_error++;
    }
    console.log(academic_years);

    console.log(total_error);
    if(total_error == 0){

        // var formData = new FormData();
        // formData.append("name", $("#program_name").val());
        // formData.append("stream_id", $("#stream_list").val());
        // formData.append("course_type_id", $("#course_list").val());
        // formData.append("academic_years",  JSON.stringify(academic_years));
        // console.log(ins_id);
        if(ins_id){
            var academic_data = ({"name": $("#program_name").val(), 
                                "stream_id": $("#stream_list").val(), 
                                "course_type_id": $("#course_list").val(), 
                                "institute_id" : ins_id,
                                "academic_years": academic_years
                            });
        }else{

            var academic_data = ({"name": $("#program_name").val(), 
                            "stream_id": $("#stream_list").val(), 
                            "course_type_id": $("#course_list").val(), 
                            "academic_years": academic_years
                        });
        }
        var URL = API_CMS_URL + "program_create/";
        var method = "POST";
        var type = "POST";
        if(program_id){
            URL = API_CMS_URL + "program/update/"+program_id+"/";
            method = "PATCH";
            type = "PATCH";
        }
        $.ajax({
        url: URL,
        method: method,
        type: type, // For jQuery < 1.9
        cache: false,
        processData: false,
        data: JSON.stringify(academic_data),
        headers: {
            "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token
        },
        success: function (response) {
                $("#redirect_create_program").attr("data-n-linkto", 'programlist');
            // if(program_id && page_from == "programacademiclist"){
            //     $("#redirect_create_program").attr("data-n-url-acc_id", program_id);
            // }
            // if(program_id && section_id && page_from == "programsectionlist"){
            //     $("#redirect_create_program").attr("data-n-url-batch_id", program_id);
            //     $("#redirect_create_program").attr("data-n-url-acc_yearid", section_id);
            // }
            $("#redirect_create_program").trigger("click");
            current_element.removeAttr("disabled");
            if(method == "POST"){
                toastr.success("Program created successfully.");
            }else{
                toastr.success("Program updated successfully.");
            }
        },
        error: function (error) {
            var errorJson = jQuery.parseJSON(error.responseText);
            console.log(errorJson);
            if(errorJson){
            toastr.error(errorJson);
            }
            current_element.removeAttr("disabled");
        } 
        });
    }else{
        current_element.removeAttr("disabled");
    }

}
Date.prototype.toInputFormat = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
 };