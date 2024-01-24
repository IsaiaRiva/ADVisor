export const injectSvg = (url, containerId, events = {}) => {
	fetch(url)
		.then(response => response.text())
		.then(svgText => {
			const tempContainer = document.createElement('div');
			tempContainer.innerHTML = svgText;

			const svgElement = tempContainer.querySelector('svg');

			if (svgElement) {
				Object.entries(events).forEach(([key, value]) => {
					svgElement[key] = value;
				});

				const container = document.getElementById(containerId);
				container.appendChild(svgElement);
			} else {
				// [] TODO Fallback SVG
				console.error('SVG element not found in the file.');
			}
		})
		.catch(error => {
			// [] TODO Fallback SVG
			console.error('Error fetching SVG file:', error);
		});
};
