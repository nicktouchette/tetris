// Create 4 player windows and set first window as keydown target
var players = [new Board()];
var activeBoard = players[0];

function Board() {
  // Instance count + ID used for DOM manipulation
  Board.numInstances = (Board.numInstances || 0) + 1;
  this.gameID = Board.numInstances;

  this.height = 22;
  this.width = 10;
  this.board = [];

  this.init = function() {
    // Fill array with blank spaces using form [Row][Col]
    for (var h = 0; h < this.height; h++) {
      this.board.push([]);
      for (var w = 0; w < this.width; w++) {
        this.board[h].push(' ');
      }
    }

    // Add game container into DOM
    var gameContainer = document.createElement("div");
    gameContainer.setAttribute("id", "gameId" + this.gameID);
    document.body.appendChild(gameContainer);

    // Add status bar to only the first instance of game
    if (this.gameID === 1) {
      var statusBar = document.createElement("div");
      statusBar.setAttribute("id", "status");
      document.body.appendChild(statusBar);
    }

    // set DOM elements for board
    this.gameWindow = document.getElementById("gameId" + this.gameID);
    this.displayedRows = this.gameWindow.getElementsByTagName("p");

    this.display(true);

    // make new activeBlock and nextBlock if first instance
    this.createNewBlock();

    // active will determine if game still runs or not
    this.active = true;

    gameContainer.onclick = function() { activeBoard = players[that.gameID - 1]; };

    setTimeout(that.update, 500);
  };

  var that = this;
  this.update = function() {
    that.activeTetramino.updatePosition(0, +1, 'down');
    if (that.active) {
      setTimeout(that.update, 500);
    }
  };

  this.display = function(init) {
    var hideRowAmount = 2;
    // write board to paragraphs within DOM
    if (!init) {
      for (var row = 0; row < this.displayedRows.length; row++) {
        var text = this.board[row + hideRowAmount].join('');
        if (this.displayedRows[row].textContent != text) {
          this.displayedRows[row].innerText = text;
        }
      }
    } else {
      // create empty paragraphs within DOM
      for (var row = 0; row < this.height - hideRowAmount; row++) {
        var text = this.board[row].join('');
        var textNode = document.createTextNode(text);
        var p = document.createElement("p");
        p.appendChild(textNode);
        this.gameWindow.appendChild(p);
      }
    }
  };

  this.displayNext = function() {
    document.getElementById("status").innerHTML = "";
    for (var row = 0; row < this.next.length; row++) {
      var p = document.createElement("p");
      var text = document.createTextNode(this.next[row].join(''));
      p.appendChild(text);
      document.getElementById("status").appendChild(p);
    }
  };

  this.clearRow = function(lines) {
    lines.forEach(function(line) {
      this.board.splice(line, 1);
      this.board.unshift((new Array(this.width).fill(' ')));
    }, this);
  };

  this.createNewBlock = function() {
    this.activeTetramino = this.nextTetramino || new Tetramino(this);
    this.nextTetramino = new Tetramino(this);
    this.activeTetramino.blocks = this.activeTetramino.build();
    this.addToArray(this.activeTetramino);
    this.display();

    this.next = [];
    for (var i = 0; i < 2; i++) {
      this.next.push(new Array(4).fill(' '));
    }

    this.nextTetramino.pivot.xCol = 2;
    this.nextTetramino.blocks = this.nextTetramino.build();
    this.addToArray(this.nextTetramino, this.next);
    this.nextTetramino.pivot.xCol = Math.round(this.width /2) - 1;
    if (this.gameID === 1)
      this.displayNext();
  };

  this.collisionCheck = function(tetramino,xCol,yRow,direction) {
    var updatedPiece = tetramino.build(direction === 'rotateClockwise'?tetramino.rotate():null);
    for (var block = 0; block < updatedPiece.length; block++) {
      var newPos = [updatedPiece[block][0] + yRow, updatedPiece[block][1] + xCol];
      if (newPos[0] === this.height) {
        this.createNewBlock();
        return false;
      } else if (newPos[1] < 0 || newPos[1] >= this.width) {
        return false;
      } else if (this.board[newPos[0]][newPos[1]] != ' ') {
          if (direction === 'down') {
            if (newPos[0] <= 2) {
              this.playing = false;
            } else {
              this.createNewBlock();
            }
          }
          return false;
      }
    }
    return true;
  };

  this.lineCheck = function() {
    var linesToClear = [];
    for (var row = 0; row < this.height; row++) {
      var line = this.board[row].join('');
      if ((line.match(/█/g)||[]).length === this.width) {
        linesToClear.push(row);
      }
    }
    if (linesToClear.length > 0) {
      this.clearRow(linesToClear);
      return true;
    }
    return false;
  };

  // row, col
  this.addToArray = function(tetramino, where) {
    tetramino.blocks.forEach(function(block, i) {
      (where || this.board)[block[0]][block[1]] = '█';
    },this);
  };

  this.removeFromArray = function(tetramino, where) {
    tetramino.blocks.forEach(function(block, i) {
      this.board[block[0]][block[1]] = ' ';
    },this);
  };

  this.init();
}

