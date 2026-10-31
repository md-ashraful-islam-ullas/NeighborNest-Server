import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const app = express();
const port = 5000;

const client = new MongoClient(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

export async function connectToMongoDB() {
  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db('NeighborNest');
const eventsCollection = db.collection('events');



app.get('/', (req, res) => {
  res.send('Welcome to the Neighbor Nest Server!');
});

// http://localhost:5000/create-event
app.post('/create-event', async (req, res) => {
  const eventData = req.body;
  const result = await eventsCollection.insertOne(eventData);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Neighbor Nest listening on port ${port}`);
});