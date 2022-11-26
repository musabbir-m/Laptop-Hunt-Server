const express = require("express");
const cors = require("cors");

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require("dotenv").config();
//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.z1jayhr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//all api under try

async function run() {
  try {
    //collecitons
    const categoryCollection = client.db("usedLaptop").collection("categories");
    const laptopsCollection = client.db("usedLaptop").collection("laptops");
    const usersCollection = client.db("usedLaptop").collection("users");

    //to get categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });
    //get single category products

    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await laptopsCollection.find(query).toArray();
      res.send(products);
      console.log("empty");
    });
  } finally {
    //finally
    //
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("laptop server running");
});

app.listen(port, () => {
  console.log(` server running on port: ${port}`);
});
