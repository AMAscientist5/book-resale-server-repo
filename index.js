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
    const sellerProductCollection = client
      .db("aradunBookResale")
      .collection("sellerProducts");

    app.get("/categories", async (req, res) => {
      const query = {};
      const users = await categoriesCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/categoriesName", async (req, res) => {
      const query = {};
      const result = await categoriesCollection
        .find(query)
        .project({ categoryName: 1 })
        .toArray();
      res.send(result);
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
    });

    app.get("/categoryType", async (req, res) => {
      const category_id = req.query.category_id;
      const query = { category_id };
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/usersType", async (req, res) => {
      const role = req.query.role;
      const query = { role };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      console.log(req.params.email);
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.role === "seller" });
    });
    app.get("/users/buyer/:email", async (req, res) => {
      const email = req.params.email;
      console.log(req.params.email);
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
    });

    app.post("/users", async (req, res) => {
      console.log(req.body);
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const query = {};
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/bookingsOrder", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const user = req.body;
      const result = await bookingsCollection.insertOne(user);
      res.send(result);
    });

    app.get("/sellerProducts", async (req, res) => {
      const query = {};
      const result = await sellerProductCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/sellerProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await sellerProductCollection.findOne(query);
      res.send(result);
    });

    app.post("/sellerProducts", async (req, res) => {
      const seller = req.body;
      const result = await sellerProductCollection.insertOne(seller);
      res.send(result);
    });

    app.delete("/sellerProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await sellerProductCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Aradun Book Resale Server is Running...");
});

app.listen(port, () => console.log(`Aradun Book Resale on ${port}`));
