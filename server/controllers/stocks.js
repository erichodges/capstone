var app = require("express").Router();
var knex = require('../../db/knex');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


app.post('/api/login', function(req, res) {
    console.log(req.body);

    knex.select('*').from('users').where({
            email: req.body.username
        })
        .then(function(rows) {
            console.log(rows);


            if (rows.length === 1) {
                bcrypt.compare(req.body.password, rows[0].password, function(err, matchingPasswords) {
                    if (matchingPasswords) {
                        console.log(err, matchingPasswords, rows.length);
                        // We sign enough information to determine if
                        // the user is valid in the future.
                        // In our case, email and password are required
                        var token = jwt.sign({
                            email: rows[0].email,
                            user_id: rows[0].user_id
                        }, process.env.SECRET_KEY); //call .env

                        // On success, we send the token back
                        // to the browser.
                        res.json({
                            jwt: token
                        });
                    } else {
                        res.json({
                            error: null,
                            message: "no matching user/pass combo"
                        });
                    }

                });

            } else {
                res.json({
                    error: null,
                    message: "no matching user/pass combo"
                });
            }

        }).catch(function(err) {
            console.log(err);
            res.json({
                error: JSON.stringify(err),
                message: "Error connecting to Database"
            });
        });
});

module.exports = app;

