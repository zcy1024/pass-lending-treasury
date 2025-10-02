#[test_only]
module leaderboard::leaderboard_tests;

use std::unit_test::assert_eq;
use sui::test_scenario;
use leaderboard::leaderboard;

const ADMIN: address = @0x1024;
const USER: address = @0x2048;

#[test, expected_failure(abort_code = leaderboard::EAlreadyExists)]
fun repeat_create_user() {
    let mut ts = test_scenario::begin(ADMIN);
    leaderboard::init_for_test(ts.ctx());
    ts.next_tx(ADMIN);
    {
        let cap = ts.take_from_sender<leaderboard::AdminCap>();
        let mut infos = ts.take_shared<leaderboard::InfoList>();
        cap.create_user(&mut infos, USER);
        cap.create_user(&mut infos, USER);
        abort 1024
    }
}

#[test, expected_failure(abort_code = leaderboard::EOutOfBound)]
fun too_more_codes() {
    let mut ts = test_scenario::begin(ADMIN);
    leaderboard::init_for_test(ts.ctx());
    ts.next_tx(ADMIN);
    {
        let mut infos = ts.take_shared<leaderboard::InfoList>();
        infos.modify_cur_code(b"ZZZZZZ");
        infos.add_cur_code_for_test();
        abort 1024
    }
}

#[test, expected_failure(abort_code = leaderboard::EAlreadyHasInviter)]
fun repeat_set_inviter() {
    let mut ts = test_scenario::begin(ADMIN);
    leaderboard::init_for_test(ts.ctx());
    ts.next_tx(ADMIN);
    {
        let cap = ts.take_from_sender<leaderboard::AdminCap>();
        let mut infos = ts.take_shared<leaderboard::InfoList>();
        cap.create_user(&mut infos, ADMIN);
        cap.create_user(&mut infos, USER);
        cap.set_inviter(&mut infos, ADMIN, b"000001".to_string());
        cap.set_inviter(&mut infos, ADMIN, b"000001".to_string());
        abort 1024
    }
}

#[test, expected_failure(abort_code = leaderboard::ECanNotInviteSelf)]
fun invite_self() {
    let mut ts = test_scenario::begin(ADMIN);
    leaderboard::init_for_test(ts.ctx());
    ts.next_tx(ADMIN);
    {
        let cap = ts.take_from_sender<leaderboard::AdminCap>();
        let mut infos = ts.take_shared<leaderboard::InfoList>();
        cap.create_user(&mut infos, ADMIN);
        cap.set_inviter(&mut infos, ADMIN, b"000000".to_string());
        abort 1024
    }
}

#[test]
fun special_code() {
    let mut ts = test_scenario::begin(ADMIN);
    leaderboard::init_for_test(ts.ctx());
    ts.next_tx(ADMIN);
    {
        let mut infos = ts.take_shared<leaderboard::InfoList>();
        infos.modify_cur_code(b"9989Zzd");
        infos.add_cur_code_for_test();
        assert_eq!(infos.get_cur_code().to_string(), b"a989Zzd".to_string());
        infos.modify_cur_code(b"Zz99daa");
        infos.add_cur_code_for_test();
        assert_eq!(infos.get_cur_code().to_string(), b"0A99daa".to_string());
        test_scenario::return_shared(infos);
    };
    ts.end();
}

#[test]
fun complete_process() {
    let mut ts = test_scenario::begin(ADMIN);
    leaderboard::init_for_test(ts.ctx());
    ts.next_tx(ADMIN);
    {
        let cap = ts.take_from_sender<leaderboard::AdminCap>();
        let mut infos = ts.take_shared<leaderboard::InfoList>();
        // create user
        cap.create_user(&mut infos, ADMIN);
        cap.create_user(&mut infos, USER);
        // ADMIN invite USER
        cap.set_inviter(&mut infos, USER, b"000000".to_string());
        // add points
        cap.add_points(&mut infos, ADMIN, 100);
        cap.add_points(&mut infos, USER, 100);
        // check points
        let (admin_reward, admin_points) = infos.get_points(ADMIN);
        let (user_reward, user_points) = infos.get_points(USER);
        assert_eq!(admin_reward, 10);
        assert_eq!(admin_points, 100);
        assert_eq!(user_reward, 0);
        assert_eq!(user_points, 100);
        // return objects
        ts.return_to_sender(cap);
        test_scenario::return_shared(infos);
    };
    ts.end();
}