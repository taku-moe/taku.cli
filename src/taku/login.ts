import Input from "./input";

class Login {
    public username: string = Input.username;
    public password: string = Input.password;

    public Hi() {
        console.log(this.username, this.password);
    }
}

export default new Login();