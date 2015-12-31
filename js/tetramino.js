// Class Definition
function Tetramino(board) {
  this.board = board;
  this.position = {
    'xCol': Math.round(this.board.width / 2) - 1,
    'yRow': 0
  };
  this.blocks = [];
  this.init();
}

// Instance Methods
Tetramino.prototype.init = function() {
  // relative to upper left corner shape[id][x][y]
  var definitions = [
    [[+2, 0], [0, 0], [+1, 0], [+3, 0]], // I
    [[+1, -1], [1, 0], [0, -1], [+2, -1]], // T
    [[+1, -1], [+2, 0],[0, -1], [+2, -1]], // L
    [[0, -1], [+1, 0], [0, 0], [+1, -1]], // O
    [[+1, -1], [0, 0], [0, -1], [+2, -1]], // J
    [[+1, -1], [0, 0], [+1, 0], [+2, -1]], // Z
    [[+1, -1], [+1, 0], [+2, 0], [0, -1]] // S
  ];
  this.shapeType = Math.floor(Math.random() * definitions.length);
  this.arrangement = definitions[this.shapeType];
};

Tetramino.prototype.updatePosition = function(newXCol, newYRow, rotate) {
  this.board.removeFromArray(this);
  var collide = this.board.collisionCheck(this, newXCol, newYRow, rotate);
  if (!collide) {
    this.position.yRow += newYRow;
    this.position.xCol += newXCol;
    if (rotate === "rotateClockwise") {
      this.arrangement = this.rotate();
    }
  }
  this.blocks = this.build();
  if (!this.board.lineCheck()) {
    this.board.addToArray(this);
  }
  this.board.display();
};

Tetramino.prototype.rotate = function() {
  // Define 90 degree rotation matrix
  var x1 = 0, x2 = 1, y1 = -1, y2 = 0;
  var x = 0, y = 0;

  return this.arrangement.map(function(block) {
    var x = block[0], y = block[1];
    return [(x1 * x) + (x2 * y), (y1 * x) + (y2 * y)];
  });
};

Tetramino.prototype.build = function(arrangement) {
  var renderedBlock = [];
  if (!arrangement) {
    arrangement = this.arrangement;
  }

  // set relative location based on first element of arrangement[]
  var x = 0 - arrangement[0][0], y = 0 - arrangement[0][1];

  // apply relative location to other elements + current row/col
  for (var block = 0; block < arrangement.length; block++) {
    renderedBlock.push([arrangement[block][0]+x + this.position.xCol,
                      ((arrangement[block][1]+y) * -1) + this.position.yRow]);
  }
  return renderedBlock;
};
