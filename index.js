// Require express and body-parser
var express = require('express');
var path = require('path');
const bodyParser = require("body-parser")
var Git = require("nodegit");

// Initialize express and define a port
const app = express()
const PORT = 9090

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.post("/webhook", (req, res) => {
    console.log(req.body.repository.clone_url) // Call your action on the request here
    Git.Clone(req.body.repository.clone_url, "test").then(function (repository) {
        // Work with the repository object here.
    });
    res.status(200).end() // Responding is important
})
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/html/index.html'));
});

// Start express on the defined port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))