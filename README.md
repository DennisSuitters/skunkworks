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

#### Warning - code injection
The code view allows the user to enter script contents. Make sure to filter/[sanitize the HTML on the server](https://github.com/search?l=JavaScript&q=sanitize+html). Otherwise, an attacker can inject arbitrary JavaScript code into clients.

### For contributing
https://github.com/summernote/summernote-skunkworks/blob/develop/.github/CONTRIBUTING.md

### Contacts
* Facebook user group: https://www.facebook.com/groups/summernote
* Summernote Slack: [Join the Summernote Slack community](https://communityinviter.com/apps/summernote/summernote)

### License
Summernote Skunkworks may be freely distributed under the MIT license.
