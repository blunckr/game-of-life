'use strict';

(function(){
  function matchCells(cell1, cell2){
    return cell1[0]===cell2[0] && cell1[1]===cell2[1];
  }

  function getNeighbors(cell){
    var neighbors=[];
    for(var x=cell[0]-1; x<=cell[0]+1; x++){
      for(var y=cell[1]-1; y<=cell[1]+1; y++){
        neighbors.push([x, y].join(','));
      }
    }
    // remove current cell, position is always the same
    neighbors.splice(4, 1);
    return neighbors;
  }

  // rules:
  // 2-3 neighbors lives
  // more or less dies
  // 3 neighbors is born
  function nextGen(currentCells){
    var candidates={};
    var nextCells=[];
    for(var i=0; i<currentCells.length; i++){
      var cell = currentCells[i];
      var neighbors=getNeighbors(cell);
      for(var j=0; j<neighbors.length; j++){
        var neighbor = neighbors[j];
        if(candidates[neighbor]){
          candidates[neighbor]++;
        } else {
          candidates[neighbor]=1;
        }
      };
    };
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
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for(var i=0; i<activeCells.length; i++){
      var cell = activeCells[i];
      context.fillRect(
        cellSize*cell[0],
        cellSize*cell[1],
        cellSize,
        cellSize
      );
    };
  }


  function main(){
    var cellSize=5;
    var playing=false;

    var canvas=document.getElementById('game');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    var context=canvas.getContext('2d');

    //var activeCells=[];
    var activeCells = [[50, 50],[51,50],[51,48],[53,49],[54, 50],[55,50],[56,50]];
    canvas.addEventListener('click', (e)=>{
      var x=e.offsetX/cellSize;
      var y=e.offsetY/cellSize;
      var newCell=[Math.floor(x), Math.floor(y)];
      var cellIndex = activeCells.findIndex(cell=> matchCells(cell, newCell));
      if(cellIndex===-1){
        activeCells.push(newCell);
      }else{
        activeCells.splice(cellIndex, 1);
      }
    });

    var tickButton=document.getElementById('tick');
    tickButton.addEventListener('click', ()=>{
      activeCells=nextGen(activeCells);
    });

    var playButton=document.getElementById('play');
    playButton.addEventListener('click', ()=>{
      playing=!playing;
    });

    var clearButton=document.getElementById('clear');
    clearButton.addEventListener('click', ()=>{
      activeCells = [];
    });

    var sizeInput=document.getElementById('cell-size');
    sizeInput.addEventListener('keyup', (e)=>{
      var value = parseInt(e.target.value);
      if(!isNaN(value)){
        cellSize=value;
      }
    });

    window.onresize=function(){
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;
    }

    function tick(){
      draw(context, activeCells, cellSize);
      if(playing){
        activeCells=nextGen(activeCells);
      }
      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  main();
})();
