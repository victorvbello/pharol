const algoliasearch = require('algoliasearch');
const cassandra = require('cassandra-driver');

var authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');

module.exports = {
    "SecretJWT":"$#MyS0ngsapl1cati0n#$",
    "clientAlgolia": algoliasearch('KZ0G67NYY2', '188236dee0a09cfd810881ebb3cec8db'),
    "cassandra":cassandra,
    "clientCassandra":new cassandra.Client({ contactPoints: ['127.0.0.1'], authProvider: authProvider , keyspace: 'mysongs' })
};