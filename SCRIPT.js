// Interacciones de La Tiendita Creativa
let cart = []; // Carrito temporal: vive mientras la página está abierta.

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("addToast"));
const money = value => "$" + value.toLocaleString("es-MX") + " MXN";

document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {
    cart.push({ name: button.dataset.name, price: Number(button.dataset.price) });
    updateCart();
    toast.show();
  });
});

function updateCart() {
  cartCount.textContent = cart.length;
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-muted">Tu bolsa está esperando algo bonito.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-row">
        <div><strong>${item.name}</strong><br><small>${money(item.price)}</small></div>
        <button class="remove-item" data-index="${index}">Quitar</button>
      </div>`).join("");
  }
  cartTotal.textContent = money(cart.reduce((sum, item) => sum + item.price, 0));
}

cartItems.addEventListener("click", event => {
  const button = event.target.closest(".remove-item");
  if (!button) return;
  cart.splice(Number(button.dataset.index), 1);
  updateCart();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Agrega al menos un producto a tu bolsa antes de confirmar. ✿");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  sessionStorage.setItem("ultimoPedido", JSON.stringify({ items: cart, total }));
  window.location.href = "gracias.html";
});

// Búsqueda por nombre y filtro por categoría
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
function filterProducts() {
  const term = searchInput.value.toLocaleLowerCase("es");
  const category = categoryFilter.value;
  let visible = 0;
  document.querySelectorAll(".product-col").forEach(card => {
    const matchesName = card.dataset.name.includes(term);
    const matchesCategory = category === "todos" || card.dataset.category === category;
    const show = matchesName && matchesCategory;
    card.classList.toggle("d-none", !show);
    if (show) visible++;
  });
  document.getElementById("emptyMessage").classList.toggle("d-none", visible !== 0);
}
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Modo noche: preferencia guardada en el navegador
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("temaTiendita") === "oscuro") document.body.classList.add("dark");
function updateThemeButton() {
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀ Modo día" : "☾ Modo noche";
}
updateThemeButton();
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("temaTiendita", document.body.classList.contains("dark") ? "oscuro" : "claro");
  updateThemeButton();
});

// Contador de visitas en este navegador
const visits = Number(localStorage.getItem("visitasTiendita") || 0) + 1;
localStorage.setItem("visitasTiendita", visits);
document.getElementById("visitCount").textContent = visits;

// Validación del formulario (no envía datos: es una demo sin servidor)
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  alert("¡Gracias por escribirnos! Tu mensaje lleno de aura está listo. ♡");
  form.reset();
  form.classList.remove("was-validated");
  bootstrap.Modal.getInstance(document.getElementById("contactModal")).hide();
});

// Botón para volver arriba
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => backToTop.classList.toggle("show", window.scrollY > 450));
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
