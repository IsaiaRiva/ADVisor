export const toggleVisibility = (selector) => {
  const elm = document.querySelector(selector);
  if(!elm) return;
  elm.classList.toggle('remove-elm');
}