export default class PlayerCls {
  private onTest: () => void;
  constructor(onTest: () => void) {
    this.onTest = onTest;
    console.log("PlayerCls constructor");
  }
  play() {
    console.log("play");
  }
  stop() {
    console.log("stop");
    this.onTest();
  }
  pause() {
    console.log("pause");
  }
}
