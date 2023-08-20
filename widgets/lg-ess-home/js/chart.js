"use strict";
var instance;

//Erzeugung: #ff0064, Direkter Verbrauch #abafd7, Laden: #bded71, Einspeisung: #f5c04d
var _colorGen = '#ff0064';
var _colorDirect = '#abafd7';
var _colorCharge  = '#bded71';
var _colorFeedIn = '#f5c04d';
var _colorSoc = '#ff8400';
var _colorPvForecast = '#000000'
var _pvForecast;

//Verbrauch: #ff0064, Direkter Verbrauch #abafd7, Entladen: #a3eded, Gekauft: #f08881
var _colorPur  = '#f08881';
var _colorDischarge = '#a3eded';
var _colorCons = '#ff0064';

var _widgetID;

function createChart(strChart, strChartType){
    const strPv = instance + '.user.graph.pv.' + strChart +'.val';
    const strLoad = instance + '.user.graph.load.' + strChart +'.val';
    const strBatt = instance + '.user.graph.batt.' + strChart +'.val';
    const strForecast = _pvForecast +'.val';
 
    const jsonPv = JSON.parse(vis.states[strPv]);
    const jsonBatt = JSON.parse(vis.states[strBatt]);
    const jsonLoad = JSON.parse(vis.states[strLoad]);
    const jsonForecast = JSON.parse(vis.states[strForecast]);
    
    /* Create Date string */
    var strTitle;
    if (strChart == 'year'){
        strTitle = convertFromStringToDate(jsonPv.m_timeFrom).toLocaleDateString([],{year: 'numeric'})
    }
    else if (strChart == 'month'){
        strTitle = convertFromStringToDate(jsonPv.m_timeFrom).toLocaleDateString([],{year: 'numeric',  month: 'long'})
    }
    else if ((strChart == 'day') || (strChart == 'week')){
        strTitle = convertFromStringToDate(jsonPv.m_timeFrom).toLocaleDateString([],{year: 'numeric',  month: '2-digit', day: '2-digit'})
    }
    if (strChart == 'week'){
        strTitle = strTitle  + " - " + convertFromStringToDate(jsonPv.m_timeTo).toLocaleDateString([],{year: 'numeric',  month: '2-digit', day: '2-digit'})
    }
    $(`#${_widgetID}-strDate`).text(strTitle);

    if ((jsonPv.db != "success")||(jsonBatt.db != "success")||(jsonLoad.db != "success")){
        $('.lg-ess-home-error').css({ 'display':'block' });
        $(`#${_widgetID}-strTotal`).html('');
        return;
    }
    $('.lg-ess-home-error').css({ 'display':'none' });


    if (strChartType == 'OverviewChart'){
        var charts = createOverviewCharts(strChart,jsonPv, jsonBatt,jsonLoad,jsonForecast);
        var chart1 = charts.chartGen;
        var chart2 = charts.chartPurch;
        $(`#${_widgetID}-strTotal`).html('');
        return {chart1,chart2};
    }
    else if (strChartType == 'PvChart'){
        var charts = createPvCharts(strChart,jsonPv);
        var chart1 = charts.chartPv;
        $(`#${_widgetID}-strTotal`).html(charts.footer);
        return {chart1};
    } 
    else if (strChartType == 'EssChart'){
        var charts = createEssCharts(strChart,jsonBatt);
        var chart1 = charts.chartEss;
        $(`#${_widgetID}-strTotal`).html(charts.footer);
        return {chart1};
    }
    else if (strChartType == 'LoadChart'){
        var charts = createLoadCharts(strChart, jsonLoad);
        var chart1 = charts.chartLoad;
        $(`#${_widgetID}-strTotal`).html(charts.footer);
        return {chart1};
    } 
}

