# 🧭 TaskFlow – Team Task Manager

A modern, full‑stack web application for team project management with role‑based access, drag-and-drop Kanban boards, real‑time dashboards, and dark mode.
Built with React, Express, PostgreSQL, and Prisma.

🔗 **Live Demo:** [https://taskflow.up.railway.app](https://taskflow.up.railway.app) *(replace with your actual Railway URL)*

![TaskFlow Dashboard](https://via.placeholder.com/1200x600?text=TaskFlow+Preview)

---

## ✨ Features

### 🔐 Authentication & Roles
- JWT‑based authentication (login / register)
- Two roles: **Admin** and **Member**
- Admin can create projects, add/remove members, manage all tasks
- Members can view only assigned projects, update task statuses

### 📋 Project & Task Management
- Create, delete projects (Admin only)
- Add team members via user dropdown (with live search among all registered users)
- Full task CRUD with **priority** (Low, Medium, High) and **status** (To Do, In Progress, Done)
- Assign tasks to project members

### 📊 Interactive Dashboard
- Personal task overview: count cards (Total, In Progress, Completed, Overdue)
- Pie chart showing task distribution
- Overdue and upcoming deadline alerts
- High‑priority indicator

### 🎯 Kanban Board (Drag & Drop)
- Smooth drag‑and‑drop using `@hello-pangea/dnd`
- Columns: To Do, In Progress, Done
- Drag tasks between columns → status updates instantly via API
- List view also available

### 🌙 UI / UX
- Clean, professional design with **Tailwind CSS**
- **Dark mode** toggle (persisted in localStorage)
- Responsive layout (mobile‑ready)
- Subtle animations with Framer Motion
- Glassmorphism cards, gradient accents, smooth transitions
- Eye‑icon for password visibility

---

## 🛠 Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Frontend    | React, React Router, Tailwind CSS, Framer Motion |
| State & Data| Axios, React Context                       |
| Backend     | Node.js, Express                          |
| ORM         | Prisma                                    |
| Database    | PostgreSQL                                |
| Auth        | JSON Web Tokens (JWT), bcryptjs           |
| Validation  | express-validator                         |
| Deployment  | Railway (with automatic CI/CD)            |

---

## 📁 Project Structure

team-task-manager/
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── api/ # Axios instance
│ ├── components/ # Reusable UI components (Navbar, TaskCard, TaskForm)
│ ├── contexts/ # AuthContext, ThemeContext
│ ├── pages/ # Landing, Login, Register, Dashboard, Projects, ProjectDetail
│ ├── App.js
│ ├── index.js
│ └── index.css
├── server/ # Express backend
│ ├── prisma/
│ │ └── schema.prisma # Database schema
│ ├── routes/
│ │ ├── auth.js # Register, Login, /me, /users
│ │ ├── projects.js # CRUD + member management
│ │ └── tasks.js # CRUD + status changes
│ ├── middleware/
│ │ └── auth.js # JWT verification & role guard
│ ├── seed.js # Create admin user
│ ├── index.js # Entry point
│ └── .env.example
└── README.md


---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js ≥ 16
- PostgreSQL (local or cloud)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
