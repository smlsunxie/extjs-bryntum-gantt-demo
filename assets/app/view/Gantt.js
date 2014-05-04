Ext.define("MyApp.view.Gantt", {
    extend              : 'Gnt.panel.Gantt',
    alias               : 'widget.gantt',

    // Ext JS configs
    requires            : [
        'MyApp.store.TaskStore',
        'MyApp.view.GanttToolbar'
    ],

    flex                : 1,
    title               : 'GANTT CHART',
    lockedGridConfig    : { width : 300 },
    loadMask            : true,

    // Gantt configs
    leftLabelField      : 'Name',
    highlightWeekends   : true,
    viewPreset          : 'weekAndDayLetter',
    columnLines         : true,
    cascadeChanges      : true,

    initComponent : function() {
        var me = this;

        Ext.apply(this, {
            tipCfg : { cls : 'tasktip' },

            // Define an HTML template for the tooltip
            tooltipTpl : new Ext.XTemplate(
                '<strong>#{Id} {Name}</strong>',
                '<dl>' +
                    '<dt>Start:</dt> <dd>{[values._record.getDisplayStartDate("y-m-d")]}</dd>',
                    '<dt>End:</dt> <dd>{[values._record.getDisplayEndDate("y-m-d")]}</dd>',
                    '<dt>Progress:</dt><dd>{[Math.round(values.PercentDone)]}%</dd>',
                '</dl>'
            ),

            tbar : {
                xtype : 'gantttoolbar',
                gantt : this
            },

            viewConfig : {
                getRowClass : function(record) {
                    // Output a custom CSS class with some task property that we can use for styling
                    return 'TASKID_' + record.data.Id;
                }
            },

            // Setup your static columns
            columns : [
                {
                    xtype       : 'namecolumn',
                    tdCls       : 'namecell',
                    width       : 200
                },
                {
                    header      : 'Assigned Resources',
                    width       : 150,
                    tdCls       : 'resourcecell',
                    xtype       : 'resourceassignmentcolumn'
                },
                {
                    xtype       : 'startdatecolumn'
                },
                {
                    xtype       : 'durationcolumn'
                },
                {
                    xtype       : 'predecessorcolumn'
                }
            ],
            plugins : [
                new Gnt.plugin.TaskEditor(),
                new Sch.plugin.TreeCellEditing({ }),
                new Gnt.plugin.TaskContextMenu({ })
            ]
        });

        this.callParent(arguments);
        this.on('afterlayout', this.triggerLoad, this, { single : true, delay : 100 });
        this.taskStore.on('load', function() { this.body.unmask(); }, this);
    },

    triggerLoad : function() {
        this.body.mask('Loading...', '.x-mask-loading');

        this.taskStore.loadDataSet();
    }
});
