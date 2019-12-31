

const prettyDate = (input) => {
    const d = new Date(input);
    return d.toDateString();
}

export {
    prettyDate
}