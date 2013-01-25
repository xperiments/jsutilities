# Utilities

## extend: jQuery.extend without the jQuery

## EventDispatcher.js

Extremely useful class for building event-driven applications. This one is based on the design by [Nicholas Zakas](http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/).

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
Note that you cannot return an object in the class closure, but instead use <this> to expose public properties.

Then in another class, use it as expected:

	function init() {
		var mc = new MyClass();
		mc.addListener('load', function(evt) {
			console.log(evt.data); // outputs what was in _freshness
		});
		ms.myPublicMethod();
	}
