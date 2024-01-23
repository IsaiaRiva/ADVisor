export const setInputType = (selector, type) => {
	const input = document.querySelector(selector);
	if (!input) return;
	input.type = type;
};
