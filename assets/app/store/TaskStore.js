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


    //讀取資料來源
    //this.url = data.js 參考 assets/data.js，在這可以替換為從後端 server 取得初始資料
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

    // 取得甘特圖操作後的資料並且將資料送交指定網址
    saveDataSet : function () {

        //getModifiedRecords() -> 屬於 Ext.data.TreeStore 的函式，新增或修改的資料可透過此函式取得
        //getRemovedRecords() -> 屬於 Ext.data.AbstractStore 的函式，若要取得刪除的 dependencies 或 task 可用此函式

        var resources = this.resourceStore.getModifiedRecords();
        var assignments = this.assignmentStore.getModifiedRecords();
        var dependencies = this.dependencyStore.getModifiedRecords();
        var tasks = this.getModifiedRecords();

        //將資料一一存為陣列
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


        // 由後端進行資料儲存
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

    //從後端取得資料後，一一將資料 load 到對應的 store
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
