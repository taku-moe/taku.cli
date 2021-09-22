import Input from "./taku/input";
// @ts-ignore
import * as fetch from "node-fetch";

class TakuCLI {
  public username: string | undefined;
  public password: string | undefined;
  public _authToken: string | undefined;

  public async Run() {
    Input.GetInput().then(this.Login);
  }

  public SetCreds() {
    this.username = Input.username;
    this.password = Input.password;
  }

  public async Login() {
    const body = {username: Input.username, password: Input.password};

    const response = await fetch("https://backend.taku.moe/v1/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    console.log(await response.json());
  }
}

export default new TakuCLI();
