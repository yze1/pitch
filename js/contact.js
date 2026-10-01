function setupContact() {
    const form = document.querySelector(".mailing-list-form");

    if (form && !form.dataset.contactReady) {
        form.dataset.contactReady = "true";

        form.addEventListener("submit", event => {
            event.preventDefault();
            if (form.reportValidity()) form.dispatchEvent(new CustomEvent("mailinglistsubmit", {
                bubbles: true,
                detail: { email: form.elements.email.value }
            }));
        });
    }

    document.querySelectorAll(".holding-header a[href$='/contact/']").forEach(link => {
        link.href = "#contact";
    });
}

document.addEventListener("DOMContentLoaded", setupContact);
document.addEventListener("partialsloaded", setupContact);
