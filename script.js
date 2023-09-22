/*
***********************************************
PROGRAM NAME - Flappy Bird

PROGRAMMER - Mr. Richards

VERSION - v1.0

DATE - Started 12-01-2022

BUGS - list your bugs here - NONE

DESCRIPTION - This is flappy bird replica made by Dylan
              
REFERENCES - None

SELF-ASSESSMENT - I beleive this program deserves a level 4+ because the game has:
- a start screen
- many variables 
- a loop with draw()
- custom functions with gameOver() and resetGame()
- collision detection
- sound effects and music
- game states and the game loop
- user events
- the code is very well commented
- the code is organized with indenting and proper variable names
- animation
- decision based coding (if statements)
                  
*************************************************
*/

let gameState = "Start"; // initializes the gamestate var to equal start

// preload function variables

// background preloads
let backgroundSound; //background music
let backgroundImage; // background image 1
let getReady; // background image 2

//bird images
let blueUp;
let blueDown;
let redUp;
let redDown;
let yellowUp;
let yellowDown;
let birdUp;
let birdDown;

//pipe images
let pipeUp;
let pipeDown;

let birdColor; // bird color variable
let gameMode; // gamemode variable

let death; // death sound
let hit; // hit sound
let swoosh; // swoosh sound
let wing; // wing sound

let pipeArr = []; // empty array for pipes

let score = 0; // score
let baseX = 0; // x value for scrolling base

let birdX; // bird x
let birdY; // bird y

let highScores = []; // highscores

/** FUNCTION: preload - preloads all asses
*/

function preload() { // loading all sounds + sfx and images

  //Most of these images are taken from here: https://github.com/samuelcust/flappy-bird-assets

  //Sounds
  flappySong = loadSound('FlappyBirdSong.mp3'); // default background sound for the game (it loops)
  flappySong2 = loadSound('FlappyBirdSong2.mp3'); // alternative background sound for the game

  //font
  flappyFont = loadFont('flappy-font.ttf');
  flappyFont2 = loadFont('FlappyBirdy.ttf')

  //Images / sprites
  backgroundImage = loadImage('backgroundFlappy.png'); // background Image for the actual gameplay
  getReady = loadImage('Flappy-Bird-Get-Ready.png')

  //birds
  blueUp = loadImage('bluebird-upflap.png');
  blueDown = loadImage('bluebird-downflap.png');

  redUp = loadImage('redbird-upflap.png');
  redDown = loadImage('redbird-downflap.png');

  yellowUp = loadImage('yellowbird-upflap.png');
  yellowDown = loadImage('yellowbird-downflap.png');

  //  pipes
  pipeUp = loadImage('pipeUp.png');
  pipeDown = loadImage('pipeDown.png')

  //sfx
  death = loadSound('audio_die.wav');
  scoreSound = loadSound('audio_point.wav');
  hit = loadSound('audio_hit.wav');
  swoosh = loadSound('audio_swoosh.wav');
  wing = loadSound('audio_wing.wav');

  //base
  base = loadImage("base.png");


} // preload function end

/** FUNCTION: setup - sets up the window etc.
*/

function setup() { // setup function start
  createCanvas(400, 600); //create 400x600 window
  flappySong.loop(); // loops background song
  background(backgroundImage); // sets background image to backgroundimage
  fill('FFFFFF'); // fill font color to be white
  textFont(flappyFont); // sets font
  gameMode = "easy"; // sets initial gamemode
  birdColor = "yellow"; // sets initial bird color

  bird = new Bird(); // new bird object
  highScores = loadStrings('highscores.txt'); // Reads the contents of txt file and creates a String array of its individual lines.

  if (gameState == "Start") { // starts the game if gamestate = start
    startMenu(); // calls start menu function
  }

} // setup function end

