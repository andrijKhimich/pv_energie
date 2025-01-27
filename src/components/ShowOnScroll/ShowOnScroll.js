// in-view detect
!(function () {
	setTimeout(() => {
		const blocks = document.querySelectorAll(".in-view-detect");

		[].forEach.call(blocks, $item => {
			function onScroll() {
				if (
					$item.getBoundingClientRect().top - window.innerHeight <=
						($item.offsetHeight * -1) / 4 &&
					!$item.classList.contains("in-view")
				) {
					$item.classList.remove("in-view-detect");
					$item.classList.add("in-view");
				}
			}

			onScroll();

			// if (!isMobile) {
			//   appScrollBar.addListener(onScroll);
			// } else {
			//   document.addEventListener('scroll', onScroll)
			// }
		});
	}, 1200);
})();
