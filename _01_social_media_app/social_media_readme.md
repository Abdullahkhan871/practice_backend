# Social Media App Backend

A comprehensive Node.js backend application for a social media platform with features like user authentication, post management, comments, likes, and follow/unfollow functionality.

## Features

### 🔐 Authentication
- User registration with email and password validation
- Secure login/logout with JWT tokens
- Password hashing using bcrypt
- Cookie-based authentication

### 👤 User Management
- User profile creation and editing
- Profile picture support (default provided)
- Follow/unfollow other users
- View followers and following lists
- User deletion

### 📝 Post Management
- Create posts with captions and images
- Edit existing posts
- Delete posts
- View posts by user ID
- Get single post details

### 💬 Comments & Interactions
- Add comments to posts
- View comments on posts with user details
- Like/unlike posts
- Track likes count and users who liked

### 📰 Feed
- Get personalized feed from followed users
- View posts from users you're following

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer with Cloudinary storage
- **Environment Variables**: dotenv

## Project Structure

```
├── routes/
│   ├── authRouter.js       # Authentication routes
│   ├── userRouter.js       # User management routes
│   ├── postRouter.js       # Post management routes
│   └── feedRouter.js       # Feed routes
├── models/
│   ├── userSchema-model.js # User schema
│   ├── postSchema-model.js # Post schema
│   └── commentSchema-model.js # Comment schema
├── middleware/
│   └── isLogged.js         # Authentication middleware
├── config/
│   ├── mongodb.js          # Database connection
│   ├── response.js         # Standardized response utility
│   └── pattern.js          # Validation patterns
├── utils/
│   └── upload.js           # Cloudinary upload configuration
└── app.js                  # Main application file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social_media_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| GET | `/auth/logout` | User logout | ✅ |

### User Routes (`/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/me` | Get current user info | ✅ |
| PUT | `/user/edit` | Edit user profile | ✅ |
| DELETE | `/user/delete` | Delete user account | ✅ |
| GET | `/user/:username` | Get user by username | ✅ |
| PUT | `/user/:id/follow` | Follow/unfollow user | ✅ |
| GET | `/user/:userId/followers` | Get user followers | ✅ |
| GET | `/user/:userId/following` | Get user following | ✅ |

### Post Routes (`/post`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/post/` | Create new post | ✅ |
| GET | `/post/user/:userId` | Get posts by user ID | ✅ |
| GET | `/post/:postId` | Get single post | ✅ |
| PUT | `/post/edit/:postId` | Edit post | ✅ |
| DELETE | `/post/:postId` | Delete post | ✅ |
| POST | `/post/comments/:postId` | Add comment to post | ✅ |
| GET | `/post/comments/:postId` | Get post comments | ✅ |
| PUT | `/post/:postId/like` | Like/unlike post | ✅ |

### Feed Routes (`/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/feed` | Get personalized feed | ✅ |

## Data Models

### User Schema
- `username`: String (required, min 3 characters)
- `email`: String (required, unique, validated)
- `password`: String (required, hashed)
- `profilePic`: String (default provided)
- `posts`: Array of Post references
- `followers`: Array of User references
- `following`: Array of User references
- `followersCount`: Number (default 0)
- `followingCount`: Number (default 0)

### Post Schema
- `userId`: ObjectId (required)
- `caption`: String (required)
- `image`: String (required)
- `usersWhoLikes`: Array of User references
- `likesCount`: Number (default 0)
- `comments`: Array of Comment references
- `timestamps`: Created/Updated dates

### Comment Schema
- `postId`: ObjectId (required)
- `userId`: ObjectId (required)
- `text`: String (required)
- `timestamps`: Created/Updated dates

## Validation Rules

### Email Pattern
- Must follow standard email format (example@domain.com)

### Password Pattern
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## File Upload

The application uses Cloudinary for image storage:
- Supported formats: JPG, PNG, JPEG
- Files are stored in the `social_media_app` folder
- Automatic URL generation for easy access

## Error Handling

The application includes comprehensive error handling:
- Standardized response format
- Input validation
- Authentication checks
- Database error handling
- File upload error handling

## Response Format

All API responses follow a consistent format:
```json
{
  "success": boolean,
  "message": "string",
  "data": object | null
}
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt (salt rounds: 12)
- HTTP-only cookies for token storage
- Input validation and sanitization
- Protected routes with authentication middleware

## Development Notes

- Uses ES6 modules (import/export)
- Mongoose for MongoDB object modeling
- Cookie-parser for handling authentication cookies
- Comprehensive logging for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational/practice purposes.

---

**Note**: Make sure to set up your environment variables correctly before running the application. The app requires MongoDB connection and Cloudinary configuration to function properly.