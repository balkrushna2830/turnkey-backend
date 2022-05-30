const imageSchema = require("../Model/Image");

exports.getImageById = (req, res, next, id) => {
    imageSchema.findById(id).exec((err, image) => {
        if (err) {
            res.status(401).json({ error: err });
            return;
        }
        req.image = image;
        next();
    });
}

exports.addImage = (req, res) => {
    const imageData = req.file.filename;
    var obj = {
        name: req.body.name,
        data: imageData,
    }
    var image = new imageSchema(obj);
    image.save((err, image) => {
        if (err) {
            res.send({ error: err })
        } else {
            res.status(200).send({ success: "Image Added", id: image._id });
        }
    });
}

exports.getImage = (req, res) => {
    res.json(req.image);
}

exports.getAllImages = (req, res) => {
    imageSchema.find({}, (err, images) => {
        if (err) {
            console.log(err);
            res.status(401).json({ error: err });
            return;
        }
        res.status(200).json({ images: images });
    })
}

exports.getImageCount = (req, res) => {
    imageSchema.find({}, (err, images) => {
        if (err) {
            console.log(err);
            res.status(401).json({ error: err });
            return;
        }
        res.status(200).json({ images: images.length });
    })
}

exports.updateImage = (req, res) => {
    const imageData = req.file.filename;
    imageSchema.findByIdAndUpdate(
        { _id: req.image._id },
        { $set: { data: imageData, name: req.body.name } },
        { new: true, useFindAndModify: false },
        (err, iamge) => {
            if (err) {
                res.status(400).json({ error: err });
                return;
            }
            res.status(200).json({ success: "Image Updated successfully !" });
        }
    );
}

exports.removeImage = (req, res) => {
    imageSchema.deleteOne({ _id: req.image._id }).exec((err, image) => {
        if (err) {
            res.status(401).json({ error: "Unable to delete image" });
            return;
        }
        res.status(200).json({ success: "Image Deleted Successfully" });
    });
};