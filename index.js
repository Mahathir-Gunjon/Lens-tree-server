const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000


// middleWare
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.idddr.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// start function start here
async function start() {
    try {
        await client.connect();
        const itemCollection = client.db('products').collection('item')

        app.get('/items', async (req, res) => {
          const query = {};
          const cursor = itemCollection.find(query)
          const services = await cursor.toArray();
          res.send(services)
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

