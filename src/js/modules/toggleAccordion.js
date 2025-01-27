// faq accordion
export const toggleAccordion = () => {
	const accordions = document.querySelectorAll('.js-accordion-item');
	const openAccordion = (accordion) => {
		const content = accordion.querySelector('.js-accordion-answer');
		accordion.classList.add('active');
		content.style.maxHeight = content.scrollHeight + 'px';
		content.style.opacity = 1;
	};

	const closeAccordion = (accordion) => {
		const content = accordion.querySelector('.js-accordion-answer');
		accordion.classList.remove('active');
		content.style.maxHeight = null;
		content.style.opacity = 0;
	};

	accordions.forEach((accordion) => {
		const intro = accordion.querySelector('.js-accordion-btn');
		const content = accordion.querySelector('.js-accordion-answer');

		intro.onclick = () => {
			if (content.style.maxHeight) {
				closeAccordion(accordion);
			} else {
				accordions.forEach((accordion) => closeAccordion(accordion));
				openAccordion(accordion);
			}
		};
	});
};
