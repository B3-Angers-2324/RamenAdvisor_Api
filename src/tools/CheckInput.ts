
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

const validDateFormat = (input: string) => {
    let regex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');
    return regex.test(input);
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

const isImage = (mimetype: string) => {
    // test if mimetype is an image (jpg, jpeg, png, gif)
    return mimetype.match(/image\/(jpg|jpeg|png|gif)/);
}

const isSvg = (mimetype: string) => {
    // test if mimetype is an svg
    return mimetype.match(/image\/svg/);
}

const isUnder15Mo = (size: number) => {
    // test if size is under 15Mo
    return size < 15000000;
}


export default {
    phone,
    email,
    password,
    isNotEmpty,
    areNotEmpty,
    dateInferiorToToday,
    validDateFormat,
    isImage,
    isSvg,
    isUnder15Mo
};