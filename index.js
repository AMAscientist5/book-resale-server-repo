const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mkpcxwu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoriesCollection = client
      .db("aradunBookResale")
      .collection("categories");

    const categoryCollection = client
      .db("aradunBookResale")
      .collection("category");

    const usersCollection = client.db("aradunBookResale").collection("users");

    const bookingsCollection = client
      .db("aradunBookResale")
      .collection("bookings");

    app.get("/categories", async (req, res) => {
      const query = {};
      const users = await categoriesCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/category", async (req, res) => {
      const query = {};
      const users = await categoryCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await categoryCollection.findOne(query);
      res.send(booking);

      app.get("/categoryType", async (req, res) => {
        const category_id = req.query.category_id;
        const query = { category_id };
        const result = await categoryCollection.find(query).toArray();
        res.send(result);
      });
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Aradun Book Resale Server is Running...");
});

app.listen(port, () => console.log(`Aradun Book Resale on ${port}`));
