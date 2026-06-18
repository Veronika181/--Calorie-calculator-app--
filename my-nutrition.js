// Nutriční hodnoty na 100 g (nebo 100 ml)
const POTRAVINY = {
    // Mléčné výrobky / vejce
    "vejce":              { kcal: 155, protein: 13,   carbs: 1,  fat: 11  },
    "jogurt":             { kcal:  60, protein:  4,   carbs: 5,  fat:  2  },
    "bily jogurt":        { kcal:  60, protein:  4,   carbs: 5,  fat:  2  },
    "recký jogurt":       { kcal:  97, protein: 10,   carbs: 4,  fat:  5  },
    "tvaroh":             { kcal:  99, protein: 12,   carbs: 4,  fat:  4  },
    "cottage":            { kcal:  98, protein: 11,   carbs: 3,  fat:  5  },
    "mozzarella":         { kcal: 280, protein: 18,   carbs: 2,  fat: 22  },
    "eidam":              { kcal: 330, protein: 26,   carbs: 0,  fat: 25  },
    "syr":                { kcal: 330, protein: 26,   carbs: 0,  fat: 25  },
    "lucina":             { kcal: 200, protein:  8,   carbs: 4,  fat: 16  },
    "maslo":              { kcal: 717, protein:  1,   carbs: 0,  fat: 81  },
    "smetana":            { kcal: 292, protein:  2,   carbs: 3,  fat: 30  },
    "kefir":              { kcal:  52, protein:  3,   carbs: 5,  fat:  2  },
    "mleko":              { kcal:  61, protein:  3,   carbs: 5,  fat:  3  },
    "ricotta":            { kcal: 174, protein: 11,   carbs: 3,  fat: 13  },

    // Maso / ryby
    "kureci":             { kcal: 165, protein: 31,   carbs: 0,  fat:  4  },
    "kureci maso":        { kcal: 165, protein: 31,   carbs: 0,  fat:  4  },
    "veprove":            { kcal: 215, protein: 22,   carbs: 0,  fat: 14  },
    "veprove maso":       { kcal: 215, protein: 22,   carbs: 0,  fat: 14  },
    "hovezi":             { kcal: 250, protein: 18,   carbs: 0,  fat: 20  },
    "mlete hovezi":       { kcal: 250, protein: 18,   carbs: 0,  fat: 20  },
    "hovezi maso":        { kcal: 250, protein: 18,   carbs: 0,  fat: 20  },
    "sunka":              { kcal: 110, protein: 18,   carbs: 1,  fat:  4  },
    "salami":             { kcal: 350, protein: 17,   carbs: 2,  fat: 31  },
    "uzenac":             { kcal: 300, protein: 12,   carbs: 3,  fat: 27  },
    "losos":              { kcal: 208, protein: 20,   carbs: 0,  fat: 13  },
    "treska":             { kcal:  82, protein: 18,   carbs: 0,  fat:  1  },
    "tuna":               { kcal: 130, protein: 29,   carbs: 0,  fat:  1  },
    "tunac":              { kcal: 130, protein: 29,   carbs: 0,  fat:  1  },
    "krevety":            { kcal:  85, protein: 18,   carbs: 1,  fat:  1  },
    "sardinky":           { kcal: 208, protein: 25,   carbs: 0,  fat: 11  },

    // Obiloviny / škroby
    "ovesne":             { kcal: 370, protein: 13,   carbs: 63, fat:  7  },
    "ovesne vlocky":      { kcal: 370, protein: 13,   carbs: 63, fat:  7  },
    "spagety":            { kcal: 350, protein: 12,   carbs: 72, fat:  2  },
    "testoviny":          { kcal: 350, protein: 12,   carbs: 72, fat:  2  },
    "ryze":               { kcal: 360, protein:  7,   carbs: 80, fat:  1  },
    "pohanka":            { kcal: 343, protein: 13,   carbs: 72, fat:  3  },
    "brambory":           { kcal:  77, protein:  2,   carbs: 17, fat:  0  },
    "brambora":           { kcal:  77, protein:  2,   carbs: 17, fat:  0  },
    "pecivo":             { kcal: 280, protein:  9,   carbs: 55, fat:  2  },
    "chleb":              { kcal: 250, protein:  8,   carbs: 50, fat:  2  },
    "toust":              { kcal: 265, protein:  9,   carbs: 50, fat:  3  },
    "knackebrot":         { kcal: 360, protein: 11,   carbs: 72, fat:  3  },
    "ryzove chlebicky":   { kcal: 380, protein:  7,   carbs: 82, fat:  1  },
    "ryzove":             { kcal: 380, protein:  7,   carbs: 82, fat:  1  },
    "cocka":              { kcal: 350, protein: 25,   carbs: 60, fat:  2  },
    "fazole":             { kcal: 340, protein: 22,   carbs: 60, fat:  2  },
    "cizrna":             { kcal: 364, protein: 19,   carbs: 61, fat:  6  },
    "krupice":            { kcal: 360, protein: 11,   carbs: 75, fat:  1  },

    // Zelenina
    "mrkev":              { kcal:  41, protein:  1,   carbs: 10, fat:  0  },
    "cibule":             { kcal:  40, protein:  1,   carbs:  9, fat:  0  },
    "rajcata":            { kcal:  18, protein:  1,   carbs:  4, fat:  0  },
    "rajce":              { kcal:  18, protein:  1,   carbs:  4, fat:  0  },
    "paprika":            { kcal:  31, protein:  1,   carbs:  6, fat:  0  },
    "okurka":             { kcal:  15, protein:  1,   carbs:  3, fat:  0  },
    "cuketa":             { kcal:  17, protein:  1,   carbs:  3, fat:  0  },
    "hrasek":             { kcal:  81, protein:  5,   carbs: 14, fat:  0  },
    "redkvicky":          { kcal:  16, protein:  1,   carbs:  3, fat:  0  },
    "cesnek":             { kcal: 149, protein:  6,   carbs: 33, fat:  1  },
    "kysane zeli":        { kcal:  19, protein:  1,   carbs:  4, fat:  0  },
    "kysane":             { kcal:  19, protein:  1,   carbs:  4, fat:  0  },
    "spanak":             { kcal:  23, protein:  3,   carbs:  4, fat:  0  },
    "brokolice":          { kcal:  34, protein:  3,   carbs:  7, fat:  0  },
    "karfiol":            { kcal:  25, protein:  2,   carbs:  5, fat:  0  },
    "zelena salat":       { kcal:  15, protein:  1,   carbs:  3, fat:  0  },
    "salat":              { kcal:  15, protein:  1,   carbs:  3, fat:  0  },
    "batate":             { kcal:  86, protein:  2,   carbs: 20, fat:  0  },
    "kukurice":           { kcal:  96, protein:  3,   carbs: 21, fat:  1  },
    "zeler":              { kcal:  16, protein:  1,   carbs:  3, fat:  0  },
    "houby":              { kcal:  22, protein:  3,   carbs:  3, fat:  0  },
    "zampiony":           { kcal:  22, protein:  3,   carbs:  3, fat:  0  },

    // Ovoce / ořechy
    "banan":              { kcal:  89, protein:  1,   carbs: 23, fat:  0  },
    "jahody":             { kcal:  32, protein:  1,   carbs:  8, fat:  0  },
    "avokado":            { kcal: 160, protein:  2,   carbs:  9, fat: 15  },
    "jablko":             { kcal:  52, protein:  0,   carbs: 14, fat:  0  },
    "hruska":             { kcal:  57, protein:  0,   carbs: 15, fat:  0  },
    "pomeranc":           { kcal:  47, protein:  1,   carbs: 12, fat:  0  },
    "boruvky":            { kcal:  57, protein:  1,   carbs: 14, fat:  0  },
    "maliny":             { kcal:  52, protein:  1,   carbs: 12, fat:  1  },
    "hrozny":             { kcal:  69, protein:  1,   carbs: 18, fat:  0  },
    "kivi":               { kcal:  61, protein:  1,   carbs: 15, fat:  1  },
    "orechy":             { kcal: 650, protein: 15,   carbs: 14, fat: 60  },
    "vlasske orechy":     { kcal: 654, protein: 15,   carbs: 14, fat: 65  },
    "mandle":             { kcal: 576, protein: 21,   carbs: 22, fat: 49  },
    "drcene orechy":      { kcal: 650, protein: 15,   carbs: 14, fat: 60  },
    "drcene":             { kcal: 650, protein: 15,   carbs: 14, fat: 60  },
    "kesु":               { kcal: 580, protein: 16,   carbs: 28, fat: 48  },
    "kesu maslo":         { kcal: 580, protein: 16,   carbs: 28, fat: 48  },
    "oriskove maslo":     { kcal: 600, protein: 22,   carbs: 20, fat: 51  },
    "arasisove maslo":    { kcal: 598, protein: 25,   carbs: 20, fat: 51  },
    "datle":              { kcal: 282, protein:  2,   carbs: 75, fat:  0  },
    "rozinky":            { kcal: 299, protein:  3,   carbs: 79, fat:  0  },

    // Oleje / tuky / sladidla
    "olej":               { kcal: 900, protein:  0,   carbs:  0, fat: 100 },
    "olivovy olej":       { kcal: 884, protein:  0,   carbs:  0, fat: 100 },
    "kokosovy olej":      { kcal: 862, protein:  0,   carbs:  0, fat: 100 },
    "med":                { kcal: 304, protein:  0,   carbs: 82, fat:  0  },
    "javorovy sirup":     { kcal: 260, protein:  0,   carbs: 67, fat:  0  },
    "cuker":              { kcal: 387, protein:  0,   carbs: 100,fat:  0  },
    "cukr":               { kcal: 387, protein:  0,   carbs: 100,fat:  0  },

    // Ostatní
    "protein":            { kcal: 380, protein: 75,   carbs:  8, fat:  5  },
    "kakao":              { kcal: 228, protein: 20,   carbs: 50, fat: 12  },
    "cokolada":           { kcal: 550, protein:  6,   carbs: 56, fat: 32  },
    "horcice":            { kcal:  66, protein:  4,   carbs:  6, fat:  4  },
    "kecup":              { kcal: 100, protein:  2,   carbs: 25, fat:  0  },
    "sojova omacka":      { kcal:  53, protein:  8,   carbs:  5, fat:  0  },
    "citronova stava":    { kcal:  29, protein:  1,   carbs: 10, fat:  0  },
    "hummus":             { kcal: 166, protein:  8,   carbs: 14, fat: 10  },
};

