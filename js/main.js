var Location = function(location, date, time, address, title) {
    this.location = location;
    this.date = date;
    this.time = time;
    this.address = address;    
    this.title = title;
};
var showLocations = [    
    new Location('Kelowna', 'April 18th', '5:00 PM', '2170 Harvey Ave., Kelowna, BC  V1Y 6G8', 'Ramada Hotel & Conference Centre'),    
    new Location('Calgary', 'April 20th', '5:00 PM', '5940 Blackfoot Trail SE, Calgary, AB  T2H 2B5', 'Hotel Blackfoot'),
    new Location('Edmonton', 'April 21th', '5:00 PM', '10011 184 Street NW, Edmonton, AB  T5S 0C7', 'Courtyard by Marriott Edmonton West'),
    new Location('Winnipeg', 'April 24th', '5:00 PM', '1295 Ellice Ave., Winnipeg, MB  R3G 0N5', 'Homewood Suites by Hilton Winnipeg Airport Polo Park'),
    new Location('Montreal', 'April 26th', '5:00 PM', '7655, boul. Decarie, Montreal, QC  H4P 2H2', "Hotel Ruby Foo's"),
    new Location('Halifax', 'April 27th', '1:30 PM', "250 St. Margaret's Bay Road, Halifax, NS  B3N 1J4", 'Best Western Plus Chocolate Lake Hotel'),
    new Location('Moncton', 'April 28th', '12:30 PM', '	700 Mapleton Road, Moncton, NB  E1G 0L7', 'Hampton Inn & Suites by Hilton Moncton')
];

var languages = [{
    lang: 'en',
    schedule: 'Schedule',
    register: 'Register',
    title: '',
    name: 'Name',    
    accountNumber: 'Account Number',
    emailAddress: 'Email Address',
    guests: 'Number of Attendees',
    locations: 'Locations',
    sectionTitle: 'Register',
    eventName: 'Road Show 2017',
    homeMessage: 'Registration closes 5 days prior to each event',
    success: 'Thanks for registering, your spot has been saved. Please print this page as a confirmation.',    
    error: 'An error has ocurred, please try again later',
    registeredLocations: 'Your locations'
},
{
    lang: 'fr',
    schedule: 'Programme',
    register: 'Registre',
    title: '',
    name: 'Nom',    
    accountNumber: 'Numéro de compte',
    emailAddress: 'Addresse du couriel',
    guests: 'Nombre de participants',
    locations: 'Emplacements',
    sectionTitle: 'Registre',
    eventName: 'Road Show 2017',
    homeMessage: 'L’inscription se termine 5 jours avant chaque evenement',
    success: 'Merci pour votre inscription, votre place a été enregistrée. Veuillez imprimer cette page comme confirmation',
    error: 'Un erreur est survenue, veuillez réessayer plus tard',
    registeredLocations: 'Vos endroits'
}];

var errorMessages = [{    
    required: "This field is required.",
    remote: "Please fix this field.",
    email: "Please enter a valid email address.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    digits: "Please enter only digits.",
    equalTo: "Please enter the same value again.",
    maxlength: $.validator.format( "Please enter no more than {0} characters." ),
    minlength: $.validator.format( "Please enter at least {0} characters." ),
    rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
    range: $.validator.format( "Please enter a value between {0} and {1}." ),
    max: $.validator.format( "Please enter a value less than or equal to {0}." ),
    min: $.validator.format( "Please enter a value greater than or equal to {0}." ),
    step: $.validator.format( "Please enter a multiple of {0}." )
    },
    {
	required: "Cet domaine est obligatoire",
	remote: "Veuillez corriger cet domaine",
	email: "Veuillez rentrer un valide couriel",
	url: "Veuillez rentrer une adresse valide URL",
	date: "Veuillez renttrer une date valide",
	dateISO: "Veuillez rentrer une date valide (ISO)",
	number: "Veuillez fournir un numéro valide.",
	digits: "Veuillez fournir seulement des chiffres.",	
	equalTo: "Veuillez fournir encore la même valeur.",	
	maxlength: $.validator.format( "Veuillez fournir au plus {0} caractères." ),
	minlength: $.validator.format( "Veuillez fournir au moins {0} caractères." ),
	rangelength: $.validator.format( "Veuillez fournir une valeur qui contient entre {0} et {1} caractères." ),
	range: $.validator.format( "Veuillez fournir une valeur entre {0} et {1}." ),
	max: $.validator.format( "Veuillez fournir une valeur inférieure ou égale à {0}." ),
	min: $.validator.format( "Veuillez fournir une valeur supérieure ou égale à {0}." )	
}];

// Initialize Firebase
var config = {
apiKey: "AIzaSyB6U7NOrwarwZp0cmuDHKJsISr_ZGqF9bA",
authDomain: "registration-form-b1863.firebaseapp.com",
databaseURL: "https://registration-form-b1863.firebaseio.com",
storageBucket: "registration-form-b1863.appspot.com",
messagingSenderId: "402584104810"
};
firebase.initializeApp(config);

