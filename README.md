# Summernote Skunkworks
Super simple WYSIWYG Editor based on the Lite version of Summernote.

### Summernote
Summernote is a JavaScript library that helps you create WYSIWYG editors online.

Home page: <https://summernote.org>

### Why Summernote Skunkworks?
Summernote Skunkworks is completely removed from Bootstrap, but continues to have default styling of the editor elements similar to Bootstrap for consitency, and has a few special features:

* Paste images from clipboard
* Saves images directly in the content of the field using base64 encoding, so you don't need to implement image handling at all
* Simple UI
* Interactive WYSIWYG editing
* Handy integration with server
* Completely removed from Boostrap, and working being able to use within any CSS Framework without modification.
* Lots of [plugins and connectors](https://github.com/summernote/awesome-summernote).

### Installation and dependencies
Summernote Skunkworks uses [jQuery](http://jquery.com/), which we are working on deprecating.

#### 1. Include JS/CSS
Include the following code in the `<head/>` area of your HTML:

```html
<!-- include libraries(jQuery) -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- include summernote css/js-->
<link href="summernote.css" rel="stylesheet">
<script src="summernote.js"></script>
```

#### 2. Target an element
Then place a `<div/>` tag somewhere in the `body` tag. This element will be replaced with the summernote editor.

```html
<div id="summernote">Hello Summernote Skunkworks</div>
```

You can also use inside a `<form/>` like below, where the data will be sent to the *[url]* to be processed on the backend:

````html
<form method="[chosen method]" action="[url]">
  <textarea id="summernote" name="[name of var to send with form]"></textarea>
</form>
````

You can also initialise multiple instances of Summernote on a single page, either by using unique ID's, or by using a single initialising script by using a class name instead.

#### 3. Summernote it!
Finally, run this script after the DOM is ready:

```javascript
$(document).ready(function() {
  $('#summernote').summernote();
});
```

For more examples, please visit to [homepage](http://summernote.org/examples).

### API
`code` - get the HTML source code underlying the text in the editor:

```javascript
var html = $('#summernote').summernote('code');
```

For more detail about API, please refer to [document](http://summernote.org/getting-started/#basic-api).

#### Options for Summernote Skunkworks
Note: Some of the options below are NOT available in the main repository.

````javascript
  lang: 'en-US', // Default Language, other language files have been removed as there has been additions.

  editing: true,

  followingToolbar: false,
  toolbarPosition: 'top',
  stickyToolbar: false,
  otherStaticBar: '',
  dropUp: false, // false uses default dropdown,
  toolbarButtonDropUp: true, // true|false If toolbarPosition = 'bottom' this will override dropUp.
  statusOutputTime: 5000, // default 5 seconds.

  // toolbar
  codeviewKeepButton: false,
  toolbar: [
    ['style', ['block', 'inline']],
    ['font', ['bold', 'underline', 'clear']],
    ['fontname', ['fontname', 'fontsize', 'fontSizeunit']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['table', ['table']],
    ['insert', ['hr', 'link', 'picture', 'video']],
    ['zoom', ['zoomOut', 'zoomValue', 'zoomIn']],
    ['view', ['fullscreen', 'codeview', 'help']],
  ],

  // popover
  popatmouse: true,
  popover: {
    image: [
      ['resize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
      ['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['remove', ['removeMedia']],
    ],
    video: [
      ['remove', ['removeVideo']],
    ],
    link: [
      ['link', ['linkDialogShow', 'unlink']],
    ],
    table: [
      ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
      ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
    ],
    air: [
      ['color', ['color']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']],
      ['view', ['fullscreen', 'codeview']],
    ],
  },

  // link options
  linkAddNoReferrer: false,
  addLinkNoOpener: false,

  // air mode: inline editor
  airMode: false,
  overrideContextMenu: false, // TBD

  width: null,
  height: null,
  linkTargetBlank: true,

  // Thie linkList options adds a quick dropdown to the Link Dialog that can be used to add
  // other page links, or links to anywhere that an editor might need quick access to.
  linkList: [
    // [ 'title', 'url', 'select text' ],
  ],

  focus: false,
  tabDisable: false,
  tabSize: 4,
  styleWithCSS: false,
  shortcuts: true,
  textareaAutoSync: true,
  tooltip: 'auto',
  placement: 'bottom', // none|top|right|bottom|left | Needs Documenting
  container: null,
  maxTextLength: 0,
  blockquoteBreakingLevel: 2,
  spellCheck: true,
  disableGrammar: false,
  placeholder: null,
  inheritPlaceholder: false,
  // TODO: need to be documented
  recordEveryKeystroke: false,
  historyLimit: 200,

  // TODO: need to be documented
  showDomainOnlyForAutolink: false,

  // TODO: need to be documented
  hintMode: 'word',
  hintSelect: 'after',
  hintDirection: 'bottom',

  blockTags: ['address', 'blockquote', 'details', 'div', 'p', 'pre', 'h1', 'h2',
              'h3', 'h4', 'h5', 'h6'],

  inlineTags: ['abbr', 'b', 'cite', 'code', 'del', 'em', 'figure', 'figcaption',
                'i', 'ins', 'kbd', 'mark', 'picture', 'q', 's', 'samp', 'small',
                'span', 'strong', 'sub', 'sup', 'time', 'u', 'var'],

  fontNames: [
    'Arial', 'Arial Black', 'Bookman Old Style', 'Brush Script MT', 'Calibri',
    'Charcoal', 'Comic Sans MS', 'Courier New', 'Garamond', 'Georgia',
    'Helvetica', 'Helvetica Neue', 'Impact', 'Lucida', 'Monaco Monospace',
    'Palatino Linotype', 'Roboto', 'Sans-Serif', 'Tahoma', 'Times New Roman',
    'Trebuchet MS', 'Verdana',
  ],
  fontNamesIgnoreCheck: [],
  addDefaultFonts: true,

  fontSizes: ['8', '9', '10', '11', '12', '14', '15', '16', '17', '18', '19',
              '20', '24', '36'],

  fontSizeUnits: ['em', 'px', 'pt', 'rem'],

  colorButton: {
    foreColor: '#000000', // Default colour shown in the button.
    backColor: '#FFFF00', // Default colour shown in the button.
  },

  lineHeights: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],

  tableClassName: 'table table-bordered',

  insertTableMaxSize: {
    col: 10,
    row: 10,
  },

  // By default, dialogs are attached in container.
  dialogsInBody: false,
  dialogsFade: false,

  disableUpload: false, // true|false Disables display of upload option in ImageDialog,
  fileExplorer: '', // If set with the Javascript function name, and button in ImageDialog.js will be shown, which also parses in the ID of the #note-dialog-image-url so the function can return the URL of the selected file for insertion. Note, only the function name is required for eg 'elfinderDialog'.
  maximumImageFileSize: null,
  acceptImageFileTypes: "image/*",

  callbacks: {
    onBeforeCommand: null,
    onBlur: null,
    onBlurCodeview: null,
    onChange: null,
    onChangeCodeview: null,
    onDialogShown: null,
    onDrop: null,
    onEnter: null,
    onFocus: null,
    onImageLinkInsert: null,
    onImageUpload: null,
    onImageUploadError: null,
    onInit: null,
    onKeydown: null,
    onKeyup: null,
    onMousedown: null,
    onMouseup: null,
    onPaste: null,
    onScroll: null,
  },

  codemirror: {
    mode: 'text/html',
    htmlMode: true,
    lineNumbers: true,
  },

  codeviewFilter: true,
  codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi,
  codeviewIframeFilter: true,
  codeviewIframeWhitelistSrc: [],
  codeviewIframeWhitelistSrcBase: [
    'www.youtube.com',
    'www.youtube-nocookie.com',
    'www.facebook.com',
    'vine.co',
    'instagram.com',
    'player.vimeo.com',
    'www.dailymotion.com',
    'player.youku.com',
    'jumpingbean.tv',
    'v.qq.com',
    'www.tiktok.com',
  ],
````

#### Warning - code injection
The code view allows the user to enter script contents. Make sure to filter/[sanitize the HTML on the server](https://github.com/search?l=JavaScript&q=sanitize+html). Otherwise, an attacker can inject arbitrary JavaScript code into clients.

### For contributing
https://github.com/summernote/summernote-skunkworks/blob/develop/.github/CONTRIBUTING.md

### Contacts
* Facebook user group: https://www.facebook.com/groups/summernote
* Summernote Slack: [Join the Summernote Slack community](https://communityinviter.com/apps/summernote/summernote)

### License
Summernote Skunkworks may be freely distributed under the MIT license.
