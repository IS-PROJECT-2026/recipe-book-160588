# Sharlet's Baking Recipe Book

A dynamic, front-end focused web application that allows users to discover, categorize, and submit baking recipes. Built as a comprehensive academic project emphasizing secure cloud database integration, responsive UI design, and strict Agile version control.

**(https://is-project-2026.github.io/recipe-book-160588/)**

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Firestore Data Model](#-firestore-data-model)
- [Project Architecture & Methodology](#-project-architecture--methodology)
- [Installation & Setup](#-installation--setup)
- [Firebase Configuration](#-firebase-configuration)
- [Author](#-author)

---

## Overview

**Sharlet's  Baking Recipe Book** is a community recipe platform purpose-built for bakers. 

---

## Features

- **Dynamic Recipe Submission** — Users submit new recipes through a validated multi-section form (`add.html`). Data is written securely to Firebase Cloud Firestore using `addDoc()`.
- **Web-Based Image Integration** — Recipes reference direct image URLs rather than binary uploads, keeping the project storage-cost-free while Firestore handles all persistence. Recipes without an image gracefully fall back to a category-themed illustration.
- **Interactive Category Filtering** — A dedicated Categories page dynamically calculates recipe counts per category straight from Firestore and renders clickable recipe lists inside a custom modal popup.
- **Dynamic Routing** — Recipes render on a single reusable `recipe.html` template, driven by a URL query parameter (`?id=xyz`) that fetches the matching document on the fly via `getDoc()`.
- **Grouped & Flat Ingredient Support** — The data model supports both simple ingredient lists and grouped ingredients (e.g. *"For the Cupcakes"* / *"For the Buttercream"*), rendered accordingly on the detail page.
- **Print & Share** — Any recipe can be printed with a dedicated print stylesheet (chrome-free layout) or shared via the native Web Share API, with a copy-link fallback.
- **Responsive UI/UX** — A mobile-first, consistently styled interface built on CSS Grid and Flexbox, with custom typography (Playfair Display + Poppins), inline SVG icons, and smooth CSS transitions.
- **Resilient Data States** — Every data-driven view (home grid, recipe detail, categories) explicitly handles loading, empty, and error states rather than failing silently.

---

## Tech Stack

**Frontend:**
- HTML5 (Semantic & Accessible)
- CSS
- JavaScript 

**Backend / BaaS:**
- Firebase Cloud Firestore (NoSQL Document Database)

**Version Control & Deployment:**
- Git & GitHub
- GitHub Projects (Kanban Agile Board)
- GitHub Pages (Hosting)

---

## Project Structure

```
recipe-book-160588/
├── assets/
│   └── css/
│       └── style.css         # Single stylesheet covering all pages
│   └── img/
├── evidence/                  # Screenshots for course submission (milestones, PRs, board)
├── src/
│   ├── firebase.js            # Firebase app + Firestore initialization
│   ├── main.js                # Home page: fetches & renders all recipes
│   ├── recipe.js              # Recipe detail page: fetches one recipe by ?id=
│   └── form.js                # Add Recipe form: validation + addDoc()
│   └── categories.js 
├── add.html                   # Submit a new recipe
├── index.html                 # Home page / recipe grid
├── recipe.html                # Recipe detail template (dynamic via ?id=)
├── categories.html 
├── README.md
└── submission.md              # Course-specific submission notes
```

---

## Firestore Data Model

All recipes live in a single top-level `recipes` collection. Each document follows this shape:

```javascript
{
  title: "Vanilla Buttercream Cupcakes",
  category: "Cupcakes",              // Cakes | Cookies | Breads | Cupcakes |
                                      // Brownies | Cheesecakes | Pastries | Quick Breads
  description: "Light, fluffy vanilla cupcakes topped with silky buttercream frosting.",
  prepTime: "20 mins",
  bakeTime: "18 mins",
  yield: "12 cupcakes",
  difficulty: "Easy",                // Easy | Medium | Hard
  imageUrl: "https://...",           // optional — direct web URL
  ingredients: {                     // flat array OR grouped object
    "For the Cupcakes": ["1 1/4 cups all-purpose flour", "..."],
    "For the Buttercream": ["1 cup unsalted butter, softened", "..."]
  },
  steps: [
    "Preheat the oven to 350°F (175°C)...",
    "..."
  ],
  createdAt: Timestamp               // set via serverTimestamp()
}
```

`ingredients` accepts either a flat `string[]` or a grouped `{ [heading: string]: string[] }` object — both are rendered correctly by `recipe.js`.

---

##  Project Architecture & Methodology

This project was developed strictly adhering to industry-standard Agile methodologies and version control practices:

- **Conventional Commits** — All Git commits follow the standard semantic format (e.g. `feat(form): add ingredient grouping`, `fix(ui): correct card spacing on mobile`, `chore(categories): update badge colors`) for a clean, readable repository history.
- **Feature Branching** — A rigorous branching model (`feat/`, `fix/`, `chore/`, `style/`) keeps the `main` branch stable at all times.
- **Traceability** — Every Pull Request and commit is explicitly linked to a GitHub Project Issue using keywords (e.g. `Closes #8`), ensuring full lifecycle documentation from ticket creation to merge.
- **Conflict Resolution** — Engineered to handle overlapping development safely, actively resolving Simultaneous Edits, Add vs. Add Collisions, and Context Collisions.
- **Branch Protection** — The `main` branch requires passing checks and review before merge, enforced through GitHub branch protection rules.

---

## Installation & Setup

If you would like to run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/IS-PROJECT-2026/recipe-book-160588.git
   ```

2. **Navigate into the directory:**
   ```bash
   cd recipe-book-160588
   ```

3. **Launch a local server:**

   Because this project uses ES6 Modules (`<script type="module">`), it must be served over `http://` rather than the local `file://` protocol.

   - **Using VS Code:** Install the *Live Server* extension and click **"Go Live"**.
   - **Using Python:**
     ```bash
     python -m http.server 8000
     ```
   - **Using Node:**
     ```bash
     npx serve .
     ```

4. Open the printed local address (e.g. `http://localhost:8000`) in your browser.

---

## Firebase Configuration

To connect this application to your own database, you'll need your own Firebase project.

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Initialize a **Firestore Database** and set your read/write rules.
3. Locate `src/firebase.js` in the project directory.
4. Replace the placeholder configuration with your own SDK snippet:

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

> **Firestore Rules (development):** for local testing only, you can temporarily allow open read/write access. **Do not use this in production:**
> ```
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /{document=**} {
>       allow read, write: if true;
>     }
>   }
> }
> ```

---

## 👩‍💻 Author

**Sharlet Jerono Kirui-160588**
Group D
Computer Science Student, Strathmore University
