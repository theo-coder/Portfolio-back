const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const jsonParser = bodyParser.json()

const USER = process.env.LOGIN;
const PASS = process.env.PASS;
const PORT = process.env.PORT

let transport = {
    host: process.env.MAILSERVER_URI,
    auth: {
        user: USER,
        pass: PASS
    }
}
let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Transporter verified !')
    }
})
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.post('/send', jsonParser, (req, res, next) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.messageHtml

    let mail = {
        from: email,
        to: "theo@posty.fr",
        subject: subject,
        html: `Message depuis : <strong>theo.posty.fr</strong><br/>De : <strong>${firstName} ${lastName}</strong> (${email})<br/>Message : <br/>&nbsp;&nbsp;&nbsp;${message}`
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                msg: 'fail'
            })
        } else {
            res.json({
                msg: 'success'
            })
        }
    })
})

app.use(express.json())
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})