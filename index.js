// Require express and body-parser
const bodyParser = require("body-parser")
const express = require('express');
const git = require("nodegit");
const path = require('path');

var config = require('./config.json');


// Initialize express and define a port
const app = express()
const PORT = config.port

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.post("/" + config.hook_path, (req, res) => {
    console.log(req.body.repository.clone_url) // Call your action on the request here
    git.Clone(req.body.repository.clone_url, config.clone_directory).then(function (repository) {
        // Work with the repository object here.
    });
    res.status(200).end() // Responding is important
})

// Start express on the defined port
app.listen(PORT, () => console.log(`http://[YOUR IP]:${PORT}`+"/" + config.hook_path ))