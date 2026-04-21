# PLAN.md — Заказ кофе

## Участники

| Псевдоним | Зона ответственности |
|-----------|--------------------------------------|
| **Dev-A** | Формы (добавление, удаление, textarea) |
| **Dev-B** | Модальное окно (вся логика и стили) |

---

## Порядок работы

```
Этап 1 (параллельно):  Dev-A → Задачи 1, 2    |   Dev-B → Задачи 3, 4
Этап 2 (параллельно):  Dev-A → Задача 5        |   Dev-B → Задача 6
         ↕ мерж
Этап 3 (параллельно):  Dev-A → Задача 7*       |   Dev-B → Задача 9*
         ↕ мерж
Этап 4 (Dev-B):        Dev-B → Задача 8*
```

> **Важно**: имена radio-кнопок (`name="milk"`) / чекбоксов (`name="options"`) должны быть **уникальны для каждого fieldset**. Шаблон: `milk-{i}`, `options-{i}`, где `i` — порядковый номер напитка. Dev-A применяет это при клонировании формы (Задача 1), а Dev-B учитывает при сборе данных (Задача 6).

---

## Этап 1 — Базовые формы и базовое модальное окно

### Задача 1 — Добавление нового напитка *(README №1)*

**Исполнитель:** Dev-A
**Файл:** `index.js`

При клике по кнопке «+ Добавить напиток» клонировать первый `fieldset.beverage`, обновить заголовок и уникализировать `name`-атрибуты radio/checkbox.

```js
// index.js — Задача 1

const form = document.querySelector('form');
const addButton = document.querySelector('.add-button');

function getBeverageCount() {
  return form.querySelectorAll('.beverage').length;
}

function createBeverage() {
  const template = form.querySelector('.beverage');
  const clone = template.cloneNode(true);
  const index = getBeverageCount() + 1;

  clone.querySelector('.beverage-count').textContent = `Напиток №${index}`;

  clone.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.name = `milk-${index}`;
    radio.checked = radio.value === 'usual';
  });

  clone.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.name = `options-${index}`;
    checkbox.checked = false;
  });

  clone.querySelector('select').selectedIndex = 1;

  return clone;
}

addButton.addEventListener('click', () => {
  const insertBefore = addButton.parentElement;
  const newBeverage = createBeverage();
  form.insertBefore(newBeverage, insertBefore);
});
```

Также нужно уникализировать `name` у **первого** fieldset, чтобы всё было консистентно.

**Файл:** `index.html` — изменить `name`-атрибуты в первом `fieldset`:

Строка 23: `name="milk"` → `name="milk-1"`
Строка 27: `name="milk"` → `name="milk-1"`
Строка 31: `name="milk"` → `name="milk-1"`
Строка 35: `name="milk"` → `name="milk-1"`
Строка 42: `name="options"` → `name="options-1"`
Строка 46: `name="options"` → `name="options-1"`
Строка 50: `name="options"` → `name="options-1"`
Строка 54: `name="options"` → `name="options-1"`

---

### Задача 2 — Кнопка удаления напитка *(README №2)*

**Исполнитель:** Dev-A
**Файлы:** `index.js`, `styles.css`

Добавить крестик удаления в правый верхний угол каждого fieldset. Не удалять, если напиток единственный.

**CSS** — добавить в конец `styles.css`:

```css
/* Задача 2 — кнопка удаления */
.beverage {
  position: relative;
}

.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.delete-button:hover {
  color: #e00;
}
```

**JS** — добавить в `index.js` (после кода задачи 1):

