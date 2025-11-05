# Learnato AI: Discussion Forum


A browser-based discussion forum microservice built to **"Empower learning through conversation."**

This platform is designed for learners and instructors to post questions, share insights, and reply in real time. It features a full authentication system, post and reply mechanics, an upvoting system, and AI-powered summaries, all built on a modern Node.js and React stack.

## Features:

* **Full Authentication:** Secure user signup and login handled via PostgreSQL.
* **Create Posts:** Users can ask new questions with a title and detailed content.
* **Post Replies:** Users can post answers and replies to any question.
* **Dynamic Upvoting:** Toggle upvotes on posts to highlight the most helpful content.
* **Filtered Views:** View all community questions or filter to see only "My Questions".
* **AI Summaries:** Instantly get a concise summary of any question and its details using AI Assisstance.
* **Sleek UI:** A responsive and interactive dashboard built with React.

##  Tech Stack :
* **Frontend (Client):**
    * **React +Vite**
    * **React Router**
    * **Lucide Icons**
    

* **Backend (Server):**
    * **Node.js**
    * **Express**
    * **PostgreSQL** 
    * **Grok API** 
    * **CORS**

##  Getting Started

### 1. Prerequisites

* Node.js (v18 or later)
* `npm`
* A Supabase account (for database URL and anon key)
* A Grok API key

### 2. Backend Server Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create an environment file:
    ```bash
    touch .env
    ```
4.  Add your secret keys to the `.env` file:
    ```env
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    GROK_API_KEY=YOUR_GROK_API_KEY
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:3000` locally.

### 3. Frontend Client Setup

1.  In a **new terminal**, navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The React app will be running on `http://localhost:5173` locally.

## API Endpoints
| `POST` | `/signup` | Creates a new user in Supabase Auth and the `users` table. |
| `POST` | `/login` | Signs in a user and returns a session token and user data. |
| `POST` | `/addpost` | (Auth protected) Adds a new question to the `posts` table. |
| `POST` | `/addreply` | (Auth protected) Adds a new reply to the `replies` table. |
| `GET` | `/allposts` | (Auth protected) Fetches all posts, excluding the user's own. |
| `GET` | `/myposts` | (Auth protected) Fetches only the posts created by the current user. |
| `GET` | `/postreplies/:postId` | (Auth protected) Fetches all replies for a specific post. |
| `POST` | `/toggleupvote` | (Auth protected) Adds or removes an upvote from a post for the current user. |
| `POST` | `/ai-summary` | (Auth protected) Generates a summary for a given title and content using Grok. |