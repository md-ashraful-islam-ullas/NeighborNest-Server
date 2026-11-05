# NeighborNest Server

The backend API for [NeighborNest](https://neighbor-nest-ph-b14-a08.vercel.app/), a community platform for finding, creating, and joining neighborhood events.

- **Live API:** [neighbor-nest-server-3tl3.vercel.app](https://neighbor-nest-server-3tl3.vercel.app/)
- **Client repository:** [NeighborNest-PH-B14-A08](https://github.com/md-ashraful-islam-ullas/NeighborNest-PH-B14-A08)

## Features

- Create, read, update, and delete community events.
- Featured events for the home page.
- Join events and view the events a user has joined.
- Private routes protected with JWT.
- Data stored in MongoDB.

## Built With

Node.js, Express, MongoDB, jose (JWT verification), and Vercel.

## API Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Welcome message |
| `GET` | `/events` | Public | All events |
| `GET` | `/events/:id` | Public | A single event |
| `GET` | `/featured-events` | Public | Six events for the home page |
| `POST` | `/create-event` | Private | Create an event |
| `PATCH` | `/events/:id` | Private | Update an event |
| `DELETE` | `/events/:id` | Private | Delete an event |
| `POST` | `/join-event` | Private | Join an event |
| `GET` | `/my-joined-events/:email` | Private | Events a user has joined |
| `GET` | `/my-events/:email` | Private | Events a user has created |

Private routes need an `Authorization: Bearer <token>` header. The token is checked against the client's JWKS endpoint.

## Run Locally

```bash
git clone https://github.com/md-ashraful-islam-ullas/NeighborNest-Server.git
cd NeighborNest-Server
npm install
node index.js
```

Create a `.env` file first:

```env
MONGODB_URI=your-mongodb-connection-string
CLIENT_URL=http://localhost:3000
```

`CLIENT_URL` is the address of the NeighborNest client. The server uses it to verify tokens. The server runs on port 5000.

## Deployment

The server is deployed on Vercel. Add the same two variables in the Vercel project settings, and set `CLIENT_URL` to `https://neighbor-nest-ph-b14-a08.vercel.app`.

## Author

Built by **Md. Ashraful Islam Ullas**.