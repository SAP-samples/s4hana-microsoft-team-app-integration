// Copyright (c) Wictor Wilén. All rights reserved.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const gulp = require("gulp");
const core = require("yoteams-build-core");
const package = require("./package.json");
const argv = require("yargs").argv;
const log = require("fancy-log");
const path = require("path");

const config = {};

// Set environment variables
const env = argv.env;
if (env === undefined) {
  require("dotenv").config();
} else {
  log(`Using custom .env: ${env}`);
  require("dotenv").config({ path: path.resolve(process.cwd(), env) });
}
process.env.VERSION = package.version;

// Initialize core build
core.setup(gulp, config);
