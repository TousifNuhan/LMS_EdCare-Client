# EdCare — Learning Management System

EdCare is a full-stack, role-based online learning platform where **students** buy and learn from courses, **teachers** publish courses and earn from them, and **admins** moderate the whole marketplace. Payments are handled in **BDT** through **SSLCommerz** (cards, bKash, Nagad, etc.), and course discovery is enhanced with **AI-powered recommendations**.

---

## 🔗 Live Links

| | |
|---|---|
| **Live Site** | https://edcare-56e4b.web.app/ |
| **Client Repository** | https://github.com/TousifNuhan/LMS_EdCare-Client |
| **Server Repository** | https://github.com/TousifNuhan/LMS_EdCare-Server |



---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@gmail.com` | `Aa123456!!!` |
| **Teacher** | `athorne@edumanage.com` | `Aa123456!!!` |
| **Student** | `edcare@gmail.com` | `Aa123456!!!` |



---

## ⭐ Key Highlights

- **Secure JWT authentication** — Firebase Auth on the client, JWT-protected API routes with role guards (`verifyToken`, `verifyAdmin`, `verifyTeacherOrAdmin`) on the server
- **TanStack Query** for data fetching, caching, and mutations across all dashboards
- **SSLCommerz payment gateway (BDT)** with server-side validation and IPN webhook handling
- **AI-powered course recommendations** using Gemini text embeddings and cosine similarity
- **Complete learning workflow** — progress tracking, GitHub-based assignments, grading, and downloadable PDF certificates

---

## ✨ Features

### 🎓 Student
- Browse, search, and filter courses by category; view detailed course pages with live rating breakdown
- Add to cart or buy instantly; checkout with SSLCommerz in BDT
- Course player with lesson-by-lesson progress tracking
- Submit assignments via GitHub repository links and receive grades + feedback
- Earn a **downloadable PDF certificate** after passing every assignment (≥ 80)
- Leave one review per enrolled course
- Request refunds (within 7 days of purchase and under 25% of content viewed)
- View payment history and printable receipts
- Personalized and related course recommendations

### 👩‍🏫 Teacher
- Apply to become a teacher; admin reviews the application
- Create, edit, and manage courses (modules, lessons, free preview lessons)
- Create, edit, and delete assignments (deletion is protected once graded work exists)
- Grade student submissions and view enrolled students per course
- Earnings dashboard with per-course sales breakdown
- Save a bKash payout method and request payouts

### 🛡️ Admin
- Role-based overview dashboard with revenue, refunds, and pending-approval stats
- Approve / reject courses and teacher applications
- Manage users — change roles, **deactivate / reactivate** accounts (deactivated teachers' courses stay available but close to new enrollments)
- Approve or reject refund requests and teacher payout requests
- Financial audit page with transactions, platform commission, and payouts
- Configurable **platform fee** — each payment locks in the rate active at purchase time
- Newsletter subscriber management

### 🌐 Public
- Responsive landing page, About Us (live platform stats and featured instructors), FAQ, contact form, and newsletter signup

---

## 🛠️ Tech Stack

**Client**
- React 19 + Vite
- Tailwind CSS 4
- React Router 7
- TanStack Query
- Firebase Authentication & Hosting
- Axios (with secure interceptor), React Hook Form
- Framer Motion, React Icons, React Hot Toast, SweetAlert2
- jsPDF + html2canvas-pro (certificate generation), EmailJS (contact form)

**Server**
- Node.js + Express 5
- MongoDB (native driver)
- JSON Web Tokens (`jsonwebtoken`)
- SSLCommerz (`sslcommerz-lts`)
- Google Generative AI (Gemini embeddings)
- Deployed on Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster
- A Firebase project (Authentication enabled)
- SSLCommerz sandbox credentials ([sslcommerz.com](https://www.sslcommerz.com))
- A Google AI Studio API key (Gemini)

### 1. Clone the repositories
```bash
git clone https://github.com/TousifNuhan/EdCare-Client.git
git clone https://github.com/TousifNuhan/EdCare-Server.git
```

### 2. Run the server
```bash
cd EdCare-Server
npm install
```

Create a `.env` file:
```env
PORT=5001
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key

SSLC_STORE_ID=your_sslcommerz_store_id
SSLC_STORE_PASSWORD=your_sslcommerz_store_password
SSLC_IS_LIVE=false

SERVER_URL=http://localhost:5001
CLIENT_URL=http://localhost:5173
```

Start it:
```bash
npm start
```

### 3. Run the client
```bash
cd EdCare-Client
npm install
```

Create a `.env.local` file with your Firebase and API settings (adjust the names to match your project):
```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_API_URL=http://localhost:5001
```

Start it:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 💳 Payment Flow (SSLCommerz)

1. Student clicks **Pay** → client calls `POST /payment/init`
2. Server stores a `pendingPayments` record and gets a gateway URL from SSLCommerz
3. Student is redirected to SSLCommerz's hosted payment page
4. On success, SSLCommerz redirects to `/payment/success` and also calls `/payment/ipn` (server-to-server)
5. Server validates the transaction (`val_id`), records the payment, creates enrollments, and clears the cart
6. Student lands back on **Payment History** with a status toast

> Use the SSLCommerz **sandbox** test cards/wallets while developing. Teacher payouts and refunds are processed manually (bKash) and recorded through the admin dashboard.

---

## 🌍 Deployment

- **Client:** Firebase Hosting (`npm run build` → `firebase deploy`)
- **Server:** Vercel (`vercel.json` included)
- Remember to add your deployed client URL to the server's CORS origins and set `SERVER_URL` / `CLIENT_URL` to the production URLs.

---

## 👤 Author

**Gazi Mubtasim Tousif Nuhan**
GitHub: [@TousifNuhan](https://github.com/TousifNuhan)

---

## 📄 License

This project was built for educational purposes as part of a practicum project.