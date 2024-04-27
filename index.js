const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wcqculy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

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
    await client.connect();
    
    const addedSpotCollection = client.db('addedSpotDB').collection("addedSpot")
    app.get ('/AddedSpot', async(req,res) =>{
        const cursor = addedSpotCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })


    app.post('/AddedSpot', async(req,res) =>{
        const newAddedSpot = req.body;
        console.log(newAddedSpot)
        const result = await addedSpotCollection.insertOne(newAddedSpot)
        res.send(result)
    })
    app.get('/listedItem/:email', async(req, res) =>{
      console.log(req.params.email);
      const result = await addedSpotCollection.find({email:req.params.email}).toArray();
      res.send(result)
    })

    // app.get('/updatePage/:id', async(res,req) =>{
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = {_id :new ObjectId(id)}
    //   const result = await addedSpotCollection.findOne(query)
    //   console.log(result)
    //   res.send,(result)
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('server is running')
})

app.listen(port, () =>{
    console.log(`server is running on port: ${port}`)
})