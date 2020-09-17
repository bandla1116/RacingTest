const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');
const lowDb = require("lowdb")
const app = express();
const FileSync = require("lowdb/adapters/FileSync");
const db = lowDb(new FileSync('db.json'));
const { nanoid } = require("nanoid");

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// TODO: Dropdown!
app.get('/api/teams', (req, res) => {
request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// Submit Form!
app.post('/api/addMember', (req, res) => {
  const member = req.body;
  var count = 4;
  member['id'] = nanoid();
  db.get("members").push(member).write();
  res.json({ success: true });
});

// Submit Form!
app.post('/api/members/id', (req, res) => {
  const member = req.body;
  member['id'] = nanoid();
  db.get("members").push(member).write();
  res.json({ success: true });
});

app.put('/api/members/:id', (req, res) => {
  console.log(req.json);
  db.get('members')
    .find({ id: req.params.id })
    .assign({firstName: req.body.firstName,
            lastName: req.body.lastName,
            jobTitle: req.body.jobTitle,
            team: req.body.team,
            status: req.body.status
          })
    .write();
  res.json({ result: res.json });
});

app.delete('/api/members/:id', (req, res) => {
  // db.get("members").remove(req.params.id).write();
  // delete db.get('members')[req.params.id];
  console.log(req.params.id, ' 22222222222222222222222');
  db.get('members').remove({id: req.params.id}).write();
  res.json({ deleted: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
