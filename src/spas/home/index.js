import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';
import GithubKitty from './github.svg';
import './home.font';

const initKittyPosition = { x: 0, y: 0 };
const initKittyInterval = 3000; // 3 sec
const kittySpeedIncrease = 200; // 200 ms
const colorCycle = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'];

class HomeSPA extends Component {
  constructor(props) {
    super(props);

    // Initialize the React component's state
    this.state = {
      gameStarted: false,
      playerWins: false,
      secondsToWin: 0,
      score: [],
      kittyPosition: initKittyPosition,
      kittyRotation: 0,
      msTilNextMove: initKittyInterval
    };

    // Initialize class properties
    this.kittyPosInterval = null;
    this.playAreaWidth = 0;
    this.playAreaHeight = 0;
    this.music = null;
    this.meows = [];

    // make "this" reference HomeSPA in the following methods
    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.handleKittyClick = this.handleKittyClick.bind(this);
    this.setNewKittyPosition = this.setNewKittyPosition.bind(this);
    this.setPlayAreaDiv = this.setPlayAreaDiv.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('keydown', this.handleKeyPress);
    this.music = new Audio('music/chiptune.mp3');
    this.music.loop = true;
    this.music.play();
    this.meows.push(new Audio('sounds/meow-1.wav'));
    this.meows.push(new Audio('sounds/meow-2.wav'));
    this.meows.push(new Audio('sounds/meow-3.wav'));
  }

  componentWillUnmount() {
    // Cleanup
    window.removeEventListener("resize", this.updateDimensions);
    window.clearInterval(this.kittyPosInterval);
  }

  render() {
    const {
      gameStarted,
      playerWins,
      score,
      secondsToWin,
      kittyRotation,
      kittyPosition
    } = this.state;

    const kittyStyle = {
      transform: `translate3d(${kittyPosition.x}px, ${kittyPosition.y}px, 0) rotate(${kittyRotation}deg)`,
      transition: `transform ${this.state.msTilNextMove}ms ease-in-out, fill .5s ease-in-out`,
      fill: colorCycle[score.length % colorCycle.length]
    }

    if (!gameStarted) {
      return (
        <div className="centered-box">
          <h1 className="text-shadow">Welcome to Kitty-Klicker!</h1>
          <p>
            The goal is simple. Click the kitty ten times to win. However, each time you click on the
            kitty, it gets scared and moves more quickly!
          </p>
          <p>Press the <span className="key">m</span> key to mute the music.</p>
          <div className="btn-container">
            <a className="btn" onClick={ this.startGame }>Ok, Let's Go!</a>
          </div>
        </div>
      );
    } else {
      return (
          <div className="container">
              <div className="score">Score: { this.state.score }</div>
              <div className="play-area" ref={ this.setPlayAreaDiv }>
                {
                  !playerWins
                  ? <GithubKitty onClick={ this.handleKittyClick } style={ kittyStyle } />
                  : <div className="centered-box you-win">
                      <h2 className="text-shadow">You Win!</h2>
                      <p className="center-text">
                        Good job clicking the kitty! It only took you
                        &nbsp;<strong>{ secondsToWin }</strong> seconds!
                      </p>
                      <div className="btn-container">
                        <a className="btn" onClick={ this.restartGame }>Again, Again!</a>
                      </div>
                    </div>
                }
              </div>
          </div>
      );
    }
  }

  startGame() {
    this.setState({ gameStarted: true }, function () {
      this.startTime = Date.now();
      // Initial setting of play area dimensions
      this.updateDimensions();
      // Initial setting of kitty position
      this.setNewKittyPosition();
      // Set the interval for the next move
      this.kittyPosInterval = setInterval(this.setNewKittyPosition, this.state.msTilNextMove);
    });
  }

  restartGame() {
    // Reset the state
    this.setState({
      gameStarted: true,
      playerWins: false,
      score: [],
      kittyRotation: 0,
      msTilNextMove: initKittyInterval
    }, function () {
      this.startTime = Date.now();
      this.setNewKittyPosition();
      this.kittyPosInterval = setInterval(this.setNewKittyPosition, this.state.msTilNextMove);
    })
  }

  updateDimensions() {
    // Save the dimensions of the play area to keep the kitty in bounds!
    if (this.playAreaDiv) {
      // Subtract 64px so the kitty doesn't overlap the edge of the play area
      this.playAreaWidth = this.playAreaDiv.clientWidth - 64;
      this.playAreaHeight = this.playAreaDiv.clientHeight - 64;
    }
  }

  setPlayAreaDiv(playAreaDiv) {
    this.playAreaDiv = playAreaDiv;
  }

  setNewKittyPosition() {
    /* The kitty starts at the center of the play area, so we want to pick a relative x position
     * that is no less than negative 1/2 of the play area width or more than positive 1/2 of the
     * play area width. Same for the y position, but with play area height.
     */
    const maxWidth = this.playAreaWidth / 2;
    const maxHeight = this.playAreaWidth / 2;
    const kittyPosition = {
      x: getRandomInt(-maxWidth, maxWidth),
      y: getRandomInt(-maxHeight, maxHeight)
    }
    // Choose a random measure of degree between 0 and 360
    const kittyRotation = getRandomInt(0, 360);
    this.setState({ kittyPosition, kittyRotation });
  }

  handleKittyClick() {
    // Make the kitty meow!
    const meowIdx = getRandomInt(0, 2);
    this.meows[meowIdx].play();

    const score = this.state.score.concat(
      <span key={ this.state.score.length } className="icon icon-beer"/>
    );

    // The player once the score reaches 10
    const playerWins = (score.length === 10);

    // Speed up the kitty!
    const msTilNextMove = this.state.msTilNextMove - kittySpeedIncrease;

    window.clearInterval(this.kittyPosInterval);

    let secondsToWin;
    if (playerWins) {
      secondsToWin = (Date.now() - this.startTime) / 1000;
    } else {
      // Move the kitty again and set a faster timer
      this.setNewKittyPosition();
      this.kittyPosInterval = setInterval(this.setNewKittyPosition, msTilNextMove);
    }

    // Set the score, the new timer speed, win vars
    this.setState({ score, playerWins, msTilNextMove, secondsToWin });
  }

  handleKeyPress(event) {
    if (event.key === 'm') {
      this.music.muted = !this.music.muted;
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}


ReactDOM.render(<HomeSPA />, document.getElementById('react-spa'));
