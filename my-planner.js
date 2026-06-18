const KATEGORIE = ["snidane", "obed", "svacina", "vecere"];
const PLAN_PATH    = "data/denni_plan.json";
const PROFIL_PATH  = "data/profil.json";

let dnes = new Date().toISOString().slice(0, 10);

// Podpora pro ?datum= parametr z kalendáře
const urlDatum = new URLSearchParams(window.location.search).get("datum");
if (urlDatum) dnes = urlDatum;
let profil = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
let plan = {};

document.addEventListener("DOMContentLoaded", async () => {
    inicializujGithubUI(async () => {
        await nactiProfilAplan();
        naplnSelecty();
    });
    await nactiProfilAplan();
    naplnSelecty();

    document.getElementById("date-picker").value = dnes;
    document.getElementById("date-picker").addEventListener("change", e => {
        dnes = e.target.value;
        renderVsechnyMaly();
        renderSoucet();
    });

    document.getElementById("save-goals-btn").addEventListener("click", ulozProfil);

    document.getElementById("bmr-apply-btn").addEventListener("click", () => {
        const bmr = parseFloat(document.getElementById("bmr-input").value);
        if (!bmr || bmr <= 0) return;
        const kcal    = Math.round(bmr * 0.96);
        const protein = Math.round(kcal * 0.29 / 4);
        const carbs   = Math.round(kcal * 0.39 / 4);
        const fat     = Math.round(kcal * 0.29 / 9);
        document.getElementById("goal-kcal").value    = kcal;
        document.getElementById("goal-protein").value = protein;
        document.getElementById("goal-carbs").value   = carbs;
        document.getElementById("goal-fat").value     = fat;
        const msg = document.getElementById("bmr-msg");
        msg.style.color = "#8bc34a";
        msg.textContent = `Přepočítáno: ${kcal} kcal | B: ${protein} g | S: ${carbs} g | T: ${fat} g`;
    });

    KATEGORIE.forEach(cat => {
        document.querySelector(`.add-recipe-btn[data-cat="${cat}"]`).addEventListener("click", () => {
            pridatDoPlanu(cat);
        });
    });

    document.getElementById("generate-shopping-btn").addEventListener("click", generujNakupniSeznam);
    document.getElementById("copy-shopping-btn").addEventListener("click", kopirujSeznam);
    document.getElementById("clear-shopping-btn").addEventListener("click", () => {
        document.getElementById("shopping-list-output").style.display = "none";
    });
});

async function nactiProfilAplan() {
    if (githubJeNastaven()) {
        const ghProfil = await githubNacti(PROFIL_PATH);
        if (ghProfil) { profil = ghProfil; localStorage.setItem("profil", JSON.stringify(profil)); }
        else profil = JSON.parse(localStorage.getItem("profil") || "{}");

        const ghPlan = await githubNacti(PLAN_PATH);
        if (ghPlan) { plan = ghPlan; localStorage.setItem("denni_plan", JSON.stringify(plan)); }
        else plan = JSON.parse(localStorage.getItem("denni_plan") || "{}");
    } else {
        profil = JSON.parse(localStorage.getItem("profil") || "{}");
        plan   = JSON.parse(localStorage.getItem("denni_plan") || "{}");
    }

    if (profil.kcal)    document.getElementById("goal-kcal").value    = profil.kcal;
    if (profil.protein) document.getElementById("goal-protein").value = profil.protein;
    if (profil.carbs)   document.getElementById("goal-carbs").value   = profil.carbs;
    if (profil.fat)     document.getElementById("goal-fat").value     = profil.fat;
}

async function ulozProfil() {
    profil = {
        kcal:    parseFloat(document.getElementById("goal-kcal").value)    || 0,
        protein: parseFloat(document.getElementById("goal-protein").value) || 0,
        carbs:   parseFloat(document.getElementById("goal-carbs").value)   || 0,
        fat:     parseFloat(document.getElementById("goal-fat").value)     || 0,
    };
    localStorage.setItem("profil", JSON.stringify(profil));
    if (githubJeNastaven()) await githubUloz(PROFIL_PATH, profil, "Aktualizace denních cílů");
    renderSoucet();
}

function denPlanu() {
    if (!plan[dnes]) plan[dnes] = { snidane: [], obed: [], svacina: [], vecere: [] };
    return plan[dnes];
}

function ulozPlan() {
    localStorage.setItem("denni_plan", JSON.stringify(plan));
    if (githubJeNastaven()) githubUloz(PLAN_PATH, plan, `Aktualizace plánu ${dnes}`);
}

