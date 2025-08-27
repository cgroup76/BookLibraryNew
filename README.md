# 📚 Book Store — Google Books Digital Library
A digital-library web app where users can browse, borrow, review, and discuss books with **real-time messaging** and **smart recommendations**.

**Live:** https://proj.ruppin.ac.il/cgroup76/test2/tar6/index.html  

---

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** C# (.NET)
- **Database:** SQL Server (SSMS)
- **Auth:** Google OAuth 2.0
- **Real-Time:** SignalR (live messages)
- **APIs:** Google Books API
- **AI/Algorithms:** KNN-based recommendations (by user purchase/behavior)
- **Sessions:** 20-minute inactivity timeout
- **Hosting:** Azure App Service (web app)

---

## ✨ Core Features

### Home
- Top-5 books by user rating
- Full-text search (title / authors / description / snippet) with highlighted matches
- Voice-to-text search (browser speech support: Chrome / Opera / Samsung Internet)
- Quick book info drawer/card

### My Books
- See all books the user purchased
- Mark book as **Read**
- Add **reviews & ratings**
- Personalized recommendations using **KNN** over features (title, author, genre) and user history
- Details panel for each recommended book

### Books Club
- Create a club for a specific book
- Join/leave clubs
- Create posts in a club
- Upload images to posts (supports image blob → PNG on server)
- (Optional) Generate images via **Hugging Face** and attach to posts
- Like posts, search clubs

### Games
- **Hangman**, **Memory**, **Quiz**
- Generate random online games
- Leaderboards: show **Top 5** results for each game
- Fun activities for all ages

### Shared Functionality
- Common JS utilities shared across pages
- **User session tracking** (auto-logout after 20 minutes of inactivity)
- **SignalR** server for live messages (handles book requests & chat)
- **Google OAuth 2.0**: Login & signup with Google

---

## 🧠 Recommendation Engine (KNN)
- Computes similarity between users to recommend books based on **purchase history** and **content features**
- Uses Dynamo-style feature selection (title, author, genre) but persists user/book data in **SQL Server**
- Designed for quick lookups and scalable reads

---

## 📷 Screens & UI (from screenshots)
- **Books Club:** club feed, image uploads, likes, search
- **Games:** Hangman, Memory, Quiz with Top-5 leaderboard
- **My Books:** library shelf, read/mark, reviews, recommendations
- **Home:** hero section, recommended list, search & voice search
- **Admin / Infra:** Azure App Service dashboard, SignalR settings

---

## 📌 Highlights
- Real-time messaging with **SignalR**
- **Google Books API** integration
- **KNN** recommendations tailored to each user
- Login with **Google OAuth 2.0**
- Session management with **20-minute** timeout
- Mini-games with leaderboards to boost engagement
- Clean, dark-theme UI with focused reading experience

---

## 🚀 Getting Started (Dev)
1. Clone repo and open the solution in **Visual Studio**.
2. Configure `appsettings.json`:
   - SQL Server connection string
   - Google OAuth 2.0 keys
   - SignalR hub URL (if external)
3. Run DB migrations/seed (if included).
4. Press **F5** to run locally; open the site and sign in with Google.

---

## 🔒 Notes on Security & Privacy
- OAuth tokens handled server-side; no secrets committed to source.
- Session timeout: 20 minutes of inactivity.
- Input validation for posts, reviews, and image uploads.

