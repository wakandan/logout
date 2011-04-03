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

            //put all the sign out signature into an array
			var keywords = new Array();
			keywords.push("Logout");
			keywords.push("Log out");
			keywords.push("Sign out");
			keywords.push("Signout");
			keywords.push("Log Off");

            //var logout_maping = {
            //    "sinprd0103.outlook.com": "/owa/logoff.owa"
            //};

            //Firebug.Console.log(logout_maping);
            //
            //var cur_host = content.location.hostname;
            //

            //try{
            //    var link = logout_maping[cur_host];
            //    var log_out_link = content.location.protocol + "//" + cur_host + link;
            //    alert(log_out_link);
            //    content.document.location = log_out_link;
            //}catch(e){
            //    Firebug.Console.log(e);
            //}
            

			//find all the links that looks like a sign out
            //constructing an xPath expression to recognize LINKS
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

            //constructing an xPath expression to recognize others, like FORM 
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
			var nodes = content.document.evaluate(expression, content.document, null, XPathResult.ANY_TYPE, null);


            //Create a button click event, copy from stack overflow. 
            //This method seems to work only on firefox.
            //example: http://www.howtocreate.co.uk/tutorials/javascript/domevents
            var event = content.document.createEvent("MouseEvents");
            event.initEvent("click", true, true, content.window, 0, 0, 0, 0, 0,  false, false, false, false,0, null);

            //loop over all the objects
			var x = nodes.iterateNext();
			while(x!=null){			

                try{
                    //try to manually click the link first. This should work most of the time
                    x.dispatchEvent(event);
                }catch(e){
                    Firebug.Console.log("Manually click failed", e);
                }

				//something that might clickable
                try{
                    x.click();
                }catch(e){
                    Firebug.Console.log("Second try failed", e);
                }

                //third try. In case it's form like in facebook
                try{
                    x.parentNode.click();
                }catch(e){
                    Firebug.Console.log("Third try failed", e);
                }
				//first try
                //try{                                       
                //    var tmp_href = x.parentNode.attributes['href'].value; 
    			//	content.document.location = tmp_href;
                //} catch(e){
                //    Firebug.Console.log(e);
                //}
				x = nodes.iterateNext();
			}
		}
	};
}();
window.addEventListener("load", linkTargetFinder.init, false);
