// @ts-ignore
import * as fetch from "node-fetch";
import blessed from "blessed";
import { Client, IMessage } from "taku.js";
import { version } from "../package.json";
import { mainColor, dimColor, brightColor } from "./settings.taku.json";

class takuCLI {
    // --- Main Section ---
    private username: string | undefined;
    private password: string | undefined;
    private auth: string | undefined;
    private client: any;

    public mainColor = mainColor;
    public dimColor = dimColor;
    public brightColor = brightColor;

    public async run() {
        this.screen.append(this.authForm);
        this.authForm.focus();
        this.screen.render();

        this.screen.key("escape", () => {
            process.exit(0);
        });

        this.submitButton.on("press", async () => {
            this.username = this.usernameInput.value;
            this.password = this.passwordInput.value;
            await this.login(this.username, this.password);
            await this.chat();
        });
    }

    // --- Taku Section ---

    public async login(username: string, password: string) {
        const body = { username: username, password: password };

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

            this.client = new Client(this.auth, false, "");
        } catch (error) {}
    }

    public async chat() {
        this.screen.remove(this.authForm);
        this.screen.append(this.chatBox);

        this.screen.append(this.input);

        // replace this when there's channel support
        this.drawLog(`{${this.dimColor}-fg}Welcome ${this.username} to taku.cli ${version}\nYou're currently in @global`);

        this.client.on("message", async (message: IMessage) => {
            await this.drawMessage(message);
        });

        this.input.on("submit", async () => {
            this.client.send(`${this.input.value}`);
            this.input.clearValue();
            this.input.focus();
        });

        this.input.focus();
        this.screen.render();
    }

    // --- UI Section ---

    screen = blessed.screen({
        smartCSR: true,
        title: `taku.cli ${version}`,
    });

    // Login form

    authForm = blessed.form({
        keys: true,
        top: "center",
        left: "center",
        width: 35,
        height: 9,
        padding: {
            left: 1,
            right: 1,
        },
        border: {
            type: "line",
        },
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
            fg: this.dimColor,
        },
    });

    usernameHint = blessed.box({
        parent: this.authForm,
        left: 0,
        top: 2,
        width: 9,
        content: "Username:",
        style: { fg: this.mainColor },
    });

    usernameInput = blessed.textbox({
        mouse: true,
        inputOnFocus: true,
        parent: this.authForm,
        height: 1,
        width: 21,
        name: "username",
        right: 0,
        top: 2,
        style: {
            fg: this.brightColor,
            bg: this.dimColor,
            focus: {
                bg: this.mainColor,
            },
        },
    });

    passwordHint = blessed.box({
        parent: this.authForm,
        left: 0,
        top: 4,
        width: 9,
        content: "Password:",
        style: { fg: this.mainColor },
    });

    passwordInput = blessed.textbox({
        mouse: true,
        inputOnFocus: true,
        parent: this.authForm,
        height: 1,
        width: 21,
        name: "password",
        right: 0,
        top: 4,
        style: {
            fg: this.brightColor,
            bg: this.dimColor,
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
            bg: this.dimColor,
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
            fg: this.dimColor,
        },
    });

    // Main chat

    chatBox = blessed.log({
        top: 0,
        left: 0,
        width: "100%",
        bottom: 1,
        shrink: true,
        tags: true,
        border: {
            type: "line",
        },
    });

    input = blessed.textbox({
        mouse: true,
        shrink: true,
        height: 1,
        width: "100%",
        bottom: 0,
        inputOnFocus: true,
        style: {
            fg: this.brightColor,
            bg: this.dimColor,
            focus: {
                bg: this.mainColor,
            },
        },
    });

    public drawMessage = async (message: IMessage) => {
        const username = ((await this.client.getUser(message.author_id)).username + "             ").slice(0, 12);

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
        this.chatBox.log(message);
    };
}

const taku = new takuCLI();
taku.run();
