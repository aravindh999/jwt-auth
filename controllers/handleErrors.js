const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: "" };

    if (err.message == "incorrect email") {
        errors.email = "That email is not registered";
    }
    if (err.message === "incorrect password") {
        errors.password = "Password Incorrect ";
    }
    if (err.code === 11000) {
        errors.email = "That email is already registered";
        return errors;
    }

    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const handlePassErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { oldpass: "", newpass: "", renewpass: "" };

    if (err.message === "incorrect password") {
        errors.oldpass = "Password Incorrect ";
    }

    if (err.message === "password didn't match") {
        errors.newpass = "Password didn't match";
    }
    return errors;
};

module.exports = { handleErrors, handlePassErrors };
