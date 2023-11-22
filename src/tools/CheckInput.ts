
const phone = (input: string) => {
    let regex = new RegExp('^[0-9]{10}$');
    return regex.test(input);
    // return input.match(/^[0-9]{10}$/);
}

const email = (input: string) => {
    let regex = new RegExp('^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$');
    return regex.test(input);
}

const password = (input: string) => {
    let regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])');
    return regex.test(input);
    // return input.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/);
}

const dateInferiorToToday = (input: Date) => {
    // input inferior to today - 13 years
    let today = new Date();
    let dateLimit = new Date();
    dateLimit.setFullYear(today.getFullYear() - 13);
    return input < dateLimit;
}

const isNotEmpty = (input: string) => {
    return input.length > 0;
}

const areNotEmpty = (inputs: string[]) => {
    let result = true;
    inputs.forEach((input) => {
        if (!isNotEmpty(input)){
            result = false;
        }
    });
    return result;
}

export default {
    phone,
    email,
    password,
    isNotEmpty,
    areNotEmpty,
    dateInferiorToToday
};