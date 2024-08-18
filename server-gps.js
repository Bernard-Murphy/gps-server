const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const ioServer = require("socket.io");
const { MongoClient } = require("mongodb");
const http = require("http");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const mongoUrl =
  "mongodb+srv://" +
  process.env.MONGO_USER +
  ":" +
  encodeURIComponent(process.env.MONGO_PASSWORD) +
  "@" +
  process.env.MONGO_HOST +
  "/?retryWrites=true&w=majority";
const client = new MongoClient(mongoUrl);

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const server = http.createServer(app);

// Set up cookies
const sessionStore = new MongoDBStore({
  uri: mongoUrl,

  databaseName: process.env.DATABASE,
  collection: "sessions",
});
const sessionConfig = {
  name: process.env.APP_NAME,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false,
    httpOnly: false,
  },
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
};
const sessionObj = session(sessionConfig);
app.use(sessionObj);

const io = ioServer(server, {
  cors: true,
});
// Wrap socket with express-session object so that socket can access user session info
const wrapSocketMiddleware = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
io.use(wrapSocketMiddleware(sessionObj)); // Session object can be accessed by websockets

io.on("connection", (socket) => {
  try {
    console.log("New connection");
  } catch (err) {
    console.log("socket connection error", err, socket);
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body?.password === process.env.PASSWORD) {
      req.session.authorized = true;
      const collection = client.db(process.env.DATABASE).collection("pings");
      const devices = await collection.distinct("device");
      let logs = [];
      for (let d = 0; d < devices.length; d++) {
        const device = devices[d];
        const mostRecent = await collection
          .find({
            device,
          })
          .limit(100)
          .sort({ timestamp: -1 })
          .toArray();
        logs = logs.concat(mostRecent);
      }
      console.log("logs", logs);
      res.status(200).json({ logs });
    } else res.sendStatus(401);
  } catch (err) {
    console.log("login error", err);
    res.sendStatus(500);
  }
});

app.post("/reload", async (req, res) => {
  try {
    if (!req.session.authorized || !req.body?.logs) res.sendStatus(401);
    else {
      const collection = client.db(process.env.DATABASE).collection("pings");
      let logs = [];
      if (req.body.constraints) {
        for (let d = 0; d < devices.length; d++) {
          const mostRecent = await collection
            .find({
              ...constraints,
              _id: {
                $nin: req.body.logs,
              },
            })
            .limit(100)
            .sort({ timestamp: -1 })
            .toArray();
          logs = logs.concat(mostRecent);
        }
      } else {
        const devices = await collection.distinct("device");
        console.log("devices", devices);
        for (let d = 0; d < devices.length; d++) {
          const device = devices[d];
          const mostRecent = await collection
            .find({
              device,
              _id: {
                $nin: req.body.logs,
              },
            })
            .limit(100)
            .sort({ timestamp: -1 })
            .toArray();
          logs = logs.concat(mostRecent);
        }
      }

      console.log("logs", logs);
      res.status(200).json({ logs });
    }
  } catch (err) {
    console.log("reload error", err);
    res.sendStatus(500);
  }
});

app.post("/ping", async (req, res) => {
  try {
    if (!(req.body.key === process.env.LAPTOP_KEY)) return res.sendStatus(401);

    await client
      .db(process.env.DATABASE)
      .collection("pings")
      .insertOne({
        _id: crypto.randomBytes(8).toString("hex"),
        data: req.body.data,
        device: req.body.device,
        headers: req.headers,
        timestamp: new Date(),
      });
    console.log("ok");
    res.sendStatus(200);
  } catch (err) {
    console.log("/ping error", err, req?.body);
    res.sendStatus(500);
  }
});

app.get("*", (req, res) =>
  res.status(200).sendFile(__dirname + "/public/index.html")
);

server.listen(port, () => console.log(`GPS app running on port ${port}`));