function naplnSelecty() {
    const recepty = JSON.parse(localStorage.getItem("recepty") || "[]");
    KATEGORIE.forEach(cat => {
        const sel = document.getElementById(`select-${cat}`);
        sel.innerHTML = '<option value="">— vyberte recept —</option>';
        recepty.forEach(r => {
            const opt = document.createElement("option");
            opt.value = r.title;
            opt.textContent = r.title;
            sel.appendChild(opt);
        });
    });
    renderVsechnyMaly();
    renderSoucet();
}

function pridatDoPlanu(cat) {
    const sel = document.getElementById(`select-${cat}`);
    const title = sel.value;
    if (!title) return;
    denPlanu()[cat].push(title);
    ulozPlan();
    renderMeal(cat);
    renderSoucet();
    sel.value = "";
}

function odebratZPlanu(cat, idx) {
    denPlanu()[cat].splice(idx, 1);
    ulozPlan();
    renderMeal(cat);
    renderSoucet();
}

function najdiRecept(title) {
    const recepty = JSON.parse(localStorage.getItem("recepty") || "[]");
    return recepty.find(r => r.title === title) || null;
}

function renderVsechnyMaly() {
    KATEGORIE.forEach(cat => renderMeal(cat));
}

function renderMeal(cat) {
    const den = denPlanu();
    const list     = document.getElementById(`list-${cat}`);
    const subtotal = document.getElementById(`subtotal-${cat}`);
    list.innerHTML = "";

    let catKcal = 0, catProtein = 0, catCarbs = 0, catFat = 0;

    den[cat].forEach((title, idx) => {
        const recept = najdiRecept(title);
        if (!recept) return;
        const n = recept.nutrition || { kcal: 0, protein: 0, carbs: 0, fat: 0 };

        catKcal    += n.kcal    || 0;
        catProtein += n.protein || 0;
        catCarbs   += n.carbs   || 0;
        catFat     += n.fat     || 0;

        const row = document.createElement("div");
        row.className = "meal-list-row";
        row.innerHTML = `
            <span class="recipe-title">${title}</span>
            <span class="macro-info">⚡${n.kcal} | B:${n.protein} | S:${n.carbs} | T:${n.fat}</span>
            <button class="remove-btn" title="Odebrat">×</button>
        `;
        row.querySelector(".remove-btn").addEventListener("click", () => odebratZPlanu(cat, idx));
        list.appendChild(row);
    });

    if (den[cat].length > 0) {
        subtotal.textContent = `Celkem: ${Math.round(catKcal)} kcal | B: ${Math.round(catProtein*10)/10} g | S: ${Math.round(catCarbs*10)/10} g | T: ${Math.round(catFat*10)/10} g`;
    } else {
        subtotal.textContent = "";
    }
}

function renderSoucet() {
    const den = denPlanu();
    let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

    KATEGORIE.forEach(cat => {
        den[cat].forEach(title => {
            const recept = najdiRecept(title);
            if (!recept || !recept.nutrition) return;
            const n = recept.nutrition;
            totalKcal    += n.kcal    || 0;
            totalProtein += n.protein || 0;
            totalCarbs   += n.carbs   || 0;
            totalFat     += n.fat     || 0;
        });
    });

    totalKcal    = Math.round(totalKcal);
    totalProtein = Math.round(totalProtein * 10) / 10;
    totalCarbs   = Math.round(totalCarbs   * 10) / 10;
    totalFat     = Math.round(totalFat     * 10) / 10;

    const gKcal = profil.kcal || 0, gProt = profil.protein || 0,
          gCarbs = profil.carbs || 0, gFat = profil.fat || 0;

    document.getElementById("total-kcal-label").textContent    = gKcal  ? `${totalKcal} / ${gKcal} kcal`      : `${totalKcal} kcal`;
    document.getElementById("total-protein-label").textContent = gProt  ? `${totalProtein} / ${gProt} g`      : `${totalProtein} g`;
    document.getElementById("total-carbs-label").textContent   = gCarbs ? `${totalCarbs} / ${gCarbs} g`       : `${totalCarbs} g`;
    document.getElementById("total-fat-label").textContent     = gFat   ? `${totalFat} / ${gFat} g`           : `${totalFat} g`;

    setBar("bar-kcal",    "kcal",    totalKcal,    gKcal);
    setBar("bar-protein", "protein", totalProtein, gProt);
    setBar("bar-carbs",   "carbs",   totalCarbs,   gCarbs);
    setBar("bar-fat",     "fat",     totalFat,     gFat);

    const status = document.getElementById("goal-status");
    if (!gKcal) { status.textContent = ""; status.className = "goal-status"; document.getElementById("remaining-row").style.display = "none"; return; }
    const diff = totalKcal - gKcal;
    const pct  = Math.abs(diff) / gKcal;
    if (pct <= 0.10) {
        status.textContent = "Cíl splněn!";
        status.className = "goal-status ok";
    } else if (diff > 0) {
        status.textContent = `Nad cílem o ${diff} kcal`;
        status.className = "goal-status over";
    } else {
        status.textContent = `Pod cílem o ${Math.abs(diff)} kcal`;
        status.className = "goal-status under";
    }

    // Zbývá dnes
    const remRow = document.getElementById("remaining-row");
    const remVal = document.getElementById("remaining-values");
    remRow.style.display = "block";
    const zbKcal    = gKcal  - totalKcal;
    const zbProtein = gProt  - totalProtein;
    const zbCarbs   = gCarbs - totalCarbs;
    const zbFat     = gFat   - totalFat;
    const barva = v => v >= 0 ? "#00eaff" : "#f5576c";
    remVal.innerHTML = `
        <span style="color:${barva(zbKcal)}">⚡ ${Math.round(zbKcal)} kcal</span>
        <span style="color:${barva(zbProtein)}">B: ${Math.round(zbProtein * 10) / 10} g</span>
        <span style="color:${barva(zbCarbs)}">S: ${Math.round(zbCarbs * 10) / 10} g</span>
        <span style="color:${barva(zbFat)}">T: ${Math.round(zbFat * 10) / 10} g</span>
    `;
}

