function setupHoverGif(image) {
    const animatedSrc = image.dataset.animatedSrc;
    if (!animatedSrc) return;

    const stillSrc = image.src;
    image.addEventListener("pointerenter", () => { image.src = animatedSrc; });
    image.addEventListener("pointerleave", () => { image.src = stillSrc; });
}

document.querySelectorAll("img[data-animated-src]").forEach(setupHoverGif);
