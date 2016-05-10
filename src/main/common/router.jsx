;(function(){
    var pageEffect = {
        enterRightBounce : "enter-right-bounce",
        flipLeftBounce:"flip-left-bounce",
        flipRightBounce:"flip-right-bounce",
        flipLeft : "flip-left",
        bomba   :"bomba",
        flipRight : "flip-right"
    }
    var router = {
        "/demo/onePage" : {path: "/dist/src/views/User.js", "showEffect": pageEffect.flipRight, name: "onePage"},
        "/demo/twoPage" : {path: "/dist/src/views/User.js", "showEffect": pageEffect.flipLeft, name: "twoPage"},
        "/trade/onePage" : {path: "/dist/src/views/Trade.js", "showEffect": pageEffect.flipRight, name: "trade1"},
        "/trade/twoPage" : {path: "/dist/src/views/Trade.js", "showEffect": pageEffect.flipLeft, name: "trade2"},
    }
    XX.router = router;
})();

