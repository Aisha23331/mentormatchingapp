const loginURL = '/login';
const signupURL = '/signup';
const getActiveUserURL = '/activeUser';
const getUserURL = '/user';
const getUsersURL = '/users';
const updateProfileURL = '/updateProfile';
const connectURL = '/connect';
const disconnectURL = '/disconnect';
const searchURL = '/search';
const getSearchResultsURL = '/searchResults';
const getRecommendationsURL = '/recommendations';
const viewProfileURL = '/viewProfile';
const getProfileURL = '/profile';

async function postData(url, data) {
    var response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response.json();
}

async function getData(url) {
    var response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}

function getRadioValue(group) {
    var elements = document.getElementsByName(group);
    for (var i = 0, l = elements.length; i < l; i++) {
        if (elements[i].checked) {
            return elements[i].value;
        }
    }
}

function Signup(event) {
    event.preventDefault(); //prevents page refresh

    var email = document.getElementById("SignupEmailInput").value;
    var password = document.getElementById("SignupPasswordInput").value;
    var accountType = getRadioValue('accountType');
    var signupData = {
        email: email,
        password: password,
        accountType: accountType
    }
    postData(signupURL, signupData).then(data => {
        console.log(data);
        if (data.isValid) {
            document.location.href = "/html/index.html";
        }
        else {
            document.getElementById('signupErrMsg').innerText = data.reason;
        }
    });
}

function Login(event) {
    event.preventDefault(); //prevents page refresh

    var email = document.getElementById("LoginEmailInput").value;
    var password = document.getElementById("LoginPasswordInput").value;
    var loginData = {
        email: email,
        password: password,
    }
    postData(loginURL, loginData).then(data => {
        if (data.isValid) {
            document.location.href = "/html/index.html";
        }
        else {
            document.getElementById('loginErrMsg').innerText = data.reason;
        }
    });
}

function FormatPage(event) {
    event.preventDefault();

    var userInfo = document.getElementById('userInfo');

    getData(getActiveUserURL).then(user => {
        if (user.hasOwnProperty('email')) {
            console.log('formatting page: ' + document.URL);
            document.getElementById('profilePage').hidden = false;
            document.getElementById('connectionsPage').hidden = false;
            document.getElementById('messagesPage').hidden = false;
            document.getElementById('searchbarDiv').hidden = false;
            document.getElementById('recommendationsPage').hidden = false;

            userInfo.hidden = false;
            userInfo.innerText = user.profile.name + ", " + user.profile.accountType;

            if (document.URL.endsWith('/html/profile.html')) {
                SetupProfile(user);
            }
            else if (document.URL.endsWith('/html/connections.html')) {
                LoadConnections(user);
            }
            else if (document.URL.endsWith('/html/recommendation.html')) {
                LoadRecommendations(user);
            }
            else if (document.URL.endsWith('/html/searchedResult.html')) {
                LoadSearchResults(user);
            }
        }
    });
}

function SetupProfile(activeUser) {
    var messageButton = document.getElementById('messageButton');
    var updateProfileButton = document.getElementById('updateProfileButton');
    var connectButton = document.getElementById('connectButton');
    var reportButton = document.getElementById('reportButton');

    var skillsTextArea = document.getElementById('skillsTextArea');
    var qualificationsTextArea = document.getElementById('qualificationsTextArea');
    var descriptionTextArea = document.getElementById('descriptionTextArea');

    getData(getProfileURL).then(profile => {
        if (!profile.hasOwnProperty('name') || AreProfilesEqual(profile, activeUser.profile)) {
            profile = activeUser.profile;

            messageButton.hidden = true;
            updateProfileButton.hidden = false;
            connectButton.hidden = true;
            reportButton.hidden = true;

            skillsTextArea.readOnly = false;
            qualificationsTextArea.readOnly = false;
            descriptionTextArea.readOnly = false;
        }
        else {
            messageButton.hidden = false;
            updateProfileButton.hidden = true;
            connectButton.hidden = false;
            reportButton.hidden = false;

            skillsTextArea.readOnly = true;
            qualificationsTextArea.readOnly = true;
            descriptionTextArea.readOnly = true;
        }

        document.getElementById('profileNameAndAge').innerText = profile.name + ', ' + profile.age;
        document.getElementById('profileRole').innerText = "Role: " + profile.role;
        document.getElementById('profileGender').innerText = "Gender: " + profile.sex;
        document.getElementById('accountType').innerText = profile.accountType;
    
        skillsTextArea.value = profile.skillsAndExperience;
        qualificationsTextArea.value = profile.qualifications;
        descriptionTextArea.value = profile.selfDescription;
    });
}

