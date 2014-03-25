#Skidder

A jQuery slideshow pugin that supports centering, swiping and responsive scaling.

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

Make sure that they are loaded before initialising the plug-in, or the slideshow might not get correctly sized. You can use [imagesloaded.js](https://github.com/desandro/imagesloaded) for this purpose - load and call like this:

```js
$('.slideshow').each( function() {  
  var $slideshow = $(this);
  $slideshow.imagesLoaded( function() {
    $slideshow.skidder();
  });
});
```

###Resizing
```js
$('.slideshow').skidder('resize');
```

You will want to debounce this to save some trees, e.g. with Paul Irish's [smartresize](http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/)

###Options
| slideClass      | Default: '.slide'     |
| scaleImages     | Scale widest image to maxSlideWidth. Adjust slideshow height accordingly. Requires images! Default: false     |
| maxSlideWidth   | Scale widest image to this width if scaleImages == true. Default: 800   |
| paging          | Creates a clickable and stylable paging dot for each slide. Default: true    |
| swiping         | Enable swiping on touch device. Default: true    |
| leftaligned     | Set to true if you don't want your slideshow centered. Default: false    |
| cycle           | Set to false if you don't want your slideshow to wrap around (false = buggy!). Default: true    |
| jumpback        | In non-cycling mode jumpback will display a 'return to first slide' arrow at the last slide. Default: false    |
| speed           | Transition speed. Default: 400    |

###Styling

Default styles are included in jquery.skidder.css - change at will.

##To Dos
- autoplay
- use requestAnimationFrame
- fold (optional) smartresize into skidder
- ~~proper swiping~~
- bottom-align paging
- adapt speed to slide width
- ~~don't initialise if <2 images~~
- callback functions
- adapt swipehandler to nocycle

##Credits and license

###Author
Georg Lauteren for null2
[georg.null2.net](http://georg.null2.net)  
[twitter.com/_gl03](http://twitter.com/_gl03)

###License
Licensed under the [MIT License](http://opensource.org/licenses/MIT)