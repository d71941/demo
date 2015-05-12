function addVertexToContainer(x, y){
  var vertexSize = 10;

  $("#vertexContainer").append('<div class="vertex" ' + 'style="left:' + (x - vertexSize/2)  + 'px; top:' + (y - vertexSize/2) + 'px;"></div>')

  function updateVertex() {
    var i = $('#vertexContainer .vertex').index($(this));
    var position = polygons[currentPolygonIndex].vertices[i];
    position.x = parseInt($(this).css('left')) + vertexSize/2;
    position.y = parseInt($(this).css('top')) + vertexSize/2;
    drawPoly();
  }

  $("#vertexContainer .vertex:last-child").draggable({
    drag: updateVertex,
    stop: updateVertex
  });
}

function drawPoly(){
  var canvas = document.getElementById("polygonCanvas");
  var context = canvas.getContext("2d");

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  for(var polygonIndex in polygons) {
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
    context.fillStyle = "rgba(100, 100, 100, 0.5)";
    context.fill();
    if(polygonIndex == currentPolygonIndex) {
      context.strokeStyle = "#FF0000";
      context.stroke(); 
    }
  }
}

function moveBack(){
  if(currentPolygonIndex <= 0) return;
  var tmpPolygon = polygons[currentPolygonIndex];

  polygons[currentPolygonIndex] = polygons[currentPolygonIndex - 1];
  $('#polygonButtonContainer .polygonButton').eq(currentPolygonIndex).removeClass('currentPolygonButton')

  currentPolygonIndex = currentPolygonIndex - 1;

  polygons[currentPolygonIndex] = tmpPolygon;
  $('#polygonButtonContainer .polygonButton').eq(currentPolygonIndex).addClass('currentPolygonButton')
}

function moveForward(){
  if(currentPolygonIndex >= polygons.length - 1) return;
  var tmpPolygon = polygons[currentPolygonIndex];

  polygons[currentPolygonIndex] = polygons[currentPolygonIndex + 1];
  $('#polygonButtonContainer .polygonButton').eq(currentPolygonIndex).removeClass('currentPolygonButton')

  currentPolygonIndex = currentPolygonIndex + 1;

  polygons[currentPolygonIndex] = tmpPolygon;
  $('#polygonButtonContainer .polygonButton').eq(currentPolygonIndex).addClass('currentPolygonButton')
}

function save(){
  $.ajax({
      url: 'update_question',
      type: 'POST',
      data: JSON.stringify({"polygons":polygons}),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
  });
}

var polygons = [];
var currentPolygonIndex = -1;

$(function() {

  var canvas = document.getElementById("polygonCanvas");
  var context = canvas.getContext("2d");

  canvas.addEventListener('click', function(e){
    if(currentPolygonIndex == -1) return;
    vertices = polygons[currentPolygonIndex].vertices;
    vertices[vertices.length] = {x: e.clientX - parseInt($('#viewport').css('left')), y: e.clientY - parseInt($('#viewport').css('top'))};
    addVertexToContainer(vertices[vertices.length - 1].x, vertices[vertices.length - 1].y);
    drawPoly();
  });

  $("#addPolygon").click(function(){
    currentPolygonIndex = polygons.length;
    polygons[currentPolygonIndex] = {vertices:[]};
    $("#polygonButtonContainer .currentPolygonButton").removeClass('currentPolygonButton');
    $('#polygonButtonContainer').append('<button class="polygonButton currentPolygonButton" polygonIndex='+currentPolygonIndex+' type="button">'+currentPolygonIndex+'</button>')
    $("#polygonButtonContainer .polygonButton:last-child").click(function(){
      if(currentPolygonIndex == parseInt($(this).attr('polygonIndex'))) return;
      currentPolygonIndex = parseInt($(this).attr('polygonIndex'));
      $("#polygonButtonContainer .currentPolygonButton").removeClass('currentPolygonButton');
      $(this).addClass('currentPolygonButton');
      $("#vertexContainer").empty();
      for(var vertexIndex in polygons[currentPolygonIndex].vertices) {
        var position = polygons[currentPolygonIndex].vertices[vertexIndex];
        addVertexToContainer(position.x, position.y);
      }
      drawPoly();
    });
    $("#vertexContainer").empty();
    drawPoly();
  });

  $("#removePolygon").click(function (){
    if(currentPolygonIndex == -1) return;
    polygons.splice(currentPolygonIndex, 1);
    $("#polygonButtonContainer .polygonButton:last-child").remove();
    currentPolygonIndex = -1;
    $("#polygonButtonContainer .currentPolygonButton").removeClass('currentPolygonButton');
    $("#vertexContainer").empty();
    drawPoly();
  });

  $("#moveBack").click(moveBack);
  $("#moveForward").click(moveForward);

  $("#save").click(save);

  loadImage("question.jpg");
});