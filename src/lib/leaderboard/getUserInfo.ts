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

async function getInfos(client: SuiClient, id: string, cursor: string | null | undefined): Promise<UserInfoType[]> {
    const res = (await client.getDynamicFields({
        parentId: id,
        cursor
    })) as unknown as {
        data: {
            name: {
                value: string
            },
            objectId: string
        }[],
        nextCursor: string | null,
        hasNextPage: boolean
    };
    const infos: UserInfoType[] = [];
    for (const i in res.data) {
        const address = res.data[i].name.value;
        const objectIdId = res.data[i].objectId;
        const ans = (await client.getObject({
            id: objectIdId,
            options: {
                showContent: true
            }
        })) as unknown as {
            data: {
                content: {
                    fields: {
                        value: {
                            fields: {
                                code: string,
                                inviter: string,
                                invited: string,
                                reward: string,
                                points: string
                            }
                        }
                    }
                }
            }
        };
        infos.push({
            address,
            hadInviter: ans.data.content.fields.value.fields.inviter !== "0x0000000000000000000000000000000000000000000000000000000000000000",
            code: ans.data.content.fields.value.fields.code,
            invited: Number(ans.data.content.fields.value.fields.invited),
            reward: Number(ans.data.content.fields.value.fields.reward),
            points: Number(ans.data.content.fields.value.fields.points)
        });
    }
    return res.hasNextPage ? infos.concat(await getInfos(client, id, res.nextCursor)) : infos;
}

export default async function getUserInfo(user: string): Promise<[UserInfoType, UserInfoType[]]> {
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const id = await getParentID(client);
    const infos = (await getInfos(client, id, null)).toSorted((a, b) => a.reward + a.points > b.reward + b.points ? -1 : 1);
    const info = infos.find(info => info.address === user);
    return [info ? info : {
        address: "",
        hadInviter: false,
        code: "",
        invited: 0,
        reward: 0,
        points: 0
    } as UserInfoType, infos];
}