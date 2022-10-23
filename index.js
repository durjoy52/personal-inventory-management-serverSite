const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const productCollection = client
      .db("personal-inventory")
      .collection("products");

    app.get("/products/:group", async (req, res) => {
      const group = req.params.group;
      const filter = { group: group };
      const result = await productCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.findOne(filter);
      res.send(result);
    });
    app.post("/product", async (req, res) => {
      const product = req.body
      const result = await productCollection.insertOne(product);
      res.send(result);
    });
    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      const details = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: details
      }
      const result = await productCollection.updateOne(filter,updatedDoc);
      res.send(result);
    });
    app.delete("/product/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:ObjectId(id)}
      const result = await productCollection.deleteOne(filter)
      res.send(result)
    })
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
