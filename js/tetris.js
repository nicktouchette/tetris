(function() {
  'use strict';

  // Create 4 player windows and set first window as keydown target
  var players = [new Board(),new Board(),new Board(),new Board()];
  var activeBoard = players[0];

  function Board() {
    // Instance count + ID used for DOM manipulation
    Board.numInstances = (Board.numInstances || 0) + 1;
    this.gameID = Board.numInstances;

    this.height = 22;
    this.width = 10;
    this.board = [];
    this.pieces = [];
    this.score = 0;
    this.level = 0;
    this.speed = 500;
    this.paused = false;
    this.linesCleared = 0;
    this.bestScore = localStorage.getItem('bestScore') || 0;

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

      var h2 = document.createElement("h2");
      var caption = document.createTextNode("Player " + this.gameID);
      h2.appendChild(caption);
      gameContainer.appendChild(h2);

      document.body.appendChild(gameContainer);

      // Add status bar to only the first instance of game
      if (this.gameID === 1) {
        var statusBar = document.createElement("div");
        statusBar.setAttribute("id", "status");
        document.body.appendChild(statusBar);

        var nextWindow = document.createElement("div");
        nextWindow.setAttribute("id", "next");
        statusBar.appendChild(nextWindow);

        var stats = document.createElement("div");
        stats.setAttribute("id", "stats");
        statusBar.appendChild(stats);

        var ul = document.createElement("ul");

        // SCORE
        caption = document.createTextNode("BEST");
        var h2 = document.createElement("h2");
        var li = document.createElement("li");
        h2.appendChild(caption);
        li.appendChild(h2);
        ul.appendChild(li);

        var bestScore = document.createTextNode(this.bestScore);
        li = document.createElement("li");
        li.setAttribute("id", "best");
        li.appendChild(bestScore);
        ul.appendChild(li);

        // SCORE
        caption = document.createTextNode("SCORE");
        var h2 = document.createElement("h2");
        var li = document.createElement("li");
        h2.appendChild(caption);
        li.appendChild(h2);
        ul.appendChild(li);

        var score = document.createTextNode(this.score);
        li = document.createElement("li");
        li.setAttribute("id", "score");
        li.appendChild(score);
        ul.appendChild(li);

        // LEVEL
        caption = document.createTextNode("LEVEL");
        h2 = document.createElement("h2");
        li = document.createElement("li");
        h2.appendChild(caption);
        li.appendChild(h2);
        ul.appendChild(li);

        var level = document.createTextNode(this.level);
        li = document.createElement("li");
        li.setAttribute("id", "level");
        li.appendChild(level);
        ul.appendChild(li);

        // LINES
        caption = document.createTextNode("LINES");
        h2 = document.createElement("h2");
        li = document.createElement("li");
        h2.appendChild(caption);
        li.appendChild(h2);
        ul.appendChild(li);

        var linesCleared = document.createTextNode(this.linesCleared);
        li = document.createElement("li");
        li.setAttribute("id", "linesCleared");
        li.appendChild(linesCleared);
        ul.appendChild(li);

        stats.appendChild(ul);
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

      setTimeout(that.update, this.speed);
    };

    var that = this;
    this.update = function() {
      that.activeTetramino.updatePosition(0, +1, 'down');
      if (that.active) {
        setTimeout(that.update, (that.speed - that.level * 30));
      } else {
        that.displayedRows[Math.floor((that.height - 3)/2)].innerText = " GAMEOVER ";
      }
    };

    this.pause = function() {
      this.paused = !this.paused;
      that.displayedRows[Math.floor((that.height - 3)/2)].innerText = "  PAUSED  ";
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
      document.getElementById("next").innerHTML = "";
      for (var row = 0; row < this.next.length; row++) {
        var p = document.createElement("p");
        var text = document.createTextNode(this.next[row].join(''));
        p.appendChild(text);
        document.getElementById("next").appendChild(p);
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
          return true;
        } else if (newPos[1] < 0 || newPos[1] >= this.width || newPos[0] < 0) {
          return true;
        } else if (this.board[newPos[0]][newPos[1]] != ' ') {
            if (direction === 'down') {
              if (newPos[0] <= 2) {
                this.active = false;
              } else {
                this.createNewBlock();
              }
            }
            return true;
        }
      }
      return false;
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
        if (this.gameID === 1) {
          this.updateStats(linesToClear.length);
        }
        this.clearRow(linesToClear);
        return true;
      }
      if (this.gameID === 1) {
        this.updateStats();
      }
      return false;
    };

    this.updateStats = function(lines) {
      var element;
      if (lines) {
        this.linesCleared += lines;
        switch(lines) {
          case 1:
            this.score += 40 * (this.level + 1);
            break;
          case 2:
            this.score += 100 * (this.level + 1);
            break;
          case 3:
            this.score += 300 * (this.level + 1);
            break;
          case 4:
            this.score += 1200 * (this.level + 1);
            break;
        }

        if (this.linesCleared / 10 >= this.level + 1) {
          this.level += 1;
          element = document.getElementById("level");
          element.innerText = this.level;
        }

        element = document.getElementById("linesCleared");
        element.innerText = this.linesCleared;
      }

      element = document.getElementById("score");
      element.innerText = this.score;

      element = document.getElementById("best");
      if (this.score < this.bestScore) {
        element.innerText = this.bestScore;
      } else {
        element.innerText = this.score;
        localStorage.setItem('bestScore', this.score);
      }
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

      if (board.pieces.length === 0) {
        for (var i = 0; i < definitions.length; i++) {
          board.pieces.push(i,i,i,i);
        }
      }
      this.shapeType = board.pieces.splice(Math.floor(Math.random() * board.pieces.length -1), 1);
      this.arrangement = definitions[this.shapeType];
    };

    this.hardDrop = function() {
      var collide = false;
      while (!collide) {
        board.removeFromArray(this);
        collide = board.collisionCheck(this,0,+1,'down');
        if (!collide) {
          this.pivot.yRow += 1;
          if (board.gameID === 1) {
            board.score += 2;
          }
          this.blocks = this.build();
          board.addToArray(this);
        }
      }
      if (!board.lineCheck()) {
        board.addToArray(this);
      }
      board.display();
    };

    this.updatePosition = function(newXCol,newYRow,direction,droptype) {
      if (!board.paused && board.active) {
        if (droptype === 'hard') {
          this.hardDrop();
          return true;
        }
        board.removeFromArray(this);
        if (!board.collisionCheck(this,newXCol,newYRow,direction)) {
          this.pivot.yRow += newYRow;
          this.pivot.xCol += newXCol;
          if (board.gameID === 1 && droptype === 'soft') {
            board.score += 1;
          }
          if (direction === "rotateClockwise" && this.shapeType[0] !== 3) {
            this.arrangement = this.rotate();
          }
        }
        this.blocks = this.build();
        if (!board.lineCheck()) {
          board.addToArray(this);
        }
        board.display();
      }
    };

    this.rotate = function() {
      // Define 90 degree rotation matrix
      var x1 = 0, x2 = 1, y1 = -1, y2 = 0;

      if (this.shapeType[0] === 3) {
        return this.arrangement;
      }
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

  var keydown = function(evt) {
    evt = evt || window.event;
    evt.preventDefault(); // prevent the default action (scroll / move caret)
    keyState[evt.keyCode || evt.which] = true;
    switch (evt.which || evt.keycode) {
      case 38: // up
        activeBoard.activeTetramino.updatePosition(0, 0, 'rotateClockwise');
        break;
      case 32: // space
        activeBoard.activeTetramino.updatePosition(null, null, null, 'hard');
        break;
      case 80:
        activeBoard.pause();
        break;
    }
  };
  window.addEventListener('keydown', keydown, true);


  var keyup = function(evt) {
    evt = evt || window.event;
    evt.preventDefault(); // prevent the default action (scroll / move caret)
    keyState[evt.keyCode || evt.which] = false;
  };
  window.addEventListener('keyup', keyup, true);

  // Use loop to to check for active keys
  var directionKeyTimer;
  function directionKeys() {
    switch(true){
      case keyState[40] && keyState[37]: //down+left
        activeBoard.activeTetramino.updatePosition(0, +1, 'down', 'soft');
        activeBoard.activeTetramino.updatePosition(-1, 0);
        break;
      case keyState[40] && keyState[39]: //down+right
        activeBoard.activeTetramino.updatePosition(0, +1, 'down', 'soft');
        activeBoard.activeTetramino.updatePosition(+1, 0);
        break;
      case keyState[40]: //down
        activeBoard.activeTetramino.updatePosition(0, +1, 'down', 'soft');
        break;
      case keyState[37]: //left
        activeBoard.activeTetramino.updatePosition(-1, 0);
        break;
      case keyState[39]: //right
        activeBoard.activeTetramino.updatePosition(+1, 0);
        break;
    }
      directionKeyTimer = setTimeout(directionKeys, 100);
  }
  directionKeys();
}());
