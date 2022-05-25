const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.idddr.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// start function start here
async function start() {
    try {
        await client.connect();
        const itemCollection = client.db('products').collection('item')
        const reviewCollection = client.db('products').collection('review')
        const orderCollection = client.db('products').collection('order')
        const userCollection = client.db('products').collection('user')

        app.get('/items', async (req, res) => {
          const query = {};
          const cursor = itemCollection.find(query)
          const item = await cursor.toArray();
          res.send(item)
        })

        app.get('/tool/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const singleTool = await itemCollection.findOne(query);
          res.send(singleTool);
      })


        app.get('/review', async (req, res) => {
          const query = {};
          const cursor = reviewCollection.find(query)
          const review = await cursor.toArray();
          res.send(review)
        })

        app.get('/order', async (req, res) => {
          const buyerEmail = req.query.buyerEmail;
          const query = {buyerEmail: buyerEmail};
          const orders = await orderCollection.find(query).toArray();
          res.send(orders)
        })

        // post function start here 

        app.post('/review', async (req, res) => {
            const review = req.body;
            await reviewCollection.insertOne(review);
            res.send(review)
        })

        app.post('/order', async (req, res) => {
            const order = req.body;
            await orderCollection.insertOne(order);
            res.send(order)
        })

        // put function start here

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = {upsert: true};
            const updateDoc = {
              $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
    } 
    finally{

    }
}
start() 

// main route here | get all data

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

