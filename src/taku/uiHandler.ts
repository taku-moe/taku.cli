import * as terminalkit from "terminal-kit";
var term = require("terminal-kit").terminal;

export class UserInterfaceHandler {
  terminal = terminalkit.terminal;

  constructor() {}

  /**
   * Input field
   * @param hideOutput Set to true if you want to hide the output with *
   * @returns the input string
   */
  public async inputField(hideOutput: boolean = false): Promise<string> {
    return new Promise(async (resolve) => {
      let input;
      if (hideOutput) input = await this.terminal.inputField({ echoChar: "*" }).promise;
      else input = await this.terminal.inputField().promise;

      if (input == undefined) {
        input = "";
      }
      resolve(input);
    });
  }
}
