var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var path = require('path');
var jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    console.log('we did it')
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
    //next();
});

router.post('/auth/api/stockPost', function(req, res, next) {
    console.log('hit stockPost route on server')

    var newStock = req.body;
    //have to decode jwt in here
    var token = req.body.jwt;
    console.log(token)
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log(req.decoded)
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
    knex('stocks').where({
        stock: newStock
    }).then(function(rows) {

        if (rows.length === 0) {
            knex('stocks').insert({
                user_id: req.decoded.user_id, //this user_id part is not right
                stock: newStock.stock

            }).returning('*').then(function(data) {
                console.log("hi", data); // returns the data that was inserted into the database

            });
        } else {
            res.send("ERROR 404: STOCK ALREADY EXISTS!!");
            console.log("ERROR 404: STOCK ALREADY EXISTS!!");
        }
    });
});

// router.get('/:user_id', function(req, res, next) {
// 		    knex('stocks').where({
//         user_id: req.params.user_id
//     }).then(function(rows) {
//     	res.send(rows);
//     	console.log(rows);
//     });
// })

router.get('/stocks', function(req, res, next) {
		    knex('stocks').select('*').then(function(rows) {
		    	console.log(rows);
    	res.send(rows);
    	
    });
})


module.exports = router;
