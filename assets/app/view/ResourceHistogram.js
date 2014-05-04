Ext.define('MyApp.view.ResourceHistogram', {
    extend          : 'Gnt.panel.ResourceHistogram',
    alias           : 'widget.resourcehistogram',

    title           : 'RESOURCE UTILIZATION',
    viewPreset      : 'weekAndDayLetter',
    hideHeaders     : true,
    hidden          : true,
    flex            : 1,
    rowHeight       : 60,

    scaleStep       : 1,
    scaleLabelStep  : 4,
    scaleMin        : 0,
    scaleMax        : 8,

    initComponent : function () {
        Ext.apply(this, {
            columns : [
                {
                    tdCls     : 'histogram-icon',
                    width     : 50,
                    renderer  : function (val, meta, rec) {
                        meta.tdCls = 'icon-' + rec.data.Type;
                    }
                },
                {
                    flex      : 1,
                    tdCls     : 'histogram-name',
                    dataIndex : 'Name'
                },
                {
                    xtype           : 'scalecolumn'
                }
            ]
        });

        this.tipCfg = { cls : 'bartip' };

        var me = this;

        this.tooltipTpl = new Ext.XTemplate(
            '<tpl for=".">',
                'Resource: <strong>{resource.data.Name}</strong>',
                '<dl>' +
                    '<dt>Start:</dt> <dd>{[Ext.Date.format(values.startDate, "y-m-d")]}</dd>',
                    '<dt>End:</dt> <dd>{[Ext.Date.format(values.endDate, "y-m-d")]}</dd>',
                    '<dt>Utilization %:</dt><dd>{totalAllocation}%</dd>',
                    '<dt>Utilization (hrs):</dt><dd>{[ Math.round(this.getHours(values.allocationMS)) ]}</dd>',
                '</dl>',
            '</tpl>',
            {
                getHours : function (ms) {
                    return me.calendar.convertMSDurationToUnit(ms, 'HOUR');
                }
            }
        );

        this.callParent(arguments);
    }

});