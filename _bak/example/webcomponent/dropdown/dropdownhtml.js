'use strict';

import Button from '../button/button.js';

// const btn = new Button();
// console.log(btn);
// // 如何将 btn的 objectElement变为<my-button></my-button>??? 是否有必要？

/**
 * 目前使用 引入，然后与字符串中，直接写元素标签的方式 
 * 注：引入必须有。
 */

export const dropdownHTML = `
    <div class="dropdown">
        <my-button as-atom>Content</my-button>
        <div class="dropdown-list-container">
            <ul class="dropdown-list"></ul>
        </div>
    </div>
`;