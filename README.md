# PixiJS-Vault-Game

=======

# Vault Game

Vault Game is a simple browser-based game built using Pixi.js library and TypeScript. The objective of the game is to unlock the vault by rotating the handle in the correct direction and combination before the timer runs out.

## How to Use the App

1. Clone the repository or download the source code.

2. Install dependencies using npm or yarn:

```bash
npm install
```

3. Run npm dev:

```bash
npm run build
```

4. Click on the provided local server.

## Game Rules

- The game will start automatically when you click on the local server.

- The game contains a vault door with a handle that can be rotated.

- The vault door is locked with a secret combination, which is displayed on the console at the start of the game.

- To unlock the door, you need to rotate the handle in the correct direction and combination.

- Click on the left side of the handle to rotate it counterclockwise and on the right side to rotate it clockwise.

- The handle will rotate by 60 degrees with each click.

- A timer will start running as soon as you make your first move. And will continue to count the time till entering the successfull combination.

- If you make a wrong move or take more rotations than the correct combination, the game will display a "FAIL" message, and the timer will reset and new code will be provided in the console.

- If you successfully unlock the door, it will open, and a blinking effect will play. The vault will reset with a handle spinning like crazy and the game will start over.

- The game continues indefinitely, and your objective is to unlock the vault.

## How the Game Works

The `GameManager` class is responsible for managing the game logic. It generates a secret code using the `CodeGenerator` class, handles user input, manages the timer, and updates the clock display.

The `App` class sets up the Pixi.js application and loads the game assets. It also handles resizing the game to fit different screen sizes while maintaining the aspect ratio.

## Dependencies

The game uses the following external libraries:

- Pixi.js: A 2D WebGL rendering engine for creating interactive graphics.

- GSAP (GreenSock Animation Platform): A powerful animation library used for animating the vault door handle and blinking effect.

Enjoy playing the Vault Game!
