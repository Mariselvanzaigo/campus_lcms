/*
 *   Plugin developed by CTRL+N.
 *
 *   LICENCE: GPL, LGPL, MPL
 *   NON-COMMERCIAL PLUGIN.
 *
 *   Website: https://www.ctrplusn.net/
 *   Facebook: https://www.facebook.com/ctrlplusn.net/
 *
 */
CKEDITOR.dialog.add('videoembedDialog', function (editor) {
    return {
        title: editor.lang.videoembed.title,
        minWidth: 400,
        minHeight: 80,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'html',
                        html: '<p>' + editor.lang.videoembed.onlytxt + '</p>'
                    },
                    {
                        type: 'text',
                        id: 'url_video',
                        label: 'URL (ex: https://www.youtube.com/watch?v=EOIvnRUa3ik)',
                        validate: function () {
                            var url = this.getValue();
                            var embed_url_error = 0;

                            if(url != ""){
                                var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                                var isValidUrl = !!pattern.test(url);
                                if(!isValidUrl){
                                    return editor.lang.videoembed.onlytxt+ " : Not a valid embed Url";
                                }
                            }
                            // full youtube url
                            if (url.indexOf('youtube') > 0 || url.indexOf('youtu.be') > 0 || url.indexOf('dailymotion') > 0 || url.indexOf('dai.ly') > 0) {
                            }else{
                                embed_url_error++;
                            }
                            if(url.trim() != "" & embed_url_error > 0){
                             return editor.lang.videoembed.onlytxt+ " : Not a valid embed Url";
                            }
                        }
                    },
                    {
                        type: 'html',
                        html: '<p style="text-align: -webkit-center;">(OR)</p>'
                    },
                    {
                        type: 'html',
                        html: '<p>URLs with filepath and filename</p>'
                    },
                    {
                        type: 'text',
                        id: 'url',
                        label: "URL (ex: https://storage.googleapis.com/media/sample.mp4)",
                        validate: function () {
                                var ember_url = this.getValue();
                                if(ember_url != ""){
                                    var url_embeded = this.getValue();
                                    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                                        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                                        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
                                    var isValidUrl = !!pattern.test(url_embeded);
                                    if(!isValidUrl){
                                        return "URLs with filepath and filename: Not a valid Url";
                                    }
                                    var video_extension = url_embeded.split('.').pop();
                                    const video_extensions = new Array("mp4", "m4v", "m4p", "webm", "mpeg", "avi");
                                    const containsString = video_extensions.some(element => {
                                      return element.toLowerCase() === video_extension.toLowerCase();
                                    });
                                    if(!containsString){
                                        return "URLs with filepath and filename: Not a valid Url";
                                    }
                                }
                            }
                    }
                ]
            }
        ],
        onOk: function () {
                 var
                    dialog = this,
                    div_container = new CKEDITOR.dom.element('div'),
                    css = 'videoEmbed';
            // Set custom css class name
            /*if (dialog.getValueOf('tab-basic', 'css_class').length > 0) {
                css = dialog.getValueOf('tab-basic', 'css_class');
            }
            div_container.setAttribute('class', css);
            */
            // Auto-detect if youtube, vimeo or dailymotion url
            var url = detect(dialog.getValueOf('tab-basic', 'url_video'));
            var url_embed = dialog.getValueOf('tab-basic', 'url');
            // Create iframe with specific url
            if (url.trim().length > 1 && url_embed.trim().length > 1) {
                alert("Enter Any one URL");
                return false;
            }
            var sel = editor.getSelection();
            //console.log(sel);
            var range = sel.getRanges()[0];
            //console.log(range)
            // no range, means the editor is empty. Select the range.
            if (!range) {
              range = editor.createRange();
              range.selectNodeContents( editor.editable() );
              sel.selectRanges( [ range ] );
              alert("Place the cursor where to add text in editor");
              return true;
            }
            console.log(sel);
            if (url.trim().length > 1) {
                var now = new Date();
                var div = editor.document.createElement('div');
                div.setHtml('<center><iframe frameborder="0" width="600" height="349" src="' + url + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></center>');
                //div_container.append(iframe);
                editor.insertElement(div);
            }
            if(url_embed.trim().length > 1){
                var now = new Date();
                var div = editor.document.createElement('div');
                div.setHtml(`<center><video class="player mt-3" id='video${now.getTime()}' controls="controls" preload='metadata' width="600" poster=""><source id='mp4' src="${url_embed}?q${now.getTime()}#t=0.5" type='video/mp4' /></video></center>`);
                editor.insertElement( div );
            }


        }
    };
});

// Detect platform and return video ID
function detect(url) {
    var embed_url = '';
    // full youtube url
    if (url.indexOf('youtube') > 0) {
        id = getId(url, "?v=", 3);
        if (id.indexOf('&list=') > 0) {
            lastId = getId(id, "&list=", 6);
            return embed_url = 'https://www.youtube.com/embed/' + id + '?list=' + lastId;
        }
        return embed_url = 'https://www.youtube.com/embed/' + id;
    }
    // tiny youtube url
    if (url.indexOf('youtu.be') > 0) {
        id = getId(url);
        // if this is a playlist
        if (id.indexOf('&list=') > 0) {
            lastId = getId(id, "&list=", 6);
            return embed_url = 'https://www.youtube.com/embed/' + id + '?list=' + lastId;
        }
        return embed_url = 'https://www.youtube.com/embed/' + id;
    }
    // full vimeo url
    if (url.indexOf('vimeo') > 0) {
        id = getId(url);
        return embed_url = 'https://player.vimeo.com/video/' + id + '?badge=0';
    }
    // full dailymotion url
    if (url.indexOf('dailymotion') > 0) {
        // if this is a playlist (jukebox)
        if (url.indexOf('/playlist/') > 0) {
           id = url.substring(url.lastIndexOf('/playlist/') + 10, url.indexOf("/1#video="));
            return embed_url = 'https://www.dailymotion.com/widget/jukebox?list[]=%2Fplaylist%2F' + id + '%2F1&&autoplay=0&mute=0';
        } else {
            id = getId(url);
        }
        return embed_url = 'https://www.dailymotion.com/embed/video/' + id;
    }
    // tiny dailymotion url
    if (url.indexOf('dai.ly') > 0) {
        id = getId(url);
        return embed_url = 'https://www.dailymotion.com/embed/video/' + id;
    }
    return embed_url;
}
// Return video ID from URL
function getId(url, string = "/", index = 1) {
    return url.substring(url.lastIndexOf(string) + index, url.length);
}