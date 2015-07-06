var nodes = [
{
  _id: "0",
  address: "A.A.A",
  connected: false,
  sensors: [],
},
{
  _id: "1",
  address: "B.B.B",
  connected: false,
  sensors: [],
},
{
  _id: "2",
  address: "C.C.C",
  connected: false,
  sensors: [],
},
{
  _id: "3",
  address: "D.D.D",
  connected: false,
  sensors: [],
},
{
  _id: "4",
  address: "E.E.E",
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
