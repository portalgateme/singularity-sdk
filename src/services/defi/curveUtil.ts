import { CurvePoolConfig, POOL_TYPE } from "../../config/curveConfig"


export function getPoolType(pool: CurvePoolConfig, isWrapped: boolean) {
    let poolType = pool.poolType || POOL_TYPE.NORMAL

    if (poolType == POOL_TYPE.META && isWrapped) {
        poolType = POOL_TYPE.NORMAL
    }
    return poolType
}


export function getPoolFlag(pool: CurvePoolConfig, isWrapped: boolean) {
    const poolType = getPoolType(pool, isWrapped)
    if (poolType == POOL_TYPE.META) {
        return pool.basePoolType || 0
    }
    else if (poolType == POOL_TYPE.FSN) {
        return 0
    } else {
        const plainFlag = isPlainPool(pool) ? 0b100000 : 0
        const isLegacy = pool.isLegacy || 0
        return plainFlag | isLegacy
    }
}

export function isPlainPool(pool: CurvePoolConfig) {
    return pool.isPlain
}

export function getBooleanFlag(pool: CurvePoolConfig, isWrapped: boolean) {
    const poolType = getPoolType(pool, isWrapped)
    if (poolType == POOL_TYPE.META || poolType == POOL_TYPE.FSN) {
        return false
    } else {
        return !isWrapped
    }
}