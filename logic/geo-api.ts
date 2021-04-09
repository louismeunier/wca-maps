export const getCountry = (latitude:number, longitude:number):Promise<Country> => {
    return new Promise((resolve, reject) => {
        fetch(`http://api.geonames.org/countryCodeJSON?lat=${latitude}&lng=${longitude}&username=louismeunier`)
            .then(res => res.json())
            .then(resJson => resolve(resJson))
            .catch(err => reject(err))
    })
}