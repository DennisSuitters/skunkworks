import $ from 'jquery';
import env from '../core/env';
import key from '../core/key';
import func from '../core/func';

export default class VideoDialog {
  constructor(context) {
    this.context = context;
    this.ui = $.summernote.ui;
    this.$body = $(document.body);
    this.$editor = context.layoutInfo.editor;
    this.options = context.options;
    this.lang = this.options.langInfo;

    context.memo('help.videoDialog.show', this.options.langInfo.help['videoDialog.show']);
  }

  initialize() {
    const $container = this.options.dialogsInBody ? this.$body : this.options.container;
    const body = [
      '<label for="note-dialog-video-url-' + this.options.id + '" class="note-form-label">' + this.lang.video.url + ' <small class="note-text-muted">' + this.lang.video.providers + '</small></label>',
      '<div class="note-form-group">',
        `<input id="note-dialog-video-url-` + this.options.id + `" class="note-video-url note-input" type="text">`,
      '</div>',
      '<div class="note-form-help">' + this.lang.video.note + '</div>',
      `<label for="note-dialog-video-aspect-` + this.options.id + `" class="note-form-label">` + this.lang.video.aspect + `</label>`,
      '<div class="note-form-group">',
        `<select id="note-dialog-video-aspect-` + this.options.id + `" class="note-video-aspect note-input">`,
          '<option value="16-9">16:9</option>',
          '<option value="4-3">4:3</option>',
          '<option value="1-1">1:1</option>',
        '</select>',
      '</div>',
      `<label for="note-dialog-video-quality-` + this.options.id + `" class="note-form-label">` + this.lang.video.quality + `</label>`,
      '<div class="note-form-group">',
        `<select id="note-dialog-video-quality-` + this.options.id + `" class="note-video-quality note-input">`,
          '<option value="auto"">Auto</option>',
          '<option value="240p">240p</option>',
          '<option value="360p">360p</option>',
          '<option value="480p">480p</option>',
          '<option value="720p">720p</option>',
          '<option value="1080p">1080p</option>',
        '</select>',
      '</div>',
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-captions-' + this.options.id,
        id: 'note-dialog-video-captions-' + this.options.id,
        className: 'note-video-captions',
        text: this.lang.video.captions,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-suggested-' + this.options.id,
        id: 'note-dialog-video-suggested-' + this.options.id,
        className: 'note-video-suggested',
        text: this.lang.video.suggested,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-controls-' + this.options.id,
        id: 'note-dialog-video-controls-' + this.options.id,
        className: 'note-video-controls',
        text: this.lang.video.controls,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-autoplay-' + this.options.id,
        id: 'note-dialog-video-autoplay-' + this.options.id,
        className: 'note-video-autoplay',
        text: this.lang.video.autoplay,
        checked: true,
      }).render()).html(),
      $('<div/>').append(this.ui.checkbox({
        for: 'note-dialog-video-loop-' + this.options.id,
        id: 'note-dialog-video-loop-' + this.options.id,
        className: 'note-video-loop',
        text: this.lang.video.loop,
        checked: true,
      }).render()).html(),
    ].join('');
    const footer = '<input type="button" href="#" class="note-btn note-btn-primary note-video-btn" value="' + this.lang.video.insert + '" disabled>';

    this.$dialog = this.ui.dialog({
      className: 'note-video-modal' + (this.options.dialogsAnim != '' ? ' note-' + this.options.dialogsAnim : ''),
      title: this.lang.video.insert,
      body: body,
      footer: footer,
    }).render().appendTo($container);
  }

  destroy() {
    this.ui.hideDialog(this.$dialog);
    this.$dialog.remove();
  }

  bindEnterKey($input, $btn) {
    $input.on('keypress', (event) => {
      if (event.keyCode === key.code.ENTER) {
        event.preventDefault();
        $btn.trigger('click');
      }
    });
  }

  createVideoNode(url) {
// Bilibi
    const bilRegExp = /bilibili\.com\/video\/([a-zA-Z0-9]+)/;
    const bilMatch = url.match(bilRegExp);

// Dailymotion
    const dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
    const dmMatch = url.match(dmRegExp);

// Facebook
    const fbRegExp = /(?:www\.|\/\/)facebook\.com\/([^\/]+)\/videos\/([0-9]+)/;
    const fbMatch = url.match(fbRegExp);

// Google
    const gdRegExp = /(?:\.|\/\/)drive\.google\.com\/file\/d\/(.[a-zA-Z0-9_-]*)\/view/;
    const gdMatch = url.match(gdRegExp);

// Instagram
    const igRegExp = /(?:www\.|\/\/)instagram\.com\/reel\/(.[a-zA-Z0-9_-]*)/;
    const igMatch = url.match(igRegExp);

// PeerTube
    const peerTubeRegExp = /\/\/(.*)\/videos\/watch\/([^?]*)(?:\?(?:start=(\w*))?(?:&stop=(\w*))?(?:&loop=([10]))?(?:&autoplay=([10]))?(?:&muted=([10]))?)?/;
    const peerTubeMatch = url.match(peerTubeRegExp);

// QQ
    const qqRegExp = /\/\/v\.qq\.com.*?vid=(.+)/;
    const qqMatch = url.match(qqRegExp);
    const qqRegExp2 = /\/\/v\.qq\.com\/x?\/?(page|cover).*?\/([^\/]+)\.html\??.*/;
    const qqMatch2 = url.match(qqRegExp2);

// tiktok
    const tiktokRegExp = /(?:www\.|\/\/)tiktok\.com\/.*?\/video\/(.[a-zA-Z0-9_-]*)/;
    const tiktokMatch = url.match(tiktokRegExp);
//    https://www.tiktok.com/@ozzymanreviews/video/7147225284805217537

// Vimeo
    const vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*(\d+)[?]?.*/;
    const vimMatch = url.match(vimRegExp);

// WISTIA

// Vine
    const vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
    const vMatch = url.match(vRegExp);

// Youku
    const youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
    const youkuMatch = url.match(youkuRegExp);

// YouTube
    const ytRegExp = /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/|live\/))([^&\n?]+)(?:.*[?&]t=([^&\n]+))?.*/;
    const ytRegExpForStart = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
    const ytMatch = url.match(ytRegExp);