var RegisterModel = function() {    
    var self=this;

    //Constants
    self.EN = 'en';
    self.FR = 'fr';
    self.REGISTER = 'register';
    self.SCHEDULE = 'schedule';
    self.STORAGEREGISTERLANG = 'register-lang';
    self.STORAGEREGISTERLOCATION = 'registered-locations';

    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    //Registration form fields
    this.name = ko.observable();    
    this.accountNumber = ko.observable();
    this.emailAddress = ko.observable();
    this.guests = ko.observable(1);
    this.location = ko.observable();
    this.success = ko.observable(false);
    this.error = ko.observable(false);
    this.inProgress = ko.observable(false);

    //Support for local localStorage
    this.isLocalStorage = Modernizr.localstorage;
    
    this.selectedLanguage = ko.observable();
    this.selectedSection = ko.observable(self.REGISTER);
    this.selectedLocation = ko.observable();
    this.language = ko.observable(languages[0]);
    this.locations = ko.observableArray(showLocations);
    this.registeredLocations = ko.observableArray();

    this.title = ko.computed(function() {
        var result = "";
        if(self.selectedSection() == self.REGISTER) {
            result = self.language().register;
        } else if(self.selectedSection() == self.SCHEDULE) {
            result = self.language().schedule;
        }
        return result;        
    });

    //Remove success message if user changes location
    self.selectedLocation.subscribe(function(newValue) {
        self.success(false);
    });

    this.init = function() {
        //Retrieve saved language if localStorage supported else default to english                
        var lang = self.isLocalStorage === true ? localStorage.getItem(self.STORAGEREGISTERLANG) : self.EN;
        switch (lang) {
            case self.FR:
                self.setFrench();
                break;            
            default:
                self.setEnglish();
                break;
        }

        self.selectedLocation(self.locations()[0]);

        //Display registered locations from localstorage if supported
        self.updateRegisteredShows();
    };

    this.updateRegisteredShows= function() {
        if (self.isLocalStorage) {
            var locations = JSON.parse(localStorage.getItem(self.STORAGEREGISTERLOCATION));
            var registeredLocations = self.findLocations(locations);
            self.registeredLocations(registeredLocations);
        }
    };

    this.findLocations = function(names) {
        var locations = [];        
        for(var i=0; i<self.locations().length; i++) {
            var index = $.inArray(self.locations()[i].location, names);
            if(index != -1) {
                locations.push(self.locations()[i]);
            }
        }

        return locations;
    };

    this.findLang = function(lang) {
        var foundLang = undefined;
        for(var i=0; i<languages.length; i++) {
            if (languages[i].lang === lang) {
                foundLang = languages[i];
                break;
            }
        }
        return (foundLang === undefined) ? languages[0] : foundLang;
    };
    
    this.setEnglish = function() {

        //Save in local storage if supported
        if(self.isLocalStorage) {
            localStorage.setItem(self.STORAGEREGISTERLANG, self.EN);
        }

        //Find lang
        var lang = self.findLang(self.EN);
        self.selectedLanguage(self.EN);

        //Update language observable with translations
        self.language(lang);        
        $.extend( $.validator.messages, errorMessages[0]);        
    };

    this.setFrench = function() {

        //Save in local storage if supported
        if(self.isLocalStorage) {
            localStorage.setItem(self.STORAGEREGISTERLANG, self.FR);
        }        

        //Find lang
        var lang = self.findLang(self.FR);
        self.selectedLanguage(self.FR);

        //Update language observable with translations
        self.language(lang);
        $.extend( $.validator.messages, errorMessages[1]);
    };

    this.selectRegister = function() {
        self.selectedSection(self.REGISTER);
    };
    this.selectSchedule = function() {
        self.selectedSection(self.SCHEDULE);
    };

    this.toEmail = function() {        
        return {
            Name: self.name(),
            'Email Address': self.emailAddress(),
            'Account Number': self.accountNumber(),
            Location: self.selectedLocation().location,
            guests: self.guests()
        };
    };

    this.send = function() {
        //Validate form
        if (!$('#registration-form').valid()) {
            return;
        }
        
        if(self.selectedLocation()) {

            //If localstorage supported saved registered locations
            if(self.isLocalStorage) {
                var locations;
                var dbLocations = localStorage.getItem(self.STORAGEREGISTERLOCATION);

                if(dbLocations === null) {
                    locations = [];
                } else {
                    locations = JSON.parse(dbLocations);
                }
                
                locations.push(self.selectedLocation().location);
                localStorage.setItem(self.STORAGEREGISTERLOCATION, JSON.stringify(locations));
            }
            
            //Remove success and errors from previous registrations
            self.success(false);
            self.error(false);
            self.inProgress(true);

            //Make ajax call to send email to the office
            $.ajax({
                url: 'https://formspree.io/anya.pukhlenko@shadeomatic.ca',
                method: 'POST',
                data: self.toEmail(),
                dataType: 'json'
            }).success(function() {
                self.success(true);
                self.updateRegisteredShows();
            }).error(function() {
                self.error(true);
            }).complete(function() {

                //Save to firebase
                try {                    
                    var database = firebase.database();                    
                    database.ref('register').push(self.toEmail());                    
                } catch (error) {
                    console.log(error);
                }

                //Clean up tasks
                self.inProgress(false);
                self.name('');                
                self.emailAddress('');
                self.accountNumber('');
                self.guests(1);                
            });
        }
    };

    self.init();
};

ko.applyBindings(new RegisterModel());