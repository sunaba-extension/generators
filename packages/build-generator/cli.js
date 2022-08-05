#!/usr/bin/env node

const buildGenerator = require("./index");

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/yargs");

const argv = yargs(hideBin(process.argv))
  .option("root", {
    type: "string",
    description: "Root directory of the generator package",
    default: process.cwd(),
  })
  .option("watch", {
    alias: "w",
    type: "boolean",
    description: "Watch files and rebuild on updates",
    default: false,
  })
  .option("copy", {
    type: "array",
    description: "Directories that include non-TS files to copy",
  })
  .parse();

buildGenerator(argv.root, argv.copy, argv.watch);
