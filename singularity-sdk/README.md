# darkpool-v1-mm-sdk
### lite package (deposit + withdraw only)
`yarn build:lite` (or `yarn build:lite:prod`) builds `@thesingularitynetwork/singularity-sdk-lite` into `lite/`
from `src/lite.ts`, on `@thesingularitynetwork/darkpool-v1-proof-lite` instead of the full proof package, with the same version as this package.
Publish it with `npm publish ./lite` (public access is set in its package.json; add `--tag beta` for a prerelease). See `LITE.md`.
