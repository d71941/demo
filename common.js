function initCanvas(name) {
	var canvas = document.getElementById(name);
	var context = canvas.getContext('2d');

	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight - parseInt($('#viewport').css('top'));
}

function addImage(canvasName, imagePath) {
	var canvas = document.getElementById(canvasName);
	var context = canvas.getContext('2d');
	var imageObj = new Image();

	imageObj.onload = function() {
		windowRatio = context.canvas.width / context.canvas.height;
		imageRatio = imageObj.width / imageObj.height;

		if(windowRatio > imageRatio) {
			height = context.canvas.height;
			width = height * imageRatio;
			x = (context.canvas.width - width) / 2;
			y = 0;
		}
		else {
			width = context.canvas.width;
			height = width / imageRatio;
			x = 0;
			y = (context.canvas.height - height) / 2;
		}

		context.drawImage(imageObj, x, y, width, height);
	};
	imageObj.src = imagePath;
}