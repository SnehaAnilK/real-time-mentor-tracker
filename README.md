# Real-Time Mentorship Tracking & Analytics
**Full-Stack Implementation | Flutter • Node.js • PostgreSQL**

## 🚀 Overview
A live-streaming location system designed for campus mentorship discovery. This project enables mentors to broadcast their real-time location to students and persists session data into a relational database for administrative analytics.

## 🛠️ Tech Stack
* **Frontend**: Flutter (Cross-platform)
* **Backend**: Node.js & Express.js
* **Real-time Engine**: Socket.io (WebSockets)
* **Database**: PostgreSQL via Supabase
* **Mapping**: OpenStreetMap & Flutter Map

## 🌟 Key Features
* **Live Coordinate Streaming**: Implemented low-latency bi-directional communication using WebSockets to track mentor movement with sub-second updates.
* **Stateless API Design**: Developed a RESTful architecture in Node.js to handle session logging, ensuring the system can scale horizontally.
* **Relational Analytics**: Utilized SQL Views in PostgreSQL to aggregate weekly session data, including total mentoring minutes and session counts.
* **Session Persistence**: Implemented JSONB storage for complex path-data history, allowing for historical path visualization.

## 📊 Database Schema
The project utilizes a Relational PostgreSQL schema:
- `mentor_sessions`: Stores `mentor_id`, `duration`, and `path_data` (JSONB).
- `weekly_mentor_stats`: A SQL View for real-time reporting of mentor activity.

---
**Developer**: Sneha A (PES1UG23CS582)  
**Location**: Bengaluru, India
