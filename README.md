#Skidder

A jQuery slideshow pugin that supports centering, swiping and responsive scaling.

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
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="../src/jquery.skidder.js"></script>
<script>
  $('.slideshow').skidder();
</script>
```

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
| scaleImages     | Scales widest image to maxSlideWidth. Adjusts slideshow height accordingly. Requires images! _Default: false_     |
| maxSlideWidth   | Scale widest image to this width if scaleImages == true. _Default: 800_   |
| paging          | Creates a clickable and stylable paging dot for each slide. _Default: true_    |
| swiping         | Enable swiping on touch device. _Default: true_    |
| leftaligned     | Set to true if you don't want your slideshow centered. (true = buggy!) _Default: false_    |
| cycle           | Set to false if you don't want your slideshow to wrap around (false = buggy!). _Default: true_    |
| jumpback        | In non-cycling mode jumpback will display a 'return to first slide' arrow at the last slide. Default: false    |
| speed           | Transition speed. _Default: 400_    |
| autoplay        | _Default: false    |
| interval        | Autoplay interval _Default: 4000    |


###Styling

Default styles are included in jquery.skidder.css - change at will.

##To Do
- test and debug leftalign (align to viewport or maxSlideWidth?)/ non-cycle (disable event handlers for first and last slide) / jumpback options
- adapt swipehandler to nocycle
- make click cancel autoplay
- DRY click/swipe/autoplay events
- use requestAnimationFrame
- fold (optional) smartresize into skidder
- ~~proper swiping~~
- properly bottom-align paging
- adapt speed to slide width
- ~~don't initialise if <2 images~~
- callback functions


##Credits and license

###Author
Georg Lauteren for null2
[georg.null2.net](http://georg.null2.net)  
[twitter.com/_gl03](http://twitter.com/_gl03)

###License
Licensed under the [MIT License](http://opensource.org/licenses/MIT)