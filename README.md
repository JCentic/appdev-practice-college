# Campus Equipment Borrowing & Inventory Management System

> **Course:** IT415 – Application Development  
> **Activity:** Activity 1 – Problem Scenario & System Prototyping  
> **Category:** Campus Management  

---

## Project Overview & Purpose

### Why Was This Made?
This project was created as an academic exercise activity prepared by our course instructor for **IT415 (Application Development)**. The purpose of this activity is to practice designing and building a practical, real-world application from the ground up—tackling problem analysis, user workflows, state-driven data management, and modern component-based architecture.

### The Problem Scenario
In our college department, equipment borrowing (projectors, lab equipment, cables, cameras, and accessories) is currently recorded **manually using physical logbooks**. This creates several recurring challenges:
* **Students and Faculty** have no real-time visibility into whether equipment is available, currently reserved, or out for repair without physically visiting the department office.
* **Department Staff and Custodians** struggle to keep accurate records, track who is currently holding items, identify overdue returns, and inspect item conditions upon return.

This system digitizes the entire equipment lifecycle into a centralized, transparent, and easy-to-use platform.

---

## Objectives

### General Objective
> *"To design and develop an automated Campus Equipment Borrowing and Inventory Management System that provides real-time equipment availability for students and faculty, streamlines the borrowing and return workflow, and enhances accountability and tracking for department staff."*

### Specific Objectives
1. **Equipment Catalog & Real-Time Availability:** Develop a digital inventory catalog displaying real-time equipment statuses (`Available`, `Reserved`, `Borrowed`, `Under Maintenance`) accessible to students and faculty.
2. **Online Reservation & Borrowing Workflow:** Implement a digital borrowing request and check-out workflow to eliminate physical paperwork and manual logbook errors.
3. **Tracking & Return Verification:** Build a return and tracking module for department staff to inspect item condition upon return (`Good`, `Fair`, `Damaged`), record remarks, and update inventory.
4. **Automated Overdue Tracking & Alerts:** Implement logic to compute due dates and flag overdue items automatically based on borrower role limits.
5. **Reporting & Auditing:** Create an administrative view that provides borrowing history logs, active loans, and inventory audits for department staff.

---

## Tech Stack ("What I Used")

| Technology | Purpose | Description |
| :--- | :--- | :--- |
| **Vue.js 3** | Frontend Framework | Built using the **Composition API** with `<script setup>` for clean, modular, and reactive component development. |
| **Pinia** | State Management / Local DB | Acts as the application's central reactive database holding equipment data, borrowing transactions, and active user sessions. |
| **LocalStorage Persistence** | Client-Side Storage | Persists Pinia store state across browser refreshes so equipment records and transactions remain saved locally. |
| **Vite** | Build Tool & Dev Server | Fast, modern frontend development tooling with instant Hot Module Replacement (HMR). |
| **Vue Router 4** | Navigation & Views | Handles multi-page routing (`/catalog`, `/my-borrowings`, `/staff-dashboard`, `/inventory`). |
| **Tailwind CSS** | Styling | Utility-first CSS for a responsive, modern campus dashboard interface. |
| **vuejs-ai/skills** | AI Developer Skills | Project-level AI agent runbooks (`vue-best-practices`, `vue-pinia-best-practices`, `vue-router-best-practices`) installed in `.agents/skills` to ensure code consistency. |

---

## How It Works ("How It Was Built")

### 1. Client-Side "Local Database" via Pinia
Instead of requiring an immediate backend server, the application uses **Pinia stores backed by browser storage**:
* **`equipmentStore`**: Holds inventory records (item name, serial number, category, status, and physical condition).
* **`borrowStore`**: Records borrowing transactions (borrower ID, equipment ID, borrow date, due date, return date, and condition notes).
* **`userStore`**: Manages simulated authentication and role switching.

### 2. Role-Based Simulation
To facilitate easy testing and grading without complex authentication:
* **Students:** Can search the catalog, view real-time availability, and submit borrow requests (up to 2 items, 48-hour limit).
* **Faculty:** Extended borrowing duration (up to 7 days) and higher quota limits.
* **Department Staff:** Can approve requests, process checkouts, log returns with condition inspection, and monitor overdue equipment.

### 3. Automated Due Date & Overdue Logic
The application calculates due dates dynamically upon checkout. Whenever the catalog or staff dashboard is opened, the system checks records against the current date and automatically updates overdue statuses.

---

## Project Structure

```text
activity-1/
├── src/
│   ├── assets/              # Static assets and global styles
│   ├── components/          # Reusable UI components (EquipmentCard, StatusBadge, Modals)
│   ├── router/              # Vue Router configuration
│   ├── stores/              # Pinia stores (equipmentStore, borrowStore, userStore)
│   ├── views/               # Page views (Catalog, MyLoans, StaffDashboard, Inventory)
│   ├── App.vue              # Main application root
│   └── main.js              # Vue entry point & Pinia/Router initialization
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

---

## Getting Started (Run Locally)

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation
1. Clone or open the project folder in your terminal:
   ```bash
   cd "IT415 - AppDev/activity-1"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the displayed local URL (typically `http://localhost:5173`) in your browser.

---

## Author & Acknowledgments
* **Developer:** Josip Centic
* **Course:** IT415 – Application Development
* **Instructor:** Prepared as part of the classroom practical exercises to master modern web application development.
