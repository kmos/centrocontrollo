var nodes = [
{
  _id: "0",
  address: "0",
  connected: false,
  sensors: [],
},
{
  _id: "1",
  address: "1",
  connected: false,
  sensors: [],
},
{
  _id: "2",
  address: "2",
  connected: false,
  sensors: [],
},
{
  _id: "3",
  address: "3",
  connected: false,
  sensors: [],
},
{
  _id: "4",
  address: "4",
  connected: false,
  sensors: [],
},
];

// Add 4 sensors in each node
nodes = nodes.map(function(node) {
  node.sensors = [
  {
    _id: "0",
    klass: "Temperature",
    priority: 0,
    alarm: true,
    lowThreshold: 10,
    highThreshold: 100,
    periodMs: 1000,
    measurements: [],
  },
  {
    _id: "1",
    klass: "Temperature",
    priority: 0,
    alarm: true,
    lowThreshold: 10,
    highThreshold: 100,
    periodMs: 1000,
    measurements: [],
  },
  {
    _id: "2",
    klass: "Temperature",
    priority: 0,
    alarm: true,
    lowThreshold: 10,
    highThreshold: 100,
    periodMs: 1000,
    measurements: [],
  },
  {
    _id: "3",
    klass: "Temperature",
    priority: 0,
    alarm: true,
    lowThreshold: 10,
    highThreshold: 100,
    periodMs: 1000,
    measurements: [],
  },
  {
    _id: "4",
    klass: "Temperature",
    priority: 0,
    alarm: true,
    lowThreshold: 10,
    highThreshold: 100,
    periodMs: 1000,
    measurements: [],
  },
  ];

  return node;
});

db.dropDatabase();

db.nodes.insert(nodes);
