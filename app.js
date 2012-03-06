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

app.get('/', function(req,res){
    var date = new Date().toISOString(),
        home = process.env.HOME_URL || 'https://github.com/RandomEtc/suncalc-api';
    res.send('<!DOCTYPE html><meta charset="utf-8"><body>' +
        'I\'m <a href="https://github.com/mourner/suncalc">suncalc</a> over HTTP. ' +
        'e.g. <a href="/times?lat=51.5&lon=-0.5&date='+date+'">/times</a> ' +
        'or <a href="/position?lat=51.5&lon=-0.5&date='+date+'">/position</a>. ' +
        'Date is optional and defaults to now. ' +
        'I run on a single free Heroku dyno. ' +
        '<a href="'+home+'">Issues/bugfixes welcome.</a>');
})

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
