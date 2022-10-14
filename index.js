const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orsayqr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const pranCollection = client
      .db("personal-inventory")
      .collection("pran-products");
    const saCollection = client
      .db("personal-inventory")
      .collection("sa-group");

    app.get("/pranGroup", async (req, res) => {
      const result = await pranCollection.find().toArray()
      res.send(result);
    });
    app.get("/saGroup", async (req, res) => {
      const result = await saCollection.find().toArray()
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("server is running at", port);
});
