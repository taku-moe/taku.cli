import Input from "./taku/input";
import chalk from "chalk";
// @ts-ignore
import * as fetch from "node-fetch";

class TakuCLI {
  public username: string | undefined;
  public password: string | undefined;
  private authToken: string | undefined;

  public async run() {
    await Input.getInput();
    this.username = Input.username;
    this.password = Input.password;

    this.login();
  }

  public async login() {
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
      console.log(chalk.hex("#F90069")(`Welcome`), chalk.hex("#FAFAFA")(this.username), chalk.hex("#F90069")(`to taku.cli!`));
    } catch (error) {
      console.log(error);
    }
  }
}

export default new TakuCLI();
