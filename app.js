
var app = require('express')();

/** ----------------------- middleware ----------------------- **/

app.use( require('./middleware/toobusy') ); // should be first
app.use( require('./middleware/headers') );
app.use( require('./middleware/cors') );
app.use( require('./middleware/jsonp') );

/** ----------------------- sanitisers ----------------------- **/

var sanitisers = {};
sanitisers.suggest  = require('./sanitiser/suggest');
sanitisers.search   = sanitisers.suggest;
sanitisers.reverse  = require('./sanitiser/reverse');

/** ----------------------- controllers ----------------------- **/

var controllers     = {};
controllers.index   = require('./controller/index');
controllers.suggest = require('./controller/suggest');
controllers.suggest_poi = require('./controller/suggest_poi');
controllers.suggest_admin = require('./controller/suggest_admin');
controllers.search  = require('./controller/search');

/** ----------------------- routes ----------------------- **/

// api root
app.get( '/', controllers.index() );

// suggest API
app.get( '/suggest', sanitisers.suggest.middleware, controllers.suggest() );
app.get( '/suggest/poi', sanitisers.suggest.middleware, controllers.suggest_poi() );
app.get( '/suggest/admin', sanitisers.suggest.middleware, controllers.suggest_admin() );

// search API
app.get( '/search', sanitisers.search.middleware, controllers.search() );

// reverse API
app.get( '/reverse', sanitisers.reverse.middleware, controllers.search(undefined, require('./query/reverse')) );


/** ----------------------- error middleware ----------------------- **/

app.use( require('./middleware/404') );
app.use( require('./middleware/500') );

module.exports = app;