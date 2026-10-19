// Builds the lite package (src/lite.ts: deposit + withdraw only) into lite/ for `npm publish ./lite`.
// tsdx always writes to dist/, so the full build in dist/ is moved aside and put back afterwards.
// The bundle and declarations import @thesingularitynetwork/darkpool-v1-proof-lite instead of the full proof package.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'lite');
const NAME = 'singularity-sdk-lite';
const PROOF = '@thesingularitynetwork/darkpool-v1-proof';
const PROOF_LITE = '@thesingularitynetwork/darkpool-v1-proof-lite';
const DEPENDENCIES = ['axios', 'ethers'];

const root = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const dist = path.join(ROOT, 'dist');
const saved = path.join(ROOT, 'dist.full');
fs.rmSync(saved, { recursive: true, force: true });
if (fs.existsSync(dist)) fs.renameSync(dist, saved);

try {
  execSync(`npx tsdx build --entry src/lite.ts --name ${NAME}${process.argv.includes('--prod') ? ' --prod' : ''}`, {
    cwd: ROOT,
    stdio: 'inherit'
  });
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT);
  fs.renameSync(dist, path.join(OUT, 'dist'));
} finally {
  fs.rmSync(dist, { recursive: true, force: true });
  if (fs.existsSync(saved)) fs.renameSync(saved, dist);
}

// Keep only the declarations reachable from lite.d.ts, so the package exposes the lite API only.
const outDist = path.join(OUT, 'dist');
const keep = new Set();
const visit = file => {
  if (keep.has(file) || !fs.existsSync(file)) return;
  keep.add(file);
  const src = fs.readFileSync(file, 'utf8');
  for (const [, spec] of src.matchAll(/(?:from |import\()['"](\.[^'"]+)['"]/g)) {
    const base = path.resolve(path.dirname(file), spec);
    visit(fs.existsSync(base + '.d.ts') ? base + '.d.ts' : path.join(base, 'index.d.ts'));
  }
};
visit(path.join(outDist, 'lite.d.ts'));
const walk = (dir, fn) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(file, fn);
      if (fs.readdirSync(file).length === 0) fs.rmdirSync(file);
    } else {
      fn(file);
    }
  }
};
walk(outDist, file => {
  if (file.endsWith('.d.ts') && !keep.has(file)) {
    fs.rmSync(file);
    return;
  }
  if (!/\.(js|d\.ts|map)$/.test(file)) return;
  const src = fs.readFileSync(file, 'utf8');
  const out = src.split(`'${PROOF}'`).join(`'${PROOF_LITE}'`).split(`"${PROOF}"`).join(`"${PROOF_LITE}"`);
  if (out !== src) fs.writeFileSync(file, out);
});
for (const file of fs.readdirSync(outDist).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(outDist, file), 'utf8');
  if (/darkpool-v1-proof['"]/.test(src)) throw new Error(`${file} still imports ${PROOF}`);
}

const pkg = {
  name: '@thesingularitynetwork/singularity-sdk-lite',
  description: 'Deposit and withdraw of @thesingularitynetwork/singularity-sdk',
  version: root.version,
  license: root.license,
  repository: root.repository.startsWith('git+') ? root.repository : `git+${root.repository}`,
  main: 'dist/index.js',
  module: `dist/${NAME}.esm.js`,
  typings: 'dist/lite.d.ts',
  files: ['dist'],
  engines: root.engines,
  dependencies: {
    [PROOF_LITE]: root.dependencies[PROOF],
    ...Object.fromEntries(DEPENDENCIES.map(dep => [dep, root.dependencies[dep]]))
  },
  // a new scoped package is private by default, which the npm org plan does not allow
  publishConfig: { access: 'public' }
};
fs.writeFileSync(path.join(OUT, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
fs.copyFileSync(path.join(ROOT, 'LITE.md'), path.join(OUT, 'README.md'));
console.log(`${pkg.name}@${pkg.version} built in lite/`);
