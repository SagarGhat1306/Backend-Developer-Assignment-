Inventory Transaction API

A clean and simple backend application built using Node.js, Express.js, and MongoDB Atlas, designed to manage products and track inventory movements.
This API provides functionality to create products, update stock quantities, log every inventory transaction, and view detailed product summaries.
🚀Features

➕ Create New Product with unique SKU
📈 Increase Stock
📉 Decrease Stock with negative-stock protection
📊 Product Summary including total stock in/out
🧾 Transaction History for every product
🌐 MongoDB Atlas connection using environment variables
🧩 Clean MVC folder structure
🔐 Secure configuration using `.env`

---

 🛠 Tech Stack

Node.js
Express.js
MongoDB Atlas
Mongoose ODM
Postman / Thunder Client for testing

## 📁 Folder Structure

```
backend/
│── config/
│     └── db.js
│── controllers/
│     └── productController.js
│── models/
│     ├── Product.js
│     └── Transaction.js
│── routes/
│     └── productRoutes.js
│── .env
│── .gitignore
│── package.json
└── server.js


⚙️ **Installation & Setup**

1️⃣ Clone the repository

git clone https://github.com/your-username/inventory-api.git
cd inventory-api


2️⃣ Install dependencies


npm install


3️⃣ Create `.env` file


PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string


4️⃣ Start the server


npm run dev


Server will run on:

``` http://localhost:5000 ```



## 🔗 API Endpoints

### 📌 1. Create Product

POST `/api/products`
Body:

```json
{
  "name": "Laptop",
  "sku": "LP101",
  "initialStock": 20
}
```



### 📌 2. Increase Stock

POST `/api/products/:id/increase`
Body:

json
{
  "quantity": 5
}




### 📌 3. Decrease Stock

POST `/api/products/:id/decrease`
Body:

json
{
  "quantity": 3
}




### 📌 4. Product Summary

GET `/api/products/:id`

Returns product details, current stock, and summary of increases/decreases.

---

### 📌 5. Transaction History

GET `/api/products/:id/transactions`

Returns all INCREASE / DECREASE logs with timestamp.

---

## 🧪 Testing (Postman/Thunder Client)

Use these sample requests to test your API:

* Create Product
* Increase Stock
* Decrease Stock
* View Summary
* View Transactions

You can export screenshots and attach them to your submission.

---

## 🛡 Environment Variables

Make sure `.env` contains:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory_assignment
```
Output :



