const express = require('express');
const fs = require('fs');
const csvjson = require('csvjson');
const app = express();

app.use((req, res, next) => {
// write your logging code here
  const timeData = new Date();
  const agent = req.headers["user-agent"];
  const time = timeData.toISOString();
  const method = req.method;
  const resource = req.url;
  const version = `HTTP/${req.httpVersion}`;
  const status = res.statusCode

  const data = `\n${agent},${time},${method},${resource},${version},${status}`

  fs.appendFile('log.csv', data, (err) => {
    if (err) throw err;
  })
  // console.log('data: ', data)
  // console.log('agent: ', req.headers["user-agent"])
  // console.log('time: ', time)
  // console.log('method: ', req.method)
  // console.log('resource: ', req.url)
  // console.log('version: ', `HTTP/${req.httpVersion}`)
  // console.log('status: ', res.statusCode)
  res.locals.user = data;

  next()
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
  console.log(res.locals.user);
  res.send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
  fs.readFile('log.csv', 'utf-8', (err, data) => {
    console.log('logdata: ', data)
    if (err) throw err;
    const jsonLog = csvjson.toObject(data);
    res.send(jsonLog);
  })
});

module.exports = app;
