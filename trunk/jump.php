<?php
/**
 * User: macrochen
 * Time: 2017/12/1 10:23
 */

//重定向方法
function redirectTo ($url) {
    header('Location:'.$url);
}

//判断并重定向到我的域名
function redirectToMyDomain($to) {
    //域名白名单
    $domainWhiteList = array(
        '1' => 'http://www.swwyl.xyz?f=redirect',
        '2' => 'http://www.mitaomm.club?f=redirect',
        '3' => 'http://www.mitaosex.pw?f=redirect'
    );

    if (isset($domainWhiteList[$to])) {
        redirectTo($domainWhiteList[$to]);
        exit();
    }
}

//主函数，判断执行方向
function main () {
    $paramJump = 'to';

    if (isset($_GET[$paramJump])) {
        $to = $_GET[$paramJump];

        redirectToMyDomain($to);

    }
}

main();