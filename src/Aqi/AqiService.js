function getCategory(I) {
    if (I <= 50) return "Good";
    if (I <= 100) return "Moderate";
    if (I <= 150) return "Unhealthy for Sensative Groups";
    if (I <= 200) return "Unhealthy";
    if (I <= 300) return "Very Unhealthy";
    return "Hazardous";
}

function getClh (C){
    if (C <= 12.0) return {low: 0.0, high: 12.0};
    if (C <= 35.4) return {low: 12.1, high: 35.4};
    if (C <= 55.4) return {low: 35.5, high: 55.4};
    if (C <= 150.4) return {low: 55.5, high: 150.4};
    if (C <= 250.4) return {low: 150.5, high: 250.4};
    if (C <= 350.4) return {low: 250.5, high: 350.4};
    if (C <= 500.4) return {low: 350.5, high: 500.4};
    return {low: 500.5, high: 99999.9};
}

function getIlh(C) {
    if (C <= 50) return {low: 0, high: 50};
    if (C <= 100) return {low: 51, high: 100};
    if (C <= 150) return {low: 101, high: 150};
    if (C <= 200) return {low: 151, high: 200};
    if (C <= 300) return {low: 201, high: 300};
    if (C <= 400) return {low: 301, high: 400};
    if (C <= 500) return {low: 401, high: 500};
    return {low: 500, high: 900};
}

function calculateAqi(C){
    const Ilh = getIlh(C);
    const Clh = getClh(C);
    const I = ((Ilh.high-Ilh.low)/(Clh.high-Clh.low)) * (C-Clh.low) + Ilh.low;
    const category = getCategory(I);

    return {
        aqi: Math.round(I),
        category: category
    }
}

module.exports = {
    calculateAqi
}