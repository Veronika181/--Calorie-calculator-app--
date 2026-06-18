const RECEPTY_PATH = "data/recepty.json";

document.addEventListener("DOMContentLoaded", async () => {
    inicializujGithubUI(async () => {
        document.querySelectorAll(".recipe-list").forEach(el => el.innerHTML = "");
        await nactiRecepty();
    });
    await nactiRecepty();
    document.getElementById("addBtn").addEventListener("click", pridatRecept);

    document.getElementById("search-input").addEventListener("input", function () {
        const q = this.value.toLowerCase();
        document.querySelectorAll(".recipe").forEach(el => {
            el.style.display = el.dataset.title.toLowerCase().includes(q) ? "" : "none";
        });
        ["snidane", "obed", "svacina", "vecere"].forEach(cat => {
            const list = document.getElementById(cat);
            const h2 = list.previousElementSibling;
            const visible = [...list.querySelectorAll(".recipe")].some(el => el.style.display !== "none");
            if (h2 && h2.tagName === "H2") h2.style.display = visible || !q ? "" : "none";
        });
    });

    // Zobraz sdílený recept z URL hash
    const hash = window.location.hash;
    if (hash.startsWith("#recept=")) {
        try {
            const data = JSON.parse(atob(hash.slice(8)));
            zobrazSdilenyRecept(data);
        } catch { /* neplatný hash */ }
    }

    document.getElementById("share-modal-close").addEventListener("click", () => {
        document.getElementById("share-modal").style.display = "none";
    });
    document.getElementById("share-modal").addEventListener("click", function(e) {
        if (e.target === this) this.style.display = "none";
    });
});

// === NAČTENÍ RECEPTŮ ===
async function nactiRecepty() {
    let recepty = null;

    if (githubJeNastaven()) {
        recepty = await githubNacti(RECEPTY_PATH);
        if (recepty) {
            // Migrace: přidej nutrition pokud chybí
            let changed = false;
            recepty = recepty.map(r => {
                if (!r.nutrition) { r.nutrition = vypocitejVyzivu(r.ingredients); changed = true; }
                return r;
            });
            localStorage.setItem("recepty", JSON.stringify(recepty));
            if (changed) await githubUloz(RECEPTY_PATH, recepty, "Doplnění nutričních hodnot");
        }
    }

    if (!recepty) {
        // Fallback: localStorage nebo výchozí JSON
        const ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");
        if (ulozene.length === 0) {
            await nactiVychoziRecepty();
            return;
        }
        let changed = false;
        recepty = ulozene.map(r => {
            if (!r.nutrition) { r.nutrition = vypocitejVyzivu(r.ingredients); changed = true; }
            return r;
        });
        if (changed) localStorage.setItem("recepty", JSON.stringify(recepty));
    }

    recepty.forEach(r => vykresliRecept(r));
}

async function nactiVychoziRecepty() {
    const response = await fetch("recipes.json");
    const vychoziRecepty = await response.json();
    vychoziRecepty.forEach(r => {
        if (!r.nutrition) r.nutrition = vypocitejVyzivu(r.ingredients);
    });
    localStorage.setItem("recepty", JSON.stringify(vychoziRecepty));
    vychoziRecepty.forEach(r => vykresliRecept(r));

    if (githubJeNastaven()) {
        await githubUloz(RECEPTY_PATH, vychoziRecepty, "Inicializace výchozích receptů");
    }
}

