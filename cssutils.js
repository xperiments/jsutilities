var bit = bit || {};
bit.util = bit.util || {};

bit.util.hasStyle = function(doc, className) {
    console.log('[bit.util.hasStyle] Checking for a style...');
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
}

bit.util.insertRule = function(doc, rule) {
	var sliceTo = rule.indexOf('{');
	var styleRule = rule.slice(0, sliceTo-1);
	// don't duplicate styles
	if (bit.util.hasStyle(doc, styleRule)) {
		console.log('[bit.util.insertRule] That document already has that rule');
		return;
	}
	console.log('[bit.util.insertRule] Inserting '+rule);
	if (doc.styleSheets.length == 0) {
		console.log('[bit.util.insertRule] Creating style element');
		var style = doc.createElement('style');
		style.type = 'text/css';
		var head = doc.getElementsByTagName('head')[0];
		head.appendChild(style);
		
		var styleTags = head.getElementsByTagName('style');
		console.log(styleTags.length);
	}
	console.log('[bit.util.insertRule] Style elements: '+doc.styleSheets.length);
	
	var head = doc.getElementsByTagName('head')[0];
	var styleTags = head.getElementsByTagName('style');
	console.log(styleTags);
	console.log(styleTags.length); // <--- SHOULD BE 1
	// console.log(doc.styleSheets);
	
	var styleSheet = doc.styleSheets[doc.styleSheets.length-1];
	var rules = styleSheet.cssRules || styleSheet.rules;
	console.log('[bit.util.insertRule] rules '+rules);
	styleSheet.insertRule(rule, rules.length);
	console.log('[bit.util.insertRule] Injection complete ');
}
