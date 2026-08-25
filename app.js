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

const DB_NAME = "ExpenseTrackerDB";
const DB_VERSION = 1;
const STORE_NAME = "expenses";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });

                store.createIndex("date", "date", {
                    unique: false
                });

                store.createIndex("category", "category", {
                    unique: false
                });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function saveExpenseToDatabase(expense) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.add(expense);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

function getCurrentDateTime() {
    const now = new Date();

    const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    const time = [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
        String(now.getSeconds()).padStart(2, "0")
    ].join(":");

    return {
        date,
        time
    };
}

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
                        type="button"
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
                        min="0.01"
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

            <button
                type="button"
                id="saveExpenseButton"
                class="save-button"
            >
                Save Expense
            </button>

            <button
                type="button"
                id="backButton"
                class="back-button"
            >
                Back
            </button>

            <div id="status" aria-live="polite"></div>

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
    const buttons =
        document.querySelectorAll(".category-button");

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

async function saveExpense() {
    const amountInput =
        document.getElementById("amount");

    const noteInput =
        document.getElementById("note");

    const status =
        document.getElementById("status");

    const saveButton =
        document.getElementById("saveExpenseButton");

    const amount = Number(amountInput.value);

    const note = noteInput.value.trim();

    if (!selectedCategory) {
        status.textContent =
            "Please select a category.";
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        status.textContent =
            "Please enter a valid amount.";

        amountInput.focus();
        return;
    }

    const category = categories.find(
        item => item.id === selectedCategory
    );

    const { date, time } =
        getCurrentDateTime();

    const expense = {
        category: category.id,
        categoryName: category.name,
        amount: Number(amount.toFixed(2)),
        note,
        date,
        time,
        createdAt: new Date().toISOString()
    };

    try {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        await saveExpenseToDatabase(expense);

        status.textContent =
            `Saved: ${category.icon} ${category.name} — ₹${expense.amount.toFixed(2)}`;

        amountInput.value = "";
        noteInput.value = "";

        document
            .querySelectorAll(".category-button")
            .forEach(button => {
                button.classList.remove("selected");
            });

        selectedCategory = null;

    } catch (error) {
        console.error(
            "Failed to save expense:",
            error
        );

        status.textContent =
            "Unable to save the expense. Please try again.";

    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Expense";
    }
}

function initializeApp() {
    const params =
        new URLSearchParams(
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
                console.log(
                    "Service Worker registered"
                );
            })
            .catch(error => {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}