// === PŘIDÁNÍ / EDITACE RECEPTU ===
async function pridatRecept() {
    const nazev = document.getElementById("title").value.trim();
    const kategorie = document.getElementById("category").value;
    const ingredienceText = document.getElementById("ingredients").value.trim();
    const postup = document.getElementById("instructions").value.trim();
    const addBtn = document.getElementById("addBtn");
    const editTitle = addBtn.dataset.editTitle;

    if (!nazev || !ingredienceText || !postup) {
        alert("Vyplň prosím všechny položky.");
        return;
    }

    const recept = {
        title: nazev,
        category: kategorie,
        ingredients: ingredienceText.split("\n"),
        instructions: postup,
        nutrition: vypocitejVyzivu(ingredienceText.split("\n"))
    };

    let ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");

    if (editTitle) {
        // Editace — nahradit existující recept
        const idx = ulozene.findIndex(r => r.title === editTitle);
        if (idx !== -1) {
            recept.nutrition = ulozene[idx].nutrition; // zachovat manuální override
            recept.nutrition = vypocitejVyzivu(ingredienceText.split("\n"));
            ulozene[idx] = recept;
        }
        // Smazat starou kartu a vykreslit novou
        document.querySelectorAll(".recipe").forEach(el => {
            if (el.dataset.title === editTitle) el.remove();
        });
        addBtn.textContent = "Přidat recept";
        delete addBtn.dataset.editTitle;
    } else {
        ulozene.push(recept);
    }

    vykresliRecept(recept);
    localStorage.setItem("recepty", JSON.stringify(ulozene));

    document.getElementById("title").value = "";
    document.getElementById("ingredients").value = "";
    document.getElementById("instructions").value = "";

    if (githubJeNastaven()) {
        const zprava = editTitle ? `Upraven recept: ${nazev}` : `Přidán recept: ${nazev}`;
        nastavSaveStatus("Ukládám na GitHub...", "");
        const ok = await githubUloz(RECEPTY_PATH, ulozene, zprava);
        nastavSaveStatus(ok ? "Uloženo na GitHub ✓" : "Uloženo lokálně (GitHub nedostupný)", ok ? "ok" : "warn");
        setTimeout(() => nastavSaveStatus("", ""), 3000);
    }
}

function nastavSaveStatus(text, typ) {
    const el = document.getElementById("save-status");
    if (!el) return;
    el.textContent = text;
    el.style.color = typ === "ok" ? "#8bc34a" : typ === "warn" ? "#ffd54f" : "#ccc";
}

// === VYKRESLENÍ RECEPTU ===
function vykresliRecept(recept) {
    const container = document.getElementById(recept.category);
    const div = document.createElement("div");
    div.className = "recipe";
    div.dataset.title = recept.title;

    const n = recept.nutrition;
    const nutBadge = n ? `
        <div class="nutrition-badge">
            <span>⚡ ${n.kcal} kcal</span>
            <span>B: ${n.protein} g</span>
            <span>S: ${n.carbs} g</span>
            <span>T: ${n.fat} g</span>
            ${n.manual ? '<span class="manual-tag">✎ ručně</span>' : ''}
            <button class="override-btn" type="button">Upravit</button>
        </div>
        <div class="nutrition-override" style="display:none">
            <input type="number" class="ov-kcal"    placeholder="kcal"         value="${n.kcal}">
            <input type="number" class="ov-protein" placeholder="Bílkoviny g"  value="${n.protein}">
            <input type="number" class="ov-carbs"   placeholder="Sacharidy g"  value="${n.carbs}">
            <input type="number" class="ov-fat"     placeholder="Tuky g"       value="${n.fat}">
            <button class="save-override-btn" type="button">Uložit</button>
        </div>
    ` : '';

    div.innerHTML = `
        <h3>${recept.title}</h3>
        <small>${prelozKategorie(recept.category)}</small>
        <h4>Ingredience</h4>
        <ul>${recept.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h4>Postup</h4>
        <p>${recept.instructions}</p>
        ${nutBadge}
        <div class="recipe-actions">
            <button class="edit-btn" type="button">✏️ Upravit</button>
            <button class="share-btn" type="button">🔗 Sdílet</button>
            <button class="delete-btn" type="button">🗑 Smazat</button>
        </div>
    `;

    const overrideBtn  = div.querySelector(".override-btn");
    const overrideForm = div.querySelector(".nutrition-override");
    if (overrideBtn && overrideForm) {
        overrideBtn.addEventListener("click", () => {
            overrideForm.style.display = overrideForm.style.display === "none" ? "grid" : "none";
        });
    }

    const saveOverrideBtn = div.querySelector(".save-override-btn");
    if (saveOverrideBtn) {
        saveOverrideBtn.addEventListener("click", async () => {
            const kcal    = parseFloat(div.querySelector(".ov-kcal").value)    || 0;
            const protein = parseFloat(div.querySelector(".ov-protein").value) || 0;
            const carbs   = parseFloat(div.querySelector(".ov-carbs").value)   || 0;
            const fat     = parseFloat(div.querySelector(".ov-fat").value)     || 0;

            const ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");
            const idx = ulozene.findIndex(r => r.title === recept.title);
            if (idx !== -1) {
                ulozene[idx].nutrition = { kcal, protein, carbs, fat, manual: true, unmatched: [] };
                localStorage.setItem("recepty", JSON.stringify(ulozene));
                if (githubJeNastaven()) {
                    await githubUloz(RECEPTY_PATH, ulozene, `Upraveny nutriční hodnoty: ${recept.title}`);
                }
            }

            const badge = div.querySelector(".nutrition-badge");
            badge.innerHTML = `
                <span>⚡ ${kcal} kcal</span>
                <span>B: ${protein} g</span>
                <span>S: ${carbs} g</span>
                <span>T: ${fat} g</span>
                <span class="manual-tag">✎ ručně</span>
                <button class="override-btn" type="button">Upravit</button>
            `;
            overrideForm.style.display = "none";
            badge.querySelector(".override-btn").addEventListener("click", () => {
                overrideForm.style.display = overrideForm.style.display === "none" ? "grid" : "none";
            });
        });
    }

    div.querySelector(".share-btn").addEventListener("click", () => sdiletRecept(recept));

    div.querySelector(".edit-btn").addEventListener("click", () => {
        document.getElementById("title").value = recept.title;
        document.getElementById("category").value = recept.category;
        document.getElementById("ingredients").value = recept.ingredients.join("\n");
        document.getElementById("instructions").value = recept.instructions;
        const addBtn = document.getElementById("addBtn");
        addBtn.textContent = "Uložit změny";
        addBtn.dataset.editTitle = recept.title;
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    div.querySelector(".delete-btn").addEventListener("click", async () => {
        if (!confirm(`Smazat recept "${recept.title}"?`)) return;
        let ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");
        ulozene = ulozene.filter(r => r.title !== recept.title);
        localStorage.setItem("recepty", JSON.stringify(ulozene));
        div.remove();
        if (githubJeNastaven()) await githubUloz(RECEPTY_PATH, ulozene, `Smazán recept: ${recept.title}`);
    });

    container.appendChild(div);
}

function prelozKategorie(cat) {
    switch (cat) {
        case "snidane": return "Snídaně";
        case "obed":    return "Oběd";
        case "svacina": return "Svačina";
        case "vecere":  return "Večeře";
        default:        return cat;
    }
}

// === SDÍLENÍ RECEPTU ===
function sdiletRecept(recept) {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(recept))));
    const url = `${location.origin}${location.pathname}#recept=${encoded}`;

    const text = formatujReceptText(recept);

    if (navigator.share) {
        navigator.share({ title: recept.title, text, url });
        return;
    }

    // Fallback: kopírovat odkaz
    navigator.clipboard.writeText(url).then(() => {
        alert(`Odkaz na recept "${recept.title}" byl zkopírován do schránky!`);
    }).catch(() => {
        prompt("Zkopíruj odkaz:", url);
    });
}

