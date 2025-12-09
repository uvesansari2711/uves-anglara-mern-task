# Senior MERN Stack Task — Anglara Digital Solutions

**By [Uves Ansari](https://github.com/uvesansari2711) — MERN Stack Developer**

## 🧾 Overview

This repository contains **Uves Ansari’s technical task** for the **Senior MERN Stack Developer position** at **Anglara Digital Solutions**.

It demonstrates:

- ⚙️ A **TypeScript-based Node.js + Express** backend
- 🗄️ **MongoDB integration** via Mongoose
- 🧪 **Integration & unit testing** with Jest & Supertest
- 🐳 **Docker containerization** (backend + MongoDB)
- 🧰 **Postman collection** for easy API testing
- 🧱 Clean code structure with environment-based configuration

---

## 🛠️ Tech Stack

| Layer                | Technology                      |
| -------------------- | ------------------------------- |
| **Backend**          | Node.js, Express.js, TypeScript |
| **Database**         | MongoDB (Mongoose ODM)          |
| **Testing**          | Jest + Supertest                |
| **Containerization** | Docker & Docker Compose         |
| **API Testing**      | Postman                         |
| **Package Manager**  | Yarn                            |

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/uvesansari2711/uves-anglara-mern-task.git
cd uves-anglara-mern-task
```

## 💻 Running Locally (without Docker)

```bash
yarn install
yarn build
yarn dev
```

Server will run at 👉 http://localhost:5000

### Connect to MongoDB in Compass

```
mongodb://localhost:27017/
```

---

## 🐳 Running the Application with Docker

### Build & Start Containers

```bash
docker compose up --build
```

### Connect to MongoDB in Compass

```
mongodb://localhost:27018
```

---

## 📬 Using the Postman Collection

1. Open **Postman**
2. Click **Import**
3. Choose:
   ```
   postman/senior-mern-task.postman_collection.json
   ```
4. The collection will be added under your workspace.

### 🧠 Collection Variables

Inside the Postman collection, two global variables are pre-declared for convenience:

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| **`base_url`** | The root API URL for requests (e.g., `http://localhost:5000/`) |
| **`token`**    | Stores the JWT token received after login                      |

### 🔐 How It Works

1. **Register or Login first**  
   Use the `/api/auth/register` or `/api/auth/login` endpoint.  
   You’ll get a `token` in the response.

2. **Set the Token Variable**

   - Go to the **collection variables** tab.
   - Paste the token value in the `token` variable.
   - Postman will now automatically inject this token into the `Authorization` header for all protected routes.

3. **Alternatively (Manual Option)**  
   You can also manually set the token for a single request:
   - Open the request
   - Go to **Headers** tab
   - Locate the Authorization header (Bearer {{Token}})
   - Replace the token value with your new JWT token

---

## 🧪 Running Tests

```bash
# Run locally
yarn test

```

---

## 👤 Author

**Uves Ansari**  
Senior MERN Stack Developer

- 🌐 [GitHub](https://github.com/uvesansari2711)
- 💼 [LinkedIn](https://www.linkedin.com/in/uves-ansari-1a898b209)
- 💻 [Portfolio](https://uvesansari-portfolio.netlify.app/)
- ✉️ [Email](mailto:uves.ansari027@gmail.com)

---

> Built with ❤️ by **Uves Ansari** for **Anglara Digital Solutions**.
