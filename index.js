#!/usr/bin/env node

//Force color on non-native shell (eg. gitbash)
process.env.FORCE_COLOR = true;

const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');

const { lstat } = fs.promises;
const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, filenames) => {
  if (err) {
    throw err;
  }
  const statPromises = filenames.map((filename) => {
    return lstat(path.join(targetDir, filename));
  });

  const allStats = await Promise.all(statPromises);
  let typeFiles = new Array().fill(null);
  let typeFolders = new Array().fill(null);

  for (let stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      typeFiles.push(chalk.green(filenames[index]));
    } else {
      typeFolders.push(chalk.cyan(filenames[index]));
    }
  }

  console.log(chalk.underline.bold.green('Files:'));
  for (let typeFile of typeFiles) {
    console.log(typeFile);
  }
  console.log(chalk.underline.bold.cyan('Folders:'));
  for (let typeFolder of typeFolders) {
    console.log(typeFolder);
  }
});
