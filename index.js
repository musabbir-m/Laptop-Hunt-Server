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
    const bookingCollection = client.db("usedLaptop").collection("bookings");
    //to get categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });

    //add product to database
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await laptopsCollection.insertOne(product);
      res.send(result);
    });

    //get added product by a seller
    app.get("/myproducts", async (req, res) => {
      const email = req.query.email;
      const query = { sellerEmail: email };
      const prodcuts = await laptopsCollection.find(query).toArray();
      res.send(prodcuts);
    });

    //get single category products

    app.get("/categories/:id", async (req, res) => {
      const brand = req.params.id;
      const query = { brandName: brand };
      const products = await laptopsCollection.find(query).toArray();
      res.send(products);
      console.log("empty");
    });

    //post bookings

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
    //get sigle user by email
    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    //get all sellers

    app.get("/sellers", async (req, res) => {
      const query = { role: "seller" };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    //get all buyers
    app.get("/buyers", async (req, res) => {
      const query = { role: "buyer" };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    //post users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
//advertise product
app.put("/products/:id", async(req, res)=>{
  const id= req.params.id 
  const filter= {_id: ObjectId(id)}
  const advertiseStatus= req.body 
  const option= {upsert: true} 
  const updaetdStatus= {
    $set: {
      advertised: advertiseStatus.advertised
    }
  }
  const result= await laptopsCollection.updateOne(filter, updaetdStatus,option)
  res.send(result)
})
    //delete one product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const remove = { _id: ObjectId(id) };
      const result = await laptopsCollection.deleteOne(remove);
      res.send(result);
    });

    //load add
    app.get("/ads", async(req, res)=>{
      const query= {advertised: 'true'}
      const result= await laptopsCollection.find(query).toArray()
      res.send( result)
    })

    //delete a seller
    app.delete("/sellers/:id", async (req, res) => {
      const id = req.params.id;
      const remove = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(remove);
      res.send(result);
    });

    //delete a buyer
    app.delete("/buyers/:id", async (req, res) => {
      const id = req.params.id;
      const remove = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(remove);
      res.send(result);
    });

    // verify buyerRole
    app.get("/users/buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
    });
    //verify sellerRole
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.role === "seller" });
    });
    //verify adminRole
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
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