function Tetramino(board) {
  this.pivot = {
    'xCol': Math.round(board.width /2) -1,
    'yRow': 1
  };
  this.blocks = [];

  this.init = function() {
    var definitions = [
      // xCol, yRow
      [[0, 0],[-1, 0],[-2, 0],[+1, 0]], // I
      [[0, 0],[-1, 0],[0, +1],[+1, 0]], // T
      [[0, 0],[-1, 0],[+1, 0],[+1, +1]], // L
      [[0, 0],[+1, 0],[+1, +1],[0, +1]], // O
      [[0, 0],[-1, 0],[+1, 0],[-1, +1]], // J
      [[0, 0],[0, +1],[-1, +1],[+1, 0]], // Z
      [[0, 0],[-1, 0],[0, +1],[+1, +1]]  // S
    ];
    this.shapeType = Math.floor(Math.random() * definitions.length);
    this.arrangement = definitions[this.shapeType];
  };

  this.updatePosition = function(newXCol,newYRow,direction) {
    board.removeFromArray(this);
    if (board.collisionCheck(this,newXCol,newYRow,direction)) {
      this.pivot.yRow += newYRow;
      this.pivot.xCol += newXCol;
      if (direction === "rotateClockwise") {
        this.arrangement = this.rotate();
      }
    }
    this.blocks = this.build();
    if (!board.lineCheck()) {
      board.addToArray(this);
    }
    board.display();
  };

  this.rotate = function() {
    // Define 90 degree rotation matrix
    var x1 = 0, x2 = 1, y1 = -1, y2 = 0;

    return this.arrangement.map(function(block) {
      var x = block[0], y = block[1];
      return [(x1 * x) + (x2 * y), (y1 * x) + (y2 * y)];
    });
  };

  // arrangement comes in as xCol,yRow
  this.build = function(arrangement) {
    if (!arrangement) {
      arrangement = this.arrangement;
    }

    var renderedBlock = [[this.pivot.yRow + (arrangement[0][1] * -1), this.pivot.xCol + arrangement[0][0]]];

    //yRow, xCol
    for (var block = 1; block < arrangement.length; block++) {
      renderedBlock.push([renderedBlock[0][0] + (arrangement[block][1] * -1), renderedBlock[0][1] + arrangement[block][0]]);
      // renderedBlock.push([(arrangement[block][1]*-1) + this.pivot.yRow, arrangement[block][0] + this.pivot.xCol]);
    }
    return renderedBlock;
  };

  this.init();
}

// Toggle keystate on keydown and keyup
var keyState = {};

window.addEventListener('keydown',function(evt){
  evt = evt || window.event;
  evt.preventDefault(); // prevent the default action (scroll / move caret)
  keyState[evt.keyCode || evt.which] = true;
  switch (evt.which || evt.keycode) {
    case 38: // up
      activeBoard.activeTetramino.updatePosition(0, 0, 'rotateClockwise');
    break;
  }
},true);

window.addEventListener('keyup',function(evt){
  evt = evt || window.event;
  evt.preventDefault(); // prevent the default action (scroll / move caret)
  keyState[evt.keyCode || evt.which] = false;
},true);

// Use loop to to check for active keys
function directionKeys() {
  switch(true){
    case keyState[40] && keyState[37]: //down+left
      activeBoard.activeTetramino.updatePosition(0, +1, 'down');
      activeBoard.activeTetramino.updatePosition(-1, 0);
      break;
    case keyState[40] && keyState[39]: //down+right
      activeBoard.activeTetramino.updatePosition(0, +1, 'down');
      activeBoard.activeTetramino.updatePosition(+1, 0);
      break;
    case keyState[40]: //down
      activeBoard.activeTetramino.updatePosition(0, +1, 'down');
      break;
    case keyState[37]: //left
      activeBoard.activeTetramino.updatePosition(-1, 0);
      break;
    case keyState[39]: //right
      activeBoard.activeTetramino.updatePosition(+1, 0);
      break;
  }
    setTimeout(directionKeys, 100);
}
directionKeys();
