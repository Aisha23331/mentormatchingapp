const registry = require('./Registry.js');
const handler = require('./Handler.js');
const User = require('./User');

var http = require('http');
var fs = require('fs');

//Load files into memory
registry.init();

//HTML files
index = fs.readFileSync('html/index.html', 'utf8');
connections = fs.readFileSync('html/connections.html', 'utf8');
login = fs.readFileSync('html/login.html', 'utf8');
signup = fs.readFileSync('html/signup.html', 'utf8');
profile = fs.readFileSync('html/profile.html', 'utf8');
messages = fs.readFileSync('html/messages.html', 'utf8');
reports = fs.readFileSync('html/reports.html', 'utf8');
recommendations = fs.readFileSync('html/recommendation.html', 'utf8');
searchedResults = fs.readFileSync('html/searchedResult.html', 'utf8');

//CSS files
index_css = fs.readFileSync('html/css/index.css', 'utf8');
connections_css = fs.readFileSync('html/css/connections.css', 'utf8');
login_css = fs.readFileSync('html/css/login.css', 'utf8');
profile_css = fs.readFileSync('html/css/profile.css', 'utf8');
messages_css = fs.readFileSync('html/css/messages.css', 'utf8');
recommended_css = fs.readFileSync('html/css/recommended.css', 'utf8');
searchedResults_css = fs.readFileSync('html/css/searchedResult.css', 'utf8');

//JS files
client_js = fs.readFileSync('html/js/client.js');

//Resources
mentorImage = fs.readFileSync('html/img/mentorimage.png');

http.createServer(function (req, res) {
  console.log("pathname: " + req.url);

  //HTML requests
  if (req.url == '/' || req.url.endsWith('html/index.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(index);
  }
  else if (req.url.endsWith('html/connections.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(connections);
  }
  else if (req.url.endsWith('html/login.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(login);
  }
  else if (req.url.endsWith('html/signup.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(signup);
  }
  else if (req.url.endsWith('html/profile.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(profile);
  }
  else if (req.url.endsWith('html/messages.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(messages);
  }
  else if (req.url.endsWith('html/reports.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(reports);
  }
  else if (req.url.endsWith('html/recommendation.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(recommendations);
  }
  else if (req.url.endsWith('html/searchedResult.html')) {
    res.writeHead(200, "Content-Type", "text/html");
    res.end(searchedResults);
  }


  //CSS requests
  else if (req.url.endsWith('css/index.css')) {
    res.writeHead(200, "Content-Type", "text/css");
    res.end(index_css);
  }
  else if (req.url.endsWith('css/connections.css')) {
    res.writeHead(200, "Content-Type", "text/css");
    res.end(connections_css);
  }
  else if (req.url.endsWith('css/login.css')) {
    res.writeHead(200, "Content-Type", "text/css");
    res.end(login_css);
  }
  else if (req.url.endsWith('css/profile.css')) {
    res.writeHead(200, "Content-Type", "text/css");
    res.end(profile_css);
  }
  else if (req.url.endsWith('css/messages.css')) {
    res.writeHead(200, "Content-Type", "text/css");
    res.end(messages_css);
  }
  else if (req.url.endsWith('css/recommended.css')) {
    res.writeHead(200, "Content-Type", "text/css");
    res.end(recommended_css);
  }
  else if (req.url.endsWith('css/searchedResult.css')) {
    res.writeHead(200, "Content-Type", "text/css");
    res.end(searchedResults_css);
  }


  //JS requests
  else if (req.url.endsWith('js/client.js')) {
    res.writeHead(200, "Content-Type", "application/javascript");
    res.end(client_js);
  }


  //Resource requests
  else if (req.url.endsWith('img/mentorimage.png')) {
    res.writeHead(200, "Content-Type", "application/javascript");
    res.end(mentorImage);
  }


  //Logic Requests
  else if (req.url == '/login') {
    handler.HandleLogin(req, res);
  }
  else if (req.url == '/signup') {
    handler.HandleSignup(req, res);
  }
  else if (req.url == '/activeUser') {
    handler.GetActiveUser(req, res);
  }
  else if (req.url == '/user') {
    handler.GetUser(req, res);
  }
  else if (req.url == '/users') {
    handler.GetUsers(req, res);
  }
  else if (req.url == '/updateProfile') {
    handler.UpdateProfile(req, res);
  }
  else if (req.url == '/connect') {
    handler.Connect(req, res);
  }
  else if (req.url == '/disconnect') {
    handler.Disconnect(req, res);
  }
  else if (req.url == '/search') {
    handler.HandleSearch(req, res);
  }
  else if (req.url == '/searchResults') {
    handler.GetSearchResults(req, res);
  }
  else if (req.url == '/recommendations') {
    handler.GetRecommendations(req, res);
  }
  else if (req.url == '/viewProfile') {
    handler.ViewProfile(req, res);
  }
  else if (req.url == '/profile') {
    handler.GetProfile(req, res);
  }


  //URL not found
  else {
    //GoToDefaultPage(res)
    console.log('(Error) Resource not found: ' + req.url)
  }

}).listen(8080);
