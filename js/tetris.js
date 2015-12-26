var board = new Board();

function Board() {
  this.height = 20;
  this.width = 40;
  this.currentBlock = {};

  this.init = function() {
    this.board = [];

    //[Row][Col]
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

  this.collisionCheck = function(block,xCol,yRow,direction) {
    for (var i = 0; i < block.piece.length; i++) {
      var newPos = [block.piece[i][1] + block.position.yRow + yRow, block.piece[i][0] + block.position.xCol + xCol];
      if (newPos[0] === this.height) {
        this.currentBlock = new Block(this);
        return false;
      } else if (newPos[1] < 0 || newPos[1] === this.width) {
        return false;
      } else if (this.board[newPos[0]][newPos[1]] === "X") {
          if (direction === 'down') {
            this.currentBlock = new Block(this);
          }
          return false;
      };
    };
    return true;
  };

  this.draw = function(block) {
    for (var i = 0; i < block.piece.length; i++) {
      this.board[block.piece[i][1] + block.position.yRow][block.piece[i][0] + block.position.xCol] = 'X';
    };
  };

  this.undraw = function(block) {
    for (var i = 0; i < block.piece.length; i++) {
      this.board[block.piece[i][1] + block.position.yRow][block.piece[i][0] + block.position.xCol] = ' ';
    };
  };

  var that = this;
  this.update = function() {
    that.moveBlock();
    setTimeout(that.update, 500);
  };

  this.moveBlock = function(direction) {
    switch (direction) {
      case 'left':
        this.currentBlock.updatePosition(-1, 0);
        break;
      case 'right':
        this.currentBlock.updatePosition(+1, 0);
        break;
      default:
        this.currentBlock.updatePosition(0, +1, 'down');
    };
  };

  this.init();
};

function Block(board) {
  this.position = {
    'xCol': (board.width/2) - 1,
    'yRow': 1,
    'prevXCol': (board.width/2) - 1,
    'prevYRow': 1
  };

  //  0   0    0   0  00   00  00
  // 0X0  X    X   X  X0  0X    X0
  //      00  00   0
  //               0
  this.updatePosition = function(xCol,yRow,direction) {
    board.undraw(this);
    if (board.collisionCheck(this,xCol,yRow,direction)) {
      this.position.prevYRow = this.position.yRow;
      this.position.prevXCol = this.position.xCol;
      this.position.yRow += yRow;
      this.position.xCol += xCol;
    };
    board.draw(this);
    board.display();
  };

  //  0
  //  X0   [0,0],[0,-1],[-1,0],[+1,0]
  //  0    [0,0],[0,+1],[-1,0],[+1,0]

//x,y [col,row]
  this.randomPiece = function(id) {
    switch (id) {
      case 1:
        return [
          [0, 0],
          [0, -1],
          [-1, 0],
          [+1, 0]
        ];
        break;
      case 2:
        return [
          [0, 0],
          [0, -1],
          [0, +1],
          [+1, +1]
        ];
        break;
      case 3:
        return [
          [0, 0],
          [0, -1],
          [0, +1],
          [-1, +1]
        ];
        break;
      case 4:
        return [
          [0, 0],
          [0, -1],
          [0, +1],
          [0, +2]
        ];
        break;
      case 5:
        return [
          [0, 0],
          [0, -1],
          [+1, -1],
          [+1, 0]
        ];
        break;
      case 6:
        return [
          [0, 0],
          [0, -1],
          [+1, -1],
          [-1, 0]
        ];
        break;
      case 7:
        return [
          [0, 0],
          [0, -1],
          [-1, -1],
          [+1, 0]
        ];
        break;
    };
  };
  // this.piece = this.randomPiece(3);
  this.piece = this.randomPiece(Math.round(Math.random() * 6) + 1);
};

document.onkeydown = function(evt) {
  evt = evt || window.event;
  switch (evt.which || evt.keycode) {
    case 37: // left
      board.moveBlock('left');
      break;

    case 38: // up
      break;

    case 39: // right
      board.moveBlock('right');
      break;

    case 40: // down
      board.moveBlock('down');
      break;

    default:
      return; // exit this handler for other keys
  };
  evt.preventDefault(); // prevent the default action (scroll / move caret)
};
