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
class EventDispatcher {
	
	/**
	 * @private
	 * @this Object
	 */
	private _eventList:any;
	
	constructor() {
		this._eventList = {};
	}
	
	/**
	 * Excecutes the callback function that was defined by caller's addEventListener call.
	 * @param {Object} evt The event object that will be passed to the listener. Format should follow this convention:
	 * 		evt = { type:'load', target:_self, param2:'', ... }
	 */
	public trigger(evt:any):void {
		var type:string = evt.type;
		if (typeof type !== 'string' || typeof this._eventList[type] === 'undefined') {
			return;
		}

		var i:number = 0, length:number = this._eventList[type].length;
		while (i < length) {
			if (typeof this._eventList[type][i] != 'function') {
				continue;
			}
			this._eventList[type][i](evt);
			i++;
		}
	}

	/**
	 * 'addListener' is used to save some typing, but mostly to distinguish this class from the DOM variant.
	 * @param {string} type 		Event tag.
	 * @param {function} listener 	Callback to fire when this event type is triggered.
	 */
	public addListener(type:string, listener:(evt)=>void):void {
		if (typeof this._eventList[type] === 'undefined') {
			this._eventList[type] = [];
		}
		this._eventList[type].push(listener);
	}

	/**
	 * Removes a specific listener instance/callback.
	 * @param {string} type 		Event tag.
	 * @param {function} listener 	Callback that was associated with this event type.
	 */
	public removeListener(type:string, listener:(evt)=>void):void {
		if (typeof this._eventList[type] === 'undefined') {
			return;
		}
		var listeners:any[] = this._eventList[type],
        	i:number = 0, l:number = listeners.length;
        while (i < l) {
            if (listeners[i] === listener){
                listeners.splice(i, 1);
                break;
            }
            i++;
        }
	}
	
	/**
	 * Removes all listeners of a particular type. Removes their reference but the type list
	 * is merely reduced to 0 elements, so it doesn't have to create a new array if a listener
	 * of type is added later.
	 * To completely delete all listeners (AND types), use removeAllListeners.
	 * @param {type} type Event tag to clear.
	 */
	public removeListenersOfType(type:string):void {
		this._eventList[type].length = 0;
	}
	
	/**
	 * Dangerous method! Nullifies all listeners and all types, leaving a completely empty event list.
	 * This should only be run when the subclass is being cleaned up, at the end of its lifecycle.
	 */
	public removeAllListeners():void {
		var type:string, typeList;
		for (type in this._eventList) {
			this._eventList[type] = null;
			delete this._eventList[type];
		}
	}
	
	/**
	 * Test to see if an object has any listeners attached to a particular event type.
	 * @param {string} type 	Event tag to clear.
	 * @return {boolean}
	 */
	public hasListener(type:string):bool {
		return typeof this._eventList[type] !== 'undefined';
	}
}