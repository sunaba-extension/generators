#!/usr/bin/env zx

import "zx/globals";

const base = path.resolve(__dirname, "..");

const packages = await fs.readdir(path.join(base, "./packages/"), {
  withFileTypes: true,
});

function makeGeneratorInfo(name, description, version) {
  return { name, description, version };
}

let generators = [];

for (const pkg of packages) {
  const pkgDir = path.join(base, "packages", pkg.name);

  // --- generator package check ---

  // skip if it is not a directory
  if (!pkg.isDirectory()) {
    continue;
  }
  // skip if it is not a generator
  if (!pkg.name.startsWith("generator-")) {
    continue;
  }

  const packageJsonPath = path.join(pkgDir, "package.json");
  // skip if it is not a package
  if (!(await exists(packageJsonPath))) {
    continue;
  }

  // --- create a list ---
  const pkgInfo = await fs.readJSON(packageJsonPath);
  generators.push(
    makeGeneratorInfo(pkgInfo.name, pkgInfo.description, pkgInfo.version)
  );
}

try {
  await fs.mkdir(path.join(base, "dist"));
} catch {}

await fs.writeJSON(
  path.join(base, "dist", "generators.json"),
  { generators },
  { spaces: 2 }
);

// helper functions

async function exists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
