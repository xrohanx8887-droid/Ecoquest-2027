# EcoQuest Backend API

This is the backend API for the EcoQuest community wall feature, built with Node.js, Express.js, and MongoDB.

## Features

- 📸 Image upload with Multer
- 💾 MongoDB database with Mongoose
- 👍 Like/unlike posts
- 💬 Comments system
- 🗂️ Category filtering
- 📄 Pagination
- 🔒 File validation and security

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the backend directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecoquest
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start MongoDB (if using local installation):

```bash
mongod
```

5. Run the development server:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Posts

#### GET /api/posts

Get all posts with pagination and filtering

- Query parameters:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Posts per page (default: 10)
  - `category` (string): Filter by category
  - `sortBy` (string): Sort field (default: 'createdAt')
  - `sortOrder` (string): 'asc' or 'desc' (default: 'desc')

#### GET /api/posts/:id

Get single post by ID

#### POST /api/posts

Create new post with image upload

- Form data:
  - `title` (string, required): Post title
  - `description` (string, required): Post description
  - `category` (string, required): Post category
  - `author` (string, optional): Author name
  - `image` (file, required): Image file

#### PUT /api/posts/:id/like

Toggle like on post

- Body: `{ "userId": "user_id_or_ip" }`

#### POST /api/posts/:id/comments

Add comment to post

- Body: `{ "text": "comment text", "author": "author name" }`

#### DELETE /api/posts/:id

Delete post by ID

### Health Check

#### GET /api/health

Check if the server is running

## Categories

Supported post categories:

- `tree-planting` (50 eco points)
- `recycling` (30 eco points)
- `energy-saving` (40 eco points)
- `water-conservation` (35 eco points)
- `other` (20 eco points)

## File Upload

- **Supported formats**: PNG, JPG, JPEG, GIF
- **Max file size**: 5MB
- **Storage**: Local filesystem in `/uploads` directory
- **Naming**: Auto-generated unique filenames

## Database Schema

### Post Model

```javascript
{
  title: String (required),
  description: String (required),
  category: String (required, enum),
  author: String (default: 'Anonymous'),
  image: {
    filename: String,
    path: String,
    mimetype: String,
    size: Number
  },
  likes: Number (default: 0),
  likedBy: [String], // User IDs
  comments: [{
    author: String,
    text: String,
    createdAt: Date
  }],
  status: String (enum: pending/approved/rejected),
  ecoPoints: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "error": "Error message"
}
```

## Success Responses

Successful responses follow this format:

```javascript
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

## Development

### Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

### Testing the API

You can test the API endpoints using tools like:

- Postman
- cURL
- Thunder Client (VS Code extension)

Example cURL command to create a post:

```bash
curl -X POST http://localhost:3001/api/posts \
  -F "title=My Eco Project" \
  -F "description=Planted 10 trees in my neighborhood" \
  -F "category=tree-planting" \
  -F "author=EcoWarrior" \
  -F "image=@/path/to/your/image.jpg"
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up proper MongoDB connection (MongoDB Atlas recommended)
4. Configure proper file storage (consider cloud storage for scalability)
5. Add authentication and authorization
6. Set up proper logging and monitoring

