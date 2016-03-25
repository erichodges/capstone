var app = require("express").Router();
var knex = require('../../db/knex');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

app.post('/api/signup', function(req, res) {
    var newStock = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            knex('users').where({
                email: newUser
            }).then(function(rows) {

                if (rows.length === 0) {
                    knex('users').insert({
                        email: newUser.email,
                        password: hash
                    }).returning('*').then(function(data) {
                        console.log("hi", data); // returns the data that was inserted into the database
                        var token = jwt.sign({
                            email: data.email,
                            password: data.password
                        }, process.env.SECRET_KEY); //call .env

                        // On success, we send the token back
                        // to the browser.
                        res.json({
                            jwt: token,
                            email: data.email
                        });
                    });
                } else {
                    res.send("ERROR 404: USERNAME ALREADY EXISTS!!");
                    console.log("ERROR 404: USERNAME ALREADY EXISTS!!");
                }
            });
        });
    });
});

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
                            password: rows[0].password
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

