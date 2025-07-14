Here’s a clean, project-specific README example combining both frontend and backend instructions for your Leaderboard System task:

---

# 🏆 Leaderboard System — Full-Stack App (React + Node.js + MongoDB)

A dynamic leaderboard system that allows users to:

* Add new users
* Claim random points (1–10) for any user
* View real-time leaderboard rankings
* Track each user's claim history

---

## 📁 Project Structure

```
/frontend   → React.js frontend
/backend    → Node.js + Express + MongoDB backend
```

---

## ✅ Features

* User Management (Add New Users)
* Claim Points with Cooldown Logic (1 minute)
* Claim History Tracking
* Real-Time Leaderboard Ranking
* Responsive UI with Pagination
* MongoDB Collections:

  * Users
  * ClaimHistory

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup

1. Navigate to the backend folder:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file (optional for Mongo URI):

   ```
   MONGO_URI=mongodb://localhost:27017/leaderboard-app
   ```

4. Run backend server:

   ```
   npm start
   ```

5. (Optional) Clear or seed users manually:

   * To clear all users:

     ```
     node
     > require('./models/User').deleteMany({})
     > .exit
     ```
   * Or write a custom `seed.js` file.

### 2️⃣ Frontend Setup

1. Navigate to the frontend folder:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run frontend app:

   ```
   npm start
   ```

4. Access in browser:

   ```
   http://localhost:3000
   ```

---

## 🛠️ API Endpoints Summary

### Users

* `GET /api/users` → Get all users with sorting & search options
* `POST /api/users/add` → Add a new user `{ name: string }`
* `POST /api/users/claim/:userId` → Claim points for a user
* `GET /api/users/history/:userId` → Get claim history for a user
* `POST /api/users/reset` → Reset leaderboard and history

---

## 🎨 Tech Stack

* React.js
* Node.js + Express.js
* MongoDB + Mongoose
* Axios (frontend API requests)

---

## ✨ Bonus Points Implemented

✅ Clean and modern UI
✅ Responsive and optimized layout
✅ Efficient pagination logic
✅ Well-structured and reusable code
✅ Code comments and best practices

---

## ℹ️ Notes

* Backend runs on `http://localhost:5000/api/users`
* Frontend runs on `http://localhost:3000`
* Make sure MongoDB service is running locally or provide your cloud URI in `.env`.

---