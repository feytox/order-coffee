const form = document.querySelector("form");
const addButton = document.querySelector(".add-button");
const DRINK_NAMES = {
    espresso: 'Эспрессо',
    capuccino: 'Капучино',
    cacao: 'Какао',
};

const MILK_NAMES = {
    usual: 'обычное',
    'no-fat': 'обезжиренное',
    soy: 'соевое',
    coconut: 'кокосовое',
};

const OPTION_NAMES = {
    'whipped cream': 'взбитые сливки',
    marshmallow: 'зефирки',
    chocolate: 'шоколад',
    cinnamon: 'корица',
};


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

function renumberBeverages() {
    const beverages = form.querySelectorAll(".beverage");
    beverages.forEach((fieldset, i) => {
        const index = i + 1;
        fieldset.querySelector(".beverage-count").textContent =
            `Напиток №${index}`;

        fieldset.querySelectorAll('input[type="radio"]').forEach((radio) => {
            radio.name = `milk-${index}`;
        });

        fieldset.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
            cb.name = `options-${index}`;
        });
    });
}

form.addEventListener("click", (event) => {
    if (!event.target.closest(".delete-button")) return;
    if (getBeverageCount() <= 1) return;

    event.target.closest(".beverage").remove();
    renumberBeverages();
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
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `<p>${getOrderCountText()}</p>`;
    openModal();
});

modalClose.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function getMultiple(number, one, few, many) {
    const mod10 = number % 10;
    const mod100 = number % 100;

    if (mod100 >= 11 && mod100 <= 19) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
}

function getOrderCountText() {
    const count = getBeverageCount();
    const word = getMultiple(count, "напиток", "напитка", "напитков");
    return `Вы заказали ${count} ${word}`;
}


function collectOrderData() {
    const beverages = form.querySelectorAll('.beverage');
    return Array.from(beverages).map((fieldset) => {
        const drink = fieldset.querySelector('select').value;
        const milk = fieldset.querySelector('input[type="radio"]:checked').value;
        const options = Array.from(
            fieldset.querySelectorAll('input[type="checkbox"]:checked')
        ).map((cb) => OPTION_NAMES[cb.value]);

        return {
            drink: DRINK_NAMES[drink],
            milk: MILK_NAMES[milk],
            options: options.join(', '),
        };
    });
}

function buildOrderTable(orders) {
    const headerRow = '<tr><th>Напиток</th><th>Молоко</th><th>Дополнительно</th></tr>';
    const bodyRows = orders
        .map(
            (order) =>
                `<tr><td>${order.drink}</td><td>${order.milk}</td><td>${order.options}</td></tr>`
        )
        .join('');

    return `<table class="order-table"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
}
