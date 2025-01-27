const openTab = (evt, tabName) => {
	let i, tabContent, tabLinks;
	tabContent = document.querySelectorAll('.js-tab-content');
	for (i = 0; i < tabContent.length; i++) {
		tabContent[i].classList.remove('active');
	}
	tabLinks = document.querySelectorAll('.tab__link');
	for (i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(' active', '');
	}
	document.getElementById(tabName).classList.add('active');
	evt.currentTarget.className += ' active';
};

export const toggleTab = () => {
	const tabBtns = document.querySelectorAll('.tab__link');
	tabBtns.forEach((tabBtn) => {
		tabBtn.addEventListener('click', (e) => {
			let target = e.target.getAttribute('data-href');
			openTab(e, target);
		});
	});
};
