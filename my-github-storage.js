const GITHUB_REPO = "Veronika181/My-recipes";
const GITHUB_BRANCH = "main";
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contents`;

function githubToken() {
    return localStorage.getItem("github_token") || "";
}

function githubJeNastaven() {
    return !!githubToken();
}

function githubHeaders() {
    return {
        "Authorization": `token ${githubToken()}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    };
}

// Načte soubor z GitHubu, vrátí parsovaný obsah nebo null
async function githubNacti(path) {
    if (!githubJeNastaven()) return null;
    try {
        const r = await fetch(`${GITHUB_API}/${path}?ref=${GITHUB_BRANCH}&t=${Date.now()}`, {
            headers: githubHeaders()
        });
        if (!r.ok) return null;
        const data = await r.json();
        localStorage.setItem(`gh_sha_${path}`, data.sha);
        const decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

// Uloží obsah do souboru na GitHubu, vrátí true/false
async function githubUloz(path, obsah, zprava) {
    if (!githubJeNastaven()) return false;
    try {
        const sha = await githubZiskejSha(path);
        const body = {
            message: zprava,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(obsah, null, 2)))),
            branch: GITHUB_BRANCH,
        };
        if (sha) body.sha = sha;

        const r = await fetch(`${GITHUB_API}/${path}`, {
            method: "PUT",
            headers: githubHeaders(),
            body: JSON.stringify(body)
        });

        if (r.ok) {
            const data = await r.json();
            localStorage.setItem(`gh_sha_${path}`, data.content.sha);
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

// Získá aktuální SHA souboru (potřebné pro update)
async function githubZiskejSha(path) {
    const ulozene = localStorage.getItem(`gh_sha_${path}`);
    if (ulozene) return ulozene;
    try {
        const r = await fetch(`${GITHUB_API}/${path}?ref=${GITHUB_BRANCH}`, {
            headers: githubHeaders()
        });
        if (!r.ok) return null;
        const data = await r.json();
        localStorage.setItem(`gh_sha_${path}`, data.sha);
        return data.sha;
    } catch {
        return null;
    }
}

// Ověří zda je token platný
async function githubOverToken(token) {
    try {
        const r = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        return r.ok;
    } catch {
        return false;
    }
}

// === GITHUB UI (sdílené pro všechny stránky) ===
function inicializujGithubUI(naPoKonekci) {
    const toggle = document.getElementById("github-toggle");
    const body   = document.getElementById("github-settings-body");
    if (!toggle || !body) return;

    toggle.addEventListener("click", () => {
        const otevreno = body.style.display !== "none";
        body.style.display = otevreno ? "none" : "block";
        document.getElementById("github-toggle-arrow").textContent = otevreno ? "▼" : "▲";
    });

    const tokenInput = document.getElementById("github-token-input");
    if (githubJeNastaven()) tokenInput.value = localStorage.getItem("github_token");

    document.getElementById("github-save-token-btn").addEventListener("click", async () => {
        const token = tokenInput.value.trim();
        if (!token) return;
        nastavljGithubStatus("Ověřuji...", "");
        const ok = await githubOverToken(token);
        if (ok) {
            localStorage.setItem("github_token", token);
            nastavljGithubStatus("Připojeno k GitHubu ✓", "ok");
            aktualizujBadge();
            if (naPoKonekci) await naPoKonekci();
        } else {
            nastavljGithubStatus("Neplatný token nebo přístup odmítnut.", "chyba");
        }
    });

    document.getElementById("github-clear-token-btn").addEventListener("click", () => {
        localStorage.removeItem("github_token");
        document.getElementById("github-token-input").value = "";
        nastavljGithubStatus("Odpojeno.", "");
        aktualizujBadge();
    });

    aktualizujBadge();
}

function nastavljGithubStatus(text, typ) {
    const el = document.getElementById("github-token-msg");
    if (!el) return;
    el.textContent = text;
    el.style.color = typ === "ok" ? "#8bc34a" : typ === "chyba" ? "#f5576c" : "#ccc";
}

function aktualizujBadge() {
    const badge = document.getElementById("github-status-badge");
    if (!badge) return;
    if (githubJeNastaven()) {
        badge.textContent = "Připojeno ✓";
        badge.className = "gh-badge gh-badge-on";
    } else {
        badge.textContent = "Nepřipojeno";
        badge.className = "gh-badge gh-badge-off";
    }
}
