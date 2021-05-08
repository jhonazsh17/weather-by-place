const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.yellow } Buscar Ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.yellow } Historial`
            },
            {
                value: 0,
                name: `${ '0.'.yellow } Salir`
            }
        ]
    }
];

const inquirerMenu = async () => {
    // console.clear();
    console.log('========================='.green);
    console.log('  Seleccione una opción  '.white);
    console.log('=========================\n'.green);

    const { option } = await inquirer.prompt(questions);

    return option;
}

const pause = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green } para continuar`
        }
    ]

    await inquirer.prompt(question);
}

const readInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate( value ) {
                if( value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { description } = await inquirer.prompt(question);
    return description;
}

const listPlaces = async ( places = [] ) => {
    const choices = places.map((place, i)=> {
        const idx = `${i+1}.`.green
        return {
            value: place.id,
            name: `${idx} ${place.name}`
        }
    });

    choices.unshift({
        value: '0',
        name: `${'0.'.green} Cancelar`
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione Lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(questions);
    return id;
}

const showListCheckList = async ( tasks = [] ) => {
    const choices = tasks.map((task, i)=> {
        const idx = `${i+1}.`.green
        return {
            value: task.id,
            name: `${idx} ${task.description}`,
            checked: (task.completedIn) ? true : false
        }
    });

    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(question);
    return ids;
}

const confirm = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);

    return ok;
}


module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    showListCheckList
};