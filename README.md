# Utilities

## util.extend: jQuery.extend without the jQuery

## loader

Tiny, efficient image loading class. No error checking yet tho. Or maybe you can add it?

### Usage

	window.addEventListener('load', function init() {
		window.removeEventListener('load', init);
		
		// yup, it's just an object, not a function, so no need to call 'new'! BONUS
		loader.addImage('img/thing.png');
		loader.addImage('img/otherthing.png');
		loader.addImage('img/coolObjectSprite.png');
		
		// optional
		loader.onImageProgress = function(percent) {
			console.log('[index.html] Image loading '+percent+'% complete');
			// insert loading graphic update here or whatever
		};
		
		loader.onImagesLoaded = function() {
			console.log('[index.html] Images 100% loaded');
			
			// once complete you can retreive your resources through loader.images which is just an object
			// with the filename as the key and the image itself as the value
			coolObject.init( loader.images['coolObjectSprite'] );
		};
		
		// kick it off. note that you can simply add more in later and do this again without a problem
		// so if you wanted to only download images on a per-level basis in your game, you can totally do that
		loader.start();
	});
That's it. I like it.

## EventDispatcher.js

Extremely useful class for building event-driven applications. This one is based on the design by [Nicholas Zakas](http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/).

TypeScript version is available as well. To use it, simply extend it and call this.trigger(eventObject). Otherwise it's exaclty the same.

### Usage

	var MyClass = function() {
		// always inherit the EventDispatcher class at the top
		util.EventDispatcher.call(this);
		
		// define public properties below
		this.publicVar = 42;
		
		var _self = this,
			_freshness = {something:'interesting'},
			_privateEventObj = {
				type: '',
				target: _self,
				data: null
			};
		
		this.myPublicMethod = funciton() {
			setTimeout(_onComplete, 500);
		}
		
		function _onComplete() {
			// update our scratch object with fresh data
			_privateEventObj.type = 'load';
			_privateEventObj.data = _freshness;
			// fire off the event to any listeners of 'load'
			this.trigger(_privateEventObj);
		}
	};
Note that you cannot return an object in the class closure, but instead use 'this' to expose public properties.

Then in another class, use it as expected:

	function init() {
		var mc = new MyClass();
		mc.addListener('load', function(evt) {
			console.log(evt.data); // outputs what was in _freshness
		});
		ms.myPublicMethod();
	}