/** FUNCTION: startmenu - intro screen
*/
function startMenu() { // startmenu function start
  textAlign(CENTER); // aligns text to center
  fill(0); // black font
  textSize(33); //text size to 33
  text("Welcome to Dylan's \n Flappy bird Clone.", width / 2, height / 5); // text
  text("Click to continue.", width / 2, height / 3); // mreo text
  textSize(32); // text size 32
  fill('#FFFFFF') // white font
  text("Welcome to Dylan's \n Flappy bird Clone.", width / 2, height / 5); // text
  text("Click to continue.", width / 2, height / 3); //text


  for (let i = 0; i < 10; i++) { // creates 10 yellow birds with random positons
    image(yellowUp, random(10, width - 50), random(200, height - 50))
  }
} // start menu funciton end

/** FUNCTION: draw function - used for the main game
*/

function draw() { // Function that is called every frame

  // Check if the game state is "playGame"
  if (gameState == "playGame") {

    // Set the background to the background image
    background(backgroundImage);

    // Display and update the bird object
    bird.display();
    bird.update();

    // Loop through each pipe in the pipe array
    for (let i = pipeArr.length - 1; i >= 0; i--) {

      // Display, score and update the pipe
      pipeArr[i].display();
      pipeArr[i].score();
      pipeArr[i].update();

      // If the pipe is off screen, remove it from the array
      if (pipeArr[i].offScreen() == true) {
        pipeArr.splice(i, 1)
      }

      // If the bird collides with a pipe, change the game state to "gameOver"
      if (pipeArr[i].collision(bird) == true) {
        gameState = "gameOver";
        hit.play();
        death.play();
      }
    }

    // Add pipes at regular intervals depending on the game mode
    if (frameCount % 75 == 0 && gameMode == "easy" || frameCount % 75 == 0 && gameMode == "flipped") {
      pipeArr.push(new Pipe());
    } else if (frameCount % 50 == 0 && gameMode == "medium") {
      pipeArr.push(new Pipe());
    } else if (frameCount % 35 == 0 && gameMode == "hard") {
      pipeArr.push(new Pipe());
    }

    // Scrolling base
    baseX -= 0.9;

    // If the base is off screen, reset its position
    if (baseX < -base.width + 100) {
      baseX = 0;
    }

    // Display the base at its current position and at the end of the screen to give the scrolling effect
    image(base, baseX, 500);
    image(base, baseX + base.width - 1, 500)

  }

  // If the game state is "gameOver", call the gameOver function and reset the game state
  if (gameState == "gameOver") {
    gameOver();
    gameState = "";
  }
} // draw function end

/** FUNCTION: mouseClicked - does something when the mouse is clicked
*/

function mouseClicked() { // Function that is called when the mouse is clicked

  // If the game state is "Start", call the configuration function, change the game state to an empty string, and play the swoosh sound effect
  if (gameState == "Start") {
    configuration();
    gameState = "";
    swoosh.play();
  }

  // If the game state is "Rules", call the gameStart function and play the swoosh sound effect
  if (gameState == "Rules") {
    gameStart();
    swoosh.play();
  }
} // mouse clicked function end

/** FUNCTION: keyPressed - does something when the specfic key is pressed
*/
function keyPressed() { // Function that is called when a key is pressed

  // If the space bar is pressed and the game state is "gameStart", play the swoosh sound effect and change the game state to "playGame"
  if (keyCode == 32 && gameState == "gameStart") {
    swoosh.play();
    gameState = "playGame";
  }

  // If the space bar is pressed and the game state is "playGame", make the bird flap
  if (keyCode == 32 && gameState == "playGame") {
    bird.up();
  }
} // keypressed function end

/** FUNCTION: createButton - Creates a Button
*@param {string} buttonName - This will be the displayed name on the button created.
*@param {int} positionX - X coordinate of the button.
*@param {int} positionY - Y coordinate of the button.
*@param {function} callFunction - The function called when you press the button.
*@param {string} buttonPosition - How the button will be placed along the screen.
*/

