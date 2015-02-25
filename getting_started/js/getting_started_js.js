(function()
{
	$(onReady);
	
	var scriptText,
		addZoomText,
		addZoomJSText,
		templateText,
		optionsText,
		controlCssText,
		customHtmlText,
		customCssText,
		controlOptionsText,
		apiHtmlCodeText,
		apiCodeText;  
		
	function onReady()
	{
		$("#scaleModeSel, #divWidthSel, #divHeightSel, #showBorderCheck").on("change", onChange);
		
		scriptText = $("#scriptCode").text();
		addZoomText = $("#addZoomCode").text();  
		addZoomJSText = $("#addZoomJSCode").text();  
		templateText = $("#templateCode").text();  
		optionsText = $("#optionsCode").text();  
		controlCssText = $("#controlCssCode").text();  
		customHtmlText = $("#customHtmlCode").text();  
		customCssText = $("#customCssCode").text();  
		controlOptionsText = $("#controlOptionsCode").text();  
		apiHtmlCodeText = $("#apiHtmlCode").text();  
		apiCodeText = $("#apiCode").text();  
		
		onChange();
	}
	
	function onChange(e)
	{
		var duration = (e === undefined) ? 0 : 0.5,
			scaleMode = $("#scaleModeSel option:selected").val(),
			divWidth = $("#divWidthSel option:selected" ).val(),
			divHeight = $("#divHeightSel option:selected" ).val(),
			showBorder = $("#showBorderCheck").is(":checked"),
			div = $("#scaleExampleDiv"),
			img = $("<img id='scaleExampleImg' src='assets/1.jpg'/>"),
			heightWarningDiv = $("#heightWarning"),
			scaleModeIndex = $("#scaleModeSel")[0].selectedIndex,
			htmlCode = "<div style='width:" + divWidth + "; height:" + divHeight + ";'>\n   <img id='img1' src='assets/1.jpg' />\n</div>",
			jsCode = "var pzVars = { imageOptions:{ scaleMode:'" + scaleMode + "' } };\n$('#img1').pinchzoomer(pzVars);"
			scaleModeTexts = ["The value <strong><em>widthOnly</em></strong> is the default value. It takes the width of its container and proportionally resize its height. This is perfect for responsive sites.",
							  "The value <strong><em>heightOnly</em></strong> takes the height of its div container and proportionally resize its width. This is perfect for if you want the images to maintain a certain height.",
							 "Using the value <strong><em>none</em></strong> keeps the original size of the image. perfect if you dont want any resizing done but want zooming ability. ", 
							 "The <strong><em>proportionalInside</em></strong> value initially resize the image proportionally to fit inside its div container. ",
							  "The <strong><em>full</em></strong> value takes up the whole size of the container. This is great for showing a fullscreen"];
		
		PinchZoomer.remove("scaleExampleImg");
		div.empty();
		
		TweenMax.set(div, { width:divWidth, height:divHeight, border:"5px solid #FFF", backgroundColor:"#CCC", position:"relative", display:"block" } );
		
		div.append(img);
		//PinchZoomer.init("#scaleExampleImg", {imageOptions:{scaleMode:scaleMode}});
		$("#scaleExampleImg").pinchzoomer({imageOptions:{scaleMode:scaleMode}})
		var newImg = PinchZoomer.get("scaleExampleImg").image;
		if(showBorder)
		{
			TweenMax.set(div, { border:"5px solid #F00", backgroundColor:"#CCC" } );
			TweenMax.to(newImg, 1, { autoAlpha:0.7, delay:0.5 } );
		}
		
		var heightSet = false;
		if(scaleMode != "widthOnly" && scaleMode != "none" && divHeight == "auto")
		{
			heightWarningDiv.text(" Please specify height");
			heightSet = true;
		}
		else
		{
			heightWarningDiv.text("");
		}
		
		if(!heightSet)
		{
			if((scaleMode == "widthOnly" || scaleMode == "none") && divHeight != "auto")
			{
				heightWarningDiv.text(" auto is recommended for widthOnly and none");
			}
			else
			{
				heightWarningDiv.text("");
			}
		}
		
		$("#scaleModeCode").text(htmlCode);
		$("#scaleModeJSCode").text(jsCode);
		$("#scaleModeDesc").html(scaleModeTexts[scaleModeIndex]);
		$("#scriptCode").text(scriptText);
		$("#addZoomCode").text(addZoomText);
		$("#addZoomJSCode").text(addZoomJSText);
		$("#templateCode").text(templateText);
		$("#optionsCode").text(optionsText);
		$("#controlCssCode").text(controlCssText);
		$("#customHtmlCode").text(customHtmlText);
		$("#customCssCode").text(customCssText);
		$("#controlOptionsCode").text(controlOptionsText);
		$("#apiHtmlCode").text(apiHtmlCodeText);
		$("#apiCode").text(apiCodeText);
		
		prettyPrint();
	}
	
})();