const router = require("express").Router();
const { Participants } = global;


router.post("/register", async (req, res) => {
    const { email, name } = req.body;

    const checkUser = await Participants.findOne({ email });

    if (checkUser) {
        return res.json({
            success: false,
            message: "User already exists"
        });
    }

    const user = await Participants.insert({
        email,
        name
    });

    return res.json({
        success: true,
        user: user.ops[0]
    });
});

module.exports = router;
