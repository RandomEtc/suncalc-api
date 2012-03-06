"use strict";

var express = require("express"),
    SunCalc = require("suncalc");

var app = express.createServer();

app.configure(function(){
    app.enable("jsonp callback");
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

function requireFloat(name) {
    return function(req,res, next) {
        if (name in req.query && !isNaN(parseFloat(req.query[name]))) {
            return next();
        } else {
            res.send(name + " required; must be a float.", 400);
        }
    }
}

app.get('/times', requireFloat('lat'), requireFloat('lon'), function(req,res){
    var lat = parseFloat(req.query.lat),
        lon = parseFloat(req.query.lon),
        date = Date.parse(req.query.date) || Date.now();
    res.send(SunCalc.getTimes(date, lat, lon));
})


app.get('/position', requireFloat('lat'), requireFloat('lon'), function(req,res){
    var lat = parseFloat(req.query.lat),
        lon = parseFloat(req.query.lon),
        date = Date.parse(req.query.date) || Date.now();
    res.send(SunCalc.getPosition(date, lat, lon));
})

app.listen(process.env.PORT);
