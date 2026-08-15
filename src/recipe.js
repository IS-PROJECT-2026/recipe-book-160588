// recipe.js
// Runs on recipe.html. Reads ?id= from the URL, fetches that single
// document from the "recipes" Firestore collection, and renders the
// full recipe detail (ingredients + steps) into #recipeDetail.

import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const recipeDetail = document.getElementById("recipeDetail");

function getRecipeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderMissingIdState() {
  recipeDetail.innerHTML = `
    <div class="recipe-detail__state">
      <h2>No recipe selected</h2>
      <p>Head back to the recipe book and pick something to bake.</p>
      <p style="margin-top: 1.5rem;">
        <a href="index.html" class="recipe-detail__back">← Back to all recipes</a>
      </p>
    </div>
  `;
}

function renderNotFoundState() {
  recipeDetail.innerHTML = `
    <div class="recipe-detail__state">
      <h2>Recipe not found</h2>
      <p>This recipe may have been removed or the link is incorrect.</p>
      <p style="margin-top: 1.5rem;">
        <a href="index.html" class="recipe-detail__back">← Back to all recipes</a>
      </p>
    </div>
  `;
}

function renderErrorState() {
  recipeDetail.innerHTML = `
    <div class="recipe-detail__state">
      <h2>Something went wrong</h2>
      <p>We couldn't load this recipe right now. Please try again later.</p>
      <p style="margin-top: 1.5rem;">
        <a href="index.html" class="recipe-detail__back">← Back to all recipes</a>
      </p>
    </div>
  `;
}

function renderLoadingState() {
  recipeDetail.innerHTML = `
    <div class="recipe-detail__state">
      <h2>Loading recipe...</h2>
      <p>Fetching the details for you.</p>
    </div>
  `;
}

/**
 * Expected Firestore document shape (collection: "recipes"):
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
function renderRecipeDetail(recipe) {
  const {
    title = "Untitled Recipe",
    category = "Baking",
    time = "",
    servings = "",
    difficulty = "",
    tags = [],
    ingredients = [],
    steps = [],
    imageUrl,
  } = recipe;

  const metaItems = [
    time ? { label: "Time", value: time } : null,
    servings ? { label: "Servings", value: servings } : null,
    difficulty ? { label: "Difficulty", value: difficulty } : null,
  ].filter(Boolean);

  recipeDetail.innerHTML = `
    <a href="index.html" class="recipe-detail__back">← Back to all recipes</a>

    ${imageUrl ? `
      <div class="recipe-detail__hero">
        <img src="${imageUrl}" alt="${title}">
      </div>
    ` : ""}

    <span class="recipe-detail__badge">${category}</span>
    <h1 class="recipe-detail__title">${title}</h1>

    ${metaItems.length ? `
      <div class="recipe-detail__meta">
        ${metaItems.map((item) => `
          <div class="recipe-detail__meta-item">
            <span class="recipe-detail__meta-label">${item.label}</span>
            <span class="recipe-detail__meta-value">${item.value}</span>
          </div>
        `).join("")}
      </div>
    ` : ""}

    ${tags.length ? `
      <div class="recipe-detail__tags">
        ${tags.map((tag) => `<span class="recipe-detail__tag">${tag}</span>`).join("")}
      </div>
    ` : ""}

    <div class="recipe-detail__grid">
      <section class="recipe-detail__section">
        <h2>Ingredients</h2>
        <ul class="recipe-detail__ingredients">
          ${ingredients.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      <section class="recipe-detail__section">
        <h2>Steps</h2>
        <ol class="recipe-detail__steps">
          ${steps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </section>
    </div>
  `;
}

async function loadRecipe() {
  const id = getRecipeIdFromUrl();

  if (!id) {
    renderMissingIdState();
    return;
  }

  renderLoadingState();

  try {
    const recipeRef = doc(db, "recipes", id);
    const snapshot = await getDoc(recipeRef);

    if (!snapshot.exists()) {
      renderNotFoundState();
      return;
    }

    renderRecipeDetail(snapshot.data());
  } catch (error) {
    console.error("Error fetching recipe:", error);
    renderErrorState();
  }
}

document.addEventListener("DOMContentLoaded", loadRecipe);