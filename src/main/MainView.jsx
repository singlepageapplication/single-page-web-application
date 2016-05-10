window.XX = {};

//$.extend(MoGu, require('util.js'))
require('./common/util.js');
require('./common/router.jsx');
require('./common/Link.jsx');

XX.showPage(location.pathname);