function createbutton(buttonName, positionX, positionY, callFunction, buttonPosition) { // Function to create a button

  button = createButton(buttonName) // Create a button with the given name
  button.style('padding', '30px 30px') // Set the padding of the button to 30px on the top and bottom, and 30px on the left and right

  button.mousePressed(function() { // When the button is clicked, call the given function and play the swoosh sound effect
    callFunction();
    swoosh.play();
  })

  if (buttonPosition == "center") { // If the button position is set to "center", position the button at the center of the given X and Y coordinates
    button.position(positionX - button.width / 2, positionY - button.height / 2)
  } else { // If the button position is not set to "center", position the button at the given X and Y coordinates
    button.position(positionX, positionY)
  }

} // End of createButton function

/** FUNCTION: clearEverything - clears everything including buttons off the screen
*/
function clearEverything() { // Function to clear the canvas and remove all elements from the DOM

  clear(); // Clear the canvas

  removeElements(); // Remove all elements from the DOM

} // clear everything function end

/** FUNCTION: configuration - either continue to the game or go into the settings menu
*/
function configuration() { // Function to display the configuration menu

  clearEverything(); // Clear the canvas and remove all elements from the DOM

  background(backgroundImage); // Set the background image for the configuration menu

  textSize(24); // Set the text size to 24 pixels

  // Display the text and options for the configuration menu
  text("Click Continue to \n Continue to the game \n Or: \n Click Settings \nto configure your settings!", width / 2, height / 6);

  // Create a "Continue" button that calls the "Rules" function when clicked
  createbutton('Continue', 50, 300, Rules);

  // Create a "Settings" button that calls the "settingsMenu" function when clicked
  createbutton('Settings', 250, 300, settingsMenu);

} // configuration end

/** FUNCTION: configurationAfter - avoids a major bug
*/
function configurationAfter() { // Function to display the configuration menu after the game has started

  clearEverything(); // Clear the canvas and remove all elements from the DOM

  background(backgroundImage); // Set the background image for the configuration menu

  textSize(24); // Set the text size to 24 pixels

  // Display the text and options for the configuration menu
  text("Click Settings \nto configure your settings!", width / 2, height / 6);

  // Create a "Settings" button that calls the "settingsMenu" function when clicked and centers it on the screen
  createbutton('Settings', width / 2 - 20, 300, settingsMenu, "center");

} // configuration after end 

/** FUNCTION: settingsMenu - configure your settings
*/
function settingsMenu() { // settingsMenu function start
  clearEverything(); // clears the canvas and removes all elements
  reset(); // resets the score and game variables
  background(backgroundImage); // sets the background to the background image
  textSize(24); // sets the size of the text to 24
  text("Welcome to the Settings Menu \n Here, you can change \nthe difficulty, \n bird color, or music!", width / 2, height / 10) // displays the text for the settings menu and sets the position

  // creates buttons for different settings options
  createbutton('Sound Settings', width / 2, 180, soundSettings, "center")
  createbutton('Difficulty', width / 2, 280, difficulty, "center")
  createbutton('Bird Color', width / 2, 380, birdColorChange, "center")
  createbutton('Return', width / 2, 480, configuration, "center")

} // settingsMenu function end

/** FUNCTION: soundsettings - confgure your sound settings
*/
function soundSettings() {
  clearEverything(); // clears the canvas and removes all elements from the screen
  background(backgroundImage); // sets the background to the backgroundImage variable
  text("Here, you can change your \nbackground music, you can \n change this again later.", width / 2, height / 12); // displays text on the screen
  createbutton('Default', width / 2 - 20, 190, defaultSound, "center"); // creates a button labeled 'Default' and positioned at (width/2 - 20, 190) that calls the defaultSound() function when clicked
  createbutton('Default 2', width / 2 - 20, 290, defaultSound2, "center"); // creates a button labeled 'Default 2' and positioned at (width/2 - 20, 290) that calls the defaultSound2() function when clicked
  createbutton('Stop All Songs', width / 2 - 20, 390, stopSound, "center"); // creates a button labeled 'Stop All Songs' and positioned at (width/2 - 20, 390) that calls the stopSound() function when clicked
  createbutton('Return', width / 2 - 20, 490, configuration, "center"); // creates a button labeled 'Return' and positioned at (width/2 - 20, 490) that calls the configuration() function when clicked
} // soundsettings funciton end

