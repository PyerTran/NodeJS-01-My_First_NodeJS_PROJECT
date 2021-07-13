const fs = require('fs')
const express = require('express')
const app = express()
const listening_port = 2150

const bodyParser = require("body-parser")
const checker = require("./read_json")

app.use(bodyParser.urlencoded({extended : true}))

app.post('/login', (req, res) => {
    var input_email = req.body.email
    var input_password = req.body.password

    if (input_email === undefined || input_email === ""
    || input_password === undefined || input_password === "") {
        res.writeHead(400, {"error": "missing information"})
        res.end("missing information")
    }
    checker.post_handler(input_email, input_password, res)
    res.end("placeholder")
})

app.get('/', function (req, res) {
    fs.readFile('./front.html', (err, data) => {
        if (err) {
            res.writeHead(404)
            res.end("'front.html' not found")
        } else {
            res.writeHead(200)
            res.end(data)
        }
    })
})

app.listen(listening_port, () => {
    console.log('Server Listen in "localhost:2150"')
})