function formatujReceptText(recept) {
    const n = recept.nutrition;
    const nutInfo = n ? `\nVýživa: ${n.kcal} kcal | B: ${n.protein}g | S: ${n.carbs}g | T: ${n.fat}g` : "";
    return `🍽️ ${recept.title}\n\nIngredience:\n${recept.ingredients.join("\n")}\n\nPostup:\n${recept.instructions}${nutInfo}`;
}

function zobrazSdilenyRecept(recept) {
    const n = recept.nutrition;
    const nutHtml = n ? `<div class="nutrition-badge" style="margin-top:12px">
        <span>⚡ ${n.kcal} kcal</span><span>B: ${n.protein} g</span>
        <span>S: ${n.carbs} g</span><span>T: ${n.fat} g</span>
    </div>` : "";

    document.getElementById("share-modal-content").innerHTML = `
        <h2 style="margin:0 0 4px 0">${recept.title}</h2>
        <small style="color:#aaa">${prelozKategorie(recept.category)}</small>
        <h4>Ingredience</h4>
        <ul>${recept.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
        <h4>Postup</h4>
        <p>${recept.instructions}</p>
        ${nutHtml}
        <button id="import-shared-btn" style="margin-top:16px">⬇️ Přidat do mých receptů</button>
    `;

    document.getElementById("share-modal").style.display = "flex";

    document.getElementById("import-shared-btn").addEventListener("click", async () => {
        const ulozene = JSON.parse(localStorage.getItem("recepty") || "[]");
        if (ulozene.some(r => r.title === recept.title)) {
            alert("Recept s tímto názvem už máš uložen.");
            return;
        }
        ulozene.push(recept);
        localStorage.setItem("recepty", JSON.stringify(ulozene));
        vykresliRecept(recept);
        if (githubJeNastaven()) await githubUloz(RECEPTY_PATH, ulozene, `Přidán sdílený recept: ${recept.title}`);
        document.getElementById("share-modal").style.display = "none";
        history.replaceState(null, "", location.pathname);
        alert(`Recept "${recept.title}" byl přidán!`);
    });
}
