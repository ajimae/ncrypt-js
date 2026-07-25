const esbuild = require("esbuild");

function defaults(c) {
  return {
    minify: true,
    bundle: true,
    entryPoints: ['index.ts'],
    outfile: `dist/${c.out}`,
    format: `${c.format}`,
    platform: "node",
    target: "node18",
  }
}

const arr = [{ out: 'ncrypt.cjs', format: 'cjs' }, { out: 'ncrypt.mjs', format: 'esm' }]

const promises = arr.map(c => {
  return esbuild.build(defaults(c))
});

Promise.all(promises).catch(console.error)
