# Tetris

A flavor of Tetris developed using javascript and DOM manuipulation.

[Play Here](http://nicktouchette.github.com/tetris)

## How it works

Each gameboard is comprised of 22 paragraph elements with 10 monospaced spaces on each row.  However, the top 2 rows are hidden which is where the pieces spawn.  The Tetramino's are represented as a group of 4 █'s.

````html
<p>          </p>
<p>          </p>
<p>          </p>
<p>          </p>
<p>          </p>
<p>          </p>
<p>   ██     </p>
<p>    ██    </p>
<p>          </p>
<p>          </p>
<p>          </p>
<p>          </p>
<p>          </p>
<p>          </p>
<p>█ ████    </p>
<p>███    █  </p>
<p>███ ████ █</p>
<p>█████ ████</p>
<p>███ ██████</p>
<p>██████ ███</p>
````

The goal of Tetris is to complete a row with the blocks provided.  When completed the row will disappear and reward the player with an increase in lines cleared as well as an increase in score.  The player loses the game when the Tetramino spawns hitting the ceiling.

## Controls

* __Left or Right Arrow Key__  
  Move the piece sideways
* __Up Arrow Key__  
  Rotate the piece clockwise
* __Down Arrow Key__  
  Soft drop (force 1 line down)
* __Spacebar__  
  Hard drop (instant drop)
* __P Key__ _(toggle)_  
  Pause the game

## Multiplayer

Multiplayer has not been implemented at this time, although the game has been coded to run multiple instances on the same page.  The live version (gh-pages) removes this functionality, but the (master) branch includes it.

Enjoy!
