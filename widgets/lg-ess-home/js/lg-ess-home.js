/*
    ioBroker.vis lg-ess-home Widget-Set

    version: "0.0.1"

    Copyright 2021 Author author@mail.com
*/
'use strict';


// add translations for edit mode
$.extend(
    true,
    systemDictionary,
    {
		'lgEssInstance': {
            'en': 'adapter instance',
            'de': 'Adapterinstanz',
            'ru': 'экземпляр адаптера',
            'pt': 'instância do adaptador',
            'nl': 'adapter instantie',
            'fr': "instance d'adaptateur",
            'it': "istanza dell'adattatore",
            'es': 'instancia de adaptador',
            'pl': 'instancja adaptera',
            'zh-cn': '适配器实例'
        },	
        "Generation": {
            "en": "Generation",
            "de": "Erzeugung",
            "ru": "Поколение",
            "pt": "Geração",
            "nl": "Generatie",
            "fr": "Génération",
            "it": "Generazione",
            "es": "Generacion",
            "pl": "Pokolenie",
            "zh-cn": "一代"
        },
        "Consumption": {
            "en": "Consumption",
            "de": "Verbrauch",
            "ru": "Потребление",
            "pt": "Consumo",
            "nl": "Consumptie",
            "fr": "Consommation",
            "it": "Consumo",
            "es": "Consumo",
            "pl": "Konsumpcja",
            "zh-cn": "消耗"
        },
    	"Feed_in": {
            "en": "Power grid feed-in",
            "de": "Netzeinspeisung",
            "ru": "Подача электроэнергии в сеть",
            "pt": "Alimentação da rede elétrica",
            "nl": "Teruglevering aan het elektriciteitsnet",
            "fr": "Alimentation du réseau électrique",
            "it": "Immissione in rete elettrica",
            "es": "Alimentación a la red eléctrica",
            "pl": "Zasilanie sieci energetycznej",
            "zh-cn": "电网馈入"
        },
	    "Purchased": {
            "en": "Purchased electricity",
            "de": "gekaufter Strom",
            "ru": "Купленная электроэнергия",
            "pt": "Eletricidade comprada",
            "nl": "Ingekochte elektriciteit",
            "fr": "Électricité achetée",
            "it": "Energia elettrica acquistata",
            "es": "Electricidad comprada",
            "pl": "Zakupiona energia elektryczna",
            "zh-cn": "购买的电力"
        },
        "Direct_consumption": {
            "en": "direct consumption",
            "de": "direkter Verbrauch",
            "ru": "прямое потребление",
            "pt": "consumo direto",
            "nl": "directe consumptie",
            "fr": "consommation directe",
            "it": "consumo diretto",
            "es": "consumo directo",
            "pl": "bezpośrednie spożycie",
            "zh-cn": "直接消费"	
        },
        "Discharge": {
            "en": "Discharge",
            "de": "Entladen",
            "ru": "Разрядить",
            "pt": "Descarregar",
            "nl": "ontladen",
            "fr": "Décharger",
            "it": "Scarica",
            "es": "descargar",
            "pl": "Rozładuj",
            "zh-cn": "不充电"
        },
        "Charge": {
            "en": "Charge",
            "de": "Aufladen",
            "ru": "Обвинение",
            "pt": "Cobrar",
            "nl": "Aanval",
            "fr": "Charger",
            "it": "Caricare",
            "es": "Cargo",
            "pl": "Opłata",
            "zh-cn": "收费"
        },
        "Soc": {
            "en": "State of charge",
            "de": "Ladezustand",
            "ru": "Состояние заряда",
            "pt": "Estado de cobrança",
            "nl": "Staat van het opladen",
            "fr": "État de charge",
            "it": "Stato di carica",
            "es": "Estado de carga",
            "pl": "Stan naładowania",
            "zh-cn": "充电状态"
        },
        "Day": {
            "en": "Day",
            "de": "Tag",
            "ru": "День",
            "pt": "Dia",
            "nl": "Dag",
            "fr": "Jour",
            "it": "Giorno",
            "es": "Día",
            "pl": "Dzień",
            "zh-cn": "日"
        },
        "Week": {
            "en": "Week",
            "de": "Woche",
            "ru": "Неделю",
            "pt": "Semana",
            "nl": "Week",
            "fr": "Semaine",
            "it": "Settimana",
            "es": "Semana",
            "pl": "Tydzień",
            "zh-cn": "星期"
        },
        "Month": {
            "en": "Month",
            "de": "Monat",
            "ru": "Месяц",
            "pt": "Mês",
            "nl": "Maand",
            "fr": "Mois",
            "it": "Mese",
            "es": "Mes",
            "pl": "Miesiąc",
            "zh-cn": "月"
        },
        "Year": {
            "en": "Year",
            "de": "Jahr",
            "ru": "Год",
            "pt": "Ano",
            "nl": "Jaar",
            "fr": "An",
            "it": "Anno",
            "es": "Año",
            "pl": "Rok",
            "zh-cn": "年"
        },
        "energy_view": {
            "en": "energy view",
            "de": "Energieansicht",
            "ru": "вид энергии",
            "pt": "visão de energia",
            "nl": "energie weergave",
            "fr": "vue énergétique",
            "it": "vista energetica",
            "es": "vista de energía",
            "pl": "widok energii",
            "zh-cn": "能量观"
          },
          "PV_diagram": {
            "en": "PV diagram",
            "de": "PV-Diagramm",
            "ru": "PV-диаграмма",
            "pt": "diagrama PV",
            "nl": "PV-diagram",
            "fr": "Diagramme photovoltaïque",
            "it": "Diagramma fotovoltaico",
            "es": "diagrama fotovoltaico",
            "pl": "Schemat fotowoltaiczny",
            "zh-cn": "光伏图"
          },
          "ESS_diagram": {
            "en": "ESS diagram",
            "de": "ESS-Diagramm",
            "ru": "диаграмма ЭСС",
            "pt": "Diagrama ESS",
            "nl": "ESS-diagram",
            "fr": "Schéma SSE",
            "it": "Diagramma ESS",
            "es": "diagrama SEE",
            "pl": "Schemat ESS",
            "zh-cn": "ESS图"
          },
        "Load_diagram": {
            "en": "Load diagram",
            "de": "Last-Diagramm",
            "ru": "Диаграмма нагрузки",
            "pt": "Diagrama de carga",
            "nl": "Laad diagram",
            "fr": "Diagramme de charge",
            "it": "Diagramma di carico",
            "es": "Diagrama de carga",
            "pl": "Schemat obciążenia",
            "zh-cn": "负载图"
          },
        "group_colorLgEssHome": {
            "en": "Colors",
            "de": "Farben",
            "ru": "Цвета",
            "pt": "Cores",
            "nl": "kleuren",
            "fr": "Couleurs",
            "it": "Colori",
            "es": "Colores",
            "pl": "Zabarwienie",
            "zh-cn": "颜色"
        }
    }
);


