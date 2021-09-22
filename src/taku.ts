import "./taku/login";
import Input from "./taku/input";

class Taku {
    public _authToken!: string;



    public Run() {
        Input.GetInput();
        this.Log();
    }

    public Log() {
        console.log(Input.username);
        console.log(Input.password);
    }
}

export default new Taku();