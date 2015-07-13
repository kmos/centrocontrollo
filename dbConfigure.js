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
  address: "9",
  connected: false,
  sensors: [],
},
{
  _id: "NgA3ABNHMzE5MDcw", // [0x36, 0x00, 0x37, 0x00, 0x13, 0x47, 0x33, 0x31, 0x39, 0x30, 0x37, 0x30]
  secretKey: "MTIzNDU2Nzg5MTIzNDU2Nw==", // ascii '1234567891234567'
  address: "5",
  connected: false,
  sensors: [],
},
{
  _id: "IgA9AA1HMjQ4NjYx", // [0x22, 0x00, 0x3D, 0x00, 0x0D, 0x47, 0x32, 0x34, 0x38, 0x36, 0x36, 0x31]
  secretKey: "MTIzNDU2Nzg5MTIzNDU2Nw==", // ascii '1234567891234567'
  address: "1",
  connected: false,
  sensors: [],
},
{
  _id: "OQAtAAJHMjUxODEw", // [0x39, 0x00, 0x2D, 0x00, 0x02, 0x47, 0x32, 0x35, 0x31, 0x38, 0x31, 0x30]
  secretKey: "MTIzNDU2Nzg5MTIzNDU2Nw==", // ascii '1234567891234567'
  address: "17",
  connected: false,
  sensors: [],
},
{
  _id: "IQA5ABdHMTQ2MjQ2", // [0x21, 0x00, 0x39, 0x00, 0x17, 0x47, 0x31, 0x34, 0x36, 0x32, 0x34, 0x36]
  secretKey: "MTIzNDU2Nzg5MTIzNDU2Nw==", // ascii '1234567891234567'
  address: "15",
  connected: false,
  sensors: [],
},
];

// Add 4 sensors in each node
nodes = nodes.map(function(node) {
  node.sensors = [
  {
    _id: "0",
    klass: "Temperatura",
    priority: 0,
    alarm: false,
    lowThreshold: 10,
    highThreshold: 100,
    periodMs: 0,
    measurements: [],
  },
  {
    _id: "1",
    klass: "Accelerometro",
    priority: 1,
    alarm: false,
    lowThreshold: 10,
    highThreshold: 100,
    periodMs: 0,
    measurements: [],
  },
  ];

  return node;
});

db.dropDatabase();

db.nodes.insert(nodes);
