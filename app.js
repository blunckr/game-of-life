'use strict';

(function(){
  function matchCells(cell1, cell2){
    return cell1[0]===cell2[0] && cell1[1]===cell2[1];
  }

  function getNeighbors(cell){
    var neighbors=[];
    for(var x=cell[0]-1; x<=cell[0]+1; x++){
      for(var y=cell[1]-1; y<=cell[1]+1; y++){
        neighbors.push([x, y]);
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
          candidates[neighbor].count++;
        } else {
          candidates[neighbor]={cell:neighbor, count:1};
        }
      };
    };
    var cellKeys=currentCells.map(cell=>cell.join(','));
    for(var key in candidates){
      var candidate=candidates[key];
      switch(candidate.count){
        case 2:
          if(cellKeys.indexOf(key)===-1){
            continue;
          }
        case 3:
          nextCells.push(candidate.cell);
      }
    }
    return nextCells;
  }

  function draw(context, activeCells, cellSize, drawGrid){
    var width=context.canvas.width;
    var height=context.canvas.height;
    context.clearRect(0, 0, width, height);
    for(var i=0; i<activeCells.length; i++){
      var cell = activeCells[i];
      context.fillRect(
        cellSize*cell[0],
        cellSize*cell[1],
        cellSize,
        cellSize
      );
    };

    if(!drawGrid){return;}
    for(var x=cellSize; x<width; x+=cellSize){
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for(var y=cellSize; y<height; y+=cellSize){
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  var patterns={
    'R-pentomino':[[0,0], [0,-1], [1,-1], [-1,0], [0,1]],
    'Acorn':[[1,0], [2,0], [3,0], [0,-1], [1,0], [-2,-2], [-2,0], [-3,0]],
    'Diehard':[[-3,0], [-2,0], [-2,1], [2,1], [3,1], [4,1], [3,-1]],
    'Gospers Glider Gun':[[-17,0],[-17,1],[-16,1],[-16,0],[-7,0],[-7,1],[-7,2],[-6,3],[-6,-1],[-5,-2],[-4,-2],[-5,4],[-4,4],[-3,1],[-2,-1],[-2,3],[-1,2],[-1,1],[-1,0],[0,1],[3,0],[4,0],[3,-1],[4,-1],[3,-2],[4,-2],[5,-3],[5,1],[7,1],[7,2],[7,-3],[7,-4],[17,-2],[18,-2],[18,-1],[17,-1]]
  };

  function populatePatterns(patternBox){
    for(var patternName in patterns){
      var option = document.createElement('OPTION');
      option.value=patternName;
      option.innerText=patternName;
      patternBox.appendChild(option);
    }
  }

  function main(){
    var cellSize=15;
    var playing=false;
    var currentPattern='Acorn';
    var drawGrid=true;

    var canvas=document.getElementById('game');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight-50;
    var context=canvas.getContext('2d');

    var activeCells=[];
    canvas.addEventListener('click', (e)=>{
      var x=Math.floor(e.offsetX/cellSize);
      var y=Math.floor(e.offsetY/cellSize);
      var pattern=patterns[currentPattern];
      if(pattern){
        for(var i=0; i<pattern.length; i++){
          var child=pattern[i];
          var newCell=[child[0]+x, child[1]+y]
          var cellIndex=activeCells.findIndex(cell=> matchCells(cell, newCell));
          if(cellIndex===-1){
            activeCells.push(newCell);
          }
        }
      }else{
        var newCell=[x, y];
        var cellIndex=activeCells.findIndex(cell=> matchCells(cell, newCell));
        if(cellIndex===-1){
          activeCells.push(newCell);
        }else{
          activeCells.splice(cellIndex, 1);
        }
      }
      window.activeCells=activeCells;
    });

    function tick(){
      activeCells=nextGen(activeCells);
    }

    function togglePlay(){
      playing=!playing;
    }

    var tickButton=document.getElementById('tick');
    tickButton.addEventListener('click', ()=>{
      tick();
    });

    var playButton=document.getElementById('play');
    playButton.addEventListener('click', ()=>{
      togglePlay();
    });

    var clearButton=document.getElementById('clear');
    clearButton.addEventListener('click', ()=>{
      activeCells=[];
    });

    var gridCheckbox=document.getElementById('draw-grid');
    gridCheckbox.addEventListener('click', e=>{
      drawGrid=e.target.checked;
    });

    var sizeInput=document.getElementById('cell-size');
    sizeInput.addEventListener('keyup', (e)=>{
      var value = parseInt(e.target.value);
      if(!isNaN(value)){
        cellSize=value;
      }
    });

    var patternBox=document.getElementById('patterns');
    populatePatterns(patternBox);
    patternBox.addEventListener('change', e=>{
      currentPattern=e.target.value;
    });
    patternBox.value=currentPattern;

    window.onresize=function(){
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight-50;
    }

    // using keypress because it repeats
    document.addEventListener('keypress', e=>{
      if(e.key===' '){
        if(playing){
          togglePlay();
        }else{
          tick();
        }
      }
    });

    document.addEventListener('keyup', e=>{
      if(e.key==='Enter'){
        togglePlay();
      }
    });

    function animate(){
      draw(context, activeCells, cellSize, drawGrid);
      if(playing){
        tick();
      }
      window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
  }

  main();
})();
