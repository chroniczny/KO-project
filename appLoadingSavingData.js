'use strict';

$(function(){

    function Task(data) {
        this.title = ko.observable(data.title);
        this.isDone = ko.observable(data.isDone);
    }

    function TaskListViewModel() {
        // Data
        var self = this;
        self.tasks = ko.observableArray([]);
        self.newTaskText = ko.observable();
        self.incompleteTasks = ko.computed(function() {
            return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() && !task._destroy});
            // because not only done but also destroyed task we need to filter
        });

        // Operations
        self.addTask = function() {
            self.tasks.push(new Task({ title: this.newTaskText() }));
            self.newTaskText("");
        };
        // self.removeTask = function(task) { self.tasks.remove(task) };
        self.removeTask = function(task) { self.tasks.destroy(task) }; // we know what happened:
        /* it no longer actually removes Task instances from the tasks array - instead,
         it simply adds a _destroy property to the Task instances with value true.
         This exactly matches the Ruby on Rails convention of using _destroy
         to indicate that a submitted item should be deleted.
         The foreach binding is aware of this, and won't display
         any item with that property value (which is why items disappear when destroyed).*/


// Load initial state from server, convert it to Task instances, then populate self.tasks
        $.getJSON("/tasks", function(allData) {
            var mappedTasks = $.map(allData, function(item) { return new Task(item) });
            self.tasks(mappedTasks);
        });

        self.save = function() {
            $.ajax("/tasks", {
                data: ko.toJSON({ tasks: self.tasks }),
                type: "post",
                contentType: "application/json",
                success: function(result) { alert(result) }
            });
        };
    }

    ko.applyBindings(new TaskListViewModel());

});

