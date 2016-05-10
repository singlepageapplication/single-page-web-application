/**
 * Created by Administrator
 */
var twoPage = React.createClass({
    getInitialState: function(){
        document.title = '第二页-测试 ';
        return {
        };
    },
    componentDidMount: function(){ //页面渲染后
    },
    changePage:function(){
        XX.showPage("/demo/onePage", {name:"onePage"}, "第yi页");
    },
    componentWillUnmount: function(){
        console.log("页面被关闭" + this.props.name);
    },
    render: function(){
        return <div>
            <div id="slide" onClick={this.changePage}>
                页面切换
            </div>
            <Link to={{ pathName:"/demo/onePage", query: {name:"onePage"}, title: "第er页"}}>link</Link>
            <div><Link to={{ pathName:"/trade/onePage", query: {name:"onePage"}, title: "第yi页"}}>转trade</Link></div>
        </div>
    }
});

module.exports = twoPage;

