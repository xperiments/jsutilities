var util = util || {};
/**
 * Check if a style exists in the document passed.
 * @param {type} doc 		The document to check.
 * @param {type} className 	The exact match of the rule to check for. eg `#thing` will not match `#thing .subthing`.
 */
util.hasStyle = function(doc, className) {
    // console.log('[util.hasStyle] Checking for a style...');
    var s, i, x, classes,
    	l = doc.styleSheets.length;
    for (i = 0; i < l; i++) {
    	s = doc.styleSheets[i];
    	classes = s.rules || s.cssRules;
	    for (x = 0; x < classes.length; x++) {
	        if (classes[x].selectorText == className) {
				return true;
	        }
	    }
    }
    return false;
};

/**
 * Append a rule to the stylesheet in the passed document. If a stylesheet doesn't exist, one will be created.
 * @param {type} doc  	The document to append the rule to.
 * @param {type} rule 	The full rule to add, eg `.my-class { display:inline-block; margin:0px; }`.
 */
util.insertRule = function(doc, rule) {
	var sliceTo = rule.indexOf('{');
	var styleRule = rule.slice(0, sliceTo-1);
	// don't duplicate styles
	if (util.hasStyle(doc, styleRule)) {
		console.log('[util.insertRule] That document already has that rule');
		return;
	}
	// console.log('[util.insertRule] Inserting '+rule);
	if (doc.styleSheets.length == 0) {
		// console.log('[util.insertRule] Creating style element');
		var style = doc.createElement('style');
		style.type = 'text/css';
		var head = doc.getElementsByTagName('head')[0];
		head.appendChild(style);
		
		var styleTags = head.getElementsByTagName('style');
		console.log(styleTags.length);
	}
	
	var head = doc.getElementsByTagName('head')[0];
	var styleTags = head.getElementsByTagName('style');
	
	var styleSheet = doc.styleSheets[doc.styleSheets.length-1];
	var rules = styleSheet.cssRules || styleSheet.rules;
	styleSheet.insertRule(rule, rules.length);
};
