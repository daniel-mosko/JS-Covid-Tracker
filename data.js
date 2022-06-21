var cntry = "Slovakia";

async function getData() {
    const api_url_historical = 'https://disease.sh/v3/covid-19/historical/'+cntry+'?lastdays=100';
    const api_url_total = 'https://disease.sh/v3/covid-19/countries/'+cntry+'?strict=true';
    const response = await fetch(api_url_historical);
    const response2 = await fetch(api_url_total);
    const history_data = await response.json();
    const total_data = await response2.json();
    const flag_url = total_data.countryInfo.flag;
    var state = history_data.country;
    let cases = [];
    let labels = [];
    let recovered = [];
    let deaths = [];
    for (i in history_data.timeline.cases) {
        labels.push(i);
        cases.push(history_data.timeline.cases[i]);
    }
    for (i in history_data.timeline.recovered) {
        recovered.push(history_data.timeline.recovered[i]);
    }
    for (i in history_data.timeline.deaths) {
        deaths.push(history_data.timeline.deaths[i]);
    }
    return {
        flag_url,
        state,
        labels,
        cases,
        recovered,
        deaths
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function fillCards() {
    var flag = (await getData()).flag_url;
    var state = (await getData()).state;
    var cases = (await getData()).cases;
    var recovered = (await getData()).recovered;
    var deaths = (await getData()).deaths;
    document.getElementById("flag").src = flag;
    document.getElementById("state").innerHTML = state;
    document.getElementById("card_cases").innerHTML = numberWithCommas(cases[cases.length - 1]);
    document.getElementById("card_cases_new").innerHTML = '+ ' + numberWithCommas(cases[cases.length - 1] - cases[cases.length - 2]);
    document.getElementById("card_recovered").innerHTML = numberWithCommas(recovered[recovered.length - 1]);
    document.getElementById("card_recovered_new").innerHTML = '+ ' + numberWithCommas(recovered[recovered.length - 1] - recovered[recovered.length - 2]);
    document.getElementById("card_deaths").innerHTML = numberWithCommas(deaths[deaths.length - 1]);
    document.getElementById("card_deaths_new").innerHTML = '+ ' + numberWithCommas(deaths[deaths.length - 1] - deaths[deaths.length - 2]);
}

window.onload = async function generatePage() {

    // KARTY
    fillCards();
    var datumy = (await getData()).labels;
    var pripady = (await getData()).cases;
    var vylieceni = (await getData()).recovered;
    var umrtia = (await getData()).deaths;

    // GRAF
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datumy,
            datasets: [{
                label: 'Prípady',
                data: pripady,
                borderWidth: 2,
                borderColor: '#BB86FC',
                backgroundColor: 'rgba(25, 25, 255, 0.1)',
                pointRadius: 0,
                pointHitRadius: 10,
            }, {
                label: 'Vyliečení',
                data: vylieceni,
                borderWidth: 2,
                borderColor: 'rgb(64, 241, 64)',
                backgroundColor: 'rgb(64, 241, 64, 0.1)',
                pointRadius: 0,
                pointHitRadius: 10,
            }, {
                label: 'Úmrtia',
                data: umrtia,
                borderWidth: 2,
                borderColor: '#B00020',
                backgroundColor: 'rgb(241,39,39,0.1)',
                pointRadius: 0,
                pointHitRadius: 10,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'COVID-19'
            },
            layout: {
                padding: {
                    left: "10vh",
                    right: "10vh",
                    bottom: "10vh",
                    top: "10vh"
                }
            },
            tooltips: {
                mode: 'label',
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: 'rgba(229, 229, 229, 0.05)',
                        display: true
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Dátum'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: 'rgba(229, 229, 229, 0.05)',
                        display: false
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Počet'
                    }
                }]
            }
        }
    });
}