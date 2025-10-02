module leaderboard::leaderboard;

use std::string::String;
use sui::table::{Self, Table};

// error codes
const EAlreadyExists: u64 = 0;
const EOutOfBound: u64 = 1;
const EAlreadyHasInviter: u64 = 2;
const ECanNotInviteSelf: u64 = 3;

public struct AdminCap has key {
    id: UID
}

public struct UserInfo has copy, drop, store {
    inviter: address,
    code: String,
    invited: u64,
    reward: u64,
    points: u64
}

public struct InfoList has key {
    id: UID,
    list: Table<address, UserInfo>,
    code_to_user: Table<String, address>,
    cur_code: vector<u8>
}

fun init(ctx: &mut TxContext) {
    // AdminCap
    transfer::transfer(AdminCap {
        id: object::new(ctx)
    }, ctx.sender());
    // InfoList
    transfer::share_object(InfoList {
        id: object::new(ctx),
        list: table::new<address, UserInfo>(ctx),
        code_to_user: table::new<String, address>(ctx),
        cur_code: b"000000"
    });
}

fun add_cur_code(infos: &mut InfoList, i: u64) {
    assert!(i < infos.cur_code.length(), EOutOfBound);
    let byte = infos.cur_code[i];
    if (byte == 57 || byte == 122 || byte == 90) {
        let inner = &mut infos.cur_code[i];
        *inner = if (byte == 57) 97 else if (byte == 122) 65 else 48;
        if (byte == 90) infos.add_cur_code(i + 1);
        return
    };
    let inner = &mut infos.cur_code[i];
    *inner = *inner + 1;
}

public fun create_user(_: &AdminCap, infos: &mut InfoList, user: address) {
    assert!(!infos.list.contains(user), EAlreadyExists);
    let mut temp = infos.cur_code;
    temp.reverse();
    let code = temp.to_string();
    infos.list.add(user, UserInfo {
        inviter: @0x0,
        code,
        invited: 0,
        reward: 0,
        points: 0
    });
    infos.code_to_user.add(code, user);
    infos.add_cur_code(0);
}

public fun set_inviter(_: &AdminCap, infos: &mut InfoList, user: address, code: String) {
    assert!(&infos.list[user].inviter == @0x0, EAlreadyHasInviter);
    assert!(&infos.list[user].code != code, ECanNotInviteSelf);
    let inviter = infos.code_to_user[code];
    infos.list[user].inviter = inviter;
    infos.list[inviter].invited = infos.list[inviter].invited + 1;
}

public fun add_points(_: &AdminCap, infos: &mut InfoList, user: address, points: u64) {
    infos.list[user].points = infos.list[user].points + points;
    let inviter = infos.list[user].inviter;
    if (inviter == @0x0) return;
    infos.list[inviter].reward = infos.list[inviter].reward + points / 10;
}

public fun get_cur_code(infos: &InfoList): vector<u8> {
    infos.cur_code
}

public fun get_points(infos: &InfoList, user: address): (u64, u64) {
    let info = &infos.list[user];
    (info.reward, info.points)
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(ctx);
}

#[test_only]
public fun modify_cur_code(infos: &mut InfoList, code: vector<u8>) {
    infos.cur_code = code;
}

#[test_only]
public fun add_cur_code_for_test(infos: &mut InfoList) {
    add_cur_code(infos, 0);
}