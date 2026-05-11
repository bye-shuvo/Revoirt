export const changeURLHash = (urlHash : string) => {
    window.location.hash =  urlHash ;
}

export const omitURLHash = (link : string) => {
    window.location.href = link;
}