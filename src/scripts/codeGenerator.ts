import * as Utils from "./utils";

class CodeGenerator {
  private static instance: CodeGenerator;
  private _secretCode: Combination[] = [];

  public get secretCode(): Combination[] {
    return this._secretCode;
  }

  constructor() {
    if (!CodeGenerator.instance) {
      CodeGenerator.instance = this;
    } else {
      return CodeGenerator.instance;
    }
  }

  public generateCode(): void {
    const generatedCode: Combination[] = [];
    for (let i = 0; i < Utils.codeLength; i++) {
      const count = Math.ceil(Math.random() * 9);
      const direction =
        Math.random() > 0.5
          ? Utils.Direction.clockwise
          : Utils.Direction.counterclockwise;
      const code = new Combination(count, direction);
      generatedCode.push(code);
    }
    this._secretCode = generatedCode;
  }

  public removeCombination(): void {
    this._secretCode.shift();
  }
}

class Combination {
  protected _count: number;
  protected _direction: Utils.Direction | null;

  public get count(): number {
    return this._count;
  }
  public get direction(): Utils.Direction | null {
    return this._direction;
  }

  constructor(count: number, direction: Utils.Direction | null) {
    this._count = count;
    this._direction = direction;
  }
}

class UserCombination extends Combination {
  constructor(count: number = 0, direction: Utils.Direction | null = null) {
    super(count, direction);
  }

  public incrementCount() {
    this._count++;
  }

  public setDirection(direction: Utils.Direction) {
    this._direction = direction;
  }

  public resetCombination() {
    this._count = 0;
    this._direction = null;
  }
}

export { CodeGenerator, Combination, UserCombination };