function setBar(id, type, value, goal) {
    const bar = document.getElementById(id);
    if (!goal) { bar.style.width = "0%"; bar.className = `progress-fill ${type}`; return; }
    const pct = Math.min((value / goal) * 100, 100);
    bar.style.width = pct + "%";
    bar.className = value > goal ? `progress-fill ${type} over` : `progress-fill ${type}`;
}

// === NÁKUPNÍ SEZNAM ===
function parsujIngredience(radky) {
    const agregace = {};
    radky.forEach(radek => {
        radek = radek.trim();
        if (!radek) return;
        // Formát: "Název: 100 g" nebo "Název - 100 g" nebo "Název: 100"
        const match = radek.match(/^(.+?)[\s]*[:\-][\s]*([\d,.]+)\s*(\w*)$/);
        if (match) {
            const nazev = match[1].trim().toLowerCase();
            const mnozstvi = parseFloat(match[2].replace(",", "."));
            const jednotka = match[3] || "g";
            if (!agregace[nazev]) agregace[nazev] = { mnozstvi: 0, jednotka, originalNazev: match[1].trim() };
            agregace[nazev].mnozstvi += mnozstvi;
        } else {
            if (!agregace[radek.toLowerCase()]) agregace[radek.toLowerCase()] = { mnozstvi: null, jednotka: "", originalNazev: radek };
        }
    });
    return Object.values(agregace);
}

function generujNakupniSeznam() {
    const den = denPlanu();
    const recepty = JSON.parse(localStorage.getItem("recepty") || "[]");
    const vsechnyIngredience = [];

    KATEGORIE.forEach(cat => {
        den[cat].forEach(title => {
            const recept = recepty.find(r => r.title === title);
            if (recept && recept.ingredients) vsechnyIngredience.push(...recept.ingredients);
        });
    });

    if (vsechnyIngredience.length === 0) {
        alert("V plánu pro tento den nejsou žádné recepty.");
        return;
    }

    const polozky = parsujIngredience(vsechnyIngredience);
    const ul = document.getElementById("shopping-items");
    ul.innerHTML = "";

    polozky.sort((a, b) => a.originalNazev.localeCompare(b.originalNazev, "cs")).forEach(p => {
        const li = document.createElement("li");
        li.className = "shopping-item";
        const text = p.mnozstvi !== null
            ? `${p.originalNazev}: ${Math.round(p.mnozstvi * 10) / 10} ${p.jednotka}`
            : p.originalNazev;
        li.innerHTML = `<label><input type="checkbox"> ${text}</label>`;
        li.querySelector("input").addEventListener("change", function () {
            li.classList.toggle("checked", this.checked);
        });
        ul.appendChild(li);
    });

    document.getElementById("shopping-list-output").style.display = "block";
}

function kopirujSeznam() {
    const items = [...document.querySelectorAll("#shopping-items .shopping-item")];
    const text = items.map(li => li.querySelector("label").textContent.trim()).join("\n");
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("copy-shopping-btn");
        btn.textContent = "✓ Zkopírováno";
        setTimeout(() => btn.textContent = "📋 Kopírovat", 2000);
    });
}
