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
        },
        "Charts": {
            "en": "Charts",
            "de": "Diagramme",
            "ru": "Графики",
            "pt": "Gráficos",
            "nl": "Grafieken",
            "fr": "Graphiques",
            "it": "Grafici",
            "es": "Gráficos",
            "pl": "Wykresy",
            "zh-cn": "图表"
        },
        "period_of_time": {
            "en": "period of time",
            "de": "Zeitspanne",
            "ru": "период времени",
            "pt": "período de tempo",
            "nl": "periode",
            "fr": "période de temps",
            "it": "periodo di tempo",
            "es": "período de tiempo",
            "pl": "okres czasu",
            "zh-cn": "一段的时间"
        },
        "No_data_available": {
            "en": "No data available ",
            "de": "Keine Daten verfügbar",
            "ru": "Данные недоступны",
            "pt": "Nenhum dado disponível",
            "nl": "Geen gegevens beschikbaar",
            "fr": "Pas de données disponibles",
            "it": "Nessun dato disponibile",
            "es": "Datos no disponibles",
            "pl": "Brak dostępnych danych",
            "zh-cn": "无可用数据"
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
        _widgetID = widgetID;

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

        /* ------------ Left Menu ------------*/
        text += `<div class="lg-ess-home-left-menu">`;
        text += `	<div class="burger_box">`;
        text += `		<div class="menu-icon-container">`;
        text += `			<a id="${widgetID}-btnOpenMainMenu" href="#" class="menu-icon js-menu_toggle closed">`;
        text += `				<span class="menu-icon_box">`;
        text += `					<span class="menu-icon_line menu-icon_line--1"></span>`;
        text += `					<span class="menu-icon_line menu-icon_line--2"></span>`;
        text += `					<span class="menu-icon_line menu-icon_line--3"></span>`;
        text += `				</span>`;
        text += `			</a>`;
        text += `		</div>`;
        text += `	</div>`;
        text += `	<div class="container">`;
        text += `		<h2>Diagramme</h2>`;
        text += `	    <div class="icon-list">`;
        text += `			<a id="menu-text_OverviewChart" class="list_item selected" href="#">List Item 01</a>`;
        text += `			<a id="menu-text_PvChart" class="list_item" href="#">List Item 02</a>`;
        text += `			<a id="menu-text_EssChart" class="list_item" href="#">List Item 03</a>`;
        text += `			<a id="menu-text_LoadChart" class="list_item" href="#">List Item 04</a>`;
        text += `	    </div>`;
        text += `	</div>`;
        text += `</div>`; 

        /* ------------ Right Menu ------------*/
        text += `<div class="lg-ess-home-right-menu">`;
        text += `	<div class="lg-ess-home-right-menu-container">`;
        text += `		<h2 class="menu_title">Zeitraum</h2>`;
        text += `	    <div class="icon-list">`;
        text += `	        <a id="${widgetID}-btn_day" class="lg-ess-home-right_menu_item selected" href="#"><span>Tag</span></a>`;
        text += `	        <a id="${widgetID}-btn_week" class="lg-ess-home-right_menu_item" href="#"><span>Woche</span></a>`;
        text += `	        <a id="${widgetID}-btn_month" class="lg-ess-home-right_menu_item" href="#"><span>Monat</span></a>`;
        text += `	        <a id="${widgetID}-btn_year" class="lg-ess-home-right_menu_item" href="#"><span>Jahr</span></a>`;
        text += `	    </div>`;     
        text += `	</div>`;
        text += `   <div class="lg-ess-home-right-menu-box">`;
        text += `		<div class="menu-icon-container">`;
        text += `	        <a id="${widgetID}-btnOpenRightMenu" href="#" class="js-menu_toggle closed">`;
        text += `               <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">`;
        text += `                   <title>68.calendar</title>`;
        text += `                   <g id="_68.calendar" data-name="68.calendar">`;
        text += `                       <rect class="lg-ess-home-right-menu-box-icon" x="1" y="3" width="22" height="20" rx="3" ry="3"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="1" y1="9" x2="23" y2="9"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="12" y1="5" x2="12" y2="1"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="6" y1="5" x2="6" y2="1"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="18" y1="5" x2="18" y2="1"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="5" y1="14" x2="7" y2="14"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="11" y1="14" x2="13" y2="14"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="17" y1="14" x2="19" y2="14"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="5" y1="18" x2="7" y2="18"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="11" y1="18" x2="13" y2="18"/>`;
        text += `                       <line class="lg-ess-home-right-menu-box-icon" x1="17" y1="18" x2="19" y2="18"/>`;
        text += `                   </g>`;
        text += `               </svg>`;
        text += `		    </a>`;
        text += `       </div>`;
        text += `   </div>`;
        text += `</div>`;

        text += `<div class="loading">Loading&#8230;</div>`
        text += `<div class="lg-ess-home-error">`
        text += `   <div class="lg-ess-home-error-symbol">&#9888</div>`
        text += `   <div class="lg-ess-home-error-text">keine Daten vorhanden</div>`
        text += `</div>`

        text += `<div class="lg-ess-home-timebar">`
        text += `   <div>`
        text += `	    <button id="${widgetID}-btnBackward" class="backward" href="#"><<</button>`;      
        text += `       <button id="${widgetID}-strDate"></button>`;
        text += `       <button id="${widgetID}-btnForward" class="forward last">>></button>`;
        text += `   </div>`;

        text += `   <div>`
        text += `       <input name="date" id="date_input" required></input>`;
        text += `   </div>`;
        text += `</div>`;


        text += `<div id="${widgetID}-strTotal"class="lg-ess-home-total"></div>`;

        text += `<div id="${widgetID}-Chart1" class="lg-ess-home-two-charts"></div>`;
		text += `<div id="${widgetID}-Chart2" class="lg-ess-home-two-charts"></div>`;

        //Add html
        $div.html(text);

        var $chart1 = $(`#${widgetID}-Chart1`);
        var $chart2 = $(`#${widgetID}-Chart2`);

        var $strHeader = $(`#${widgetID}-strHeader`);

        $( function() {
            $(`#date_input`).datepicker({
                maxDate: '0',
                showButtonPanel: false
            });
        });

        $(`#${widgetID}-strDate`).click(function() {
            $(`#date_input`).datepicker('show');
      });

        let selectedDate = new Date().toLocaleDateString('en-ca'); 
        /* Button backward */
        $( `#${widgetID}-btnBackward`).click(function() {
            var date = new Date(selectedDate)
            if (strChart == 'day')
                date.setDate(date.getDate() - 1);
            else if (strChart == 'week')
                date.setDate(date.getDate() - 7);
            else if (strChart == 'month')
                date.setMonth(date.getMonth() - 1);  
            else if (strChart == 'year')
                date.setDate(date.getDate() - 365);                        
            selectedDate = date.toLocaleDateString('en-ca');
            loadChartData(selectedDate);
            $( `#${widgetID}-btnForward`).removeClass('last');
        });

        /* Button forward */
        $( `#${widgetID}-btnForward`).click(function() {
            if ($(this).hasClass('last')) return;
            
            var date = new Date(selectedDate)
            if (strChart == 'day')
                date.setDate(date.getDate() + 1);
            else if (strChart == 'week')
                date.setDate(date.getDate() + 7);
            else if (strChart == 'month')
                date.setMonth(date.getMonth() + 1);  
            else if (strChart == 'year')
                date.setDate(date.getDate() + 365);  
            
            var today = new Date();
            if (date > today) date = today;

            selectedDate = date.toLocaleDateString('en-ca');
            loadChartData(selectedDate);

            if (today.toDateString() == date.toDateString())
                $( `#${widgetID}-btnForward`).addClass('last');
        });

        /* Selected date changed */
        $( "#date_input" ).change(function() {
            var today = new Date();  
            var date = new Date((this).value);
            selectedDate = date.toLocaleDateString('en-ca');    
            if (today.toDateString() == date.toDateString())
                $( `#${widgetID}-btnForward`).addClass('last');
            else
                $( `#${widgetID}-btnForward`).removeClass('last');               
            loadChartData(selectedDate);
        });

        /* Load actual chart data */
        loadChartData();

        /* Translate Errortext */
        $('.lg-ess-home-error-text').text(translate('No_data_available'));

        /*---------------------------------------------------------------------------------------------
            Left Menue
         ---------------------------------------------------------------------------------------------*/
         /* Translate Left Menue */
         $('#menu-text_OverviewChart').text(translate('energy_view'));
         $('#menu-text_PvChart').text(translate('PV_diagram'));
         $('#menu-text_EssChart').text(translate('ESS_diagram'));
         $('#menu-text_LoadChart').text(translate('Load_diagram'));
         $('.lg-ess-home-left-menu .container h2').text(translate('Charts'));

        /* Open Menue */
         $(document).on('click',`#${widgetID}-btnOpenMainMenu.js-menu_toggle.closed`,function(e){
            e.preventDefault(); 
            $(this).removeClass('closed').addClass('opened');
        
            $('.lg-ess-home-left-menu').css({ 'width':'250px' });
            $('.container').css({ 'display':'block' });
            $('.container h2').css({ 'opacity':'1' });
        
            $('.list_item').each(function(i){
                var thisLI = $(this);
                setTimeout(function(){
                    thisLI.css({
                        'opacity':'1',
                        'margin-left':'0'
                    });
                },100*i);
            });
        });
        
        /* Close Menue */
        $(document).on('click',`#${widgetID}-btnOpenMainMenu.js-menu_toggle.opened`,function(e){
            e.preventDefault(); 
            $(this).removeClass('opened').addClass('closed');
        
            $('.lg-ess-home-left-menu').css({ 'width':'0px' });
            $('.container').css({ 'display':'none' });
            $('.container h2').css({ 'opacity':'0' });
        
            $('.list_item').css({
                'opacity':'0',
                'margin-left':'-20px'
            });
        });      

        /* Menue Item click */
        $(document).on('click','.list_item',function(e){
            e.preventDefault();
            $('.list_item.selected').removeClass('selected');        
            $(this).addClass('selected');   
            const words = $(this).attr("id").split('_');
            strChartType = words[1];
            newChart();

            /* Close Menue */
            $(`#${widgetID}-btnOpenMainMenu.js-menu_toggle.opened`).removeClass('opened').addClass('closed');
        
            $('.lg-ess-home-left-menu').css({ 'width':'0px' });
            $('.container').css({ 'display':'none' });
        
            $('.list_item').css({
                'opacity':'0',
                'margin-left':'-20px'
            });

        });
        

        /*---------------------------------------------------------------------------------------------
            Menue right
         ---------------------------------------------------------------------------------------------*/
         /* Translate Right Menue */
         $(`#${widgetID}-btn_day`).text(translate('Day'));
         $(`#${widgetID}-btn_week`).text(translate('Week'));
         $(`#${widgetID}-btn_month`).text(translate('Month'));
         $(`#${widgetID}-btn_year`).text(translate('Year'));
         $('.lg-ess-home-right-menu .lg-ess-home-right-menu-container h2').text(translate('period_of_time'));

        /* Open Menue */
         $(document).on('click',`#${widgetID}-btnOpenRightMenu.js-menu_toggle.closed`,function(e){
            e.preventDefault(); 
            $(this).removeClass('closed').addClass('opened');
        
            $('.lg-ess-home-right-menu').css({ 'width':'250px' });
            $('.lg-ess-home-right-menu-container').css({ 'display':'block' });
            $('.lg-ess-home-right-menu-container h2').css({ 'opacity':'1' });
        
            $('.lg-ess-home-right_menu_item').each(function(i){
                var thisLI = $(this);
                setTimeout(function(){
                    thisLI.css({
                        'opacity':'1',
                        'margin-left':'0'
                    });
                },100*i);
            });
        });

        /* Close Menue */
        $(document).on('click',`#${widgetID}-btnOpenRightMenu.js-menu_toggle.opened`,function(e){
            e.preventDefault(); 
            $(this).removeClass('opened').addClass('closed');
        
            $('.lg-ess-home-right-menu').css({ 'width':'0px' });
            $('.lg-ess-home-right-menu-container').css({ 'display':'none' });
            $('.lg-ess-home-right-menu-container h2').css({ 'opacity':'0' });

            $('.lg-ess-home-right_menu_item').css({
                'opacity':'0',
                'margin-left':'30px'
            });
        }); 
        
        /* Right Menu Item click */
        $(document).on('click','.lg-ess-home-right_menu_item',function(e){
            e.preventDefault();
            $('.lg-ess-home-right_menu_item.selected').removeClass('selected');        
            $(this).addClass('selected');   
            const words = $(this).attr("id").split('_');
            strChart = words[1];
            newChart();

            /*Close Menue*/
            $(`#${widgetID}-btnOpenRightMenu.js-menu_toggle.opened`).removeClass('opened').addClass('closed');
        
            $('.lg-ess-home-right-menu').css({ 'width':'0px' });
            $('.lg-ess-home-right-menu-container').css({ 'display':'none' });
        
            $('.lg-ess-home-right_menu_item').css({
                'opacity':'0',
                'margin-left':'30px'
            });

        });
          
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

		})

        function loadChartData(strdate){
            let _date = strdate || new Date().toLocaleDateString('en-ca');
            $('.loading').css({ 'display':'block' });
            vis.conn._socket.emit('sendTo', instance, 'getChart', _date,function (data) {
                setTimeout(() => newChart(),500);
                $('.loading').css({ 'display':'none' });		
            });
        }

        function newChart(){
			var charts = createChart(strChart,strChartType);
            myChart1.clear();
            myChart2.clear();
            if(strChartType == "OverviewChart"){
                $chart1.removeClass("lg-ess-home-one-charts").addClass("lg-ess-home-two-charts");
                $chart2.removeClass("lg-ess-home-hide-chart");
                if (strChart == 'day')
                    $chart2.css({'width':`${$chart1.width()-40}px`});
                else
                    $chart2.css({'width':`100%`});

                myChart2.resize();
            } 
            else if((strChartType == "PvChart") || (strChartType == "EssChart") || (strChartType == "LoadChart")){
                $chart1.removeClass("lg-ess-home-two-charts").addClass("lg-ess-home-one-charts");
                $chart2.addClass("lg-ess-home-hide-chart");
            }

            if (charts && charts.chart1) myChart1.setOption(charts.chart1);
            if (charts && charts.chart2) myChart2.setOption(charts.chart2);
            myChart1.resize();

            /* Change Header text */
            if (strChartType == "OverviewChart")
                $strHeader.text(translate('energy_view'));
            else if (strChartType == "PvChart")
                $strHeader.text(translate('PV_diagram'));
            else if (strChartType == "EssChart")
                $strHeader.text(translate('ESS_diagram'));
            else if (strChartType == "LoadChart")
                $strHeader.text(translate('Load_diagram'));
        }

        // Change size of chart 2 when second yAxis is not shown at chart 1
        myChart1.on('legendselectchanged', function(params) {
            // State if legend is selected.
            var isSelected = params.selected[params.name];
            
            if (translate("Soc") == params.name){
                if ((strChartType == "OverviewChart") && (strChart == 'day') && (isSelected == true)  ){
                    $chart2.css({'width':`${$chart1.width()-40}px`});
                }
                else {
                    $chart2.css({'width':`100%`});
                } 
                myChart2.resize();       
            }
        });

        // subscribe on updates of value, we can use obj, newVal, oldVal
        function onChange(obj, newVal) {
            //newChart();			
		}

		const onresize = (dom_elem, callback) => {
			const resizeObserver = new ResizeObserver(() => callback() );
			resizeObserver.observe(dom_elem);
		};
						
		// Using constants to make it easier to read the code
		const widg = document.getElementById(widgetID);
			
		// Finally, register the observer for the dom_elem
		onresize(widg, function () {
			myChart1.resize();
            if ((strChartType == "OverviewChart") && (strChart == 'day')  ){
                $chart2.css({'width':`${$chart1.width()-40}px`});
            }
            else {
                $chart2.css({'width':`100%`});
            } 
			myChart2.resize();
		});

        const dateStringTxt = document.getElementById(`${widgetID}-strDate`);

        onresize(dateStringTxt, function () {
            const width = $(`#${widgetID}-strDate`).width();
            $( "#date_input" ).width(width);
            $( "#date_input" ).css({ 'margin-left':`${-width/2}px` })
		});
    },

};

vis.binds['lg-ess-home'].showVersion();