# E-Commerce API

A comprehensive RESTful API for an e-commerce platform built with Node.js, Express.js, and MongoDB. This API provides authentication, product management, shopping cart functionality, and contact form handling.

## Features

- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **Product Management**: CRUD operations for products with category filtering
- **Shopping Cart**: Full cart management functionality
- **File Upload**: Image upload support with Cloudinary integration
- **Contact Form**: Contact message handling with rate limiting
- **Security**: Rate limiting, input validation, and secure cookie handling

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Image Processing**: Multer with DataUri
- **Security**: bcrypt for password hashing, express-rate-limit
- **Utilities**: ms for time parsing, cookie-parser

## Project Structure

```
├── config/
│   ├── cloudinaryConfig.js    # Cloudinary configuration
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── cart.controller.js     # Cart management logic
│   ├── contact.controller.js  # Contact form handling
│   ├── product.controller.js  # Product CRUD operations
│   └── user.controller.js     # User authentication logic
├── middleware/
│   ├── isLogged.js           # Authentication middleware
│   ├── limiter.js            # Rate limiting middleware
│   └── multer.js             # File upload middleware
├── models/
│   ├── cart.model.js         # Cart schema
│   ├── contact.model.js      # Contact schema
│   ├── product.model.js      # Product schema
│   └── user.model.js         # User schema
├── routes/
│   ├── authRouter.js         # Authentication routes
│   ├── cartRouter.js         # Cart routes
│   ├── contactRouter.js      # Contact routes
│   └── productsRouter.js     # Product routes
├── utils/
│   ├── generateAccessAndRefreshToken.js  # Token generation utility
│   ├── option.js             # Cookie options utility
│   ├── pattern.js            # Validation patterns
│   └── sendResponse.js       # Standardized response utility
├── .env.sample              # Environment variables template
└── index.js                 # Application entry point
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.sample` to `.env`
   - Fill in the required environment variables:

   ```env
   # Server Configuration
   PORT=5000

   # Database Configuration
   MONGO_URI=your_mongodb_connection_string_here

   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRE=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRE=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| POST | `/auth/refresh-token` | Refresh access token | Yes |

### Product Routes (`/products`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/products` | Get all products | No |
| POST | `/products/add` | Add new product | No |
| GET | `/products/category/:x` | Get products by category | No |

### Cart Routes (`/cart`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/cart/:userId` | Get user's cart | Yes |
| POST | `/cart/:userId` | Update user's cart | Yes |
| POST | `/cart/:userId/:productId` | Remove product from cart | Yes |

### Contact Routes (`/contact`)

| Method | Endpoint | Description | Authentication | Rate Limit |
|--------|----------|-------------|----------------|------------|
| POST | `/contact` | Submit contact form | No | 5 requests/hour |

## Data Models

### User Model
```javascript
{
  name: String (required, lowercase),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  refreshToken: String (required),
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String (required),
  price: Number (required),
  category: String (required),
  subcategory: [String] (required),
  image: String (required),
  description: String (required),
  stock: Number (default: 1, required),
  timestamps: true
}
```

### Cart Model
```javascript
{
  userId: ObjectId (ref: User, required),
  products: [{
    productId: ObjectId (ref: Product, required),
    quantity: Number (default: 1, min: 1)
  }],
  timestamps: true
}
```

### Contact Model
```javascript
{
  name: String (required),
  email: String (required),
  message: String (required),
  timestamps: true
}
```

## Authentication

This API uses JWT-based authentication with both access and refresh tokens:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to generate new access tokens
- **Cookies**: Tokens are stored in secure, HTTP-only cookies

### Password Requirements
- Minimum 6 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one digit
- Special characters allowed: @#$%^&+=!

### Email Format
- Must be a valid email format (example@domain.com)

## File Upload

The API supports image uploads for products using:
- **Multer**: For handling multipart/form-data
- **Cloudinary**: For cloud storage
- **Supported formats**: JPEG, PNG, GIF, WebP

Upload endpoint: `POST /products/add` with `image` field in form-data.

## Rate Limiting

Contact form submissions are rate-limited to 5 requests per hour per IP address.

## Error Handling

All responses follow a standardized format:
```javascript
{
  success: boolean,
  message: string,
  data: object | null
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Server Error

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Secure cookie configuration
- Input validation and sanitization
- Rate limiting for contact forms
- CORS configuration
- File type validation for uploads

## Dependencies

### Core Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT implementation
- `bcrypt`: Password hashing
- `multer`: File upload handling
- `cloudinary`: Cloud storage
- `cookie-parser`: Cookie parsing
- `cors`: CORS middleware
- `express-rate-limit`: Rate limiting
- `dotenv`: Environment variables
- `ms`: Time parsing utility
- `datauri`: File to data URI conversion

## Development

### Code Structure
- **Controllers**: Handle business logic
- **Models**: Define data schemas
- **Middleware**: Handle cross-cutting concerns
- **Routes**: Define API endpoints
- **Utils**: Utility functions
- **Config**: Configuration files

### Best Practices Implemented
- Separation of concerns
- Input validation
- Error handling
- Security measures
- Consistent response format
- Environment-based configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please use the contact form endpoint or create an issue in the repository.