function createOverviewCharts(strChart,jsonPv,jsonBatt,jsonLoad,jsonForecast){
    var chartType;
    var unit;
    var timeOptions;
    var factor;

    var today = new Date();
    var showForecast = (today.toDateString() == convertFromStringToDate(jsonPv.loginfo[0].time).toDateString()) && (strChart == 'day');

    if (!jsonForecast || !jsonForecast[0]  || !jsonForecast[0].t) {
        console.log('Forecast Data not valid');
        showForecast = false;
    }

    if (strChart == 'day'){
        chartType = 'line';
        unit = 'kW'
        timeOptions = { hour12: false, hour: '2-digit', minute:'2-digit'};
        factor = 0.004;
    }
    else if (strChart == 'week'){
        chartType = 'bar';
        unit = 'kWh';
        timeOptions = {weekday: 'short',  month: 'numeric', day: 'numeric'};
        factor = 0.001;
    }
    else if (strChart == 'year'){
        chartType = 'bar';
        unit = 'kWh';
        timeOptions = {year: 'numeric', month: 'long'};
        factor = 0.001;
    }
    else{
        chartType = 'bar';
        unit = 'kWh';
        timeOptions = {};
        factor = 0.001;
    }
    
    // Specify the configuration items and data for the chart
    var chartGen = createBasicChart(unit);
    chartGen.series.push({
        name: translate("Feed_in"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        stack: 'Stack',
        areaStyle: {},
        data: []                
    });
    chartGen.series.push({
        name: translate("Charge"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        stack: 'Stack',
        areaStyle: {},
        data: []                
    });
    chartGen.series.push({
        name: translate("Direct_consumption"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        stack: 'Stack',
        areaStyle: {},
        data: []                
    });
    chartGen.series.push({
        name: translate("Generation"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        barWidth: 5,
        data: []                
    });

    // Specify the configuration items and data for the chart
    var chartPurch = createBasicChart(unit); 
    chartPurch.series.push({
        name: translate("Purchased"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        stack: 'Stack',
        areaStyle: {},
        data: []                
    });
    chartPurch.series.push({
        name: translate("Discharge"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        stack: 'Stack',
        areaStyle: {},
        data: []                
    });
    chartPurch.series.push({
        name: translate("Direct_consumption"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        stack: 'Stack',
        areaStyle: {},
        data: []                
    });
    chartPurch.series.push({
        name: translate("Consumption"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        barWidth: 5,
        data: []                
    });
    
    if (strChart == 'day'){
        chartGen.series.push(
            {
                name: translate("Soc"),
                type: chartType,
                smooth: true,
                symbol: 'none',
                yAxisIndex: 1,
                data: []                
            }           
        );
        chartGen.yAxis.push(
        {
            type: 'value',
            axisLabel: {
                formatter: `{value} %`
            },
        })

        if (showForecast == true){
 
            chartGen.series.push({
                name: translate("group_PvForecast"),
                type: chartType,
                smooth: true,
                symbol: 'none',
                barWidth: 5,
                data: [],
                lineStyle: {
                    width: 1,
                    type: 'dashed'
                  },
            });
        };
    }

    let directConsumption =0;
    let generation = 0;
    let feedIn = 0;
    let battCharge = 0;
    let battDisCharge = 0;
    for(let i = 0; i < jsonBatt.loginfo.length; i++) {
        if (strChart == 'day'){
            chartGen.xAxis[0].data.push(convertFromStringToDate(jsonPv.loginfo[i].time).toLocaleTimeString([],timeOptions));
            chartPurch.xAxis[0].data.push(convertFromStringToDate(jsonPv.loginfo[i].time).toLocaleTimeString([],timeOptions));
        } else {
            chartGen.xAxis[0].data.push(convertFromStringToDate(jsonPv.loginfo[i].time).toLocaleDateString([],timeOptions));
            chartPurch.xAxis[0].data.push(convertFromStringToDate(jsonPv.loginfo[i].time).toLocaleDateString([],timeOptions));
        }
        
        // Generation and Feedin
        generation = jsonPv.loginfo[i].generation * factor;
        feedIn = jsonPv.loginfo[i].feed_in * factor;
        chartGen.series[3].data.push(generation);
        chartGen.series[0].data.push(feedIn)

        // Battery 
        battCharge = jsonBatt.loginfo[i].charge * factor;
        battDisCharge = jsonBatt.loginfo[i].discharge * factor;
        chartGen.series[1].data.push(battCharge);
        chartPurch.series[1].data.push(battDisCharge);
        if (strChart == 'day'){
            chartGen.series[4].data.push(jsonBatt.loginfo[i].soc );
        }

        //Direct consumption
        directConsumption = generation - feedIn - battCharge;
        if (directConsumption < 0) directConsumption = 0;

        chartGen.series[2].data.push(directConsumption);
        chartPurch.series[2].data.push(directConsumption);
        
        //Consumption and Purchase
        chartPurch.series[3].data.push(jsonLoad.loginfo[i].consumption * factor);
        chartPurch.series[0].data.push(jsonLoad.loginfo[i].purchase * factor);

        //Forecast
        if ((strChart == 'day') && (showForecast == true)){
            var startTimeChart = convertFromStringToDate(jsonPv.loginfo[0].time).valueOf();
            var endTimeChart = convertFromStringToDate(jsonPv.loginfo[jsonPv.loginfo.length-1].time).valueOf();


            var w = 0;

            for(let u = 0; u < jsonPv.loginfo.length; u++) {
                var time = convertFromStringToDate(jsonPv.loginfo[u].time).valueOf();
                
                if (time < jsonForecast[0].t){
                    chartGen.series[5].data.push(0);
                }  
                else if (endTimeChart < jsonForecast[w].t){
                    //chartGen.series[5].data.push(0);
                }  
                else if (time === jsonForecast[w].t){
                    chartGen.series[5].data.push(jsonForecast[w].y);
                    w++;
                }  else if (w > 0){
                    chartGen.series[5].data.push((jsonForecast[w].y + jsonForecast[w-1].y)/2);
                }
            }
        }
    }

    //Legend
    chartGen.legend.data.push(translate("Generation"));
    chartGen.legend.data.push(translate("Direct_consumption"));
    chartGen.legend.data.push(translate("Charge"));
    chartGen.legend.data.push(translate("Feed_in"));
    if (strChart == 'day'){
        chartGen.legend.data.push(translate("Soc"));
    }
    if (showForecast == true){
        chartGen.legend.data.push(translate("group_PvForecast"));
    }

    chartPurch.legend.data.push(translate("Consumption"));
    chartPurch.legend.data.push(translate("Direct_consumption"));
    chartPurch.legend.data.push(translate("Discharge"));
    chartPurch.legend.data.push(translate("Purchased"));

    //Colors
    chartGen.color = [_colorFeedIn, _colorCharge, _colorDirect, _colorGen, _colorSoc, _colorPvForecast];
    chartPurch.color = [_colorPur , _colorDischarge, _colorDirect, _colorCons];

    return {chartGen,chartPurch};    
}

function createPvCharts(strChart,jsonPv){
    var chartType;
    var unit;
    var timeOptions;
    var factor;
    if (strChart == 'day'){
        chartType = 'line';
        unit = 'kW'
        timeOptions = { hour12: false, hour: '2-digit', minute:'2-digit'};
        factor = 0.004;
    }
    else if (strChart == 'week'){
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {weekday: 'short',  month: 'numeric', day: 'numeric'};
        factor = 0.001;
    }
    else if (strChart == 'year'){
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {year: 'numeric', month: 'long'};
        factor = 0.001;
    }
    else{
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {};
        factor = 0.001;
    }
    
    // Specify the configuration items and data for the chart
    var chartPv = createBasicChart(unit);
    chartPv.series.push({
        name: translate("Generation"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: []                
    });
    chartPv.series.push({
        name: translate("Feed_in"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: []                
    });

    let generation = 0;
    let feedIn = 0;
    for(let i = 0; i < jsonPv.loginfo.length; i++) {
        if (strChart == 'day'){
            chartPv.xAxis[0].data.push(convertFromStringToDate(jsonPv.loginfo[i].time).toLocaleTimeString([],timeOptions));
        } else {
            chartPv.xAxis[0].data.push(convertFromStringToDate(jsonPv.loginfo[i].time).toLocaleDateString([],timeOptions));
        }
        
        // Generation and Feedin
        generation = jsonPv.loginfo[i].generation * factor;
        feedIn = jsonPv.loginfo[i].feed_in * factor;
        chartPv.series[0].data.push(generation);
        chartPv.series[1].data.push(feedIn)
    }

    //Legend
    chartPv.legend.data.push(translate("Generation"));
    chartPv.legend.data.push(translate("Feed_in"));
    
    //Colors
    chartPv.color = [_colorGen, _colorFeedIn];

    var total_feed_in;
    if (jsonPv.loginfo[jsonPv.loginfo.length-1].total_Feed_in) total_feed_in = jsonPv.loginfo[jsonPv.loginfo.length-1].total_Feed_in;
    if (jsonPv.loginfo[jsonPv.loginfo.length-1].total_feed_in) total_feed_in = jsonPv.loginfo[jsonPv.loginfo.length-1].total_feed_in;
  
    //Footer
    var footer = `<span class="marker" style="background-color:${_colorGen};"></span>`
    footer += `<span> ${translate("Generation")}: ${(jsonPv.loginfo[jsonPv.loginfo.length-1].total_generation * 0.001).toFixed(3)} kWh  </span>`;
    footer += `<span class="marker" style="background-color:${_colorFeedIn};"></span>`
    footer += `<span> ${translate("Feed_in")} ${(total_feed_in * 0.001).toFixed(3)} kWh</span>`;

    return {chartPv, footer};    
}

function createEssCharts(strChart,jsonBatt){
    var chartType;
    var unit;
    var timeOptions;
    var factor;
    if (strChart == 'day'){
        chartType = 'line';
        unit = 'kW'
        timeOptions = { hour12: false, hour: '2-digit', minute:'2-digit'};
        factor = 0.004;
    }
    else if (strChart == 'week'){
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {weekday: 'short',  month: 'numeric', day: 'numeric'};
        factor = 0.001;
    }
    else if (strChart == 'year'){
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {year: 'numeric', month: 'long'};
        factor = 0.001;
    }
    else{
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {};
        factor = 0.001;
    }
    
    // Specify the configuration items and data for the chart
    var chartEss = createBasicChart(unit);
    chartEss.series.push({
        name: translate("Charge"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: []                
    });
    chartEss.series.push({
        name: translate("Discharge"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: []                
    });
    if (strChart == 'day'){
        chartEss.series.push(
            {
                name: translate("Soc"),
                type: chartType,
                smooth: true,
                symbol: 'none',
                yAxisIndex: 1,
                data: []                
            }           
        );
        chartEss.yAxis.push(
        {
            type: 'value',
            axisLabel: {
                formatter: `{value} %`
            },
        })
    }

    let battCharge = 0;
    let battDisCharge = 0;
    for(let i = 0; i < jsonBatt.loginfo.length; i++) {
        if (strChart == 'day'){
            chartEss.xAxis[0].data.push(convertFromStringToDate(jsonBatt.loginfo[i].time).toLocaleTimeString([],timeOptions));
        } else {
            chartEss.xAxis[0].data.push(convertFromStringToDate(jsonBatt.loginfo[i].time).toLocaleDateString([],timeOptions));
        }
        
        // Battery 
        battCharge = jsonBatt.loginfo[i].charge * factor;
        battDisCharge = jsonBatt.loginfo[i].discharge * factor;
        chartEss.series[0].data.push(battCharge);
        chartEss.series[1].data.push(battDisCharge);
        if (strChart == 'day'){
            chartEss.series[2].data.push(jsonBatt.loginfo[i].soc );
        }
    }

    //Legend
    chartEss.legend.data.push(translate("Charge"));
    chartEss.legend.data.push(translate("Discharge"));
    if (strChart == 'day'){
        chartEss.legend.data.push(translate("Soc"));
    }

    //Colors
    chartEss.color = [_colorCharge, _colorDischarge, _colorSoc];

    //Footer
    var footer = `<span class="marker" style="background-color:${_colorCharge};"></span>`
    footer += `<span> ${translate("Charge")}: ${(jsonBatt.loginfo[jsonBatt.loginfo.length-1].total_charge * 0.001).toFixed(3)} kWh   </span>`;
    footer += `<span class="marker" style="background-color:${_colorDischarge};"></span>`
    footer += `<span> ${translate("Discharge")} ${(jsonBatt.loginfo[jsonBatt.loginfo.length-1].total_discharge * 0.001).toFixed(3)} kWh</span>`;

    return {chartEss, footer};    
}

function createLoadCharts(strChart,jsonLoad){
    var chartType;
    var unit;
    var timeOptions;
    var factor;
    if (strChart == 'day'){
        chartType = 'line';
        unit = 'kW'
        timeOptions = { hour12: false, hour: '2-digit', minute:'2-digit'};
        factor = 0.004;
    }
    else if (strChart == 'week'){
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {weekday: 'short',  month: 'numeric', day: 'numeric'};
        factor = 0.001;
    }
    else if (strChart == 'year'){
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {year: 'numeric', month: 'long'};
        factor = 0.001;
    }
    else{
        chartType = 'bar'
        unit = 'kWh'
        timeOptions = {};
        factor = 0.001;
    }
    
     // Specify the configuration items and data for the chart
    var chartLoad = createBasicChart(unit); 
    chartLoad.series.push({
        name: translate("Consumption"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        stack: 'Stack',
        areaStyle: {},
        data: []                
    });
    chartLoad.series.push({
        name: translate("Purchased"),
        type: chartType,
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: []                
    });


    for(let i = 0; i < jsonLoad.loginfo.length; i++) {
        if (strChart == 'day'){
            chartLoad.xAxis[0].data.push(convertFromStringToDate(jsonLoad.loginfo[i].time).toLocaleTimeString([],timeOptions));
        } else {
            chartLoad.xAxis[0].data.push(convertFromStringToDate(jsonLoad.loginfo[i].time).toLocaleDateString([],timeOptions));
        }
               
        //Consumption and Purchase
        chartLoad.series[0].data.push(jsonLoad.loginfo[i].consumption * factor);
        chartLoad.series[1].data.push(jsonLoad.loginfo[i].purchase * factor);
    }

    //Legend
    chartLoad.legend.data.push(translate("Consumption"));
    chartLoad.legend.data.push(translate("Purchased"));

    //Colors
    chartLoad.color = [_colorCons, _colorPur];

    //Footer
    var footer = `<span class="marker" style="background-color:${_colorCons};"></span>`
    footer += `<span> ${translate("Consumption")}: ${(jsonLoad.loginfo[jsonLoad.loginfo.length-1].total_consumption * 0.001).toFixed(3)} kWh   </span>`;
    footer += `<span class="marker" style="background-color:${_colorPur};"></span>`
    footer += `<span> ${translate("Purchased")} ${(jsonLoad.loginfo[jsonLoad.loginfo.length-1].total_purchase * 0.001).toFixed(3)} kWh</span>`;

    return {chartLoad, footer};    
}

// Basic chart
function createBasicChart(unit){

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter: (params) => {          
                if(params instanceof Array) {
                    if(params.length) {
                        let message = '';
                        message += `${ params[0].axisValueLabel }`;
                        message += '<table>';
                        for (let i = params.length - 1; i >= 0; i--) {
                            if (params[i].seriesName == translate('Soc'))
                                message += `<tr><td>${ params[i].marker }${ params[i].seriesName }:<td/><td><b> ${ Number(params[i].value).toFixed(1) }<b/> %<td/><tr/>`;
                            else
                                message += `<tr><td>${ params[i].marker }${ params[i].seriesName }:<td/><td><b> ${ Number(params[i].value).toFixed(3) }<b/> ${unit}<td/><tr/>`;
                        };
                        message += '<table/>';
                        return message;
                    } else {
                        return null;
                    }
                } else {
                    let message = '';
                    message += `${ params[0].axisValueLabel }`;
                    message += `<br/>${ params.marker }${ params.seriesName }: ${ params.value }${ params.data.unit || '' }`;
                    return message;
                }           
            },
        },
        legend: {
            type: 'scroll',
            data: [],
            bottom: 5
        },
        grid: {
            top: '10px',
            left: '3%',
            right: '3%',
            bottom: 30,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: [],
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: `{value} ${unit}`
                },
            }
        ],
        series: [
        ],
    };


}

// Translate function
function translate(text) {
    if (!text) return '';
    const lang = vis.language
    text = text.toString();
    
    if (typeof text !== 'string') {
        console.warn('Trying to translate non-text:' + text);
    } else if (systemDictionary[text]) {
        var newText = systemDictionary[text][lang];
        if (newText) {
            return newText;
        } else if (lang !== 'en') {
            newText = systemDictionary[text].en;
            if (newText) {
                return newText;
            }
        }
    } else {
        console.log('Not translated text:' + text);
    }
    return text;
}

//Convert String to Date
function convertFromStringToDate(dateString) {
    let year = dateString.substr(0,4);
    let month = dateString.substr(4,2);
    let day = dateString.substr(6,2);
    let hour = dateString.substr(8,2);
    let minutes = dateString.substr(10,2);
    let seconds = dateString.substr(12,2);

    return(new Date(year, month - 1, day,
                            hour, minutes, seconds))
}