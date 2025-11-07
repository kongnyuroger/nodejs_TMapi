
# Task Managment API

DEPLOYED LINK https://nodejs-tmapi.onrender.com
Swagger docs available at: http://localhost:3000/api-docs
                        : https://nodejs-tmapi.onrender.com/api-docs
## Quick start
1. clone project
    ```bash
   git clone https://github.com/kongnyuroger/nodejs_TMapi.git
   cd  nodejs_TMapi
   ```
2. Install dependencies
   ```bash
   npm i
   ```
3. Run dev server
   ```bash
   npm run dev
   ```
3. Set up environment variables
   - By default, the app expects the backend at `http://localhost:3000`.

## Features

User registration & login (JWT-based)

Password hashing (bcrypt)

Create, update, delete, and view tasks

Assign tasks to users

Task status: todo, in-progress, done

Pagination & sorting for task lists

Input validation for title, email, and due_date

Rate limiting middleware

Only creator or assignee can modify tasks

## API Endpoints
####    Method	    Endpoint	        Description
        POST	/api/auth/register	      Register a new user(username,email,password)
        POST	/api/auth/login	         Login user,(email,password), returns JWT token 
       
        GET	   /api/tasks	               Get tasks (pagination & sorting)
        POST	/api/tasks	              Create a task (title, description, due_date, assigned_to(id))
        PUT	   /api/tasks/:id	            Update a task (title, description, due_date, status)
        PATCH	/api/tasks/:id/complete	   Mark task as done
        DELETE	/api/tasks/delete/:id	Delete a task

All task endpoints require Authorization: Bearer <token>

#Folder Structure

src/
 ├── app.js                
 ├── server.js             
 ├── routes/
 │   ├── authRoutes.js     
 │   └── taskRoutes.js    
 ├── controllers/
 │   ├── authController.js
 │   └── taskController.js
 ├── middleware/
 │   ├── auth.js           
 │   └── ratelimiting.js
 ├── utils/
 │   └── crypto.js         
 ├── database/
 │   └── db.js             
 └── .env
