import { darkPool } from "../../darkpool";
import { Token } from "../../entities";
import { isAddressEquals } from "../../utils/util";



export async function getZkTokenFromOriginalToken(
    originalToken: string,
): Promise<Token | undefined> {
    console.log(darkPool.stakingConfigs)
    const config = darkPool.stakingConfigs.find((config) => isAddressEquals(config.originalToken.address, originalToken));
    return config ? config.stakingToken : undefined;
}

export async function getOriginalTokenFromZkToken(
    zkToken: string,
): Promise<Token | undefined> {
    const config = darkPool.stakingConfigs.find((config) => isAddressEquals(config.stakingToken.address, zkToken));
    return config ? config.originalToken : undefined;
}