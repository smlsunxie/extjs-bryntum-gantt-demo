Ext.define("MyApp.view.Viewport", {
    extend                  : 'Ext.Viewport',
    layout                  : 'border',
    requires                : [
        'MyApp.view.ResourceSchedule',
        'MyApp.view.Gantt',
        'MyApp.view.ResourceList',
        'MyApp.view.ResourceHistogram',
        'MyApp.model.Resource'
    ],

    initComponent : function() {
        var resourceStore = this.resourceStore = new Gnt.data.ResourceStore({
            model       : 'MyApp.model.Resource',
            groupField  : 'Type'
        });

        var dependencyStore = new Gnt.data.DependencyStore();
        var assignmentStore = this.assignmentStore = new Gnt.data.AssignmentStore({
            resourceStore : resourceStore
        });

        var taskStore = this.taskStore = new MyApp.store.TaskStore({
            dependencyStore : dependencyStore,
            resourceStore   : resourceStore,
            assignmentStore : assignmentStore,
            url             : 'data.js'     // Some dummy data
        });

        this.gantt = new MyApp.view.Gantt({
            id              : 'ganttchart',
            startDate       : new Date(2010, 0, 11),
            taskStore       : taskStore
        });

        Ext.apply(this, {
            items : [
                {
                    xtype : 'navigation',
                    id    : 'navigation'
                },
                {
                    xtype   : 'container',
                    itemId  : 'maincontainer',
                    region  : 'center',
                    layout  : { type : 'vbox', align : 'stretch' },
                    items   : this.gantt
                },
                {
                    xtype : 'settings'
                }
            ]
        });

        this.callParent(arguments);
    }
});