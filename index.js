require('dotenv').config();

const {inquirerMenu, pause, readInput, listPlaces} = require('./helpers/inquirer');
require('colors');
const Searching = require('./models/Searching');

const main = async () => {

    const searching = new Searching();

    let opt;

    do{
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                const place = await readInput('Ciudad: ');
                const places = await searching.city(place);
                const idPlace = await listPlaces(places);

                if(idPlace==='0') continue;
                
                const placeSelected = places.find( place => place.id === idPlace );
                
                //save in db
                searching.addHistory(placeSelected.name);

                const weatherByPlace = await searching.weatherByPlace(
                    placeSelected.lat, 
                    placeSelected.lng,
                    placeSelected.name
                );

                // mostrar información de la ciudad
                console.log('\nInformación de la Ciudad\n'.green);
                console.log('Ciudad:', placeSelected.name);
                console.log('Latitud', placeSelected.lat);
                console.log('Longitud', placeSelected.lng);
                console.log('Temperatura:', weatherByPlace.temp);
                console.log('Temp. Mínima:', weatherByPlace.min);
                console.log('Temp. Máxima:', weatherByPlace.max);
                console.log('Descripción:', weatherByPlace.description.green);
                console.log('\nFull Descripción:', weatherByPlace.fullDescription);

                console.log();

                break;
        
            case 2:
                searching.history.forEach((place, index) => {
                    const idx = `${index+1}.`.green;
                    console.log(`${idx} ${place}`);
                });
                break;
        }

        if(opt !== 0) await pause();
    } while ( opt!== 0)
    
}

main();