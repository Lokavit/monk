import './grocery.js';

window.addEventListener('load', () => {
    getGroceries();
});

async function getGroceries() {
    const response = await fetch('http://api.alperg.com/groceries');
    const json = await response.json();

    const main = document.querySelector('ul');

    json.forEach(item => {
        const el = document.createElement('grocery-item');
        el.detail = item;
        main.appendChild(el);
    });
}