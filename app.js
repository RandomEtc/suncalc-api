"use strict";

var express = require("express"),
    SunCalc = require("suncalc");

var app = express.createServer();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/times/', function(req,res){
    var lat = parseFloat(req.query.lat),
        lon = parseFloat(req.query.lon),
        date = Date.parse(req.query.date) || Date.now();
    res.send(SunCalc.getTimes(date, lat, lon));
})

app.listen(process.env.PORT);
