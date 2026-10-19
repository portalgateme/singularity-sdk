# singularity-sdk-lite

Deposit and withdraw only. Same code as
[`@thesingularitynetwork/singularity-sdk`](https://www.npmjs.com/package/@thesingularitynetwork/singularity-sdk)
of the same version, built on
[`@thesingularitynetwork/darkpool-v1-proof-lite`](https://www.npmjs.com/package/@thesingularitynetwork/darkpool-v1-proof-lite)
instead of the full proof package.

Exports: `DarkPool`, `DepositService`, `DepositContext`, `WithdrawService`, the base service classes,
`getMerklePathAndRoot`, the note status functions (`isNoteSpent`, `isNoteValid`, ...), `DarkpoolError`, `Relayer`,
`NoteOnChainStatus`, `WithdrawRelayerRequest` and the hex helpers (`hexlify32`, ...).

Built from the singularity-sdk repository with `yarn build:lite` (output in `lite/`).
