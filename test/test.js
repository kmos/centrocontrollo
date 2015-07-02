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

describe("Node.models", function() {
  var node = {
    _id: "0",
    address: "127.0.0.1",
    connected: false,
    sensors: [ {
      _id: "0",
      klass: "Temperature",
      priority: 0,
      alarm: true,
      lowThreshold: 10,
      highThreshold: 100,
      periodMs: 1000,
      measurements: [ {
        timestamp: new Date,
        value: "7",
      }, ],
    }, ],
  };

  describe("#create()", function() {
    it("should create a new Node", function(done) {
      Node.create(node, function(err, createdNode) {
        assert.ifError(err);

        assert.strictEqual(createdNode._id, "0", "node ID is 0");
        assert.strictEqual(createdNode.address, "127.0.0.1", "node address is 127.0.0.1");
        assert.strictEqual(createdNode.connected, false, "node connected is false");
        assert.strictEqual(createdNode.sensors.length, 1, "1 sensor");
        assert.strictEqual(createdNode.sensors[0]._id, "0", "sensor ID is 0");
        assert.strictEqual(createdNode.sensors[0].klass, "Temperature", "sensor class is 'Temperature'");
        assert.strictEqual(createdNode.sensors[0].measurements.length, 1, "1 measurement");
        assert.strictEqual(createdNode.sensors[0].measurements[0].value, "7", "measurement value is 7");

        done();
      });
    });
  });

  var dbNode;

  describe("#find()", function() {
    it("should find a Node", function(done) {
      Node.find(function(err, nodes) {
        assert.ifError(err);

        assert.strictEqual(nodes.length, 1);
        assert.strictEqual(nodes[0]._id, "0", "node ID is 0");
        assert.strictEqual(nodes[0].address, "127.0.0.1", "node address is 127.0.0.1");
        assert.strictEqual(nodes[0].connected, false, "node connected is false");
        assert.strictEqual(nodes[0].sensors.length, 1, "1 sensor");
        assert.strictEqual(nodes[0].sensors[0]._id, "0", "sensor ID is 0");
        assert.strictEqual(nodes[0].sensors[0].klass, "Temperature", "sensor class is 'Temperature'");
        assert.strictEqual(nodes[0].sensors[0].measurements.length, 1, "1 measurement");
        assert.strictEqual(nodes[0].sensors[0].measurements[0].value, "7", "measurement value is 7");

        dbNode = nodes[0];

        done();
      });
    });
  });

  // TODO: Test adding a sensor
  // TODO: Test removing a sensor

  describe("#addMeasurement()", function() {
    it("should add a measurement to a node", function(done) {
      dbNode.sensors[0].measurements.push({
        timestamp: new Date,
        value: "77",
      });

      dbNode.save(function(err) {
        assert.ifError(err);

        done();
      });
    });
  });

  describe("#findAfterAddMeasurement()", function() {
    it("should find a Node with two measurements", function(done) {
      Node.find(function(err, nodes) {
        assert.ifError(err);

        assert.strictEqual(nodes.length, 1);
        assert.strictEqual(nodes[0]._id, "0", "node ID is 0");
        assert.strictEqual(nodes[0].address, "127.0.0.1", "node address is 127.0.0.1");
        assert.strictEqual(nodes[0].connected, false, "node connected is false");
        assert.strictEqual(nodes[0].sensors.length, 1, "1 sensor");
        assert.strictEqual(nodes[0].sensors[0]._id, "0", "sensor ID is 0");
        assert.strictEqual(nodes[0].sensors[0].klass, "Temperature", "sensor class is 'Temperature'");
        assert.strictEqual(nodes[0].sensors[0].measurements.length, 2, "2 measurements");
        assert.strictEqual(nodes[0].sensors[0].measurements[0].value, "7", "first measurement value is 7");
        assert.strictEqual(nodes[0].sensors[0].measurements[1].value, "77", "second measurement value is 77");

        dbNode = nodes[0];

        done();
      });
    });
  });

  describe("#removeMeasurement()", function() {
    it("should remove a measurement from node", function(done) {
      dbNode.sensors[0].measurements[1].remove();

      dbNode.save(function(err) {
        assert.ifError(err);

        done();
      });
    });
  });

  describe("#findAfterRemoveMeasurement()", function() {
    it("should find a Node with 1 measurement", function(done) {
      Node.find(function(err, nodes) {
        assert.ifError(err);

        assert.strictEqual(nodes.length, 1);
        assert.strictEqual(nodes[0]._id, "0", "node ID is 0");
        assert.strictEqual(nodes[0].address, "127.0.0.1", "node address is 127.0.0.1");
        assert.strictEqual(nodes[0].connected, false, "node connected is false");
        assert.strictEqual(nodes[0].sensors.length, 1, "1 sensor");
        assert.strictEqual(nodes[0].sensors[0]._id, "0", "sensor ID is 0");
        assert.strictEqual(nodes[0].sensors[0].klass, "Temperature", "sensor class is 'Temperature'");
        assert.strictEqual(nodes[0].sensors[0].measurements.length, 1, "1 measurement");
        assert.strictEqual(nodes[0].sensors[0].measurements[0].value, "7", "measurement value is 7");

        dbNode = nodes[0];

        done();
      });
    });
  });

  describe("#delete()", function() {
    it("should delete a Node", function(done) {
      Node.remove(dbNode, function(err, nodes) {
        assert.ifError(err);

        Node.find(function(err, nodes) {
          assert.ifError(err);

          assert.equal(nodes.length, 0, "no nodes");

          done();
        });
      });
    });
  });
});

var http = require('http');

describe("Server requests", function() {
  it("should be able to connect to the server", function(done) {
    http.get("http://localhost:8080/api/login", function(res) {
      assert.equal(res.statusCode, 200);
      done();
    }).on('error', function(e) {
      assert.ifError(e);
      done();
    });
  });
});
