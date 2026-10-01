const projectRoot = new URL("../", document.currentScript.src);

function updateHeaderColor() {
    const header = document.querySelector("#header");
    if (!header?.firstElementChild) return;

    const redSections = [...document.querySelectorAll("section.red")]
        .map(section => section.getBoundingClientRect());

    header.querySelectorAll("a, button, strong").forEach(element => {
        const bounds = element.getBoundingClientRect();
        const red = redSections.find(section => section.top < bounds.bottom && section.bottom > bounds.top);
        const start = red ? Math.max(0, Math.min(1, (red.top - bounds.top) / bounds.height)) : 1;
        const end = red ? Math.max(0, Math.min(1, (red.bottom - bounds.top) / bounds.height)) : 1;

        element.style.setProperty("--header-red-start", `${start * 100}%`);
        element.style.setProperty("--header-red-end", `${end * 100}%`);
    });
}

addEventListener("scroll", updateHeaderColor, { passive: true });
addEventListener("resize", updateHeaderColor);
document.addEventListener("partialsloaded", updateHeaderColor);

async function loadPartial(selector, filePath) {
    const element = document.querySelector(selector);

    if (!element) {
        console.error(`Partial container not found: ${selector}`);
        return;
    }

    try {
        const response = await fetch(new URL(filePath, projectRoot), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Could not load ${filePath}: ${response.status}`
            );
        }

        element.innerHTML = await response.text();

        const partialUrl = new URL(filePath, projectRoot);

        element.querySelectorAll("[src]").forEach(media => {
            media.src = new URL(media.getAttribute("src"), partialUrl);
        });

        element.querySelectorAll("[href^='/']").forEach(link => {
            link.href = new URL(link.getAttribute("href").slice(1), projectRoot);
        });

        const theme = element.dataset.theme;

        if (theme && element.firstElementChild) {
            element.firstElementChild.classList.add(theme);
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const partials = [
        loadPartial(
            "#header",
            "partials/header.html"
        ),
        loadPartial(
            "#footer",
            "partials/footer.html"
        )
    ];

    if (document.querySelector("#contact-partial")) {
        partials.push(loadPartial(
            "#contact-partial",
            "partials/contact.html"
        ));
    }

    await Promise.all(partials);

    document.dispatchEvent(new Event("partialsloaded"));

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const open = mobileMenu.classList.toggle("open");

            menuToggle.textContent = open ? "×" : "=";
            menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
            menuToggle.setAttribute("aria-expanded", String(open));
            updateHeaderColor();
        });
    }

});
