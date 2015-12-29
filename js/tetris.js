// Create 4 player windows and set first window as keydown target
var players = [new Board(), new Board(), new Board(), new Board()];
var activeBoard = players[0];

function Board() {
  // Instance count + ID used for DOM manipulation
  Board.numInstances = (Board.numInstances || 0) + 1;
  this.gameID = Board.numInstances;

  this.height = 22;
  this.width = 10;
  this.board = [];
  this.next = [[' ', ' ', ' ', ' '],[' ', ' ', ' ', ' '],[' ', ' ', ' ', ' ']];

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

    if (this.gameID === 1) {
      var statusBar = document.createElement("div");
      statusBar.setAttribute("id", "status");
      document.body.appendChild(statusBar);

      this.updateNext();
    } else {
      this.activeTetramino = new Tetramino(this);
    }
    gameContainer.onclick = function() { activeBoard = players[that.gameID - 1] }

    this.playing = true;
    this.update();
  }

  var that = this;
  this.update = function() {
    that.moveBlock();
    if (that.playing) {
      setTimeout(that.update, 500);
    }
  }

  this.display = function() {
    document.getElementById("gameId" + this.gameID).innerHTML = "";
    for (var row = 2; row < this.height; row++) {
      var p = document.createElement("p");
      var text = document.createTextNode(this.board[row].join(''));
      p.appendChild(text);
      document.getElementById("gameId" + this.gameID).appendChild(p);
    }
  }

  this.displayNext = function() {
    document.getElementById("status").innerHTML = "";
    for (var row = 0; row < this.next.length; row++) {
      var p = document.createElement("p");
      var text = document.createTextNode(this.next[row].join(''));
      p.appendChild(text);
      document.getElementById("status").appendChild(p);
    }
  }

  this.clearRow = function(lines) {
    lines.forEach(function(line) {
      that.board.splice(line, 1);
      that.board.unshift((new Array(that.width).fill(' ')));
    });
  }

  this.collisionCheck = function(tetramino,xCol,yRow,direction) {
    var updatedPiece = tetramino.build(direction === 'rotateClockwise'?tetramino.rotate():null);
    for (var block = 0; block < updatedPiece.length; block++) {
      var newPos = [updatedPiece[block][0] + yRow, updatedPiece[block][1] + xCol];
      if (newPos[0] === this.height) {
        if (this.gameID === 1) {
          this.updateNext();
        } else {
          this.activeTetramino = new Tetramino(this);
        }
        return false;
      } else if (newPos[1] < 0 || newPos[1] >= this.width) {
        return false;
      } else if (this.board[newPos[0]][newPos[1]] != ' ') {
          if (direction === 'down') {
            if (newPos[0] <= 2) {
              this.playing = false;
            } else {
              if (this.gameID === 1) {
                this.updateNext();
              } else {
                this.activeTetramino = new Tetramino(this);
              }
            }
          }
          return false;
      }
    }
    return true;
  }

  this.updateNext = function() {
    this.activeTetramino = this.nextTetramino || new Tetramino(this);
    this.nextTetramino = new Tetramino(this);
    this.next = [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']];
    this.nextTetramino.pivot.xCol = 2;
    this.nextTetramino.blocks = this.nextTetramino.build();
    this.addToArray(this.nextTetramino, this.next);
    this.nextTetramino.pivot.xCol = Math.round(this.width /2);
    this.displayNext();
  }

  this.lineCheck = function() {
    var linesToClear = [];
    for (var row = 0; row < this.height; row++) {
      var line = this.board[row].join('')
      if ((line.match(/█/g)||[]).length === this.width) {
        linesToClear.push(row);
      }
    }
    if (linesToClear.length > 0) {
      this.clearRow(linesToClear);
      return true;
    }
    return false;
  }

  this.addToArray = function(tetramino, where) {
    for (var i = 0; i < tetramino.blocks.length; i++) {
      (where || this.board)[tetramino.blocks[i][0]][tetramino.blocks[i][1]] = '█';
    }
  }

  this.removeFromArray = function(tetramino, where) {
    for (var i = 0; i < tetramino.blocks.length; i++) {
      (where || this.board)[tetramino.blocks[i][0]][tetramino.blocks[i][1]] = ' ';
    }
  }

  this.moveBlock = function(direction) {
    switch (direction) {
      case 'left':
        this.activeTetramino.updatePivot(-1, 0);
        break;
      case 'right':
        this.activeTetramino.updatePivot(+1, 0);
        break;
      case 'rotateClockwise':
        if (this.activeTetramino.shapeType != 4) {
          this.activeTetramino.updatePivot(0, 0, 'rotateClockwise');
        }
        break;
      default:
        this.activeTetramino.updatePivot(0, +1, 'down');
    }
  }

  this.init();
};

function Tetramino(board) {
  this.shapeType = Math.floor(Math.random() * 7) + 1;
  this.pivot = {
    'xCol': Math.round(board.width /2),
    'yRow': 1
  };
  this.blocks = [];

  this.updatePivot = function(newXCol,newYRow,direction) {
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
  }

  //x,y [col,row]
  this.randomTetramino = function(id) {
    switch (id) {
      case 1: // I
        return [
          [0, 0],
          [-1, 0],
          [-2, 0],
          [+1, 0]
        ];
        break;
      case 2: // T
        return [
          [0, 0],
          [-1, 0],
          [-1, -1],
          [+1, 0]
        ];
        break;
      case 3: // L
        return [
          [0, 0],
          [-1, 0],
          [+1, 0],
          [+1, -1]
        ];
        break;
      case 4: // O
        return [
          [0, 0],
          [-1, 0],
          [-1, -1],
          [0, -1]
        ];
        break;
      case 5: // J
        return [
          [0, 0],
          [-1, 0],
          [+1, 0],
          [0, -1]
        ];
        break;
      case 6: // Z
        return [
          [0, +1],
          [0, +1],
          [-1, +1],
          [+1, 0]
        ];
        break;
      case 7: // S
        return [
          [0, +1],
          [-1, 0],
          [0, +1],
          [+1, +1]
        ];
        break;
    }
  }

  this.rotate = function() {
    // Define 90 degree rotation matrix
    var x1 = 0, x2 = 1, y1 = -1, y2 = 0;
    var x = 0, y = 0;

    return this.arrangement.map(function(block) {
      x = block[0], y = block[1];
      return [(x1 * x) + (x2 * y), (y1 * x) + (y2 * y)];
    });
  }

  this.build = function(arrangement) {
    if (!arrangement) {
      arrangement = this.arrangement;
    }
    var renderedBlock = [[this.pivot.yRow + arrangement[0][1], this.pivot.xCol]];
    for (var block = 1; block < arrangement.length; block++) {
      renderedBlock.push([(arrangement[block][1]*-1) + renderedBlock[0][0], arrangement[block][0] + renderedBlock[0][1]]);
    }
    return renderedBlock;
  }
  this.arrangement = this.randomTetramino(this.shapeType);
};

document.onkeydown = function(evt) {
  evt = evt || window.event;
  switch (evt.which || evt.keycode) {
    case 37: // left
      activeBoard.moveBlock('left');
      break;

    case 38: // up
      activeBoard.moveBlock('rotateClockwise');
      break;

    case 39: // right
      activeBoard.moveBlock('right');
      break;

    case 40: // down
      activeBoard.moveBlock('down');
      break;

    default:
      return; // exit this handler for other keys
  }
  evt.preventDefault(); // prevent the default action (scroll / move caret)
}
