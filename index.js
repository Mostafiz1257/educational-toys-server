const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express();

//middleware
// app.use(cors());
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json())


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esni35a.mongodb.net/?retryWrites=true&w=majority`;

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-848jnr6-shard-00-00.esni35a.mongodb.net:27017,ac-848jnr6-shard-00-01.esni35a.mongodb.net:27017,ac-848jnr6-shard-00-02.esni35a.mongodb.net:27017/?ssl=true&replicaSet=atlas-bmxs0j-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const toyCollection = client.db('toysDB').collection('toys')

    app.post('/toys', async (req, res) => {
      const addToys = req.body
      console.log(addToys);
      const result = await toyCollection.insertOne(addToys)
      res.send(result)

    })
    app.get('/toys', async (req, res) => {
      const cursor = toyCollection.find().sort({createdAt:-1}).limit(20)
      const result = await cursor.toArray();
      res.send(result)
      console.log(result);

    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query)
      res.send(result)
    })

    app.get('/mytoys', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);

    })

    app.put('/mytoys/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const selectToys = req.body;
      body.createdAt = new Date();
      const filter = {_id : new ObjectId(id)}
      const options ={upset:true}
      const updateToys ={
        $set:{
          price:selectToys.price,
          quantity : selectToys.quantity,
          details:selectToys.details
        }
      }
      const result = await toyCollection.updateOne(filter,updateToys)
      res.send(result)
    })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })

//get by sub-category
app.get('/category/:sub_category',async(req,res)=>{
  const toys = await toyCollection.find({sub_category: req.params.sub_category}).toArray()
  res.send(toys)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Buy some toys')
})

app.listen(port, () => {
  console.log(`port is running ${port}`);
})