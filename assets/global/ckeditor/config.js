/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

	// The toolbar groups arrangement, optimized for two toolbar rows.

	/*{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print', '-', 'Templates' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] }
	{ name: 'forms', groups: [ 'forms' ] , items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ]},
	'/',
	{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] , items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
	{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] , items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
	{ name: 'links', groups: [ 'links' ] , items: [ 'Link', 'Unlink', 'Anchor' ] },
	{ name: 'insert', groups: [ 'insert' ] , items: [ 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
	'/',
	{ name: 'styles', groups: [ 'styles' ] , items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
	{ name: 'colors', groups: [ 'colors' ] , items: [ 'TextColor', 'BGColor' ] },
	{ name: 'tools', groups: [ 'tools' ] , items: [ 'Maximize', 'ShowBlocks' ] },
	{ name: 'others', groups: [ 'others' ] }*/
    /*config.extraPlugins = 'bgimage,base64image,backgrounds'; 
	config.toolbar = 'Custom';
	config.toolbar_Custom  = [
		{ name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print' ] },
		{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste'] },
		{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize', '-', 'Undo', 'Redo' ] },
		{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
		'/',
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
		{ name: 'links', items: [ 'Link', 'Unlink'] },
		{ name: 'insert', items: [ 'Table', 'HorizontalRule'] },
		'/',
		{ name: 'others', groups: [ 'others' ] }
	];*/
config.toolbarGroups = [
        { name: 'forms' },
        { name: 'tools' },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'styles' },
        { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'others' },
        { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
        { name: 'links', groups: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] },
        { name: 'insert' },
        { name: 'colors' },
        { name: 'about' },
        { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] }
    ];
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.wordcount = {

	    // Whether or not you want to show the Word Count
	    showWordCount: true,

	    // Whether or not you want to show the Char Count
	    showCharCount: true,
	};
	//config.allowedContent = true;

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar
    //config.extraPlugins = 'bgimage,base64image,backgrounds';
    //config.allowedContent = true;
	//config.extraPlugins = '';
	// Set the most common block elements.
	//config.format_tags = 'h1;h2;h3;h4;h5;h6';
};
