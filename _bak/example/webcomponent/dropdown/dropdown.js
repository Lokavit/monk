'use strict';

/**
 * 下拉组件 封装
 * 
 */

import {
    dropdownHTML
} from './dropdownhtml.js';
import {
    dropdownCSS
} from './dropdowncss.js';


const template = document.createElement('template');
template.innerHTML = `<style>${dropdownCSS}</style>${dropdownHTML}`;

export default class Dropdown extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({
            mode: 'open'
        });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        console.log(`dropdown.js 构造函数中shadowDOM子级添加克隆的模板内容，完毕。`);

        this.open = false; // 该状态用于添加or移除dropdown

        this._button = this._shadowRoot.querySelector('my-button');
        this._dropdown = this._shadowRoot.querySelector('.dropdown');
        this._dropdownList = this._shadowRoot.querySelector('.dropdown-list');

        this._button.addEventListener('onClick', this.toggleOpen.bind(this));
    }

    // 指定监听的属性
    static get observedAttributes() {
        console.log(`dropdown.js 指定需监听的属性`);
        return ['option', 'options'];
    }

    get option() {
        console.log(`dropdown.js get option()属性值:${this.getAttribute('option')}`);
        return this.getAttribute('option');
    }
    set option(value) {
        this.setAttribute('option', value);
        console.log(`dropdown.js set option()属性值:${value}`);
    }
    get options() {
        console.log(`dropdown.js get options()属性值:${JSON.parse(this.getAttribute('options'))}`);
        return JSON.parse(this.getAttribute('options'));
    }
    set options(value) {
        this.setAttribute('options', JSON.stringify(value));
        console.log(`dropdown.js set options()属性值:${JSON.stringify(value)}`);
    }
    // 4个常用生命周期
    connectedCallback() {
        console.log(`dropdown.js 自定义元素加入页面时，被调用`);
    }
    disconnectedCallback() {
        console.log(`dropdown.js 自定义元素从页面移除时，被调用`);
    }
    adoptedCallback() {
        console.log(`dropdown.js 自定义元素被移动到新的文档时，被调用`);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`dropdown.js 自定义元素属性发生变化时，被调用`);
        this.render();
        console.log(`dropdown.js 属性变更后，重新渲染`)
    }

    // 渲染
    render() {
        // 如果有选项组对象， 给button的label也就是明文，设置为外部组件中option属性的对应label值
        if (this.options) this._button.setAttribute('label', this.options[this.option].label);

        this._dropdownList.innerHTML = '';

        Object.keys(this.options || {}).forEach(key => {
            let option = this.options[key];
            let _option = document.createElement('li');
            _option.innerHTML = option.label;
            // 如果选中一项，将选中项样式改变。
            if (this.option && this.option === key) _option.classList.add('selected');

            _option.addEventListener('click', () => {
                this.option = key;
                console.log(`dropdown.js 单个选项点击事件，${key}`);
                this.toggleOpen();
                // 向外部提供自定义事件，以变更选项
                this.dispatchEvent(new CustomEvent('onChange', {
                    detail: key
                }));
                this.render();
                console.log(`dropdown.js 渲染函数中选项的点击事件中，递归渲染函数`)
            })

            this._dropdownList.appendChild(_option);
        })
        console.log(`dropdown.js 渲染函数执行完成`);
    }

    // 状态切换
    toggleOpen(event) {
        this.open = !this.open;
        this.open ? this._dropdown.classList.add('open') : this._dropdown.classList.remove('open');
        console.log(`dropdown.js 状态切换函数结束`);
    }
}

customElements.define('my-dropdown', Dropdown);