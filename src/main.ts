import Taku from "taku.js";
// @ts-ignore
import * as fetch from "node-fetch";
import { InputOutputHandler } from "./taku/input";
import { version } from "../package.json";

class TakuCLI {
  // User infos
  public username: string | undefined;
  public password: string | undefined;
  private authToken: string | undefined;
  private keepAlive: boolean = true;
  private ioHandler: InputOutputHandler = new InputOutputHandler();

  // CLI Stuff
  public messageCount: number = 50;
  public app: any;
  private messages: any;
  private messageInput = [
    {
      type: "text",
      name: "input",
      message: "Input:",
    },
  ];

  public async run() {
    this.ioHandler.println(`Welcome to taku.cli! ${version}`);
    this.ioHandler.println(`The terminal size is ${this.ioHandler.getTerminal().width}, ${this.ioHandler.getTerminal().height}`);

    this.ioHandler.print("Username: ");
    this.username = await this.ioHandler.uiInput(false);
    this.ioHandler.print(`\n`);

    this.ioHandler.print("Password: ");
    this.password = await this.ioHandler.uiInput(true);
    this.ioHandler.print(`\n`);

    await this.login();
    // this.getMessage();
    while (!this.keepAlive) {
      await this.sendMessage();
    }
    this.ioHandler.println("Logging off...");
    process.exit();
  }

  public async login() {
    this.ioHandler.println("Logging in...");
    const body = { username: this.username, password: this.password };

    try {
      const response = await fetch("https://backend.taku.moe/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const { token } = await response.json();
      this.authToken = token;
      this.app = new Taku(this.authToken, false, "");
      this.ioHandler.println("Welcome " + this.username + " to taku.cli!");
    } catch (error) {
      this.ioHandler.println("Error while logging in! " + error);
    }
  }

  // for now, we are getting from @global
  public async getMessage() {
    this.ioHandler.println("Getting @global messages...");
    try {
      const response = await fetch(`https://backend.taku.moe/v1/message/@global/0/${this.messageCount}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.authToken,
        },
      });

      this.messages = await response.json();
    } catch (error) {
      this.ioHandler.println("Error while getting messages!" + error);
    }
  }

  public async sendMessage() {
    // const { input } = await prompts(this.messageInput);
    // if (input == "!!quit") {
    //   this.keepAlive = false;
    // }
    // this.term(`${this.username}: `, input);
    // this.app.send(input);
  }

  public handleInput(input: string) {}
}

const taku = new TakuCLI();
taku.run();
