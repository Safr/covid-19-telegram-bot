const axios = require('axios');
let service = {};


service.getByCountry = country => { 
    //нужно скопировать ваши данные из rapid api
    return axios({
        method: "GET",
        url: "https://covid-193.p.rapidapi.com/statistics",
        headers: {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": process.env.HOST,
            "x-rapidapi-key":
                process.env.KEY
        },
        params: {
            country,
        }
    });
};

module.exports = service;
