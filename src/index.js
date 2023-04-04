const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const { tallySchema } = require('./schema')

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { connection } = require('./connector')

app.listen(port, () => console.log(`App listening on port ${port}!`))

app.get("/totalRecovered", async (req, resp) => {
    try {
        // it returns us the entire database
        const data = await tallySchema.find();
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total += data[i].recovered
        }
        resp.status(200).json({
            data: { _id: "total", recovered: total },
        })
    }
    catch (error) {
        resp.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

app.get("/totalActive", async (req, resp) => {
    try {
        // it returns us the entire database
        const data = await tallySchema.find();
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total += data[i].infected
        }
        resp.status(200).json({
            data: { _id: "total", active: total },
        })
    }
    catch (error) {
        resp.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

app.get("/totalDeath ", async (req, resp) => {
    try {
        // it returns us the entire database
        const data = await tallySchema.find();
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total += data[i].death
        }
        resp.status(200).json({
            data: { _id: "total", death: total },
        })
    }
    catch (error) {
        resp.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

app.get("/hotspotStates", async (req, resp) => {
    try {
        // it returns us the entire database
        const data = await tallySchema.find();
        const states = [];
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            //caluclate here death/infected
            let rate = (data[i].infected) - (data[i].recovered) / (data[i].infected)
            //here aboue we got  ratevalue
            if (rate > 0.1) {
                states.push({ state: data[i].state, rate: rate })
            }
        }
        resp.status(200).json({
            data: states,
        })
    }
    catch (error) {
        resp.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

app.get("/healthyStates", async (req, resp) => {
    try {
        // it returns us the entire database
        const data = await tallySchema.find();
        const states = [];
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            //caluclate here death/infected
            let mortality = (data[i].death) / (data[i].infected)
            //here aboue we got mortality rate
            if (mortality < 0.005) {
                states.push({ state: data[i].state, mortality: mortality })
            }
        }
        resp.status(200).json({
            data: states,
        })
    }
    catch (error) {
        resp.status(500).json({
            status: "failed",
            message: error.message
        })
    }
})

module.exports = app;