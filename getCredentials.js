import inquirer from "inquirer";

async function askForUser(plataform) {
    const answers = await inquirer.prompt({
        name: "user",
        type: "input",
        message: `${plataform} user:`,
    });

    return answers.user;
}

async function askForPassword(plataform) {
    const answers = await inquirer.prompt({
        name: "password",
        type: "password",
        message: `${plataform} password:`,
    });

    return answers.password;
}

export default { askForUser, askForPassword };