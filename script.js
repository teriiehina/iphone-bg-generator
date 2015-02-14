window.onload = function() 
{
	var dropZone      = document.getElementById('drop_files');
  var theCanvas     = document.getElementById('canvas')
  var sizeSelector  = document.getElementById('size-selector')

  var savedBase64   = null;
  
  /*
  INIT
  */
  
  resizeCanvas(canvas, 320,480)

  /*
  UI Refresh
  */
  
  document.getElementById('bg_color').addEventListener('change', function(e)
  {
    redrawCanvas()
  });
  
  
  document.getElementById('image_center_X').addEventListener('change', function(e)
  {
    redrawCanvas()
  });

  document.getElementById('image_center_Y').addEventListener('change', function(e)
  {
    redrawCanvas()
  });

  document.getElementById('image_width').addEventListener('change', function(e)
  {
    redrawCanvas()
  });
  
  document.getElementById('generatePNG').addEventListener('click', function(e)
  {
    showFinalImage();
  });
  
  sizeSelector.addEventListener('change' , function(e)
  {
    redrawCanvas()
  });
  
	// Event Listener for when the dragged file is over the drop zone.
	dropZone.addEventListener('dragover', function(e) 
  {
		if (e.preventDefault)  e.preventDefault(); 
		if (e.stopPropagation) e.stopPropagation(); 

		e.dataTransfer.dropEffect = 'copy';
	});

	// Event Listener for when the dragged file enters the drop zone.
	dropZone.addEventListener('dragenter', function(e) 
  {
		this.className = "over";
	});

	// Event Listener for when the dragged file leaves the drop zone.
	dropZone.addEventListener('dragleave', function(e) 
  {
		this.className = "";
	});

	// Event Listener for when the dragged file dropped in the drop zone.
	dropZone.addEventListener('drop', function(e) 
  {
		if (e.preventDefault)  e.preventDefault(); 
		if (e.stopPropagation) e.stopPropagation(); 

		this.className = "";

		var fileList = e.dataTransfer.files;

		if (fileList.length > 0) 
    {
      loadImageInBase64(fileList[0], canvas);
      
      setTimeout(function() 
      { 
        redrawCanvas()
      }, 500);  
		}
	});
  
	function loadImageInBase64(imageFile , canvas) 
  {
		var reader = new FileReader();

		reader.onloadend = function(e) 
    {
			if (e.target.readyState == FileReader.DONE) 
      {
				var imageData = reader.result;
        var base64    = window.btoa(imageData);
        savedBase64   = "data:image/png;base64," + base64;
			}
		}
		
    reader.readAsBinaryString(imageFile);
	}
 
  /*
  
  UPDATE CANVAS
  
  */
  
  function redrawCanvas()
  {
    var selectedSize  = sizeSelector.options[ sizeSelector.selectedIndex ].value
    var screenSize    = previewSizes[selectedSize]
    var width         = screenSize[0]
    var height        = screenSize[1]
    
    resizeCanvas(theCanvas , width, height);
  }
  
  function resizeCanvas(canvas, width, height)
  {
    // console.log("new size: " + width + ", " + height);
    canvas.width  = width;
    canvas.height = height;
    
    drawImageBase64InCanvas(savedBase64 , canvas)
    
    setTimeout(function() 
    { 
    drawHomeScreenOverlayOnCanvas(canvas)
    }, 10); 
  }
  
    
  function imageXForCanvas(image, canvas)
  {
    var centerX     = document.getElementById('image_center_X').value;
    var imageWidth  = imageWidthForCanvas(image, canvas)
    
    centerX = canvas.width * centerX / 100
    imageX  = centerX - (imageWidth / 2)
    
    // console.log("left: " + imageX)
    
    return imageX
  }
  
  function imageYForCanvas(image, canvas)
  {
    var centerY     = document.getElementById('image_center_Y').value;
    var imageHeight = imageHeightForCanvas(image, canvas)
    
    centerY = canvas.height * centerY / 100
    imageY  = centerY - (imageHeight / 2)
    
    // console.log("image y: " + imageY)
        
    return imageY
  }
  
  function imageWidthForCanvas(image, canvas)
  {
    var widthValue = document.getElementById('image_width').value;
    var imageWidth = canvas.width * widthValue / 100
    
    // console.log("width: " + imageWidth + ", " + widthValue)
    
    return imageWidth
  }
  
  function imageHeightForCanvas(image, canvas)
  {
    var imgWidth  = imageWidthForCanvas(image, canvas)
    // console.log("width: " + imgWidth)
    
    var imgHeight = imgWidth * image.height / image.width    
    // console.log("height: " + imgHeight)
    
    return imgHeight
  }
  
  function drawImageBase64InCanvas(imageBase64 , canvas) 
  { 
    "use strict";
    
    var ctx = canvas.getContext("2d");
    
    // first the background
    var bgColor = document.getElementById("bg_color").value
    
    clearCanvasWithBackgroundColor(canvas, bgColor)
                
    // then the image
    
    if (! imageBase64)
    {
      return;
    }
    
    var img = new Image();
    img.src = imageBase64
    
    var imgX      = imageXForCanvas(img, canvas)
    var imgY      = imageYForCanvas(img, canvas)
    
    var imgWidth  = imageWidthForCanvas(img, canvas)
    var imgHeight = imageHeightForCanvas(img, canvas)
      
    img.onload = function () 
    {
      // console.log("Image Onload");
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
    };
      
    img.onerror = function (stuff) 
    {
      console.log("Img Onerror:", stuff);
    };
  }
  
  function clearCanvasWithBackgroundColor(canvas, hexaColor)
  {
    var ctx       = canvas.getContext("2d");        
    ctx.fillStyle = hexaColor;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawHomeScreenOverlayOnCanvas(canvas)
  {
    var ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = "blue"
    ctx.globalAlpha = 0.5
    
    drawStatusBarOverlayOnCanvas(canvas)    
    drawDockOverlayOnCanvas(canvas)
    drawIconsOverlayOnCanvas(canvas)
    
    ctx.globalAlpha = 1
  }
  
  function drawStatusBarOverlayOnCanvas(canvas)
  {
    var ctx = canvas.getContext('2d');
    var selectedSize    = sizeSelector.options[ sizeSelector.selectedIndex ].value
    var layout          = previewLayouts[selectedSize]
    var statusBarHeight = layout["statusBarHeight"]
        
    ctx.beginPath();
    ctx.moveTo(0,statusBarHeight);
    ctx.lineTo(canvas.width,statusBarHeight);
    ctx.stroke();
  }
  
  function drawDockOverlayOnCanvas(canvas)
  {
    var ctx = canvas.getContext('2d');
    var selectedSize  = sizeSelector.options[ sizeSelector.selectedIndex ].value
    var layout        = previewLayouts[selectedSize]
    var dockHeight    = layout["dockHeight"]
    
    ctx.beginPath();
    ctx.moveTo(0,canvas.height - dockHeight);
    ctx.lineTo(canvas.width,canvas.height - dockHeight);
    ctx.stroke();
  }
  
  function drawIconsOverlayOnCanvas(canvas)
  {
    var ctx           = canvas.getContext('2d');
    var selectedSize  = sizeSelector.options[ sizeSelector.selectedIndex ].value
    var layout        = previewLayouts[selectedSize]
    
    var rowsCount         = layout["rowsCount"]
    var colsCount         = layout["colsCount"]
    
    var iconWidth         = layout["iconWidth"]
    var iconHeight        = layout["iconHeight"]
    
    var horizontalSpacing = layout["horizontalSpacing"]
    var verticalSpacing   = layout["verticalSpacing"]
    
    var horizontalMargin  = layout["horizontalMargin"]
    var verticalMargin    = layout["verticalMargin"]

    for (var row = 0 ; row < rowsCount ; row++)
    {
      for (var col = 0 ; col < colsCount ; col++)
      {
        var iconX = horizontalMargin + col * (iconWidth  + horizontalSpacing)
        var iconY = verticalMargin   + row * (iconHeight + verticalSpacing)
        
        ctx.strokeRect( iconX, iconY, iconWidth, iconHeight );
      }
    }
  }
  
  function showFinalImage()
  {
    var selectedSize  = sizeSelector.options[ sizeSelector.selectedIndex ].value
    var screenSize    = screenSizes[selectedSize]
    var width         = screenSize[0]
    var height        = screenSize[1]
    
    var renderingCanvas    = document.createElement('canvas');
    renderingCanvas.width  = width;
    renderingCanvas.height = height;

    drawImageBase64InCanvas(savedBase64 , renderingCanvas)
        
    setTimeout(function() 
    { 
      var imageURL    = renderingCanvas.toDataURL("image/png");
      var downloadURL = renderingCanvas.toDataURL("application/octet-stream");
      
      var win = window.open(downloadURL, '_blank');
      win.focus();
      
      // window.location = downloadURL
    }, 500);    
  }
  
  var iPhone3GS = {}
  iPhone3GS["rowsCount"]         = 4 
  iPhone3GS["colsCount"]         = 4 
  iPhone3GS["iconWidth"]         = 57
  iPhone3GS["iconHeight"]        = 57
  iPhone3GS["horizontalSpacing"] = 20
  iPhone3GS["verticalSpacing"]   = 30
  iPhone3GS["horizontalMargin"]  = 16
  iPhone3GS["verticalMargin"]    = 33
  iPhone3GS["dockHeight"]        = 100
  iPhone3GS["statusBarHeight"]   = 20
  
  var iPhone4 = {}
  iPhone4["rowsCount"]         = 4 
  iPhone4["colsCount"]         = 4 
  iPhone4["iconWidth"]         = 57
  iPhone4["iconHeight"]        = 57
  iPhone4["horizontalSpacing"] = 20
  iPhone4["verticalSpacing"]   = 30
  iPhone4["horizontalMargin"]  = 16
  iPhone4["verticalMargin"]    = 33
  iPhone4["dockHeight"]        = 100
  iPhone4["statusBarHeight"]   = 20
  
  var iPhone5 = {}
  iPhone5["rowsCount"]         = 5 
  iPhone5["colsCount"]         = 4 
  iPhone5["iconWidth"]         = 57
  iPhone5["iconHeight"]        = 57
  iPhone5["horizontalSpacing"] = 18
  iPhone5["verticalSpacing"]   = 30
  iPhone5["horizontalMargin"]  = 17
  iPhone5["verticalMargin"]    = 35
  iPhone5["dockHeight"]        = 95
  iPhone5["statusBarHeight"]   = 20
  
  var iPhone6 = {}
  iPhone6["rowsCount"]         = 6 
  iPhone6["colsCount"]         = 4 
  iPhone6["iconWidth"]         = 51
  iPhone6["iconHeight"]        = 50
  iPhone6["horizontalSpacing"] = 24
  iPhone6["verticalSpacing"]   = 28
  iPhone6["horizontalMargin"]  = 23
  iPhone6["verticalMargin"]    = 21
  iPhone6["dockHeight"]        = 82
  iPhone6["statusBarHeight"]   = -1
  
  
  var iPhone6Plus = {}
  iPhone6Plus["rowsCount"]         = 6 
  iPhone6Plus["colsCount"]         = 4 
  iPhone6Plus["iconWidth"]         = 46
  iPhone6Plus["iconHeight"]        = 46
  iPhone6Plus["horizontalSpacing"] = 26
  iPhone6Plus["verticalSpacing"]   = 31
  iPhone6Plus["horizontalMargin"]  = 27
  iPhone6Plus["verticalMargin"]    = 29
  iPhone6Plus["dockHeight"]        = 74
  iPhone6Plus["statusBarHeight"]   = -1
  
  var previewLayouts = [iPhone3GS , iPhone4, iPhone5, iPhone6, iPhone6Plus]

  var previewSizes  = [[320 , 480] , [320 , 480] , [320 , 568]  , [320 , 579  ], [320 , 568]];  
  var screenSizes   = [[320 , 480] , [640 , 960] , [640 , 1136] , [750 , 1334] , [1242 , 2208]];
	
};
