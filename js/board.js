// Class Definition
function Board() {
  // Instance count + ID used for DOM manipulation
  Board.numInstances = (Board.numInstances || 0) + 1;
  this.gameID = Board.numInstances;
  // height and width of play area first 2 rows are hidden from view
  this.height = 22;
  this.width = 10;
  // when writing to board use [row, col];
  this.board = [];

  this.init();

  this.update = function() {
    that.activeTetramino.updatePosition(0, +1, 'down');
    if (that.active) {
      setTimeout(that.update, 500);
    }
  }
  var that = this;
  this.update(this);
};

// Instance Methods
Board.prototype.init = function() {
  // Fill array with blank spaces using form [Row][Col]
  for (var row = 0; row < this.height; row++) {
    this.board.push([]);
    for (var col = 0; col < this.width; col++) {
      this.board[row].push(' ');
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

  // make new activeBlock and nextBlock if first instance
  this.createNewBlock();

  // set DOM elements for board
  this.gameWindow = document.getElementById("gameId" + this.gameID);
  this.displayedRows = this.gameWindow.getElementsByTagName("p");

  // display empty game window to init display in DOM
  this.display();

  // add click event to each game container to toggle keyboard focus
  gameContainer.onclick = function() {
    activeBoard = players[that.gameID]
  }

  // active will determine if game still runs or not
  this.active = true;
};

Board.prototype.display = function() {
  // create empty paragraphs within DOM
  if (this.displayedRows.length > 0) {
    for (var row = 0; row < this.displayedRows.length; row++) {
      var text = this.board[row + 2].join('');
      if (this.displayedRows[row].textContent != text) {
        this.displayedRows[row].innerText = text;
      }
    }
  } else {
    // create empty paragraphs within DOM
    for (var row = 2; row < this.height; row++) {
      var text = this.board[row].join('');
      var textNode = document.createTextNode(text);
      var p = document.createElement("p");
      p.appendChild(textNode);
      this.gameWindow.appendChild(p);
    }
  }
};

Board.prototype.displayNext = function() {
  document.getElementById("status").innerHTML = "";
  for (var row = 0; row < this.next.length; row++) {
    var p = document.createElement("p");
    var text = document.createTextNode(this.next[row].join(''));
    p.appendChild(text);
    document.getElementById("status").appendChild(p);
  }
};

Board.prototype.clearRow = function(lines) {
  lines.forEach(function(line) {
    this.board.splice(line, 1);
    this.board.unshift((new Array(this.width).fill(' ')));
  },this);
};

Board.prototype.collisionCheck = function(tetramino, xCol, yRow, direction) {
  var updatedPiece = tetramino.build(direction === 'rotateClockwise' ? tetramino.rotate() : null);
  for (var block = 0; block < updatedPiece.length; block++) {
    var newPos = { 'x': updatedPiece[block][0] + xCol, 'y': updatedPiece[block][1] + yRow };

    if (newPos.y === this.height) {
      this.createNewBlock();
      return false;
    } else if (newPos.x < 0 || newPos.x >= this.width) {
      return false;
    } else if (this.board[newPos.y][newPos.x] != ' ') {
      if (direction === 'down') {
        if (newPos.y <= 2) {
          this.active = false;
        } else {
          this.createNewBlock();
        }
      }
      return false;
    }
  }
  return true;
};

Board.prototype.createNewBlock = function() {
  // create a next block array for first instance of board
  if (this.gameID === 1) {
    this.activeTetramino = this.nextTetramino || new Tetramino(this);
    this.nextTetramino = new Tetramino(this);
    this.next = [];
    for (var i = 0; i < 3; i++) {
      this.next.push(new Array(4).fill(' '));
    }
    this.nextTetramino.position.xCol = 2;
    this.nextTetramino.position.yRow = 1;
    this.nextTetramino.blocks = this.nextTetramino.build();
    this.nextTetramino.position.xCol = Math.round(this.width / 2) -1;
    this.nextTetramino.position.yRow = 0;
    this.addToArray(this.nextTetramino, this.next);
    this.displayNext();
  } else {
    this.activeTetramino = new Tetramino(this);
  }
};

Board.prototype.lineCheck = function() {
  var linesToClear = [];
  for (var row = 0; row < this.height; row++) {
    var line = this.board[row].join('')
    if ((line.match(/█/g) || []).length === this.width) {
      linesToClear.push(row);
    }
  }
  if (linesToClear.length > 0) {
    this.clearRow(linesToClear);
    return true;
  }
  return false;
};

Board.prototype.addToArray = function(tetramino, where) {
  tetramino.blocks.forEach(function(block, i) {
    (where || this.board)[block[1]][block[0]] = '█';
  },this);
};

Board.prototype.removeFromArray = function(tetramino) {
  tetramino.blocks.forEach(function(block, i) {
    this.board[block[1]][block[0]] = ' ';
  },this);
};
