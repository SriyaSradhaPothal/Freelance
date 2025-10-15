# FreelanceHub - Mini Fiverr Clone

A comprehensive freelance bidding platform built with the MERN stack, featuring project posting, bidding, messaging, contract management, and secure payments.

## 🚀 Features

### Core Functionality
- **User Authentication & Roles**: Separate registration for clients and freelancers
- **Project Management**: Create, browse, and manage projects with categories and budgets
- **Bidding System**: Freelancers can bid on projects with proposals and pricing
- **Messaging System**: Real-time communication between clients and freelancers
- **Contract Management**: Accept bids, create contracts, and track milestones
- **Payment Integration**: Secure payments using Stripe (test mode)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

### User Roles
- **Clients**: Post projects, review bids, hire freelancers, manage contracts
- **Freelancers**: Browse projects, submit bids, communicate with clients, track work

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **Socket.io** for real-time messaging
- **Express Validator** for input validation

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/freelance-platform
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   NODE_ENV=development
   PORT=5000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🎯 Usage Guide

### For Clients
1. **Register** as a client
2. **Post Projects** with detailed requirements and budget
3. **Review Bids** from freelancers
4. **Accept Bids** to create contracts
5. **Communicate** with freelancers via messaging
6. **Track Progress** through milestones
7. **Make Payments** securely through Stripe

### For Freelancers
1. **Register** as a freelancer
2. **Complete Profile** with skills and portfolio
3. **Browse Projects** matching your expertise
4. **Submit Bids** with proposals and pricing
5. **Communicate** with clients
6. **Work on Contracts** and update milestones
7. **Receive Payments** upon completion

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Bids
- `GET /api/bids/project/:projectId` - Get bids for project
- `GET /api/bids/freelancer/:freelancerId` - Get freelancer bids
- `POST /api/bids` - Create bid
- `PUT /api/bids/:id/accept` - Accept bid
- `PUT /api/bids/:id/reject` - Reject bid

### Messages
- `GET /api/messages/project/:projectId` - Get project messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

### Contracts
- `GET /api/contracts/user/:userId` - Get user contracts
- `GET /api/contracts/:id` - Get contract by ID
- `PUT /api/contracts/:id/milestone/:milestoneId` - Update milestone
- `PUT /api/contracts/:id/complete` - Complete contract

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment

## 🎨 UI Components

The application features a modern, responsive design with:
- **Navigation Bar** with role-based menu items
- **Dashboard** with statistics and recent activity
- **Project Cards** with filtering and search
- **Forms** with validation and error handling
- **Loading States** and error boundaries
- **Toast Notifications** for user feedback

## 🔒 Security Features

- **JWT Authentication** with token expiration
- **Password Hashing** using bcrypt
- **Input Validation** on both client and server
- **CORS Configuration** for API security
- **Protected Routes** based on user roles
- **Secure Payment Processing** with Stripe

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Update environment variables for production
4. Configure CORS for your frontend domain

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API URL in environment variables

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Project creation and browsing
- [ ] Bid submission and acceptance
- [ ] Messaging functionality
- [ ] Contract management
- [ ] Payment processing (test mode)

## 📝 Future Enhancements

- **Real-time Notifications** using WebSocket
- **File Upload** for project attachments
- **Rating System** for completed projects
- **Advanced Search** with filters
- **Mobile App** using React Native
- **Email Notifications** for important events
- **Analytics Dashboard** for users
- **Multi-language Support**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Happy Freelancing! 🎉**



