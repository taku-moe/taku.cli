console.clear();

import chalk from "chalk";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";
import { version } from "../package.json";
import Taku from "./taku";
import Input from "./taku/input";
import Login from "./taku/login";

console.log( chalk.hex("#F90069") (`Welcome to taku.cli! ${version}`));

Input.GetInput();
Login.Hi();