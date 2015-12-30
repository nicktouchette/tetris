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
      activeBoard.activeTetramino.updatePosition(-1, +1);
      break;
    case keyState[40] && keyState[39]: //down+right
      activeBoard.activeTetramino.updatePosition(+1, +1);
      break;
    case keyState[40]: //down
      activeBoard.activeTetramino.updatePosition(0, +1);
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
