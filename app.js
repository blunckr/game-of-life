'use strict';

(function(){
  function getNeighbors(cell){
    var neighbors=[];
    for(var x=cell[0]-1; x<=cell[0]+1; x++){
      for(var y=cell[1]-1; y<=cell[1]+1; y++){
        neighbors.push([x,y].join(','));
      }
    }
    // remove current cell, position is always the same
    neighbors.splice(4,1);
    return neighbors;
  }

  // rules:
  // 2-3 neighbors lives
  // more or less dies
  // 3 neighbors is born
  function nextGen(currentCells){
    var candidates={};
    var nextCells=[];
    currentCells.forEach(cell=>{
      var neighbors=getNeighbors(cell);
      neighbors.forEach(neighbor=>{
        if(candidates[neighbor]){
          candidates[neighbor]++;
        } else {
          candidates[neighbor]=1;
        }
      });
    });
    var cellKeys=currentCells.map(cell=>cell.join(','));
    for(var candidate in candidates){
      switch(candidates[candidate]){
        case 2:
          if(cellKeys.indexOf(candidate)===-1){
            continue;
          }
        case 3:
          nextCells.push(candidate.split(',').map(x=>parseInt(x)));
      }
    }
    return nextCells;
  }

  function draw(context, activeCells, cellSize){
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    activeCells.forEach(cell=>{
      var [x,y]=cell;
      context.fillRect(
        cellSize*x,
        cellSize*y,
        cellSize,
        cellSize
      );
    });
  }


  function main(){
    var rowCount=100;
    var columnCount=100;
    var width=800;
    var height=800;
    var cellSize=width/rowCount;

    var canvas=document.getElementById('game');
    canvas.width=width;
    canvas.height=height;
    var context=canvas.getContext('2d');

    var tickButton=document.getElementById('tick');
    tickButton.addEventListener('click',()=>{
      activeCells=nextGen(activeCells);
    });

    var activeCells = [[50, 50],[51,50],[51,48],[53,49],[54, 50],[55,50],[56,50]];

    function tick(){
      draw(context,activeCells,cellSize);
      activeCells=nextGen(activeCells);
      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  main();
})();
