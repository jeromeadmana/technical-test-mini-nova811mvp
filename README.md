# Mini Nova Ticketing System

This project is a simple ticketing system built with **React (TypeScript)** frontend and **Node.js / Express / TypeORM** backend. It supports:

* User authentication with JWT
* Ticket creation, renewal, and closing
* Ticket import via JSON file
* Role-based access: Admin and Contractor
* Black-and-white UI design with solid borders

---

## 🛠 Prerequisites

* Node.js >= 22.15.1
* npm >= 9.9.4
* Git

> The backend uses **SQLite** for development, no separate DB installation required.

---

# 🚀 Project Setup

## 📥 Clone the repository

```bash
git clone https://github.com/jeromeadmana/technical-test-mini-nova811mvp.git
cd project
```

---

## 📦 Install dependencies

Install dependencies for both **backend** and **frontend** in one command:

```bash
npm run install:all
```

---

## 🗄️ Seed the database

This creates the SQLite DB and initial users:

```bash
npm run seed --prefix backend
```

---

## ▶️ Start the application

Run **backend** and **frontend** together:

```bash
npm start
```

* Backend API → [http://localhost:4000](http://localhost:4000)
* Frontend app → [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

If needed, update the API URL in the frontend at:

```ts
// frontend/src/services/api.ts
const API_URL = "http://localhost:4000";
```

---

## 🔑 Authentication

* Login is done via JWT.
* Admin and Contractor users can **close tickets** and **view all tickets**.
* Contractor users can **view only their tickets**.

**Default seeded users** (from `npm run seed`):

| Role       | Username      | Password |
| ---------- | ------------- | -------- |
| Admin      | admin         | admin123 |
| Contractor | contractor1   | pass123  |
| Contractor | contractor2   | pass123  |

---

## 💻 Features

### Tickets

* **Create Ticket** – Open modal and add a ticket.
* **Renew Ticket** – Extends expiration by 15 days.
* **Close Ticket** – Admin only; closes the ticket.
* **Import Tickets** – Upload a JSON file with ticket data.

**Sample JSON for import**:

```json
[
  {
    "title": "Printer not working",
    "organization": "Finance Department",
    "createdDate": "2025-09-05",
    "expirationDate": "2025-09-20",
    "location": "3rd Floor, Office 302",
    "notes": "Paper jam error when printing",
    "status": "open"
  },
  {
    "title": "Broken monitor",
    "organization": "IT Support",
    "createdDate": "2025-09-01",
    "expirationDate": "2025-09-07",
    "location": "Room 210",
    "notes": "Screen flickers randomly"
  },
  {
    "title": "Internet Issues",
    "organization": "Operations",
    "createdDate": "2025-09-05",
    "expirationDate": "2025-09-10",
    "location": "HQ, California",
    "notes": "Playing Dinosaur Game Instead"
  }
]

```

> `ticketNumber`, `createdDate`, `expirationDate`, and `createdBy` are automatically set by the backend.

---

## 🖤 UI Design

* Black-and-white UI
* Solid borders for table, buttons, modals, and inputs
* No rounded corners

---

## 📌 Notes

* Ensure JWT token is stored in `localStorage` after login.
* File import validates JSON structure and automatically assigns the current logged-in user as `createdBy`.

---
