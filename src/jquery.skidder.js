/* Skidder - a jQuery slideshow plugin
 * Georg Lauteren for null2 - MIT
 * http://twitter.com/_gl03
 * http://georg.null2.net           */

if ( typeof Object.create != 'function') {
  Object.create = function(obj) {
    function F() {};
    F.prototype = obj;
    return new F();
  }
}

(function($, window, document, undefined) {

  function img(url) {
    var i = new Image;
    i.src = url;
    return i;
  }

  if ('naturalWidth' in (new Image)) {
    $.fn.naturalWidth  = function() { return this[0].naturalWidth; };
    $.fn.naturalHeight = function() { return this[0].naturalHeight; };
  } else {
    $.fn.naturalWidth  = function() { return img(this[0].src).width; };
    $.fn.naturalHeight = function() { return img(this[0].src).height; };
  }

  var Skidder = {

    init: function(options, elem) {

      var self = this; // instance
      self.elem = elem;
      self.$elem = $(elem);

      // merge options
      self.options = $.extend( {},  $.fn.skidder.options, options);

      // attach instance to jquery object
      self.$elem.data('skidder', self);

      // store elements + create wrappers
      self.$slides = self.$elem.find(self.options.slideClass);
      self.$slides.wrapAll('<div class="skidder-wrapper"></div>').addClass('skidder-slide');
      self.$elem.wrapInner('<div class="skidder-viewport"></div>');
      self.$viewport = self.$elem.find('.skidder-viewport');
      self.$wrapper = self.$viewport.find('.skidder-wrapper');
      if (self.$slides.length > 1) {
        self.$viewport.append('<div class="skidder-prevwrapper skidder-clickwrapper"><div class="skidder-prev skidder-clickelement"></div></div><div class="skidder-nextwrapper skidder-clickwrapper"><div class="skidder-next skidder-clickelement"></div></div>');
        self.$clickwrappers = self.$viewport.find('.skidder-clickwrapper');
        if ("ontouchstart" in document.documentElement) {  
          if (self.options.swiping) {
            // if swiping, append touchwrapper
            self.$viewport.append('<div class="skidder-touchwrapper"></div>');
            self.$touchwrapper = self.$viewport.find('.skidder-touchwrapper');
          } else { // no swiping, show click controls
            self.$clickwrappers.find('.skidder-clickelement').css('opacity', 1);
          }
        }
        self.$clickwrappers.attr({
          'data-direction' : function() {
            return $(this).hasClass('skidder-prevwrapper') ? 'prev' : 'next'; // TODO: remove direction
          },
        });
      }
      if (self.options.paging) {
        self.$viewport.append('<div class="skidder-paging"></div>');
        self.$pager = self.$viewport.find('.skidder-paging')
      }

      self.leftPosition = 0;

      // establish initial dimensions
      self.refreshImages(); // select images

      if (self.$images.length && self.options.scaleSlides) { // scaling
        self.scaleSlides();
      } else if (self.$images.length) { // no scaling, slideshowheight = highest image height
        var newMaxHeight = 0;
        self.$images.each(function() { // TODO: for no-image slideshows
          newMaxHeight = Math.max($(this).innerHeight(), newMaxHeight);
        });
        self.setSlideshowHeight(newMaxHeight);
      }

      self.preloadSlides();  
      self.centerPosition();
      self.$viewport.css('opacity', 1);

      if (self.options.autoplay) {
        self.autoplaying = self.autoplay();
      }
      

    },

    scaleSlides: function() {

      var self = this;

      if (self.$images.length) {
        var maxWidth = Math.min(self.$viewport.innerWidth(), self.options.maxSlideWidth);
        var maxHeight = self.options.maxSlideHeight;
        var scalefactor = 1.0;

        self.$images.each(function() {

          scalefactor = Math.min(1.0, maxWidth / $(this).naturalWidth()); // if image wider than allowed...

          maxHeight = Math.min( maxHeight, Math.ceil($(this).naturalHeight() * scalefactor));

          // console.log('maxHeight: ' + maxHeight);
        });

        self.setSlideshowHeight(maxHeight);

        self.$images.each(function() { 

          if ($(this).naturalHeight() > maxHeight) {
            $(this).css({
              width   : Math.ceil($(this).naturalWidth() * (maxHeight / $(this).naturalHeight() )) + 2, // + 2 is lazy correction for rounding problem
              height  : maxHeight
            });
          } else if ($(this).naturalWidth() > maxWidth) {
            $(this).css({
              width   : maxWidth,
              height  : Math.ceil($(this).naturalHeight() * (maxWidth / $(this).naturalWidth() )) + 2 // + 2 is lazy correction for rounding problem
            });
          } else {
            $(this).css({
              width   : 'auto',
              height  : maxHeight
            });
          }
        });

        // set new leftPosition executed in scrollWrapper // TODO: does not work on load as active slide is not set yet! do we need this to work?
        // self.refreshSlides();
        var currentactiveindex = self.$elem.find('.skidder-slide').index(self.$elem.find('.skidder-slide').filter('.active'));
        // console.log(currentactiveindex);
        // console.log(self.leftPosition);
        self.leftPosition = 0;
        for (i = 0; i < currentactiveindex; i++ ) {
          self.leftPosition -= self.$slides.eq(i).innerWidth();
        }
        // console.log(self.leftPosition);
        self.$wrapper.css('left', self.leftPosition);

      }
    },

    preloadSlides: function() {

      var self = this;
      var $activeslide = self.$slides.eq(0);
      var slidesTotalWidth = 0;

      // 
      for (i = 0; i < self.$slides.length; i++ ) {
        slidesTotalWidth += self.$slides.eq(i).innerWidth();
        if (self.options.paging) {
          self.$pager.append('<div class="skidder-pager-dot"></div>');
        } 
      }

      if ("ontouchstart" in document.documentElement && self.options.paging) {
        // if mobile, show paging
        self.$pager.find('.skidder-pager-dot').css('opacity', 1);
      }

      if (self.options.cycle && self.$slides.length > 1) {
        // clone two sets of slides 
        self.$slides.clone().addClass('skidder-clone skidder-clone-pre').prependTo(self.$wrapper);
        self.$slides.clone().addClass('skidder-clone skidder-clone-post').appendTo(self.$wrapper);

        // set initial left position
        self.leftPosition = -slidesTotalWidth;
        self.$wrapper.css('left', self.leftPosition);

        self.refreshSlides();
        self.refreshImages();
      } else if ( self.$slides.length > 1 ){
        self.$clickwrappers.find('.skidder-prev').hide(0);
      }

      $activeslide.addClass('active');

      // add clickhandlers
      if (self.$slides.length > 1) {
        if (self.options.paging) {
          self.$pagerdots = self.$pager.find('.skidder-pager-dot');
          self.$pagerdots.eq(0).addClass('active'); 
        }
        self.addEventHandlers();
      }

      self.$wrapper.css('opacity', 1);
    },

    addEventHandlers: function() {
      var self = this;
      if (self.options.paging) {
        self.$pagerdots.on('click touchend', function(e){self.clickHandlerPaging(e)}); 
      }
      if ("ontouchstart" in document.documentElement && self.options.swiping) {
        self.$touchwrapper.on('touchstart touchmove touchend', function(e){self.swipeHandler(e)});
      } else {
        self.$clickwrappers.on('click', function(e){self.clickHandlerLeftRight(e)});
      } 
    },

    removeEventHandlers: function() {
      var self = this;
      if (self.options.paging) {
        self.$pagerdots.off('click touchend'); 
      }
      if ("ontouchstart" in document.documentElement) {
        self.$touchwrapper.off('touchstart touchmove touchend');
      } else {
        self.$clickwrappers.off('click');
      }
    },

    swipeHandler: function(e) {
      var self = this;  
      var diffX = 0;
      var touchinterval;
      // var velocity;
      var $activeslide = self.$slides.filter('.active');
      if (self.options.paging) {
        var $activedot = self.$pagerdots.filter('.active');
      }


      if (e.type == "touchstart") {
        e.stopPropagation();
        e.preventDefault();
        self.initialX = e.originalEvent.changedTouches[0].pageX;
        self.initialY = e.originalEvent.changedTouches[0].pageY;
        self.touchtime = new Date().getTime();
        // console.log('start: ' + self.initialX);

      } else if (e.type == "touchmove") {
        e.stopPropagation();
        e.preventDefault();
        
        diffX = e.originalEvent.changedTouches[0].pageX - self.initialX;
        diffY = e.originalEvent.changedTouches[0].pageY - self.initialY;
        
        self.$wrapper.css('left', self.leftPosition + diffX);

        if (Math.abs(diffY) > Math.abs(diffX)) {
          window.scrollBy(0,-diffY);
        }

      } else if (e.type == "touchend") {
        
        self.finalX = e.originalEvent.changedTouches[0].pageX;
        self.finalY = e.originalEvent.changedTouches[0].pageY;
        diffX = self.finalX - self.initialX;
        diffY = self.finalY - self.initialY;
        touchinterval = new Date().getTime() - self.touchtime;
        // console.log('diffX: ' + diffX + ' diffY: ' + diffY);
        // console.log('touchinterval: ' + touchinterval);

        if (diffX > $activeslide.innerWidth()/2 || diffX > 0 && touchinterval < 350) { // replace interval by velocity for long fast swipes?

          self.removeEventHandlers();
          $activeslide.prev().addClass('active');
          $activeslide.removeClass('active').addClass('disengage');
          if (self.options.paging) {
            self.$pagerdots.removeClass('active'); 
            $activedot.is(':first-child') ? self.$pagerdots.eq(-1).addClass('active') : $activedot.prev().addClass('active'); 
          }
          self.scrollWrapper('prev', -1, diffX, 'easeOutSkidder');
        
        } else if (diffX < -($activeslide.innerWidth()/2) || diffX < 0 && touchinterval < 350) { // replace interval by velocity for long fast swipes?

          self.removeEventHandlers();
          $activeslide.next().addClass('active');
          $activeslide.removeClass('active').addClass('disengage');
          if (self.options.paging) {
            self.$pagerdots.removeClass('active'); 
            $activedot.is(':last-child') ? self.$pagerdots.eq(0).addClass('active') : $activedot.next().addClass('active'); 
          }
          self.scrollWrapper('next', 1, diffX, 'easeOutSkidder');
        
        } else if (diffX < 5 && diffY < 5 && $activeslide.attr('href')) { // it's a click!

          self.$wrapper.css({
            'left': self.leftPosition
          });
          window.clearTimeout(self.autoplaying);
          window.location.href = $activeslide.attr('href');

        } else { // return to original position

          self.$wrapper.animate({
            'left': self.leftPosition
          }, self.options.speed );
        
        }
      }
    },

    clickHandlerLeftRight: function(e) {
      
      var self = this;
      var direction = $(e.target).closest('[data-direction]').andSelf().attr('data-direction');
      var $fromSlide = self.$slides.filter('.active');
      var $toSlide = (direction == 'next' ? 
        (self.options.leftaligned && self.options.jumpback && self.$slides.eq(-1).hasClass('active') ? 
          self.$slides.eq(0) 
          : $fromSlide.next()) 
        : $fromSlide.prev());
      $toSlide.addClass('active');
      $fromSlide.addClass('disengage').removeClass('active');
      var jumpsize = (direction == 'next' ? 1 : -1);
      
      self.removeEventHandlers();
      self.scrollWrapper(direction, jumpsize);

      //update paging
      if (self.options.paging) {
        var $activedot = self.$pagerdots.filter('.active');
        self.$pagerdots.removeClass('active'); 
        if (direction == 'next') {
          $activedot.is(':last-child') ? self.$pagerdots.eq(0).addClass('active') : $activedot.next().addClass('active'); 
        } else if (direction == 'prev') {
          $activedot.is(':first-child') ? self.$pagerdots.eq(-1).addClass('active') : $activedot.prev().addClass('active'); 
        }       
      } 
    },

    clickHandlerPaging: function(e) {
      // console.log('page');
      var self = this;
      var activeindex = self.$pagerdots.index(self.$pagerdots.filter('.active'));
      var jumpindex = self.$pagerdots.index($(e.target));
      var jumpsize = jumpindex - activeindex;
      var direction = (activeindex > jumpindex ? 'prev' : 'next');
      var $fromSlide = self.$slides.filter('.active');
      var $toSlide = self.$slides.eq(self.$slides.index($fromSlide)+jumpsize);

      // update paging
      self.$pagerdots.removeClass('active').eq(jumpindex).addClass('active');
      
      $fromSlide.addClass('disengage').removeClass('active');
      $toSlide.addClass('active').removeClass('disengage');
      
      self.removeEventHandlers();
      self.scrollWrapper(direction, jumpsize);
    },

    autoplay: function() {
      var self = this;

      var $fromSlide = self.$slides.filter('.active');
      var $toSlide = self.options.leftaligned && self.options.jumpback && self.$slides.eq(-1).hasClass('active') ? 
          self.$slides.eq(0) : $fromSlide.next();

      return window.setTimeout(function(){
        
        self.removeEventHandlers();

        $fromSlide.addClass('disengage').removeClass('active');
        $toSlide.addClass('active').removeClass('disengage');

        //update paging
        if (self.options.paging) {
          var $activedot = self.$pagerdots.filter('.active');
          self.$pagerdots.removeClass('active'); 
          $activedot.is(':last-child') ? self.$pagerdots.eq(0).addClass('active') : $activedot.next().addClass('active'); 
                 
        } 

        self.scrollWrapper('next', 1);

      }, self.options.interval);
    },

    scrollWrapper: function(direction, jumpsize, dragoffset, easingfunction) {
      var self = this;
      var touchoffset = dragoffset || 0;
      var easing = easingfunction || 'swing';

      window.clearTimeout(self.autoplaying);

      if (jumpsize != 0) {
        // rewrite with slideindex? -> could jump to 0 on resize
        // console.log(direction + ' ' + jumpsize);
        var xoffset = 0;
        var $disengagingSlide = self.$slides.filter('.disengage');

        if (self.options.leftaligned && self.options.jumpback && self.$slides.eq(0).hasClass('active') && self.$slides.eq(-1).hasClass('disengage')) {
          for (var x=0; x<self.$slides.length-1; x++) {
            xoffset -= self.$slides.eq(x).innerWidth()*-1;   
          }
        // TODO: rewrite with jumpsize, ditch direction 
        } else if (self.options.leftaligned) {
          xoffset = (jumpsize > 0 ? -$disengagingSlide.innerWidth() : self.$slides.filter('.active').innerWidth());
        
        } else { //centered
          for (j = 0; j <= Math.abs(jumpsize); j++) {        
            // console.log($slides.index($slides.eq($slides.index($disengagingSlide))));
            // console.log($slides.index($disengagingSlide));
            // get total offset by iterating through slides between disengaging and active slides
            // add only half disengaging and active slides' width
            xoffset += (self.$slides.eq(self.$slides.index($disengagingSlide) + j * (jumpsize > 0  ? 1 : -1 )).innerWidth()/(j==0 || j==Math.abs(jumpsize) ? 2 : 1) * (jumpsize > 0  ? -1 : 1 ));
          }
        }
      } else { // jumpsize == 0
        xoffset = 0;
      }

      self.leftPosition = self.$wrapper.position().left + xoffset - touchoffset;

      // move slide and callback
      self.$wrapper.animate({
        'left': self.leftPosition
      }, self.options.speed, easing, function() {

        // reapply click handlers
        self.addEventHandlers();

        self.refreshSlides();
        self.refreshImages();
      
        // reorder slides
        if (jumpsize > 0 && self.options.cycle) {
          self.leftPosition += self.$slides.eq(0).innerWidth()
          self.$wrapper.css('left', self.leftPosition );
          self.$slides.eq(0).appendTo(self.$wrapper);
        } else if (jumpsize < 0 && self.options.cycle) {
          self.leftPosition -= self.$slides.eq(-1).innerWidth()
          self.$wrapper.css('left', self.leftPosition);
          self.$slides.eq(-1).prependTo(self.$wrapper);
        }

        // handle jumpback option
        if (self.options.jumpback) {
          if (self.$slides.eq(-1).hasClass('active')) {
            self.$clickwrappers.find('.skidder-next').addClass('jumpback');
          } else {
            self.$clickwrappers.find('.skidder-next').removeClass('jumpback');
          }
        } 

        if (self.options.autoplay) {
          self.autoplaying = self.autoplay();
        }
      });

      self.$slides.removeClass('disengage');

    },

    centerPosition: function() {  
      // console.log('[centerPosition]');
      var self = this;

      if (self.options.leftaligned) {
        // self.$wrapper.css('margin-left', (self.$viewport.innerWidth() - 940)/2 -35); // TODO
        self.$wrapper.css('margin-left', Math.max(0, self.$viewport.innerWidth() - self.options.maxSlideWidth)/2); 
      } else {
        var leftmargin = (self.$viewport.innerWidth() - self.$slides.filter('.active').innerWidth())/2; 
        self.$wrapper.css('margin-left', leftmargin);
      }
    },

    setSlideshowHeight: function(newMaxHeight) {
      var self = this;
      // note: skidder-clickelements don't need to be sized if it weren't for #%@&% IE8
      self.$elem.add(self.$viewport).add(self.$wrapper).add(self.$viewport.find('.skidder-clickelement')).css('height', newMaxHeight);
    },

    refreshSlides: function() {
      var self = this;
      self.$slides = self.$wrapper.find('.skidder-slide');
    },

    refreshImages: function() {
      var self = this;
      self.$images = self.$slides.find('img'); // find images
      if (!self.$images.length) {
        self.$images = self.$slides; // if no images use slides
      }
    },

    resize: function() {
      // console.log('resize');
      var self = $(this).data('skidder');

      if (self && self.options ) { // make sure skidder has been attached for ie8, who fires resize on page load
        if (self.options.scaleSlides) {
          self.scaleSlides();
        }
        self.centerPosition();
      }     
    }
  }

  $.fn.skidder = function(options) {
    var method = arguments[0];

    if(Skidder[method]) {
      method = Skidder[method];
      arguments = Array.prototype.slice.call(arguments, 1);
      return this.each(function(){
        method.apply(this, arguments);  
      });
    } else if( typeof(method) == 'object' || !method ) {
      return this.each(function() {
        var skidder = Object.create(Skidder);
        skidder.init(options, this);
      });
    }
  };

  $.fn.skidder.options = {
    slideClass    : '.slide',
    scaleSlides   : true,
    maxSlideWidth : 800,
    maxSlideHeight: 500,
    paging        : true,
    swiping       : true,
    leftaligned   : false,
    cycle         : true,   
    jumpback      : false,
    speed         : 400,
    autoplay      : false,
    interval      : 4000
  };

  $.extend($.easing, { 
    easeOutSkidder: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
  });


   

}(jQuery, window, document));
