#Skidder

A jQuery slideshow plug-in that supports centering, swiping and responsive scaling.

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
Sliding contriols are disabled for slideshows with less than two images.

###Resizing
```js
$('.slideshow').skidder('resize');
```

You will want to debounce this to save some trees, e.g. with Paul Irish's [smartresize](http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/).

###Options
| Option          | Description   |
| ------------- | ------------- |
| slideClass      | _Default: '.slide'_     |
| animationType   | skidder now supports css-only animations if you set animationType to 'css'.  _Default: 'animate'_     |
| scaleSlides     | Scales widest image to maxSlideWidth. Adjusts slideshow height accordingly. Requires images! _Default: false_     |
| maxSlideWidth   | Scale widest image to this width if scaleImages == true. _Default: 800_   |
| maxSlideHeight  |    |
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


###Styling

Default styles are included in jquery.skidder.css - change at will.

##To Do / Known Issues
- ~~use requestAnimationFrame or optional pure css transitions to improve performance~~
- test and debug leftalign (align to viewport or maxSlideWidth?)/ non-cycle (disable event handlers for first and last slide) / jumpback options
- adapt swipehandler to nocycle
- make click cancel autoplay
- DRY click/swipe/autoplay events
- fold (optional) smartresize into skidder
- ~~proper swiping~~
- properly bottom-align paging
- adapt speed to slide width
- ~~don't initialise if <2 images~~
- ~~callback functions~~
- at the moment not possible mixing <img> and non-img slides
- fade transition requires images of equal size (TODO: rewrite center function)

##Bugs
scaleSlides false cause slide divs to be misaligned

##Credits and license

###Author
Georg Lauteren for null2
[georg.null2.net](http://georg.null2.net)
[twitter.com/_gl03](http://twitter.com/_gl03)

###License
Licensed under the [MIT License](http://opensource.org/licenses/MIT)