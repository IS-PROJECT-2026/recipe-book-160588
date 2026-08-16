// categories.js
// Fetches recipes from Firestore, calculates category counts dynamically,
// and handles the modal popup for viewing recipes in a specific category.

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const categoriesGrid = document.getElementById("categoriesGrid");
const categoryModal = document.getElementById("categoryModal");
const modalTitle = document.getElementById("modalTitle");
const modalRecipeList = document.getElementById("modalRecipeList");
const modalClose = document.getElementById("modalClose");

// Base category data (counts will be updated dynamically)
const CATEGORY_DATA = [
  { title: "Cakes", desc: "From classic sponges to decadent layered cakes.", img: "assets/img/fallback-cake.png", icon: `<path d="M12 2L12 6M8 4L8 6M16 4L16 6M4 10H20M4 14H20M5 22H19C20.1046 22 21 21.1046 21 20V10C21 8.89543 20.1046 8 19 8H5C3.89543 8 3 8.89543 3 10V20C3 21.1046 3.89543 22 5 22Z" />` },
  { title: "Cookies", desc: "Crisp, chewy, and everything in between.", img: "assets/img/fallback-cookie.png", icon: `<circle cx="12" cy="12" r="10"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="9.5" r="1"/><circle cx="12" cy="15" r="1"/><circle cx="16" cy="14" r="1"/><circle cx="8" cy="13" r="1"/>` },
  { title: "Breads", desc: "Home-baked breads for every occasion.", img: "assets/img/fallback-bread.png", icon: `<path d="M3 13C3 13 4 8 12 8C20 8 21 13 21 13M3 13H21M3 13V15C3 17.2091 4.79086 7 19H17C19.2091 19 21 17.2091 21 15V13M7 8V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V8"/>` },
  { title: "Cupcakes", desc: "Perfectly portioned and beautifully topped.", img: "assets/img/fallback-cupcake.png", icon: `<path d="M6 13H18L16.5 21H7.5L6 13ZM6 13C6 13 4 13 4 10C4 7 7 6 7 6C7 6 7 2 12 2C17 2 17 6 17 6C17 6 20 7 20 10C20 13 18 13 18 13"/>` },
  { title: "Brownies", desc: "Rich, fudgy, and perfect for sharing.", img: "assets/img/fallback-brownie.png", icon: `<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12H20M12 4V20"/>` },
  { title: "Cheesecakes", desc: "Creamy, smooth, and absolutely irresistible.", img: "assets/img/fallback-cheesecake.png", icon: `<path d="M12 2L21 7V17L12 22L3 17V7L12 2ZM12 2V12M21 7L12 12M3 7L12 12"/>` },
  { title: "Pastries", desc: "Flaky, buttery, and full of flavor.", img: "assets/img/fallback-pastry.png", icon: `<path d="M12 2C12 2 15 5 15 9C15 13 9 13 9 17C9 21 12 22 12 22M17 6C17 6 19 8 19 11C19 14 15 14 15 17M7 8C7 8 5 10 5 13C5 16 9 16 9 19"/>` },
  { title: "Quick Breads", desc: "Simple, hearty bakes ready in no time.", img: "assets/img/fallback-quickbread.png", icon: `<path d="M4 8H20V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8ZM4 8C4 5.79086 5.79086 4 8 4H16C18.2091 4 20 5.79086 20 8"/>` }
];

let allRecipes = [];

// 1. Fetch data and calculate counts
async function loadCategories() {
  try {
    const snapshot = await getDocs(collection(db, "recipes"));
    allRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Count how many recipes belong to each category
    const categoryCounts = {};
    allRecipes.forEach(recipe => {
      const cat = recipe.category || "Uncategorized";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Update our array with the real database counts
    CATEGORY_DATA.forEach(cat => {
      cat.count = categoryCounts[cat.title] || 0;
    });

    renderCategories();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    CATEGORY_DATA.forEach(cat => cat.count = 0);
    renderCategories();
  }
}

// 2. Render the Grid
function renderCategories() {
  const html = CATEGORY_DATA.map(cat => `
    <article class="cat-card" data-category="${cat.title}">
      <div class="cat-card__img-wrap">
        <img src="${cat.img}" alt="${cat.title}">
        <div class="cat-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            ${cat.icon}
          </svg>
        </div>
      </div>
      <div class="cat-card__body">
        <h3>${cat.title}</h3>
        <p>${cat.desc}</p>
        <span class="cat-card__count">${cat.count} recipes</span>
      </div>
    </article>
  `).join('');

  categoriesGrid.innerHTML = html;

  // Attach click listener to open the popup
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.category));
  });
}

// 3. Handle the Modal Popup
function openModal(categoryName) {
  modalTitle.textContent = `${categoryName} Recipes`;
  
  // Find all recipes that match the clicked category
  const filteredRecipes = allRecipes.filter(r => r.category === categoryName);

  if (filteredRecipes.length === 0) {
    modalRecipeList.innerHTML = `<p class="modal-empty">No recipes found in this category yet. Be the first to add one!</p>`;
  } else {
    // Generate the clickable list
    modalRecipeList.innerHTML = filteredRecipes.map(recipe => {
      const fallback = CATEGORY_DATA.find(c => c.title === categoryName)?.img || 'assets/img/fallback-recipe.png';
      return `
        <a href="recipe.html?id=${recipe.id}" class="modal-recipe-item">
          <img src="${recipe.imageUrl || fallback}" alt="${recipe.title}">
          <div>
            <h4>${recipe.title}</h4>
            <p>${recipe.difficulty || 'Any Level'} • ${recipe.prepTime || recipe.time || 'N/A'}</p>
          </div>
        </a>
      `;
    }).join('');
  }

  categoryModal.hidden = false;
}

// 4. Modal Close Triggers
modalClose.addEventListener("click", () => categoryModal.hidden = true);
categoryModal.addEventListener("click", (e) => {
  if (e.target === categoryModal) categoryModal.hidden = true; // Close if clicking outside the white box
});

document.addEventListener("DOMContentLoaded", loadCategories);