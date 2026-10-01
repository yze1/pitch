document.documentElement.classList.toggle("noise-on", document.documentElement.dataset.noise !== "off");

const noiseSettings = [
    {name: "red", hex: "#FF2E24", opacity: 29, size: 275, contrast: 353, brightness: 40, blend: "multiply"},
    {name: "white", hex: "#FAF9F6", opacity: 4, size: 161, contrast: 100, brightness: 200, blend: "normal"},
    {name: "black", hex: "#1D1D1D", opacity: 50, size: 275, contrast: 330, brightness: 7, blend: "screen"}
];

const noiseUrl = setting => {
    const contrast = setting.contrast / 100;
    const brightness = setting.brightness / 100;
    const slope = contrast * brightness;
    const intercept = (0.5 - 0.5 * contrast) * brightness;
    const matrix = `${slope} 0 0 0 ${intercept} 0 ${slope} 0 0 ${intercept} 0 0 ${slope} 0 ${intercept} 0 0 0 1 0`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${setting.size}" height="${setting.size}"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="1" stitchTiles="stitch"/><feColorMatrix values="${matrix}"/></filter><rect width="100%" height="100%" filter="url(#noise)" opacity="${setting.opacity / 100}"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const applyNoise = setting => {
    const root = document.documentElement.style;
    root.setProperty(`--${setting.name}-noise`, noiseUrl(setting));
    root.setProperty(`--${setting.name}-blend`, setting.blend);
};

const panel = document.createElement("aside");
panel.className = "noise-controls";
panel.setAttribute("aria-label", "Noise settings");
panel.innerHTML = noiseSettings.map((setting, index) => `
    <div class="noise-controls__preset" data-name="${setting.name}" style="--preset-colour:var(--${setting.name});--preset-noise:var(--${setting.name}-noise);--preset-blend:var(--${setting.name}-blend,normal)">
        <h2>#${setting.hex.slice(1)}</h2>
        ${[["opacity", 0, 100, 1, "%"], ["size", 20, 400, 1, "px"], ["contrast", 0, 400, 1, "%"], ["brightness", 0, 300, 1, "%"]].map(([key, min, max, step, unit]) => `
            <label class="noise-controls__row"><span>${key}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${setting[key]}" data-index="${index}" data-key="${key}"><output>${setting[key]}${unit}</output></label>
        `).join("")}
        <label class="noise-controls__row"><span>blend</span><select data-index="${index}" data-key="blend">${["normal", "multiply", "screen", "overlay", "soft-light"].map(value => `<option${value === setting.blend ? " selected" : ""}>${value}</option>`).join("")}</select><output>${setting.blend}</output></label>
    </div>
`).join("") + `<button class="noise-controls__export" type="button">Export settings</button>`;
document.body.append(panel);

panel.addEventListener("input", event => {
    const control = event.target.closest("[data-key]");
    if (!control) return;
    const setting = noiseSettings[control.dataset.index];
    setting[control.dataset.key] = control.type === "range" ? Number(control.value) : control.value;
    control.nextElementSibling.value = control.value + (control.type === "range" ? control.parentElement.textContent.includes("size") ? "px" : "%" : "");
    applyNoise(setting);
});

panel.querySelector(".noise-controls__export").addEventListener("click", event => {
    const exportSettings = noiseSettings.map(setting => ({...setting, averageWithNoise: null, imageAverage: null}));
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(exportSettings, null, 2)], {type: "application/json"}));
    link.download = "noise-settings.json";
    link.click();
    URL.revokeObjectURL(link.href);
    event.currentTarget.textContent = "Exported";
    setTimeout(() => event.currentTarget.textContent = "Export settings", 1200);
});

addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "n" && !event.target.closest?.("input, textarea, [contenteditable]")) {
        document.documentElement.classList.toggle("noise-debug");
    }
});
