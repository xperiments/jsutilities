var util = util || {};
/**
 * Very useful custom event dispatcher class. Based on the same by Nicholas Zakas.
 * This version does not create objects after initialization, making it more performant and memory-friendly,
 * suitable for games. I also added two helpful functions: removeListenersOfType and removeAllListeners.
 * See github readme for example usage.
 * 
 * Original class by Zakas is at: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
 * 
 * @author Corey Birnbaum, Nicholas Zakas
 */
util.EventDispatcher = function() {
	
	/**
	 * @private
	 * @this Object
	 */
	var _eventList = {};

	/**
	 * Excecutes the callback function that was defined by caller's addEventListener call.
	 * @param {Object} e The event object that will be passed to the listener. Format should follow this convention:
	 * 		e = { type:'load', target:_self, param2:'', ... }
	 * @return {void}
	 */
	this.trigger = function (e) {
		var type = e.type;
		if (typeof type !== 'string' || typeof _eventList[type] === 'undefined') {
			return;
		}

		var length = _eventList[type].length;
		for (var i = 0; i < length; i++) {
			if (typeof _eventList[type][i] != 'function') {
				continue;
			}
			_eventList[type][i](e);
		}
	};

	/**
	 * 'addListener' is used to save some typing, but mostly to distinguish this class from the DOM variant.
	 * @param {string} type 		Event tag.
	 * @param {function} listener 	Callback to fire when this event type is triggered.
	 */
	this.addListener = function (type, listener) {
		if (typeof _eventList[type] === 'undefined') {
			_eventList[type] = [];
		}
		_eventList[type].push(listener);
	};
	
	/*this.addListenerOnce = function (type, listener) {
		if (typeof _eventList[type] === 'undefined') {
			_eventList[type] = [];
		}
		_eventList[type].push(listener);
	};*/
	
	/**
	 * Removes a specific listener instance/callback.
	 * @param {string} type 		Event tag.
	 * @param {function} listener 	Callback that was associated with this event type.
	 */
	this.removeListener = function (type, listener) {
		if (typeof _eventList[type] === 'undefined') {
			return;
		}
		if (_eventList[type] instanceof Array){
            var listeners = _eventList[type],
            	i = 0, l = listeners.length;
            while (i++ < l) {
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
	};
	
	/**
	 * Removes all listeners of a particular type. Removes their reference but the type list
	 * is merely reduced to 0 elements, so it doesn't have to create a new array if a listener
	 * of type is added later.
	 * To completely delete all listeners (AND types), use removeAllListeners.
	 * @param {type} type Event tag to clear.
	 */
	this.removeListenersOfType = function (type) {
		_eventList[type].length = 0;
	};
	
	/**
	 * Dangerous method! Nullifies all listeners and all types, leaving a completely empty event list.
	 * This should only be run when the subclass is being cleaned up, at the end of its lifecycle.
	 */
	this.removeAllListeners = function () {
		var type, typeList;
		for (type in _eventList) {
			_eventList[type] = null;
			delete _eventList[type];
		}
	};
	
	/**
	 * Test to see if an object has any listeners attached to a particular event type.
	 * @param {string} type 	Event tag to clear.
	 * @return {boolean}
	 */
	this.hasListener = function(type) {
		return _eventList[type] != null;
	};
	
	this.toString = function() {
		return '[object EventDispatcher]';
	};
};