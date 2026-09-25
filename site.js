"use strict";

const photos = Array.from(document.querySelectorAll(".gallery-item, .plan-link, .map-link, .surroundings-photo"));
const lightbox = document.querySelector(".lightbox");
const image = document.querySelector("#lightbox-image");
const caption = document.querySelector("#lightbox-caption");
const counter = document.querySelector("#photo-counter");
let currentPhoto = 0;
let opener;

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  image.src = photo.href;
  image.alt = photo.querySelector("img").alt;
  caption.textContent = photo.dataset.caption;
  counter.textContent = `${currentPhoto + 1} / ${photos.length}`;
}

if (lightbox && typeof lightbox.showModal === "function") {
  photos.forEach((photo, index) => {
    photo.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = photo;
      showPhoto(index);
      lightbox.showModal();
      document.body.classList.add("gallery-open");
    });
  });

  document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  document.querySelector("#previous-photo").addEventListener("click", () => showPhoto(currentPhoto - 1));
  document.querySelector("#next-photo").addEventListener("click", () => showPhoto(currentPhoto + 1));
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(currentPhoto + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target !== lightbox) return;
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
  });
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("gallery-open");
    opener?.focus({ preventScroll: true });
  });
  image.addEventListener("error", () => {
    caption.textContent = "Fotografii se nepodařilo načíst. Zkuste další snímek nebo stránku obnovte.";
  });
}
