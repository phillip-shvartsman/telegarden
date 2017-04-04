var promise = require('bluebird');
var options = {
	promiseLib:promise;
};
var pgp = require('pg-promise')(options);
var connectionString = 'telegardendb.cq9i5xwztumc.us-west-2.rds.amazonaws.com:5432';
var db = pgp(connectionString);