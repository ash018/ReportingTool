function CreateTable(jsondata, container, baseDate)
{

    if( container == "htmlDiv_inventory_qualified_itemsbyuser" || container == "htmlDiv_inventory_quantity_receivedbyuser" )
    {
        var thid = '#' + container + ' thead';
        $(thid).html("");

        //var header = "<tr><th>Employee</th><th>Qualified</th><th>Value</th><th>Date</th></tr>";
        var header = "<tr><th class='col-xs-3'>Employee</th><th class='col-xs-3'>Qualified</th><th class='col-xs-3'>Value</th></tr>";
        $(thid).append(header);

        var tbid = '#' + container + ' tbody';
        $(tbid).html("");

        for (var i = 0; i < jsondata.length; i++)
        {
            //var row = '<tr><td>' + jsondata[i].user + '</td><td>' + jsondata[i].value1 + '</td><td>$' + jsondata[i].value2 + '</td><td>' + jsondata[i].year + '</td><tr>';
            var row = "<tr><td  class='col-xs-3'>" + jsondata[i].year + "</td><td class='col-xs-3'>" + jsondata[i].value1 + "</td><td class='col-xs-3'>$" + jsondata[i].value2 + "</td><tr>";
            $(tbid).append(row);
        }

    }
    else if(container == "htmlDiv_top_commodities_received")
    {
        //var thid = '#' + container + ' thead';
        //$(thid).html("");
        //var header = "<tr><th>Commodity</th><th>Pallet Count</th><th>Net Weight</th></tr>";
        //$(thid).append(header);

        //var seenNames = {};
        //jsondata = jsondata.filter(function(currentObject) {
        //    if (currentObject.year in seenNames || currentObject.year == "") {
        //        return false;
        //    } else {
        //        seenNames[currentObject.year] = true;
        //        return true;
        //    }
        //});

        //start dataTable initializing here. Because dataTable works only after the table has <thead> attribute. First check if its a dataTable
        //if ( $.fn.dataTable.isDataTable( '#' + container ) )
        //{
        //    alert("Already exits.");
        //}
        //else
        //{

        //}

        //if(dTable != null)
        //{
        //    console.log("Destrying datatable");
        //    dTable.destroy();
        //}

        //If existing datatable is found by this name, then destroy it
        //dTable.clear().draw();


        var thid = '#' + container + ' thead';
        $(thid).html("");
        //var header = "<tr><th onclick=\"sortTable(0, \'" + container + "\')\">Commodity <i class=\'fa fa-sort\' aria-hidden=\'true\'></i> </th><th onclick=\"sortTable(1, \'" + container + "\')\">Pallet Count <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th><th onclick=\"sortTable(2, \'" + container + "\')\">Net Weight <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th></tr>";
        var header = "<tr><th>Commodity <i class=\'fa fa-sort\' aria-hidden=\'true\'></i> </th><th>Pallet Count <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th><th>Net Weight <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th></tr>";
        $(thid).append(header);

        var tbid = '#' + container + ' tbody';
        $(tbid).html("");
        for (var i = 0; i < jsondata.length; i++)
        {
            var row = '<tr><td>' + jsondata[i].year + '</td><td>' + jsondata[i].value1 + '</td><td>' + jsondata[i].value2 + '</td></tr>';
            $(tbid).append(row);
        }
        //$("table.tableSection th, table.tableSection td").css({"width": "33%"});
        //$.getScript("/Content/js/sorttable.js");
        $.getScript("http://w2k8appdev17.razor.lan/dashboard/Content/js/sorttable.js");

    }
    else if(container == "htmlDiv_inbound_order_metrics")
    {
        var thid = '#' + container + ' thead';
        $(thid).html("");

        console.log("Todays Date = " + baseDate);
        var inboundOrders = [], TOTALKPIS = 10;
        baseDate = (typeof baseDate !== 'undefined') ?  baseDate : null;

        for(var i = 0; i < jsondata.length; i++)
        {
            var obj = jsondata[i];
            if(String(obj.year) == baseDate)
            {
                var temp = {'kpi': 'Order Id', 'today': obj.value1, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Order Quantity Items', 'today': obj.value2, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Inbound Orders', 'today': obj.value3, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Outbound Orders', 'today': obj.value4, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Inbound Weight Received', 'today': obj.value5, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Outbound Weight Shipped', 'today': obj.value6, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Order Value', 'today': obj.value7, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Weight Received', 'today': obj.value8, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Order Weight Consumed', 'today': obj.value9, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
                temp = {'kpi': 'Order Weight Shipped', 'today': obj.value10, 'thisWeek':0, 'thisMonth': 0};
                inboundOrders.push(temp);
            }
        }

        var firstDayOfThisWeek = String(getFirstDayOfWeek(new Date(baseDate)).toISOString().split('T')[0]);     //this will give us the last Monday Date
        console.log("First Monday of baseDate = " + firstDayOfThisWeek);
        var startLooping = false;
        var weeklySum = [], count = 0;
        for(var i=0; i<TOTALKPIS; i++)
        {
            weeklySum[i] = 0;
        }
        for(var i = 0; i < jsondata.length; i++)
        {
            var obj = jsondata[i];
            if(String(obj.year) == firstDayOfThisWeek)
                startLooping = true;

            if(startLooping)
            {
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value1);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value2);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value3);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value4);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value5);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value6);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value7);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value8);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value9);
                count++;
                weeklySum[count] = weeklySum[count] + parseFloat(jsondata[i].value10);
                count=0;
            }
        }
        for(var i=0; i<TOTALKPIS; i++)
        {
            inboundOrders[i].thisWeek = weeklySum[i];
        }

        var firstDayOfMonth = String(getFirstDayOfMonth(new Date(baseDate)).toISOString().split('T')[0]);     //this will give us the first day of a month
        console.log("First Day of Month = " + firstDayOfMonth);
        startLooping = false;
        count = 0;
        var monthlySum = [];
        for(var i=0; i<TOTALKPIS; i++)
        {
            monthlySum[i] = 0;
        }
        for(var i = 0; i < jsondata.length; i++)
        {
            var obj = jsondata[i];
            if(String(obj.year) == firstDayOfMonth)
                startLooping = true;

            if(startLooping)
            {
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value1);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value2);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value3);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value4);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value5);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value6);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value7);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value8);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value9);
                count++;
                monthlySum[count] = monthlySum[count] + parseFloat(jsondata[i].value10);
                count=0;
            }
        }
        for(var i=0; i<TOTALKPIS; i++)
        {
            inboundOrders[i].thisMonth = monthlySum[i];
        }

        //var thid = '#' + container + ' thead';
        //$(thid).html("");
        //var header = "<tr><th>Order KPI</th><th>Today</th><th>This Week</th><th>This Month</th></tr>";
        //$(thid).append(header);
        ////start dataTable initializing here. Because dataTable works only after the table has <thead> attribute
        //var dTable  = $('#' + container).DataTable({
        //    "paging": false,
        //    "ordering": true,
        //    "info": false,
        //    "bFilter": false});

        //var tbid = '#' + container + ' tbody';
        //$(tbid).html("");
        //for (var i = 0; i < inboundOrders.length; i++)
        //{
        //    dTable.row.add([inboundOrders[i].kpi, parseFloat(inboundOrders[i].today).toFixed(2), parseFloat(inboundOrders[i].thisWeek).toFixed(2),  parseFloat(inboundOrders[i].thisMonth).toFixed(2)]).draw();
        //    //var row = '<tr><td>' + inboundOrders[i].kpi + '</td><td>' + parseFloat(inboundOrders[i].today).toFixed(2) + '</td><td>' + parseFloat(inboundOrders[i].thisWeek).toFixed(2) + '</td><td>' + parseFloat(inboundOrders[i].thisMonth).toFixed(2) + '</td><tr>';
        //    //$(tbid).append(row);
        //}






        var thid = '#' + container + ' thead';
        $(thid).html("");
        //var header = "<tr><th onclick=\"sortTable(0, \'" + container + "\')\">Order KPI <i class=\'fa fa-sort\' aria-hidden=\'true\'></i> </th><th onclick=\"sortTable(1, \'" + container + "\')\">Today <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th><th onclick=\"sortTable(2, \'" + container + "\')\">This Week <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th><th onclick=\"sortTable(3, \'" + container + "\')\">This Month <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th></tr>";
        var header = "<tr><th>Order KPI <i class=\'fa fa-sort\' aria-hidden=\'true\'></i> </th><th>Today <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th><th>This Week <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th><th>This Month <i class=\'fa fa-sort\' aria-hidden=\'true\'></i></th></tr>";
        $(thid).append(header);

        var tbid = '#' + container + ' tbody';
        $(tbid).html("");
        for (var i = 0; i < inboundOrders.length; i++)
        {
            var row = '<tr><td>' + inboundOrders[i].kpi + '</td><td>' + parseFloat(inboundOrders[i].today).toFixed(2) + '</td><td>' + parseFloat(inboundOrders[i].thisWeek).toFixed(2) + '</td><td>' + parseFloat(inboundOrders[i].thisMonth).toFixed(2) + '</td></tr>';
            $(tbid).append(row);
        }

        //$.getScript("/Content/js/sorttable.js");
        $.getScript("http://w2k8appdev17.razor.lan/dashboard/Content/js/sorttable.js");

    }

}