/** FUNCTION: stopSound - stops all sounds
*/
function stopSound() { // Stops the background music by stopping both flappySong and flappySong2.
  flappySong.stop();
  flappySong2.stop();
} // function end

/** FUNCTION: default sound - loops default sound
*/
function defaultSound() {
  stopSound();
  flappySong.loop();
} // function end

/** FUNCTION: defaultsound2 - loops second sound
*/
function defaultSound2() {
  stopSound();
  flappySong2.loop();
} // funciton end

/** FUNCTION: difficulty - determines difficulty
*/
// This function displays the difficulty selection menu
function difficulty() {
  clearEverything(); // Clears the screen and removes all elements
  background(backgroundImage); // Sets the background image
  text("Select your difficulty. \n It will be defaulted \n on Easy mode", width / 2, height / 20); // Displays the title
  // Creates buttons for selecting the difficulty
  createbutton('Easy', width / 2 - 20, 120, easyMode, "center");
  createbutton('Medium', width / 2 - 20, 220, mediumMode, "center");
  createbutton('Hard', width / 2 - 20, 320, hardMode, "center");
  createbutton('??Mystery??', width / 2 - 20, 420, flippedMode, "center");
  createbutton('Return', width / 2 - 20, 520, configuration, "center"); // Creates a button for returning to the configuration menu
  // The available difficulty levels are easy, medium, hard, and mystery (called surprise)
} // difficulty funciton end

function easyMode() { // sets game to easy mode
  clearEverything();
  configuration();
  gameMode = "easy";
}

function mediumMode() {// sets game to medium mode
  clearEverything();
  configuration();
  gameMode = "medium"
}

function hardMode() {// sets game to hard mode
  clearEverything();
  configuration();
  gameMode = "hard"
}

function flippedMode() { // sets game to the mystery mode
  clearEverything();
  configuration();
  gameMode = "flipped"
}

/** FUNCTION: bird color changer
*/
// Function to change bird color
function birdColorChange() {
  // Clear everything from the screen
  clearEverything();
  // Set the background to the bird background image
  background(backgroundImage);

  // Create buttons to select the bird color
  createbutton('Red Bird', width / 2 - 20, 195, redBird, "center")
  createbutton('Yellow Bird', width / 2 - 20, 295, yellowBird, "center")
  createbutton('Blue Bird', width / 2 - 20, 395, blueBird, "center")
  createbutton('Return', width / 2 - 20, 520, configuration, "center");

  // Display text to inform the user about the purpose of the screen
  text("Here, you will be able to \n select your bird color. \n You will be able to \n change it again later. ", width / 2, height / 20)

  // Display images of the birds to show what they look like
  image(redUp, width / 2 + 70, 195)
  image(yellowUp, width / 2 + 70, 295)
  image(blueUp, width / 2 + 70, 395)

  // Display more images of the birds to show what they look like
  image(redUp, width / 2 - 110, 195)
  image(yellowUp, width / 2 - 110, 295)
  image(blueUp, width / 2 - 110, 395)
} // function end


function redBird() { // if red bird
  clearEverything();
  configuration();
  birdColor = "red";
}

function yellowBird() { // if yellow bird
  clearEverything();
  configuration();
  birdColor = "yellow";
}

function blueBird() { // if blue bird
  clearEverything();
  configuration();
  birdColor = "blue";
}

