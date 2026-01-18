const User = require("../models/user");

const filterObj = require("../utils/filterObj");
exports.updateMe = async (req, res, next) => {

    const { user } = req

    const filteredBody = filterObj(req.body, "firstName", "lastName", "about", "avatar")

    const updated_user = await User.findByIdAndUpdate(user._id, filteredBody, {
        new: true,
        validateModifiedOnly: true
    })



    if (!user) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }

    res.status(200).json({
        status: "success",
        message: "Updated successfully",
        data: updated_user,
    });

}

exports.getMe = async (req, res, next) => {
    res.status(200).json({
        status: "success",
        data: req.user
    })
}


