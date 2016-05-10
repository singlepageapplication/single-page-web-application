/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Administrator
	 */

	'use strict';

	__webpack_require__(11);

	XX.allPage.onePage = __webpack_require__(13);
	XX.allPage.twoPage = __webpack_require__(14);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function () {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(12);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/huangshouhui/workspace/WeiXin/mymogu/newDemo/node_modules/css-loader/index.js!/Users/huangshouhui/workspace/WeiXin/mymogu/newDemo/node_modules/less-loader/index.js!/Users/huangshouhui/workspace/WeiXin/mymogu/newDemo/src/views/User/css/index.less", function() {
			var newContent = require("!!/Users/huangshouhui/workspace/WeiXin/mymogu/newDemo/node_modules/css-loader/index.js!/Users/huangshouhui/workspace/WeiXin/mymogu/newDemo/node_modules/less-loader/index.js!/Users/huangshouhui/workspace/WeiXin/mymogu/newDemo/src/views/User/css/index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	exports.push([module.id, ".change {\n  height: 1rem;\n  line-height: 1rem;\n  text-align: center;\n  color: #f67b2a;\n  background-color: #adb3c2;\n}\n.link {\n  border-bottom: 1px solid #0000ff;\n}\n.link2 {\n  border-right: 1px solid #0000ff;\n}\n", ""]);

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator
	 */

	"use strict";

	var onePage = React.createClass({
	    displayName: "onePage",

	    //mixins: [Base],
	    getDefaultProps: function getDefaultProps() {
	        return {
	            clickNum: 0,
	            name: "onePage"
	        };
	    },
	    getInitialState: function getInitialState() {
	        document.title = 'onePage-测试 ';
	        return {
	            clickNum: this.props.clickNum
	        };
	        this.setState({});
	    },
	    componentWillMount: function componentWillMount() {//初始化数据后，页面渲染前
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        console.log("页面被关闭" + this.props.name);
	    },
	    componentDidMount: function componentDidMount() {//页面渲染后

	    },
	    componentWillReceiveProps: function componentWillReceiveProps(object, nextProps) {},
	    shouldComponentUpdate: function shouldComponentUpdate(props, state) {
	        //条件渲染逻辑 参数1 props，参数2改变后的state 。  返回false 不渲染
	        //if(props.clickNum == state.c){
	        //    return false;
	        //}
	        //console.log("shouldComponentUpdate");
	        return true;
	    },
	    componentWillUpdate: function componentWillUpdate() {
	        //state改变的时候执行的操作
	        return true;
	    },
	    componentDidUpdate: function componentDidUpdate() {//组件已经更新到页面后 该方法不会在初始化渲染的时候调用
	        //console.log("componentDidUpdate");
	    },
	    click: function click() {
	        //组件已经更新到页面后 该方法不会在初始化渲染的时候调用
	        //console.log("click");
	        //$.get("http://www.xiaodian.com/pcx/item/list?goodsName=&goodsCode=&gallerySearchOptions=0&_ajax=1&type=1&page=1", function(result) {
	        //    console.log(result);
	        //}.bind(this));
	        this.setState({
	            clickNum: this.state.clickNum + 1
	        });
	    },
	    changePage: function changePage(event) {
	        //$("#J_Page").on("click", ".slide", function(){
	        XX.showPage("/demo/twoPage", { name: "hahahahaha" }, "第er页");
	        //}.bind(this))
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "div",
	                { className: "slide" },
	                "第一页ye"
	            ),
	            React.createElement(
	                "div",
	                { className: "change", onClick: this.changePage, style: { cursor: 'pointer' } },
	                "页面切换"
	            ),
	            React.createElement(
	                Link,
	                { to: { pathName: "/demo/twoPage", query: { name: "twoPage" }, title: "第二页" }, style: { color: "red" }, className: "link" },
	                "页面切换-test"
	            )
	        );
	    }
	});
	module.exports = onePage;

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Created by Administrator
	 */
	"use strict";

	var twoPage = React.createClass({
	    displayName: "twoPage",

	    getInitialState: function getInitialState() {
	        document.title = '第二页-测试 ';
	        return {};
	    },
	    componentDidMount: function componentDidMount() {//页面渲染后
	    },
	    changePage: function changePage() {
	        XX.showPage("/demo/onePage", { name: "onePage" }, "第yi页");
	    },
	    componentWillUnmount: function componentWillUnmount() {
	        console.log("页面被关闭" + this.props.name);
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "div",
	                { id: "slide", onClick: this.changePage },
	                "页面切换"
	            ),
	            React.createElement(
	                Link,
	                { to: { pathName: "/demo/onePage", query: { name: "onePage" }, title: "第er页" } },
	                "link"
	            ),
	            React.createElement(
	                "div",
	                null,
	                React.createElement(
	                    Link,
	                    { to: { pathName: "/trade/onePage", query: { name: "onePage" }, title: "第yi页" } },
	                    "转trade"
	                )
	            )
	        );
	    }
	});

	module.exports = twoPage;

/***/ }
/******/ ]);