```js
// index.js — Задача 2

function addDeleteButton(fieldset) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'delete-button';
  button.textContent = '✕';
  fieldset.prepend(button);
}

function renumberBeverages() {
  const beverages = form.querySelectorAll('.beverage');
  beverages.forEach((fieldset, i) => {
    const index = i + 1;
    fieldset.querySelector('.beverage-count').textContent = `Напиток №${index}`;

    fieldset.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.name = `milk-${index}`;
    });

    fieldset.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.name = `options-${index}`;
    });
  });
}

// добавить крестик к первому напитку
addDeleteButton(form.querySelector('.beverage'));

// крестик уже есть в клонированных формах (клонируется из первого),
// но удаление через делегирование:
form.addEventListener('click', (event) => {
  if (!event.target.closest('.delete-button')) return;
  if (getBeverageCount() <= 1) return;

  event.target.closest('.beverage').remove();
  renumberBeverages();
});
```

---

### Задача 3 — Модальное окно с текстом *(README №3)*

**Исполнитель:** Dev-B
**Файлы:** `index.html`, `styles.css`, `index.js`

**HTML** — добавить перед `<script>` (строка 67):

```html
<div class="overlay hidden" id="overlay"></div>
<div class="modal hidden" id="modal">
  <button type="button" class="modal-close" id="modal-close">✕</button>
  <h2>Заказ принят!</h2>
  <div id="modal-content"></div>
</div>
```

**CSS** — добавить в конец `styles.css`:

```css
/* Задача 3 — модальное окно */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  z-index: 101;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  color: #e00;
}

.hidden {
  display: none;
}
```

**JS** — добавить в `index.js`:

```js
// index.js — Задача 3

const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');

function openModal() {
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}

function closeModal() {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  openModal();
});
```

---

### Задача 4 — Закрытие модального окна *(README №4)*

**Исполнитель:** Dev-B
**Файл:** `index.js`

```js
// index.js — Задача 4

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
```

---

## Этап 2 — Контент модального окна

### Задача 5 — Текст с количеством напитков и склонение *(README №5)*

**Исполнитель:** Dev-A
**Файл:** `index.js`

```js
// index.js — Задача 5

function getDeclension(number, one, few, many) {
  const mod10 = number % 10;
  const mod100 = number % 100;

  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

function getOrderCountText() {
  const count = getBeverageCount();
  const word = getDeclension(count, 'напиток', 'напитка', 'напитков');
  return `Вы заказали ${count} ${word}`;
}
```

Затем обновить обработчик `submit`, чтобы перед `openModal()` заполнять `#modal-content`:

```js
// Обновлённый обработчик submit (заменяет предыдущий)
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = `<p>${getOrderCountText()}</p>`;
  openModal();
});
```

> **Dev-A** пишет `getOrderCountText()` и `getDeclension()`, а в обработчике `submit` вставляет текст. Обработчик `submit` один — при мерже Dev-B дополнит его таблицей (Задача 6).

---

### Задача 6 — Таблица заказа *(README №6)*

**Исполнитель:** Dev-B
**Файлы:** `index.js`, `styles.css`

**Словари значений** (для преобразования `value` → текст на русском):

```js
// index.js — Задача 6

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
```

**Обновить обработчик `submit`** — добавить таблицу после текста:

```js
// Финальный обработчик submit (заменяет предыдущий)
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const modalContent = document.getElementById('modal-content');
  const orders = collectOrderData();
  modalContent.innerHTML = `<p>${getOrderCountText()}</p>${buildOrderTable(orders)}`;
  openModal();
});
```

**CSS** — стили для таблицы, добавить в конец `styles.css`:

```css
/* Задача 6 — таблица заказа */
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.order-table th {
  background: #f5f5f5;
}
```

---

## Этап 3 — Дополнительные задачи (со звёздочкой)

### Задача 7* — Textarea «И ещё вот что» *(README №7)*

**Исполнитель:** Dev-A
**Файлы:** `index.js`, `styles.css`

Добавить `textarea` + предпросмотр в каждый `fieldset`. Выделять жирным ключевые слова.

**CSS** — добавить в `styles.css`:

```css
/* Задача 7 — textarea */
.wishes-wrapper {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.wishes-wrapper textarea {
  flex: 1;
  min-height: 60px;
  resize: vertical;
  padding: 6px;
}

.wishes-preview {
  flex: 1;
  padding: 6px;
  border: 1px dashed #ccc;
  min-height: 60px;
  white-space: pre-wrap;
  word-break: break-word;
}
```

