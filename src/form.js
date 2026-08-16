// form.js
// Runs on add.html. Handles the "Add Your Recipe" form: validation,
// image preview/upload, and writing a new document to the "recipes"
// Firestore collection in the shape recipe.js and main.js expect.

import { db, storage } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ---------------------------------------------------------------------------
// Element references
// ---------------------------------------------------------------------------
const form = document.getElementById("recipeForm");
const formBanner = document.getElementById("formBanner");

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const descriptionCounter = document.getElementById("descriptionCounter");
const yieldInput = document.getElementById("yieldAmount");
const prepTimeInput = document.getElementById("prepTime");
const bakeTimeInput = document.getElementById("bakeTime");
const difficultyInput = document.getElementById("difficulty");

const imageUrlInput = document.getElementById("imageUrlInput");

const ingredientsInput = document.getElementById("ingredients");
const ingredientGroupsInput = document.getElementById("ingredientGroups");
const stepsInput = document.getElementById("steps");

const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const saveBtnText = document.getElementById("saveBtnText");

const MAX_IMAGE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

let selectedImageFile = null;

// ---------------------------------------------------------------------------
// Description character counter
// ---------------------------------------------------------------------------
descriptionInput.addEventListener("input", () => {
  descriptionCounter.textContent = `${descriptionInput.value.length}/160`;
});

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

// "1 1/4 cups flour\n1 tsp salt" -> ["1 1/4 cups flour", "1 tsp salt"]
function parseFlatList(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// "For the Cupcakes:\nflour\nsugar\n\nFor the Buttercream:\nbutter\nsugar"
// -> { "For the Cupcakes": ["flour", "sugar"], "For the Buttercream": ["butter", "sugar"] }
function parseGroupedIngredients(text) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const grouped = {};

  blocks.forEach((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return;

    const heading = lines[0].replace(/:$/, "");
    const items = lines.slice(1);

    if (items.length) {
      grouped[heading] = items;
    }
  });

  return grouped;
}

// Strips leading "1. " / "1) " numbering the user may have typed manually
function parseSteps(text) {
  return text
    .split("\n")
    .map((line) => line.trim().replace(/^\d+[.)]\s*/, ""))
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Banner + button state helpers
// ---------------------------------------------------------------------------
function showBanner(message, type = "error") {
  formBanner.textContent = message;
  formBanner.className = `form-banner form-banner--${type}`;
  formBanner.hidden = false;
  formBanner.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideBanner() {
  formBanner.hidden = true;
}

function setSaving(isSaving) {
  saveBtn.disabled = isSaving;
  saveBtnText.textContent = isSaving ? "Saving..." : "Save Recipe";
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validateForm() {
  const requiredFields = [
    { el: titleInput, message: "Please enter a recipe title." },
    { el: categoryInput, message: "Please select a category." },
    { el: descriptionInput, message: "Please add a short description." },
    { el: yieldInput, message: "Please enter a yield (e.g. 12 cupcakes)." },
    { el: ingredientsInput, message: "Please list at least one ingredient." },
    { el: stepsInput, message: "Please add at least one instruction step." },
  ];

  for (const field of requiredFields) {
    if (!field.el.value.trim()) {
      field.el.focus();
      return field.message;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideBanner();

  const validationError = validateForm();
  if (validationError) {
    showBanner(validationError, "error");
    return;
  }

  setSaving(true);

  try {
    // 1. Grab the image URL from the input box (if the user pasted one)
    const imageUrl = imageUrlInput.value.trim();

    // 2. Build ingredients: grouped takes priority if the user filled it in
    const groupedText = ingredientGroupsInput.value.trim();
    const ingredients = groupedText
      ? parseGroupedIngredients(groupedText)
      : parseFlatList(ingredientsInput.value);

    // 3. Build the recipe document (matches the shape recipe.js / main.js expect)
    const recipe = {
      title: titleInput.value.trim(),
      category: categoryInput.value,
      description: descriptionInput.value.trim(),
      yield: yieldInput.value.trim(),
      prepTime: prepTimeInput.value.trim(),
      bakeTime: bakeTimeInput.value.trim(),
      difficulty: difficultyInput.value || "",
      ingredients,
      steps: parseSteps(stepsInput.value),
      imageUrl, // This saves the web link you pasted!
      createdAt: serverTimestamp(),
    };

    // 4. Save to Firestore
    const docRef = await addDoc(collection(db, "recipes"), recipe);

    showBanner("Recipe saved! Redirecting to your recipe...", "success");

    setTimeout(() => {
      window.location.href = `recipe.html?id=${docRef.id}`;
    }, 1200);
  } catch (error) {
    console.error("Error saving recipe:", error);
    showBanner("Something went wrong while saving. Please try again.", "error");
    setSaving(false);
  }
});

// ---------------------------------------------------------------------------
// Cancel
// ---------------------------------------------------------------------------
cancelBtn.addEventListener("click", () => {
  const hasInput = form.querySelector("input, textarea, select") &&
    Array.from(form.elements).some((el) => el.value && el.value.trim());

  if (hasInput && !confirm("Discard this recipe? Your changes won't be saved.")) {
    return;
  }

  window.location.href = "index.html";
});