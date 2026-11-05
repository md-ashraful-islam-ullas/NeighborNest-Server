import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

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
const db = mongoClient.db("NeighborNest");
const eventsCollection = db.collection("events");
const joinEventsCollection = db.collection("joinEvents");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
  );

  try {
    const { payload } = await jwtVerify(token, JWKS);
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
};

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Neighbor Nest Server!</h1>
    <p>
      This server powers the Neighbor Nest community events platform.
    </p>
    <h3>Important Note for Event Creation:</h3>
    <p>
      When creating an event, the <strong>creator</strong> field is required.
      It is automatically generated using the currently authenticated user's
      information when a user creates an event through the application.
    </p>
    <p>
      <strong>Admin Notice:</strong> Admin-created events do not require
      manually providing creator information.
    </p>
  `);
});

// http://localhost:5000/create-event
app.post("/create-event", verifyToken, async (req, res) => {
  const eventData = req.body;
  const result = await eventsCollection.insertOne(eventData);
  res.json(result);
});

// http://localhost:5000/events
app.get("/events", async (req, res) => {
  const events = await eventsCollection.find().toArray();
  res.json(events);
});

// http://localhost:5000/events/:id
app.get("/events/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const event = await eventsCollection.findOne(query);
  res.send(event);
});

// http://localhost:5000/events/:id
app.patch("/events/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await eventsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData },
  );
  res.send(result);
});

// http://localhost:5000/events/:id
app.delete("/events/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

// http://localhost:5000/join-event
app.post("/join-event", verifyToken, async (req, res) => {
  const joinEventData = req.body;
  const result = await joinEventsCollection.insertOne(joinEventData);
  res.send(result);
});

// http://localhost:5000/my-joined-events/:email
app.get("/my-joined-events/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const joinedEvents = await joinEventsCollection.find(query).toArray();
  res.send(joinedEvents);
});

// http://localhost:5000/my-events/:email
app.get("/my-events/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const query = { "creator.email": email };
  const myEvents = await eventsCollection.find(query).toArray();
  res.send(myEvents);
});

// http://localhost:5000/featured-events
app.get("/featured-events", async (req, res) => {
  const result = await eventsCollection.find().limit(6).toArray();
  res.send(result);
});

app.listen(port, () => {
  console.log(`Neighbor Nest listening on port ${port}`);
});

export default app;
