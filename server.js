var apiServer = require('express-api-server');
 
var options = {
    baseUrlPath: '/',
    cors: {}
};
 
var initRoutes = function(app, options) {
    // Set up routes off of base URL path 
    app.use(options.baseUrlPath, [
        require('./routes')
    ]);
};
 
apiServer.start(initRoutes, options);