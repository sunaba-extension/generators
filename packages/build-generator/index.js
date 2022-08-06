const { build } = require("tsup");
const copyStaticFiles = require("esbuild-copy-static-files");
const pino = require("pino");
const path = require("path");
const fs = require("fs/promises");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "hostname,pid",
    },
  },
});

let nodeModules = {};

module.exports = async function buildGenerator(baseDir, watch = false) {
  const pathsToCopy = ["app/templates"];

  // create a list of locally installed modules
  if (!(baseDir in nodeModules)) {
    const allMods = await fs.readdir(path.resolve(baseDir, "node_modules"));
    const modules = allMods.filter((x) => ![".bin"].includes(x));
    const o = {};
    for (const mod of modules) {
      o[mod] = `commonjs ${mod}`;
    }
    nodeModules[baseDir] = o;
  }

  // entry points
  const entry = [path.resolve(baseDir, "src/app/index.ts")];

  return build({
    entry,
    watch,
    outDir: "./generators/app",
    platform: "node",
    target: "node14",
    bundle: true,
    format: "cjs",
    external: Object.keys(nodeModules[baseDir]),
    dts: true,
    esbuildPlugins: [
      ...pathsToCopy.map((p) =>
        copyStaticFiles({
          src: path.resolve(baseDir, "src", p),
          dest: path.resolve(baseDir, "generators", p),
          recursive: true,
        })
      ),
    ],
  });
};
