interface Country {
    "languages": string,
    "distance": string,
    "countryCode": string,
    "countryName": string,
    //invalid params/no country
    "status"?: {
        "message": string,
        "value": number
    }
}