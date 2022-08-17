const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.SPICE_USER}:${process.env.SECRET_KEY}@cluster0.vgoc3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("FreshSpice").collection("product");

        //Get All Product
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query)
            const result = await cursor.toArray();

            res.send(result);
        })

        //Get Product by Id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query)

            res.send(result);
        })

        //post data
        app.post('/product', async (req, res) => {
            const newService = req.body;
            const result = await productCollection.insertOne(newService);
            res.send(result);
        });

        // DELETE
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        //get product by email        
        app.get('/myproduct', async (req, res) => {
            const email = req.query.email;
           
            const query = {email:email};
            const cursor = productCollection.find(query)
            const result = await cursor.toArray();

            console.log(result);
            res.send(result);
        })

        // Update user
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body.stock;
            console.log(id)
            console.log(updatedProduct)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    stock: updatedProduct,
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);


//Use 
app.get('/', (req, res) => {
    res.send('Running spice warehouse server')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})