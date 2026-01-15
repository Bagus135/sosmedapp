# 📱 Fesnuk - Sosmed App 

**Fesnuk** is a social media application designed for sharing thoughts, opinions, and discussions in a fast, open, and interactive way. The app enables users to create , react and comment posts that make online communication more interactive and engaging.

---

## 🚀 Project Description

This is my first project that using NEXT JS for the main framework. This app project was inspirated from Threads and Twitter App. Fesnuk allows users to create a posts , which can be commented dan reacted by other users, forming conversations in a clean and organized layout. With features like following users, liking posts, real-time updates, notifications, and customizable profiles, Fesnuk creates a dynamic social environment focused on interactive and exiting interactions.

---

## ✨ Features

- **User Accounts & Custom Profiles**  
  Users can create personal accounts and fully customize their profiles, including profile photos, display names, usernames, and bio descriptions, etc.

- **Create Posts**  
  Create a Post to share ideas, stories, or opinions, and also can attach a picture. 

- **Comments**  
   Post a comments to posts to share your opinion about the posts.

- **Likes & Engagement**  
  Like posts to show appreciation.

- **Follow System**  
  Follow other users and view their posts on your personal timeline.

- **Search & Discovery**  
  Search for users using keywords and visits its profile.

- **Real-Time Updates**  
  Threads and replies update in real time without refreshing the page.

- **Notification System**  
  Receive real-time notifications for likes, replies, follows, and other interactions.

- **Secure & Moderated Environment**  
  Basic moderation and security help keep the platform safe and friendly.

---

## 🛠️ Tech Stack

- **Next.js** – Frontend dan Backend Framework
- **PostgreSQL** – Database
- **Prisma** – ORM
- **TailwindCSS** – Styling CSS

---

## 📦 Installation & Running the App


1. Clone the repository:
    ```bash
    git clone https://github.com/Bagus135/ChatApp.git
    ```

 2. Install Node Modules :
    ```bash
    npm i
    ```

3. Create a file `.env` in root directory :
    ``` txt
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/xxxxx"
    jwtSecret="yourjwtsecret""
    ```

4. Initiate Prisma ORM:
    ``` bash
    npx prisma db push
    npx prisma generate
    ```

5. Running project in dev mode :
    ``` bash
    npm run dev
    ```

6. Open the browser :
    ```
    http://localhost:3000/
    ```


## 📄 License

This project is open-source and free to use for learning and development.
