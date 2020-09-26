// Require express and body-parser
const bodyParser = require("body-parser")
const express = require('express');
const git = require("nodegit");
const path = require('path');
var crypto = require('crypto');
const fs = require('fs-extra')
var ip = require("ip");
var config = require('./config.json');



// Initialize express and define a port
const app = express()
const PORT = config.port

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());
app.post("/" + config.hook_path, (req, res) => {

    console.log(req.rawHeaders)
    console.log(req.rawHeaders[19])

    hmac = crypto.createHmac('sha1', config.password)
    hmac.update(req.body.toString())
    var check = hmac.digest('hex')

    console.log("sha1=" + check);
    console.log(check === req.rawHeaders[19])
    
    fs.removeSync(config.clone_directory)
    git.Clone(req.body.repository.clone_url, config.clone_directory).then(function (repository) {
        // Work with the repository object here.
    });
    res.status(200).end() // Responding is important
})

// Start express on the defined port
console.log("Listening on:")
app.listen(PORT, () => console.log(`http://${ip.address()}:${PORT}`+"/" + config.hook_path ))