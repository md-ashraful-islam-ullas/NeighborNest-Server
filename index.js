import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
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
const joinEventsCollection = db.collection('joinEvents');


app.get('/', (req, res) => {
  res.send('Welcome to the Neighbor Nest Server!');
});

// http://localhost:5000/create-event
app.post('/create-event', async (req, res) => {
  const eventData = req.body;
  const result = await eventsCollection.insertOne(eventData);
  res.json(result);
});

// http://localhost:5000/events
app.get('/events', async (req, res) => {
  const events = await eventsCollection.find().toArray();
  res.json(events);
});


// http://localhost:5000/events/:id
app.get('/events/:id', async (req, res) => {
  const id  = req.params.id;
  const query = { _id: new ObjectId(id) };
  const event = await eventsCollection.findOne(query);
  res.send(event);
});

// http://localhost:5000/join-event
app.post('/join-event', async (req, res) => {
  const joinEventData = req.body;
  const result = await joinEventsCollection.insertOne(joinEventData);
  res.send(result);
});

// http://localhost:5000/my-joined-events/:email
app.get('/my-joined-events/:email', async(req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const joinedEvents = await joinEventsCollection.find(query).toArray();
  res.send(joinedEvents);
});


app.listen(port, () => {
  console.log(`Neighbor Nest listening on port ${port}`);
});