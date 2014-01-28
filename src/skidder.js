// Object.create polyfill

if ( typeof Object.create != 'function') {
  Object.create = function(obj) {
    function F() {};
    F.prototype = obj;
    return new F();
  }
}

// SKIDDER

(function($, window, document, undefined) {

  var Skidder = {
    init: function(options, elem) {
      var self = this;
      self.elem = elem;
      self.$elem = $(elem);
      self.options = $.extend( {},  $.fn.skidder.options, options);
      // self.cycle();
      if (self.options.scaling) {
        self.scaleImages();
      }

    },

    scaleImages: function() {
      var self = this;
       $('#slideshow .slide img').each(function() {
        if ($(this).innerWidth() > $(this).innerHeight()) { // landscape
          maxImageHeight = Math.max($(this).innerHeight(), maxImageHeight);
          minImageHeight = Math.min($(this).innerHeight(), minImageHeight);
        }
      });
      scaleImages();





      if ( typeof self.options.onInit === 'function') {
        self.options.onInit.apply(self.elem, arguments); // ?
      }


    }



  };

  $.fn.skidder = function(options) {

    return this.each(function() {
      var skidder = Object.create(Skidder);
      skidder.init(options, this);

    })

  };

  $.fn.skidder.options = {
    slideElem     : '.slide',
    center        : false,
    cycle         : false,
    paging        : false,
    jumpback      : false,
    scaling       : false,
    slidespeed    : 400,
    onInit        : null,
    onSlide       : null


  };


}(jQuery, window, document));