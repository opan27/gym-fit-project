# Gym Fit Backend 🚀

Gym Fit Backend adalah aplikasi **Node.js (Express)** yang berfungsi sebagai backend API sekaligus menyajikan halaman HTML sederhana untuk autentikasi dan profil user. Backend ini menggunakan **Prisma ORM** untuk manajemen database dan dirancang untuk terintegrasi dengan **Gym Fit Mobile App (React Native)**.

---

## 🚀 Tech Stack
- Node.js
- Express.js
- Prisma ORM
- MySQL / PostgreSQL
- JWT Authentication
- dotenv
- HTML (simple frontend pages)

---

## 📦 Requirements
Pastikan environment berikut sudah terinstall:

- Node.js (disarankan LTS)
- npm
- Database (MySQL / PostgreSQL)
- Prisma CLI

Cek environment:
```bash
node -v
npm -v
````

---

## ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/username/gym-fit-project.git
cd gym-fit-project
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Buat file `.env` di root project:

```env
PORT=4000
DATABASE_URL="mysql://user:password@localhost:3306/gym_fit_db"
JWT_SECRET=your_jwt_secret
```

> ⚠️ File `.env` bersifat rahasia dan **tidak boleh di-commit ke repository**

---

## 🧬 Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Jalankan migration:

```bash
npx prisma migrate deploy
```

Untuk development:

```bash
npx prisma migrate dev
```

Seed data (opsional):

```bash
node prisma-seed.js
```

Buka Prisma Studio:

```bash
npx prisma studio
```

---

## ▶️ Running the Server

Jalankan server:

```bash
node .\src\server.js
```

Server berjalan di:

```
http://localhost:4000
```

---

## 🌐 Available Pages (HTML)

| Page     | URL         |
| -------- | ----------- |
| Home     | `/`         |
| Login    | `/login`    |
| Register | `/register` |
| Profile  | `/profile`  |

---

## 📁 Project Structure

```
gym-fit-project/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/         # konfigurasi app
│   ├── controllers/    # logic controller
│   ├── db/             # database handler
│   ├── generated/      # prisma client / auto generated
│   ├── middlewares/    # auth & middleware
│   ├── routes/         # API routes
│   ├── services/       # business logic
│   └── utils/          # helper & utility
├── app.js              # express app config
├── server.js           # entry point server
├── index.html
├── login.html
├── register.html
├── profile.html
├── prisma-seed.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🔑 Authentication

Backend menggunakan **JWT (JSON Web Token)**.

Header Authorization:

```http
Authorization: Bearer <token>
```

---

Siap 👍
Berikut **BAGIAN README – DAFTAR ENDPOINT LENGKAP** yang **SUDAH DISUSUN RAPI** berdasarkan struktur backend + endpoint yang kamu pakai sekarang (Auth, Me, Missions, User Missions, User Sessions).

👉 Tinggal **tambahkan bagian ini ke README backend kamu** (copy–paste).

---

## 📌 API Endpoints Documentation

Base URL:

```
http://localhost:3000/api
```

Semua endpoint (kecuali auth) **membutuhkan JWT** pada header:

```http
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication

### Register User

**POST** `/api/auth/register`

Request body:

```json
{
  "email": "user@email.com",
  "password": "password",
  "name": "John Doe"
}
```

Fungsi:

* Mendaftarkan user baru

---

### Login

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "user@email.com",
  "password": "password"
}
```

Response:

```json
{
  "token": "jwt_access_token",
  "user": {
    "id": 1,
    "email": "user@email.com"
  }
}
```

Fungsi:

* Login user
* Mengembalikan JWT access token

---

## 👤 Me (Profil User)

### Get Profile

**GET** `/api/me`

Fungsi:

* Mengambil data profil user yang sedang login

---

### Update Profile

**PATCH** `/api/me`

Request body (contoh):

```json
{
  "goal": "lose_weight",
  "height": 170,
  "weight": 70,
  "activityLevel": "moderate"
}
```

Fungsi:

* Update profil user (goal, tinggi, berat, activity level, dll)

---

## 🎯 Missions

### Get Recommended Missions

**GET** `/api/missions/recommended`

Fungsi:

* Mengambil daftar mission yang direkomendasikan
* Berdasarkan **goal, activity level, dan BMI**

---

### Get All Missions

**GET** `/api/missions`

Fungsi:

* Mengambil semua mission

---

### Get Mission Detail

**GET** `/api/missions/:id`

Fungsi:

* Mengambil detail satu mission berdasarkan ID

---

## 🧩 User Missions

### Choose / Assign Mission

**POST** `/api/user-missions`

Request body:

```json
{
  "missionId": 1
}
```

Fungsi:

* Memilih / menetapkan mission ke user

---

### Get Active Mission

**GET** `/api/user-missions/active`

Fungsi:

* Mengambil mission yang sedang aktif untuk user

---

### Get Today Session (Active Mission)

**GET** `/api/user-missions/active/sessions/today`

Fungsi:

* Mengambil session hari ini dari mission aktif user

---

## 🏃 User Sessions

### Start Session

**POST** `/api/user-sessions/start`

Request body:

```json
{
  "userMissionSessionId": 10
}
```

Fungsi:

* Mengubah status session menjadi `in_progress`
* Mengembalikan data session (durasi target, status, dll)

---

### Log / Finish Session

**POST** `/api/user-sessions/:userMissionSessionId/log`

Request body (contoh):

```json
{
  "actualDurationMinutes": 60,
  "perceivedIntensity": "medium",
  "caloriesEstimated": 320,
  "moodBefore": "neutral",
  "moodAfter": "happy",
  "note": "Mission selesai",
  "proofPhotoUrl": null,
  "exercises": [
    {
      "exerciseId": 1,
      "setNumber": 1,
      "reps": 10,
      "weight": 40
    }
  ]
}
```

Fungsi:

* Menyimpan log session user
* Update status session (`completed` jika target tercapai)

---

### Get Session History

**GET** `/api/user-sessions`

Query opsional:

```
?from=2026-01-01&to=2026-01-31&limit=20
```

Fungsi:

* Mengambil riwayat session user

---

### Test Route (Optional)

**GET** `/api/user-sessions/test`

Fungsi:

* Test routing / health check (jika masih aktif)

---

## 📝 Notes
* Semua endpoint (kecuali login & register) **wajib JWT**
* Struktur endpoint mengikuti RESTful API
* Prisma digunakan untuk seluruh operasi database
* Folder `node_modules` dan file `.env` **tidak masuk git**
* Folder `prisma/migrations` **WAJIB di-commit**
* Jangan hardcode credential database
* Restart server setelah update `.env`

---

## 🐞 Troubleshooting

Jika Prisma error:

```bash
npx prisma generate
npx prisma migrate deploy
```

Jika port sudah digunakan:

```bash
netstat -ano | findstr :3000
```

---

## 🤝 Contributing

Kontribusi sangat terbuka:

1. Fork repository
2. Buat branch fitur
3. Commit perubahan
4. Ajukan Pull Request

---
