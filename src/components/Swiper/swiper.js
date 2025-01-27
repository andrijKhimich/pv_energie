const slider = new Swiper(".swiper", {
	grabCursor: false,
	loop: true,
	spaceBetween: 12,
	slidesPerView: 3,
	freeMode: true,
	allowTouchMove: false,
	noSwiping: true,
	speed: 20000,
	freeModeMomentum: false,
	autoplay: {
		delay: 0,
		disableOnInteraction: true,
	},
	breakpoints: {
		992: {
			slidesPerView: 4.33,
			spaceBetween: 30,
		},
	},
});
