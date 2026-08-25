const app = document.querySelector(".app");
const button = document.getElementById("addExpenseButton");
const status = document.getElementById("status");

function showHome() {
    app.innerHTML = `
        <div class="app-header">
            <h1>Expense Tracker</h1>
            <p>Fast • Private • Offline</p>
        </div>

        <section class="card">
            <div class="icon">₹</div>

            <h2>Add Expense</h2>

            <p>
                Your personal expense tracker
            </p>

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
    app.innerHTML = `
        <div class="app-header">
            <h1>Add Expense</h1>
            <p>Record your expense</p>
        </div>

        <section class="card">
            <div class="icon">₹</div>

            <h2>Add Expense</h2>

            <p>
                Expense entry screen
            </p>

            <div id="expensePlaceholder">
                <p>Select a category and enter the amount.</p>
            </div>

            <button id="saveExpenseButton">
                Save Expense
            </button>

            <button id="backButton">
                Back
            </button>
        </section>

        <div id="status"></div>
    `;

    document
        .getElementById("saveExpenseButton")
        .addEventListener("click", () => {
            document.getElementById("status").textContent =
                "Expense entry will be implemented next.";
        });

    document
        .getElementById("backButton")
        .addEventListener("click", showHome);
}

function initializeApp() {
    const params = new URLSearchParams(window.location.search);

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