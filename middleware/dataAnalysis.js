const User = require('../model/user');
const fs = require('fs');
const {PythonShell} = require('python-shell');

module.exports = (req, res, next) => {
    const currentUserInformation = [];
    User.find()
    .then(users => {
        const updatedUserData = [];
        for(i = 0; i < users.length; i++){
            if(users[i]._id != req.userId){
                var dict = {};
                dict["id"] = users[i]._id;
                dict["slow"] = users[i].music.slow;
                dict["fast"] = users[i].music.fast;
                dict["country"] = users[i].music.country;
                dict["hiphop"] = users[i].music.hiphop;
                dict["comedy"] = users[i].movie.comedy;
                dict["thriller"] = users[i].movie.thriller;
                dict["horrer"] = users[i].movie.horrer;
                dict["sci_fi"] = users[i].movie.sci_fi;
                dict["sports"] = users[i].hobbies_interests.sports;
                dict["shopping"] = users[i].hobbies_interests.shopping;
                dict["pets"] = users[i].hobbies_interests.pets;
                dict["socializing"] = users[i].hobbies_interests.socializing;
                updatedUserData.push(dict);
            }
        }
        
        fs.writeFile("user.json", JSON.stringify(updatedUserData), function(err){
            if (err) {
                res.status(400).json({
                    message: "Could not write to file"
                });
                console.log(err);
            }
            console.log("User JSON saved!");
        });
        return User.findById(req.userId);
    })
    .then(user => {
        //Error check
        if(!user) {
            const error = new Error("Could not find user in data analysis.");
            error.statusCode = 404;
            throw error;
        }
        var currentUserString = user.music.slow + " " + user.music.fast + " " + user.music.country + " " + user.music.hiphop + " " + user.movie.comedy + " " 
        + user.movie.thriller + " " + user.movie.horrer + " " + user.movie.sci_fi + " " + user.hobbies_interests.sports + " " + user.hobbies_interests.shopping + " " + user.hobbies_interests.pets + " " + user.hobbies_interests.socializing;

        var options = {
            pythonPath: "/usr/local/bin/python3"
        };
        var pyShell = new PythonShell('./pca_method.py', options);
        pyShell.send(currentUserString);
        pyShell.on("message", function(message){
            res.locals.data = message;
        });
        pyShell.end(function(err, code, signal){
            if (err) throw err;
            console.log("Python Shell finished");
            next();
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};