// Váha 1 ks v gramech (výchozí 55 g pro vejce, atd.)
const VAHA_KS = {
    "vejce":              55,
    "ryzove chlebicky":    7,
    "chlebicky":           7,
    "banan":             120,
    "jablko":            180,
    "hruska":            180,
    "pomeranc":          150,
};

function normalizujNazev(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .trim();
}

function parseIngredient(str) {
    if (!str.includes(":")) return null;
    const colonIdx = str.indexOf(":");
    const namePart = str.slice(0, colonIdx).trim();
    let amountStr = str.slice(colonIdx + 1).trim();

    // Zkus zachytit gramy v závorce: "3 ks (165 g)"
    const bracketMatch = amountStr.match(/\((\d+(?:[.,]\d+)?)\s*g\)/);
    if (bracketMatch) {
        return { name: normalizujNazev(namePart), grams: parseFloat(bracketMatch[1].replace(",", ".")) };
    }

    // Odstraň závorky
    amountStr = amountStr.replace(/\(.*?\)/g, "").trim();

    const match = amountStr.match(/^([\d.,]+)\s*(\S+)?/);
    if (!match) return null;

    const amount = parseFloat(match[1].replace(",", "."));
    const unit = (match[2] || "g").toLowerCase();
    const normalizedName = normalizujNazev(namePart);

    let grams;
    if (unit === "g" || unit === "ml") {
        grams = amount;
    } else if (unit === "ks") {
        grams = amount * (VAHA_KS[normalizedName] || 55);
    } else if (unit === "lžička" || unit === "lzicka") {
        grams = amount * 5;
    } else if (unit === "lžíce" || unit === "lzice" || unit === "lžice") {
        grams = amount * 15;
    } else if (unit === "stroužek" || unit === "strouzek") {
        grams = amount * 5;
    } else if (unit === "hrnek") {
        grams = amount * 240;
    } else {
        return null;
    }

    return { name: normalizedName, grams };
}

