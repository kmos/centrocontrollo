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
  describe("#create()", function() {
    it("should create a new Node", function(done) {
      var node = {
        id: "0",
        address: "127.0.0.1",
        connected: false,
        sensors: [],
      };

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
});
