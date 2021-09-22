const prompts = require("prompts");

class Input {
  public username!: string;
  public password!: string;
  private loginQuestion = [
    {
      type: "text",
      name: "username",
      message: "Username:",
      validate: (username: string) => (!username ? "Please enter username!" : true),
    },
    {
      type: "password",
      name: "password",
      message: "Password: ",
      alidate: (username: string) => (!username ? "Please enter password!" : true),
    },
  ];

  public async GetInput() {
    const login = await prompts(this.loginQuestion);
    this.username = login.username;
    this.password = login.password;
  }
}

export default new Input();
