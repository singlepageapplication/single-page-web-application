/**
 * Created by Administrator
 */

//var GradeScore = require('./gradeScore.jsx'); //星级评价
//var GradeBase = require('module_path/baseView.jsx');


var trade1Page = React.createClass({
    //mixins: [Base],
    getDefaultProps: function(){
        //console.log("getDefaultProps");
        return {
            clickNum: 0
        }
    },
    getInitialState: function(){
        //console.log("getInitialState");
        //document.title = '首页-测试 ';
        return {
            clickNum: this.props.clickNum
        };
    },
    componentWillMount: function(){//初始化数据后，页面渲染前
        //console.log("componentWillMount");
    },
    componentWillUnmount: function(){
        console.log("页面被关闭" + this.props.name);
    },
    componentDidMount: function(){ //页面渲染后

    },
    componentWillReceiveProps: function(object, nextProps){
        //console.log("componentWillReceiveProps");
    },
    shouldComponentUpdate: function(props,state){ //条件渲染逻辑 参数1 props，参数2改变后的state 。  返回false 不渲染
        //if(props.clickNum == state.c){
        //    return false;
        //}
        //console.log("shouldComponentUpdate");
        return true;
    },
    componentWillUpdate: function(){//state改变的时候执行的操作
        //console.log("componentWillUpdate");
        return true;
    },
    componentDidUpdate: function(){//组件已经更新到页面后 该方法不会在初始化渲染的时候调用
        //console.log("componentDidUpdate");
    },
    click: function(){//组件已经更新到页面后 该方法不会在初始化渲染的时候调用
        //console.log("click");
        //$.get("http://www.xiaodian.com/pcx/item/list?goodsName=&goodsCode=&gallerySearchOptions=0&_ajax=1&type=1&page=1", function(result) {
        //    console.log(result);
        //}.bind(this));
        this.setState({
            clickNum: this.state.clickNum +1
        });
    },
    changePage: function(event){
        //$("#J_Page").on("click", ".slide", function(){
        XX.showPage("/trade/twoPage", {name:"twoPage"}, "第er页");
        //}.bind(this))
    },
    render: function(){
        //console.log("render" + this.state.clickNum);
        return <div>
            <div className="slide" >
                交易模块－one
            </div>
            <div className="change" onClick={this.changePage} style={{cursor:'pointer'}}>
                页面切换
            </div>
            <Link to={{ pathName: "/trade/twoPage", query: {name:"twoPage"}, title: "第二页"}} style={{ color: "red" }} className="link">Link-test</Link>
        </div>
    }
});
module.exports = trade1Page;
