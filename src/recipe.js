// recipe.js
// Runs on recipe.html. Reads ?id= from the URL, fetches that single
// document from the "recipes" Firestore collection, and renders the
// full recipe detail (breadcrumb, hero, meta, ingredients + instructions)
// into #recipeDetail.

import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const recipeDetail = document.getElementById("recipeDetail");

// ---------------------------------------------------------------------------
// Inline icons (stroke-based, inherit color via currentColor)
// ---------------------------------------------------------------------------
const ICONS = {
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>`,
  yield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v10"/></svg>`,
  bars: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="6"/></svg>`,
  clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="16" y2="15"/></svg>`,
  fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>`,
  printer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/></svg>`,
};

function getRecipeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ---------------------------------------------------------------------------
// State renderers
// ---------------------------------------------------------------------------
function renderMissingIdState() {
  recipeDetail.innerHTML = `
    <div class="detail-state">
      <h2>No recipe selected</h2>
      <p>Head back to the recipe book and pick something to bake.</p>
      <p style="margin-top: 1.5rem;">
        <a href="index.html" class="detail-back">← Back to all recipes</a>
      </p>
    </div>
  `;
}

function renderNotFoundState() {
  recipeDetail.innerHTML = `
    <div class="detail-state">
      <h2>Recipe not found</h2>
      <p>This recipe may have been removed or the link is incorrect.</p>
      <p style="margin-top: 1.5rem;">
        <a href="index.html" class="detail-back">← Back to all recipes</a>
      </p>
    </div>
  `;
}

function renderErrorState() {
  recipeDetail.innerHTML = `
    <div class="detail-state">
      <h2>Something went wrong</h2>
      <p>We couldn't load this recipe right now. Please try again later.</p>
      <p style="margin-top: 1.5rem;">
        <a href="index.html" class="detail-back">← Back to all recipes</a>
      </p>
    </div>
  `;
}

function renderLoadingState() {
  recipeDetail.innerHTML = `
    <div class="detail-state">
      <h2>Loading recipe...</h2>
      <p>Fetching the details for you.</p>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ingredients can be either a flat array of strings, or grouped:
// { "For the Cupcakes": [...], "For the Buttercream": [...] }
function renderIngredients(ingredients) {
  if (Array.isArray(ingredients)) {
    return `
      <ul class="ingredient-list">
        ${ingredients.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  }

  if (ingredients && typeof ingredients === "object") {
    return Object.entries(ingredients)
      .map(
        ([groupTitle, items]) => `
          <div class="ingredient-group">
            <h3>${groupTitle}</h3>
            <ul class="ingredient-list">
              ${items.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        `
      )
      .join("");
  }

  return `<p class="detail-empty-note">No ingredients listed yet.</p>`;
}

function renderInstructions(steps) {
  if (!steps || !steps.length) {
    return `<p class="detail-empty-note">No instructions listed yet.</p>`;
  }
  return `
    <ol class="instruction-list">
      ${steps.map((step) => `<li>${step}</li>`).join("")}
    </ol>
  `;
}

// ---------------------------------------------------------------------------
// Main render
// ---------------------------------------------------------------------------

/**
 * Expected Firestore document shape (collection: "recipes"):
 * {
 *   title: string,
 *   category: string,          // e.g. "Cakes", "Cookies", "Cupcakes"
 *   description: string,       // short one-line summary
 *   prepTime: string,          // e.g. "20 mins"
 *   bakeTime: string,          // e.g. "18 mins"
 *   yield: string,             // e.g. "12 cupcakes"  (falls back to `servings`)
 *   difficulty: string,        // "Easy" | "Medium" | "Hard"
 *   ingredients: string[] | { [group: string]: string[] },
 *   steps: string[],
 *   imageUrl: string (optional),
 * }
 */
function renderRecipeDetail(id, recipe) {
  const {
    title = "Untitled Recipe",
    category = "Baking",
    description = "",
    prepTime = "",
    bakeTime = "",
    yield: recipeYield = "",
    servings = "",
    difficulty = "",
    ingredients = [],
    steps = [],
    imageUrl,
  } = recipe;

  const yieldValue = recipeYield || (servings ? `${servings} servings` : "");

  const metaItems = [
    prepTime ? { icon: ICONS.clock, label: "Prep Time", value: prepTime } : null,
    bakeTime ? { icon: ICONS.clock, label: "Bake Time", value: bakeTime } : null,
    yieldValue ? { icon: ICONS.yield, label: "Yield", value: yieldValue } : null,
    difficulty ? { icon: ICONS.bars, label: "Difficulty", value: difficulty } : null,
  ].filter(Boolean);

  recipeDetail.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a>
      <span class="breadcrumb__sep">&gt;</span>
      <a href="categories.html">${category}</a>
      <span class="breadcrumb__sep">&gt;</span>
      <span class="breadcrumb__current">${title}</span>
    </nav>

    <section class="detail-hero">
      <div class="detail-hero__image-wrap">
        <img src="${imageUrl || "assets/img/fallback-recipe.jpg"}" alt="${title}">
        <button class="detail-hero__favorite" id="favoriteBtn" aria-label="Save recipe">
          ${ICONS.heart}
        </button>
      </div>

      <div class="detail-hero__info">
        <span class="detail-hero__badge">${category}</span>
        <h1 class="detail-hero__title">${title}</h1>
        ${description ? `<p class="detail-hero__description">${description}</p>` : ""}

        ${metaItems.length ? `
          <div class="detail-hero__divider"></div>
          <div class="detail-hero__meta">
            ${metaItems.map((item) => `
              <div class="detail-hero__meta-item">
                <span class="detail-hero__meta-icon">${item.icon}</span>
                <span>
                  <span class="detail-hero__meta-label">${item.label}</span>
                  <span class="detail-hero__meta-value">${item.value}</span>
                </span>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <div class="detail-hero__actions">
          <button class="btn btn--primary" id="printBtn">
            ${ICONS.printer} Print Recipe
          </button>
          <button class="btn btn--outline" id="shareBtn">
            ${ICONS.share} Share Recipe
          </button>
        </div>
      </div>
    </section>

    <section class="detail-content">
      <div class="detail-card">
        <div class="detail-card__header">
          <span class="detail-card__icon">${ICONS.clipboard}</span>
          <h2>Ingredients</h2>
        </div>
        ${renderIngredients(ingredients)}
      </div>

      <div class="detail-card">
        <div class="detail-card__header">
          <span class="detail-card__icon">${ICONS.fileText}</span>
          <h2>Instructions</h2>
        </div>
        ${renderInstructions(steps)}
      </div>
    </section>
  `;

  attachDetailListeners(id, title);
}

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------
function attachDetailListeners(id, title) {
  const favoriteBtn = document.getElementById("favoriteBtn");
  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", () => {
      favoriteBtn.classList.toggle("is-active");
    });
  }

  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = { title, url: window.location.href };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          const original = shareBtn.innerHTML;
          shareBtn.innerHTML = "Link copied!";
          setTimeout(() => (shareBtn.innerHTML = original), 2000);
        }
      } catch (error) {
        console.error("Share failed:", error);
      }
    });
  }

  const saveRecipeBtn = document.getElementById("saveRecipeBtn");
  if (saveRecipeBtn) {
    saveRecipeBtn.addEventListener("click", () => {
      saveRecipeBtn.classList.toggle("is-active");
    });
  }
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------
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

    renderRecipeDetail(id, snapshot.data());
  } catch (error) {
    console.error("Error fetching recipe:", error);
    renderErrorState();
  }
}

document.addEventListener("DOMContentLoaded", loadRecipe);