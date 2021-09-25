import { Client, IMessage } from "taku.js";
// @ts-ignore
import * as fetch from "node-fetch";
import { InputOutputHandler } from "./taku/ioHandler";
import { UserInterfaceHandler } from "./taku/uiHandler";
import { version } from "../package.json";

class TakuCLI {
  // User infos
  public username: string | undefined;
  public password: string | undefined;
  private authToken: string | undefined;
  private keepAlive: boolean = true;
  private ioHandler: InputOutputHandler = new InputOutputHandler();
  private uiHandler: UserInterfaceHandler = new UserInterfaceHandler();

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
    // User login

    this.ioHandler.println(`Welcome to taku.cli! ${version}`);
    this.ioHandler.println(`The terminal size is ${this.ioHandler.getTerminal().width}, ${this.ioHandler.getTerminal().height}`);

    this.ioHandler.print("Username: ");
    this.username = await this.uiHandler.inputField(false);
    this.ioHandler.println("");

    this.ioHandler.print("Password: ");
    this.password = await this.uiHandler.inputField(true);
    this.ioHandler.println("");

    await this.login();

    // CLI

    // while (this.keepAlive) {
    //   this.ioHandler.print("Input: ");
    //   await this.sendMessage();
    // }
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

      if (!this.authToken) {
        this.ioHandler.println("Can't find authentication token, did you enter wrong username/password?");
        this.ioHandler.println("Logging off...");
        process.exit();
      }

      this.app = new Client(this.authToken, false, "");
      this.ioHandler.println("Welcome " + this.username + " to taku.cli!");
    } catch (error) {
      this.ioHandler.println("Error while logging in! " + error);
    }
  }

  // for now, we are getting from @global
  public async getMessage() {
    this.ioHandler.println("Getting @global messages...");

    this.app.on("message", async (message: IMessage) => {
      this.ioHandler.println(`${message.content}`);
    });
  }

  public async sendMessage() {
    let input = await this.uiHandler.inputField(false);

    if (input == "!!quit") {
      this.keepAlive = false;
      this.ioHandler.println("");
      return;
    }

    this.ioHandler.println(`\n${this.username}: ${input}`);
    this.app.send(input);
  }

  public handleInput(input: string) {}
}

const taku = new TakuCLI();
taku.run();