/** FUNCTION: rules - displays the rules of the game
*/
// Function to display the game rules
function Rules() {
  // Clear everything from the screen
  clearEverything();

  // Set the game state to "Rules"
  gameState = "Rules"

  // Set the background to the bird background image
  background(backgroundImage);

  // Display the title for the rules section
  textSize(40);
  text("HOW TO PLAY", width / 2, height / 12);

  // Display the rules of the game
  textSize(20);
  text("You will need to control your bird \n to do so, press your spacebar. \n each time you pass a pipe, \n your score goes up by 1. \n Your score will be displayed \nat the top of your screen. \n Have fun!", width / 2, height / 5);

  // Display instructions for how to proceed
  text("Click anywhere to continue.", width / 2, height / 1.3);
} // rules function end

/** FUNCTION: gameStart
*/
// Function to start the game
function gameStart() {
  // Clear everything from the screen
  clearEverything();

  // Set the background to the "Get Ready" image
  background(getReady);

  // Set the game state to "gameStart"
  gameState = "gameStart";

  // Display the "Press to Start" message
  textSize(36);
  text("PRESS TO START", width / 2, height / 12);

  // Set the bird image based on the selected bird color
  if (birdColor == "red") {
    birdUp = redUp;
    birdDown = redDown;
  } else if (birdColor == "blue") {
    birdUp = blueUp;
    birdDown = blueDown;
  } else {
    birdUp = yellowUp;
    birdDown = yellowDown;
  }
} //gamestart function end


/** FUNCTION: gameOver - what happens when the game ends / you die
*/
// Function to handle game over
function gameOver() {
  // Clear everything from the screen
  clearEverything();

  // Set the background to the default background image
  background(backgroundImage);

  // Display the "You Died" message and the player's score
  textSize(36);
  text("You Died :( \n Score: " + score, width / 2, height / 12)

  // Display buttons to restart the game, return to the main menu, and view high scores
  textSize(24);
  createbutton('Restart', width / 2 - 20, height / 2.5, reset, "center")
  createbutton('Main Menu', width / 2 - 20, height / 1.8, configurationAfter, "center")
  createbutton('High Scores', width / 2 - 20, height / 1.2, highScoreDisplay, "center")

  // Check if the current score is greater than 0
  if (score > 0) {
    // Add the current score to the end of the high scores array.
    highScores.push(score);

    // Sort the high scores array in descending order (from highest to lowest).
    highScores.sort((a, b) => b - a);

    // Keep only the top 5 scores in the array 
    highScores = highScores.slice(0, 5);

    // Save the updated high scores array to the highscores.txt file.
    saveStrings(highScores, 'highscores.txt');
  }
}

/** FUNCTION: highscoredisplay - displays the highscores of the game
*/
function highScoreDisplay() {
  clearEverything(); //Clears the canvas
  background(backgroundImage); //Sets the background image
  text("High Scores", width / 2, height / 12); //Displays the title "High Scores" on the canvas
  let lineHeight = 50; //Sets the spacing between each high score
  for (let i = 0; i < 5; i++) { //Loops through the top 5 high scores
    text(i + 1 + ". " + highScores[i], width / 2, height / 5 + i * lineHeight); //Displays each high score with its corresponding ranking
  }

  //Creates a button to restart the game
  createbutton('Restart', width / 2 - 20, height / 1.2, reset, "center")
}

/** FUNCTION: reset - resets all
*/
// This function resets the game to its initial state.
function reset() {
  // Clear the pipeArr array, which holds the game's pipes.
  pipeArr = [];

  // Reset the player's score to zero.
  score = 0;

  // Create a new Bird object to represent the player.
  bird = new Bird();

  // Start the game.
  gameStart();
}


  /* FIXED ABRUPT MOVEMENT IN BIRD
  REASON: 
  
  When the bird jumps, its velocity is set to a specific value (which is the lift value in this case). This value determines how fast the bird moves upward. Then, during the update function, the velocity is continuously updated by adding the gravity value. This means that the bird's velocity gradually decreases due to gravity, simulating a natural falling motion.
 
  In the previous code, the bird's y position was updated by adding the lift value directly, which caused an abrupt and unrealistic jump. With the updated code, the bird's y-position is updated by adding its velocity, which provides a more natural and smoother movement.
  */

