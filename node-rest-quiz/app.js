const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb");
const { ObjectId } = require("mongodb");

const config = {
    MONGO_URL: "mongodb+srv://admin:admin@cluster0-a9lh4.mongodb.net"
};

const start = async () => {
    const app = express();
    app.use(cors());
    app.use(
        bodyParser.json({
            limit: "50mb"
        })
    );

    const client = await MongoClient.connect(config.MONGO_URL);
    const db = client.db("quiz");

    const Participants = db.collection("Participants");
    const Questions = db.collection("Questions");

    app.post("/users/register", async (req, res) => {
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

    app.get("/questions", async (req, res) => {
        const questions = await Questions.find({}).toArray();

        return res.json({
            success: true,
            questions
        });
    });

    app.post("/answers", async (req, res) => {
        const { questions } = req.body;

        const ids = questions.map(question => question._id);

        const qs = await Questions.find({
            _id: { $in: ids.map(id => ObjectId(id)) }
        }).toArray();

        return res.json({
            success: true,
            answers: qs
        });
    });

    app.post("/update", async (req, res) => {
        const { user, Score, TimeSpent } = req.body;

        await Participants.update(
            {
                _id: ObjectId(user._id)
            },
            {
                $set: {
                    Score,
                    TimeSpent
                }
            }
        );

        return res.json({
            success: true
        });
    });

    app.listen(2690);
};

start();
