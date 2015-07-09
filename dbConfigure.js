var nodes = [
{
  _id: "AAAAAAAAAAAAAAAA",
  secretKey: "AAAAAAAAAAAAAAAAAAAAAA==",
  address: "0",
  connected: false,
  sensors: [],
},
{
  _id: "AAAAAAAAAAAAAAAB",
  secretKey: "AAAAAAAAAAAAAAAAAAAAAQ==",
  address: "1",
  connected: false,
  sensors: [],
},
{
  _id: "AAAAAAAAAAAAAAAC",
  secretKey: "AAAAAAAAAAAAAAAAAAAAAg==",
  address: "2",
  connected: false,
  sensors: [],
},
{
  _id: "AAAAAAAAAAAAAAAD",
  secretKey: "AAAAAAAAAAAAAAAAAAAAAw==",
  address: "3",
  connected: false,
  sensors: [],
},
{
  _id: "AAAAAAAAAAAAAAAE",
  secretKey: "AAAAAAAAAAAAAAAAAAAABA==",
  address: "4",
  connected: false,
  sensors: [],
},
{
  _id: "KQArAAZHMjUxODEw", // [0x29, 0x00, 0x2b, 0x00, 0x06, 0x47, 0x32, 0x35, 0x31, 0x38, 0x31, 0x30]
  secretKey: "MTIzNDU2Nzg5MTIzNDU2Nw==", // ascii '1234567891234567'
  address: "5",
  connected: false,
  sensors: [],
}
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
