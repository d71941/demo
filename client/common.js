function initCanvas(name) {
	var canvas = document.getElementById(name);
	var context = canvas.getContext('2d');

	context.canvas.width  = $("#baseImage").width();
	context.canvas.height = $("#baseImage").height();
}

var scaleRatio;

function loadImage(imagePath, callback) {
	var imageObj = new Image();

	imageObj.onload = function() {
		var topOffset = 40
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight - topOffset;
		windowRatio = windowWidth / windowHeight;
		imageRatio = imageObj.width / imageObj.height;

		if(windowRatio > imageRatio) {
			height = windowHeight;
			width = height * imageRatio;
			x = (windowWidth - width) / 2;
			y = 0;
		}
		else {
			width = windowWidth;
			height = width / imageRatio;
			x = 0;
			y = (windowHeight - height) / 2;
		}

		x = parseInt(x);
		y = parseInt(y);
		width = parseInt(width);
		height = parseInt(height);

		scaleRatio = width/imageObj.width;

		$("#baseImage").width(width);
		$("#baseImage").height(height);
		$("#viewport").css('left', x);
		$("#viewport").css('top', y + topOffset);
		$("#viewport").width(width);
		$("#viewport").height(height);
		$("#baseImage").attr('src', imagePath);
		initCanvas('polygonCanvas');
		callback();
	};
	imageObj.src = imagePath;
}