**JS** — добавить в `index.js`:

```js
// index.js — Задача 7

const URGENT_WORDS_REGEX = /\b(срочно|побыстрее|быстрее|поскорее|скорее|очень нужно)\b/gi;

function highlightUrgentWords(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(URGENT_WORDS_REGEX, '<b>$1</b>');
}

function createWishesBlock() {
  const wrapper = document.createElement('div');
  wrapper.className = 'wishes-wrapper';

  const label = document.createElement('label');
  label.className = 'field';
  label.innerHTML = '<span class="label-text">И ещё вот что</span>';

  const textarea = document.createElement('textarea');
  textarea.className = 'wishes-textarea';

  const preview = document.createElement('div');
  preview.className = 'wishes-preview';

  textarea.addEventListener('input', () => {
    preview.innerHTML = highlightUrgentWords(textarea.value);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(textarea);
  wrapper.appendChild(preview);
  return wrapper;
}
```

**Интеграция:** вызвать `createWishesBlock()` при создании формы и для первой формы.

Добавить в конец инициализации (после `addDeleteButton`):

```js
// Добавить textarea к первому напитку
form.querySelector('.beverage').appendChild(createWishesBlock());
```

Обновить функцию `createBeverage()` — перед `return clone;` добавить:

```js
  // Удалить клонированный wishes-блок (если был) и добавить свежий
  const oldWishes = clone.querySelector('.wishes-wrapper');
  if (oldWishes) oldWishes.remove();
  clone.appendChild(createWishesBlock());
```

---

### Задача 8* — Колонка «Пожелания» в таблице *(README №8)*

**Исполнитель:** Dev-B
**Файл:** `index.js`

Обновить `collectOrderData` — добавить поле `wishes`:

```js
// Обновлённый collectOrderData (заменяет предыдущий)
function collectOrderData() {
  const beverages = form.querySelectorAll('.beverage');
  return Array.from(beverages).map((fieldset) => {
    const drink = fieldset.querySelector('select').value;
    const milk = fieldset.querySelector('input[type="radio"]:checked').value;
    const options = Array.from(
      fieldset.querySelectorAll('input[type="checkbox"]:checked')
    ).map((cb) => OPTION_NAMES[cb.value]);

    const textarea = fieldset.querySelector('.wishes-textarea');
    const wishes = textarea ? textarea.value : '';

    return {
      drink: DRINK_NAMES[drink],
      milk: MILK_NAMES[milk],
      options: options.join(', '),
      wishes,
    };
  });
}
```

Обновить `buildOrderTable` — добавить колонку:

```js
// Обновлённый buildOrderTable (заменяет предыдущий)
function buildOrderTable(orders) {
  const headerRow =
    '<tr><th>Напиток</th><th>Молоко</th><th>Дополнительно</th><th>Пожелания</th></tr>';
  const bodyRows = orders
    .map(
      (order) =>
        `<tr><td>${order.drink}</td><td>${order.milk}</td><td>${order.options}</td><td>${order.wishes}</td></tr>`
    )
    .join('');

  return `<table class="order-table"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
}
```

---

### Задача 9* — Выбор времени заказа *(README №9)*

**Исполнитель:** Dev-B
**Файлы:** `index.js`, `styles.css`

**CSS** — добавить в `styles.css`:

```css
/* Задача 9 — время заказа */
.time-field {
  margin-top: 15px;
}

.time-field label {
  display: block;
  margin-bottom: 5px;
}

.time-field input[type="time"] {
  padding: 5px;
  font-size: 14px;
}

.time-error {
  border-color: red !important;
}

.order-button {
  display: block;
  margin-top: 20px;
  font-size: 16px;
  padding: 7px 20px;
  border: 2px solid orange;
  border-radius: 5px;
  cursor: pointer;
  background: #fff;
}
```

**HTML** (в модальном окне) — обновить содержимое `#modal`, заменить на:

