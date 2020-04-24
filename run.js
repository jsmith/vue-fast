var nodemon = require("nodemon");
const { transform } = require("sucrase");
const path = require("path");
const fs = require("fs");
// import { transform } from "sucrase";

const srcDir = "src";
const outDir = "lib";
const absoluteSrcDir = path.join(__dirname, srcDir);
const absoluteLibDir = path.join(__dirname, outDir);

const importReg = /^import(?:(["'\s]*)([\w*{}\n, ]+)from(\s*))?(["'\s].*?)([@\w/_-]+)(["'\s].*)/gm;

const aliases = {
  vue: "/web_modules/vue/dist/vue.esm-browser.js",
};

const processFile = async (srcPath) => {
  const relativeFromSrc = srcPath.slice(absoluteSrcDir.length + 1);
  const relativeFromSrcJs = relativeFromSrc.substr(0, relativeFromSrc.lastIndexOf(".")) + ".js";
  const outPath = path.join(absoluteLibDir, relativeFromSrcJs);
  console.log(`Converted ${srcPath} -> ${outPath}`);
  const buffer = await fs.promises.readFile(srcPath);
  const code = buffer.toString();
  const processed = code.replace(
    importReg,
    (
      _,
      spaceBetweenImportAndImported,
      imported,
      spaceBetweenFromTarget,
      leftQuote,
      target,
      rightQuote,
    ) => {
      if (aliases.hasOwnProperty(target)) {
        target = aliases[target];
      }

      if (spaceBetweenImportAndImported === undefined) {
        return `import${leftQuote}${target}${rightQuote}`;
      } else {
        return `import${spaceBetweenImportAndImported}${imported}from${spaceBetweenFromTarget}${leftQuote}${target}${rightQuote}`;
      }
    },
  );

  const { code: transformedCode } = transform(processed, { transforms: ["typescript"] });
  await fs.promises.writeFile(outPath, transformedCode);
};

nodemon({ ext: "ts", watch: ["src"], delay: 2 }).on("restart", (files) => {
  /// process files
  files.forEach(processFile);
});

/**
 *
 * @param {string} dir
 */
async function* getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  for await (const f of getFiles(absoluteSrcDir)) {
    processFile(f);
  }
})();

// // force a restart
// nodemon.emit('restart');

// // force a quit
// nodemon.emit('quit');
