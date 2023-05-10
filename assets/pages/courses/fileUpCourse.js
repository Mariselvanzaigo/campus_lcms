$(document).on('click', '.fileupload', function () {
    var upload_id = this.id;
    var unique_id = this.id+'-queue';
    var dropzoneID = this.id+'-dropzone';
    $.fileup({
        url: `${SITE_URL_PROTOCOL}/assets/pages/courses`,
        inputID: upload_id,
        queueID: unique_id,
        dropzoneID: dropzoneID,
        autostart: true,
        onSelect: function(file) {
            $('#dropzonenew .control-button').show();
        },
        onRemove: function(file, total) {
            if (file === '*' || total === 1) {
                $('#dropzonenew .control-button').hide();
            }
        },
        onSuccess: function(response, file_number, file) {
            console.log(file);
            //$.growl.notice({ title: "Upload success!", message: file.name });
        },
        onError: function(event, file, file_number) {
            //$.growl.error({ message: "Upload error!" });
        },
        onDragEnter: function(event) {
            $(event.target).addClass('over');
        },
        onDragLeave: function(event) {
            $(event.target).removeClass('over');
        },
        onDragEnd: function(event) {
            $(event.target).removeClass('over');
        }
    });
});