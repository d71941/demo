function drawPoly(){
  var canvas = document.getElementById("polygonCanvas");
  var context = canvas.getContext("2d");

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  for(var polygonIndex in polygons) {
    if(polygonIndex <= currentPolygonIndex) continue;
    context.beginPath();
    var first = true;
    for(var vertexIndex in polygons[polygonIndex].vertices) {
      var position = polygons[polygonIndex].vertices[vertexIndex];

      if (first) {
        context.moveTo(position.x, position.y);
        first = false;
      } else {
        context.lineTo(position.x, position.y);
      }
    }
    context.closePath();
    context.fillStyle = "rgb(255, 255, 255)";
    context.fill();
  }
}

var polygons = [];
var currentPolygonIndex = -1;
var questionObj;

function init() {
  $('#previous').click(function(){
    if(currentPolygonIndex < 0) return;
    currentPolygonIndex = currentPolygonIndex - 1;
    drawPoly();
  });

  $('#next').click(function(){
    if(currentPolygonIndex >= polygons.length - 1) return;
    currentPolygonIndex = currentPolygonIndex + 1;
    drawPoly();
  });

  loadImage("question.jpg", function(){
    for(var polygonIndex in questionObj.polygons) {
      polygons[polygonIndex] = {vertices: []};
      for(var vertexIndex in questionObj.polygons[polygonIndex].vertices) {
        var position = questionObj.polygons[polygonIndex].vertices[vertexIndex];
        polygons[polygonIndex].vertices[vertexIndex] = {x: Math.round(position.x*scaleRatio), y: Math.round(position.y*scaleRatio)}
      }
    }
    drawPoly();
  });
}

$(function(){
  $.getJSON( "question.json", function(data) {
    questionObj = data;
    init();
  });
});