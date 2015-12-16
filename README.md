#Skidder

A flexible jQuery slideshow plug-in that supports centering, swiping and responsive scaling.

##Features
- optional paging
- optional cycling
- optional centering
- optional image scaling, also on resize
- iOS-like swiping on touch devices
- works with: Chrome, Firefox, Safari, IE8+ ...

##Usage

###Setup
```html
<link rel="stylesheet" href="../src/jquery.skidder.css">
...
<div class="slideshow" style="display: none;">
  <div class="slide"><img src="1.jpg"></div>
  <div class="slide"><img src="2.jpg"></div>
  <div class="slide"><img src="3.jpg"></div>
</div>
...
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="../src/jquery.skidder.js"></script>
<script>
  $('.slideshow').skidder();
</script>
```

The slide divs can take an optional data-href attribute for links on mobile.

Make sure that images are loaded before initialising the plug-in, or the slideshow might not get sized correctly. You can use [imagesloaded.js](https://github.com/desandro/imagesloaded) for this purpose - load it, then call like this:

```js
$('.slideshow').each( function() {
  var $slideshow = $(this);
  $slideshow.imagesLoaded( function() {
    $slideshow.skidder();
  });
});
```
All controls are hidden for slideshows with only one image, but Skidder will still scale the image properly.

###Resizing

Bind this call to your resize, orientationchange, whatever event:

```js
$('.slideshow').skidder('resize');
```

It is highly recommended to debounce this to save some trees, e.g. with Paul Irish's [smartresize](http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/), which you can use like this:

```js
  $(window).smartresize(function(){
    $('.slideshow').skidder('resize');
  });
```

###Transitions 

Skidder supports two modes of animating the slide transition ("animationType" option): CSS and jQuery animate. Using CSS mode is recommended for performance reasons. CSS obviously requires that the browser support CSS transitions, if not, Skidder will switch to 'animate' mode. Both modes require requestAnimationFrame, which is polyfilled for older browsers.

Skidder offers two types of transitions ("transition" option): slide and fade. Fade always animates using CSS. Regardless of the transition selected, touch devices will always use the 'slide' transition, unless swiping is set to false. Note that for now the fade transition requires images of equal size.

###Viewport and Scaling

Skidder has a number of options to deal with various image sizes, desired viewport layout, and responsivness:

- 'scaleSlides' determines if slides are displayed as they are (styled only via css), or if the are scaled programmatically (via inline css properties) to fit certain dimensions. If you just need a simple slideshow with equally sized images you can turn off scaling altogether and handle responsiveness via css if needed. If you have to deal with various image formats or mix image- and non-image slides, scaling will help you out. It uses the following options:
- 'scaleTo' can be either "smallest", or an array consisting of two numbers [x, y]. "smallest" will scale all your images to the height of your smallest (ie. least tall) image, as well as set the slideshow's height accordingly. Take note that adding one 5px tall image to a slideshow will render the entire slideshow 5px tall. an array of two numbers (e.g. [16, 9]) will determine the aspect ratio of the slide show, ie. its height relative to its given width. images will be scaled to fill the viewport, ie. for wider images left and right edges will be hidden, top and bottom edges for taller images.   
-  there are times when you need to keep the bottom and top edges of tall images. that's what "preservePortrait' is for: if set, any image less wide than the specified ration will be sized to fit. 
- 'maxWidth' and 'maxHeight' are here to limit the dimension of the slide show. If set to "none" or 0, no limitation is applied in that direction.

Scaling always manipulates the first image in the slide element. If you want to include more images in a slide (for overlays etc), make sure to place them after the primary image tag.  

If you are using image-less divs without scaling, you will have to set the height of the slides with css, or 

###Lazy Loading



###Styling

Default styles are included in jquery.skidder.css - change at will.
For non-scaling non-image slides (i.e. slides without an explicit img tag), make sure they have initial dimensions, e.g. through provided width and height css properties. For scaling non-image slides set intiSlideWidth and intiSlideheight instead.


###Options
| Option          | Description   |
| ------------- | ------------- |
| slideClass      | Class of the slide element. Please include leading ".". _Default: ".slide"_     |
| animationType   | skidder supports css animations and jquery animate ones. Possible values 'animate', 'css'  _Default: 'animate'_     |
| lazyLoad        | _Default: false_     |
| lazyLoadAutoInit | _Default: true_     |
| lazyLoadWindow  | _Default: 1_ |
| scaleSlides     | Scales slides (via css) to uniform values, depending on maxWidth, maxHeight, and scaleTo settings  Requires images! _Default: true_     |
| scaleTo         | Defines the scaling mode of scaleSlides. At the moments there are two modes: Scale to smallest, and ratio (responsive) mode. Possible values: "smallest" - height of the least tall image determines height of slideshow. _[x, y]_ – an array of two number defining a ratio for the slide show. _Default: "smallest"_ |
| maxWidth        | Limit width of slideshow to this value. Set to 0 or "none" to not limit. _Default: 800_   |
| maxHeight       | Limit height of slideshow to this value. Set to 0 or "none" to not limit. _Default: 500_    |
| preservePortrait | Only for ratio mode: Determines wether images that are less wide than the current ratio will fill the viewport, having their top and bottom cropped ("false"), or fit the viewport, leaving room to the sides ("true"). _Default: false_  |
| paging          | If true, Skidder looks for an element _pagingWrapper_ containing element _pagingElement_ to use for paging. if one or both of them are missing, it creates them. Note: paging false is ignored on touch devices (but you can hide it via css) _Default: true_  |
| pagingWrapper   | custom class name for creating or finding the pager wrapping div _Default: '.skidder-pager'_     |
| pagingElement   | custom class name for creating or finding the pager dots _Default: '.skidder-pager-dot'_     |
| swiping         | Enable swiping on touch device. _Default: true_ Note: If enabled touch devices will always use the 'slide' transition  |
| leftaligned     | Set to true if you don't want your slideshow centered. (true = buggy!) _Default: false_    |
| cycle           | Set to false if you don't want your slideshow to wrap around (false = buggy!). _Default: true_    |
| jumpback        | In non-cycling mode jumpback will display a 'return to first slide' arrow at the last slide. Default: false    |
| speed           | Transition speed. _Default: 400_    |
| autoplay        | _Default: false_    |
| autoplayResume  | Resume autoplay after interaction  _Default: false_  |
| interval        | Autoplay interval _Default: 4000_    |
| transition      | 'slide' or 'fade' _Default: 'slide'_ Note: If swiping is enabled, touch devices will always use the 'slide' transition   |
| directionClasses | adds classes 'left-from-active' and 'right-from-active' to slides after transition is complete. useful for triggering e.g css transitions on particular slide elements. costs a little performance so leave inactive if not needed. _Default: false_     |
| afterSliding    | function called after changing slides    |
| afterInit       | function called after Skidder is initialised    |
| afterResize     | function called after Skidder resize is triggered and complete   |



##Roadmap
- ~~lazy loading~~
- outerPaging option (find paging element in next sibling element to slideshow)
- ~~use requestAnimationFrame or optional pure css transitions to improve performance~~
- test and debug leftalign (align to viewport or maxSlideWidth?)/ non-cycle (disable event handlers for first and last slide) / jumpback options
- adapt swipehandler to nocycle
- ~~make click cancel autoplay~~
- DRY click/swipe/autoplay events
- fold (optional) smartresize into skidder
- ~~proper swiping~~
- better bottom-align paging
- adapt speed to slide width
- ~~disable controls, paging and autoplay for less than 2 images~~
- ~~callback functions~~
- stepsize option for larger jumps (best responsive)
- option for custom easing functions
- allow to move multiple slides in one swipe
- <=IE9 does not support CSS transitions: css mode should fall back to animate for these browsers
- ~~polyfill rAF~~
- test with scaling no-image slides that contain a not-scaling image, possibly:

| noScaleClass    | Set this on images contained within the slide div that you don't want to be scaled. Please include leading ".". _Default: ".skidder-no-scale"_     |


###Limitations
- ~~at the moment it's not possible to mix img and non-img slides~~
- ~~slides containing image tags other than the background image will break scaling~~ 
- fade transition requires images of equal size (TODO: rewrite center function)
 
##Credits and license

###Author
Georg Lauteren for null2
[georg.null2.net](http://georg.null2.net)
[twitter.com/_gl03](http://twitter.com/_gl03)
requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

###License
Licensed under the [MIT License](http://opensource.org/licenses/MIT)

###Sites that use Skidder

- http://null2.net
- http://www.wildbunch-germany.de
- http://b2b.berlinale.de
- http://dummy-magazin.de