/** CLASS: Bird class - does all calculations + display bird in the game etc
*/
// This class represents the player's bird character in the game.
class Bird {
  constructor() {
    // Load the bird's images.
    this.birdUp = birdUp;
    this.birdDown = birdDown;

    // Set the bird's initial position and velocity.
    this.x = 50;
    this.y = height / 2;
    this.velocity = 0;

    // Set the bird's lift value, which determines how fast it moves upward.
    this.lift = -7;
  }

  // This function is called when the player makes the bird jump.
  up() {
    // Play the wing sound effect.
    wing.play();

    // Update the bird's velocity to make it move upward.
    if (gameMode == "flipped") {
      // In "flipped" mode, the bird moves upward with a negative velocity.
      this.velocity = this.lift * -1;
    } else {
      // In normal mode, the bird moves upward with a positive velocity.
      this.velocity = this.lift;
    }
  }

  // This function is called every frame to update the bird's position and velocity.
  update() {
    // Set the gravity value based on the current game mode.
    if (gameMode == "flipped") {
      this.gravity = -0.5;
    } else {
      this.gravity = 0.5;
    }

    // Update the bird's velocity by adding the gravity value.
    this.velocity += this.gravity;

    // Update the bird's position by adding its velocity.
    this.y += this.velocity;
  }

  // This function is called every frame to draw the bird on the screen.
  display() {
    // Determine which bird image to display based on the bird's velocity.
    if (this.velocity > 0) {
      // If the bird is moving downward, display the birdUp image.
      image(birdUp, this.x, this.y);
    } else {
      // If the bird is moving upward, display the birdDown image.
      image(birdDown, this.x, this.y);
    }
  }
} //bird class end

/** CLASS: pipe class - creates pipes on the screen and moves them.
*/
class Pipe { // pipe class start

  constructor() {
    this.pipeGap = 150; // The distance between the top and bottom pipes
    this.top = random(-250, 0); // The top pipe's y position
    this.bottom = random(this.top + this.pipeGap); // The bottom pipe's y position
    this.x = width; // The x position of the pipes (initialized to be off-screen)
    this.passed = false; // A flag to check if the bird has passed the pipes or not

    // Set the speed of the pipes based on the game mode
    if (gameMode == "easy" || gameMode == "flipped") {
      this.pipeSpeed = 2.6;
    } else if (gameMode == "medium") {
      this.pipeSpeed = 3.7;
    } else if (gameMode == "hard") {
      this.pipeSpeed = 4.8;
    }
  }

  update() {
    this.x -= this.pipeSpeed; // Move the pipes to the left
  }

  display() {
    // Display the current score in the center of the screen
    text(score, width / 2, height / 9);

    // Display the top and bottom pipes
    image(pipeDown, this.x, this.top);
    image(pipeUp, this.x, this.top + height / 2 + this.pipeGap);
  }

  offScreen() {
    // Check if the pipes have moved off-screen (i.e., to the left of the screen)
    if (this.x < 0 - pipeUp.width) {
      return true;
    }
  }

  score() {
    // Check if the bird has passed the pipes and update the score
    if (this.x + pipeUp.width - 10 < bird.x && this.passed == false) {
      this.passed = true;
      score++;
      scoreSound.play();
    }
  }

  collision(bird) {
    // Check if the bird collides with the top or bottom pipe or the ceiling or ground
    if (bird.y < 0) {
      return true; // Collision with the ceiling
    } else if (bird.y > height - base.height) {
      return true; // Collision with the ground
    }

    // Calculate the center of the bird image
    birdX = bird.x + birdUp.width / 2;
    birdY = bird.y + birdUp.height / 2;

    // Check if the bird collides with the top or bottom pipe
    if (birdX > this.x && birdX < this.x + pipeUp.width) {
      if (birdY < this.top + pipeUp.height + 3 || birdY > this.top + height / 2 + this.pipeGap - birdUp.height + 15) {
        return true; // Collision with the top or bottom pipe
      }
    }
  }

} //pipe class end
