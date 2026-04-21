const form = document.querySelector("form");
const addButton = document.querySelector(".add-button");

function getBeverageCount() {
    return form.querySelectorAll(".beverage").length;
}

function createBeverage() {
    const template = form.querySelector(".beverage");
    const clone = template.cloneNode(true);
    const index = getBeverageCount() + 1;

    clone.querySelector(".beverage-count").textContent = `Напиток №${index}`;

    clone.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.name = `milk-${index}`;
        radio.checked = radio.value === "usual";
    });

    clone.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        checkbox.name = `options-${index}`;
        checkbox.checked = false;
    });

    clone.querySelector("select").selectedIndex = 1;

    return clone;
}

addButton.addEventListener("click", () => {
    const insertBefore = addButton.parentElement;
    const newBeverage = createBeverage();
    form.insertBefore(newBeverage, insertBefore);
});

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");

function openModal() {
    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
}

function closeModal() {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    openModal();
});

modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
