import * as PIXI from "pixi.js";
import { CodeGenerator, UserCombination } from "../scripts/codeGenerator";
import { Direction } from "./utils";
import { gsap } from "gsap";

const mainContainer = document.getElementById("app");
const app = new PIXI.Application({ resizeTo: window });
(window as any).__PIXI_APP__ = app;
const { width: appWidth, height: appHeight } = app.screen;
mainContainer?.appendChild(app.view as HTMLCanvasElement);

const background = PIXI.Sprite.from("./src/assets/sprites/bg.png");
background.width = appWidth;
background.height = appHeight;
background.anchor.set(0.5);
background.position.set(appWidth / 2, appHeight / 2);

const openedDoorContainer = new PIXI.Container();
const openedDoor = PIXI.Sprite.from("./src/assets/sprites/doorOpen.png");
const openedDoorShadow = PIXI.Sprite.from(
  "./src/assets/sprites/doorOpenShadow.png",
);
openedDoor.width = appWidth / 5;
openedDoor.height = appHeight / 1.65;
openedDoorShadow.width = appWidth / 4.5;
openedDoorShadow.height = appHeight / 1.63;
openedDoorContainer.position.set(appWidth / 1.56, appHeight / 5.3);
openedDoorShadow.position.set(
  openedDoorContainer.width + 3,
  openedDoorContainer.height + 9,
);
openedDoorContainer.addChild(openedDoorShadow, openedDoor);
openedDoorContainer.visible = false;

const blink = PIXI.Sprite.from("./src/assets/sprites/blink.png");
blink.scale.set(0.3);
blink.anchor.set(0.5);
blink.position.set(appWidth / 2.41, appHeight / 2.05);
blink.alpha = 0;

const door = PIXI.Sprite.from("./src/assets/sprites/door.png");
door.anchor.set(0.5, 0.5);
door.width = appWidth / 3.05;
door.height = appHeight / 1.6;
door.x = appWidth / 1.957;
door.y = appHeight / 2.05;

const handleContainer = new PIXI.Container();
handleContainer.eventMode = "static";
handleContainer.cursor = "pointer";
const handleShadow = PIXI.Sprite.from("./src/assets/sprites/handleShadow.png");
const handle = PIXI.Sprite.from("./src/assets/sprites/handle.png");
handle.anchor.set(0.5);
handleShadow.anchor.set(0.5);
handleShadow.position.set(-80, 28);
handleContainer.addChild(handle);
handleContainer.x = -90;
door.addChild(handleShadow, handleContainer);
app.stage.addChild(background, blink, door, openedDoorContainer);


const handleGameInit = () => {
    codeGenerator.generateCode();
    console.log(codeGenerator.secretCode);
  };
const codeGenerator: CodeGenerator = new CodeGenerator();
const userCombination: UserCombination = new UserCombination();
handleGameInit();

const toggleDoor = () => {
  door.visible = !door.visible;
  openedDoorContainer.visible = !openedDoorContainer.visible;
};

const isInRightDirection = (direction: Direction): boolean =>
  direction === codeGenerator.secretCode[0].direction;

const isRightCombination = (code: UserCombination): boolean =>
  codeGenerator.secretCode[0].count === code.count;

const handleRotation = (direction: Direction): void => {
  userCombination.incrementCount();
  if (userCombination.direction !== direction) {
    userCombination.setDirection(direction);
  }
  if (isInRightDirection(direction)) {
    if (isRightCombination(userCombination)) {
      codeGenerator.removeCombination();
      userCombination.resetCombination();
    }
  } else {
    handleGameInit();
  }
  if (codeGenerator.secretCode.length === 0) {
    toggleDoor();
  }
};

const tl = gsap.timeline({
  onComplete: ((): GSAPCallback => {
    const initPositionX = blink.x;
    const initPositionY = blink.y;
    return () => {
      switch (blink.x) {
        case initPositionX:
          blink.x = initPositionX + initPositionX / 6;
          break;
        case initPositionX + initPositionX / 6:
          blink.x = initPositionX + initPositionX / 3.6;
          blink.y = initPositionY + initPositionY / 4;
          break;
        default:
          blink.position.set(initPositionX, initPositionY);
      }
      tl.restart();
    };
  })(),
});

tl.fromTo(blink, { alpha: 0 }, { alpha: 1, duration: 2, rotation: "+=1" }).to(
  blink,
  { alpha: 0 },
);

const handleUserClick = () => {
  let totalRotation = 0;
  return (e: any) => {
    if (e.clientX < window.innerWidth / 2 - 2) {
      totalRotation -= (60 * Math.PI) / 180;
      gsap.to([handleContainer, handleShadow], {
        rotation: totalRotation,
        duration: 1,
        onComplete: () => {
          handleRotation(Direction.counterclockwise);
        },
      });
    } else {
      totalRotation += (60 * Math.PI) / 180;
      gsap.to([handleContainer, handleShadow], {
        rotation: totalRotation,
        duration: 1,
        onComplete: () => handleRotation(Direction.clockwise),
      });
    }
  };
};

handleContainer.on("pointertap", handleUserClick());