const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter an password"],
        minlength: [6, "Minimum password length is 6 characters"],
    },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.editEmail = async function (oldEmail, newEmail, password) {
    const user = await this.findOne({ email: oldEmail });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            const upd = await this.updateOne(
                { email: oldEmail },
                { email: newEmail }
            );
            if (upd) {
                return user;
            }
            throw Error("Can't update");
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

userSchema.statics.editPassword = async function (
    email,
    oldpass,
    newpass,
    renewpass
) {
    const user = await this.findOne({ email: email });
    if (user) {
        const auth = await bcrypt.compare(oldpass, user.password);
        if (auth) {
            if (newpass != renewpass) {
                throw Error("password didn't match");
            }
            const salt = await bcrypt.genSalt();
            const hashed = await bcrypt.hash(newpass, salt);
            const upd = await this.updateOne(
                { email: email },
                { password: hashed }
            );
            if (upd) {
                return user;
            }
            throw Error("Can't update");
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) return user;
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