```html
<div class="modal hidden" id="modal">
  <button type="button" class="modal-close" id="modal-close">✕</button>
  <h2>Заказ принят!</h2>
  <div id="modal-content"></div>
  <div class="time-field">
    <label for="order-time">Выберите время заказа</label>
    <input type="time" id="order-time" />
  </div>
  <button type="button" class="order-button" id="order-button">Оформить</button>
</div>
```

**JS** — добавить в `index.js`:

```js
// index.js — Задача 9

const orderTimeInput = document.getElementById('order-time');
const orderButton = document.getElementById('order-button');

orderButton.addEventListener('click', () => {
  const selectedTime = orderTimeInput.value;

  if (!selectedTime) {
    orderTimeInput.classList.add('time-error');
    alert('Пожалуйста, выберите время заказа');
    return;
  }

  const now = new Date();
  const [hours, minutes] = selectedTime.split(':').map(Number);
  const selectedMinutes = hours * 60 + minutes;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (selectedMinutes <= currentMinutes) {
    orderTimeInput.classList.add('time-error');
    alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее');
    return;
  }

  orderTimeInput.classList.remove('time-error');
  closeModal();
});
```

Также при каждом открытии модального окна сбрасывать состояние поля времени:

```js
// Обновить openModal — сбрасывать поле времени
function openModal() {
  orderTimeInput.value = '';
  orderTimeInput.classList.remove('time-error');
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}
```

---

## Итоговая структура файлов

### `index.html` — финальный вид

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Заказ кофе</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <form>
      <fieldset class="beverage">
        <h4 class="beverage-count">Напиток №1</h4>
        <label class="field">
          <span class="label-text">Я буду</span>
          <select>
            <option value="espresso">Эспрессо</option>
            <option value="capuccino" selected>Капучино</option>
            <option value="cacao">Какао</option>
          </select>
        </label>
        <div class="field">
          <span class="checkbox-label">Сделайте напиток на</span>
          <label class="checkbox-field">
            <input type="radio" name="milk-1" value="usual" checked />
            <span>обычном молоке</span>
          </label>
          <label class="checkbox-field">
            <input type="radio" name="milk-1" value="no-fat" />
            <span>обезжиренном молоке</span>
          </label>
          <label class="checkbox-field">
            <input type="radio" name="milk-1" value="soy" />
            <span>соевом молоке</span>
          </label>
          <label class="checkbox-field">
            <input type="radio" name="milk-1" value="coconut" />
            <span>кокосовом молоке</span>
          </label>
        </div>
        <div class="field">
          <span class="checkbox-label">Добавьте к напитку:</span>
          <label class="checkbox-field">
            <input type="checkbox" name="options-1" value="whipped cream" />
            <span>взбитых сливок</span>
          </label>
          <label class="checkbox-field">
            <input type="checkbox" name="options-1" value="marshmallow" />
            <span>зефирок</span>
          </label>
          <label class="checkbox-field">
            <input type="checkbox" name="options-1" value="chocolate" />
            <span>шоколад</span>
          </label>
          <label class="checkbox-field">
            <input type="checkbox" name="options-1" value="cinnamon" />
            <span>корицу</span>
          </label>
        </div>
      </fieldset>
      <div>
        <button type="button" class="add-button">+ Добавить напиток</button>
      </div>
      <div style="margin-top: 30px">
        <button type="submit" class="submit-button">Готово</button>
      </div>
    </form>

    <div class="overlay hidden" id="overlay"></div>
    <div class="modal hidden" id="modal">
      <button type="button" class="modal-close" id="modal-close">✕</button>
      <h2>Заказ принят!</h2>
      <div id="modal-content"></div>
      <div class="time-field">
        <label for="order-time">Выберите время заказа</label>
        <input type="time" id="order-time" />
      </div>
      <button type="button" class="order-button" id="order-button">Оформить</button>
    </div>

    <script src="index.js"></script>
  </body>
