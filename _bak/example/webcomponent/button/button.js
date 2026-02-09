'use strict';

/** 按钮组件 封装
 * 引入对应 html.js文件，及对应css.js文件。用于拼接模板
 * 
 */
import {
    buttonHTML
} from './buttonhtml.js'; // 引入 HTML.js
import {
    buttonCSS
} from './buttoncss.js' // 引入 CSS.js

// 创建模板元素
const template = document.createElement('template');
// 将导入的内容，拼接成模板标签的完整内容，
template.innerHTML = `<style>${buttonCSS}</style>${buttonHTML}`;

export default class Button extends HTMLElement {

    /**
     * constructor中首先第一件事情就是调用 super
     * super指代了整个prototype或者__proto__指向的对象
     */
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({
            // open外部可访问（通过element.shadowRoot），closed则不能
            mode: 'open'
        });

        // 将模板内容克隆 添加到shadowRoot子级
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        console.log(`button.js 构造函数中shadowDOM子级添加克隆的模板内容，完毕。`);

        // 获取容器元素
        this._container = this._shadowRoot.querySelector('.container');

        // 获取button元素
        this._button = this._shadowRoot.querySelector('button');

        // 添加事件监听器
        this._button.addEventListener('click', () => {
            console.log(`button.js 添加事件监听器`);
            // this.onClick('Hello from within the Custom Element');
            this.dispatchEvent(new CustomEvent('onClick', {
                detail: 'Hello from within the Custom Element',
            }));
        })
    }

    // 指定观察的属性，这样attributeChangedCallback才会起作用
    static get observedAttributes() {
        console.log(`button.js 指定需监听的属性`);
        return ['label'];
    }

    // 使用 get 确保始终获得最新值，而无需自己在回调函数中分配 [如this.label始终从该函数返回最新属性值]
    get label() {
        console.log(`button.js 获取label的最新属性值${this.getAttribute('label')}`);
        return this.getAttribute('label');
    }
    // 使用 set 将信息传递给具有properties的自定义元素
    set label(value) {
        this.setAttribute('label', value); // 此处根据元素属性label获取其值
        console.log(`button.js 设置label的属性值${value}`);
    }

    // 4个常用生命周期
    connectedCallback() {
        console.log(`button.js 自定义元素加入页面时，被调用`);
        // 如果 该自定义元素有 as-atom属性，则执行内部代码
        if (this.hasAttribute('as-atom')) this._container.style.padding = '0px';
    }
    disconnectedCallback() {
        console.log(`button.js 自定义元素从页面移除时，被调用`);
    }
    adoptedCallback() {
        console.log(`button.js 自定义元素被移动到新的文档时，被调用`);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`button.js 自定义元素属性发生变化时，被调用`);
        this.render();
        console.log(`button.js 属性变更后，重新渲染`);
    }

    // 渲染
    render() {
        // 输出 button的内容为 label属性变更后的内容
        this._button.innerHTML = this.label;
        console.log(`button.js 渲染函数`);
    }
}

customElements.define('my-button', Button);