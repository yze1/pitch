const projectsRoot = new URL("../", document.currentScript.src);
const projectsUrl = path => new URL(path.replace(/^\.\//, ""), projectsRoot).href;

fetch(projectsUrl("data/projects.json"), { cache: "no-store" })
    .then(response => {
        if (!response.ok) throw new Error(`Could not load projects: ${response.status}`);
        return response.json();
    })
    .then(projects => {
        const list = document.querySelector("[data-project-list]");
        const detail = document.querySelector("[data-project-detail]");

        if (list) {
            list.innerHTML = projects.map(project => `
                <article class="project-card">
                    <a href="${projectsUrl(`work/project/?project=${encodeURIComponent(project.slug)}`)}">
                        <img src="${projectsUrl(project.thumbnail)}" alt="${project.title}">
                    </a>
                    <div class="metadata">
                        <h4 class="logo">${project.title}</h4>
                        <p class="mono">${project.year}</p>
                    </div>
                    <p>${project.client}</p>
                </article>
            `).join("");
        }

        if (detail) {
            const slug = new URLSearchParams(location.search).get("project");
            const project = projects.find(item => item.slug === slug);

            if (!project) {
                detail.innerHTML = '<div class="s12"><h2>Project not found</h2></div>';
                return;
            }

            document.title = `${project.title} — P&S`;
            detail.innerHTML = `
                <div class="s12"><h2>${project.title}</h2></div>
                <div class="s12"><h3>${project.client}</h3></div>
                <div class="s12"><video src="${projectsUrl(project.video)}" controls playsinline></video></div>
                <div class="s8"><h4>${project.description}</h4></div>
                <div class="s4 right"><p>${project.serviceCredits}</p></div>
            `;
        }
    })
    .catch(console.error);
