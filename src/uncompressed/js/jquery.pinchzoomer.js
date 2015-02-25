/*!
 * VERSION: 1.0
 * DATE: 01-15-2014
 * 
 * PinchZoomer jQuery Plugin
 *
 * @license Copyright (c) 2014, Ron Feliciano. All rights reserved.
 * This work is subject to the terms at http://codecanyon.net/licenses
 * 
 * @author: Ron Feliciano
 * contact me through http://codecanyon.net/user/ronfeliciano/?ref=ronfeliciano
 **/
 
(function(window)
{
	var ua = navigator.userAgent;
	
	function Utils()
	{
		
	}
	
	Utils.isFirefox = ua.indexOf('firefox') >= 0;
	Utils.isAndroid = (ua.indexOf("Android") >= 0);
	Utils.androidVer = (Utils.isAndroid) ? parseFloat(ua.slice(ua.indexOf("Android")+8)) : null;
	
	Utils.objectToString = function(o)
	{
		var parse = function(_o)
		{
			var a = [], t;
			for(var p in _o)
			{
				if(_o.hasOwnProperty(p))
				{
					t = _o[p];
					if(t && typeof t == "object")
					{
						a[a.length]= p + ":{ " + arguments.callee(t).join(", ") + "}";
					}
					else 
					{
						if(typeof t == "string")
						{
							a[a.length] = [ p+ ": \"" + t.toString() + "\"" ];
						}
						else
						{
							if(t != null)
							{
								a[a.length] = [ p+ ": " + t.toString()];
							}
						}
					}
				}
			}
			
			return a;
		}
		
		return "{" + parse(o).join(", ") + "}";
	}
	
	Utils.getRealValue = function (str)
	{
		val = str;
		if(str !== undefined)
		{
			if(!isNaN(Number(str)))
			{
				val = Number(str);
			}
			else if(str.toLowerCase !== undefined && (str.toLowerCase() == "true" || str.toLowerCase() == "false"))
			{
				val = (str.toLowerCase() == "true");
			}
			else
			{
				var temp = Utils.getObj(str);
				if(temp != null)
				{
					val = temp;
				}
			}
		}
						
		return val;
	}
	
	Utils.getObj = function(str)
	{
		str = (str === undefined) ? "" : str;
		var f = window;
		var m = str.split(".");
		var length = m.length;
		for(var i = 0; i < length; i++)
		{
			if(f[m[i]] !== undefined)
			{
				f = f[m[i]];
			}
			else
			{
				i = length;	
			}
		}
		
		f = (f !== window) ? f : null;
		
		return f;
	}
	
	Utils.getObjects = function(value)
	{
		var objectNames = value.split(";");
		var objects = [];
		var i;
		var length = objectNames.length;
		
		if(length == 0)
		{
			objectNames = value.split(",");
			length = objectNames.length;
		}
		
		for(i = 0; i < length; i++)
		{
			var objectName = Utils.hyphenToCamelCase($.trim(objectNames[i]));
			var object = Utils.getObj(objectName);
			if(object != null)
			{
				if($.isArray(object))
				{
					var objectLength = object.length;
					var j;
					for(j = 0; j < objectLength; j++)
					{
						objects.push(object[j]);
					}
				}
				else
				{
					objects.push(object);	
				}
			}
		}
		
		return objects;
	}
	
	Utils.getScope = function(str)
	{	
		var f = window;
		var m = str.split(".");
		
		if(m.length > 0)
		{
			//f = window[m[0]];
			var length = m.length;
			for(var i = 1; i < length - 1; i++)
			{
				if(f[m[i]] !== undefined)
				{
					f = f[m[i]];
				}
				else
				{
					i = length;	
				}	
			}
		}
		
		return f;
	}
	
	Utils.getParams = function(str)
	{
		var params = null;
		if(str !== undefined)
		{
			params = [];
			var values = str.split(",");
			var i;
			var length = values.length;
			for(i = 0; i < values.length; i++)
			{
				params.push(Utils.getRealValue($.trim(values[i])))
			}
		}
		
		return params;
	}
	
	Utils.trimSpaces = function(str)
	{
		var trimStr = "";
		if(str !== undefined)
		{
			trimStr = str;
			var length = trimStr.length;
			var startIndex = 0;
			var endIndex = length - 1;
			var i;
			
			for(i = 0; i < length; i++)
			{
				if(trimStr.charAt(i) != ' ')
				{
					startIndex = i;
					i = length;
				}
			}
			
			for(i = length - 1; i >= 0; i--)
			{
				if(trimStr.charAt(i) != ' ')
				{
					endIndex = i;
					i = -1;
				}
			}
			
			trimStr = trimStr.substr(startIndex, endIndex - startIndex + 1);
		}
		
		return trimStr;
	}
	
	Utils.getAttrObjectFromString = function(str, initObject)
	{
		str = str || "";
		var o = (initObject == null) ? {} : initObject;
		
		if(str != "")
		{
			var groups = str.split(";"),
				i,
				length = groups.length;
				
			if(length == 0)
			{
				groups = str.split(",");
				length = groups.length;
			}
				
			for(i = 0; i < length; i++)
			{
				var attr = groups[i].split(":"),
					prop = Utils.hyphenToCamelCase($.trim(attr[0])),
					val = attr[1];
				
				for(var j = 2; j < attr.length; j++)
				{
					val += ":" + attr[j];
				}
				
				val = Utils.getRealValue($.trim(val));
				
				
				if(prop != "")
				{
					o[prop] = val;	
				}
			}
		}
		
		return o;
	}
		
	Utils.getChildAttrObjectFromElem = function(elem, pluginName)
	{
		var o = {};
		
		var children = elem.children();
		var length = children.length;
		for (var i = 0; i < length; i++)
		{	
			var child = children.eq(i);
			if(child.is(pluginName))
			{
				var elemChild = children.get(i);
				for (var j = 0; j < elemChild.attributes.length; j++) 
				{
					var attr = elemChild.attributes[j];
					o[attr.name] = getRealValue(attr.value);
				}
			}
		}
		
		return o;
	}
	
	Utils.hyphenToCamelCase = function(value)
	{
		return value.replace(/-([a-z])/gi, function(s, g) { return g.toUpperCase(); } );
	}
	
	Utils.getStyleSheetObject = function (selector)
	{
		var styleObj = {};
		
		for(var i = 0; i < document.styleSheets.length; i++)
		{
			var cssRules = document.styleSheets[i].cssRules || document.styleSheets[i].rules || [];
			for(var j = 0; j < cssRules.length; j++)
			{
				var selectorText = cssRules[j].selectorText;
				if(selectorText !== undefined)
				{
					var selectors = selectorText.split(",");
					
					for(var k = 0; k < selectors.length; k++)
					{
						var styleSelector = $.trim(selectors[k]);
						if(styleSelector == selector)
						{
							styleObj = $.extend(styleObj, Utils.getAttrObjectFromString(cssRules[j].style.cssText));
						}
					}
				}
			}
		}
		
		return styleObj;
	}
	
	Utils.preventDefault = function (e)
	{
		 if (e.preventDefault) 
		 { 
			e.preventDefault(); 
		 } 
		 else 
		 { 
			 e.returnValue = false; 
		 }
	}
	
	Utils.preventGestureDefault = function (e)
	{
		e.gesture.preventDefault();
	}
	
	Utils.shuffleArray = function(array) 
	{
		var currentIndex = array.length, 
			temporaryValue,
			randomIndex;
		
		while (0 !== currentIndex) 
		{
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		
		return array;
	}
	
	window.Utils = Utils;
	
}(window));

(function(window)
{
	function PinchZoomer(_pinchZoomerDiv, imageUrl, varsObj)
	{
		TweenLite.defaultOverwrite = "auto";
		//_vars
		var _vars = $.extend({ animDuration:0.3, maxZoom:5, minZoom:1, ease:Power4.easeOut, allowZoom:true, doubleTapZoom:2, zoomStep:0.5, adjustWidth:0, adjustHeight:0, preloaderUrl:"assets/preloader.gif", resizeDuration:-1, onZoom:null, onZoomParams:null, onZoomStart:null, onZoomStartParams:null, onZoomComplete:null, onZoomCompleteParams:null, onImageLoad:null, onImageLoadParams:null }, varsObj),
		//elements
		pinchZoomerDiv = $(_pinchZoomerDiv),
		imageHolder = $("<div style='position:absolute; width:100%; height:100%; overflow:hidden;'></div>"),
		_image = $("<img style='position:absolute; max-width:none; display:block;'>").load(onImageLoad),
		preloader = ($.type(_vars.preloaderUrl) === "string") ? $("<img style='position:absolute; max-width:none; display:block;'>").load( onPreloaderImageLoad ) : null,
		hiddenHolder = $("<div style='width:1px; height:1px; left:-1px; top:-1px; position:absolute; overflow:hidden'></div>"),
		
		//size _vars
		imageHolderWidth = -1,
		imageHolderHeight = -1,
		prevHolderWidth = -1,
		prevHolderHeight = -1,
		_imageWidth = 0,
		_imageHeight = 0,
		preloaderWidth = 0,
		preloaderHeight = 0,
		_newImageWidth = 0,
		_newImageHeight = 0,
		realLeft = 0,
		realTop = 0,
		_imageLoaded = false,
		
		//browser function test
		useTransform = Modernizr.csstransforms,
		useTouch = Modernizr.touch,
		
		//touch events
		touchHandler = null,
		imageTouchHandler = null,
		
		//transform _vars
		endZoom = 1,
		computedZoom = 1,
		curX = 0,
		curY = 0,
		oldX = 0,
		oldY = 0,
		oldScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0},
		parScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0},
		newScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0},
		dragDistanceX = 0,
		dragDistanceY = 0,
		snap = false,
		oldSlideIndex = 0,
		startDragX = 0,
		startDragY = 0,
		touchCount = 0,
		oldTouchCount = -1,
		touchId = 0,
		oldTouchId = -1,
		transformInit = false,
		dragInit = false,
		touchReady = true,
		useControls = false,
		sliderLeft = 0,
		sliderTop = 0;
		
		this.zoomIn = _zoomIn;
		this.zoomOut = _zoomOut;
		this.zoom = _zoom;
		this.imageWidth = getImageWidth;
		this.imageHeight = getImageHeight;
		this.newImageWidth = getNewImageWidth;
		this.newImageHeight = getNewImageHeight;
		this.resize = onWindowResize;
		this.imageLoaded = isImageLoaded;
		this.image = _image;
		this.vars = $.extend({}, _vars);
		_init();
		
		function _init()
		{
			pinchZoomerDiv.prepend(imageHolder);
			
			$("body").append(hiddenHolder);
			
			if(preloader != null)
			{
				TweenMax.set(preloader, { autoAlpha:0 } );
				hiddenHolder.append(preloader);
				preloader.attr("src", _vars.preloaderUrl);
			}
			
			hiddenHolder.append(_image);
			TweenMax.set(_image, { autoAlpha:0 } );
			_image.attr("src", imageUrl);
			
			//$(window).resize(onWindowResize);
			onWindowResize();
			
			//touch events
			touchHandler = imageHolder.hammer( 
			{
				drag_min_distance: 0,
				prevent_default:true,
				swipe:false,
				drag_max_touches: 4
			});
			
			touchHandler.on("touchstart touchend", onTouch);
			if(_vars.allowZoom)
			{
				imageHolder.on("mousewheel", Utils.preventDefault);
				imageHolder.on("mousewheel", onImageWheel);
			}
			
			
			imageTouchHandler = _image.hammer( 
			{
				drag_min_distance: 0,
				//prevent_default:true,
				swipe:false,
				drag_max_touches: 4
			});
			
			imageTouchHandler.on("doubletap", onDoubleTap);
			document.ondragstart = function () { return false; };
			imageTouchHandler.on("drag", Utils.preventGestureDefault);
			imageHolder.on("mousedown", enableDrag);
			imageHolder.on("mouseup", disableDrag);
			
			
			$(window).resize(onWindowResize);
			
			if(!isNaN(_vars.resizeDuration) && _vars.resizeDuration > 0)
			{
				TweenMax.to(this, _vars.resizeDuration, { onRepeat:onWindowResize, repeat:-1 } );
			}
		}
		
		function onPreloaderImageLoad(e)
		{
			if(!_imageLoaded)
			{
				preloaderWidth = preloader.width();
				preloaderHeight = preloader.height();
				
				var preloaderX = ((imageHolderWidth - preloaderWidth) * 0.5) + "px",
					preloaderY = ((imageHolderHeight - preloaderHeight) * 0.5) + "px";
				
				TweenMax.set(preloader, { position:"absolute", maxWidth:"none", x:preloaderX, y:preloaderY, transformPerspective:500, autoAlpha:1} );
				imageHolder.append(preloader);
			}
		}
		
		function onWindowResize()
		{
			imageHolderWidth = imageHolder.width() + _vars.adjustWidth;
			imageHolderHeight = imageHolder.height() + _vars.adjustHeight;
			
			if(prevHolderWidth != imageHolderWidth || prevHolderHeight != imageHolderHeight)
			{
				
				if(preloaderWidth != 0)
				{
					onPreloaderImageLoad();
				}
				
				resetImage();
				
				dragDistanceX = 0;
				dragDistanceY = 0;
				
				resetTransform();
				
				touchCount = 0;
				touchId = 0;
				oldTouchId = -1;
				snap = false;
				touchReady = true;
				
				prevHolderWidth = imageHolderWidth;
				prevHolderHeight = imageHolderHeight;
			}
		}
		
		function onImageLoad(e)
		{
			_imageWidth = _image.width();
			_imageHeight = _image.height();
			_imageLoaded = true;
			
			TweenMax.to(_image, _vars.animDuration, { autoAlpha:1, ease:_vars.ease } );
			TweenMax.set(_image, { display:"block" } );
			if(preloader != null)
			{
				preloader.detach();
			}
			
			imageHolder.prepend(_image);
			
			resetImage();
			onWindowResize();
			
			if($.isFunction(_vars.onImageLoad))
			{
				_vars.onImageLoad.apply(null, _vars.onImageLoadParams);
			}
		}
		
		function getImageWidth()
		{
			return _imageWidth;	
		}
		
		function getImageHeight()
		{
			return _imageHeight;	
		}
		
		function getNewImageWidth()
		{
			return _newImageWidth;	
		}
		
		function getNewImageHeight()
		{
			return _newImageHeight;	
		}
		
		function isImageLoaded()
		{
			return _imageLoaded;	
		}
		
		function resetImage()
		{
			if(_imageLoaded)
			{
				if(_imageWidth == 0 || _imageHeight == 0)
				{
					_imageWidth = _image.width();
					_imageHeight = _image.height();
				}
				
				var tempImageWidth = _imageWidth,
					tempImageHeight = _imageHeight,
					horizontalScale = imageHolderWidth / tempImageWidth, 
					verticalScale = imageHolderHeight / tempImageHeight,
					curScale = horizontalScale;
				
				if(tempImageHeight * horizontalScale > imageHolderHeight)
				{
					curScale = verticalScale;
				}
				
				if(tempImageWidth == 0 || tempImageHeight == 0 || isNaN(curScale))
				{
					curScale = 1;
				}
				
				_newImageWidth = Math.ceil(tempImageWidth * curScale),
				_newImageHeight = Math.ceil(tempImageHeight * curScale);
				
				_imageWidth = tempImageWidth;
				_imageHeight = tempImageHeight;
				realLeft = ((((imageHolderWidth - _newImageWidth) * 0.5)) >> 0);
				realTop = ((((imageHolderHeight - _newImageHeight) * 0.5)) >> 0);
				
				var cssObj = { width:_newImageWidth, height:_newImageHeight, left:realLeft + "px", top:realTop + "px", scale:1, transformOrigin:"0 0" };
				
				if(useTransform)
				{
					cssObj.x = 0;
					cssObj.y = 0;	
				}
				else
				{
					cssObj.marginLeft = 0;
					cssObj.marginTop = 0;	
				}
				
				TweenMax.set(_image, cssObj);
			}
		}
		
		function onTouch(e)
		{
			touchCount = e.originalEvent.touches.length;
			
			if(touchCount != oldTouchCount)
			{
				setupGestures();
			}
			
			oldTouchCount = touchCount;
		}
		
		function onImageWheel(e, delta, deltaX, deltaY)
		{
			if(_vars.allowZoom)
			{
				sliderLeft = imageHolder.offset().left;
				sliderTop = imageHolder.offset().top;
				var spx = (e.pageX - realLeft - curX - sliderLeft) / endZoom,
				spy = (e.pageY - realTop - curY - sliderTop) / endZoom;
				
				initZoom(spx, spy);
				if(delta > 0)
				{
					computedZoom += _vars.zoomStep;
				}
				else
				{
					computedZoom -= _vars.zoomStep;
				}
				setPosition();
				adjustPosition();
				endZoom = computedZoom;
				
				handleZoom();
			}
			
			Utils.preventDefault(e);
		}
		
		function setupGestures()
		{
			touchId = (touchCount > 1) ? 2 : touchCount;
			var gestureInit = (touchId != oldTouchId);
			
			if(touchCount == 1)
			{
				if(touchReady)
				{
					dragInit = gestureInit;
					disableTransform();
					enableDrag();
				}
				
				if(oldTouchId == 2)
				{
					endZoom = computedZoom;
				}
			}
			else if(touchCount > 1)
			{
				if(touchReady)
				{
					transformInit = gestureInit;
					disableDrag();
					enableTransform();
				}
			}
			else
			{
				disableTransform();
				disableDrag();
				onGestureEnd();
			}
			
			oldTouchId = touchId;
		}
		
		function onGestureEnd()
		{
			endZoom = computedZoom;
		}
		
		function enableDrag()
		{
			dragInit = true;
			touchHandler.on("drag", onDrag);
		}
		
		function enableTransform()
		{
			if(_vars.allowZoom)
			{
				touchHandler.on("transform", onTransform);
				imageHolder.on("mousewheel", onImageWheel);
			}
		}
		
		function disableDrag()
		{
			touchHandler.off("drag", onDrag);
		}
		
		function disableTransform()
		{
			touchHandler.off("transform", onTransform);
			imageHolder.off("mousewheel", onImageWheel);
		}
		
		function onDoubleTap(e)
		{
			sliderLeft = imageHolder.offset().left;
			sliderTop = imageHolder.offset().top;
			var spx = (e.gesture.touches[0].pageX - realLeft - curX - sliderLeft) / endZoom,
			spy = (e.gesture.touches[0].pageY- realTop - curY - sliderTop) / endZoom;
			
			initZoom(spx, spy);
			transformInit = false;
			
			computedZoom = (endZoom == 1) ? _vars.doubleTapZoom : 1;
			
			setPosition();
			adjustPosition();
			endZoom = computedZoom;
			handleZoom();
		}
		
		function onTransform(e)
		{
			if(transformInit)
			{	
				sliderLeft = imageHolder.offset().left;
				sliderTop = imageHolder.offset().top;
				var spx = (e.gesture.center.pageX - realLeft - curX - sliderLeft) / endZoom,
				spy = (e.gesture.center.pageY - realTop - curY - sliderTop) / endZoom;
				
				initZoom(spx, spy);
				transformInit = false;
			}
			
			computedZoom = endZoom * e.gesture.scale;
			
			setPosition();
			adjustPosition();
			handleZoom();
		}
		
		function onDrag(e)
		{
			if(dragInit)
			{
				startDragX = e.gesture.touches[0].pageX;
				startDragY = e.gesture.touches[0].pageY;
				oldX = curX;
				oldY = curY;
				dragInit = false;
			}
			
			curX = oldX + e.gesture.touches[0].pageX - startDragX;
			curY = oldY + e.gesture.touches[0].pageY - startDragY;
			
			setMove();
		}
		
		function adjustPosition()
		{
			var computedWidth = _newImageWidth * computedZoom;
				computedHeight = _newImageHeight * computedZoom;
			
			if(computedWidth <= imageHolderWidth)
			{
				curX = ((imageHolderWidth - computedWidth) * 0.5) - realLeft;
			}
			else if(curX + realLeft > 0 || curX + computedWidth + realLeft < imageHolderWidth)
			{
				if(curX + realLeft > 0)
				{
					curX = -realLeft;
				}
				else if(curX + computedWidth + realLeft < imageHolderWidth)
				{
					curX = imageHolderWidth - computedWidth - realLeft;
				}
			}
			
			if(computedHeight <= imageHolderHeight)
			{
				curY = ((imageHolderHeight - computedHeight) * 0.5) - realTop;
			}
			else if(curY + realTop > 0 || curY + computedHeight + realTop < imageHolderHeight)
			{
				if(curY + realTop > 0)
				{
					curY = -realTop;
				}
				else if(curY + computedHeight + realTop < imageHolderHeight)
				{
					curY = imageHolderHeight - computedHeight - realTop;
				}
			}
			
			curX = curX >> 0;
			curY = curY >> 0;
		}
		
		function setPosition()
		{
			if(computedZoom > _vars.maxZoom)
			{
				computedZoom = _vars.maxZoom;
			}
			else if(computedZoom < _vars.minZoom)
			{
				computedZoom = _vars.minZoom;
			}
			
			newScalePosObj.spx = parScalePosObj.spx;
			newScalePosObj.spy = parScalePosObj.spy;
			
			newScalePosObj.nspx = (newScalePosObj.spx * computedZoom);
			newScalePosObj.nspy = (newScalePosObj.spy * computedZoom);
			
			newScalePosObj.cx = (newScalePosObj.spx - newScalePosObj.nspx) >> 0;
			newScalePosObj.cy = (newScalePosObj.spy - newScalePosObj.nspy) >> 0;
			
			curX = oldScalePosObj.cx + newScalePosObj.cx - parScalePosObj.cx;
			curY = oldScalePosObj.cy + newScalePosObj.cy - parScalePosObj.cy;
		}
		
		function resetTransform()
		{
			endZoom = 1;
			computedZoom = 1;
			
			curX = 0;
			curY = 0;
			
			oldScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0};
			parScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0};
			newScalePosObj = {spx:0, spy:0, nspx:0, nspy:0, cx:0, cy:0};
			
			if($.isFunction(_vars.onZoom))
			{
				_vars.onZoom.apply(null, _vars.onZoomParams);
			}
		}
		
		function initZoom(spx, spy)
		{
			oldScalePosObj.spx = newScalePosObj.spx;
			oldScalePosObj.spy = newScalePosObj.spy;
			oldScalePosObj.nspx = newScalePosObj.nspx;
			oldScalePosObj.nspy = newScalePosObj.nspy;
			oldScalePosObj.cx = curX;
			oldScalePosObj.cy = curY;
			
			parScalePosObj.spx = spx >> 0;
			parScalePosObj.spy = spy >> 0;
			
			parScalePosObj.nspx = (parScalePosObj.spx * endZoom);
			parScalePosObj.nspy = (parScalePosObj.spy * endZoom);
			
			parScalePosObj.cx = (parScalePosObj.spx - parScalePosObj.nspx) >> 0;
			parScalePosObj.cy = (parScalePosObj.spy - parScalePosObj.nspy) >> 0;
			
			computedZoom = endZoom;
		}
		
		function handleZoom(duration)
		{
			var cssObj = { transformPerspective:500, position:"absolute", ease:_vars.ease },
				computedWidth = _newImageWidth * computedZoom;
				computedHeight = _newImageHeight * computedZoom;
				
			duration = (!isNaN(duration)) ? duration :  _vars.animDuration;
			
			if($.isFunction(_vars.onZoomStart))
			{
				cssObj.onStart = _vars.onZoomStart;
				cssObj.onStartParams = _vars.onZoomStartParams;
			}
			
			if($.isFunction(_vars.onZoomComplete))
			{
				cssObj.onComplete = _vars.onZoomComplete;
				cssObj.onCompleteParams = _vars.onZoomCompleteParams;
			}
			
			if(Utils.androidVer !== null && Utils.androidVer < 3)
			{
				cssObj.width = computedWidth;
				cssObj.height = computedHeight;
			}
			else

			{
				cssObj.scale = computedZoom; 
			}
			
			if(useTransform)
			{
				cssObj.x = curX;
				cssObj.y = curY;
			}
			else
			{
				cssObj.marginLeft = curX;
				cssObj.marginTop = curY;
			}
			
			TweenMax.to(_image, duration, cssObj );
			
			
			if($.isFunction(_vars.onZoom))
			{
				_vars.onZoom.apply(null, _vars.onZoomParams);
			}
		}
		
		function setMove()
		{
			var adjX = curX,
			adjY = curY;
			
			adjustPosition();
			
			snap = false;
				
			var cssObj = { transformPerspective:500, ease:_vars.ease };
			
			if(useTransform)
			{
				cssObj.x = curX;
				cssObj.y = curY;
			}
			else
			{
				cssObj.marginLeft = curX;
				cssObj.marginTop = curY;
			}
			
			TweenMax.to(_image, _vars.animDuration, cssObj );
			
			if($.isFunction(_vars.onDrag))
			{
				_vars.onDrag.apply(null, _vars.onDrag);
			}
		}
		
		function _zoomIn()
		{
			_zoom(computedZoom + _vars.zoomStep);
		}
		
		function _zoomOut()
		{
			_zoom(computedZoom - _vars.zoomStep);
		}
		
		function _zoom(value, duration)
		{
			if(value !== undefined && _vars.allowZoom)
			{
				duration = (!isNaN(duration)) ? duration :  _vars.animDuration;
				var spx = _newImageWidth * 0.5,
				spy = _newImageHeight * 0.5;
				
				initZoom(spx, spy);
				computedZoom = value;
				
				setPosition();
				
				adjustPosition();
				endZoom = computedZoom;
				
				handleZoom(duration);
			}
			
			return computedZoom;
		}
	}
	
	window.PinchZoomer = PinchZoomer;
	PinchZoomer.objs = [];
	PinchZoomer.lastIndex = 0;
	
	PinchZoomer.remove = function(idOrIndex)
	{
		var pinchZoomerObj = null;
		
		if(!isNaN(idOrIndex))
		{
			pinchZoomerObj = PinchZoomer.objs[idOrIndex];
			pinchZoomerObj.outerDiv.remove();
			PinchZoomer.objs[i] = null;
			PinchZoomer.objs[i] = { removed:true };
			//PinchZoomer.objs.splice(idOrIndex, 1);
		}
		else
		{
			var len = PinchZoomer.objs.length;
			for(var i = 0; i < len; i++)
			{
				if(PinchZoomer.objs[i].id == idOrIndex)
				{
					pinchZoomerObj = PinchZoomer.objs[i];
					pinchZoomerObj.outerDiv.remove();
					PinchZoomer.objs[i] = null;
					PinchZoomer.objs[i] = { removed:true };
					//PinchZoomer.objs.splice(i, 1);
					i = len;
				}
			}
		}
	}
	
	PinchZoomer.removeAll = function()
	{
		var len = PinchZoomer.objs.length;
		for(var i = 0; i < len; i++)
		{
			var pinchZoomerObj = PinchZoomer.objs[i];
			if(!pinchZoomerObj.removed)
			{
				pinchZoomerObj.outerDiv.remove();
			}
			PinchZoomer.objs[i] = null;
		}
		
		PinchZoomer.objs = null;
		PinchZoomer.objs = [];
	}
	
	
	PinchZoomer.getObj = function(idOrIndex)
	{
		var pinchZoomerObj = null;
		
		if(!isNaN(idOrIndex))
		{
			pinchZoomerObj = PinchZoomer.objs[idOrIndex];
		}
		else
		{
			var len = PinchZoomer.objs.length;
			for(var i = 0; i < len; i++)
			{
				if(PinchZoomer.objs[i].id == idOrIndex)
				{
					pinchZoomerObj = PinchZoomer.objs[i];
					i = len;
				}
			}
		}
		
		return pinchZoomerObj;
	}
	
	PinchZoomer.get = function(idOrIndex)
	{
		var pinchZoomerObj = PinchZoomer.getObj(idOrIndex),
			pinchZoomer = (!pinchZoomerObj.removed) ? pinchZoomerObj.pinchZoomer : null;
	
		return pinchZoomer;
	}
	
	PinchZoomer.init = function(imgs, _vars)
	{
		_vars = _vars || {};
		
		var pinchZoomerImages = $(imgs || "img[data-elem='pinchzoomer']").filter("img"),
			pinchZoomerLen =  pinchZoomerImages.length;
			
		for(var i = 0; i < 	pinchZoomerLen; i++)
		{
			var pinchZoomerObj = {},
			index = PinchZoomer.objs.length;
			
			pinchZoomerObj.removed = false;
			pinchZoomerObj.image = pinchZoomerImages.eq(i);
			pinchZoomerObj.id = pinchZoomerObj.image.attr("id") || "img" + PinchZoomer.lastIndex;
			pinchZoomerObj._vars = $.extend( { scaleMode:"widthOnly" }, (_vars.imageOptions || Utils.getAttrObjectFromString(pinchZoomerObj.image.data("options"))));
			pinchZoomerObj.controlVars = $.extend( { alwaysShow:false }, (_vars.controlOptions || Utils.getAttrObjectFromString(pinchZoomerObj.image.data("control-options"))));
			pinchZoomerObj._vars.onImageLoad = onPinchZoomerImageLoad;
			pinchZoomerObj._vars.onImageLoadParams = [index];
			pinchZoomerObj._vars.onZoomStart = onImageZoom;
			pinchZoomerObj._vars.onZoomStartParams = [index];
			
			pinchZoomerObj.outerDiv = $("<div style='position:relative;'></div>")
			pinchZoomerObj.innerDiv = $("<div style='position:absolute; top:0px; left:0px; width:100%; height:100%;'></div>");
			
			pinchZoomerObj.outerDiv.append(pinchZoomerObj.innerDiv);
			pinchZoomerObj.image.replaceWith(pinchZoomerObj.outerDiv);
			
			pinchZoomerObj.zoomInButton = $("<div></div>");
			pinchZoomerObj.outerDiv.append(pinchZoomerObj.zoomInButton);
			
			pinchZoomerObj.zoomInOnObj = getStyle(_vars.zoomInOnStyle || pinchZoomerObj.image.data("zoomin-on") || "zoomInOn");
			pinchZoomerObj.zoomInOffObj = getStyle(_vars.zoomInOffStyle || pinchZoomerObj.image.data("zoomin-off") || "zoomInOff");
			
			pinchZoomerObj.zoomOutButton = $("<div></div>");
			pinchZoomerObj.outerDiv.append(pinchZoomerObj.zoomOutButton);
			
			pinchZoomerObj.zoomOutOnObj = getStyle(_vars.zoomOutOnStyle || pinchZoomerObj.image.data("zoomout-on") || "zoomOutOn");
			pinchZoomerObj.zoomOutOffObj = getStyle(_vars.zoomOutOffStyle || pinchZoomerObj.image.data("zoomout-off") || "zoomOutOff");
			
			pinchZoomerObj.zoomInButton.hammer().on("tap", {index:index}, onZoomIn);
			pinchZoomerObj.zoomOutButton.hammer().on("tap", {index:index}, onZoomOut);
			
			pinchZoomerObj.controlVisible = false;
			pinchZoomerObj.oldZoomInEnabled = true;
			pinchZoomerObj.oldZoomOutEnabled = false;
			
			pinchZoomerObj.image.remove();
			
			pinchZoomerObj.outerDiv.hammer().on("tap", {index:index}, onInput);
			pinchZoomerObj.outerDiv.on("mouseover", {index:index}, onInput);
			pinchZoomerObj.outerDiv.on("mouseout", {index:-1}, onInput);
			
			pinchZoomerObj.pinchZoomer = new PinchZoomer(pinchZoomerObj.innerDiv, pinchZoomerObj.image.attr("src"), pinchZoomerObj._vars );
			
			PinchZoomer.objs.push(pinchZoomerObj);
			setZoomButtonState(index, true);
			PinchZoomer.lastIndex ++;
		}
		
		
		
		setActiveControls(-1);
		$(window).resize(resizeAll);
		
		function getStyle(value)
		{
			var style = {};
			
			if(value.indexOf(":") == -1)
			{
				style = { className:value };
					
			}
			else
			{
				style = Utils.getAttrObjectFromString(value);
			}
			
			return style;
		}
		
		function resizeAll()
		{
			for(var i = 0; i < 	PinchZoomer.objs.length; i++)
			{
				var pinchZoomerObj = PinchZoomer.objs[i],
					scaleMode = pinchZoomerObj._vars.scaleMode;
					
				if(scaleMode != "none" && PinchZoomer.objs[i].outerDiv.is(":visible"))
				{
					resizeOuterDiv(i);
				}
			}
		}
		
		function onPinchZoomerImageLoad(index)
		{
			resizeOuterDiv(index);
			setActiveControls(-1);
		}
		
		function resizeOuterDiv(index)
		{
			var pinchZoomerObj = PinchZoomer.objs[index];
			
			if(!pinchZoomerObj.removed)	
			{	
				var pinchZoomer = PinchZoomer.objs[index].pinchZoomer;
				
				if(pinchZoomer.imageLoaded())
				{
					var scaleMode = pinchZoomerObj._vars.scaleMode,
						imageWidth = pinchZoomer.imageWidth(),
						imageHeight = pinchZoomer.imageHeight(),
						holderWidth = pinchZoomerObj.outerDiv.parent().width(),
						holderHeight = pinchZoomerObj.outerDiv.parent().height(),
						widthScale = holderWidth / imageWidth,
						heightScale = holderHeight / imageHeight,
						newOuterWidth = imageWidth * heightScale,
						newOuterHeight = imageHeight * widthScale;
						
					if(scaleMode == "full")
					{
						newOuterWidth = "100%";
						newOuterHeight = "100%";
					}
					else
					{
						if(scaleMode == "widthOnly")
						{
							newOuterWidth = holderWidth;
							newOuterHeight = (holderWidth / imageWidth) * imageHeight;
						}
						else if(scaleMode == "heightOnly")
						{
							newOuterHeight = holderHeight;
							newOuterWidth = (holderHeight / imageHeight) * imageWidth;
						}
						else if(scaleMode == "proportionalInside")
						{
							if(newOuterHeight <= holderHeight)
							{
								newOuterWidth = holderWidth;
							}
							else
							{
								newOuterHeight = holderHeight;
							}
						}
						else if(scaleMode == "proportionalOutside")
						{
							if(newOuterHeight >= holderHeight)
							{
								newOuterWidth = holderWidth;
								scale = holderWidth / newOuterWidth;
							}
							else
							{
								newOuterHeight = holderHeight;
								scale = holderHeight / newOuterHeight;
							}
						}
						else
						{
							newOuterWidth = imageWidth;
							newOuterHeight = imageHeight;
						}
					
						newOuterWidth = Math.ceil(newOuterWidth);
						newOuterHeight = Math.ceil(newOuterHeight);
					}
					
					TweenMax.set(pinchZoomerObj.outerDiv, {width:newOuterWidth, height:newOuterHeight });
					pinchZoomer.resize();
				}
			}
		}
		
		function onInput(e)
		{
			var index = e.data.index;
			setActiveControls(index);
		}
		
		function onZoomIn(e)
		{
			var index = e.data.index,
				pinchZoomerObj = PinchZoomer.objs[index];
				
			if(!pinchZoomerObj.removed)
			{
				pinchZoomerObj.pinchZoomer.zoomIn();
				setActiveControls(index);
			}
		}
		
		function onZoomOut(e)
		{
			var index = e.data.index,
				pinchZoomerObj = PinchZoomer.objs[index];
				
			if(!pinchZoomerObj.removed)
			{
				pinchZoomerObj.pinchZoomer.zoomOut();
				setActiveControls(index);
			}
		}
		
		function onImageZoom(index)
		{
			 setActiveControls(index);
		}
		
		function setZoomButtonState(index, forceCss)
		{
			forceCss = (forceCss == true);
			
			if(index >= 0 && index < PinchZoomer.objs.length)
			{
				var pinchZoomerObj = PinchZoomer.objs[index];
					
				if(!pinchZoomerObj.removed)
				{
					var pinchZoomer = pinchZoomerObj.pinchZoomer,
						curZoom = pinchZoomer.zoom();
						
					if(curZoom == pinchZoomer.vars.minZoom)
					{
						if(pinchZoomerObj.oldZoomOutEnabled || forceCss)
						{
							TweenMax.set(pinchZoomerObj.zoomOutButton, pinchZoomerObj.zoomOutOffObj);
						}
						
						pinchZoomerObj.oldZoomOutEnabled = false;
					}
					else
					{
						if(!pinchZoomerObj.oldZoomOutEnabled || forceCss)
						{
							TweenMax.set(pinchZoomerObj.zoomOutButton, pinchZoomerObj.zoomOutOnObj);
						}
						
						pinchZoomerObj.oldZoomOutEnabled = true;
					}
					
					if(curZoom == pinchZoomer.vars.maxZoom)
					{
						if(pinchZoomerObj.oldZoomInEnabled || forceCss)
						{
							TweenMax.set(pinchZoomerObj.zoomInButton, pinchZoomerObj.zoomInOffObj);
						}
						
						pinchZoomerObj.oldZoomInEnabled = false;
					}
					else
					{
						if(!pinchZoomerObj.oldZoomInEnabled || forceCss)
						{
							TweenMax.set(pinchZoomerObj.zoomInButton, pinchZoomerObj.zoomInOnObj);
						}
						
						pinchZoomerObj.oldZoomInEnabled = true;
					}
				}
			}
		}	
		
		function setActiveControls(index)
		{
			for(var i = 0; i < PinchZoomer.objs.length; i++)
			{
				var pinchZoomerObj = PinchZoomer.objs[i];
				if(!pinchZoomerObj.removed)
				{
					if(i == index)
					{
						if(!pinchZoomerObj.controlVisible)
						{
							if(!pinchZoomerObj.controlVars.alwaysShow)
							{
								TweenMax.set([pinchZoomerObj.zoomInButton, pinchZoomerObj.zoomOutButton], { visibility:"visible" });
							}
						}
						
						pinchZoomerObj.controlVisible = true;
						
						setZoomButtonState(i);
					}
					else
					{
						if(pinchZoomerObj.controlVisible || index == -1)
						{
							if(!pinchZoomerObj.controlVars.alwaysShow)
							{
								TweenMax.set([pinchZoomerObj.zoomInButton, pinchZoomerObj.zoomOutButton], { visibility:"hidden" });
							}
						}
						
						pinchZoomerObj.controlVisible = false;
					}
				}
			}
		}
	}
	
}(window));

(function ($) 
{
	$.fn.pinchzoomer = function(_vars) 
	{
		PinchZoomer.init(this, _vars);
	};
	
}(jQuery));

(function()
{
	function onReady()
	{
		PinchZoomer.init();
	}
	
	$(onReady);
	
}());