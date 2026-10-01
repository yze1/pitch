const carousel = document.querySelector("[data-carousel]");

if (carousel) {
    const scriptUrl = document.currentScript.src;
    const stage = carousel.querySelector(".portfolio-carousel__stage");
    let cards = [];

    const posterFor = source => source
        .replace("/gifs/", "/gifs/posters/")
        .replace(/\.gif$/i, ".webp");

    function render() {
        if (!cards.length) return;

        const width = cards[0].offsetWidth;
        const peek = matchMedia("(max-width: 768px)").matches ? 0 : Math.min(42, width * 0.13);
        const step = width - peek;
        const distance = (cards.length - 1) * step;
        const scroll = Math.min(distance, Math.max(0, -carousel.getBoundingClientRect().top));
        const position = scroll / step;
        const active = Math.min(cards.length - 1, Math.ceil(position));

        carousel.style.height = `${innerHeight + distance}px`;

        cards.forEach((card, index) => {
            const caption = card.querySelector(".portfolio-carousel__caption");
            card.style.zIndex = index;
            card.style.setProperty("--x", `${Math.max(index * peek, index * width - scroll)}px`);
            caption.style.transitionDelay = index === active ? "0.2s" : "0s";
            caption.style.opacity = index === active ? 1 : 0;
        });
    }

    fetch(new URL("../data/carousel.json", scriptUrl))
        .then(response => {
            if (!response.ok) throw new Error(`Could not load carousel: ${response.status}`);
            return response.json();
        })
        .then(items => {
            console.assert(items.every(item => item.link && item.title && item.year), "Invalid carousel item");

            items.forEach((item, index) => {
                const card = document.createElement("figure");
                const image = document.createElement("img");
                const caption = document.createElement("figcaption");
                const title = document.createElement("p");
                const year = document.createElement("p");

                card.className = "portfolio-carousel__card";
                image.src = posterFor(item.link);
                image.dataset.animatedSrc = item.link;
                image.alt = item.title;
                image.loading = index < 3 ? "eager" : "lazy";
                caption.className = "portfolio-carousel__caption";
                title.textContent = item.title;
                year.textContent = item.year;
                caption.append(title, year);
                card.append(image, caption);
                stage.append(card);
                setupHoverGif(image);
            });

            cards = [...stage.children];
            render();
        })
        .catch(console.error);

    addEventListener("scroll", render, {passive: true});
    addEventListener("resize", render);
}
