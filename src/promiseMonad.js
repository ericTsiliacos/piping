var fs   = require('fs'),
    url  = require('url'),
    http = require('http'),
    sys  = require('sys');

var Promise = require('./promise');

var pipe = function(x, functions) {
  for (var i = 0, n = functions.length; i < n; i++) {
    x = bind(x, functions[i]);
  }
  return x;
};

var unit = function(x) {
  return new Promise(x);
};

var bind = function(input, f) {
  var output = new Promise();
  input.then(function(x) {
    f(x).then(function(y) {
      output.resolve(y);
    });
  });
  return output;
};

var compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};

var lift = function(f) {
  return compose(unit, f);
};

var readFile = function(path) {
  var promise = new Promise();
  fs.readFile(path, function(err, content) {
    promise.resolve(content);
  });
  return promise;
};

var getUrl = function(json) {
  var uri = url.parse(JSON.parse(json).url);
  return new Promise(uri);
};

var httpGet = function(uri) {
  var client  = http.createClient(80, uri.hostname),
      request = client.request('GET', uri.pathname, {'Host': uri.hostname}),
      promise = new Promise();

  request.addListener('response', function(response) {
    promise.resolve(response);
  });
  request.end();
  return promise;
};

var responseBody = function(response) {
  var promise = new Promise(),
      body    = '';

  response.addListener('data', function(c) { body += c });
  response.addListener('end', function() {
    promise.resolve(body);
  });
  return promise;
};

var print = function(string) {
  return new Promise(sys.puts(string));
};

var someComputation = function(string) { return string + " added words to the incomging string" };

var moreComputation = function(string) { return string + " and more computation" };

/*
pipe(unit('urls.json'),
     [readFile,
       getUrl,
       httpGet,
       responseBody,
       print]
    );
*/

pipe(unit('cool'), [lift(someComputation), lift(moreComputation), print]);
