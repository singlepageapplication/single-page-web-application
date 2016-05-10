<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="apple-mobile-web-app-title" content="demo">
        <meta name="format-detection" content="telephone=no">
        <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
        <title>demo</title>

        <?php include_once('./my_route.php'); ?>
        <link href="/dist/min/css/style.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
    <script>
        ! function() {
            function a() {
                var clientWidth = document.documentElement.clientWidth > 750 ? 750 : document.documentElement.clientWidth;
                document.documentElement.style.fontSize = clientWidth / 7.5 + "px";
            }
            var b = null;
            window.addEventListener("resize", function() {
                clearTimeout(b), b = setTimeout(a, 300)
            }, !1), a()
        }(window);
    </script>

    <div class="Page">
        <div id = "J_Page"></div>
    </div>
    <div id='loading' style="display:none">正在加载</div>
    <script src="/app/zepto.js"></script>
    <script src="/app/react-with-addons.min.js"></script>
    <script src="/dist/src/main.js"></script>

    <script src="<?php echo $jsFile;?>"></script>



    </body>
</html>
