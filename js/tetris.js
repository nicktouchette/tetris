var board = new Board();

function Board() {
  this.height = 20;
  this.width = 40;
  this.stack = [];
  this.currentBlock = {};

  this.init = function() {
    this.board = [];
    for (var h = 0; h < this.height; h++) {
      this.board.push([]);
      for (var w = 0; w < this.width; w++) {
        this.board[h].push(' ');
      };
    };
    this.currentBlock = new Block(this)
    this.update();
  };

  this.display = function() {
    document.getElementById("game").innerHTML = "";
    for (var h = 0; h < this.height; h++) {
      var row = document.createElement("p");
      var text = document.createTextNode(this.board[h].join(''));
      row.appendChild(text);
      document.getElementById("game").appendChild(row);
    };
  };

  this.collisionCheck = function(block,row,col) {
    for (var i = 0; i < 4; i++) {
      var canRow = block.piece[i][0] + block.position.row + row;
      var canCol = block.piece[i][0] + block.position.col + col;
      if (canRow === this.height ||
          canCol === 0 ||
          canCol === this.width) {
        return false;
      } else {
        return true;
      };
    };
  };

  this.draw = function(block) {
    for (var i = 0; i < 4; i++) {
      this.board[block.piece[i][0] + block.position.lastRow][block.piece[i][1] + block.position.lastCol] = ' ';
    }
    for (var i = 0; i < 4; i++) {
      this.board[block.piece[i][0] + block.position.row][block.piece[i][1] + block.position.col] = 'x';
    };
  };

  var that = this;
  this.update = function() {
    that.moveBlock();
    that.draw(that.currentBlock);
    that.display();
    setTimeout(that.update, 500);
  };

  this.moveBlock = function(direction) {
    switch (direction) {
      case 'left':
        this.currentBlock.updatePosition(0,-1);
        break;
      case 'right':
        this.currentBlock.updatePosition(0, +1);
        break;
      default:
        this.currentBlock.updatePosition(+1, 0);
    };
  };

  this.init();
};

function Block(board) {
  this.position = {
    'row': 1,
    'col': (board.width/2) - 1,
    'lastRow': 1,
    'lastCol': (board.width/2) - 1
  };

  //  0   0    0   0  00   00  00
  // 0X0  X    X   X  X0  0X    X0
  //      00  00   0
  //               0
  this.updatePosition = function(row,col) {
    if (board.collisionCheck(this,row,col)) {
      this.position.lastRow = this.position.row;
      this.position.lastCol = this.position.col;
      this.position.row += row;
      this.position.col += col;
    }
  };

  this.randomPiece = function(id) {
    switch (id) {
      case 1:
        return [
          [0, 0],
          [-1, 0],
          [0, -1],
          [0, +1]
        ];
        break;
      case 2:
        return [
          [0, 0],
          [-1, 0],
          [+1, 0],
          [+1, +1]
        ];
        break;
      case 3:
        return [
          [0, 0],
          [-1, 0],
          [+1, 0],
          [+1, -1]
        ];
        break;
      case 4:
        return [
          [0, 0],
          [-1, 0],
          [+1, 0],
          [+2, 0]
        ];
        break;
      case 5:
        return [
          [0, 0],
          [-1, 0],
          [-1, +1],
          [0, +1]
        ];
        break;
      case 6:
        return [
          [0, 0],
          [-1, 0],
          [-1, +1],
          [0, -1]
        ];
        break;
      case 7:
        return [
          [0, 0],
          [-1, 0],
          [-1, -1],
          [0, +1]
        ];
        break;
    };
  };

  this.piece = this.randomPiece(Math.floor(Math.random() * 6) + 1);
};

function move(direction) {
  board.moveBlock(direction);
  board.draw(board.currentBlock);
  board.display();
};

document.onkeydown = function(evt) {
  evt = evt || window.event;
  switch (evt.which || evt.keycode) {
    case 37: // left
      move('left');
      break;

    case 38: // up
      break;

    case 39: // right
      move('right');
      break;

    case 40: // down
      move('down');
      break;

    default:
      return; // exit this handler for other keys
  };
  evt.preventDefault(); // prevent the default action (scroll / move caret)
};
