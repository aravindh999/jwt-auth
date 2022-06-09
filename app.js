const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const authRouters = require("./routers/authRouters");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middleware/authMiddleware");

dotenv.config({ path: "./config/config.env" });

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
    const PORT = process.env.PORT || 3000;

    app.listen(
        PORT,
        console.log(
            `Server running in  ${process.env.NODE_ENV} mode on port ${PORT}`
        )
    );
});

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.get("*", checkUser);
app.use("/", require("./routers/index"));
app.use(authRouters);
