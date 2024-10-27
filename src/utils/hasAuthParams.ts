export const hasAuthParams = (location = window.location): boolean => {
    let searchParams = new URLSearchParams(location.search)
    if(
        (searchParams.get('code') ?? searchParams.get('error')) &&
        searchParams.get('state')
    ) {
        return true
    }

    searchParams = new URLSearchParams(location.hash.replace('#', '?'))
    return !!(
        (searchParams.get('code') ?? searchParams.get('error')) &&
        searchParams.get('state')
    )
}