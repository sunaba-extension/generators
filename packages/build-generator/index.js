const { build } = require("esbuild");
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

module.exports = async function buildGenerator(
  baseDir,
  pathsToCopy = ["app/templates"],
  watch = false
) {
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
  const entryPoints = [path.resolve(baseDir, "src/app/index.ts")];

  return build({
    entryPoints,
    watch: watch && { onRebuild },
    outbase: "./src",
    outdir: "./generators",
    platform: "node",
    target: "node14",
    bundle: true,
    format: "cjs",
    external: Object.keys(nodeModules[baseDir]),
    plugins: [
      ...pathsToCopy.map((p) =>
        copyStaticFiles({
          src: path.resolve(baseDir, "src", p),
          dest: path.resolve(baseDir, "generators", p),
          recursive: true,
        })
      ),
    ],
  }).then((result) => {
    if (watch) {
      logger.info("Watching...");
    } else {
      logger.info(`Successfully built the generator at ${baseDir}`);
    }
  });
};

function onRebuild(error, result) {
  if (error) {
    logger.error("watch build failed:", error);
  } else {
    logger.info("watch build succeeded");
  }
}
