const prompts = require("prompts");
import Taku from "taku.js";
import chalk from "chalk";
// @ts-ignore
import * as fetch from "node-fetch";
import Input from "./taku/input";

class TakuCLI {
  // User infos
  public username: string | undefined;
  public password: string | undefined;
  private authToken: string | undefined;

  // CLI Stuff
  public messageCount: number = 50;
  public app: any;
  private messages: any;
  private messageInput = [{
      type: "text",
      name: "input",
      message: "Input:"
    }]
  
  public async run() {
    await Input.getInput();
    this.username = Input.username;
    this.password = Input.password;

    await this.login();
    // this.getMessage();
    while (true) {await this.sendMessage()}
  }

  public async login() {
    console.log(chalk.hex("#585E80")("Logging in..."))
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
      console.log(chalk.hex("#F90069")(`Welcome`), chalk.hex("#FAFAFA")(this.username), chalk.hex("#F90069")(`to taku.cli!`));
    } catch (error) {
      console.log("Error while logging in!", error);
    }
  }

  // for now, we are getting from @global
  public async getMessage() {
    console.log(chalk.hex("#585E80")("Getting @global messages..."))
    try {
      const response = await fetch(`https://backend.taku.moe/v1/message/@global/0/${this.messageCount}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.authToken,
        }
      })

      this.messages = await response.json();

    } catch (error) {
      console.log("Error while getting messages!", error);
    }
  }

  public async sendMessage() {
    const {input} = await prompts(this.messageInput);
    if (input == "!!quit") { process.exit(); }
    console.log("Sent message:", input);
    this.app.send(input);
  }
}

export default new TakuCLI();
