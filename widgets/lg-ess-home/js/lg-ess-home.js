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
        'PvForecastInstance': {
            'en': 'PV Forecast Adapter',
            'de': 'PV Forecast Adapter',
            'ru': 'PV Прогноз адаптер',
            'pt': 'Adaptador de previsão PV',
            'nl': 'PV Forecast Adap',
            'fr': 'Adaptateur de prévision PV',
            'it': 'Adattatore di previsione del fotovoltaico',
            'es': 'Adaptador de predicción PV',
            'pl': 'PV Forecast Adapter',
            'uk': 'Адаптер прогнозу PV',
            'zh-cn': 'PV 广播'
        },
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
        'Generation': {
            'en': 'Generation',
            'de': 'Erzeugung',
            'ru': 'Поколение',
            'pt': 'Geração',
            'nl': 'Generatie',
            'fr': 'Génération',
            'it': 'Generazione',
            'es': 'Generacion',
            'pl': 'Pokolenie',
            'zh-cn': '一代'
        },
        'Consumption': {
            'en': 'Consumption',
            'de': 'Verbrauch',
            'ru': 'Потребление',
            'pt': 'Consumo',
            'nl': 'Consumptie',
            'fr': 'Consommation',
            'it': 'Consumo',
            'es': 'Consumo',
            'pl': 'Konsumpcja',
            'zh-cn': '消耗'
        },
    	'Feed_in': {
            'en': 'Power grid feed-in',
            'de': 'Netzeinspeisung',
            'ru': 'Подача электроэнергии в сеть',
            'pt': 'Alimentação da rede elétrica',
            'nl': 'Teruglevering aan het elektriciteitsnet',
            'fr': 'Alimentation du réseau électrique',
            'it': 'Immissione in rete elettrica',
            'es': 'Alimentación a la red eléctrica',
            'pl': 'Zasilanie sieci energetycznej',
            'zh-cn': '电网馈入'
        },
	    'Purchased': {
            'en': 'Purchased electricity',
            'de': 'gekaufter Strom',
            'ru': 'Купленная электроэнергия',
            'pt': 'Eletricidade comprada',
            'nl': 'Ingekochte elektriciteit',
            'fr': 'Électricité achetée',
            'it': 'Energia elettrica acquistata',
            'es': 'Electricidad comprada',
            'pl': 'Zakupiona energia elektryczna',
            'zh-cn': '购买的电力'
        },
        'Direct_consumption': {
            'en': 'direct consumption',
            'de': 'direkter Verbrauch',
            'ru': 'прямое потребление',
            'pt': 'consumo direto',
            'nl': 'directe consumptie',
            'fr': 'consommation directe',
            'it': 'consumo diretto',
            'es': 'consumo directo',
            'pl': 'bezpośrednie spożycie',
            'zh-cn': '直接消费'
        },
        'Discharge': {
            'en': 'Discharge',
            'de': 'Entladen',
            'ru': 'Разрядить',
            'pt': 'Descarregar',
            'nl': 'ontladen',
            'fr': 'Décharger',
            'it': 'Scarica',
            'es': 'descargar',
            'pl': 'Rozładuj',
            'zh-cn': '不充电'
        },
        'Charge': {
            'en': 'Charge',
            'de': 'Aufladen',
            'ru': 'Обвинение',
            'pt': 'Cobrar',
            'nl': 'Aanval',
            'fr': 'Charger',
            'it': 'Caricare',
            'es': 'Cargo',
            'pl': 'Opłata',
            'zh-cn': '收费'
        },
        'Soc': {
            'en': 'State of charge',
            'de': 'Ladezustand',
            'ru': 'Состояние заряда',
            'pt': 'Estado de cobrança',
            'nl': 'Staat van het opladen',
            'fr': 'État de charge',
            'it': 'Stato di carica',
            'es': 'Estado de carga',
            'pl': 'Stan naładowania',
            'zh-cn': '充电状态'
        },
        'Day': {
            'en': 'Day',
            'de': 'Tag',
            'ru': 'День',
            'pt': 'Dia',
            'nl': 'Dag',
            'fr': 'Jour',
            'it': 'Giorno',
            'es': 'Día',
            'pl': 'Dzień',
            'zh-cn': '日'
        },
        'Week': {
            'en': 'Week',
            'de': 'Woche',
            'ru': 'Неделю',
            'pt': 'Semana',
            'nl': 'Week',
            'fr': 'Semaine',
            'it': 'Settimana',
            'es': 'Semana',
            'pl': 'Tydzień',
            'zh-cn': '星期'
        },
        'Month': {
            'en': 'Month',
            'de': 'Monat',
            'ru': 'Месяц',
            'pt': 'Mês',
            'nl': 'Maand',
            'fr': 'Mois',
            'it': 'Mese',
            'es': 'Mes',
            'pl': 'Miesiąc',
            'zh-cn': '月'
        },
        'Year': {
            'en': 'Year',
            'de': 'Jahr',
            'ru': 'Год',
            'pt': 'Ano',
            'nl': 'Jaar',
            'fr': 'An',
            'it': 'Anno',
            'es': 'Año',
            'pl': 'Rok',
            'zh-cn': '年'
        },
        'energy_view': {
            'en': 'energy view',
            'de': 'Energieansicht',
            'ru': 'вид энергии',
            'pt': 'visão de energia',
            'nl': 'energie weergave',
            'fr': 'vue énergétique',
            'it': 'vista energetica',
            'es': 'vista de energía',
            'pl': 'widok energii',
            'zh-cn': '能量观'
        },
        'PV_diagram': {
            'en': 'PV diagram',
            'de': 'PV-Diagramm',
            'ru': 'PV-диаграмма',
            'pt': 'diagrama PV',
            'nl': 'PV-diagram',
            'fr': 'Diagramme photovoltaïque',
            'it': 'Diagramma fotovoltaico',
            'es': 'diagrama fotovoltaico',
            'pl': 'Schemat fotowoltaiczny',
            'zh-cn': '光伏图'
        },
        'ESS_diagram': {
            'en': 'ESS diagram',
            'de': 'ESS-Diagramm',
            'ru': 'диаграмма ЭСС',
            'pt': 'Diagrama ESS',
            'nl': 'ESS-diagram',
            'fr': 'Schéma SSE',
            'it': 'Diagramma ESS',
            'es': 'diagrama SEE',
            'pl': 'Schemat ESS',
            'zh-cn': 'ESS图'
        },
        'Load_diagram': {
            'en': 'Load diagram',
            'de': 'Last-Diagramm',
            'ru': 'Диаграмма нагрузки',
            'pt': 'Diagrama de carga',
            'nl': 'Laad diagram',
            'fr': 'Diagramme de charge',
            'it': 'Diagramma di carico',
            'es': 'Diagrama de carga',
            'pl': 'Schemat obciążenia',
            'zh-cn': '负载图'
        },
        'group_colorLgEssHome': {
            'en': 'Colors',
            'de': 'Farben',
            'ru': 'Цвета',
            'pt': 'Cores',
            'nl': 'kleuren',
            'fr': 'Couleurs',
            'it': 'Colori',
            'es': 'Colores',
            'pl': 'Zabarwienie',
            'zh-cn': '颜色'
        },
        'group_PvForecast': {
            'en': 'PV Forecast',
            'de': 'PV-Vorhersage',
            'ru': 'PV Прогноз',
            'pt': 'Previsão de PV',
            'nl': 'PV Forast',
            'fr': 'PV Prévisions',
            'it': 'Previsioni',
            'es': 'PV Forecast',
            'pl': 'PV Forecast',
            'uk': 'ПВ прогноз',
            'zh-cn': '传真:'
        },
        'PvForecastColor': {
            'en': 'PV Forecast',
            'de': 'PV-Vorhersage',
            'ru': 'PV Прогноз',
            'pt': 'Previsão de PV',
            'nl': 'PV Forast',
            'fr': 'PV Prévisions',
            'it': 'Previsioni',
            'es': 'PV Forecast',
            'pl': 'PV Forecast',
            'uk': 'ПВ прогноз',
            'zh-cn': '传真:'
        },
        'Charts': {
            'en': 'Charts',
            'de': 'Diagramme',
            'ru': 'Графики',
            'pt': 'Gráficos',
            'nl': 'Grafieken',
            'fr': 'Graphiques',
            'it': 'Grafici',
            'es': 'Gráficos',
            'pl': 'Wykresy',
            'zh-cn': '图表'
        },
        'period_of_time': {
            'en': 'period of time',
            'de': 'Zeitspanne',
            'ru': 'период времени',
            'pt': 'período de tempo',
            'nl': 'periode',
            'fr': 'période de temps',
            'it': 'periodo di tempo',
            'es': 'período de tiempo',
            'pl': 'okres czasu',
            'zh-cn': '一段的时间'
        },
        'No_data_available': {
            'en': 'No data available ',
            'de': 'Keine Daten verfügbar',
            'ru': 'Данные недоступны',
            'pt': 'Nenhum dado disponível',
            'nl': 'Geen gegevens beschikbaar',
            'fr': 'Pas de données disponibles',
            'it': 'Nessun dato disponibile',
            'es': 'Datos no disponibles',
            'pl': 'Brak dostępnych danych',
            'zh-cn': '无可用数据'
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

        const instance = data._data.lgEssInstance || 'lg-ess-home.0';

        //Erzeugung: #ff0064, Direkter Verbrauch #abafd7, Laden: #bded71, Einspeisung: #f5c04d
        let _colorGen = '#ff0064';
        let _colorDirect = '#abafd7';
        let _colorCharge  = '#bded71';
        let _colorFeedIn = '#f5c04d';
        let _colorSoc = '#ff8400';
        let _colorPvForecast = '#000000';

        //Verbrauch: #ff0064, Direkter Verbrauch #abafd7, Entladen: #a3eded, Gekauft: #f08881
        let _colorPur  = '#f08881';
        let _colorDischarge = '#a3eded';
        let _colorCons = '#ff0064';

        _colorPur = data._data.Purchased;
        _colorGen = data._data.Generation;
        _colorDirect = data._data.Direct_consumption;
        _colorCharge = data._data.Charge;
        _colorFeedIn = data._data.Feed_in;
        _colorDischarge = data._data.Discharge;
        _colorCons = data._data.Consumption;
        _colorSoc = data._data.Soc;
        const _pvForecast = data._data.PvForecastInstance;
        _colorPvForecast = data._data.PvForecastColor;
        const _widgetID = widgetID;

        console.log(new Date().toLocaleTimeString() + ' Lg-Ess[' + widgetID + ']: Trying to render widget');
        const $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['lg-ess-home'].createWidget(widgetID, view, data, style);
            }, 100);
        }
        let strChart = 'day';
        let strChartType = 'OverviewChart';

        let text = '';

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

        text += `<div class="loading">Loading&#8230;</div>`;
        text += `<div class="lg-ess-home-error">`;
        text += `   <div class="lg-ess-home-error-symbol">&#9888</div>`;
        text += `   <div class="lg-ess-home-error-text">keine Daten vorhanden</div>`;
        text += `</div>`;

        text += `<div class="lg-ess-home-timebar">`;
        text += `   <div>`;
        text += `	    <button id="${widgetID}-btnBackward" class="backward" href="#"><<</button>`;
        text += `       <button id="${widgetID}-strDate"></button>`;
        text += `       <button id="${widgetID}-btnForward" class="forward last">>></button>`;
        text += `   </div>`;

        text += `   <div>`;
        text += `       <input name="date" id="date_input" required></input>`;
        text += `   </div>`;
        text += `</div>`;


        text += `<div id="${widgetID}-strTotal"class="lg-ess-home-total"></div>`;

        text += `<div id="${widgetID}-Chart1" class="lg-ess-home-two-charts"></div>`;
        text += `<div id="${widgetID}-Chart2" class="lg-ess-home-two-charts"></div>`;

        //Add html
        $div.html(text);

        const $chart1 = $(`#${widgetID}-Chart1`);
        const $chart2 = $(`#${widgetID}-Chart2`);

        const $strHeader = $(`#${widgetID}-strHeader`);

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
            const date = new Date(selectedDate);
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

            let date = new Date(selectedDate);
            if (strChart == 'day')
                date.setDate(date.getDate() + 1);
            else if (strChart == 'week')
                date.setDate(date.getDate() + 7);
            else if (strChart == 'month')
                date.setMonth(date.getMonth() + 1);
            else if (strChart == 'year')
                date.setDate(date.getDate() + 365);

            const today = new Date();
            if (date > today) date = today;

            selectedDate = date.toLocaleDateString('en-ca');
            loadChartData(selectedDate);

            if (today.toDateString() == date.toDateString())
                $( `#${widgetID}-btnForward`).addClass('last');
        });

        /* Selected date changed */
        $( '#date_input' ).change(function() {
            const today = new Date();
            const date = new Date((this).value);
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
                const thisLI = $(this);
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
            const words = $(this).attr('id').split('_');
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
                const thisLI = $(this);
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
            const words = $(this).attr('id').split('_');
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
        const myChart1 = echarts.init(document.getElementById(widgetID +'-Chart1'));
        const myChart2 = echarts.init(document.getElementById(widgetID +'-Chart2'));

        const dps = [
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
            _pvForecast,
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

        });

        function loadChartData(strdate){
            const _date = strdate || new Date().toLocaleDateString('en-ca');
            $('.loading').css({ 'display':'block' });
            vis.conn._socket.emit('sendTo', instance, 'getChart', _date,function (data) {
                setTimeout(() => newChart(),500);
                $('.loading').css({ 'display':'none' });
            });
        }

        function newChart(){
            const charts = createChart(strChart,strChartType);
            myChart1.clear();
            myChart2.clear();
            if(strChartType == 'OverviewChart'){
                $chart1.removeClass('lg-ess-home-one-charts').addClass('lg-ess-home-two-charts');
                $chart2.removeClass('lg-ess-home-hide-chart');
                if (strChart == 'day')
                    $chart2.css({'width':`${$chart1.width()-40}px`});
                else
                    $chart2.css({'width':`100%`});

                myChart2.resize();
            }
            else if((strChartType == 'PvChart') || (strChartType == 'EssChart') || (strChartType == 'LoadChart')){
                $chart1.removeClass('lg-ess-home-two-charts').addClass('lg-ess-home-one-charts');
                $chart2.addClass('lg-ess-home-hide-chart');
            }

            if (charts && charts.chart1) myChart1.setOption(charts.chart1);
            if (charts && charts.chart2) myChart2.setOption(charts.chart2);
            myChart1.resize();

            /* Change Header text */
            if (strChartType == 'OverviewChart')
                $strHeader.text(translate('energy_view'));
            else if (strChartType == 'PvChart')
                $strHeader.text(translate('PV_diagram'));
            else if (strChartType == 'EssChart')
                $strHeader.text(translate('ESS_diagram'));
            else if (strChartType == 'LoadChart')
                $strHeader.text(translate('Load_diagram'));
        }

        // Change size of chart 2 when second yAxis is not shown at chart 1
        myChart1.on('legendselectchanged', function(params) {
            // State if legend is selected.
            const isSelected = params.selected[params.name];

            if (translate('Soc') == params.name){
                if ((strChartType == 'OverviewChart') && (strChart == 'day') && (isSelected == true)  ){
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
            if ((strChartType == 'OverviewChart') && (strChart == 'day')  ){
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
            $( '#date_input' ).width(width);
            $( '#date_input' ).css({ 'margin-left':`${-width/2}px` });
        });



        function createChart(strChart, strChartType){
            const strPv = instance + '.user.graph.pv.' + strChart +'.val';
            const strLoad = instance + '.user.graph.load.' + strChart +'.val';
            const strBatt = instance + '.user.graph.batt.' + strChart +'.val';
            const strForecast = _pvForecast +'.val';
            let jsonForecast;
            const jsonPv = JSON.parse(vis.states[strPv]);
            const jsonBatt = JSON.parse(vis.states[strBatt]);
            const jsonLoad = JSON.parse(vis.states[strLoad]);
            if (vis.states[strForecast]){
                jsonForecast = JSON.parse(vis.states[strForecast]);
            }

            /* Create Date string */
            let strTitle;
            if (strChart == 'year'){
                strTitle = convertFromStringToDate(jsonPv.m_timeFrom).toLocaleDateString([],{year: 'numeric'});
            }
            else if (strChart == 'month'){
                strTitle = convertFromStringToDate(jsonPv.m_timeFrom).toLocaleDateString([],{year: 'numeric',  month: 'long'});
            }
            else if ((strChart == 'day') || (strChart == 'week')){
                strTitle = convertFromStringToDate(jsonPv.m_timeFrom).toLocaleDateString([],{year: 'numeric',  month: '2-digit', day: '2-digit'});
            }
            if (strChart == 'week'){
                strTitle = strTitle  + ' - ' + convertFromStringToDate(jsonPv.m_timeTo).toLocaleDateString([],{year: 'numeric',  month: '2-digit', day: '2-digit'});
            }
            $(`#${_widgetID}-strDate`).text(strTitle);

            if ((jsonPv.db != 'success')||(jsonBatt.db != 'success')||(jsonLoad.db != 'success')){
                $('.lg-ess-home-error').css({ 'display':'block' });
                $(`#${_widgetID}-strTotal`).html('');
                return;
            }
            $('.lg-ess-home-error').css({ 'display':'none' });


            if (strChartType == 'OverviewChart'){
                var charts = createOverviewCharts(strChart,jsonPv, jsonBatt,jsonLoad,jsonForecast);
                var chart1 = charts.chartGen;
                const chart2 = charts.chartPurch;
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
            let chartType;
            let unit;
            let timeOptions;
            let factor;

            const today = new Date();
            let showForecast = (today.toDateString() == convertFromStringToDate(jsonPv.loginfo[0].time).toDateString()) && (strChart == 'day');

            if (!jsonForecast || !jsonForecast[0]  || !jsonForecast[0].t) {
                console.log('Forecast Data not valid');
                showForecast = false;
            }

            if (strChart == 'day'){
                chartType = 'line';
                unit = 'kW';
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
            const chartGen = createBasicChart(unit);
            chartGen.series.push({
                name: translate('Feed_in'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                stack: 'Stack',
                areaStyle: {},
                data: []
            });
            chartGen.series.push({
                name: translate('Charge'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                stack: 'Stack',
                areaStyle: {},
                data: []
            });
            chartGen.series.push({
                name: translate('Direct_consumption'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                stack: 'Stack',
                areaStyle: {},
                data: []
            });
            chartGen.series.push({
                name: translate('Generation'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                barWidth: 5,
                data: []
            });

            // Specify the configuration items and data for the chart
            const chartPurch = createBasicChart(unit);
            chartPurch.series.push({
                name: translate('Purchased'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                stack: 'Stack',
                areaStyle: {},
                data: []
            });
            chartPurch.series.push({
                name: translate('Discharge'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                stack: 'Stack',
                areaStyle: {},
                data: []
            });
            chartPurch.series.push({
                name: translate('Direct_consumption'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                stack: 'Stack',
                areaStyle: {},
                data: []
            });
            chartPurch.series.push({
                name: translate('Consumption'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                barWidth: 5,
                data: []
            });

            if (strChart == 'day'){
                chartGen.series.push(
                    {
                        name: translate('Soc'),
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
                    });

                if (showForecast == true){

                    chartGen.series.push({
                        name: translate('group_PvForecast'),
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
            let indexForecast = 0;

            // round forecast time
            if (showForecast == true){
                jsonForecast[0].t = roundDate(new Date(jsonForecast[0].t),15).valueOf();
            }

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
                chartGen.series[0].data.push(feedIn);

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
                    const time = convertFromStringToDate(jsonPv.loginfo[i].time).valueOf();

                    if (time < jsonForecast[0].t){
                        chartGen.series[5].data.push(0);
                    }
                    else if (time === jsonForecast[indexForecast].t){
                        console.log('Test ' + jsonForecast[indexForecast].y);
                        chartGen.series[5].data.push(jsonForecast[indexForecast].y);
                        indexForecast++;
                    }
                    else if (indexForecast > 0){
                        chartGen.series[5].data.push((jsonForecast[indexForecast].y + jsonForecast[indexForecast-1].y)/2);
                    }

                }
            }

            //Legend
            chartGen.legend.data.push(translate('Generation'));
            chartGen.legend.data.push(translate('Direct_consumption'));
            chartGen.legend.data.push(translate('Charge'));
            chartGen.legend.data.push(translate('Feed_in'));
            if (strChart == 'day'){
                chartGen.legend.data.push(translate('Soc'));
            }
            if (showForecast == true){
                chartGen.legend.data.push(translate('group_PvForecast'));
            }

            chartPurch.legend.data.push(translate('Consumption'));
            chartPurch.legend.data.push(translate('Direct_consumption'));
            chartPurch.legend.data.push(translate('Discharge'));
            chartPurch.legend.data.push(translate('Purchased'));

            //Colors
            chartGen.color = [_colorFeedIn, _colorCharge, _colorDirect, _colorGen, _colorSoc, _colorPvForecast];
            chartPurch.color = [_colorPur , _colorDischarge, _colorDirect, _colorCons];

            return {chartGen,chartPurch};
        }

        function createPvCharts(strChart,jsonPv){
            let chartType;
            let unit;
            let timeOptions;
            let factor;
            if (strChart == 'day'){
                chartType = 'line';
                unit = 'kW';
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
            const chartPv = createBasicChart(unit);
            chartPv.series.push({
                name: translate('Generation'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                areaStyle: {},
                data: []
            });
            chartPv.series.push({
                name: translate('Feed_in'),
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
                chartPv.series[1].data.push(feedIn);
            }

            //Legend
            chartPv.legend.data.push(translate('Generation'));
            chartPv.legend.data.push(translate('Feed_in'));

            //Colors
            chartPv.color = [_colorGen, _colorFeedIn];

            let total_feed_in;
            if (jsonPv.loginfo[jsonPv.loginfo.length-1].total_Feed_in) total_feed_in = jsonPv.loginfo[jsonPv.loginfo.length-1].total_Feed_in;
            if (jsonPv.loginfo[jsonPv.loginfo.length-1].total_feed_in) total_feed_in = jsonPv.loginfo[jsonPv.loginfo.length-1].total_feed_in;

            //Footer
            let footer = `<span class="marker" style="background-color:${_colorGen};"></span>`;
            footer += `<span> ${translate('Generation')}: ${(jsonPv.loginfo[jsonPv.loginfo.length-1].total_generation * 0.001).toFixed(3)} kWh  </span>`;
            footer += `<span class="marker" style="background-color:${_colorFeedIn};"></span>`;
            footer += `<span> ${translate('Feed_in')} ${(total_feed_in * 0.001).toFixed(3)} kWh</span>`;

            return {chartPv, footer};
        }

        function createEssCharts(strChart,jsonBatt){
            let chartType;
            let unit;
            let timeOptions;
            let factor;
            if (strChart == 'day'){
                chartType = 'line';
                unit = 'kW';
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
            const chartEss = createBasicChart(unit);
            chartEss.series.push({
                name: translate('Charge'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                areaStyle: {},
                data: []
            });
            chartEss.series.push({
                name: translate('Discharge'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                areaStyle: {},
                data: []
            });
            if (strChart == 'day'){
                chartEss.series.push(
                    {
                        name: translate('Soc'),
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
                    });
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
            chartEss.legend.data.push(translate('Charge'));
            chartEss.legend.data.push(translate('Discharge'));
            if (strChart == 'day'){
                chartEss.legend.data.push(translate('Soc'));
            }

            //Colors
            chartEss.color = [_colorCharge, _colorDischarge, _colorSoc];

            //Footer
            let footer = `<span class="marker" style="background-color:${_colorCharge};"></span>`;
            footer += `<span> ${translate('Charge')}: ${(jsonBatt.loginfo[jsonBatt.loginfo.length-1].total_charge * 0.001).toFixed(3)} kWh   </span>`;
            footer += `<span class="marker" style="background-color:${_colorDischarge};"></span>`;
            footer += `<span> ${translate('Discharge')} ${(jsonBatt.loginfo[jsonBatt.loginfo.length-1].total_discharge * 0.001).toFixed(3)} kWh</span>`;

            return {chartEss, footer};
        }

        function createLoadCharts(strChart,jsonLoad){
            let chartType;
            let unit;
            let timeOptions;
            let factor;
            if (strChart == 'day'){
                chartType = 'line';
                unit = 'kW';
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
            const chartLoad = createBasicChart(unit);
            chartLoad.series.push({
                name: translate('Consumption'),
                type: chartType,
                smooth: true,
                symbol: 'none',
                stack: 'Stack',
                areaStyle: {},
                data: []
            });
            chartLoad.series.push({
                name: translate('Purchased'),
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
            chartLoad.legend.data.push(translate('Consumption'));
            chartLoad.legend.data.push(translate('Purchased'));

            //Colors
            chartLoad.color = [_colorCons, _colorPur];

            //Footer
            let footer = `<span class="marker" style="background-color:${_colorCons};"></span>`;
            footer += `<span> ${translate('Consumption')}: ${(jsonLoad.loginfo[jsonLoad.loginfo.length-1].total_consumption * 0.001).toFixed(3)} kWh   </span>`;
            footer += `<span class="marker" style="background-color:${_colorPur};"></span>`;
            footer += `<span> ${translate('Purchased')} ${(jsonLoad.loginfo[jsonLoad.loginfo.length-1].total_purchase * 0.001).toFixed(3)} kWh</span>`;

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

        function roundDate(date, minuten) {
            const factor = minuten * 6e4;
            return new Date(Math.round(date / factor) * factor);
        }

        // Translate function
        function translate(text) {
            if (!text) return '';
            const lang = vis.language;
            text = text.toString();

            if (typeof text !== 'string') {
                console.warn('Trying to translate non-text:' + text);
            } else if (systemDictionary[text]) {
                let newText = systemDictionary[text][lang];
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
            const year = dateString.substr(0,4);
            const month = dateString.substr(4,2);
            const day = dateString.substr(6,2);
            const hour = dateString.substr(8,2);
            const minutes = dateString.substr(10,2);
            const seconds = dateString.substr(12,2);

            return(new Date(year, month - 1, day,
                hour, minutes, seconds));
        }




    },

};

vis.binds['lg-ess-home'].showVersion();