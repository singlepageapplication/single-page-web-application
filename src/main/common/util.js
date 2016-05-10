/**
    小店商家后台工具函数集合

    Lists:
    - [获取连接参数值] getQueryString
    - [时间戳格式化] formatDate
    - [根据url返回相应的id] urltoid
    - [根据id返回相应的url] idtourl
    - [...] base_convert

 */

;(function(){
    function loadScript(url, callback){
        var scriptEle = document.createElement("script");
        scriptEle.async = true;
        scriptEle.src = url;
        scriptEle.charset = 'utf-8';
        (document.head || document.documentElement).appendChild(scriptEle);
        scriptEle.onload = scriptEle.onreadystatechange = function(){
            if('undefined' === typeof scriptEle.readyState || 'loaded' === scriptEle.readyState || 'complete' === scriptEle.readyState){
                try{
                    callback && callback();
                }finally{
                    scriptEle.onload = scriptEle.onreadystatechange = null;
                    scriptEle = null;
                }
            }
        }
    }
    function showPage(url, data, title, isBack) {
        var router = XX.router[url] || XX.router["/demo/onePage"];
        if (XX.allPage[router.name]) {
            callBack(router, data, title);
            return;
        }

        var loading = document.getElementById('loading');

        loading && (loading.style.display = '');
        loadScript(router.path, callBack);
        function callBack(){
            var J_Page = document.getElementById('J_Page');
            React.render(
                React.createElement(XX.allPage[router.name], data),
                J_Page
            );
            router.showEffect && (J_Page.className = router.showEffect);
            loading && (loading.style.display = 'none');

            if(window.history.pushState){
                !isBack && window.history.pushState({title:title, url: url, data: data}, title, location.origin + url);
            }else{
                location.href = location.host + url;
            }
            document.title=title;

            window.onpopstate = function(e) {
                if (history.state){
                    var url = e.state.url;
                    console.log(url + e.state.title + e.state.data);
                    XX.showPage(url, e.state.data, e.state.title, true);
                    //根据url值进行相应操作
                }
            };
        }
    }
    XX.showPage = showPage;
    XX.allPage = {}
})();

