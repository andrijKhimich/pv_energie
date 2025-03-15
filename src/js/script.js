// import libs from './modules/libs.js';
// import $ from 'jquery';
// import Swiper from "swiper";
// addEventListener("DOMContentLoaded", () => {
var detectSubMenu = function detectSubMenu() {
  var submenus = document.querySelectorAll(".subnav");
  submenus.forEach(function (submenu) {
    var parent = submenu.parentElement;
    parent.classList.add("has-children");
    var link = parent.querySelector("a");
    if (link) {
      link.setAttribute("href", "#");
    }
  });
};
detectSubMenu();
var toggleMenu = function toggleMenu() {
  var burger = document.querySelector(".js-burger");
  var menu = document.querySelector(".js-header-nav");
  var body = document.querySelector("body");
  var submenuItems = document.querySelectorAll(".has-children > a");
  var submenuLinks = document.querySelectorAll(".subnav li a");

  // Toggle menu and lock body scroll on burger click
  burger.addEventListener("click", function () {
    var isActive = menu.classList.contains("active");
    menu.classList.toggle("active", !isActive);
    burger.classList.toggle("active", !isActive);
    body.classList.toggle("locked", !isActive);
    if (!isActive) {
      // Hide all submenus if closing the menu
      submenuItems.forEach(function (link) {
        var submenu = link.nextElementSibling;
        if (submenu && submenu.classList.contains("subnav")) {
          submenu.style.display = "none";
        }
      });
    }
  });

  // Function to toggle submenus on click for small screens
  var toggleSubmenu = function toggleSubmenu(link) {
    var submenu = link.nextElementSibling;
    if (submenu && submenu.classList.contains("subnav")) {
      var isVisible = submenu.style.display === "block";
      submenu.style.display = isVisible ? "none" : "block";
    }
  };

  // Handle window resize and initial load
  var handleResize = function handleResize() {
    if (window.innerWidth > 992) {
      // Reset everything on large screens
      menu.classList.remove("active");
      burger.classList.remove("active");
      body.classList.remove("locked");
      submenuItems.forEach(function (link) {
        var submenu = link.nextElementSibling;
        if (submenu && submenu.classList.contains("subnav")) {
          submenu.style.display = "block";
        }
        // Remove the click event listener for large screens
        link.removeEventListener("click", link._toggleSubmenu);
        delete link._toggleSubmenu; // Clean up the reference
      });
    } else {
      // Hide all submenus and add click event listeners on small screens
      submenuItems.forEach(function (link) {
        var submenu = link.nextElementSibling;
        if (submenu && submenu.classList.contains("subnav")) {
          submenu.style.display = "none";
        }
        // Add the click event listener only if it doesn't already exist
        if (!link._toggleSubmenu) {
          link._toggleSubmenu = function (e) {
            e.preventDefault(); // Prevent default link behavior for parent links
            toggleSubmenu(link);
          };
          link.addEventListener("click", link._toggleSubmenu);
        }
      });

      // Ensure submenu links work and don't close the menu
      submenuLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
          // Allow the link to work normally (do not preventDefault)
          // Prevent the menu from closing
          e.stopPropagation();
        });
      });
    }
  };
  window.addEventListener("resize", handleResize);
  handleResize(); // Run initially to set up the correct state
};

toggleMenu();

var swiper = new Swiper(".hero-slider", {
  spaceBetween: 0,
  centeredSlides: true,
  autoplay: {
    delay: 10000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
// });
