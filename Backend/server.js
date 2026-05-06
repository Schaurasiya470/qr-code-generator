const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/*================== SendGrid Setup ===============================*/

sgMail.setApiKey(process.env.EMAIL_API_KEY);

/*================== Database Connection ===============================*/

var mongoURL = process.env.MONGO_DB_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const con = mongoose.connection;

con.on("connected", () => {
    console.log("Qr Generator DB Connected Successfully...");
});

/*================== Database Connection End ============================*/

/*========================= Test Mail Route ===============================*/

app.get("/send-mail", async (req, res) => {
    try {
        const msg = {
            to: "schaurasiya470@gmail.com", // change this
            from: "hr@devsachin.online", // verified domain email
            subject: "Test Mail From SendGrid",
            text: "Hello Sachin! Your email setup is working.",
            html: `
                    <h2>Hello Sachin 👋</h2>
                    <p>Your SendGrid email integration is working successfully.</p>
                `,
        };
        console.log("Email Payload",msg)
        await sgMail.send(msg);

        res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        console.log("EMAIL ERROR => ", error.response?.body || error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/*========================= All Routes ===============================*/

const cardRouter = require("./routes/card.router.js");
const generateCardRouter = require("./routes/generate.card.router.js");

app.get("/", (req, res) => res.send("Server is working !" + process.env.PORT_NO));
app.use("/get-card", cardRouter);
app.use("/generate-card", generateCardRouter);

/*========================= All Routes End ===============================*/

app.listen(process.env.PORT_NO, () =>
    console.log(`Server running on http://localhost:${process.env.PORT_NO}`)
);