// MP4
    const mp4RegExp = /^.+.(mp4|m4v)$/;
    const mp4Match = url.match(mp4RegExp);

// OGG
    const oggRegExp = /^.+.(ogg|ogv)$/;
    const oggMatch = url.match(oggRegExp);

// WebM
    const webmRegExp = /^.+.(webm)$/;
    const webmMatch = url.match(webmRegExp);

    let $video = '<figure class="note-video-wrapper">';
    let urlVars = '';
    const $videoAspect = this.$dialog.find('.note-video-aspect');
    const $videoQuality = this.$dialog.find('.note-video-quality');
    const $videoSuggested = this.$dialog.find('.note-video-suggested input[type=checkbox]');
    const $videoCaptions = this.$dialog.find('.note-video-captions input[type=checkbox]');
    const $videoControls = this.$dialog.find('.note-video-controls input[type=checkbox]');
    const $videoAutoplay = this.$dialog.find('.note-video-autoplay input[type=checkbox]');
    const $videoLoop = this.$dialog.find('.note-video-loop input[type=checkbox]');

    let selectVideoAspect = $videoAspect.val();
    let selectVideoQuality = $videoQuality.val();
    let checkVideoSuggested = $videoSuggested.is(':checked');
    let checkVideoCaptions = $videoCaptions.is(':checked');
    let checkVideoControls = $videoControls.is(':checked');
    let checkVideoAutoplay = $videoAutoplay.is(':checked');
    let checkVideoLoop = $videoLoop.is(':checked');
    let vWidth = 788.54;
    let vHeight = 443;

    if (selectVideoAspect == '4-3') vWidth = 589.19;
    if (selectVideoAspect == '1-1') vWidth = 443;

    if (ytMatch && ytMatch[1].length) {
      const youtubeId = ytMatch[1];
      var start = 0;
      if (typeof ytMatch[2] !== 'undefined') {
        const ytMatchForStart = ytMatch[2].match(ytRegExpForStart);
        if (ytMatchForStart) {
          for (var n = [3600, 60, 1], i = 0, r = n.length; i < r; i++) {
            start += (typeof ytMatchForStart[i + 1] !== 'undefined' ? n[i] * parseInt(ytMatchForStart[i + 1], 10) : 0);
          }
        }else{
          start = parseInt(ytMatch[2], 10);
        }
      }

      if (start > 0) urlVars += 'start=' + start;
      if (checkVideoSuggested) urlVars += (urlVars.length > 0 ? '&' : '') + 'rel=1';
      if (checkVideoControls) urlVars += (urlVars.length > 0 ? '&' : '') + 'controls=1';
      if (checkVideoCaptions) urlVars += (urlVars.length > 0 ? '&' : '') + 'cc_load_policy=1';
      if (checkVideoAutoplay) urlVars += (urlVars.length > 0 ? '&' : '') + 'autoplay=1';
      if (checkVideoLoop) urlVars += (urlVars.length > 0 ? '&' : '') + 'loop=1';
      if (selectVideoQuality == '240p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=small';
      if (selectVideoQuality == '360p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=medium';
      if (selectVideoQuality == '480p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=large';
      if (selectVideoQuality == '720p') urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=hd720';
      if (selectVideoQuality == '1080p')urlVars += (urlVars.length > 0 ? '&' : '') + 'vq=hd1080';

      $video = '<figure class="note-video-wrapper" style="width:' + vWidth + 'px;">';
      $video += '<iframe allowfullscreen class="note-video-clip" frameborder="0" src="//www.youtube.com/embed/' + youtubeId + (urlVars > 0 ? '?' + urlVars : '') + '" width="' + vWidth + '" height="' + vHeight + '"></iframe>';
    } else if (gdMatch && gdMatch[0].length) {
      $video += '<iframe class="note-video-clip" frameborder="0" src="https://drive.google.com/file/d/' + gdMatch[1] + '/preview" width="' + vWidth + '" height="' + vHeight +'"></iframe>';
    } else if (igMatch && igMatch[0].length) { // Instagram
      $video += '<iframe class="note-video-clip" frameborder="0" src="https://instagram.com/p/' + igMatch[1] + '/embed/" width="' + vWidth + '"height="' + vHeight + '" scrolling="no" allowtransparency="true"></iframe>';
    } else if (vMatch && vMatch[0].length) { // Vine
      $video += '<iframe class="note-video-clip vine-embed" frameborder="0" src="' + vMatch[0] + '/embed/simple" width="' + vWidth + '" height="' + vHeight + '"></iframe>"';
    } else if (vimMatch && vimMatch[3].length) { // Vimeo
      $video += '<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen class="note-video-clip" frameborder="0" src="//player.vimeo.com/video/' + vimMatch[3] + '" width="' + vWidth + '" height="' + vHeight + '"></iframe>'
    } else if (dmMatch && dmMatch[2].length) { // Dailymotion
      $video += '<iframe class="note-video-clip" frameborder="0" src="//www.dailymotion.com/embed/video/' + dmMatch[2] + '" width="' + vWidth + '" height="' + vHeight +'"></iframe>';
    } else if (youkuMatch && youkuMatch[1].length) { // Youku
      $video += '<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen class="note-video-clip" frameborder="0" width="' + vWidth + '" height="' + vHeight + '" src="//player.youku.com/embed/' + youkuMatch[1] + '"></iframe>';
    } else if (peerTubeMatch && peerTubeMatch[0].length){
      var begin = 0;
      if (peerTubeMatch[2] !== 'undefined') begin = peerTubeMatch[2];
      var end =0;
      if (peerTubeMatch[3] !== 'undefined') end = peerTubeMatch[3];
      var loop = 0;
      if (peerTubeMatch[4] !== 'undefined') loop = peerTubeMatch[4];
      var autoplay = 0;
      if (peerTubeMatch[5] !== 'undefined') autoplay = peerTubeMatch[5];
      var muted = 0;
      if (peerTubeMatch[6] !== 'undefined') muted = peerTubeMatch[6];
      $video += '<iframe allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups" class="note-video-clip" frameborder="0" src="//'+ peerTubeMatch[1] +'/videos/embed/' + peerTubeMatch[2] + '?loop=' + loop + '&autoplay=' + autoplay + '&muted=' + muted + (begin > 0 ? '&start=' + begin : '') + (end > 0 ? '&end=' + start : '') + '" width="560" height="315"></iframe>';
    } else if ((qqMatch && qqMatch[1].length) || (qqMatch2 && qqMatch2[2].length)) {
      const vid = ((qqMatch && qqMatch[1].length) ? qqMatch[1] : qqMatch2[2]);
      $video += '<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen class="note-video-clip" frameborder="0" width="' + vWidth + '" height="' + vHeight + '" src="https://v.qq.com/txp/iframe/player.html?vid=' + vid + '&amp;auto=0"></iframe>';
    } else if (mp4Match || oggMatch || webmMatch) {
      $video += '<video controls class="note-video-clip" src="' + url + '" width="' + vWidth + '" height="' + vHeight + '">';
    } else if (tiktokMatch && tiktokMatch[0].length) {
      $video += '<iframe class="note-video-clip" style="height:648px;" width="420" height="648" name="__tt_embed__v78890194078918110" title="Watch" src="h'+ tiktokMatch[0] + '" allowfullscreen allowtransparency></iframe>';
    } else if (fbMatch && fbMatch[0].length) {
      $video += '<iframe class="note-video-clip" frameborder="0" src="https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(fbMatch[0]) + '&show_text=0&width=' + vWidth + '" width="' + vWidth + '" height="' + vHeight + '" scrolling="no" allowtransparency="true"></iframe>';
    } else if (bilMatch && bilMatch[0].length) {
      $video += '<iframe class="note-video-clip" src="//player.bilibili.com/player.html?bvid=' + encodeURIComponent(bilMatch[1]) + '" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>';
    } else {
      // this is not a known video link. Now what, Cat? Now what?
      return false;
    }

    $video += '<div class="note-video-popover-overlay"></div></figure>';

    return $video;
  }

  show() {
    const text = this.context.invoke('editor.getSelectedText');
    this.context.invoke('editor.saveRange');
    this.showVideoDialog(text).then((url) => {
      // [workaround] hide dialog before restore range for IE range focus
      this.ui.hideDialog(this.$dialog);
      this.context.invoke('editor.restoreRange');

      // build node
      const $node = this.createVideoNode(url);

      if ($node) {
        // insert video node
        this.context.invoke('editor.pasteHTML', $node);
      }
    }).fail(() => {
      this.context.invoke('editor.restoreRange');
    });
  }

  /**
   * show video dialog
   *
   * @param {jQuery} $dialog
   * @return {Promise}
   */
  showVideoDialog(/* text */) {
    return $.Deferred((deferred) => {
      const $videoUrl = this.$dialog.find('.note-video-url');
      const $videoBtn = this.$dialog.find('.note-video-btn');

      this.ui.onDialogShown(this.$dialog, () => {
        this.context.triggerEvent('dialog.shown');

        $videoUrl.on('input paste propertychange', () => {
          this.ui.toggleBtn($videoBtn, $videoUrl.val());
        });

        if (!env.isSupportTouch) {
          $videoUrl.trigger('focus');
        }

        $videoBtn.on('click', (event) => {
          event.preventDefault();
          deferred.resolve($videoUrl.val());
        });

        this.bindEnterKey($videoUrl, $videoBtn);
      });

      this.ui.onDialogHidden(this.$dialog, () => {
        $videoUrl.off();
        $videoBtn.off();

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      });

      this.ui.showDialog(this.$dialog);
    });
  }
}
