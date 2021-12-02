const Customer = require('./Customer');
const Admin = require('./Admin');
const Mentee = require('./Mentee');
const Mentor = require('./Mentor');
const Profile = require('./Profile');
const Report = require('./Report');

var fs = require('fs');
const User = require('./User');

var registry = {
    bannedEmails: [],
    reports: [],
    mentees: [],
    mentors: [],
    admins: [],
    activeUser: {},

    //Loads files into memory
    init: function () {
        this.getObjectsFromDir('Mentees').forEach(obj => {
            this.mentees.push(obj);
        })
        this.getObjectsFromDir('Mentors').forEach(obj => {
            this.mentors.push(obj);
        })
        this.getObjectsFromDir('Admins').forEach(obj => {
            this.admins.push(obj);
        })
        this.getObjectsFromDir('Reports').forEach(obj => {
            this.reports.push(obj);
        })

        this.bannedEmails = fs.readFileSync('bannedEmails.txt', 'utf8').split(' ');
    },

    getUser: function (email) {
        var user = new User();
        this.mentees.forEach(customer => {
            if (customer.email == email) {
                user = customer;
                return;
            }
        })
        this.mentors.forEach(customer => {
            if (customer.email == email) {
                user = customer;
                return;
            }
        })
        this.admins.forEach(admin => {
            if (admin.email == email) {
                user = admin;
                return;
            }
        })

        return user;
    },

    getCustomer: function (email) {
        var customer = new Customer();
        this.mentees.forEach(cust => {
            if (cust.email == email) {
                customer = cust;
                return;
            }
        })
        this.mentors.forEach(cust => {
            if (cust.email == email) {
                customer = cust;
                return;
            }
        })

        return customer;
    },

    signup: function (email, password, customerType) {
        employees = fs.readFileSync('fdmEmployees.json', 'utf8');
        employeesJson = JSON.parse(employees);
        var profile;
        for (i = 0; i < employeesJson.length; i++) {
            if (employeesJson[i].email == email) {
                Name = employeesJson[i].profile.name;
                role = employeesJson[i].profile.role;
                sex = employeesJson[i].profile.sex;
                age = employeesJson[i].profile.age;

                profile = new Profile(Name, role, sex, age);
                profile.accountType = customerType;
                break;
            }
        }

        if (customerType == "mentee") {
            var mentee = new Mentee(email, password, profile);
            this.activeUser = mentee;
            this.mentees.push(mentee);
            MenteeFilePath = "Mentees/".concat(email);
            fs.writeFile(MenteeFilePath, JSON.stringify(mentee), { flag: 'w+' }, err => {
                if (err) {
                    console.log("Could not write to mentee file " + profile.name);
                    console.log(err)
                }
            });
            return mentee;
        }
        else if (customerType == "mentor") {
            var mentor = new Mentor(email, password, profile);
            this.activeUser = mentor;
            this.mentors.push(mentor);
            MentorFilePath = "Mentors/".concat(email);
            fs.writeFile(MentorFilePath, JSON.stringify(mentor), { flag: 'w+' }, err => {
                if (err) {
                    console.log("Could not write to mentor file " + profile.name);
                    console.log(err)
                }
            });
            return mentor;
        }
        else {
            console.log("CUSTOMER TYPE ERROR");
        }
    },

    /* Fail conditions:
    - not fdm email
    - email is banned
    - account already exists for the email */
    getSignupValidity: function (email) {
        var validity = {
            isValid: false,
            reason: ""
        };

        employees = JSON.parse(fs.readFileSync('fdmEmployees.json', 'utf8'));
        var isEmailFDM = false;
        for (i = 0; i < employees.length; i++) {
            if (employees[i].email == email) {
                isEmailFDM = true;
                break;
            }
        }

        if (!isEmailFDM) {
            validity.reason = "Not fdm email";
            validity.isValid = false;
            return validity;
        }

        if (this.bannedEmails.includes(email)) {
            validity.reason = "Email is banned";
            validity.isValid = false;
            return validity;
        }

        if (this.getUser(email).email == email) {
            validity.reason = "Account already exists for email";
            validity.isValid = false;
            return validity;
        }

        validity.reason = "valid";
        validity.isValid = true;
        return validity;
    },

    /* Fail conditions:
    - account doesn't exist
    - email is banned */
    getLoginValidity: function (email, password) {
        var validity = {
            isValid: false,
            reason: ""
        };

        if (this.bannedEmails.includes(email)) {
            validity.reason = "Email is banned";
            validity.isValid = false;
            return validity;
        }

        if (this.getUser(email).email != email) {
            validity.reason = "Account does not exist";
            validity.isValid = false;
            return validity;
        }

        validity.reason = "valid";
        validity.isValid = true;
        return validity;
    },

    findMatches: function (customer, numOfMatches = 3) {
        var profile = customer.profile;
        var matches = [];
        var pool = [];
        if (profile.accountType == 'mentor') {
            pool = this.mentees;
        }
        else if (profile.accountType == 'mentee') {
            pool = this.mentors;
        }
        else {
            console.log('customer account type is invalid');
        }
        pool.forEach(customer => {
            match = {
                customer: customer,
                score: this.getProfileMatchScore(profile, customer.profile)
            };
            if (matches.length < numOfMatches) {
                matches.push(match.customer);
            }
            else {
                for (i = 0; i < matches.length; i++) {
                    if (match.score > matches[i].score) {
                        matches[i] = match.customer;

                        matches.sort(function (a, b) {
                            if (a.score < b.score) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        })
                    }
                }
            }
        })

        return matches;
    },

    removeUser: function (user) {
        if (user instanceof Mentee) {
            this.customers.splice(this.mentees.indexOf(user), 1);
            fs.unlink('Mentees/'.concat(user.email));
        }
        else if (user instanceof Mentor) {
            this.customers.splice(this.mentors.indexOf(user), 1);
            fs.unlink('Mentors/'.concat(user.email));
        }
        else if (user instanceof Admin) {
            this.admins.splice(this.admins.indexOf(user), 1);
            fs.unlink('Admins/'.concat(user.email));
        }
        else {
            console.log("Could not remove user")
        }
    },

    searchCustomer: function (filter) {
        var results = [];
        var customers = [];
        customers = this.mentees.concat(this.mentors);

        customers.forEach(customer => {
            if (filter.includes(customer.profile.role)) {
                results.push(customer);
            }
            else {
                customer.profile.name.split(" ").forEach(name => {
                    if (filter.includes(name) && results.indexOf(customer) == -1) {
                        results.push(customer);
                        return;
                    }
                });
            }


        })

        if (results.length == 0) {
            this.getCustomers().forEach(customer => {
                searchScore = 0;
                //searchScore += this.getTextMatch(customer.profile.getField("selfDescription"), filter);
                searchScore += this.getTextMatch(customer.profile.skillsAndExperience, filter);
                searchScore += this.getTextMatch(customer.profile.qualifications, filter);
                searchScore = searchScore / 2;

                console.log('customer ' + customer.profile.name + " had a search score of " + searchScore);
                if (searchScore > 0.2) {
                    results.push(customer);
                }
            })
        }

        return results;
    },

    addReport: function (reporterEmail, reporteeEmail, reason) {
        var report = new Report(reporterEmail, reporteeEmail, reason);
        this.reports.push(report);
        console.log("report added: " + report)
        filePath = "Reports/".concat(reporterEmail).concat('-').concat(reporteeEmail);
        fs.writeFile(filePath, JSON.stringify(report), { flag: 'w+' }, err => {
            if (err) {
                console.log("Could not write to report file " + report);
                console.log(err)
            }
        });
    },

    addBannedEmail: function (email) {
        this.bannedEmails.push(email);
        fs.writeFile("BannedEmails/".concat(email), email, { flag: 'a+' }, err => {
            if (err) {
                console.log("Could not ban email " + email);
                console.log(err)
            }
        });
    },

    getUsers: function () {
        var users = [];
        this.mentees.forEach(user => {
            users.push(user);
        });
        this.mentors.forEach(user => {
            users.push(user);
        });
        this.admins.forEach(user => {
            users.push(user);
        });

        return users;
    },

    getCustomers: function () {
        var customers = [];
        this.mentees.forEach(customer => {
            customers.push(customer);
        });
        this.mentors.forEach(customer => {
            customers.push(customer);
        });

        return customers;
    },

    getProfiles: function () {
        var profiles = [];
        this.mentees.forEach(customer => {
            profiles.push(customer.profile);
        })
        this.mentors.forEach(customer => {
            profiles.push(customer.profile);
        })

        return profiles;
    },

    updateProfile: function (profile) {
        this.activeUser.profile.selfDescription = profile.selfDescription;
        this.activeUser.profile.skillsAndExperience = profile.skillsAndExperience;
        this.activeUser.profile.qualifications = profile.qualifications;

        this.mentees.forEach(mentee => {
            if (mentee.email == this.activeUser.email) {
                mentee = this.activeUser;
                filePath = "Mentees/".concat(mentee.email);
                return;
            }
        })
        this.mentors.forEach(mentor => {
            if (mentor.email == this.activeUser.email) {
                mentor = this.activeUser;
                filePath = "Mentors/".concat(mentor.email);
                return;
            }
        })

        fs.writeFile(filePath, JSON.stringify(this.activeUser), { flag: 'w+' }, err => {
            if (err) {
                console.log("Could not update profile " + profile);
                console.log(err)
            }
        });
    },



    //----------------- HELPER FUNCTIONS -------------------

    getProfileMatchScore: function (profile1, profile2) {
        score = 0;

        maxAgeScore = 10;
        maxRoleScore = 50;
        maxDescriptionScore = 10;
        maxSkillsScore = 20;
        maxQualificationsScore = 10;

        //Age
        ageDif = Math.abs(profile1.age - profile2.age);
        ageScore = maxAgeScore - ageDif;
        ageScore < 0 ? score += 0 : score += ageScore;

        //Role
        profile1.role == profile2.role ? score += 50 : score += 0;

        //Editable fields
        score += maxDescriptionScore * this.getTextMatch(profile1.selfDescription, profile2.selfDescription);
        score += maxSkillsScore * this.getTextMatch(profile1.skillsAndExperience, profile2.skillsAndExperience);
        score += maxQualificationsScore * this.getTextMatch(profile1.qualifications, profile2.qualifications);

        return score;
    },

    getTextMatch(text1, text2) {
        var words1 = text1.split(" ");
        var words2 = text2.split(" ");
        var uniqueWords1 = new Set(words1);
        var uniqueWords2 = new Set(words2);

        var numOfWords = uniqueWords1.size + uniqueWords2.size;
        var matches = 0;
        uniqueWords1.forEach(word => {
            if (uniqueWords2.has(word)) {
                matches++;
            }
        })
        uniqueWords2.forEach(word => {
            if (uniqueWords1.has(word)) {
                matches++;
            }
        })

        if (matches == 0) {
            return 0;
        }

        return numOfWords / matches;
    },

    getObjectsFromDir(dirName) {
        objects = [];
        var files = fs.readdirSync(dirName, { withFileTypes: true });
        files.forEach(file => {
            console.log("file found: " + file.name)
            obj = JSON.parse(fs.readFileSync(dirName.concat('/').concat(file.name), 'utf8'));
            objects.push(obj);
        })

        return objects;
    }
}

module.exports = registry;