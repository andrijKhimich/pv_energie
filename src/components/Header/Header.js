const toggleMenu = () => {
	const burger = document.querySelector(".js-burger");
	const menu = document.querySelector(".js-header-nav");
	const body = document.querySelector("body");
	burger.addEventListener("click", () => {
		if (!menu.classList.contains("active")) {
			menu.classList.add("active");
			burger.classList.add("active");
			body.classList.add("locked");
		} else {
			menu.classList.remove("active");
			burger.classList.remove("active");
			body.classList.remove("locked");
		}
	});
	window.addEventListener("resize", () => {
		if (window.innerWidth > 992) {
			menu.classList.remove("active");
			burger.classList.remove("active");
			body.classList.remove("locked");
		}
	});
};
toggleMenu();