// this code can be placed directly in lg-ess-home.html
vis.binds['lg-ess-home'] = {
    version: '0.0.1',
    showVersion: function () {
        if (vis.binds['lg-ess-home'].version) {
            console.log('Version lg-ess-home: ' + vis.binds['lg-ess-home'].version);
            vis.binds['lg-ess-home'].version = null;
        }
    },
    createWidget: function (widgetID, view, data, style) {

		instance = data._data.lgEssInstance || 'lg-ess-home.0';
        
        _colorPur = data._data.Purchased;
        _colorGen = data._data.Generation;
        _colorDirect = data._data.Direct_consumption;      
        _colorCharge = data._data.Charge;
        _colorFeedIn = data._data.Feed_in;
        _colorDischarge = data._data.Discharge;
        _colorCons = data._data.Consumption;
        _colorSoc = data._data.Soc;

		console.log(new Date().toLocaleTimeString() + ' Lg-Ess[' + widgetID + ']: Trying to render widget');
		var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['lg-ess-home'].createWidget(widgetID, view, data, style);
            }, 100);
        }
		var strChart = "day";
        var strChartType = "OverviewChart";

		var text = '';
        text += `<div id="${widgetID}-strHeader"class="lg-ess-home-header"></div>`;
        text += `<div id="${widgetID}-mySidenav" class="lg-ess-home-sidenav">`;
        text += `   <a id="${widgetID}-btnClose" class="closebtn">&times;</a>`;
        text += `   <a id="${widgetID}-btnOverviewChart" class="active">Energie-Ansicht</a>`;
        text += `   <a id="${widgetID}-btnPvChart">PV-Diagramm</a>`;
        text += `   <a id="${widgetID}-btnBattChart">ESS-Diagramm</a>`;
        text += `   <a id="${widgetID}-btnLoadChart">Last-Diagramm</a>`;
        text += `</div>`;

        text += `<div class="lg-ess-home-timebar">`
        text += `   <span id="${widgetID}-btnOpenMenu" class="lg-ess-home-sidenav-menue-opner"">&#9776</span>`;
        text += `   <span id="${widgetID}-strDate"></span>`;
        text += `   <span class="lg-ess-home-dropdown">`;   
        text += `       <button id="${widgetID}-btnDropDown" class="lg-ess-home-dropbtn"></button>`;
        text += `       <div id="${widgetID}-myDropdown" class="lg-ess-home-dropdown-content">`;
        text += `           <a id="${widgetID}-btnDay" class="active">Tag</a>`;
        text += `           <a id="${widgetID}-btnWeek">Woche</a>`;
        text += `           <a id="${widgetID}-btnMonth">Monat</a>`;
        text += `           <a id="${widgetID}-btnYear">Jahr</a>`;
        text += `       </div>`;
        text += `   </span>`;
        text += `</div>`;
        
        text += `<div id="${widgetID}-strTotal"class="lg-ess-home-total"></div>`;

        text += `<div id="${widgetID}-Chart1" class="lg-ess-home-two-charts"></div>`;
		text += `<div id="${widgetID}-Chart2" class="lg-ess-home-two-charts"></div>`;

        //Add html
        $div.html(text);

        var $mySidenav = $(`#${widgetID}-mySidenav`);
        var $myDropdown = $(`#${widgetID}-myDropdown`);

        var $chart1 = $(`#${widgetID}-Chart1`);
        var $chart2 = $(`#${widgetID}-Chart2`);

        var $btnDropDown = $(`#${widgetID}-btnDropDown`);
        var $btnClose = $(`#${widgetID}-btnClose`);

        var $btnOpenMenu = $(`#${widgetID}-btnOpenMenu`);
        
        var $btnDay = $(`#${widgetID}-btnDay`);
        var $btnWeek = $(`#${widgetID}-btnWeek`);
        var $btnMonth = $(`#${widgetID}-btnMonth`);
        var $btnYear = $(`#${widgetID}-btnYear`);

        var $btnOverviewChart = $(`#${widgetID}-btnOverviewChart`);
        var $btnPvChart = $(`#${widgetID}-btnPvChart`);
        var $btnBattChart = $(`#${widgetID}-btnBattChart`);
        var $btnLoadChart = $(`#${widgetID}-btnLoadChart`);

        var $strDate = $(`#${widgetID}-strDate`);
        var $strHeader = $(`#${widgetID}-strHeader`);
        var $strTotal = $(`#${widgetID}-strTotal`);
        
        /* Add translations */
        $btnDay.text(translate('Day'));
        $btnWeek.text(translate('Week'));
        $btnMonth.text(translate('Month'));
        $btnYear.text(translate('Year'));

        $strHeader.text(translate('energy_view'));

        $btnOverviewChart.text(translate('energy_view'));
        $btnPvChart.text(translate('PV_diagram'));
        $btnBattChart.text(translate('ESS_diagram'));
        $btnLoadChart.text(translate('Load_diagram'));

        /* Open dropdown */
        $btnDropDown.click(function(){
            $myDropdown.toggleClass("lg-ess-home-dropdown-content-show");
        });

        /* Open and close Main Menu */
        $btnOpenMenu.click(function(){
            $mySidenav.width("250px");
        });
        $btnClose.click(function(){
            $mySidenav.width("0px");
        });

        /* Clicks Dropdown */
        $btnDay.click(function(){
            $btnDay.addClass("active");
            $btnWeek.removeClass("active");
            $btnMonth.removeClass("active");
            $btnYear.removeClass("active");
			
            strChart = "day";
            newChart();
        });
        $btnWeek.click(function(){
            $btnDay.removeClass("active");
            $btnWeek.addClass("active");
            $btnMonth.removeClass("active");
            $btnYear.removeClass("active");

            strChart = "week";
            newChart();
        });
        $btnMonth.click(function(){
            $btnDay.removeClass("active");
            $btnWeek.removeClass("active");
            $btnMonth.addClass("active");
            $btnYear.removeClass("active");

            strChart = "month";
            newChart();       
        });
        $btnYear.click(function(){
            $btnDay.removeClass("active");
            $btnWeek.removeClass("active");
            $btnMonth.removeClass("active");
            $btnYear.addClass("active");

            strChart = "year";

            newChart();
        });

        /* Clicks Side Navigation */
        $btnOverviewChart.click(function(){
            $btnOverviewChart.addClass("active");
            $btnPvChart.removeClass("active");
            $btnBattChart.removeClass("active");
            $btnLoadChart.removeClass("active");
			
            strChartType = "OverviewChart";
            newChart();
            $mySidenav.width("0px");
            $strHeader.text(translate('energy_view'));
        });

        $btnPvChart.click(function(){
            $btnOverviewChart.removeClass("active");
            $btnPvChart.addClass("active");
            $btnBattChart.removeClass("active");
            $btnLoadChart.removeClass("active");
			
            strChartType = "PvChart";
            newChart();
            $mySidenav.width("0px");
            $strHeader.text(translate('PV_diagram'));
        });

        $btnBattChart.click(function(){
            $btnOverviewChart.removeClass("active");
            $btnPvChart.removeClass("active");
            $btnBattChart.addClass("active");
            $btnLoadChart.removeClass("active");
			
            strChartType = "EssChart";
            newChart();
            $mySidenav.width("0px");
            $strHeader.text(translate('ESS_diagram'));
        });

        $btnLoadChart.click(function(){
            $btnOverviewChart.removeClass("active");
            $btnPvChart.removeClass("active");
            $btnBattChart.removeClass("active");
            $btnLoadChart.addClass("active");
			
            strChartType = "LoadChart";
            newChart();
            $mySidenav.width("0px");
            $strHeader.text(translate('Load_diagram'));
        });

        /* Dropdown */
        window.onclick = function(event) {
            if (!event.target.matches('.lg-ess-home-dropbtn')) {
              var dropdowns = document.getElementsByClassName("lg-ess-home-dropdown-content");
              var i;
              for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('lg-ess-home-dropdown-content-show')) {
                  openDropdown.classList.remove('lg-ess-home-dropdown-content-show');
                }
              }
            }
          }
          
		// Initialize the echarts instance based on the prepared dom
		let myChart1 = echarts.init(document.getElementById(widgetID +"-Chart1"));
		let myChart2 = echarts.init(document.getElementById(widgetID +"-Chart2"));

        let dps = [
            instance + '.user.graph.pv.day',
			instance + '.user.graph.load.day',
            instance + '.user.graph.batt.day',
            instance + '.user.graph.pv.week',
			instance + '.user.graph.load.week',
            instance + '.user.graph.batt.week',
            instance + '.user.graph.pv.month',
			instance + '.user.graph.load.month',
            instance + '.user.graph.batt.month',
            instance + '.user.graph.pv.year',
			instance + '.user.graph.load.year',
            instance + '.user.graph.batt.year',        
        ];

        // Update states and subscribe to changes
        vis.conn.getStates(dps, function (error, states) {
            console.log(new Date().toLocaleTimeString() + ' Lg-Ess[' + widgetID + ']: Subscribing to state changes');
            vis.updateStates(states);
            vis.conn.subscribe(dps);	

            // add onChange listener
            for (let i = 0; i < dps.length; i++) {
                dps[i] = dps[i] + '.val';
                vis.states.bind(dps[i], onChange);
            } // endFor

            // give vis ability to destroy on change
            $div.data('bound', dps);
            $div.data('bindHandler', onChange);

            newChart();
		})

        function newChart(){
			var charts = createChart(strChart,strChartType);
            myChart1.clear();
            myChart2.clear();
            if(strChartType == "OverviewChart"){
                $chart1.addClass("lg-ess-home-two-charts");
                $chart1.removeClass("lg-ess-home-one-charts");
                $chart2.removeClass("lg-ess-home-hide-chart");
                myChart1.setOption(charts.chart1);
                myChart2.setOption(charts.chart2);
                myChart1.resize();
            } 
            else if((strChartType == "PvChart") || (strChartType == "EssChart") || (strChartType == "LoadChart")){
                $chart1.removeClass("lg-ess-home-two-charts");
                $chart1.addClass("lg-ess-home-one-charts");
                $chart2.addClass("lg-ess-home-hide-chart");
                myChart1.setOption(charts.chart1);
                myChart1.resize();
            }

            $strDate.text(charts.strTitle);
            $strTotal.html(charts.footer);
        }

        // subscribe on updates of value, we can use obj, newVal, oldVal
        function onChange(obj, newVal) {
            newChart();			
		}

		const onresize = (dom_elem, callback) => {
			const resizeObserver = new ResizeObserver(() => callback() );
			resizeObserver.observe(dom_elem);
		};
						
		// Using constants to make it easier to read the code
		const bb = document.getElementById(widgetID);
			
		// Finally, register the observer for the dom_elem
		onresize(bb, function () {
			myChart1.resize();
			myChart2.resize();
		});
    },

};

vis.binds['lg-ess-home'].showVersion();