const gongScroll = document.querySelector(".gong-scroll");
const gongFrame = document.querySelector(".gong-frame");
const circleStart = 0.2;
const mobileGong = matchMedia("(max-width: 768px)");
let mobileProgress = 0;
let mobileGongComplete = false;
let touchY = 0;

function updateGong() {
    const bounds = gongScroll.getBoundingClientRect();
    const frame = gongFrame.getBoundingClientRect();
    const distance = gongScroll.offsetHeight - innerHeight;
    const progress = mobileGong.matches
        ? mobileProgress
        : Math.max(0, Math.min(1, -bounds.top / distance));
    const expansion = Math.max(0, (progress - circleStart) / (1 - circleStart));
    const radius = expansion * 0.75 * Math.max(innerWidth, innerHeight);

    document.documentElement.style.setProperty("--gong-radius", `${radius}px`);
    document.documentElement.style.setProperty("--gong-center-x", `${frame.left + frame.width / 2}px`);
    document.documentElement.style.setProperty("--gong-center-y", `${frame.top + frame.height / 2}px`);
    gongFrame.style.setProperty("--tagline-offset", `${(1 - expansion) * 100}vh`);
    gongFrame.querySelectorAll(".gong-title :is(h2, h5), .gong-tagline :is(h3, h5), .gong-tagline .quarter-divider").forEach(element => {
        const elementBounds = element.getBoundingClientRect();
        element.style.setProperty("--gong-local-x", `${frame.left + frame.width / 2 - elementBounds.left}px`);
        element.style.setProperty("--gong-local-y", `${frame.top + frame.height / 2 - elementBounds.top}px`);
    });
    document.body.classList.toggle("gong-active", bounds.top <= 0 && bounds.bottom > 0);
}

function fitGong() {
    gongFrame.style.setProperty("--tagline-lift", "0px");
    gongFrame.style.setProperty("--gong-content-shift", "0px");
    gongFrame.style.setProperty("--tagline-offset", "0vh");

    gongFrame.querySelectorAll(".gong-title .spread, .gong-tagline h3.spread").forEach(title => {
        const parent = title.parentElement;
        const style = getComputedStyle(parent);
        const width = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

        title.style.fontSize = "";
        const titleStyle = getComputedStyle(title);
        const fontSize = parseFloat(titleStyle.fontSize);
        const tagline = title.closest(".gong-tagline");
        const measuredWidth = tagline
            ? title.scrollWidth
            : title.scrollWidth - parseFloat(titleStyle.paddingLeft) - parseFloat(titleStyle.paddingRight);
        title.style.fontSize = `${fontSize * width * (tagline ? 0.6 : 1) / measuredWidth}px`;
    });

    const title = gongFrame.querySelector(".gong-title");
    const tagline = gongFrame.querySelector(".gong-tagline");
    const gap = gongFrame.clientHeight / 2 - title.offsetHeight / 2 - tagline.offsetHeight;
    gongFrame.style.setProperty("--tagline-lift", `${Math.max(0, gap * 2 / 3)}px`);

    const contentMiddle = (title.getBoundingClientRect().top + tagline.querySelector("h5").getBoundingClientRect().bottom) / 2;
    const frame = gongFrame.getBoundingClientRect();
    gongFrame.style.setProperty("--gong-content-shift", `${frame.top + frame.height / 2 - contentMiddle}px`);
    updateGong();
}

function consumeMobileScroll(delta, event) {
    if (!mobileGong.matches || mobileGongComplete || delta <= 0 && mobileProgress === 0) return;

    event.preventDefault();
    mobileProgress = Math.max(0, Math.min(1, mobileProgress + delta / innerHeight));
    mobileGongComplete = mobileProgress === 1;
    updateGong();
}

addEventListener("wheel", event => consumeMobileScroll(event.deltaY, event), {passive: false});
addEventListener("touchstart", event => touchY = event.touches[0].clientY, {passive: true});
addEventListener("touchmove", event => {
    const nextY = event.touches[0].clientY;
    consumeMobileScroll(touchY - nextY, event);
    touchY = nextY;
}, {passive: false});

addEventListener("scroll", updateGong, {passive: true});
addEventListener("resize", fitGong);
document.fonts?.ready.then(fitGong);
fitGong();
