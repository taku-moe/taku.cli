const keypress = require("keypress");
import { createTerminal, Terminal } from "terminal-kit";

/**
 * A crude IO interface for the terminal, uses keypress to read stdio
 * and terminal-kit for terminal output
 */
export class InputOutputHandler {
    private term: Terminal = createTerminal();

    constructor() {}
    private handleInput(ch: string, key: {}, hideOutput: boolean) {
        if (hideOutput) this.term("\b*");
        else this.term(ch);
    }

    /**
     *
     * @param newLine Set to true if you want newline to be added after input
     * @param hideOutput Set to true if you want to hide the output with *
     * @returns the input string
     */
    public async getInput(newLine: boolean = false, hideOutput: boolean = false): Promise<string> {
        return new Promise((resolve) => {
            let inputBuffer = "";
            keypress(process.stdin);
            process.stdin.on("keypress", (ch, key) => {
                if (key?.name === "return") {
                    if (newLine) this.print("\n");
                    resolve(inputBuffer);
                }
                if (key && key.ctrl && key.name == "c") {
                    process.stdin.pause();
                }
                this.handleInput(ch, key, hideOutput);
                inputBuffer += key;
            });
            process.stdin.setRawMode(true);
            process.stdin.resume();
        });
    }

    /**
     * Gets the instance of this terminal
     * @returns the instance of the terminal
     */
    public getTerminal(): Terminal {
        return this.term;
    }

    /**
     * Replace the current terminal with a new one (usually this is not needed)
     * @param value New terminal to replace the existing one
     */
    public setTerminal(value: Terminal) {
        this.term = value;
    }

    /**
     * Prints a string to the terminal
     * @param value The text to be printed
     */
    public print(value: string) {
        this.term(value);
    }
    /**
     * Prints a string to the terminal and does newline after
     * @param value The text to be printed
     */
    public println(value: string) {
        this.term(value + "\n");
    }
}
