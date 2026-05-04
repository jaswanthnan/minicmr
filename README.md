# Mini Recruitment CRM 🚀

A modern, AI-powered Recruitment Management System (CRM) designed to streamline the hiring process. Built with a focus on premium UI/UX, data-driven analytics, and AI automation.

![Login Page](https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

## ✨ Key Features

### 📊 Intelligence Dashboard
- **Real-time Analytics**: Visualise your recruitment funnel with modern semi-circle gauges and donut charts.
- **Top Skills Tracking**: Automatically identifies and ranks the most in-demand skills from your job postings.
- **Metric Highlights**: Quick-view cards for total talent, active roles, hired candidates, and open jobs.

### 👤 Candidate Management
- **Smart Pipeline**: Manage candidates through different stages (Applied, Interview, Selected, Hired).
- **Advanced Search**: High-performance search engine to filter talent by name, skills, or status.
- **Bulk Actions**: Export talent data to CSV or perform bulk deletions.
- **Internal Focus**: Modal-based editing with internal scrolling for a seamless experience.

### 🤖 AI-Powered Tools
- **CV Summariser**: Quickly extract the essence of complex resumes using AI.
- **JD Generator**: Architect professional job descriptions in seconds by selecting role parameters and required skills.

### 🔐 Secure Experience
- **Firebase Authentication**: Robust login and account creation system.
- **Premium Login UI**: Featuring rotating motivational business quotes with dynamic color gradients.

---

## 🛠️ Technology Stack

**Frontend:**
- React.js (Vite)
- Ant Design (UI Framework)
- Recharts (Data Visualisation)
- Axios (API Communication)
- Firebase (Auth)

**Backend:**
- Node.js & Express
- MongoDB (Database)
- Mongoose (ODM)
- Dotenv (Configuration)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB account (Atlas or Local)
- Firebase Project (for Auth)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd mini-recruitment-crm
```

### 2. Backend Setup
```bash
cd serve
npm install
```
Create a `.env` file in the `serve` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
# Add other AI API keys if applicable
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
# From the root directory
cd mini-recruitment-crm
npm install
```
Start the frontend:
```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

---

## 📂 Project Structure

```
├── mini-recruitment-crm/    # Frontend React App
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main application views (Dashboard, Jobs, etc.)
│   │   └── firebase.js      # Firebase configuration
│   └── ...
└── serve/                   # Backend Express App
    ├── routes/              # API Endpoints
    ├── models/              # Database Schemas
    ├── config/              # Database connection
    └── server.js            # Entry point
```

---

## 🎨 Design Philosophy
This project follows a **Premium Dark/Light Hybrid** aesthetic. We prioritize:
1. **Internal Scrollability**: Modals and sidebars scroll internally to keep the main dashboard stable.
2. **Vibrant Gradients**: Used for text and indicators to provide a modern "SaaS" feel.
3. **Micro-animations**: Subtle transitions for quote rotations and chart updates.

---

## 📄 License
This project is for educational/capstone purposes.

---
*Built with ❤️ for modern recruiters.*
