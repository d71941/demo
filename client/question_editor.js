function addVertexToContainer(x, y){
  var vertexSize = 10;

  $("#vertexContainer").append('<div class="vertex" ' + 'style="left:' + (x - vertexSize/2)  + 'px; top:' + (y - vertexSize/2) + 'px;"></div>')

  function updateVertex(){
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

function selectPolygonItem(polygonIndex){
  if(currentPolygonIndex != -1) {
    $('#polygonItemContainer .polygonItem').eq(currentPolygonIndex).html('');
    $("#polygonItemContainer .currentPolygonItem").removeClass('currentPolygonItem');
  }
  currentPolygonIndex = polygonIndex;
  $("#vertexContainer").empty();
  if(currentPolygonIndex != -1){
    $('#polygonItemContainer .polygonItem').eq(currentPolygonIndex).html(currentPolygonIndex+1);
    $('#polygonItemContainer .polygonItem').eq(currentPolygonIndex).addClass('currentPolygonItem');
    for(var vertexIndex in polygons[currentPolygonIndex].vertices) {
      var position = polygons[currentPolygonIndex].vertices[vertexIndex];
      addVertexToContainer(position.x, position.y);
    }
  }
  drawPoly();
}

function addPolygonItem(polygonIndex){
    $('#polygonItemContainer').append('<li class="polygonItem" polygonIndex='+polygonIndex+'></li>')
    $("#polygonItemContainer .polygonItem:last-child").click(function(){
      if(currentPolygonIndex == parseInt($(this).attr('polygonIndex'))) return;
      selectPolygonItem(parseInt($(this).attr('polygonIndex')));
    });
}

function save(){
  questionObj = {polygons: []};

  for(var polygonIndex in polygons) {
    questionObj.polygons[polygonIndex] = {vertices: []};
    for(var vertexIndex in polygons[polygonIndex].vertices) {
      var position = polygons[polygonIndex].vertices[vertexIndex];
      questionObj.polygons[polygonIndex].vertices[vertexIndex] = {x: Math.round(position.x/scaleRatio), y: Math.round(position.y/scaleRatio)}
    }
  }

  $.ajax({
      url: 'update_question',
      type: 'POST',
      data: JSON.stringify(questionObj),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
  });
}

function swapPolygon(oldIndex, newIndex){
  if(oldIndex == newIndex) {
    return;
  }
  polygons.splice(newIndex,0,polygons.splice(oldIndex, 1)[0]);
  $('#polygonItemContainer .polygonItem').each(function(index) {
    if(index >= Math.min(oldIndex, newIndex) && index <= Math.max(oldIndex, newIndex)) {
      $(this).attr('polygonIndex', index);
    }
  });
}

var polygons = [];
var currentPolygonIndex = -1;
var questionObj;

function init() {

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
    polygons[polygons.length] = {vertices:[]};
    addPolygonItem(polygons.length - 1);
    selectPolygonItem(polygons.length - 1);
  });

  $("#removePolygon").click(function (){
    if(currentPolygonIndex == -1) return;
    polygons.splice(currentPolygonIndex, 1);
    $("#polygonItemContainer .polygonItem:last-child").remove();
    selectPolygonItem(Math.min(currentPolygonIndex, polygons.length - 1));
  });

  $("#save").click(save);

  $( "#polygonItemContainer" ).sortable({
    update: function(event, ui){
      var newIndex = $('#polygonItemContainer .polygonItem').index(ui.item);
      var oldIndex = ui.item.attr('polygonIndex');
      swapPolygon(oldIndex, newIndex);
      selectPolygonItem(newIndex);
    }
  });

  $( "#polygonItemContainer" ).disableSelection();

  loadImage("question.jpg", function(){
    for(var polygonIndex in questionObj.polygons) {
      polygons[polygonIndex] = {vertices: []};
      for(var vertexIndex in questionObj.polygons[polygonIndex].vertices) {
        var position = questionObj.polygons[polygonIndex].vertices[vertexIndex];
        polygons[polygonIndex].vertices[vertexIndex] = {x: Math.round(position.x*scaleRatio), y: Math.round(position.y*scaleRatio)}
      }
      addPolygonItem(polygonIndex);
    }
    if(polygons.length != 0) {
      selectPolygonItem(0);
    }
  });
}

$(function(){
  $.getJSON( "question.json", function(data) {
    questionObj = data;
  }).fail(function() {
    questionObj = {polygons: []};
  }).always(function() {
    init();
  });
});