</html>
```

### `styles.css` — финальный вид

```css
.beverage {
  position: relative;
  border: 1px solid #eee;
  margin: 15px 0;
  padding: 15px;
}

.beverage-count {
  margin: 0 0 15px;
}

.field {
  display: block;
  margin-bottom: 10px;
}

.label-text {
  display: inline-block;
  width: 80px;
}

.checkbox-label {
  margin-bottom: 5px;
  display: inline-block;
}

.checkbox-field {
  margin: 5px 0;
  display: block;
}

.add-button {
  border: none;
  background: none;
  padding: 10px;
  color: rgba(0, 27, 255, 0.82);
  font-size: 14px;
  text-decoration: underline dashed;
  cursor: pointer;
}

.submit-button {
  font-size: 16px;
  padding: 7px 15px;
  border: 2px solid orange;
  border-radius: 5px;
}

/* Задача 2 — кнопка удаления */
.delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.delete-button:hover {
  color: #e00;
}

/* Задача 3 — модальное окно */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  z-index: 101;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  color: #e00;
}

.hidden {
  display: none;
}

/* Задача 6 — таблица заказа */
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.order-table th {
  background: #f5f5f5;
}

/* Задача 7 — textarea */
.wishes-wrapper {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.wishes-wrapper textarea {
  flex: 1;
  min-height: 60px;
  resize: vertical;
  padding: 6px;
}

.wishes-preview {
  flex: 1;
  padding: 6px;
  border: 1px dashed #ccc;
  min-height: 60px;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Задача 9 — время заказа */
.time-field {
  margin-top: 15px;
}

.time-field label {
  display: block;
  margin-bottom: 5px;
}

.time-field input[type='time'] {
  padding: 5px;
  font-size: 14px;
}

.time-error {
  border-color: red !important;
}

.order-button {
  display: block;
  margin-top: 20px;
  font-size: 16px;
  padding: 7px 20px;
  border: 2px solid orange;
  border-radius: 5px;
  cursor: pointer;
  background: #fff;
}
```

### `index.js` — финальный вид

```js
const form = document.querySelector('form');
const addButton = document.querySelector('.add-button');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const orderTimeInput = document.getElementById('order-time');
const orderButton = document.getElementById('order-button');

// --- Словари ---

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

const URGENT_WORDS_REGEX =
  /\b(срочно|побыстрее|быстрее|поскорее|скорее|очень нужно)\b/gi;

// --- Утилиты ---

function getBeverageCount() {
  return form.querySelectorAll('.beverage').length;
}

function getDeclension(number, one, few, many) {
  const mod10 = number % 10;
  const mod100 = number % 100;

  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

function highlightUrgentWords(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(URGENT_WORDS_REGEX, '<b>$1</b>');
}

// --- Формы напитков (Задачи 1, 2, 7) ---

function addDeleteButton(fieldset) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'delete-button';
  button.textContent = '✕';
  fieldset.prepend(button);
}

function createWishesBlock() {
  const wrapper = document.createElement('div');
  wrapper.className = 'wishes-wrapper';

  const label = document.createElement('label');
  label.className = 'field';
  label.innerHTML = '<span class="label-text">И ещё вот что</span>';

  const textarea = document.createElement('textarea');
  textarea.className = 'wishes-textarea';

  const preview = document.createElement('div');
  preview.className = 'wishes-preview';

  textarea.addEventListener('input', () => {
    preview.innerHTML = highlightUrgentWords(textarea.value);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(textarea);
  wrapper.appendChild(preview);
  return wrapper;
}

function renumberBeverages() {
  const beverages = form.querySelectorAll('.beverage');
  beverages.forEach((fieldset, i) => {
    const index = i + 1;
    fieldset.querySelector('.beverage-count').textContent = `Напиток №${index}`;

    fieldset.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.name = `milk-${index}`;
    });

    fieldset.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.name = `options-${index}`;
    });
  });
}

