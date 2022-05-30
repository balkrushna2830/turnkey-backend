const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuid } = require("uuid");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        contact: {
            type: Number,
            maxlength: 10,
            required: true,
            unique: true,
        },
        salt: String,
        encryPassword: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuid();
        this.encryPassword = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encryPassword;
    },

    securePassword: function (plainPassword) {
        if (!plainPassword) return "";
        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (error) {
            return "";
        }
    },
};
module.exports = mongoose.model("User", userSchema);
