'use strict';

function WebmailViewModel() {
    // Data
    var self = this;
    self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
    self.chosenFolderId = ko.observable();
    self.chosenFolderData = ko.observable();
    self.chosenMailData = ko.observable();

    //---first way
    // self.goToFolder = function (folder) {
    //     self.chosenFolderId(folder);
    //     self.chosenMailData(null); // Stop showing a mail
    //     $.get('/mail', { folder: folder }, self.chosenFolderData);
    // };

    // self.goToMail = function (mail) {
    //     self.chosenFolderId(mail.folder);
    //     self.chosenFolderData(null); // Stop showing a folder
    //     $.get("/mail", { mailId: mail.id }, self.chosenMailData);
    // };
    //// Show inbox by default
    // self.goToFolder('Inbox');


    //---second way
    self.goToFolder = function (folder) {
        location.hash = folder;
    };

    self.goToMail = function (mail) {
        location.hash = mail.folder + '/' + mail.id;
    };

    // Client-side routes
    Sammy(function() {
        this.get('#:folder', function() {
            self.chosenFolderId(this.params.folder);
            self.chosenMailData(null);
            $.get("/data", {folder: this.params.folder}, self.chosenFolderData); // use JSON please...
        });

        this.get('#:folder/:mailId', function() {
            self.chosenFolderId(this.params.folder);
            self.chosenFolderData(null);
            $.get("/data", {mailId: this.params.mailId}, self.chosenMailData); // use JSON please...
        });

        this.get('', function() { this.app.runRoute('get', '#Inbox') }); //the empty client-side URL will be treated the same as #Inbox
    }).run();

}

ko.applyBindings(new WebmailViewModel());
