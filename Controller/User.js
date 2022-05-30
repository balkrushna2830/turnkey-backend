const userSchema = require("../Model/User");

exports.getUserById = (req, res, next, id) => {
    userSchema.findById(id).exec((err, user) => {
        if (err) {
            res.status(401).json({ error: err });
            return;
        }
        req.user = user;
        next();
    });
}