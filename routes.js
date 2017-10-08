var express = require('express');
var errors = require('express-api-server').errors;
var jsonParser = require('body-parser').json();
var request = require('async-request');
var router = module.exports = express.Router();
 
router.route('/getHighscore').get(async (req, res, next) => {
    var response = await request('http://getepicerror.nl/getsetscores.php', 
        {
            method: "POST",
            data: "sni=149202889195636&ogl=2017%2D10%2D6",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
    res.send(response.body);
});

router.route('/setHighscore').post(async (req, res) => {
    var fap = req.param("fap");
    var score = req.param("score");
    var response = await request('http://getepicerror.nl/savesetscore.php', 
    {
        method: "POST",
        data: "fap=" + fap + "&fne=" + score + "&sni=149202889195636&ogl=2017%2D10%2D7",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    res.send(response.body);
});


router.route('/').get(function(req, res, next) {
    res.send(`<html>
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script>
            $(document).ready(function() {
                $.ajax("http://localhost:8000/getHighscore", {
                    success: function(data) {
                        var dataJson = JSON.parse(data.replace(/'/g, "\\"")) //\\"
                        var score = dataJson.wa;
                        $(".current").text(score);
                    }
                })

                var trySet = function(score, fap) {
                    var text = $(".trying").text();
                    $(".trying").text(text + ".");
                    $.ajax("http://localhost:8000/setHighscore?fap=" + fap + "&score=" + score, {
                        type: "POST",
                        success: function(data) {
                            if (data == "") {
                                trySet(score, fap - 1);
                            } else {
                                $(".trying").text("Done! New highscore: " + score); 
                                $(".current").text(score);        
                            }
                        }
                    });
                };

                $(".break").click(function() {
                    var score = Number($(".current").text());
                    trySet(score + 1, 152);
                });
            });
        </script>
    </head>
    <body>
        <div style="display: none"> Current High: <span class="current"></span></div>
        <button class="break" style="font-size: 100px"> Ben is the greatest! Noga sucks at Set!</button><br/>
        <div class="trying"></div>
    </body>
    </html>`);
});
