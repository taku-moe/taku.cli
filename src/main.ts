// @ts-ignore
import * as fetch from "node-fetch";
import blessed, { line, message } from "blessed";
import { timeStamp } from "console";
import { Client, IMessage } from "taku.js";
import { version } from "../package.json";

class takuCLI {
    // --- Main Section ---
    private username: string | undefined;
    private password: string | undefined;
    private auth: string | undefined;
    private client: any;

    private logged: boolean = false;

    public mainColor = "red";

    public async run() {
        this.screen.append(this.authForm);
        this.authForm.focus();
        this.screen.render();

        this.screen.key("escape", () => {
            process.exit(0);
        });

        this.submitButton.on("press", async () => {
            await this.login();
            await this.chat();
        });
    }

    // --- Taku Section ---

    public async login() {
        const body = { username: this.usernameInput.value, password: this.passwordInput.value };

        try {
            const response = await fetch("https://backend.taku.moe/v1/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const { token } = await response.json();
            this.auth = token;

            if (!this.auth) {
                process.exit(0);
            }

            this.logged = true;
            this.client = new Client(this.auth, false, "");
        } catch (error) {
            this.logged = false;
        }
    }

    public async getLastMessage(auth: string, channel: string, load: number) {
        const response = await fetch(`https://backend.taku.moe/v1/message/${channel}/0/${load}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: auth,
            },
        });

        return await response.json();
    }

    public async chat() {
        this.screen.remove(this.authForm);
        this.screen.append(this.chatBox);

        this.screen.append(this.input);

        this.drawLog("Getting messages...");

        this.client.on("message", async (message: IMessage) => {
            await this.drawMessage(message);
        });

        this.input.on("submit", async () => {
            if (this.input.value == "::quit") {
                process.exit(0);
            }

            this.client.send(`${this.input.value}`);
            this.input.clearValue();
            this.input.focus();
        });

        this.input.focus();
        this.screen.render();
    }

    // --- UI Section ---

    screen = blessed.screen({ smartCSR: true });

    // Login form

    authForm = blessed.form({
        keys: true,
        left: "center",
        top: "center",
        width: 35,
        height: 11,
        padding: {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
        },
        border: {
            type: "line",
        },
        bg: "black",
        content: "Login",
    });

    tabHint = blessed.box({
        parent: this.authForm,
        right: 0,
        top: 0,
        height: 1,
        width: 12,
        content: "Tab to focus",
        style: {
            fg: "grey",
        },
    });

    usernameHint = blessed.box({
        parent: this.authForm,
        left: 0,
        top: 2,
        width: 10,
        content: "Username: ",
        style: { fg: "red" },
    });

    usernameInput = blessed.textbox({
        mouse: true,
        shrink: true,
        inputOnFocus: true,
        parent: this.authForm,
        height: 1,
        width: 15,
        name: "username",
        left: 12,
        top: 2,
        style: {
            fg: "white",
            bg: "grey",
            focus: {
                bg: this.mainColor,
            },
        },
    });

    passwordHint = blessed.box({
        parent: this.authForm,
        left: 0,
        top: 4,
        width: 10,
        content: "Password: ",
        style: { fg: "red" },
    });

    passwordInput = blessed.textbox({
        mouse: true,
        shrink: true,
        inputOnFocus: true,
        parent: this.authForm,
        height: 1,
        width: 15,
        name: "password",
        left: 12,
        top: 4,
        style: {
            fg: "white",
            bg: "grey",
            focus: {
                bg: this.mainColor,
            },
        },
        censor: true,
    });

    submitButton = blessed.button({
        parent: this.authForm,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1,
        },
        style: {
            bg: "grey",
            focus: {
                bg: this.mainColor,
            },
        },
        right: 0,
        bottom: 0,
        name: "submit",
        content: "Login!",
    });

    versionDisplay = blessed.box({
        parent: this.authForm,
        bottom: 0,
        left: 0,
        width: 5,
        height: 1,
        content: `${version}`,
        style: {
            fg: "grey",
        },
    });

    // Main chat

    chatBox = blessed.log({
        top: 0,
        left: 0,
        width: "100%",
        bottom: 3,
        shrink: true,
        tags: true,
        border: {
            type: "line",
        },
        style: {
            scrollbar: {
                bg: "grey",
                fg: this.mainColor,
            },
        },
    });

    input = blessed.textbox({
        mouse: true,
        shrink: true,
        height: 3,
        width: "100%",
        bottom: 0,
        inputOnFocus: true,
        border: {
            type: "line",
        },
        style: {
            fg: "white",
        },
    });

    public drawMessage = async (message: IMessage) => {
        const user = await this.client.getUser(message.author_id);
        const username = user?.username;

        let text = message.content;
        let links = message.attachments;
        let content;

        if (text) {
            content = text;
        } else if (links) {
            content = links;
        } else {
            return;
        }

        this.chatBox.log(`{bold}{${this.mainColor}-fg}${username}{/${this.mainColor}-fg}{/bold} : ${content}`);
    };

    public drawLog = async (message: string) => {
        this.chatBox.log(`{white-fg}${message}`);
    };
}

const taku = new takuCLI();
taku.run();