function UpdateProfile(event) {
    event.preventDefault();

    var profile = {
        selfDescription: document.getElementById('descriptionTextArea').value,
        skillsAndExperience: document.getElementById('skillsTextArea').value,
        qualifications: document.getElementById('qualificationsTextArea').value
    }

    postData('/updateProfile', profile);
}

function AreProfilesEqual(profile1, profile2) {
    if (profile1.name == profile2.name &&
        profile1.age == profile2.age &&
        profile1.sex == profile2.sex &&
        profile1.role == profile2.role &&
        profile1.accountType == profile2.accountType &&
        profile1.selfDescription == profile2.selfDescription &&
        profile1.skillsAndExperience == profile2.skillsAndExperience &&
        profile1.qualifications == profile2.qualifications)
        {
            return true;
        }
        
        return false;
}

function CreateMiniProfile(profile) {
    var profiles = document.getElementById('miniProfilesList');

    var miniProfile = document.createElement('div');
    miniProfile.classList.add('col-lg-3');
    miniProfile.classList.add('col-md-4');
    miniProfile.classList.add('col-sm-6');

    var divBlock = document.createElement('div');
    divBlock.classList.add('div-block');

    var divBlock2 = document.createElement('div');
    divBlock2.classList.add('div-block-2');

    var nameAndAge = document.createElement('div');
    nameAndAge.innerText = profile.name + ', ' + profile.age;
    nameAndAge.classList.add('text-block');

    var gender = document.createElement('p');
    gender.textContent = "Gender: " + profile.sex;
    gender.classList.add('gender');

    var role = document.createElement('p');
    role.textContent = "Role: " + profile.role;
    role.classList.add('role');

    var viewProfileButton = document.createElement('button');
    viewProfileButton.innerHTML = 'View Profile';
    viewProfileButton.classList.add('w-button');
    viewProfileButton.classList.add('button');

    var connectButton = document.createElement('button');
    connectButton.innerHTML = 'Connect';
    connectButton.classList.add('w-button');
    connectButton.classList.add('button-2');

    var profileImage = document.createElement('img');
    profileImage.src = 'https://i.imgur.com/1GKXmtd.png';
    profileImage.width = '100';
    profileImage.classList.add('image');


    profiles.append(miniProfile);
    miniProfile.append(divBlock);
    divBlock.append(divBlock2);
    divBlock2.append(profileImage);
    divBlock2.append(nameAndAge);
    divBlock2.append(viewProfileButton);
    divBlock2.append(connectButton);
    divBlock2.append(gender);
    divBlock2.append(role);

    viewProfileButton.addEventListener("click", function() {
        postData(viewProfileURL, profile);
        location.assign('/html/profile.html');
    });
}

function Search(event) {
    if (event.key == 'Enter') {
        event.preventDefault();

        var filter = document.getElementById('searchbar').value;
        postData(searchURL, filter);

        location.assign('/html/searchedResult.html');
    }
}

function LoadConnections(customer) {
    postData(getUsersURL, customer.connections).then(customer => {
        console.log("connected user: " + customer);

        CreateMiniProfile(customer.profile);
    })
}

function LoadRecommendations(customer) {
    postData(getRecommendationsURL, customer).then(matches => {
        matches.forEach(match => {
            CreateMiniProfile(match.profile);
        })
    })
}

function LoadSearchResults(customer) {
    console.log("loading serach results");
    getData(getSearchResultsURL).then(customers => {
        customers.forEach(customer => {
            console.log("Search result " + customer);

            CreateMiniProfile(customer.profile);
        })
    })
}

