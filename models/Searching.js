const fs = require('fs');
const axios = require('axios');

class Searching {

    history = [];
    DBPath = "./db/database.json";

    constructor(){
        this.readInDB();
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es' 
        };
    }

    get capitalized(){
        return this.history.map( place => place.toUpperCase() );
    }

    getParamsOpenWeather(lat, lon){
        return {
            'appid': process.env.OPEN_WEATHER_KEY,
            'lat': lat,
            'lon': lon,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async city(place = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
    
            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }));         
        } catch (error) {
            return [];
        }
    }

    async weatherByPlace( lat, lon, placeName ){
        try {
            const instance = axios.create({
                baseURL: "https://api.openweathermap.org/data/2.5/weather",
                params: this.getParamsOpenWeather(lat, lon)
            });

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                description: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                fullDescription: `\nEl lugar/ciudad de ` + `${placeName}`.yellow +
                                    `, se encuentra a una temperatura de ` + `[${main.temp} °C]`.green +
                                    `, \ndonde su temperatura máxima llega hasta los ` + `[${main.temp_max} °C]`.red +
                                    ` y desciende hasta la temperatura \nmínima de ` + `[${main.temp_min} °C]`.blue +
                                    ` además presenta ` + `${weather[0].description}`.yellow + ` incitu.`
            };
        } catch (error) {
            console.log(error);
        }
    }

    addHistory(place=''){
        if(this.history.includes(place.toLocaleLowerCase())){
            return;
        }
        this.history.unshift(place);

        this.saveInDB();
    }

    saveInDB(){
        const payload = {
            history: this.history
        };

        fs.writeFileSync(this.DBPath, JSON.stringify(payload));
    }

    readInDB(){
        if(!fs.existsSync(this.DBPath)) return;
        
        const file = fs.readFileSync(this.DBPath, {encoding: 'utf-8'});
        const dataHistory = JSON.parse(file);
        this.history = dataHistory.history;
        
    }

    

}

module.exports = Searching;