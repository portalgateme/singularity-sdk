import { ChainId } from "./chain"

export enum POOL_TYPE {
    META = 'META',
    FSN = 'FSN',
    NORMAL = 'NORMAL',
}

export enum BASEPOOL_TYPE {
    '3POOL' = 1,
    FRAXUSDC = 2,
}

export type CurvePoolConfig = {
    id: string
    name: string
    address: string,
    lpToken: string,
    lpTokenDecimal: number,
    lpTokenSymbol: string,
    poolType?: POOL_TYPE,
    basePoolType?: BASEPOOL_TYPE,
    disableDepositUnderlying?: boolean,
    disableWithdrawOneCoin?: boolean,
    isLegacy?: number,
    isPlain: boolean,
    isLending: boolean,
    isMeta: boolean,
    isCrypto: boolean,
    underlyingCoins: string[],
    wrappedCoins: string[],
    underlyingAddresses: string[],
    wrappedAddresses: string[],
    underlyingDecimals: number[],
    wrappedDecimals: number[],
    useLending?: boolean[],
}

export const CURVE_POOL: { [chainId: number]: CurvePoolConfig[] } = {
    [ChainId.MAINNET]: [
        {
            "id": "steth",
            "name": "steth",
            "address": "0xdc24316b9ae028f1497c275eb9192a3ea0f67022",
            "lpToken": "0x06325440d014e39736583c165c2963ba99faf14e",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "steCRV",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "stETH"
            ],
            "wrappedCoins": [
                "ETH",
                "stETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]

        },
        {
            "id": "3pool",
            "name": "3pool",
            "address": "0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7",
            "lpToken": "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "3Crv",
            "isLegacy": 2,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "DAI",
                "USDC",
                "USDT"
            ],
            "wrappedCoins": [
                "DAI",
                "USDC",
                "USDT"
            ],
            "underlyingAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "wrappedAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "underlyingDecimals": [
                18,
                6,
                6
            ],
            "wrappedDecimals": [
                18,
                6,
                6
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-32",
            "name": "FRAXsDAI",
            "address": "0xce6431d21e3fb1036ce9973a3312368ed96f5ce7",
            "lpToken": "0xce6431d21e3fb1036ce9973a3312368ed96f5ce7",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "FRAXsDAI",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "sDAI"
            ],
            "wrappedCoins": [
                "FRAX",
                "sDAI"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x83f20f44975d03b1b09e64809b757c47f942beea"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x83f20f44975d03b1b09e64809b757c47f942beea"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-34",
            "name": "FRAXPYUSD",
            "address": "0xa5588f7cdf560811710a2d82d3c9c99769db1dcb",
            "lpToken": "0xa5588f7cdf560811710a2d82d3c9c99769db1dcb",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "FRAXPYUSD",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "PYUSD"
            ],
            "wrappedCoins": [
                "FRAX",
                "PYUSD"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-15",
            "name": "frxETH/WETH",
            "address": "0x9c3b46c0ceb5b9e304fcd6d88fc50f7dd24b31bc",
            "lpToken": "0x9c3b46c0ceb5b9e304fcd6d88fc50f7dd24b31bc",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "frxeth-ng-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "WETH",
                "frxETH"
            ],
            "wrappedCoins": [
                "WETH",
                "frxETH"
            ],
            "underlyingAddresses": [
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "wrappedAddresses": [
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-303",
            "name": "stETH-ng",
            "address": "0x21e27a5e5513d6e65c4f830167390997aa84843a",
            "lpToken": "0x21e27a5e5513d6e65c4f830167390997aa84843a",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "stETH-ng-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "stETH"
            ],
            "wrappedCoins": [
                "ETH",
                "stETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "tricrypto2",
            "name": "tricrypto2",
            "address": "0xd51a44d3fae010294c616388b506acda1bfaae46",
            "lpToken": "0xc4ad29ba4b3c580e6d59105fff484999997675ff",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crv3crypto",
            "isLegacy": 7,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "USDT",
                "WBTC",
                "ETH"
            ],
            "wrappedCoins": [
                "USDT",
                "WBTC",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ],
            "wrappedAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                6,
                8,
                18
            ],
            "wrappedDecimals": [
                6,
                8,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },

        {
            "id": "fraxusdc",
            "name": "fraxusdc",
            "address": "0xdcef968d416a41cdac0ed8702fac8128a64241a2",
            "lpToken": "0x3175df0976dfa876431c2e9ee6bc45b65d3473cc",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvFRAX",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "USDC"
            ],
            "wrappedCoins": [
                "FRAX",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-274",
            "name": "stETH/frxETH",
            "address": "0x4d9f9d15101eec665f77210cb999639f760f831e",
            "lpToken": "0x4d9f9d15101eec665f77210cb999639f760f831e",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "st-frxETH-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "stETH",
                "frxETH"
            ],
            "wrappedCoins": [
                "stETH",
                "frxETH"
            ],
            "underlyingAddresses": [
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "wrappedAddresses": [
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ],
        },
        {
            "id": "factory-v2-298",
            "name": "OETH",
            "address": "0x94b17476a93b3262d87b9a326965d1e91f9c13e7",
            "lpToken": "0x94b17476a93b3262d87b9a326965d1e91f9c13e7",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "OETHCRV-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "OETH"
            ],
            "wrappedCoins": [
                "ETH",
                "OETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-1",
            "name": "TricryptoUSDT",
            "address": "0xf5f5b97624542d72a9e06f04804bf81baa15e2b4",
            "lpToken": "0xf5f5b97624542d72a9e06f04804bf81baa15e2b4",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDTWBTCWETH",
            "isLegacy": 4,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "USDT",
                "WBTC",
                "ETH"
            ],
            "wrappedCoins": [
                "USDT",
                "WBTC",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ],
            "wrappedAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                6,
                8,
                18
            ],
            "wrappedDecimals": [
                6,
                8,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },

        {
            "id": "factory-stable-ng-43",
            "name": "PayPool",
            "address": "0x383e6b4437b59fff47b619cba855ca29342a8559",
            "lpToken": "0x383e6b4437b59fff47b619cba855ca29342a8559",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "PYUSDUSDC",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "PYUSD",
                "USDC"
            ],
            "wrappedCoins": [
                "PYUSD",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                6,
                6
            ],
            "wrappedDecimals": [
                6,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-147",
            "name": "alUSDFRAXBP",
            "address": "0xb30da2376f63de30b42dc055c93fa474f31330a5",
            "lpToken": "0xb30da2376f63de30b42dc055c93fa474f31330a5",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "alUSDFRAXB3CRV-f",
            "poolType": POOL_TYPE.META,
            "basePoolType": BASEPOOL_TYPE.FRAXUSDC,
            "disableDepositUnderlying": true,
            "isLegacy": 1,
            "isPlain": false,
            "isLending": false,
            "isMeta": true,
            "isCrypto": false,
            "underlyingCoins": [
                "alUSD",
                "FRAX",
                "USDC"
            ],
            "wrappedCoins": [
                "alUSD",
                "FRAXBP"
            ],
            "underlyingAddresses": [
                "0xbc6da0fe9ad5f3b0d58160288917aa56653660e9",
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0xbc6da0fe9ad5f3b0d58160288917aa56653660e9",
                "0x3175df0976dfa876431c2e9ee6bc45b65d3473cc"
            ],
            "underlyingDecimals": [
                18,
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "frxeth",
            "name": "frxeth",
            "address": "0xa1f8a6807c402e4a15ef4eba36528a3fed24e577",
            "lpToken": "0xf43211935c781d5ca1a41d2041f397b8a7366c7a",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "frxETHCRV",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "frxETH"
            ],
            "wrappedCoins": [
                "ETH",
                "frxETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-0",
            "name": "TricryptoUSDC",
            "address": "0x7f86bf177dd4f3494b841a37e810a34dd56c829b",
            "lpToken": "0x7f86bf177dd4f3494b841a37e810a34dd56c829b",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDCWBTCWETH",
            "isLegacy": 4,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "USDC",
                "WBTC",
                "ETH"
            ],
            "wrappedCoins": [
                "USDC",
                "WBTC",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ],
            "wrappedAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                6,
                8,
                18
            ],
            "wrappedDecimals": [
                6,
                8,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-v2-283",
            "name": "cvxCrv/Crv",
            "address": "0x971add32ea87f10bd192671630be3be8a11b8623",
            "lpToken": "0x971add32ea87f10bd192671630be3be8a11b8623",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "cvxcrv-crv-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "CRV",
                "cvxCRV"
            ],
            "wrappedCoins": [
                "CRV",
                "cvxCRV"
            ],
            "underlyingAddresses": [
                "0xd533a949740bb3306d119cc777fa900ba034cd52",
                "0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7"
            ],
            "wrappedAddresses": [
                "0xd533a949740bb3306d119cc777fa900ba034cd52",
                "0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crypto-320",
            "name": "ETHx-wstETH",
            "address": "0x14756a5ed229265f86990e749285bdd39fe0334f",
            "lpToken": "0xfffae954601cff1195a8e20342db7ee66d56436b",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "ETHxwstETH-f",
            "isLegacy": 12,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "wstETH",
                "ETHx"
            ],
            "wrappedCoins": [
                "wstETH",
                "ETHx"
            ],
            "underlyingAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xa35b1b31ce002fbf2058d22f30f95d405200a15b"
            ],
            "wrappedAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xa35b1b31ce002fbf2058d22f30f95d405200a15b"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-17",
            "name": "mkUSD-USDC",
            "address": "0xf980b4a4194694913af231de69ab4593f5e0fcdc",
            "lpToken": "0xf980b4a4194694913af231de69ab4593f5e0fcdc",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "mkUSDUSDC",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "mkUSD",
                "USDC"
            ],
            "wrappedCoins": [
                "mkUSD",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-17",
            "name": "mkUSD/crvUSD",
            "address": "0x3de254a0f838a844f727fee81040e0fa7884b935",
            "lpToken": "0x3de254a0f838a844f727fee81040e0fa7884b935",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "mkcrvUSD-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "mkUSD",
                "crvUSD"
            ],
            "wrappedCoins": [
                "mkUSD",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ],
        },
        {
            "id": "factory-stable-ng-33",
            "name": "FRAXFPI",
            "address": "0x2cf99a343e4ecf49623e82f2ec6a9b62e16ff3fe",
            "lpToken": "0x2cf99a343e4ecf49623e82f2ec6a9b62e16ff3fe",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "FRAXFPI",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "FPI"
            ],
            "wrappedCoins": [
                "FRAX",
                "FPI"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x5ca135cb8527d76e932f34b5145575f9d8cbe08e"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x5ca135cb8527d76e932f34b5145575f9d8cbe08e"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },

        {
            "id": "factory-stable-ng-12",
            "name": "USDe-USDC",
            "address": "0x02950460e2b9529d0e00284a5fa2d7bdf3fa4d72",
            "lpToken": "0x02950460e2b9529d0e00284a5fa2d7bdf3fa4d72",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "USDeUSDC",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDe",
                "USDC"
            ],
            "wrappedCoins": [
                "USDe",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crypto-91",
            "name": "cbETH/ETH",
            "address": "0x5fae7e604fc3e24fd43a72867cebac94c65b404a",
            "lpToken": "0x5b6c539b224014a09b3388e51caaa8e354c959c8",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "cbETH/ETH-f",
            "isLegacy": 12,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "ETH",
                "cbETH"
            ],
            "wrappedCoins": [
                "WETH",
                "cbETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xbe9895146f7af43049ca1c1ae358b0541ea49704"
            ],
            "wrappedAddresses": [
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0xbe9895146f7af43049ca1c1ae358b0541ea49704"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-1",
            "name": "crvUSD/USDT",
            "address": "0x390f3595bca2df7d23783dfd126427cceb997bf4",
            "lpToken": "0x390f3595bca2df7d23783dfd126427cceb997bf4",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDUSDT-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDT",
                "crvUSD"
            ],
            "wrappedCoins": [
                "USDT",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                6,
                18
            ],
            "wrappedDecimals": [
                6,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "lusd",
            "name": "lusd",
            "address": "0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca",
            "lpToken": "0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "LUSD3CRV-f",
            "poolType": POOL_TYPE.META,
            "basePoolType": BASEPOOL_TYPE["3POOL"],
            "isLegacy": 1,
            "isPlain": false,
            "isLending": false,
            "isMeta": true,
            "isCrypto": false,
            "underlyingCoins": [
                "LUSD",
                "DAI",
                "USDC",
                "USDT"
            ],
            "wrappedCoins": [
                "LUSD",
                "3Crv"
            ],
            "underlyingAddresses": [
                "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "wrappedAddresses": [
                "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
                "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490"
            ],
            "underlyingDecimals": [
                18,
                18,
                6,
                6
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-4",
            "name": "TriCRV",
            "address": "0x4ebdf703948ddcea3b11f675b4d1fba9d2414a14",
            "lpToken": "0x4ebdf703948ddcea3b11f675b4d1fba9d2414a14",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDETHCRV",
            "isLegacy": 4,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "crvUSD",
                "ETH",
                "CRV"
            ],
            "wrappedCoins": [
                "crvUSD",
                "WETH",
                "CRV"
            ],
            "underlyingAddresses": [
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xd533a949740bb3306d119cc777fa900ba034cd52"
            ],
            "wrappedAddresses": [
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0xd533a949740bb3306d119cc777fa900ba034cd52"
            ],
            "underlyingDecimals": [
                18,
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-0",
            "name": "crvUSD/USDC",
            "address": "0x4dece678ceceb27446b35c672dc7d61f30bad69e",
            "lpToken": "0x4dece678ceceb27446b35c672dc7d61f30bad69e",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDUSDC-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDC",
                "crvUSD"
            ],
            "wrappedCoins": [
                "USDC",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                6,
                18
            ],
            "wrappedDecimals": [
                6,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-14",
            "name": "TryLSD",
            "address": "0x2570f1bd5d2735314fc102eb12fc1afe9e6e7193",
            "lpToken": "0x2570f1bd5d2735314fc102eb12fc1afe9e6e7193",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "TryLSD",
            "isLegacy": 4,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "wstETH",
                "rETH",
                "sfrxETH"
            ],
            "wrappedCoins": [
                "wstETH",
                "rETH",
                "sfrxETH"
            ],
            "underlyingAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xae78736cd615f374d3085123a210448e74fc6393",
                "0xac3e018457b222d93114458476f3e3416abbe38f"
            ],
            "wrappedAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xae78736cd615f374d3085123a210448e74fc6393",
                "0xac3e018457b222d93114458476f3e3416abbe38f"
            ],
            "underlyingDecimals": [
                18,
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-68",
            "name": "mkUSDUSDe",
            "address": "0x1ab3d612ea7df26117554dddd379764ebce1a5ad",
            "lpToken": "0x1ab3d612ea7df26117554dddd379764ebce1a5ad",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "mkUSDUSDe",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "mkUSD",
                "USDe"
            ],
            "wrappedCoins": [
                "mkUSD",
                "USDe"
            ],
            "underlyingAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3"
            ],
            "wrappedAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-22",
            "name": "weETH/WETH",
            "address": "0x13947303f63b363876868d070f14dc865c36463b",
            "lpToken": "0x13947303f63b363876868d070f14dc865c36463b",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "weETH-WETH",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "weETH",
                "WETH"
            ],
            "wrappedCoins": [
                "weETH",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "wrappedAddresses": [
                "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-11",
            "name": "USDe-crvUSD",
            "address": "0xf55b0f6f2da5ffddb104b58a60f2862745960442",
            "lpToken": "0xf55b0f6f2da5ffddb104b58a60f2862745960442",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "USDecrvUSD",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDe",
                "crvUSD"
            ],
            "wrappedCoins": [
                "USDe",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "susd",
            "name": "susd",
            "address": "0xa5407eae9ba41422680e2e00537571bcc53efbfd",
            "lpToken": "0xc25a3a3b969415c80451098fa907ec722572917f",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvPlain3andSUSD",
            "isLegacy": 2,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "disableWithdrawOneCoin": true,
            "underlyingCoins": [
                "DAI",
                "USDC",
                "USDT",
                "sUSD"
            ],
            "wrappedCoins": [
                "DAI",
                "USDC",
                "USDT",
                "sUSD"
            ],
            "underlyingAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x57ab1ec28d129707052df4df418d58a2d46d5f51"
            ],
            "wrappedAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x57ab1ec28d129707052df4df418d58a2d46d5f51"
            ],
            "underlyingDecimals": [
                18,
                6,
                6,
                18
            ],
            "wrappedDecimals": [
                18,
                6,
                6,
                18
            ],
            "useLending": [
                false,
                false,
                false,
                false
            ]
        },
        {
            "id": "seth",
            "name": "seth",
            "address": "0xc5424b857f758e906013f3555dad202e4bdb4567",
            "lpToken": "0xa3d87fffce63b53e0d54faa1cc983b7eb0b74a9c",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "eCRV",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "sETH"
            ],
            "wrappedCoins": [
                "ETH",
                "sETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-336",
            "name": "eUSD/3CRV",
            "address": "0x2673099769201c08e9a5e63b25fbaf25541a6557",
            "lpToken": "0x2673099769201c08e9a5e63b25fbaf25541a6557",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "eUSD3CRV3CRV-f",
            "poolType": POOL_TYPE.META,
            "basePoolType": BASEPOOL_TYPE["3POOL"],
            "isPlain": false,
            "isLending": false,
            "isMeta": true,
            "isCrypto": false,
            "underlyingCoins": [
                "eUSD",
                "DAI",
                "USDC",
                "USDT"
            ],
            "wrappedCoins": [
                "eUSD",
                "3Crv"
            ],
            "underlyingAddresses": [
                "0xdf3ac4f479375802a821f7b7b46cd7eb5e4262cc",
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "wrappedAddresses": [
                "0xdf3ac4f479375802a821f7b7b46cd7eb5e4262cc",
                "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490"
            ],
            "underlyingDecimals": [
                18,
                18,
                6,
                6
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false,
                false
            ]
        },
    ],
    [ChainId.SEPOLIA]: [],
    [ChainId.HARDHAT]: [
        {
            "id": "steth",
            "name": "steth",
            "address": "0xdc24316b9ae028f1497c275eb9192a3ea0f67022",
            "lpToken": "0x06325440d014e39736583c165c2963ba99faf14e",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "steCRV",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "stETH"
            ],
            "wrappedCoins": [
                "ETH",
                "stETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]

        },
        {
            "id": "3pool",
            "name": "3pool",
            "address": "0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7",
            "lpToken": "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "3Crv",
            "isLegacy": 2,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "DAI",
                "USDC",
                "USDT"
            ],
            "wrappedCoins": [
                "DAI",
                "USDC",
                "USDT"
            ],
            "underlyingAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "wrappedAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "underlyingDecimals": [
                18,
                6,
                6
            ],
            "wrappedDecimals": [
                18,
                6,
                6
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-32",
            "name": "FRAXsDAI",
            "address": "0xce6431d21e3fb1036ce9973a3312368ed96f5ce7",
            "lpToken": "0xce6431d21e3fb1036ce9973a3312368ed96f5ce7",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "FRAXsDAI",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "sDAI"
            ],
            "wrappedCoins": [
                "FRAX",
                "sDAI"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x83f20f44975d03b1b09e64809b757c47f942beea"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x83f20f44975d03b1b09e64809b757c47f942beea"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-34",
            "name": "FRAXPYUSD",
            "address": "0xa5588f7cdf560811710a2d82d3c9c99769db1dcb",
            "lpToken": "0xa5588f7cdf560811710a2d82d3c9c99769db1dcb",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "FRAXPYUSD",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "PYUSD"
            ],
            "wrappedCoins": [
                "FRAX",
                "PYUSD"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-15",
            "name": "frxETH/WETH",
            "address": "0x9c3b46c0ceb5b9e304fcd6d88fc50f7dd24b31bc",
            "lpToken": "0x9c3b46c0ceb5b9e304fcd6d88fc50f7dd24b31bc",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "frxeth-ng-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "WETH",
                "frxETH"
            ],
            "wrappedCoins": [
                "WETH",
                "frxETH"
            ],
            "underlyingAddresses": [
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "wrappedAddresses": [
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-303",
            "name": "stETH-ng",
            "address": "0x21e27a5e5513d6e65c4f830167390997aa84843a",
            "lpToken": "0x21e27a5e5513d6e65c4f830167390997aa84843a",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "stETH-ng-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "stETH"
            ],
            "wrappedCoins": [
                "ETH",
                "stETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "tricrypto2",
            "name": "tricrypto2",
            "address": "0xd51a44d3fae010294c616388b506acda1bfaae46",
            "lpToken": "0xc4ad29ba4b3c580e6d59105fff484999997675ff",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crv3crypto",
            "isLegacy": 7,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "USDT",
                "WBTC",
                "ETH"
            ],
            "wrappedCoins": [
                "USDT",
                "WBTC",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ],
            "wrappedAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                6,
                8,
                18
            ],
            "wrappedDecimals": [
                6,
                8,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },

        {
            "id": "fraxusdc",
            "name": "fraxusdc",
            "address": "0xdcef968d416a41cdac0ed8702fac8128a64241a2",
            "lpToken": "0x3175df0976dfa876431c2e9ee6bc45b65d3473cc",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvFRAX",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "USDC"
            ],
            "wrappedCoins": [
                "FRAX",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-274",
            "name": "stETH/frxETH",
            "address": "0x4d9f9d15101eec665f77210cb999639f760f831e",
            "lpToken": "0x4d9f9d15101eec665f77210cb999639f760f831e",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "st-frxETH-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "stETH",
                "frxETH"
            ],
            "wrappedCoins": [
                "stETH",
                "frxETH"
            ],
            "underlyingAddresses": [
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "wrappedAddresses": [
                "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ],
        },
        {
            "id": "factory-v2-298",
            "name": "OETH",
            "address": "0x94b17476a93b3262d87b9a326965d1e91f9c13e7",
            "lpToken": "0x94b17476a93b3262d87b9a326965d1e91f9c13e7",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "OETHCRV-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "OETH"
            ],
            "wrappedCoins": [
                "ETH",
                "OETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-1",
            "name": "TricryptoUSDT",
            "address": "0xf5f5b97624542d72a9e06f04804bf81baa15e2b4",
            "lpToken": "0xf5f5b97624542d72a9e06f04804bf81baa15e2b4",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDTWBTCWETH",
            "isLegacy": 4,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "USDT",
                "WBTC",
                "ETH"
            ],
            "wrappedCoins": [
                "USDT",
                "WBTC",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ],
            "wrappedAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                6,
                8,
                18
            ],
            "wrappedDecimals": [
                6,
                8,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },

        {
            "id": "factory-stable-ng-43",
            "name": "PayPool",
            "address": "0x383e6b4437b59fff47b619cba855ca29342a8559",
            "lpToken": "0x383e6b4437b59fff47b619cba855ca29342a8559",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "PYUSDUSDC",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "PYUSD",
                "USDC"
            ],
            "wrappedCoins": [
                "PYUSD",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                6,
                6
            ],
            "wrappedDecimals": [
                6,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-147",
            "name": "alUSDFRAXBP",
            "address": "0xb30da2376f63de30b42dc055c93fa474f31330a5",
            "lpToken": "0xb30da2376f63de30b42dc055c93fa474f31330a5",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "alUSDFRAXB3CRV-f",
            "poolType": POOL_TYPE.META,
            "basePoolType": BASEPOOL_TYPE.FRAXUSDC,
            "disableDepositUnderlying": true,
            "isLegacy": 1,
            "isPlain": false,
            "isLending": false,
            "isMeta": true,
            "isCrypto": false,
            "underlyingCoins": [
                "alUSD",
                "FRAX",
                "USDC"
            ],
            "wrappedCoins": [
                "alUSD",
                "FRAXBP"
            ],
            "underlyingAddresses": [
                "0xbc6da0fe9ad5f3b0d58160288917aa56653660e9",
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0xbc6da0fe9ad5f3b0d58160288917aa56653660e9",
                "0x3175df0976dfa876431c2e9ee6bc45b65d3473cc"
            ],
            "underlyingDecimals": [
                18,
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "frxeth",
            "name": "frxeth",
            "address": "0xa1f8a6807c402e4a15ef4eba36528a3fed24e577",
            "lpToken": "0xf43211935c781d5ca1a41d2041f397b8a7366c7a",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "frxETHCRV",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "frxETH"
            ],
            "wrappedCoins": [
                "ETH",
                "frxETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e8422345238f34275888049021821e8e08caa1f"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-0",
            "name": "TricryptoUSDC",
            "address": "0x7f86bf177dd4f3494b841a37e810a34dd56c829b",
            "lpToken": "0x7f86bf177dd4f3494b841a37e810a34dd56c829b",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDCWBTCWETH",
            "isLegacy": 4,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "USDC",
                "WBTC",
                "ETH"
            ],
            "wrappedCoins": [
                "USDC",
                "WBTC",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ],
            "wrappedAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                6,
                8,
                18
            ],
            "wrappedDecimals": [
                6,
                8,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-v2-283",
            "name": "cvxCrv/Crv",
            "address": "0x971add32ea87f10bd192671630be3be8a11b8623",
            "lpToken": "0x971add32ea87f10bd192671630be3be8a11b8623",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "cvxcrv-crv-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "CRV",
                "cvxCRV"
            ],
            "wrappedCoins": [
                "CRV",
                "cvxCRV"
            ],
            "underlyingAddresses": [
                "0xd533a949740bb3306d119cc777fa900ba034cd52",
                "0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7"
            ],
            "wrappedAddresses": [
                "0xd533a949740bb3306d119cc777fa900ba034cd52",
                "0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crypto-320",
            "name": "ETHx-wstETH",
            "address": "0x14756a5ed229265f86990e749285bdd39fe0334f",
            "lpToken": "0xfffae954601cff1195a8e20342db7ee66d56436b",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "ETHxwstETH-f",
            "isLegacy": 12,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "wstETH",
                "ETHx"
            ],
            "wrappedCoins": [
                "wstETH",
                "ETHx"
            ],
            "underlyingAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xa35b1b31ce002fbf2058d22f30f95d405200a15b"
            ],
            "wrappedAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xa35b1b31ce002fbf2058d22f30f95d405200a15b"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-17",
            "name": "mkUSD-USDC",
            "address": "0xf980b4a4194694913af231de69ab4593f5e0fcdc",
            "lpToken": "0xf980b4a4194694913af231de69ab4593f5e0fcdc",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "mkUSDUSDC",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "mkUSD",
                "USDC"
            ],
            "wrappedCoins": [
                "mkUSD",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-17",
            "name": "mkUSD/crvUSD",
            "address": "0x3de254a0f838a844f727fee81040e0fa7884b935",
            "lpToken": "0x3de254a0f838a844f727fee81040e0fa7884b935",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "mkcrvUSD-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "mkUSD",
                "crvUSD"
            ],
            "wrappedCoins": [
                "mkUSD",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ],
        },
        {
            "id": "factory-stable-ng-33",
            "name": "FRAXFPI",
            "address": "0x2cf99a343e4ecf49623e82f2ec6a9b62e16ff3fe",
            "lpToken": "0x2cf99a343e4ecf49623e82f2ec6a9b62e16ff3fe",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "FRAXFPI",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "FRAX",
                "FPI"
            ],
            "wrappedCoins": [
                "FRAX",
                "FPI"
            ],
            "underlyingAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x5ca135cb8527d76e932f34b5145575f9d8cbe08e"
            ],
            "wrappedAddresses": [
                "0x853d955acef822db058eb8505911ed77f175b99e",
                "0x5ca135cb8527d76e932f34b5145575f9d8cbe08e"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },

        {
            "id": "factory-stable-ng-12",
            "name": "USDe-USDC",
            "address": "0x02950460e2b9529d0e00284a5fa2d7bdf3fa4d72",
            "lpToken": "0x02950460e2b9529d0e00284a5fa2d7bdf3fa4d72",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "USDeUSDC",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDe",
                "USDC"
            ],
            "wrappedCoins": [
                "USDe",
                "USDC"
            ],
            "underlyingAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "wrappedAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            ],
            "underlyingDecimals": [
                18,
                6
            ],
            "wrappedDecimals": [
                18,
                6
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crypto-91",
            "name": "cbETH/ETH",
            "address": "0x5fae7e604fc3e24fd43a72867cebac94c65b404a",
            "lpToken": "0x5b6c539b224014a09b3388e51caaa8e354c959c8",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "cbETH/ETH-f",
            "isLegacy": 12,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "ETH",
                "cbETH"
            ],
            "wrappedCoins": [
                "WETH",
                "cbETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xbe9895146f7af43049ca1c1ae358b0541ea49704"
            ],
            "wrappedAddresses": [
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0xbe9895146f7af43049ca1c1ae358b0541ea49704"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-1",
            "name": "crvUSD/USDT",
            "address": "0x390f3595bca2df7d23783dfd126427cceb997bf4",
            "lpToken": "0x390f3595bca2df7d23783dfd126427cceb997bf4",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDUSDT-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDT",
                "crvUSD"
            ],
            "wrappedCoins": [
                "USDT",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                6,
                18
            ],
            "wrappedDecimals": [
                6,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "lusd",
            "name": "lusd",
            "address": "0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca",
            "lpToken": "0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "LUSD3CRV-f",
            "poolType": POOL_TYPE.META,
            "basePoolType": BASEPOOL_TYPE["3POOL"],
            "isLegacy": 1,
            "isPlain": false,
            "isLending": false,
            "isMeta": true,
            "isCrypto": false,
            "underlyingCoins": [
                "LUSD",
                "DAI",
                "USDC",
                "USDT"
            ],
            "wrappedCoins": [
                "LUSD",
                "3Crv"
            ],
            "underlyingAddresses": [
                "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "wrappedAddresses": [
                "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
                "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490"
            ],
            "underlyingDecimals": [
                18,
                18,
                6,
                6
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-4",
            "name": "TriCRV",
            "address": "0x4ebdf703948ddcea3b11f675b4d1fba9d2414a14",
            "lpToken": "0x4ebdf703948ddcea3b11f675b4d1fba9d2414a14",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDETHCRV",
            "isLegacy": 4,
            "isPlain": false,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "crvUSD",
                "ETH",
                "CRV"
            ],
            "wrappedCoins": [
                "crvUSD",
                "WETH",
                "CRV"
            ],
            "underlyingAddresses": [
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e",
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0xd533a949740bb3306d119cc777fa900ba034cd52"
            ],
            "wrappedAddresses": [
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "0xd533a949740bb3306d119cc777fa900ba034cd52"
            ],
            "underlyingDecimals": [
                18,
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-crvusd-0",
            "name": "crvUSD/USDC",
            "address": "0x4dece678ceceb27446b35c672dc7d61f30bad69e",
            "lpToken": "0x4dece678ceceb27446b35c672dc7d61f30bad69e",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvUSDUSDC-f",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDC",
                "crvUSD"
            ],
            "wrappedCoins": [
                "USDC",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                6,
                18
            ],
            "wrappedDecimals": [
                6,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-tricrypto-14",
            "name": "TryLSD",
            "address": "0x2570f1bd5d2735314fc102eb12fc1afe9e6e7193",
            "lpToken": "0x2570f1bd5d2735314fc102eb12fc1afe9e6e7193",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "TryLSD",
            "isLegacy": 4,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": true,
            "underlyingCoins": [
                "wstETH",
                "rETH",
                "sfrxETH"
            ],
            "wrappedCoins": [
                "wstETH",
                "rETH",
                "sfrxETH"
            ],
            "underlyingAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xae78736cd615f374d3085123a210448e74fc6393",
                "0xac3e018457b222d93114458476f3e3416abbe38f"
            ],
            "wrappedAddresses": [
                "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
                "0xae78736cd615f374d3085123a210448e74fc6393",
                "0xac3e018457b222d93114458476f3e3416abbe38f"
            ],
            "underlyingDecimals": [
                18,
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-68",
            "name": "mkUSDUSDe",
            "address": "0x1ab3d612ea7df26117554dddd379764ebce1a5ad",
            "lpToken": "0x1ab3d612ea7df26117554dddd379764ebce1a5ad",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "mkUSDUSDe",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "mkUSD",
                "USDe"
            ],
            "wrappedCoins": [
                "mkUSD",
                "USDe"
            ],
            "underlyingAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3"
            ],
            "wrappedAddresses": [
                "0x4591dbff62656e7859afe5e45f6f47d3669fbb28",
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-22",
            "name": "weETH/WETH",
            "address": "0x13947303f63b363876868d070f14dc865c36463b",
            "lpToken": "0x13947303f63b363876868d070f14dc865c36463b",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "weETH-WETH",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "weETH",
                "WETH"
            ],
            "wrappedCoins": [
                "weETH",
                "WETH"
            ],
            "underlyingAddresses": [
                "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "wrappedAddresses": [
                "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-stable-ng-11",
            "name": "USDe-crvUSD",
            "address": "0xf55b0f6f2da5ffddb104b58a60f2862745960442",
            "lpToken": "0xf55b0f6f2da5ffddb104b58a60f2862745960442",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "USDecrvUSD",
            "poolType": POOL_TYPE.FSN,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "USDe",
                "crvUSD"
            ],
            "wrappedCoins": [
                "USDe",
                "crvUSD"
            ],
            "underlyingAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "wrappedAddresses": [
                "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
                "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "susd",
            "name": "susd",
            "address": "0xa5407eae9ba41422680e2e00537571bcc53efbfd",
            "lpToken": "0xc25a3a3b969415c80451098fa907ec722572917f",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "crvPlain3andSUSD",
            "isLegacy": 2,
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "disableWithdrawOneCoin": true,
            "underlyingCoins": [
                "DAI",
                "USDC",
                "USDT",
                "sUSD"
            ],
            "wrappedCoins": [
                "DAI",
                "USDC",
                "USDT",
                "sUSD"
            ],
            "underlyingAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x57ab1ec28d129707052df4df418d58a2d46d5f51"
            ],
            "wrappedAddresses": [
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "0x57ab1ec28d129707052df4df418d58a2d46d5f51"
            ],
            "underlyingDecimals": [
                18,
                6,
                6,
                18
            ],
            "wrappedDecimals": [
                18,
                6,
                6,
                18
            ],
            "useLending": [
                false,
                false,
                false,
                false
            ]
        },
        {
            "id": "seth",
            "name": "seth",
            "address": "0xc5424b857f758e906013f3555dad202e4bdb4567",
            "lpToken": "0xa3d87fffce63b53e0d54faa1cc983b7eb0b74a9c",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "eCRV",
            "isPlain": true,
            "isLending": false,
            "isMeta": false,
            "isCrypto": false,
            "underlyingCoins": [
                "ETH",
                "sETH"
            ],
            "wrappedCoins": [
                "ETH",
                "sETH"
            ],
            "underlyingAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb"
            ],
            "wrappedAddresses": [
                "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb"
            ],
            "underlyingDecimals": [
                18,
                18
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false
            ]
        },
        {
            "id": "factory-v2-336",
            "name": "eUSD/3CRV",
            "address": "0x2673099769201c08e9a5e63b25fbaf25541a6557",
            "lpToken": "0x2673099769201c08e9a5e63b25fbaf25541a6557",
            "lpTokenDecimal": 18,
            "lpTokenSymbol": "eUSD3CRV3CRV-f",
            "poolType": POOL_TYPE.META,
            "basePoolType": BASEPOOL_TYPE["3POOL"],
            "isPlain": false,
            "isLending": false,
            "isMeta": true,
            "isCrypto": false,
            "underlyingCoins": [
                "eUSD",
                "DAI",
                "USDC",
                "USDT"
            ],
            "wrappedCoins": [
                "eUSD",
                "3Crv"
            ],
            "underlyingAddresses": [
                "0xdf3ac4f479375802a821f7b7b46cd7eb5e4262cc",
                "0x6b175474e89094c44da98b954eedeac495271d0f",
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "0xdac17f958d2ee523a2206206994597c13d831ec7"
            ],
            "wrappedAddresses": [
                "0xdf3ac4f479375802a821f7b7b46cd7eb5e4262cc",
                "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490"
            ],
            "underlyingDecimals": [
                18,
                18,
                6,
                6
            ],
            "wrappedDecimals": [
                18,
                18
            ],
            "useLending": [
                false,
                false,
                false,
                false
            ]
        },
    ],
}