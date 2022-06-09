const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
    handleErrors,
    handlePassErrors,
} = require("../controllers/handleErrors");

const router = Router();
router.get("/", (req, res) => {
    res.render("home");
});

router.get("/details", requireAuth, (req, res) => {
    res.render("empdetails");
});

router.get("/view", requireAuth, (req, res) => {
    res.render("view");
});

router.put("/view", requireAuth, async (req, res) => {
    const { email, password } = req.body;

    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "8h4h@j%db#2jd", async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                try {
                    let user = await User.findById(decodedToken.id);
                    if (user) {
                        let upd = await User.editEmail(
                            user.email,
                            email,
                            password
                        );
                        if (upd) {
                            res.status(201).json({ user: user._id });
                        } else {
                            res.status(400).json({
                                email: "Something went wrong!",
                                password: "",
                            });
                        }
                    } else {
                        res.redirect("/login");
                    }
                } catch (err) {
                    const errors = handleErrors(err);
                    console.log(err);
                    res.status(400).json({ errors });
                }
            }
        });
    } else {
        res.redirect("/");
    }
});

router.get("/view/editpass", requireAuth, (req, res) => {
    res.render("editpass");
});

router.put("/view/editpass", requireAuth, (req, res) => {
    const { oldpass, newpass, renewpass } = req.body;

    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "8h4h@j%db#2jd", async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                try {
                    let user = await User.findById(decodedToken.id);
                    if (user) {
                        let upd = await User.editPassword(
                            user.email,
                            oldpass,
                            newpass,
                            renewpass
                        );
                        if (upd) {
                            res.status(201).json({ user: user._id });
                        } else {
                            res.status(400).json({
                                oldpass: "Something went wrong!",
                                newpass: "",
                                renewpass: "",
                            });
                        }
                    } else {
                        res.redirect("/login");
                    }
                } catch (err) {
                    const errors = handlePassErrors(err);
                    res.status(400).json({ errors });
                }
            }
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
