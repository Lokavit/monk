"use strict";

console.log(`demo.js`);

/** 引入 自定义的下拉组件 */
import Dropdown from "./dropdown/dropdown.js";

const dropdown = new Dropdown(); // 组件实例化

document.body.appendChild(dropdown); // 组件添加到页面body下

dropdown.setAttribute("option", "option2"); // 组件设置属性值

// 组件设定属性值的选项组 此处数据可以是外部请求之后，赋值而来
dropdown.options = {
  option1: {
    label: "选项 一",
  },
  option2: {
    label: "选项 二",
  },
};
// 组件选项变更事件
dropdown.addEventListener("onChange", (event) => {
  console.log(`外部使用时，选项变更:${event.detail}`);
});

const section = document.createElement("section");

for (let i = 0; i < 5; i++) {
  let dropdown_item = new Dropdown();
  dropdown_item.setAttribute("option", `option1`);
  dropdown_item.options = {
    option1: {
      label: "选项 一",
    },
    option2: {
      label: "选项 二",
    },
  };
  // 组件选项变更事件
  dropdown_item.addEventListener("onChange", (event) => {
    console.log(`外部使用时，选项变更:${event.detail}`);
  });

  section.appendChild(dropdown_item);
}

section.onclick = (event) => {
  console.log(`点击事件`, event);
  if (event.target.nodeName.toLocaleLowerCase() == "my-dropdown") {
    console.log(`找到了对应节点`);
  }
};

document.body.appendChild(section);
