var utils = require("./utils");
var assert = require("assert");

describe("Example", function() {
  describe("#example()", function() {
    it("should be true", function() {
      assert.equal(true, true);
    });
  });
});

var Node = require('../app/models/node');

describe("Nodes: models", function() {
  var node = {
    id: "0",
    address: "127.0.0.1",
    connected: false,
    sensors: [],
  };

  describe("#create()", function() {
    it("should create a new Node", function(done) {
      Node.create(node, function(err, createdNode) {
        assert.ifError(err);

        assert.strictEqual(createdNode.id, "0");
        assert.strictEqual(createdNode.address, "127.0.0.1");
        assert.strictEqual(createdNode.connected, false);
        assert(createdNode.sensors instanceof Array);
        assert.equal(createdNode.sensors.length, 0);

        done();
      });
    });
  });

  describe("#find()", function() {
    it("should find a Node", function(done) {
      Node.find(function(err, nodes) {
        assert.ifError(err);

        assert.equal(nodes.length, 1);
        assert.equal(nodes[0].id, node.id);
        assert.equal(nodes[0].address, node.address);
        assert.equal(nodes[0].connected, node.connected);
        assert.equal(nodes[0].sensors.length, node.sensors.length);

        done();
      });
    });
  });

  describe("#delete()", function() {
    it("should delete a Node", function(done) {
      Node.remove(node, function(err, nodes) {
        assert.ifError(err);

        Node.find(function(err, nodes) {
          assert.ifError(err);

          assert.equal(nodes.length, 0);

          done();
        });
      });
    });
  });
});
