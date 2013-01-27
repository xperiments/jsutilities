var util = util || {};
/**
 * jQuery.extend() without jQuery, placed in global scope with supporting/useful functions in the util namespace.
 */
(function() {
	/****
	 private support objects that i don't want hanging around in this namespace */
	var class2type = {},
		listOfClasses = "Boolean Number String Function Array Date RegExp Object Error".split(" "),
		core_toString = class2type.toString,
		core_hasOwn = class2type.hasOwnProperty;
	var checkType = function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	};
	var isEmptyObject = function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	};
	listOfClasses.forEach(function(name, i) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	/* end privates
	 ****/


	/**
	 * Merge the contents of two or more objects together into the first object.
	 * @see http://api.jquery.com/jQuery.extend/
	 * @param [deep] 			If true, the merge becomes recursive (aka. deep copy). Default is TRUE.
	 * @param target			An object that will receive the new properties if additional objects are passed in.
	 * @param [object1..N] 		An object containing additional properties to merge in. Can list any additional objects containing properties to merge in.
	 * @returns target 		The modified target object.
	 */
	util.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = true;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && checkType(target) !== "function" ) {
			target = {};
		}

		while (i < length) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( util.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];

						} else {
							clone = src && util.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = util.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
			i++;
		}

		// Return the modified object
		return target;
	};

	util.isWindow = function( obj ) {
		return obj != null && obj == obj.window;
	};

	util.isNumeric = function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	};

	util.isPlainObject = function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( checkType( obj ) !== "object" || obj.nodeType || util.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox >16
		// The try/catch supresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	};
}());