/**
 * A simple and efficient image loading mechanism with just enough features.
 * The idea is to be able to load different types of assets, all within a single
 * namespace ('loader'), in a sort of mixin way.
 * There's no reason for this to be a class--this is much nicer to deal with as a global object.
 * 
 * @author Corey Birnbaum
 */
var loader = loader || {};
(function() {

/**
 * Public object that stores loaded json as values, with their filename (sans extension) as keys.
 * 
 */
loader.json = {};
/**
 * Callback that fires when all images are loaded--replace this property with an actual function.
 * Launch your app within this callback, then pick up your resources according to filename from
 * loader.images at any time in any context.
 * It will still pass in loader.images as the sole parameter tho, in case that's your thing.
 */
loader.onJSONLoaded = null;
/**
 * Callback that fires when an image is loaded. Used for loading bars.
 * It passes in a normalized number according to loaded/total, 0 - 1.
 */
loader.onJSONProgress = null;
/**
 * TODO
 * Set this to the number of resources you want to process in parallel.
 */
// loader.runParallel = 1;

// @private
var _loaded = 0, _total = 0, _queue = [];

/**
 * Add an image to load by passing in its URL.
 * @param url The location of the resource to load.
 */
loader.addJSON = function(url) {
	_queue.push(url);
	_total++;
};

/**
 * Once images have been added to the queue, kick off the load process to download
 * each in sequence.
 */
loader.startJSON = function() {
	_loaded = 0;
	console.log('JSON files to load: '+_total);
	if (_total > 0) {
		_queue.reverse(); // reversed so we can pop elements in order, which is safer/cheaper than shifting
		processQueue();
	}
};

/**
 * Creates the objects and sets them up for loading.
 * @private
 */
var processQueue = function() {
	var nextURL = _queue.pop(),
		tag = nextURL.split('/'),
		req = new XMLHttpRequest();
	
	tag = tag[tag.length-1]; // get file name
	// but without extension...
	tag = tag.split('.');
	tag.pop(); // remove the extension
	tag = tag.join('.'); // bring it back together, sans extension
	
	// now we have a filename that can include periods
	req.tag = tag;
	// console.log('loading json '+req.tag);
	
	// req.addEventListener("progress", onJSONProgress, false);
	req.addEventListener("load", onJSONComplete, false);
	req.addEventListener("error", onJSONError, false);
	req.addEventListener("abort", onJSONError, false);
	// kick off the download
	req.open('GET', nextURL, true);
	req.send();
};

/**
 * Cleans up and checks conditions.
 * @private
 */
var onJSONComplete = function(evt) {
	_loaded++;
	// console.log(this);
	
	this.removeEventListener('load', onJSONComplete);
	this.removeEventListener('error', onJSONError);
	this.removeEventListener('abort', onJSONError);
	
	loader.json[this.tag] = JSON.parse(this.responseText);
	
	if (_loaded == _total) {
		_total = 0; // in case there's a next time
		if (typeof loader.onJSONLoaded === 'function') {
			loader.onJSONLoaded(loader.json);
		}
	} else {
		processQueue();
		if (typeof loader.onJSONProgress === 'function') {
			// 0-1 at 1/100th decimal point, eg 0.34, 0.66, etc
			// var percentage = parseInt(_loaded/_total*100)/100;
			// loader.onImageProgress(percentage);
		}
	}
};

var onJSONError = function(evt) {
	console.log(evt);
	this.removeEventListener('load', onImageComplete);
	this.removeEventListener('error', onJSONError);
	this.removeEventListener('abort', onJSONError);
};
}());