<?php

$baseUrl = '';


$pageTypeMap = array(
    '/' => 'home',
);

$routes = array(
    "/" => "/dist/src/views/User.js",
    "/demo/twoPage"=>"/dist/src/views/User.js",
    "/demo/onePage"=>"/dist/src/views/User.js",
    "/trade/twoPage"=>"/dist/src/views/Trade.js",
    "/trade/onePage"=>"/dist/src/views/Trade.js",
);


$pageType = 'admin';
$isRouteHit = false;
foreach ($routes as $route => $path) {
    if (isRoute($route)) {
        $jsFile = $path;
        $isRouteHit = true;

        if (!empty($pageTypeMap[$route])) {
            $pageType = $pageTypeMap[$route];
        }

        break;
    }
}

if (!$isRouteHit) {
    echo '页面不存在~';
    die;
}

function isRoute($str) {
    $route = $_SERVER['REQUEST_URI'];
    $routeReg = str_replace('/', '\\/', $str);
    $routeReg = str_replace('?', '\\?', $routeReg);
    return preg_match("/^" . $routeReg . "\/?((\?|#).+)?$/i", $route);
}
