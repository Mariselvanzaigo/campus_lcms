
CKEDITOR.plugins.add( 'embedvideourl', {
    icons: 'embedvideourl',
    init: function( editor ) {
        editor.addCommand( 'insertlink', new CKEDITOR.dialogCommand( 'insertlink' ) );
        editor.ui.addButton( 'SimpleLink', {
            label: 'Insert Video Embed',
            command: 'insertlink',
            icon: this.path + 'icons/embedvideourl.png'
        });
        CKEDITOR.dialog.add( 'insertlink', function( editor )
    {
        return {
            title : 'Insert Video Embed',
            minWidth : 400,
            minHeight : 100,
            contents :
            [
                {
                    id : 'tab-basic',
                    label : 'Settings',
                    elements :
                    [
                        {
                            type : 'html',
                            html : 'Please add video link to embed.'      
                        },                          
                        {
                            type : 'text',
                            id : 'url',
                            label : 'URL',
                            //validate: CKEDITOR.dialog.validate.notEmpty('Enter valid value.'),
                            validate: function () {
                                var ember_url = this.getValue();
                                if(ember_url == ""){
                                    return "Enter Urls with filepath and filename";
                                }
                                console.log(this.getValue());
                                var url_embeded = this.getValue();
                                var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                                var isValidUrl = !!pattern.test(url_embeded);
                                console.log(isValidUrl);
                                if(!isValidUrl){
                                    return "Not a valid Url";
                                }
                                var video_extension = url_embeded.split('.').pop();
                                console.log(video_extension);
                                const video_extensions = new Array("mp4", "m4v", "m4p", "webm", "mpeg", "avi");
                                const containsString = video_extensions.some(element => {
                                  return element.toLowerCase() === video_extension.toLowerCase();
                                });
                                if(!containsString){
                                    return "Not a valid Url";
                                }
                            },
                            required : true,
                            commit : function( data )
                            {
                                data.url = this.getValue();
                            }
                        }
                    ]
                }
            ],

            onOk : function()
            {
                var dialog = this,
                    data = {},
                    link = editor.document.createElement( 'input' );
                this.commitContent( data );
                console.log(data);
                console.log(data.url);
                var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                var isValidUrl = !!pattern.test(data.url);
                console.log(isValidUrl);
                if(isValidUrl){
                    var video_extension = data.url.split('.').pop();
                    console.log(video_extension);
                    const video_extensions = new Array("mp4", "m4v", "m4p", "webm", "mpeg", "avi");
                    const containsString = video_extensions.some(element => {
                      return element.toLowerCase() === video_extension.toLowerCase();
                    });
                    if(containsString){
                        var now = new Date();
                        var div = editor.document.createElement('div');
                        div.setHtml(`<center><video class="player mt-3" id='video${now.toString()}' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${data.url}?q${now.toString()}#t=0.5" type='video/mp4' /></video></center>`);
                        editor.insertElement( div );
                    }else{
                        var now = new Date();
                        var div = editor.document.createElement('div');
                        div.setHtml(`<center><iframe height="400" width="600" src="${data.url}"></iframe></center>`);
                        editor.insertElement( div );
                    }
                }
            }
        };
    });
    }
});