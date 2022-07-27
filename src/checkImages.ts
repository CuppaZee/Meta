/* eslint-disable no-console */

import fetch from "node-fetch";
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

const ignore = new Set<number>([]);

(async function () {
  const db = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../output/database.json"), "utf8")
  );

  const info = await fetch("https://images.cuppazee.app/info").then(res => res.json());

  const items = new Set<string>();

  for (const item of info.cache) {
    const match = item.match("pins_[0-9]+_([^.]+).png");
    if (match) items.add(match[1]);
  }

  for (const item of info.overrides) {
    const match = item.match("pins__([^.]+).png");
    if (match) items.add(match[1]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const possiblyMissing = new Set<any>();

  for (const type of db.types) {
    const strippedIcon = type.icons[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!items.has(strippedIcon)) {
      possiblyMissing.add(type);
    }
  }

  const exists = await fetch(
    `https://images.cuppazee.app/exists/${encodeURIComponent(
      [...possiblyMissing].map(i => i.icons[0]).join("||")
    )}`
  ).then(res => res.json());

  let errorCount = 0;
  for (const type of possiblyMissing) {
    if (!exists[type.icons[0]] && !exists[encodeURIComponent(type.icons[0])]) {
      if (ignore.has(type.munzee_id)) {
        console.log(chalk.grey`Missing icon for type: ${type.name} (${type.munzee_id}, ignored)`);
      } else {
        console.log(chalk.red`Missing icon for type: ${type.name} (${type.munzee_id})`);
        errorCount++;
      }
    }
  }

  if (errorCount > 0) {
    console.log(chalk.red`Found ${errorCount} missing icons`);
    process.exit(1);
  }
  console.log(chalk.green`No (unignored) missing icons`);
})();
