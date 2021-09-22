console.clear();

import chalk from "chalk";
import { version } from "../package.json";
import TakuCLI from "./takucli";

console.log(chalk.hex("#F90069")(`Welcome to taku.cli! ${version}`));

TakuCLI.Run();
