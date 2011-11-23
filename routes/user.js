var redis = require('redis');
var client = redis.createClient();

// GET /users
exports.index = function(req, res) {
  index(req, res);
}

// POST /
exports.create = function(req, res) {
  create(req, res);
}

// GET /:id
exports.show = function(req, res) {
  show(req, res);
}

function index(req, res) {
  var users = [];
  client.get('nextUserId', function(err, nuid) {
    if (err) throw err;
    for (var i = 1; i <= nuid; i++) {
      client.hgetall('uid:' + i, function(err, user) {
        if (err) throw err;
        users.push(user);
      });
    }
    setTimeout(function() {
      res.json(users);
    }, 1);
  });
}

function create(req, res) {
  data = req.body;
  client.get('username:' + data.username + ':uid', function(err, uid) {
    if (uid !== null) {
      res.json ({register: false});
    }
    else {
      client.incr('nextUserId', function(err, uid) {
        var salt = auth.generateSalt();
        client.set('username:' + data.username + ':uid', uid);
        client.hmset('uid:' + uid, {
          username: data.username,
          salt: salt,
          pass: auth.hash(data.password, salt);
        }, function() {
          res.json({register: true});
        });
      });
    }
  });
}

function show(req, res) {
  res.json(req.user);
}

/*
// GET /users
exports.index = function(req, res) {
  res.write('GET /users\n');
  res.write('users index\n');
  res.end('pipe all users in db');
}

// GET /users/new
exports.new = function(req, res) {
  res.write('GET users/new\n');
  res.write('new user\n');
  res.end('get new user in db');
}

// POST /users
exports.create = function(req, res) {
  res.write('POST /users\n');
  res.write('create user\n');
  res.end('create new user in db');
}

// GET /users/:id
exports.show = function(req, res) {
  res.write('GET /users/:id\n');
  res.write('show user ' + req.params.user + '\n');
  res.end('show specific user in db');
}

// GET /users/:id/edit
exports.edit = function(req, res) {
  res.write('GET /users/:id/\n');
  res.write('edit user ' + req.params.user + '\n');
  res.end('edit specific user in db');
}

// PUT /users/:id
exports.update = function(req, res) {
  res.write('PUT /users/:id');
  res.write('update user ' + req.params.user + '\n');
  res.end('update specific user in db');
}

// DELETE /users/:id
exports.destroy = function(req, res) {
  res.write('DELETE /users/:id');
  res.write('destroy user ' + req.params.user + '\n');
  res.end('destroy specific user in db');l
}
*/