//function getFirstDayOfWeek( date ) {
//    var day = date.getDay() || 7;
//    if( day !== 1 )
//        date.setHours(-24 * (day - 1));
//    return date;
//}

function getFirstDayOfWeek(date) {
    //d = new Date(d);
    //var day = d.getDay(),
    //    diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    //return new Date(d.setDate(diff));
    var day = date.getDay() || 7;
    if( day !== 1 )
        date.setHours(-24 * (day - 1));
    return date;
}


function getFirstDayOfMonth(d)
{
    var first_day = new Date(d.getFullYear(), d.getMonth(), 1);
    return first_day;
}


function sortTable(n, containerId)
{
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(containerId);
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("tr");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function AMBarChartSingleMetric(jsondata, container, categoryAxisMinPeriod, kpi1, axisXLabel, axisYLabel)
{
    if (typeof (categoryAxisMinPeriod) == 'undefined') categoryAxisMinPeriod = "DD";
    if (typeof (kpi1) == 'undefined') kpi1 = "Revenue";
    if (typeof (axisYLabel) == 'undefined') axisYLabel = "Revenue in US$";
    if (typeof (axisXLabel) == 'undefined') axisXLabel = "time";

    var chartDiv = AmCharts.makeChart(container, {
        type: "serial",
        addClassNames: true,
        theme: "light",
        marginRight: 0,
        marginLeft: 0,
        dataProvider: jsondata,
        dataDateFormat: "YYYY-MM-DD",
        valueAxes: [{
            axisAlpha: 0.2,
            dashLength: 1,
            position: "left",
            title: axisYLabel
        }],
        mouseWheelZoomEnabled: false,
        graphs: [{
            id: "g1",
            //balloonText: "[[category]]<br><b>" + kpi1 + ": <span style='font-size:14px;'>[[value]]</span></b>",
            balloonFunction: function (item) {
                var data = item.dataContext;
                if (data.value == MAGICFIGURE)
                    return data.time + "<br><b>" + kpi1 + ": <span style='font-size:14px;'>0</span></b>";
                else
                    return data.time + "<br><b>" + kpi1 + ": <span style='font-size:14px;'>" + data.value + "</span></b>";
            },
            //bullet: "round",
            //bulletSize: 4,
            fillAlphas: 1,
            title: "Counts",
            type: "column",
            fillColors: "#44B8E3",
            lineAlpha: 0.2,
            valueField: "value"
        }],
        /*chartScrollbar: {
            graph: "g1",
            gridAlpha: 0,
            color: "#888888",
            scrollbarHeight: 55,
            backgroundAlpha: 0,
            selectedBackgroundAlpha: 0.1,
            selectedBackgroundColor: "#888888",
            graphFillAlpha: 0,
            autoGridCount: true,
            selectedGraphFillAlpha: 0,
            graphLineAlpha: 0.2,
            graphLineColor: "#c2c2c2",
            selectedGraphLineColor: "#289eaf",
            selectedGraphLineAlpha: 1

        },*/

        chartCursor: {
            categoryBalloonDateFormat: "YYYY-MM-DD",
            cursorAlpha: 0,
            valueLineEnabled: true,
            valueLineBalloonEnabled: true,
            valueLineAlpha: 0.5,
            fullWidth: true

        },
        categoryField: "time",
        categoryAxis: {
            minPeriod : categoryAxisMinPeriod,
            //parseDates: true,
            labelRotation: 90,
            gridPosition: "start",
            axisAlpha: 0,
            tickLength: 0,
            title: axisXLabel
        },
        "columnSpacing": 0,
        export: {
            enabled: true
        }
    });
}

    function AMBarLineChartDoubleMetric(jsondata, container, categoryAxisMinPeriod, kpi1, kpi2, axisXLabel, axisYLabel)
    {
        if (typeof (categoryAxisMinPeriod) === 'undefined') categoryAxisMinPeriod = "DD";
        if (typeof (kpi1) === 'undefined') kpi1 = "Revenue";
        if (typeof (kpi2) === 'undefined') kpi2 = "Cost";
        if (typeof (axisYLabel) === 'undefined') axisYLabel = "Revenue in US$";
        if (typeof (axisXLabel) === 'undefined') axisXLabel = "time";

        var chartDiv = AmCharts.makeChart(container, {
            type: "serial",
            addClassNames: true,
            theme: "light",
            marginRight: 0,
            marginLeft: 0,
            dataProvider: jsondata,
            dataDateFormat: "YYYY-MM-DD",
            valueAxes: [{
                axisAlpha: 0.2,
                dashLength: 1,
                position: "left",
                title: axisYLabel
            }],
            startDuration: 1,
            mouseWheelZoomEnabled: false,
            balloon: {
                adjustBorderColor: true,
                color: "#000000",
                cornerRadius: 5,
                fillColor: "#F6F6F6"
            },
            graphs: [{
                alphaField: "alpha",
                //balloonText: "<span style='font-size:11px;'>[[title]] in [[category]]:<br><span style='font-size:15px;'>[[value]]</span> [[additional]]</span>",
                //balloonText: kpi2 + ": [[value2]]",
                showBalloon: false,
                fillAlphas: 1,
                title: kpi2,
                type: "column",
                valueField: "value2",
                dashLengthField: "dashLengthColumn",
                lineAlpha: 0.2,
                fillColors: "#CC6FF2"
            }, {
                id: "graph2",
                //balloonText: "<span style='font-size:11px;'>[[title]] in [[category]]:<br><span style='font-size:15px;'>[[value]]</span> [[additional]]</span>",
                //balloonText: kpi1 + ": [[value1]]",
                balloonFunction: function (item) {
                    var data = item.dataContext;
                    if (data.value1 == MAGICFIGURE)
                        return kpi1 + ":<b>0</b><br>" + kpi2 + ":<b>" + data.value2 + "</b>";
                    else if(data.value2 == MAGICFIGURE)
                        return kpi1 + ":<b>" + data.value1 + "</b><br>" + kpi2 + ":<b>0</b>";
                    else
                        return kpi1 + ":<b>" + data.value1 + "</b><br>" + kpi2 + ":<b>" + data.value2 + "</b>";
                },
                bullet: "round",
                lineThickness: 2,
                bulletSize: 2,
                bulletBorderAlpha: 0.5,
                bulletColor: "#FFFFFF",
                useLineColorForBulletBorder: true,
                bulletBorderThickness: 1,
                fillAlphas: 0,
                lineAlpha: 1,
                title: kpi1,
                valueField: "value1",
                dashLengthField: "dashLengthLine",
                lineColor: "#B5E01A"
            }],

            chartCursor: {
                categoryBalloonDateFormat: "YYYY-MM-DD",
                valueLineEnabled: true,
                valueLineBalloonEnabled: true,
                cursorAlpha: 0,
                zoomable: false,
                valueZoomable: true,
                valueLineAlpha: 0.5
            },
            categoryField: "year",
            categoryAxis: {
                parseDates: true,
                gridPosition: "start",
                axisAlpha: 0,
                tickLength: 0,
                title: axisXLabel
            },
            export: {
                enabled: true
            },
            legend: {
                autoMargins: false,
                borderAlpha: 0,
                equalWidths: false,
                horizontalGap: 6,
                markerSize: 6,
                useGraphSettings: true,
                marginTop: -5,
                valueAlign: "left",
                valueWidth: 0,
                valueText: ''
            }
        });
    }



    function AMBarLineChartTrippleMetric(jsondata, container, categoryAxisMinPeriod, kpi1, kpi2, kpi3, axisXLabel, axisYLabel)
    {
        if (typeof (categoryAxisMinPeriod) == 'undefined') categoryAxisMinPeriod = "DD";
        if (typeof(kpi1)==='undefined') kpi1 = "Revenue";
        if (typeof(kpi2)==='undefined') kpi2 = "Cost";
        if (typeof (kpi3) === 'undefined') kpi3 = "Profit";
        if (typeof (axisYLabel) === 'undefined') axisYLabel = "Revenue in US$";
        if (typeof (axisXLabel) === 'undefined') axisXLabel = "time";

        var chartDiv = AmCharts.makeChart(container, {
            type: "serial",
            addClassNames: true,
            theme: "light",
            marginRight: 0,
            marginLeft: 0,
            dataProvider: jsondata,
            dataDateFormat: "YYYY-MM-DD",
            valueAxes: [{
                axisAlpha: 0.2,
                dashLength: 1,
                position: "left",
                title: axisYLabel
            }],
            startDuration: 1,

            mouseWheelZoomEnabled: false,

            balloon: {
                adjustBorderColor: true,
                color: "#000000",
                cornerRadius: 5,
                fillColor: "#F6F6F6"
            },

            graphs: [{
                //balloonFunction: function (item) {
                //    var data = item.dataContext;
                //    if (data.value == 1121.91)
                //        return "high:<b>" + 0 + "</b>";
                //},
                showBalloon: false,

                alphaField: "alpha",
                //balloonText: kpi1 + ": [[value1]]",
                fillAlphas: 1,
                id: "AmGraph-1",
                title: kpi1,
                type: "column",
                valueField: "value1",
                lineAlpha: 0.2,
                dashLengthField: "dashLengthColumn",
                fillColors: "#44B8E3"
            },
            {
                showBalloon: false,
                //balloonText: kpi2 + ": [[value2]]",
                fillAlphas: 0.8,
                id: "AmGraph-2",
                lineAlpha: 0.2,
                title: kpi2,
                type: "column",
                valueField: "value2",
                lineAlpha: 0.2,
                fillColors: "#CC6FF2"
            }, {
                //showBalloon: false,
                balloonFunction: function (item) {
                    var data = item.dataContext;
                    if (data.value2 == MAGICFIGURE)
                        return kpi1 + ":<b>" + data.value1 + "</b><br>" + kpi2 + ":<b>0</b><br>" + kpi3 + ":<b>" + (data.value3 - DIFFERENCEFACTOR) + "</b>";
                    else if (data.value1 == MAGICFIGURE)
                        return kpi1 + ":<b>0</b><br>" + kpi2 + ":<b>" + data.value2 + "</b><br>" + kpi3 + ":<b>" + (data.value3 - DIFFERENCEFACTOR) + "</b>";
                    else
                        return kpi1 + ":<b>" + data.value1 + "</b><br>" + kpi2 + ":<b>" + data.value2 + "</b><br>" + kpi3 + ":<b>" + (data.value3 - DIFFERENCEFACTOR) + "</b>";
                },
                //balloonText: kpi1 + ":<b>[[value1]]</b><br>" + kpi2 + ":<b>[[value2]]</b><br>" + kpi3 + ":<b>[[value3]]</b>",
                id: "graph2",
                //balloonText: kpi3 + ": [[value3]]",
                bullet: "round",
                lineThickness: 2,
                bulletSize: 2,
                bulletBorderAlpha: 0.5,
                bulletColor: "#FFFFFF",
                useLineColorForBulletBorder: true,
                bulletBorderThickness: 1,
                fillAlphas: 0,
                lineAlpha: 1,
                title: kpi3,
                valueField: "value3",
                dashLengthField: "dashLengthLine",
                lineColor: "#B5E01A"
            }],

            chartCursor: {
                //categoryBalloonEnabled: false,
                categoryBalloonDateFormat: "YYYY-MM-DD",
                valueLineEnabled: false,
                valueLineBalloonEnabled: true,
                cursorAlpha: 0,
                zoomable: false,
                valueZoomable: true,
                valueLineAlpha: 0.5
            },
            categoryField: "year",
            categoryAxis: {
                parseDates: true,
                gridPosition: "start",
                axisAlpha: 0,
                tickLength: 0,
                title: axisXLabel
            },
            export: {
                "enabled": true
            },
            legend: {
                autoMargins: false,
                borderAlpha: 0,
                equalWidths: false,
                horizontalGap: 6,
                markerSize: 6,
                useGraphSettings: true,
                valueAlign: "left",
                valueWidth: 0,
                valueText: ''
            }
        });
    }


    function ShowMdxQuery(divId) {
        var x = document.getElementById(divId);
        if (x.style.display === 'none') {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    }



    function CreateReportTable(jsondata, container, columnHeaders)  //columnHeaders are coming from widget editor. Here, headers are coming as comma separated value
    {
        var thid = '#' + container + ' thead';
        $(thid).html("");
        var tableColumns = columnHeaders.split(",");
        var header = "<tr>";
        for (var i = 0; i < tableColumns.length; i++)
        {
            header += "<th>" + tableColumns[i] + "</th>";
        }
        header += "</tr>";
        $(thid).append(header);

        /*var seenNames = {};
        jsondata = jsondata.filter(function(currentObject) {
            if (currentObject.year in seenNames || currentObject.year == "") {
                return false;
            } else {
                seenNames[currentObject.year] = true;
                return true;
            }
        });*/


        /*var dTable  = $('#' + container).DataTable({
            retrieve: true,
            "paging": false,
            "ordering": true,
            "info": false,
            "bFilter": false});*/

        var tbid = '#' + container + ' tbody';
        $(tbid).html("");
        for (var i = 0; i < jsondata.length; i++)
        {
            /*var temp = [];
            var p = jsondata[i];
            for(var key in p)
            {
                if(p.hasOwnProperty(key))
                {
                    temp.push(p[key]);
                }
            }
            dTable.row.add(temp).draw();*/
            if (tableColumns.length == 3)
            {
                var row = '<tr><td>' + jsondata[i].year + '</td><td>' + jsondata[i].value1 + '</td><td>' + jsondata[i].value2 + '</td><tr>';
            }
            else if(tableColumns.length == 2)
            {
                var row = '<tr><td>' + jsondata[i].year + '</td><td>' + jsondata[i].value1 + '</td><tr>';
            }
            else if (tableColumns.length == 4)
            {
                var row = '<tr><td>' + jsondata[i].year + '</td><td>' + jsondata[i].value1 + '</td><td>' + jsondata[i].value2 + '</td><td>' + jsondata[i].value3 + '</td><tr>';
            }

            $(tbid).append(row);
        }

    }


    function AdjustDataAMBarLineChartTrippleMetric(cdata)
    {
        for (var i = 0; i < cdata.length; i++)
        {
            cdata[i].value3 = parseFloat(cdata[i].value1) - parseFloat(cdata[i].value2) + DIFFERENCEFACTOR;
            if (parseInt(cdata[i].value1) == 0)
            {
                console.log("Magic Figure Applied");
                cdata[i].value1 = MAGICFIGURE;
            }
            else if (parseInt(cdata[i].value2) == 0)
            {
                console.log("Magic Figure Applied");
                cdata[i].value2 = MAGICFIGURE;
            }
        }
        return cdata;
    }

    function AdjustDataAMBarChartSingleMetric(cdata)
    {
        for (var i = 0; i < cdata.length; i++)
        {
            if (parseInt(cdata[i].value) == 0)
            {
                console.log("Magic Figure Applied");
                cdata[i].value = MAGICFIGURE;
            }
        }
        return cdata;
    }

    function AdjustDataAMBarLineChartDoubleMetric(cdata) {
        for (var i = 0; i < cdata.length; i++)
        {
            if (parseInt(cdata[i].value1) == 0)
                cdata[i].value1 = MAGICFIGURE;
            if (parseInt(cdata[i].value2) == 0)
                cdata[i].value2 = MAGICFIGURE;
        }
        return cdata;
    }

