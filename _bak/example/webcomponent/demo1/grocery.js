class Grocery extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({
            mode: 'closed'
        });
    }

    set detail(item) {
        this.root.innerHTML = `
        <style>
          li {
            list-style: none;
            border-bottom: 1px solid #ececec;
            height: 40px;
            line-height: 22px;
            padding: 16px 10px 0 10px;
          }
          li:last-child { border-bottom: none; }
          li:hover { background-color: #6fb98f; cursor: pointer; }
          span { display: inline-block; padding-bottom: 10px; }
          .name { width: 250px; }
          .isfood { width: 230px; }
          .checkbox { height: 20px; width: 20px; }
        </style>
        <li>
          <span class="name">${item.name}</span>
          <span class="isfood">
            <input class="checkbox" type="checkbox" onclick="return false;" ${item.isFood && 'checked'}>
          </span>
        </li>
      `;
    }
}

customElements.define('grocery-item', Grocery);