CKEDITOR.dialog.add( 'embedvideourlDialog', function( editor ) {
    return {
        title : 'URL',
            minWidth : 200,
            minHeight : 100,
            contents :
            [
                {
                    id : 'general',
                    label : 'Settings',
                    elements :
                    [
                        {
                            type : 'html',
                            html : 'Enter the size of the box for answer.'      
                        },                          
                        {
                            type : 'text',
                            id : 'url',
                            label : 'Size',
                            maxLength: 3,
                            size: 4,
                            validate: CKEDITOR.dialog.validate.number('Enter valid value.'),
                            required : true,
                            commit : function( data )
                            {
                                data.size = this.getValue();
                            }
                        }
                    ]
                }
            ],
        onOk: function() {
            var dialog = this;
            console.log(dialog);
        }
    };
});