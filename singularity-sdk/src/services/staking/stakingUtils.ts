import { DarkPool } from "../../darkpool";
import { Token } from "../../entities";
import { isAddressEquals } from "../../utils/util";



export async function getZkTokenFromOriginalToken(
    darkPool: DarkPool,
    originalToken: string,
): Promise<Token | undefined> {
    const config = darkPool.stakingConfigs.find((config) => isAddressEquals(config.originalToken.address, originalToken));
    return config ? config.stakingToken : undefined;
}

export async function getOriginalTokenFromZkToken(
    darkPool: DarkPool,
    zkToken: string,
): Promise<Token | undefined> {
    const config = darkPool.stakingConfigs.find((config) => isAddressEquals(config.stakingToken.address, zkToken));
    return config ? config.originalToken : undefined;
}