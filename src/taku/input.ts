const keypress = require("keypress");
import { createTerminal, Terminal } from "terminal-kit";
export class InputOutputHandler {
  private hideOutput: boolean = false;
  private term: Terminal = createTerminal();
  private inputBuffer: string = "";

  constructor() {}
  private handleInput(ch: string, key: {}, hideOutput: boolean) {
    if (hideOutput) this.term("\b*");
    else this.term(ch);
  }

  /**
   *
   * @param newLine Set to true if you want newline to be added after input
   * @param hideOutput Set to true if you want to hide the output with *
   * @returns the input string
   */
  public async getInput(newLine: boolean = false, hideOutput: boolean = false): Promise<string> {
    return new Promise((resolve) => {
      let inputBuffer = "";
      keypress(process.stdin);
      process.stdin.on("keypress", (ch, key) => {
        if (key?.name === "return") {
          if (newLine) this.print("\n");
          resolve(inputBuffer);
        }
        if (key && key.ctrl && key.name == "c") {
          process.stdin.pause();
        }
        this.handleInput(ch, key, hideOutput);
        inputBuffer += key;
      });
      process.stdin.setRawMode(true);
      process.stdin.resume();
    });
  }

  private async sleep(msec: number) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }

  public getHideOutput(): boolean {
    return this.hideOutput;
  }
  public setHideOutput(value: boolean) {
    this.hideOutput = value;
  }
  public getTerminal(): Terminal {
    return this.term;
  }
  public setTerminal(value: Terminal) {
    this.term = value;
  }

  // TODO: Add color support
  public print(value: string) {
    this.term(value);
  }
  public println(value: string) {
    this.term(value + "\n");
  }
}
