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