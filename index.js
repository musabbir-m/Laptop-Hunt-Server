const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// usedLaptop
// 6hWYPK2TtkblCYj2

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.z1jayhr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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
  } finally {
    //
  }
}

app.get("/", (req, res) => {
  res.send("laptop server running");
});

app.listen(port, () => {
  console.log(` server running on port: ${port}`);
});
