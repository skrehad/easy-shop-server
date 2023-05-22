const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bwvhp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// console.log(uri);

async function run() {
  try {
    const homeCollection = client.db("easyShop").collection("homeProducts");
    const topSellingCollection = client
      .db("easyShop")
      .collection("topSellingProducts");
    const allReviewCollection = client
      .db("easyShop")
      .collection("overAllReview");
    const productCollection = client.db("easyShop").collection("products");
    const orderCollection = client.db("easyShop").collection("orders");
    const reviewCollection = client.db("easyShop").collection("reviews");
    const blogCollection = client.db("easyShop").collection("blogs");

    // for get homeCollection for client side
    app.get("/homeProducts", async (req, res) => {
      const query = {};
      const cursor = homeCollection.find(query);
      const homeProducts = await cursor.toArray();
      res.send(homeProducts);
    });

    // for get top selling Collection for client side
    app.get("/topSellingProducts", async (req, res) => {
      const query = {};
      const cursor = topSellingCollection.find(query);
      const topSellingProducts = await cursor.toArray();
      res.send(topSellingProducts);
    });

    // receive allReviews data from client side
    app.post("/overAllReview", async (req, res) => {
      const review = req.body;
      const result = await allReviewCollection.insertOne(review);
      res.send(result);
    });

    // get api from backend for client side
    app.get("/overAllReview", async (req, res) => {
      const query = {};
      const cursor = allReviewCollection.find(query);
      const allReviewCollections = await cursor.toArray();
      res.send(allReviewCollections);
    });

    // for get all products for client side
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // for get single data details for client side
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const products = await productCollection.findOne(query);
      res.send(products);
    });

    // get api from backend for client side
    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
      // console.log(orders);
    });

    // receive oder data from client side
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // for delete order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

    // get api from backend for client side
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.title) {
        query = {
          title: req.query.title,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
      // console.log(orders);
    });

    // receive  reviews data from client side
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // for get all blogs for client side
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();
      res.send(blogs);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
