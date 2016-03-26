var app = require("express").Router();
var knex = require('../../db/knex');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

app.post('/api/signup', function(req, res) {
    var newUser = req.body;
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
                            password: rows[0].password,
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

// app.get('/user', function(req, res) {
//     // If they don't even have an authorization
//     // header, they are not authenticated
//     if(req.headers.authorization) {
//         // unpack that auth header, which is "Bearer " + tokenData
//         var token = req.headers.authorization.split(' ')[1];
//         var decoded = jwt.verify(token, process.env.SECRET_KEY);
//         console.log(decoded);
//         var usrData = {
//             username: decoded.username,
//             password: decoded.password
//         };

//         // If we successfully decoded, we still
//         // need to check that the encoded data
//         // is a user of ours!
//         knex('users').where(usrData).then(function(rows){
//             // IF the user existed -- send the data!
//             if(rows.length === 1) {
//                 knex('posts').then(function(rows) {
//                     res.json(rows);
//                 });
//             }
//             // IF the decoded JWT wasn't a user in our DB
//             else {
//                 res.json({
//                     message: "JWT is not for a valid user"
//                 });
//             }
//         });
//     }
//     // IF the user didn't have an authorization header
//     else{
//         res.json({message: "Unauthorized access, no authorization header"});
//     }
// });




// // POSTing you the data
// var newUser = req.body;

// // Or creating the data yourself (sample data)
// // var newUser = {
// //     username: "timmy_32",
// //     password: "whateverThisPasswordIs",
// //     col3: "value for col3"
// // }

// // Perform insert - returning gives data to the .then()
// knex('users').insert(newUser).returning('*').then(function(data) {
//     console.log(data); // returns the data that was inserted into the database
// });
