const express = require('express');
const app = express();
const bp = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const db = mysql.createPool({
    host: "peter.securli.hk",
    user: "peter",
    password: "ho1dollar123",
    database: "peter_db"
});

app.use(cors());
app.use(express.json());
app.use(bp.urlencoded({extended: true}));

app.get('/api/get', (req, res) => {
    const sql = "select * from incidenta";
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

app.get('/api/get/compliances', (req, res) => {
    const sql = "select * from compliances";
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});

app.get('/api/get/pci', (req,res) => {
    const sql = "select * from PCI";
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
});

app.get('/api/get/risk', (req, res) => {
    const sql = "select `Alert Level`, month(`Update Time`) as month, count(*) as freq from incidenta  group by `Alert Level`, month(`Update Time`) order by `Alert Level`, month(`Update Time`) asc";
    db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    })
});


app.listen(3001, "0.0.0.0", () => {
    console.log('running on port 3001');
});