XX.Util = (function(){
    function urlParamToJson(params) {
        var search = params || window.location.search.substring(1);
        return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
            function (key, value) {
                return key === "" ? value : decodeURIComponent(value)
            }) : {}
    }
    /**
     * @desc 获取链接参数的值
     * @param  {string} name 参数名字
     * @param  {string} [url] 链接url，为空的时候取location.href
     * @return {string} 参数
     */
    function getQueryString(name, url) {
        url = (url == null) ? window.location.href : url;
        url = url.split('#')[0];

        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        return reg.test(url) ? RegExp.$2.replace(/\+/g, " ") : '';
    }

    function addUrlParam(oriUrl, strParamName, strParamValue) {
        var addParam = [strParamName, strParamValue].join('=');
        var reg = /(\?|\#)/;
        var rule = {
            '?': ('?' + addParam + '&'),
            '#': ('?' + addParam + '#'),
            'default': ('?' + addParam)
        };

        if (reg.test(oriUrl)) {
            return oriUrl.replace(reg, function (m, n) {
                return rule[n];
            });
        }
        return oriUrl + rule['default'];
    }
    function formatDate(format, timestamp) {
        /**
         * example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
         * returns 1: '09:09:40 m is month'
         * example 2: date('F j, Y, g:i a', 1062462400);
         * returns 2: 'September 2, 2003, 2:26 am'
         * example 3: date('Y W o', 1062462400);
         * returns 3: '2003 36 2003'
         * example 4: x = date('Y m d', (new Date()).getTime()/1000);
         * example 4: (x+'').length == 10 // 2009 01 09
         * returns 4: true
         * example 5: date('W', 1104534000);
         * returns 5: '53'
         * example 6: date('B t', 1104534000);
         * returns 6: '999 31'
         * example 7: date('W U', 1293750000.82); // 2010-12-31
         * returns 7: '52 1293750000'
         * example 8: date('W', 1293836400); // 2011-01-01
         * returns 8: '52'
         * example 9: date('W Y-m-d', 1293974054); // 2011-01-02
         * returns 9: '52 2011-01-02'
         **/

        var that = this;
        var jsdate, f;
        // Keep this here (works, but for code commented-out below for file size reasons)
        // var tal= [];
        var txt_words = [
            'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        // trailing backslash -> (dropped)
        // a backslash followed by any character (including backslash) -> the character
        // empty string -> empty string
        var formatChr = /\\?(.?)/gi;
        var formatChrCb = function(t, s) {
            return f[t] ? f[t]() : s;
        };
        var _pad = function(n, c) {
            n = String(n);
            while (n.length < c) {
                n = '0' + n;
            }
            return n;
        };
        f = {
            // Day
            d: function() {
                // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },
            D: function() {
                // Shorthand day name; Mon...Sun
                return f.l()
                    .slice(0, 3);
            },
            j: function() {
                // Day of month; 1..31
                return jsdate.getDate();
            },
            l: function() {
                // Full day name; Monday...Sunday
                return txt_words[f.w()] + 'day';
            },
            N: function() {
                // ISO-8601 day of week; 1[Mon]..7[Sun]
                return f.w() || 7;
            },
            S: function() {
                // Ordinal suffix for day of month; st, nd, rd, th
                var j = f.j();
                var i = j % 10;
                if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                    i = 0;
                }
                return ['st', 'nd', 'rd'][i - 1] || 'th';
            },
            w: function() {
                // Day of week; 0[Sun]..6[Sat]
                return jsdate.getDay();
            },
            z: function() {
                // Day of year; 0..365
                var a = new Date(f.Y(), f.n() - 1, f.j());
                var b = new Date(f.Y(), 0, 1);
                return Math.round((a - b) / 864e5);
            },

            // Week
            W: function() {
                // ISO-8601 week number
                var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                var b = new Date(a.getFullYear(), 0, 4);
                return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
            },

            // Month
            F: function() {
                // Full month name; January...December
                return txt_words[6 + f.n()];
            },
            m: function() {
                // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },
            M: function() {
                // Shorthand month name; Jan...Dec
                return f.F()
                    .slice(0, 3);
            },
            n: function() {
                // Month; 1...12
                return jsdate.getMonth() + 1;
            },
            t: function() {
                // Days in month; 28...31
                return (new Date(f.Y(), f.n(), 0))
                    .getDate();
            },

            // Year
            L: function() {
                // Is leap year?; 0 or 1
                var j = f.Y();
                return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
            },
            o: function() {
                // ISO-8601 year
                var n = f.n();
                var W = f.W();
                var Y = f.Y();
                return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
            },
            Y: function() {
                // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },
            y: function() {
                // Last two digits of year; 00...99
                return f.Y()
                    .toString()
                    .slice(-2);
            },

            // Time
            a: function() {
                // am or pm
                return jsdate.getHours() > 11 ? 'pm' : 'am';
            },
            A: function() {
                // AM or PM
                return f.a()
                    .toUpperCase();
            },
            B: function() {
                // Swatch Internet time; 000..999
                var H = jsdate.getUTCHours() * 36e2;
                // Hours
                var i = jsdate.getUTCMinutes() * 60;
                // Minutes
                // Seconds
                var s = jsdate.getUTCSeconds();
                return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
            },
            g: function() {
                // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            G: function() {
                // 24-Hours; 0..23
                return jsdate.getHours();
            },
            h: function() {
                // 12-Hours w/leading 0; 01..12
                return _pad(f.g(), 2);
            },
            H: function() {
                // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            i: function() {
                // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function() {
                // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            },
            u: function() {
                // Microseconds; 000000-999000
                return _pad(jsdate.getMilliseconds() * 1000, 6);
            },

            // Timezone
            e: function() {
                // Timezone identifier; e.g. Atlantic/Azores, ...
                // The following works, but requires inclusion of the very large
                // timezone_abbreviations_list() function.
                /*              return that.date_default_timezone_get();
                 */
                throw 'Not supported (see source code of date() for timezone on how to add support)';
            },
            I: function() {
                // DST observed?; 0 or 1
                // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                // If they are not equal, then DST is observed.
                var a = new Date(f.Y(), 0);
                // Jan 1
                var c = Date.UTC(f.Y(), 0);
                // Jan 1 UTC
                var b = new Date(f.Y(), 6);
                // Jul 1
                // Jul 1 UTC
                var d = Date.UTC(f.Y(), 6);
                return ((a - c) !== (b - d)) ? 1 : 0;
            },
            O: function() {
                // Difference to GMT in hour format; e.g. +0200
                var tzo = jsdate.getTimezoneOffset();
                var a = Math.abs(tzo);
                return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
            },
            P: function() {
                // Difference to GMT w/colon; e.g. +02:00
                var O = f.O();
                return (O.substr(0, 3) + ':' + O.substr(3, 2));
            },
            T: function() {
                // Timezone abbreviation; e.g. EST, MDT, ...
                // The following works, but requires inclusion of the very
                // large timezone_abbreviations_list() function.
                /*              var abbr, i, os, _default;
                 if (!tal.length) {
                 tal = that.timezone_abbreviations_list();
                 }
                 if (that.php_js && that.php_js.default_timezone) {
                 _default = that.php_js.default_timezone;
                 for (abbr in tal) {
                 for (i = 0; i < tal[abbr].length; i++) {
                 if (tal[abbr][i].timezone_id === _default) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 }
                 for (abbr in tal) {
                 for (i = 0; i < tal[abbr].length; i++) {
                 os = -jsdate.getTimezoneOffset() * 60;
                 if (tal[abbr][i].offset === os) {
                 return abbr.toUpperCase();
                 }
                 }
                 }
                 */
                return 'UTC';
            },
            Z: function() {
                // Timezone offset in seconds (-43200...50400)
                return -jsdate.getTimezoneOffset() * 60;
            },

            // Full Date/Time
            c: function() {
                // ISO-8601 date.
                return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
            },
            r: function() {
                // RFC 2822
                return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
            },
            U: function() {
                // Seconds since UNIX epoch
                return jsdate / 1000 | 0;
            }
        };
        this.date = function(format, timestamp) {
            that = this;
            jsdate = (timestamp === undefined ? new Date() : // Not provided
                    (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                        new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
            );
            return format.replace(formatChr, formatChrCb);
        };
        return this.date(format, timestamp);
    }
    return {
        urlParamToJson: urlParamToJson,
        getQueryString: getQueryString,
        addUrlParam: addUrlParam,
        formatDate: formatDate
    }
})();

