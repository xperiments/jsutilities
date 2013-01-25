# Utilities

## extend: jQuery.extend without the jQuery

## EventDispatcher.js

Extremely useful class for building event-driven applications. This one is based on the design by [Nicholas Zakas](http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/).

### Usage

	var MyClass = function() {
		util.EventDispatcher.call(this); // inherit the EventDispatcher class
		
		// define public properties below the call invocation
		this.publicVar = 42;
		var privateVar = 0;
		
		this.myPublicMethod = funciton() { }
		function myPrivateMethod() { }
	};
Note that you cannot return an object in the class closure, but instead use <this> to expose public properties.
