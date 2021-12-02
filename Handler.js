const registry = require('./Registry');

var searchResults = [];
var profile = {};

function GoToDefaultPage(res) {
  res.writeHead(200, "Content-Type", "text/html");
  res.end(index);
}

function GetFormValue(formdata, key) {
  var StartIndex = formdata.indexOf(key) + key.length + 1; //+1 for '='
  var EndIndex = formdata.indexOf("&", StartIndex);
  if (EndIndex == -1) { //Last key in formdata
    EndIndex = formdata.length;
  }
  return formdata.substring(StartIndex, EndIndex);
}

function LoginFormToJSON(formData) {
  var formdata = decodeURIComponent(formData);
  var email = GetFormValue(formdata, "email");
  var password = GetFormValue(formdata, "password");

  return { email: email, password: password };
}

function SignupFormToJSON(formData) {
  var formdata = decodeURIComponent(formData);
  var email = GetFormValue(formdata, "email");
  var password = GetFormValue(formdata, "password");
  var accountType = GetFormValue(formdata, "accountType");

  return { email: email, password: password, accountType: accountType };
}

function HandleLogin(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    var loginData = JSON.parse(data);
    var validity = registry.getLoginValidity(loginData.email, loginData.password);
    console.log(validity);
    if (validity.isValid) {
      var user = registry.getUser(loginData.email);
      registry.activeUser = user;
      //user.login(loginData.email, loginData.password);
    }

    res.end(JSON.stringify(validity));
  })
}

function HandleSignup(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    var signupData = JSON.parse(data);
    var validity = registry.getSignupValidity(signupData.email);
    if (validity.isValid) {
      registry.signup(signupData.email, signupData.password, signupData.accountType);
    }

    res.end(JSON.stringify(validity));
  });
}

function GetActiveUser(req, res) {
  res.end(JSON.stringify(registry.activeUser));
}

function GetUser(req, res) {
  let email = '';
  req.on('data', chunk => {
    email += chunk;
  });
  req.on('end', () => {
    var user = registry.getUser(email);
    console.log("User got: " + user);
    res.end(JSON.stringify(user));
  });
}

function GetUsers(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    var emails = JSON.parse(data);
    console.log("emails recieved: " + emails);
    var users = [];
    emails.forEach(email => {
      users.push(registry.getUser(email));
    })

    res.end(JSON.stringify(users));
  });
}

function UpdateProfile(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    var profile = JSON.parse(data);
    registry.updateProfile(profile);
  });
}

function HandleSearch(req, res) {
  let searchFilter = '';
  req.on('data', chunk => {
    searchFilter += chunk;
  });
  req.on('end', () => {
    var filter = searchFilter.slice(1, searchFilter.length - 1); //removes surrounding "" chars
    var results = registry.searchCustomer(filter);
    console.log("Search results: " + results);
    searchResults = results;
  });
}

function GetSearchResults(req, res) {
  console.log('getting ' + searchResults.length)
  res.end(JSON.stringify(searchResults));
}

function GetRecommendations(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    var customer = JSON.parse(data);
    var matches = registry.findMatches(customer);
    console.log("Matches found: " + matches);
    res.end(JSON.stringify(matches));
  });
}

function ViewProfile(req, res) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    profile = JSON.parse(data);
  });
}

function GetProfile(req, res) {
  var prof = profile;
  profile = {};
  res.end(JSON.stringify(prof));
}

module.exports = {
  HandleSignup, HandleLogin, GetActiveUser, GetUser, GetUsers, UpdateProfile,
  HandleSearch, GetSearchResults, GetRecommendations, ViewProfile, GetProfile
};
