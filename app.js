const button = document.getElementById("addExpenseButton");
const status = document.getElementById("status");

button.addEventListener("click", () => {
    status.textContent = "Expense entry will be built here.";
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
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