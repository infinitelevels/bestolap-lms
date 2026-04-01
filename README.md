<<<<<<< HEAD
# bestolap-lms
# 🎓 Bestolap Tuition LMS

A full-stack Learning Management System (LMS) for managing student enrolment, tutoring services, payments, and communication — built with Node.js, MongoDB, and modern frontend technologies.

---

## 🚀 Live Architecture

* 🌐 Frontend: Netlify
* ⚙️ Backend API: Render
* 🗄️ Database: MongoDB Atlas
* 💳 Payments: Paystack
* 📧 Email Service: Zoho SMTP

---

## 📌 Features

### 🎯 Core Features

* Student enrolment system
* Automatic Student ID generation
* Invoice generation
* Paystack payment integration
* Email notification to parents & admin
* Admin alert system

---

### 📚 Academic Services

* Mathematics
* English
* Science
* Coding
* Verbal & Non-Verbal Reasoning
* Exam Preparation (SATs, 11+, GCSE, US & Canada Exams)

---

### ⚙️ Advanced Features

* Dynamic country & state selection
* Session type selection (online / physical)
* Monthly fee calculation (₦10,000/hour rate)
* MongoDB data storage (replacing Excel)
* Secure API endpoints
* Environment variable configuration

---

## 🏗️ Project Structure

```
Bestolap/
│
├── client/                  # Frontend (HTML, CSS, JS)
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/bestolap.git
cd bestolap
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
PAYSTACK_SECRET_KEY=your_paystack_secret
EMAIL_USER=your_zoho_email
EMAIL_PASS=your_zoho_password
CLIENT_URL=https://your-netlify-site.netlify.app
```

---

### 4️⃣ Run Server

```
node server.js
```

---

## 🌐 API Endpoints

### 📌 Enrolment

```
POST /api/enroll
```

Handles:

* Student registration
* Student ID generation
* Invoice creation
* Payment link generation

---

### 📌 Location

```
GET /api/location/countries
GET /api/location/states/:countryCode
```

---

### 📌 Payment Webhook (Paystack)

```
POST /api/paystack/webhook
```

---

## 🔐 Security

* Environment variables for sensitive data
* Paystack webhook verification
* Input validation & sanitization
* CORS configuration

---

## 💳 Payment Flow

1. Parent submits enrolment form
2. System generates:

   * Student ID
   * Invoice
   * Payment reference
3. Paystack payment link is created
4. Parent receives email with payment link
5. Payment confirmation via webhook
6. Admin is notified

---

## 📧 Email System

Uses Zoho SMTP to:

* Send invoice to parents
* Notify admin of new enrolments
* Confirm successful payments

---

## 🚀 Deployment

### 🔹 Frontend (Netlify)

* Connect GitHub repo
* Deploy static files

---

### 🔹 Backend (Render)

* Create Web Service
* Set build command: `npm install`
* Set start command: `node server.js`
* Add environment variables

---

## ⚠️ Important Notes

* Do NOT install `crypto` via npm (use built-in Node module)
* Redis is optional and not required for current setup
* MongoDB Atlas must allow network access (0.0.0.0/0 for testing)

---

## 📈 Future Improvements

* User authentication (students & parents)
* Dashboard analytics
* Tutor management system
* Live classes integration (Zoom/Teams)
* OTP verification system
* Redis caching (optional)

---

## 👨‍💻 Author

Developed by Bestolap Tuition

---

## 📜 License

This project is licensed for private and commercial educational use.

---

## 💡 Support

For setup or technical support:

📧 [support@bestolap.com](mailto:support@bestolap.com)

---

## ⭐ Acknowledgements

* Node.js ecosystem
* MongoDB Atlas
* Paystack API
* Zoho Mail SMTP

---

> Empowering students with flexible, world-class education 🌍
=======
"# bestolap-lms" 
>>>>>>> 7978c29 (first commit)
