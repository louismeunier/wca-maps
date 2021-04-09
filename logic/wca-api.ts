export const WCA = (path: String): Promise<any> => {
    return new Promise((resolve, reject) => {
        fetch(`https://www.worldcubeassociation.org/api/v0/${path}`, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => response.json())
            .then(responseJson => responseJson.error ? reject("error") : resolve(responseJson))
            .catch(err => {
                reject(err)
            });
    })
}

export const getPerson = (id: String): Promise<{"person":WCAPerson}> => {
    return WCA(`persons/${id}`);
}

export const getPersonResults = (id: String): Promise<WCAPersonResult[]> => {
    return WCA(`persons/${id}/results`);
}

export const getCompetition = (id: String): Promise<WCACompetition> => {
    return WCA(`competitions/${id}`)
}

export const searchUsers = (query: String): Promise<{"result": WCAUser[]}> => {
    return WCA(`search/users?q=${query}`)
}

export const getUserCompetitions = (userID:string): Promise<Promise<WCACompetition>[]> => {
    return new Promise((resolve, reject) => {
        getPersonResults(userID)
            .then(async res => {
                const unique = [...new Set(res.map(item => item.competition_id))];
                const results:Promise<WCACompetition>[] = unique.map(competitionID => {
                    return new Promise((resolve, reject) => {
                        getCompetition(competitionID)
                            .then(competition => {
                                resolve(competition)
                            })
                            .catch(err => console.error(err));
                    }
                )})
                resolve(results);
            })
            .catch(err => reject(err))
    })
}   