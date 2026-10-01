const cursor = document.getElementById("cursor");
const cursorIcons = new URL("../assets/icons/", document.currentScript.src);

let mouseX = 0;
let mouseY = 0;
let x = 0;
let y = 0;

window.addEventListener("pointermove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const rootStyle = getComputedStyle(document.documentElement);
    const gongRadius = parseFloat(rootStyle.getPropertyValue("--gong-radius")) || 0;
    const gongX = parseFloat(rootStyle.getPropertyValue("--gong-center-x")) || innerWidth / 2;
    const gongY = parseFloat(rootStyle.getPropertyValue("--gong-center-y")) || innerHeight / 2;
    const overGongRed = document.body.classList.contains("gong-active")
        && Math.hypot(e.clientX - gongX, e.clientY - gongY) <= gongRadius;

    cursor.classList.toggle("over-red", Boolean(e.target.closest(".red")) || overGongRed);
});

function animate() {
    x += (mouseX - x) * 0.2;
    y += (mouseY - y) * 0.2;

    cursor.style.transform =
        `translate(${x}px, ${y}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
}

animate();

const reel = document.querySelector("mux-player");

if (reel) {
    const cursorLabel = cursor.querySelector("h4");
    let hoveringReel = false;
    const updateLabel = () => {
        if (hoveringReel) {
            const icon = reel.muted ? "unmute" : reel.paused ? "play" : "pause";
            cursorLabel.innerHTML = `<img src="${new URL(`${icon}.svg`, cursorIcons)}" alt="">`;
        }
    };
    const toggleReel = () => {
        if (reel.muted) {
            reel.muted = false;
            reel.play();
        } else {
            reel.paused ? reel.play() : reel.pause();
        }
    };

    reel.addEventListener("pointerenter", () => {
        hoveringReel = true;
        cursor.classList.add("video-hover");
        updateLabel();
    });
    reel.addEventListener("pointerleave", () => {
        hoveringReel = false;
        cursor.classList.remove("video-hover");
        cursorLabel.innerHTML = "<strong>&amp;</strong>";
    });
    reel.addEventListener("play", updateLabel);
    reel.addEventListener("pause", updateLabel);
    reel.addEventListener("volumechange", updateLabel);
    reel.addEventListener("click", toggleReel);
    reel.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleReel();
        }
    });
}
