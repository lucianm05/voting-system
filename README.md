# 🗳️ Internet Voting System

This project is a fully functional web application designed to support **secure** and **anonymous** democratic voting for Romania over the internet. It was developed as part of my master’s thesis _“Internet Voting System for Democratic Elections”_. This project was developed for academic purposes. The system architecture, security mechanisms, and database design are focused on ensuring transparency, data integrity, and voter privacy in online democratic elections.

---

## 🧩 Key Features

- ✅ Secure authentication using **ID card + facial recognition**
- ✅ Accessible and intuitive interface for **citizens and administrators**
- ✅ Encrypted vote storage using **AES encryption**
- ✅ **Anonymization** of voter identity & prevention of duplicate votes
- ✅ **Real-time** vote counting with **atomic transactions**
- ✅ Citizens can **revote** during the active election period

---

## 🛠️ Technologies Used

| Layer        | Technology                   |
|--------------|------------------------------|
| Frontend     | React.js + Mantine UI        |
| Backend      | AdonisJS (Node.js)           |
| Communication| Inertia.js                   |
| Database     | PostgreSQL                   |
| Security     | AES encryption, SHA256 hash  |

---

## 🏛️ Architecture

The application follows a **modular monolithic** architecture, composed of:

- **Client module:** Developed in React.js, responsible for UI rendering and form handling.
- **Server module:** Built with AdonisJS, handles routing, validation, business logic, encryption, and database interaction.
- **Database layer:** PostgreSQL with ACID-compliant transaction support.

Communication between the client and server is handled through **Inertia.js**, which bridges server-side routing with frontend interactivity—offering a SPA-like experience with server-rendered pages.
