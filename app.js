const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const bday = req.body.dob;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname,
                    BIRTHDAY: bday
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/aa37c2c856";

    const options = {
        method: "POST",
        auth: "amaan:d4beb931e8bf712635c4de2188e7bf4d-us21"
    };

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        let responseData = '';

        response.on("data", (chunk) => {
            responseData += chunk;
        });

        response.on("end", () => {
            try {
                const parsedData = JSON.parse(responseData);
                console.log(parsedData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
    });

    request.write(jsonData);
    request.end();
});
app.post("/failure", (req,res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up and running!");
});
