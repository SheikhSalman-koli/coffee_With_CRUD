const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dclhmji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async(req, res)=>{
        // const cursor = coffeeCollection.find()
        // const result = await cursor.toArray()
        const result = await coffeeCollection.find().toArray()
        res.send(result)
    }) 

    app.get('/coffee/:id', async(req, res)=>{
        const id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query)
        res.send(result)
    })

    app.post('/coffee', async(req,res)=>{
        const newCoffee = req.body
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })

    app.put('/coffee/:id', async(req, res)=>{
        const id = req.params.id
        const filter = { _id: new ObjectId(id)}
        const whatToDoUpdated = req.body
        const options = { upsert: true };
        // সংক্ষেপে
        const updatedDoc = {
            $set: whatToDoUpdated
        }
        // বিস্তারিত
        //  const updatedDoc = {
        //     $set: {
        //         name: whatToDoUpdated.name,
        //         tast: whatToDoUpdated.tast,
        //         chef: whatToDoUpdated.chef,
        //         category: whatToDoUpdated.category
        //     }
        // }
        const result = await coffeeCollection.updateOne(filter, updatedDoc, options)
        res.send(result)
    })

    app.delete('/coffee/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })
   
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('coffee dsta is going well')
})

app.listen(port, ()=>{
    console.log(`my coffee port : ${port}`);
})