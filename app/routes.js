var Node = require('./models/node');

module.exports = function(app) {
  app.get('/api/nodes', function(req, res) {
    Node.find(function(err, nodes) {
      if (err) {
        res.send(err);
      }

      res.json(nodes);
    });
  });

  app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html');
  });
};
