const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbtls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const stockCollection = client.db("stock").collection("product");

    app.get("/product", async (req, res) => {
      const count = parseInt(req.query.count);
      const query = {};
      const cursor = stockCollection.find(query);
      let stock;
      if (count) {
        stock = await cursor.limit(count).toArray();
      } else {
        stock = await cursor.toArray();
      }
      res.send(stock);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await stockCollection.findOne(query);
      res.send(product);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const newData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: newData.newquantity,
        },
      };
      const result = await stockCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await stockCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running...");
});

app.listen(port, () => {
  console.log("server is running on ", port);
});
