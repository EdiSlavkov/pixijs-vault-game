import App from "./App";
import GameManager from "./gameManager";

const app = new App();
app.backgroundLoad().then((res) => {
  const gameManager = new GameManager(res);
  gameManager.start();
});
