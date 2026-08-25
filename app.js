const app = document.querySelector(".app");

const categories = [
    { id: "tea", name: "Tea", icon: "☕" },
    { id: "breakfast", name: "Breakfast", icon: "🍳" },
    { id: "lunch", name: "Lunch", icon: "🍛" },
    { id: "dinner", name: "Dinner", icon: "🍽️" },
    { id: "movie", name: "Movie", icon: "🎬" },
    { id: "petrol", name: "Petrol", icon: "⛽" },
    { id: "shopping", name: "Shopping", icon: "🛍️" },
    { id: "other", name: "Other", icon: "•" }
];

let selectedCategory = null;

function showHome() {
    app.innerHTML = `
        <div class="app-header">
            <h1>Expense Tracker</h1>
            <p>Fast • Private • Offline</p>
        </div>

        <section class="card">
            <div class="icon">₹</div>

            <h2>Add Expense</h2>

            <p>Your personal expense tracker</p>

            <button id="addExpenseButton">
                Add Expense
            </button>
        </section>

        <div id="status"></div>
    `;

    document
        .getElementById("addExpenseButton")
        .addEventListener("click", showAddExpense);
}

function showAddExpense() {
    selectedCategory = null;

    app.innerHTML = `
        <div class="app-header">
            <h1>Add Expense</h1>
            <p>Record your expense</p>
        </div>

        <section class="expense-card">

            <h2>What did you spend on?</h2>

            <div class="category-grid">
                ${categories.map(category => `
                    <button
                        class="category-button"
                        data-category="${category.id}"
                    >
                        <span class="category-icon">
                            ${category.icon}
                        </span>

                        <span>
                            ${category.name}
                        </span>
                    </button>
                `).join("")}
            </div>

            <div class="form-group">
                <label for="amount">
                    Amount
                </label>

                <div class="amount-input">
                    <span>₹</span>

                    <input
                        id="amount"
                        type="number"
                        inputmode="decimal"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        autocomplete="off"
                    >
                </div>
            </div>

            <div class="form-group">
                <label for="note">
                    Note <span>(optional)</span>
                </label>

                <input
                    id="note"
                    type="text"
                    placeholder="Add a note"
                    maxlength="100"
                >
            </div>

            <button id="saveExpenseButton" class="save-button">
                Save Expense
            </button>

            <button id="backButton" class="back-button">
                Back
            </button>

            <div id="status"></div>

        </section>
    `;

    setupCategoryButtons();

    document
        .getElementById("saveExpenseButton")
        .addEventListener("click", saveExpense);

    document
        .getElementById("backButton")
        .addEventListener("click", showHome);
}

function setupCategoryButtons() {
    const buttons = document.querySelectorAll(".category-button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            buttons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            selectedCategory = button.dataset.category;
        });
    });
}

function saveExpense() {
    const amountInput = document.getElementById("amount");
    const noteInput = document.getElementById("note");
    const status = document.getElementById("status");

    const amount = Number(amountInput.value);
    const note = noteInput.value.trim();

    if (!selectedCategory) {
        status.textContent = "Please select a category.";
        return;
    }

    if (!amount || amount <= 0) {
        status.textContent = "Please enter a valid amount.";
        amountInput.focus();
        return;
    }

    const category = categories.find(
        item => item.id === selectedCategory
    );

    status.textContent =
        `${category.icon} ${category.name} — ₹${amount.toFixed(2)}` +
        (note ? ` — ${note}` : "");
}

function initializeApp() {
    const params = new URLSearchParams(
        window.location.search
    );

    if (params.get("action") === "add") {
        showAddExpense();
    } else {
        showHome();
    }
}

initializeApp();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
                console.log("Service Worker registered");
            })
            .catch(error => {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}