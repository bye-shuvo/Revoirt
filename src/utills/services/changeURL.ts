export const changeURLHash = (urlHash : string) => {
    window.location.hash =  urlHash ;
}

export const omitURLHash = () => {
    history.replaceState(null , '' , window.location.pathname)
}