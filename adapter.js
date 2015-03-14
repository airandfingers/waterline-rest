/*---------------------------------------------------------------
  :: RestAdapter
  -> adapter
---------------------------------------------------------------*/
var _ = require('lodash');
var url = require('url');
var async = require('async');
var request = require('superagent');

module.exports = (function () {

  // maintains a reference to each connection that gets registered with this adapter.
  // can also store private data per-connection (useful for persistent connections).
  var connections = {};

  // retrieves a connection by its name
  var grabConnection = function(connectionName) {
    return connections[connectionName];
  };

  // makes a request to the server
  var makeRequest = function(identity, coll, method, cb, options, values) {
    var conn = grabConnection(identity);

    var http_method = conn.methods[method] || '';
    http_method = http_method.toLowerCase();
    if (! _.isFunction(request[http_method])) {
      var error = 'Invalid method: ' + http_method;
      console.error(error);
      return cb(error);
    }

    var url = conn.url; // base URL
    url += '/' + coll; // add collection name
    if (options && options.where) {
      if (options.where.id) {
        url += '/' + options.where.id;
        delete options.where.id;
      }
      else if (method === 'destroy' || method === 'update') {
        // Find all matching options.where
        makeRequest(conn, coll, 'find', function(err, results) {
          if (err) return cb(err);
          // make a request for each matches
          async.each(results, function(result, acb) {
            makeRequest(conn, coll, method, acb,
              { where: { id: result.id } }, values);
          }, cb);
        }, options);
      }

      if (method === 'find') {
        values = _.pick(options, ['where', 'skip', 'limit', 'offset']);
      }
    }

    // TODO: add caching so find calls don't always hit server
    request[http_method](url)
    .send(values)
    .end(function(request_error, response) {
      console.log('request returns', request_error, response);
      if (request_error) throw request_error;
      cb(request_error, response.body);
    });
  };

  var adapter = {
    identity: 'waterline-rest',

    syncable: false,

    // Default configuration for connections
    defaults: {
      json: true,
      url: {
        protocol: 'http',
        hostname: 'localhost',
        port: 80,
        pathname: '/'
      },
      methods: {
        create: 'post',
        find: 'get',
        update: 'put',
        destroy: 'del'
      }
    },

    // This method runs when a model is initially registered at server-start-time.
    registerConnection: function(connection, collections, cb) {
      if(!connection.identity) return cb(new Error('Connection is missing an identity.'));
      if(connections[connection.identity]) return cb(new Error('Connection is already registered.'));

      if (_.isObject(connection.url)) {
        connection.url = url.format(connection.url);
      }
      connections[connection.identity] = connection;

      cb();
    },

    create: function(conn, coll, values, cb) {
      makeRequest(conn, coll, 'create', cb, null, values);
    },

    find: function(conn, coll, options, cb) {
      makeRequest(conn, coll, 'find', cb, options);
    },

    update: function(conn, coll, options, values, cb) {
      makeRequest(conn, coll, 'update', cb, options, values);
    },

    destroy: function(conn, coll, options, cb) {
      makeRequest(conn, coll, 'destroy', cb, options);
    },
  };

  // Expose adapter definition
  return adapter;
})();