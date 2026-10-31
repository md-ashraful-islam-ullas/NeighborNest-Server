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

app.get('/', (req, res) => {
  res.send('Welcome to the Neighbor Nest Server!');
});

app.listen(port, () => {
  console.log(`Neighbor Nest listening on port ${port}`);
});