import React, { PropTypes } from 'react';

window.Link = React.createClass({
    propTypes: {
        to: PropTypes.object,
    },
    //getInitialState: function(){
    //    return {
    //        to: this.props.to,
    //    }
    //},
    submit: function(){
        XX.showPage(this.props.to.pathName, this.props.to.query, this.props.to.title);
    },
    render: function(){
        const { style, className } = this.props;

        return <a style={style} className={className} href="javascript:void(0)" onClick={this.submit}>{this.props.children}</a>
    }
});
