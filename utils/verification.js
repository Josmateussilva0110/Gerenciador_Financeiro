function getValueOrDefault(value, defaultValue = "") {
    // Se value for um array, pega o primeiro elemento (ou defaultValue se estiver vazio)
    if (Array.isArray(value)) {
        return value.length > 0 ? value[0] : defaultValue;
    }
    return value?.length ? value : defaultValue;
}

module.exports = getValueOrDefault;