function createBeverage() {
  const template = form.querySelector('.beverage');
  const clone = template.cloneNode(true);
  const index = getBeverageCount() + 1;

  clone.querySelector('.beverage-count').textContent = `Напиток №${index}`;

  clone.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.name = `milk-${index}`;
    radio.checked = radio.value === 'usual';
  });

  clone.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.name = `options-${index}`;
    checkbox.checked = false;
  });

  clone.querySelector('select').selectedIndex = 1;

  const oldWishes = clone.querySelector('.wishes-wrapper');
  if (oldWishes) oldWishes.remove();
  clone.appendChild(createWishesBlock());

  return clone;
}

// --- Модальное окно (Задачи 3, 4, 5, 6, 8, 9) ---

function openModal() {
  orderTimeInput.value = '';
  orderTimeInput.classList.remove('time-error');
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}

function closeModal() {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
}

function getOrderCountText() {
  const count = getBeverageCount();
  const word = getDeclension(count, 'напиток', 'напитка', 'напитков');
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

    const textarea = fieldset.querySelector('.wishes-textarea');
    const wishes = textarea ? textarea.value : '';

    return {
      drink: DRINK_NAMES[drink],
      milk: MILK_NAMES[milk],
      options: options.join(', '),
      wishes,
    };
  });
}

function buildOrderTable(orders) {
  const headerRow =
    '<tr><th>Напиток</th><th>Молоко</th><th>Дополнительно</th><th>Пожелания</th></tr>';
  const bodyRows = orders
    .map(
      (order) =>
        `<tr><td>${order.drink}</td><td>${order.milk}</td><td>${order.options}</td><td>${order.wishes}</td></tr>`
    )
    .join('');

  return `<table class="order-table"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
}

// --- Инициализация ---

addDeleteButton(form.querySelector('.beverage'));
form.querySelector('.beverage').appendChild(createWishesBlock());

// --- Обработчики ---

addButton.addEventListener('click', () => {
  const insertBefore = addButton.parentElement;
  const newBeverage = createBeverage();
  form.insertBefore(newBeverage, insertBefore);
});

form.addEventListener('click', (event) => {
  if (!event.target.closest('.delete-button')) return;
  if (getBeverageCount() <= 1) return;

  event.target.closest('.beverage').remove();
  renumberBeverages();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const modalContent = document.getElementById('modal-content');
  const orders = collectOrderData();
  modalContent.innerHTML = `<p>${getOrderCountText()}</p>${buildOrderTable(orders)}`;
  openModal();
});

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

orderButton.addEventListener('click', () => {
  const selectedTime = orderTimeInput.value;

  if (!selectedTime) {
    orderTimeInput.classList.add('time-error');
    alert('Пожалуйста, выберите время заказа');
    return;
  }

  const now = new Date();
  const [hours, minutes] = selectedTime.split(':').map(Number);
  const selectedMinutes = hours * 60 + minutes;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (selectedMinutes <= currentMinutes) {
    orderTimeInput.classList.add('time-error');
    alert(
      'Мы не умеем перемещаться во времени. Выберите время позже, чем текущее'
    );
    return;
  }

  orderTimeInput.classList.remove('time-error');
  closeModal();
});
```

---

## Чек-лист перед сдачей

- [ ] «+ Добавить напиток» создаёт новый fieldset с корректным номером
- [ ] Крестик удаляет напиток; не работает, если напиток один
- [ ] Номера пересчитываются после удаления
- [ ] Кнопка «Готово» открывает модалку
- [ ] Крестик и оверлей закрывают модалку
- [ ] В модалке корректный текст «Вы заказали N напиток/напитка/напитков»
- [ ] Таблица заказа заполняется данными из формы
- [ ] Textarea с предпросмотром и выделением ключевых слов
- [ ] Колонка «Пожелания» в таблице модалки
- [ ] Поле времени с валидацией и кнопка «Оформить»
