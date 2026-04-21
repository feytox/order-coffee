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
