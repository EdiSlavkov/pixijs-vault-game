import { CodeGenerator, UserCombination } from "../scripts/codeGenerator";
import { Direction } from "./utils";
import { gsap } from "gsap";
import App from "./App";

export default class GameManager {
  app: App;
  codeGenerator: CodeGenerator;
  userCombination: UserCombination;
  isFirstClick: boolean;
  elapsedTime: number;
  constructor(app: App) {
    this.app = app;
    this.codeGenerator = new CodeGenerator();
    this.elapsedTime = 0;
    this.isFirstClick = true;
    this.userCombination = new UserCombination();
    this.app.handleContainer.on("pointertap", this.handleUserClick());
  }
  start(): void {
    this.codeGenerator.generateCode();
    console.log(this.codeGenerator.secretCode);
  }
  updateClock(): void {
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = Math.floor(this.elapsedTime % 60);
    const timerText = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    this.app.clockText.text = timerText;
  }
  resetTimer(): void {
    this.elapsedTime = 0;
    this.isFirstClick = true;
    this.app.app.ticker.remove(this.timerCallback);
  }
  timerCallback = (delta: number) => {
    this.elapsedTime += delta / 60;
    this.updateClock();
  };
  setErrorMessage(): void {
    this.app.clockText.text = "FAIL";
  }
  handleWinningGame(): void {
    this.toggleDoor();
    gsap
      .timeline({
        onComplete: () => {
          this.start();
          this.resetTimer();
          this.updateClock();
        },
      })
      .to([this.app.handleContainer, this.app.handleShadow], {
        rotation: "+=360",
        duration: 2,
        ease: "easeInOut",
      })
      .to([this.app.handleContainer, this.app.handleShadow], {
        rotation: "-=360",
        duration: 2,
        ease: "easeInOut",
      })
      .to([this.app.handleContainer, this.app.handleShadow], {
        rotation: 0,
        duration: 2,
      });
  }
  toggleDoor = (): void => {
    this.app.door.visible = !this.app.door.visible;
    this.app.openedDoorContainer.visible = !this.app.openedDoorContainer.visible;
  };
  isInRightDirection(direction: Direction): boolean {
    return direction === this.codeGenerator.secretCode[0].direction;
  }
  isRightCombination(code: UserCombination): boolean {
    return this.codeGenerator.secretCode[0].count === code.count;
  }

  handleRotation(direction: Direction): void {
    let isFailed;
    this.userCombination.incrementCount();
    if (this.userCombination.direction !== direction) {
      this.userCombination.setDirection(direction);
    }
    if (this.isInRightDirection(direction)) {
      if (this.isRightCombination(this.userCombination)) {
        this.codeGenerator.removeCombination();
        this.userCombination.resetCombination();
      } else if (
        this.userCombination.count > this.codeGenerator.secretCode[0].count
      ) {
        isFailed = true;
      }
    } else {
      isFailed = true;
    }
    if (isFailed) {
      this.resetTimer();
      this.setErrorMessage();
      this.app.handleContainer.eventMode = "passive";
      setTimeout(() => {
        this.start();
        this.updateClock();
        this.app.handleContainer.eventMode = "static";
      }, 2000);
    }
    if (this.codeGenerator.secretCode.length === 0) {
      this.toggleDoor();
      this.app.app.ticker.remove(this.timerCallback);
      this.timeline();
      let store = 0;
      let b = (delta:number) => {
        store += delta / 60;
        if (store >= 5) {
          this.handleWinningGame();
          this.app.app.ticker.remove(b);
        }
      }
      this.app.app.ticker.add(b);
    }
  }
  timeline(): void {

    const tl = gsap.timeline({
      onComplete: ((): GSAPCallback => {

        const initPositionX = this.app.blink.x;
        const initPositionY = this.app.blink.y;
        return () => {
          switch (this.app.blink.x) {
            case initPositionX:
              this.app.blink.x = initPositionX + initPositionX / 6;
              break;
            case initPositionX + initPositionX / 6:
              this.app.blink.x = initPositionX + initPositionX / 3.6;
              this.app.blink.y = initPositionY + initPositionY / 4;
              break;
            default:
              this.app.blink.position.set(initPositionX, initPositionY);
          }
          tl.restart();
        };
      })(),
    });
    tl.fromTo(
      this.app.blink,
      { alpha: 0 },
      { alpha: 1, duration: 1, rotation: "+=1" },
    ).to(this.app.blink, { alpha: 0 });
  }
  handleUserClick = () => {
    let totalRotation = 0;
    return (e: any) => {
      if (e.clientX < window.innerWidth / 2 - 2) {
        totalRotation -= (60 * Math.PI) / 180;
        gsap.to([this.app.handleContainer, this.app.handleShadow], {
          rotation: totalRotation,
          duration: 1,
          onStart: () => this.handleRotation(Direction.counterclockwise),
        });
      } else {
        totalRotation += (60 * Math.PI) / 180;
        gsap.to([this.app.handleContainer, this.app.handleShadow], {
          rotation: totalRotation,
          duration: 1,
          onStart: () => this.handleRotation(Direction.clockwise),
        });
      }
      if (this.isFirstClick) {
        this.isFirstClick = false;
        this.app.app.ticker.add(this.timerCallback);
      }
    };
  };
}