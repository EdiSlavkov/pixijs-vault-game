import * as PIXI from "pixi.js";

export default class App {
  app: PIXI.Application;
  isLoaded: boolean;
  appWidth: number;
  appHeight: number;
  mainContainer: HTMLElement | null;
  loadingText: PIXI.Text;
  assets: PIXI.ResolveAsset;
  background: PIXI.Sprite;
  openedDoorContainer: PIXI.Container;
  openedDoor: PIXI.Sprite;
  openedDoorShadow: PIXI.Sprite;
  door: PIXI.Sprite;
  blink: PIXI.Sprite;
  handleShadow: PIXI.Sprite;
  handle: PIXI.Sprite;
  handleContainer: PIXI.Container;
  clockText: PIXI.BitmapText;

  constructor() {
    this.app = new PIXI.Application({
      resizeTo: window,
    });
    this.isLoaded = false;
    this.mainContainer = document.getElementById("app");
    this.mainContainer?.appendChild(this.app.view as HTMLCanvasElement);
    this.appWidth = this.app.screen.width;
    this.appHeight = this.app.screen.height;
    this.loadingText = new PIXI.Text("Loading...", {
      fontFamily: "Arial",
      fontSize: 18,
      fontWeight: "bold",
      fill: 0x999999,
      align: "center",
    });
    this.assets = {} as PIXI.ResolveAsset;
    this.background = new PIXI.Sprite();
    this.openedDoorContainer = new PIXI.Container();
    this.openedDoor = new PIXI.Sprite();
    this.openedDoorShadow = new PIXI.Sprite();
    this.door = new PIXI.Sprite();
    this.blink = new PIXI.Sprite();
    this.handleShadow = new PIXI.Sprite();
    this.handle = new PIXI.Sprite();
    this.handleContainer = new PIXI.Container();
    this.clockText = {} as PIXI.BitmapText;
  }

  resize = () => {
    const designWidth = this.appWidth;
    const designHeight = this.appHeight;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scaleX = screenWidth / designWidth;
    const scaleY = screenHeight / designHeight;

    const scale = Math.min(scaleX, scaleY);

    this.app.stage.scale.set(scale);
    if (this.isLoaded) {
      this.app.stage.removeChildren();
      this.loadScene();
    }
  };

  async backgroundLoad(): Promise<this> {
    this.loadingText.anchor.set(0.5, 0.5);
    this.loadingText.x = this.appWidth / 2;
    this.loadingText.y = this.appHeight / 2;
    this.app.stage.addChild(this.loadingText);

    PIXI.Assets.addBundle("resources", {
      background: "./src/assets/sprites/bg.png",
      openedDoor: "./src/assets/sprites/doorOpen.png",
      openedDoorShadow: "./src/assets/sprites/doorOpenShadow.png",
      door: "./src/assets/sprites/door.png",
      blink: "./src/assets/sprites/blink.png",
      handleShadow: "./src/assets/sprites/handleShadow.png",
      handle: "./src/assets/sprites/handle.png",
      clockFont: "https://pixijs.com/assets/bitmap-font/desyrel.xml",
    });

    this.assets = await PIXI.Assets.loadBundle("resources", (e) => {
      if (e === 1) {
        this.loadingText.text = "Completed!";
        this.loadingText.destroy();
      } else {
        this.loadingText.text = `Loading in progress ${Math.ceil(e * 100)}%.`;
      }
    });

    this.isLoaded = true;
    this.loadScene();
    window.addEventListener("resize", this.resize);
    return Promise.resolve(this);
  }

  loadScene() {
    this.background = PIXI.Sprite.from(this.assets.background);
    this.background.width = this.appWidth;
    this.background.height = this.appHeight;
    this.background.anchor.set(0.5);
    this.background.position.set(this.appWidth / 2, this.appHeight / 2);

    this.openedDoorContainer = new PIXI.Container();
    this.openedDoorContainer.position.set(
      this.appWidth / 1.56,
      this.appHeight / 5.3,
    );

    this.openedDoor = PIXI.Sprite.from(this.assets.openedDoor);
    this.openedDoor.width = this.appWidth / 5;
    this.openedDoor.height = this.appHeight / 1.65;

    this.openedDoorShadow = PIXI.Sprite.from(this.assets.openedDoorShadow);
    this.openedDoorShadow.width = this.appWidth / 4.5;
    this.openedDoorShadow.height = this.appHeight / 1.63;
    this.openedDoorShadow.position.set(
      this.openedDoorContainer.width + 3,
      this.openedDoorContainer.height + 9,
    );

    this.openedDoorContainer.addChild(this.openedDoorShadow, this.openedDoor);
    this.openedDoorContainer.visible = false;

    this.door = PIXI.Sprite.from(this.assets.door);
    this.door.anchor.set(0.5, 0.5);
    this.door.width = this.appWidth / 3.05;
    this.door.height = this.appHeight / 1.6;
    this.door.x = this.appWidth / 1.957;
    this.door.y = this.appHeight / 2.05;

    this.blink = PIXI.Sprite.from(this.assets.blink);
    this.blink.scale.set(0.3);
    this.blink.anchor.set(0.5);
    this.blink.position.set(this.appWidth / 2.41, this.appHeight / 2.05);
    this.blink.alpha = 0;

    this.handleShadow = PIXI.Sprite.from(this.assets.handleShadow);
    this.handle = PIXI.Sprite.from(this.assets.handle);
    this.handleContainer = new PIXI.Container();
    this.handleContainer.eventMode = "static";
    this.handleContainer.cursor = "pointer";
    this.handleContainer.x = -90;
    this.handle.anchor.set(0.5);
    this.handleShadow.anchor.set(0.5);
    this.handleShadow.position.set(-80, 28);
    this.handleContainer.addChild(this.handle);
    this.door.addChild(this.handleShadow, this.handleContainer);

    this.clockText = new PIXI.BitmapText("00:00", {
      fontName: "Desyrel",
      fontSize: this.appWidth / 95,
      letterSpacing: 8,
    });
    this.clockText = new PIXI.BitmapText("00:00", {
      fontName: "Desyrel",
      fontSize: this.appWidth / 95,
      letterSpacing: 8,
    });
    this.clockText.pivot.set(
      this.clockText.width / 2,
      this.clockText.height / 2,
    );
    this.clockText.position.set(this.appWidth / 3.3, this.appHeight / 2.25);
    this.clockText.tint = 0xff0000;

    this.app.stage.addChild(
      this.background,
      this.blink,
      this.door,
      this.openedDoorContainer,
      this.clockText,
    );
  }
}
