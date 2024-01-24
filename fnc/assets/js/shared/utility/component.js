/**
 * @param {string} tag
 * @param {object} attrs
 * @param {array} children
 * @returns {HTMLElement}
 * @description Create an HTML element with attributes and children
 * @example
 * const elm = createElm('div', { class: 'foo' }, [createElm('p', {}, ['Hello world!'])]);
 * // elm = <div class="foo"><p>Hello world!</p></div>
 */
export function component(tag, { attrs = {}, events = {}, children = [] }) {
  const elm = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    elm.setAttribute(key, value);
  });

  Object.entries(events).forEach(([key, value]) => {
    elm[key] = value;
  });

  children.forEach((child) => {
    if (typeof child === "string") {
      child = document.createTextNode(child);
    }
    elm.appendChild(child);
  });

  elm.updateChildren = function (newChildren) {
    elm.innerHTML = "";
    newChildren.forEach((child) => {
      elm.appendChild(child);
    });
  };
  return elm;
}
