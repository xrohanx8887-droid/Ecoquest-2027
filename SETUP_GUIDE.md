# EcoQuest Community Wall Setup Guide

## ✅ What's Been Created

I've successfully set up a complete backend system for your community wall feature:

### Backend Features

- 📸 **Image Upload**: Users can upload photos with their eco-actions
- 💾 **MongoDB Database**: Stores posts, likes, and comments
- 👍 **Like System**: Users can like/unlike posts
- 💬 **Comments**: Users can comment on posts
- 🗂️ **Categories**: Different eco-action categories with point values
- 📄 **Pagination**: Efficient loading of posts
- 🔒 **File Validation**: Image type and size validation (5MB limit)

### Frontend Integration

- ✅ Updated PeerValidation component to connect to backend
- ✅ Real-time image upload with progress indicators
- ✅ Interactive like and comment system
- ✅ Beautiful community wall display
- ✅ Form validation and error handling

## 🚀 How to Run

### Prerequisites

1. **MongoDB**: Install MongoDB or use MongoDB Atlas
2. **Node.js**: Version 14 or higher

### Step 1: Start MongoDB

```bash
# If using local MongoDB
mongod
```

### Step 2: Start Backend Server

```bash
cd backend
npm install
npm start
```

Backend will run on: `http://localhost:3001`

### Step 3: Start Frontend

```bash
cd eco-quest-forge-main
npm install
npm run dev
```

Frontend will run on: `http://localhost:8080`

## 🎯 How to Use the Community Wall

### For Users:

1. **Go to Share section** in the main navigation
2. **Fill out the form**:
   - Enter your name (optional)
   - Add a catchy title for your action
   - Select the type of eco-action
   - Write a detailed description
   - Upload a photo (required)
3. **Click "Submit to Community Wall"**
4. **View posts** in the "Community Wall" tab
5. **Like and comment** on other users' posts

### Categories & Points:

- 🌳 **Tree Planting**: 50 points
- ♻️ **Waste Recycling**: 30 points
- 💧 **Water Conservation**: 40 points
- ⚡ **Energy Saving**: 35 points
- ❤️ **Other Eco Action**: 25 points

## 🛠️ Technical Details

### API Endpoints

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post with image
- `PUT /api/posts/:id/like` - Toggle like
- `POST /api/posts/:id/comments` - Add comment
- `GET /api/health` - Health check

### Database Schema

```javascript
Post {
  title: String,
  description: String,
  category: String,
  author: String,
  image: { filename, path, mimetype, size },
  likes: Number,
  comments: [{ author, text, createdAt }],
  ecoPoints: Number,
  createdAt: Date
}
```

### File Storage

- Images stored in `backend/uploads/` directory
- Unique filenames generated automatically
- Supported formats: PNG, JPG, JPEG, GIF
- Maximum size: 5MB

## 🔧 Configuration

### Environment Variables (backend/.env)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ecoquest
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Frontend API Configuration

The frontend is configured to connect to `http://localhost:3001/api`

## 🎉 Features in Action

### Submit Form

- Real-time file validation
- Progress indicators during upload
- Form reset after successful submission
- Error handling with user-friendly messages

### Community Wall

- Grid layout for posts
- Image display with category badges
- Like/unlike functionality
- Comment system with real-time updates
- Loading states and empty states

### Mobile Responsive

- Optimized for all screen sizes
- Touch-friendly interactions
- Responsive image display

## 🚨 Important Notes

1. **MongoDB Connection**: Make sure MongoDB is running before starting the backend
2. **File Permissions**: Ensure the backend has write permissions for the uploads directory
3. **CORS**: Backend is configured to allow requests from frontend
4. **Production**: For production, consider using cloud storage (AWS S3, Cloudinary) instead of local file storage

## 🐛 Troubleshooting

### Backend won't start

- Check if MongoDB is running
- Verify port 3001 is available
- Check environment variables

### Images won't upload

- Check file size (must be < 5MB)
- Verify file type (only images allowed)
- Ensure uploads directory exists

### Frontend can't connect to backend

- Verify backend is running on port 3001
- Check browser console for CORS errors
- Ensure API_BASE_URL is correct in frontend

## 🎯 Next Steps

Your community wall is now fully functional! Users can:

- Upload images of their eco-actions
- Get points based on action category
- Like and comment on posts
- View a beautiful community wall

The system is ready for production deployment with proper environment configuration and cloud storage integration.

