// main.js
// Fetches all documents from the "recipes" Firestore collection and
// renders them into #recipesGrid as recipe cards.

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const recipesGrid = document.getElementById("recipesGrid");

// Fallback image per category, used until each recipe document has its own imageUrl
const CATEGORY_FALLBACK_IMG = {
  Cakes: "assets/img/fallback-cake.png",
  Cookies: "assets/img/fallback-cookie.png",
  Breads: "assets/img/fallback-bread.png",
  Cupcakes: "assets/img/fallback-cupcake.png",
  Brownies: "assets/img/fallback-brownie.png",
  Cheesecakes: "assets/img/fallback-cheesecake.png",
  Pastries: "assets/img/fallback-pastry.png",
  "Quick Breads": "assets/img/fallback-quickbread.png",
  default: "assets/img/fallback-recipe.png",
};

/**
 * Builds the HTML for a single recipe card.
 * Expected Firestore document shape:
 * {
 *   title: string,
 *   category: string,        // e.g. "Cakes", "Cookies", "Breads"
 *   time: string,             // e.g. "45 min"
 *   servings: number,
 *   difficulty: string,       // "Easy" | "Medium" | "Hard"
 *   tags: string[],
 *   ingredients: string[],
 *   steps: string[],
 *   imageUrl: string (optional),
 *   card_no: string (optional)
 * }
 */
function renderRecipeCard(id, recipe) {
  const {
    title = "Untitled Recipe",
    category = "Baking",
    time = "",
    servings = "",
    difficulty = "",
    imageUrl,
  } = recipe;

  const fallbackImg = CATEGORY_FALLBACK_IMG[category] || CATEGORY_FALLBACK_IMG.default;
  const metaParts = [time, servings ? `${servings} servings` : "", difficulty].filter(Boolean);

  return `
    <article class="recipe-card">
      <div class="recipe-card__image-wrap">
        <img src="${imageUrl || fallbackImg}" alt="${title}" loading="lazy">
        <button class="recipe-card__favorite" aria-label="Save recipe" data-id="${id}">♡</button>
      </div>
      <div class="recipe-card__body">
        <span class="recipe-card__badge">${category}</span>
        <h3 class="recipe-card__title">${title}</h3>
        ${metaParts.length ? `<p class="recipe-card__meta">${metaParts.join(" · ")}</p>` : ""}
        <button class="recipe-card__button" data-id="${id}">View Recipe →</button>
      </div>
    </article>
  `;
}

function renderEmptyState() {
  recipesGrid.innerHTML = `
    <div class="recipes-state" id="recipesState">
      <p class="recipes-state__title">No recipes found yet.</p>
      <p class="recipes-state__subtitle">Be the first to add one and start our collection!</p>
    </div>
  `;
}

function renderErrorState() {
  recipesGrid.innerHTML = `
    <div class="recipes-state" id="recipesState">
      <p class="recipes-state__title">Something went wrong.</p>
      <p class="recipes-state__subtitle">We couldn't load recipes right now. Please try again later.</p>
    </div>
  `;
}

function renderLoadingState() {
  recipesGrid.innerHTML = `
    <div class="recipes-state" id="recipesState">
      <p class="recipes-state__title">Loading Recipes...</p>
      <p class="recipes-state__subtitle">Fetching delicious bakes for you.</p>
    </div>
  `;
}

async function loadRecipes() {
  renderLoadingState();

  try {
    const recipesRef = collection(db, "recipes");
    const snapshot = await getDocs(recipesRef);

    if (snapshot.empty) {
      renderEmptyState();
      return;
    }

    const cardsHtml = snapshot.docs
      .map((doc) => renderRecipeCard(doc.id, doc.data()))
      .join("");

    recipesGrid.innerHTML = cardsHtml;
    attachCardListeners();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    renderErrorState();
  }
}

function attachCardListeners() {
  document.querySelectorAll(".recipe-card__button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      window.location.href = `recipe.html?id=${id}`;
    });
  });

  document.querySelectorAll(".recipe-card__favorite").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("is-active");
      btn.textContent = btn.classList.contains("is-active") ? "♥" : "♡";
    });
  });
}

document.addEventListener("DOMContentLoaded", loadRecipes);