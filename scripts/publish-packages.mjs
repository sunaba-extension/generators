#!/usr/bin/env zx

import "zx/globals";

const base = path.resolve(__dirname, "..");
cd(base);

const packages = await fs.readdir(path.join(base, "./packages/"), {
  withFileTypes: true,
});

for (const pkg of packages) {
  const pkgDir = path.join(base, "packages", pkg.name, "package.json");
  // skip if it is not a directory
  if (!pkg.isDirectory()) {
    continue;
  }
  // skip if it is not a package
  if (!(await exists(path.join(pkgDir)))) {
    continue;
  }
  // skip if can-npm-publish fails
  try {
    await $`pnpm can-npm-publish ${pkgDir} --verbose`;
  } catch (p) {
    continue;
  }
  // publish with pnpm
  cd(pkgDir);
  await $`pnpm publish --access public`;
}

// helper functions

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
