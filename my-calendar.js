const MESICE = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];

let aktualniRok  = new Date().getFullYear();
let aktualniMesic = new Date().getMonth();

document.addEventListener("DOMContentLoaded", () => {
    renderKalendar();
    document.getElementById("prev-month-btn").addEventListener("click", () => {
        aktualniMesic--;
        if (aktualniMesic < 0) { aktualniMesic = 11; aktualniRok--; }
        renderKalendar();
    });
    document.getElementById("next-month-btn").addEventListener("click", () => {
        aktualniMesic++;
        if (aktualniMesic > 11) { aktualniMesic = 0; aktualniRok++; }
        renderKalendar();
    });
});

function renderKalendar() {
    document.getElementById("month-label").textContent = `${MESICE[aktualniMesic]} ${aktualniRok}`;

    const plan    = JSON.parse(localStorage.getItem("denni_plan") || "{}");
    const profil  = JSON.parse(localStorage.getItem("profil") || "{}");
    const recepty = JSON.parse(localStorage.getItem("recepty") || "[]");
    const gKcal   = profil.kcal || 0;

    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    const prvniDen = new Date(aktualniRok, aktualniMesic, 1);
    const pocetDni = new Date(aktualniRok, aktualniMesic + 1, 0).getDate();

    // Pondělí = 0 ... Neděle = 6
    let zacatek = prvniDen.getDay() - 1;
    if (zacatek < 0) zacatek = 6;

    for (let i = 0; i < zacatek; i++) {
        grid.appendChild(Object.assign(document.createElement("div"), { className: "cal-cell cal-empty-cell" }));
    }

    const dnes = new Date().toISOString().slice(0, 10);

    for (let d = 1; d <= pocetDni; d++) {
        const datum = `${aktualniRok}-${String(aktualniMesic + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const denPlan = plan[datum];
        const totalKcal = denPlan ? spocitejKcal(denPlan, recepty) : 0;

        let stavClass = "cal-stav-empty";
        let stavText  = "";
        if (totalKcal > 0 && gKcal > 0) {
            const pct = totalKcal / gKcal;
            if (pct >= 0.9 && pct <= 1.1)  { stavClass = "cal-stav-ok";    stavText = `${totalKcal} kcal`; }
            else if (pct > 1.1)             { stavClass = "cal-stav-over";  stavText = `${totalKcal} kcal`; }
            else                            { stavClass = "cal-stav-under"; stavText = `${totalKcal} kcal`; }
        } else if (totalKcal > 0) {
            stavClass = "cal-stav-under";
            stavText  = `${totalKcal} kcal`;
        }

        const cell = document.createElement("div");
        cell.className = `cal-cell ${datum === dnes ? "cal-dnes" : ""}`;
        cell.innerHTML = `
            <div class="cal-den">${d}</div>
            ${stavText ? `<div class="cal-kcal ${stavClass}">${stavText}</div>` : ""}
            ${denPlan ? renderMiniMeals(denPlan) : ""}
        `;
        cell.addEventListener("click", () => {
            window.location.href = `my-planner.html?datum=${datum}`;
        });
        grid.appendChild(cell);
    }
}

function spocitejKcal(denPlan, recepty) {
    let total = 0;
    ["snidane","obed","svacina","vecere"].forEach(cat => {
        (denPlan[cat] || []).forEach(title => {
            const r = recepty.find(x => x.title === title);
            if (r && r.nutrition) total += r.nutrition.kcal || 0;
        });
    });
    return Math.round(total);
}

function renderMiniMeals(denPlan) {
    const IKONY = { snidane:"🌅", obed:"☀️", svacina:"🍎", vecere:"🌙" };
    return ["snidane","obed","svacina","vecere"]
        .filter(cat => denPlan[cat] && denPlan[cat].length > 0)
        .map(cat => `<span class="cal-meal-dot" title="${denPlan[cat].join(', ')}">${IKONY[cat]}</span>`)
        .join("");
}
