export const showMoreText = () => {
	let buttons = document.querySelectorAll('.js-btn-more');
	buttons.forEach((button) => {
		button.addEventListener('click', () => {
			console.log('show');
			button.classList.toggle('active');
			let text = button.previousElementSibling;
			if (text.style.maxHeight) {
				text.style.maxHeight = null;
			} else {
				text.style.maxHeight = text.scrollHeight + 'px';
			}
		});
	});
};
