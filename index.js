/**
 * Create and bind secured sessions.
 * Author : Brandon Laurence Clark
 * License: MIT
 */

var fs = require('fs');
var uuid = require('node-uuid');
var session = require('express-session');

module.exports.create = function(){
	// Session create
	var hour = 3600000;
	
	return session({ 
		genid: function() {
			  return uuid.v4();
		},
		secret: 'secret key',
		cookie: { secure:  true,
				  expires: new Date(Date.now() + hour),
				  maxAge:  hour 
		},
		saveUninitialized: true,
	    resave: true
	});
};

module.exports.register = function(req, res, next){
	if(!req.session.user){
		var sess = req.session;
		sess.user = {credentials: {type:  'guest'}, 
				     detail:      {first: 'Guest', 
				    	           last:  'User'}
			         };
	}
	return next();
};
	
module.exports.options = function(){
	return {
		key:  fs.readFileSync('/opt/ssl/key.pem'),
		cert: fs.readFileSync('/opt/ssl/certificate.pem'),
		requestCert: true
	};
}; 

module.exports.port = function(){
	return process.env.PORT || 443;
};

// Destroy registered user session.
module.exports.destroy = function(sess, cb){
	sess.destroy(function(err){
		if(err){return cb(err, null);}
		
		return cb(null, 'Session Destroyed');
	});
};
