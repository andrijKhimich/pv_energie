// import libs from './modules/libs.js';
// import $ from 'jquery';
// import Swiper from "swiper";

import {toggleTab} from "./modules/tabs.js";
toggleTab();

import {toggleMenu} from "./modules/toggleMenu.js";
toggleMenu();

import {toggleAccordion} from "./modules/toggleAccordion.js";
toggleAccordion();

import {showMoreText} from "./modules/showMoreText.js";
showMoreText();

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
