var linkTargetFinder = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
		init : function () {
			gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
				if (autoRun) {
					linkTargetFinder.run();
				}
			}, false);
		},
			
		run : function () {
			//only works with google for now
			//var link = content.document.getElementById("gb_71");
			//content.document.location = link.attributes['href'].value;
			var keywords = new Array();
			keywords.push("Logout");
			keywords.push("Log out");
			keywords.push("Sign out");
			keywords.push("Signout");

			//find all the links first
			var xPath_expression = "";
			for(var i = 0; i<keywords.length; i++){
				if(i==0){
					xPath_expression += ("contains(.,'" + keywords[i] + "')");
				}else{
					xPath_expression += (" or contains(.,'" + keywords[i] + "')");
				}
			}		
			var nodes = content.document.evaluate(
							"//a/text()["+xPath_expression+"]", 
							content.document, 
							null, 
							XPathResult.ANY_TYPE, 
							null);
			var x = nodes.iterateNext();
			while(x!=null){			
				Firebug.Console.log(x.parentNode.attributes['href'].value);	
				//first try
				content.document.location = x.parentNode.attributes['href'].value;
				
				//second try
				x.parentNode.click();
				x = nodes.iterateNext();
			}

			//find other type of nodes that can be clicked			
						
		}
	};
}();
window.addEventListener("load", linkTargetFinder.init, false);