function scaleMacros(entry, grams) {
    const f = grams / 100;
    return {
        kcal:    Math.round(entry.kcal    * f),
        protein: Math.round(entry.protein * f * 10) / 10,
        carbs:   Math.round(entry.carbs   * f * 10) / 10,
        fat:     Math.round(entry.fat     * f * 10) / 10,
    };
}

function najdiVyzivu(normalizedName, grams) {
    const words = normalizedName.split(" ").filter(Boolean);
    // Nejdřív zkus dvouslovné kombinace
    for (let i = 0; i < words.length - 1; i++) {
        const key = words[i] + " " + words[i + 1];
        if (POTRAVINY[key]) return scaleMacros(POTRAVINY[key], grams);
    }
    // Pak jednoslovné
    for (const w of words) {
        if (POTRAVINY[w]) return scaleMacros(POTRAVINY[w], grams);
    }
    return null;
}

function vypocitejVyzivu(ingredience) {
    let total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    const unmatched = [];

    for (const str of ingredience) {
        if (!str.trim()) continue;
        const parsed = parseIngredient(str);
        if (!parsed) { unmatched.push(str); continue; }
        const vyzivy = najdiVyzivu(parsed.name, parsed.grams);
        if (!vyzivy) { unmatched.push(str); continue; }
        total.kcal    += vyzivy.kcal;
        total.protein += vyzivy.protein;
        total.carbs   += vyzivy.carbs;
        total.fat     += vyzivy.fat;
    }

    return {
        kcal:    Math.round(total.kcal),
        protein: Math.round(total.protein * 10) / 10,
        carbs:   Math.round(total.carbs   * 10) / 10,
        fat:     Math.round(total.fat     * 10) / 10,
        manual:  false,
        unmatched,
    };
}
