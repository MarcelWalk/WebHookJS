// Require express and body-parser
const bodyParser = require("body-parser")
const express = require('express');
const git = require("nodegit");
const path = require('path');
var crypto = require('crypto');
const fs = require('fs-extra')
var ip = require("ip");
var config = require('./config.json');
const { exec } = require("child_process");



// Initialize express and define a port
const app = express()
const PORT = config.port

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());
app.post("/" + config.hook_path, (req, res) => {

    //Build expected hash
    var check = `sha1=${crypto.createHmac('sha1', config.hook_secret).update(JSON.stringify(req.body), 'utf-8').digest('hex')}`
    console.log(check);

    //Get relevant line and check if its equal to the expected value (Password check)
    if (check === req.rawHeaders[19]) {

        config.pre_exec_cmds.split(";").forEach(element => {
            if(element !== '' && element)
            executeCmd(element)
        });

        //Revome old folder and clone new
        fs.removeSync(config.clone_directory)
        git.Clone(req.body.repository.clone_url, config.clone_directory);//.then(function (repository) {});

        config.post_exec_cmds.split(";").forEach(element => {
            if(element !== '' && element)
            executeCmd(element)
        });

        //Send Response
        res.status(200).end()
    } else {
        res.status(403).end()
    }
})

function executeCmd(str){
    exec(str, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

// Start express on the defined port
console.log("Listening on:")
app.listen(PORT, () => console.log(`http://${ip.address()}:${PORT}` + "/" + config.hook_path))