const User = require('../model/user');
const {PythonShell} = require('python-shell');

module.exports = (req, res, next) => {
    const currentUserInformation = [];
    User.findById(req.userId).then(user => {
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
            console.log(message);
            //req.userBasedOnDataAnalysis = message
        });
        pyShell.end(function(err, code, signal){
            if (err) throw err;
            console.log("Python Shell finished");
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    next();
};