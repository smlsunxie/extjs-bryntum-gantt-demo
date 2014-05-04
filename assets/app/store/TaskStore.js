Ext.define("MyApp.store.TaskStore", {
    extend      : 'Gnt.data.TaskStore',
    rootVisible : true,
    proxy       : 'memory',

    constructor : function (config) {
        config.calendar = new Gnt.data.calendar.BusinessTime({
            calendarId : "Default",
            name       : "Default"
        });

        this.callParent(arguments);
    },

    loadDataSet : function () {
        Ext.Ajax.request({
            url      : this.url,
            method   : 'GET',
            success  : this.populateDataStores,
            callback : function () {
                this.fireEvent('load');
            },
            scope    : this
        });
    },

    saveDataSet : function () {

        var resources = this.resourceStore.getModifiedRecords();
        var assignments = this.assignmentStore.getModifiedRecords();
        var dependencies = this.dependencyStore.getModifiedRecords();
        var tasks = this.getModifiedRecords();

        console.log(this.dependencyStore);

        function extract(records) {
            var result = [];

            Ext.each(records, function(record) {
                result.push(record.data);
            });

            return result;
        }

        var data = {
            resources    : extract(resources),
            assignments  : extract(assignments),
            dependencies : extract(dependencies),
            tasks        : extract(tasks)
        };

        Ext.Ajax.request({
            url      : "/gantt/save",
            method   : 'POST',
            jsonData : data,

            callback : function () {
                this.fireEvent('save');
            },
            scope    : this
        })
    },

    populateDataStores : function (response, options) {
        var data = Ext.decode(response.responseText);

        if (data.calendars && data.calendars["default"]) {
            this.calendar.loadData(data.calendars["default"]);
        }

        if (data.dependencies) {
            this.dependencyStore.loadData(data.dependencies);
        }

        if (data.assignments) {
            this.assignmentStore.loadData(data.assignments);
        }

        if (data.resources) {
            this.resourceStore.loadData(data.resources);
        }

        // Now all is in place, continue with tasks
        this.setRootNode(data);
    }
})
;
