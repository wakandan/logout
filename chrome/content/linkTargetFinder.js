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
            var expressions = new Array();			
			var keywords = new Array();
			keywords.push("Logout");
			keywords.push("Log out");
			keywords.push("Sign out");
			keywords.push("Signout");
			keywords.push("Log Off");


			//find all the links first
			var xPath_expression = "";
			for(var i = 0; i<keywords.length; i++){
				if(i==0){
					xPath_expression += ("contains(.,'" + keywords[i] + "')");
				}else{
					xPath_expression += (" or contains(.,'" + keywords[i] + "')");
				}
			}		            
			var exp = "//a/text()["+xPath_expression+"]";
            expressions.push(exp);


			//find all element that can be used to sign out
			var xPath_expression = "";
			for(var i = 0; i<keywords.length; i++){
				if(i==0){
					xPath_expression += ("@value='" + keywords[i] + "'");
				}else{
					xPath_expression += (" or @value='" + keywords[i] + "'");
				}
			}
			exp = "//*["+xPath_expression+"]";	
            expressions.push(exp);
           
            var expression = expressions.join(" | ");
            Firebug.Console.log(expression);

			var nodes = content.document.evaluate(expression, content.document, null, XPathResult.ANY_TYPE, null);

			var x = nodes.iterateNext();
			while(x!=null){			
				//first try
                try{                    
    				content.document.location = x.parentNode.attributes['href'].value;
                } catch(e){
                    Firebug.Console.log(e);
                }
				
				//second try
                try{
                    x.click();
                }catch(e){
                    Firebug.Console.log(e);
                }

                //third try
                try{
                    x.parentNode.click();
                }catch(e){
                    Firebug.Console.log(e);
                }
				x = nodes.iterateNext();
			}
		}
	};
}();
window.addEventListener("load", linkTargetFinder.init, false);
