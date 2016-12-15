'use strict';

var rowCount = 100;
var columnCount = 100;
var width = 800;
var height = 800;
var size = width / rowCount;

var canvas = document.getElementById('game');
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

var activeCells = [[50, 50], [51,50], [51,48], [53,49], [54, 50], [55,50], [56,50]];

function getNeighbors(cell){
  var neighbors = [];
  var [cellX, cellY] = cell;
  for(var x = cellX - 1; x <= cellX + 1; x++){
    for(var y = cellY - 1; y <= cellY + 1; y++){
      neighbors.push([x, y].join(','));
    }
  }
  neighbors.splice(4, 1);
  return neighbors;
}

// rules:
// 2-3 neighbors lives
// more or less dies
// 3 neighbors is born
function next(currentCells){
  var candidates = {};
  var nextCells = [];
  currentCells.forEach(cell=>{
    var neighbors = getNeighbors(cell);
    neighbors.forEach(neighbor=>{
      if(candidates[neighbor]){
        candidates[neighbor]++;
      } else {
        candidates[neighbor] = 1;
      }
    });
  });
  var cellKeys = currentCells.map(cell=>cell.join(','));
  for(var candidate in candidates){
    var count = candidates[candidate];
    switch(count){
      case 2:
        if(cellKeys.indexOf(candidate) === -1){
          continue;
        }
      case 3:
        nextCells.push(candidate.split(',').map(x=>parseInt(x)));
    }
  }
  return nextCells;
}

var tickButton = document.getElementById('tick');
tickButton.addEventListener('click', ()=>{
  activeCells = next(activeCells);
});

function draw (){
  context.clearRect(0, 0, width, height);
  activeCells.forEach(cell=>{
    var [x, y] = cell;
    context.fillRect(
      size * x,
      size * y,
      size,
      size
    );
  });
}

function tick(timestamp){
  draw();
  activeCells=next(activeCells);
  window.requestAnimationFrame(tick);
}
//setInterval(()=>{activeCells = next(activeCells);}, 100);
window.requestAnimationFrame(tick);
