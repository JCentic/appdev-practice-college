# Plan: Campus Equipment Borrowing and Inventory Management System

**Context**
A college department currently tracks equipment borrowing using paper logbooks. This causes problems because students and faculty cannot easily see if items are available, while staff members struggle to track borrowed, returned, and overdue equipment. We discussed building this project as an exam practice session to prepare for an upcoming timed assessment. To keep development fast, clean, and practical under exam time constraints, we agreed on a single-folder monolithic project using Vue 3 on the frontend and a lightweight Node.js Express server on the backend.

**Objectives**
- Practice building a complete mini full-stack application within an exam time limit.
- Provide a clear digital catalog so users can see equipment availability in real time.
- Remove manual paper logs by handling borrow requests and approvals online.
- Help department staff record equipment returns, check condition, and spot overdue items.
- Keep the project structure simple so it is easy to set up and run from a single folder.

**Requirements**
- Single project folder with one `package.json` file for both frontend and backend dependencies.
- Frontend built with Vue 3, Vite, Vue Router, and Pinia.
- Backend built with a simple Node.js Express REST API server in a single file (`server.js`).
- In-memory data or a simple JSON file for fast storage without needing database software.
- Central equipment catalog showing real-time item status (`Available`, `Reserved`, `Borrowed`, `Under Maintenance`).
- Role-Based Access Control (RBAC) supporting Borrower (Student/Faculty) and Staff/Admin roles through a simple role selector.
- Borrow request submission form for borrowers and an approval/rejection panel for staff.
- Return workflow for staff to record return condition (`Good`, `Damaged`, `Missing`).
- In-app alerts or badges for upcoming due dates and overdue items.
- Basic summary dashboard showing quick statistics like total items, currently borrowed items, and overdue items.

**Constraints**
- Must be quick to code and easy to remember for a timed exam environment.
- Monolithic single-folder structure to avoid managing multiple projects, folders, or virtual environments.
- No heavy external database servers (like PostgreSQL) to prevent setup delays.
- JavaScript only across the entire stack to avoid switching between different programming languages.

**Expected Output**
A working mini full-stack web application in one folder that can be started with simple npm commands. It will let students view equipment and submit borrow requests, while allowing staff to review requests, track item status, and log returns in real time.

**Next Step Suggestions**
1. Initialize the monolithic project by setting up Vite with Vue 3 and adding Express in the same folder.
2. Create the `server.js` file with basic sample equipment data and simple API routes.
3. Configure the Vite development server proxy so the Vue frontend can easily call the Express API.
4. Build the Pinia store and Vue pages for the equipment catalog and borrowing request form.
