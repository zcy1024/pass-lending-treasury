import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { network, networkConfig } from "@/configs/networkConfig";
import { UserInfoType } from "@/store/modules/leaderboard";

async function getParentID(client: SuiClient) {
    const res = (await client.getObject({
        id: networkConfig[network].variables.Leaderboard.InfoList,
        options: {
            showContent: true
        }
    })) as unknown as {
        data: {
            content: {
                fields: {
                    list: {
                        fields: {
                            id: {
                                id: string
                            }
                        }
                    }
                }
            }
        }
    };
    return res.data.content.fields.list.fields.id.id;
}

async function getInfo(client: SuiClient, id: string, cursor: string | null | undefined, user: string): Promise<UserInfoType> {
    const res = await client.getDynamicFields({
        parentId: id,
        cursor
    });
    // TODO: filter real data
    console.log(res.data);
    return res.hasNextPage ? await getInfo(client, id, res.nextCursor, user) : {
        hadInviter: false,
        code: "",
        invited: 0,
        reward: 0,
        points: 0
    } as UserInfoType;
}

export default async function getUserInfo(user: string) {
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const id = await getParentID(client);
    return await getInfo(client, id, null, user);
}