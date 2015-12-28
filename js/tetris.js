var board = new Board();

function Board() {
  this.height = 22;
  this.width = 10;
  this.activeTetramino = {};

  this.init = function() {
    this.board = [];

    //[Row][Col]
    for (var h = 0; h < this.height; h++) {
      this.board.push([]);
      for (var w = 0; w < this.width; w++) {
        this.board[h].push(' ');
      }
    }
    this.activeTetramino = new Tetramino(this)
    this.update();
  }

  this.display = function() {
    document.getElementById("game").innerHTML = "";
    for (var row = 2; row < this.height; row++) {
      var p = document.createElement("p");
      var text = document.createTextNode(this.board[row].join(''));
      p.appendChild(text);
      document.getElementById("game").appendChild(p);
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
        board.activeTetramino = new Tetramino(this);
        return false;
      } else if (newPos[1] < 0 || newPos[1] >= this.width) {
        return false;
      } else if (this.board[newPos[0]][newPos[1]] === '█') {
          if (direction === 'down') {
            board.activeTetramino = new Tetramino(this);
          }
          return false;
      }
    }
    return true;
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

  this.draw = function(tetramino) {
    for (var i = 0; i < tetramino.blocks.length; i++) {
      this.board[tetramino.blocks[i][0]][tetramino.blocks[i][1]] = '█';
    }
  }

  this.undraw = function(tetramino) {
    for (var i = 0; i < tetramino.blocks.length; i++) {
      this.board[tetramino.blocks[i][0]][tetramino.blocks[i][1]] = ' ';
    }
  }

  var that = this;
  this.update = function() {
    that.moveBlock();
    setTimeout(that.update, 500);
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
        this.activeTetramino.updatePivot(0, 0, 'rotateClockwise');
        break;
      default:
        this.activeTetramino.updatePivot(0, +1, 'down');
    }
  }

  this.init();
};

function Tetramino(board) {
  this.arrangementType = Math.floor(Math.random() * 7) + 1;
  this.pivot = {
    'xCol': Math.round(board.width /2),
    'yRow': 1
  };
  this.blocks = [];

  this.updatePivot = function(newXCol,newYRow,direction) {
    board.undraw(this);
    if (board.collisionCheck(this,newXCol,newYRow,direction)) {
      this.pivot.yRow += newYRow;
      this.pivot.xCol += newXCol;
      if (direction === "rotateClockwise") {
        this.arrangement = this.rotate();
      }
    }
    this.blocks = this.build();
    if (!board.lineCheck()) {
      board.draw(this);
    }
    board.display();
  }

  //x,y [col,row]
  this.randomTetramino = function(id) {
    switch (id) {
      case 1: // I
        return [
          [-1, 0],
          [-2, 0],
          [+1, 0]
        ];
        break;
      case 2: // T
        return [
          [-1, 0],
          [-1, -1],
          [+1, 0]
        ];
        break;
      case 3: // L
        return [
          [-1, 0],
          [+1, 0],
          [+1, -1]
        ];
        break;
      case 4: // O
        return [
          [-1, 0],
          [-1, -1],
          [0, -1]
        ];
        break;
      case 5: // J
        return [
          [-1, 0],
          [+1, 0],
          [0, -1]
        ];
        break;
      case 6: // Z
        return [
          [0, +1],
          [-1, +1],
          [+1, 0]
        ];
        break;
      case 7: // S
        return [
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

    switch(this.arrangement) {
    case 4:
      return this.arrangement;
      break;
    }

    return this.arrangement.map(function(block) {
      x = block[0], y = block[1];
      return [(x1 * x) + (x2 * y), (y1 * x) + (y2 * y)];
    });
  }

  this.build = function(arrangement) {
    if (!arrangement) {
      arrangement = this.arrangement;
    }
    var renderedBlock = [[this.pivot.yRow, this.pivot.xCol]];
    for (var block = 0; block < arrangement.length; block++) {
      renderedBlock.push([(arrangement[block][1]*-1) + this.pivot.yRow, arrangement[block][0] + this.pivot.xCol]);
    }
    return renderedBlock;
  }
  this.arrangement = this.randomTetramino(this.arrangementType);
};

document.onkeydown = function(evt) {
  evt = evt || window.event;
  switch (evt.which || evt.keycode) {
    case 37: // left
      board.moveBlock('left');
      break;

    case 38: // up
      board.moveBlock('rotateClockwise');
      break;

    case 39: // right
      board.moveBlock('right');
      break;

    case 40: // down
      board.moveBlock('down');
      break;

    default:
      return; // exit this handler for other keys
  }
  evt.preventDefault(); // prevent the default action (scroll / move caret)
}
