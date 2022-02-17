function init() {
    loadData();
    let select = document.getElementById('area1');
    let value = null;
    for (let area in DATA_HASH) {
        let option = document.createElement('option');
        option.value = area;
        option.innerText = area;
        select.appendChild(option);
        if (!value) {
            value = area;
        }
    }
    select.value = value;
    select.addEventListener('change', setArea);
    setArea();
    document.getElementById('area2').addEventListener('change', setArea2);
    setHead('tHead');
    setHead('nHead');
    setHead('sHead');
}

function loadData() {
    let DATA = {
        '[Ahr] Bad Neuenahr-Ahrweiler': BAD_N_DATA,
        '[Baden] Freiburg': FREIBURG_DATA,
        '[Franken] Würzburg': WURZBURG_DATA,
        '[Hess.Bergstrasse] Frankfurt': FRANKFURT_DATA,
        '[Mittelrhein] Bonn/Roleber': BONN_DATA,
        '[Mosel] Trier': TRIER_DATA,
        '[Nahe] Bad Kreuznach (an der Nahe)': NAHE_DATA,
        '[Pfalz(Nord)] Worms': WORMS_DATA,
        '[Pfalz(Süd)] Bad Bergzabern (Südpfalz)': BAD_B_DATA,
        '[Rheingau] Geisenheim': GEISENHEIM_DATA,
        '[Rheinhessen] Alzey': ALZEY_DATA,
        '[Saale-Unstrut] Leipzig': LEIPZIG_DATA,
        '[Sachsen] Dresden-Hosterwitz': DRESDEN_DATA,
        '[Württemberg] Stuttgart': STUTTGART_DATA,
    }
    for (let area in DATA) {
        console.log(area);
        let dataHash = {};
        dataHash.a = area;
        for (let i = DATA[area].length - 1; i >= 0; i--) {
            let data = DATA[area][i];
            if (!dataHash[data[0]]) {
                dataHash[data[0]] = {
                    t: [null, null, null, null, null, null, null, null, null, null, null, null],
                    n: [null, null, null, null, null, null, null, null, null, null, null, null],
                    s: [null, null, null, null, null, null, null, null, null, null, null, null],
                };
            }
            dataHash[data[0]].t[data[1] - 1] = parseFloat(data[2].replaceAll(',', '.'));
            dataHash[data[0]].n[data[1] - 1] = parseFloat(data[4].replaceAll(',', '.'));
            dataHash[data[0]].s[data[1] - 1] = parseFloat(data[6].replaceAll(',', '.'));
        }
        DATA_HASH[area] = dataHash;
    }
}

function setArea() {
    let area1 = document.getElementById('area1').value;
    var data = DATA_HASH[area1];
    let years = document.getElementById('years');
    while (years.childNodes.length > 0) {
        years.firstChild.remove();
    }
    for (let year in data) {
        if (isNaN(year)) {
            continue;
        }
        let span = document.createElement('span');
        span.innerText = year.toString();
        span.classList.add('year');
        span.addEventListener('click', toggleYear);
        years.appendChild(span);
    }
    let select = document.getElementById('area2');
    while (select.childNodes.length > 0) {
        select.firstChild.remove();
    }
    let option = document.createElement('option');
    option.value = '';
    option.innerText = '-----';
    select.appendChild(option);
    for (let area in DATA_HASH) {
        if (area != area1) {
            let option = document.createElement('option');
            option.value = area;
            option.innerText = area;
            select.appendChild(option);
        }
    }
    select.value = '';
    selectYears();
}

function setArea2() {
    let years = document.getElementById('years');
    for (let year of years.childNodes) {
        year.classList.remove('checkYear');
    }
    selectYears();
}


function toggleYear(event) {
    let check = event.target.classList.contains('checkYear');
    if (check) {
        event.target.classList.remove('checkYear');
        selectYears();
    } else {
        let years = document.getElementById('years');
        var cnt = 0;
        for (let year of years.querySelectorAll('span')) {
            if (year.classList && year.classList.contains('checkYear')) {
                cnt++;
            }
        }
        let max = SELECT_MAX;
        let area2 = document.getElementById('area2').value;
        if (area2) {
            max = max / 2;
        }
        if (cnt >= max) {
            alert('最大' + max + 'までしか選べません。');
        } else {
            event.target.classList.add('checkYear');
            selectYears();
        }
    }
}

function selectYears() {
    let years = [];
    let yearsList = document.getElementById('years');
    for (let year of yearsList.querySelectorAll('span')) {
        if (year.classList && year.classList.contains('checkYear')) {
            years.push(parseInt(year.innerText));
        }
    }
    if (years.length > 0) {
        let area1 = document.getElementById('area1').value;
        let area2 = document.getElementById('area2').value;
        let datahash = null;
        if (area2) {
            datahash = DATA_HASH[area2];
        }
        createChart(years, DATA_HASH[area1], datahash);
        document.getElementById('chart').style.display = 'block';
    } else {
        clearChart();
        document.getElementById('chart').style.display = 'none';
    }
}

const BACK_GROUND_COLORS = ['rgba(255,75,0,0.5)', 'rgba(0,90,255,0.5)', 'rgba(3,175,122,0.5)'
    , 'rgba(77,196,255,0.5)', 'rgba(246,170,0,0.5)', 'rgba(255,241,0,0.5)'];
const BACK_GROUND_COLORS2 = ['rgba(255,75,0,0.8)', 'rgba(0,90,255,0.8)', 'rgba(3,175,122,0.8)'
    , 'rgba(77,196,255,0.8)', 'rgba(246,170,0,0.8)', 'rgba(255,241,0,0.8)'];
const LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const SELECT_MAX = BACK_GROUND_COLORS.length;

var DATA_HASH = {};
var tChart = null;
var nChart = null;
var sChart = null;

function clearChart() {
    if (tChart) {
        tChart.destroy();
    }
    if (nChart) {
        nChart.destroy();
    }
    if (sChart) {
        sChart.destroy();
    }
    document.getElementById('tTable').innerHTML = '';
    document.getElementById('nTable').innerHTML = '';
    document.getElementById('sTable').innerHTML = '';
}

function createChart(years, data1, data2) {
    clearChart();
    let tSet = [];
    let nSet = [];
    let sSet = [];
    let p = 0;
    let dataList = [];
    if (data1) {
        dataList.push(data1);
    }
    if (data2) {
        dataList.push(data2);
    }
    for (let year of years) {
        for (let data of dataList) {
            if (data[year]) {
                let tdata = {
                    label: data.a + "\n" + year.toString(),
                    data: data[year].t,
                    backgroundColor: BACK_GROUND_COLORS[p % BACK_GROUND_COLORS.length],
                };
                let ndata = {
                    label: data.a + "\n" + year.toString(),
                    data: data[year].n,
                    backgroundColor: BACK_GROUND_COLORS[p % BACK_GROUND_COLORS.length],
                };
                let sdata = {
                    label: '',
                    data: data[year].s,
                    backgroundColor: BACK_GROUND_COLORS[p % BACK_GROUND_COLORS.length],
                    yAxisID: "y1",
                };
                let sumdata = [];
                let sum = 0.0;
                for (let val of data[year].s) {
                    if (val) {
                        sum += val;
                        sum = Math.round(sum * 100) / 100;
                        sumdata.push(sum);
                    } else {
                        sumdata.push(val);
                    }
                }
                let ldata = {
                    label: data.a + "\n" + year.toString(),
                    data: sumdata,
                    borderColor: BACK_GROUND_COLORS[p % BACK_GROUND_COLORS.length],
                    backgroundColor: BACK_GROUND_COLORS2[p % BACK_GROUND_COLORS2.length],
                    yAxisID: "y2",
                    type: 'line'
                }
                tSet.push(tdata);
                nSet.push(ndata);
                sSet.push(sdata);
                sSet.push(ldata);
                p++;
            }
        }
    }
    tChart = drawChart('tChart', tSet);
    createTable('tTable', tSet);
    nChart = drawChart('nChart', nSet);
    createTable('nTable', nSet);
    sChart = drawChart2('sChart', sSet);
    createTable2('sTable', sSet);
}

function drawChart(id, set) {
    return new Chart(document.getElementById(id).getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: LABELS,
                datasets: set,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0,
                },
                hover: {
                    animationDuration: 0,
                },
                responsiveAnimationDuration: 0,
            }
        });
}

function drawChart2(id, set) {
    return new Chart(document.getElementById(id).getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: LABELS,
                datasets: set,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0,
                },
                hover: {
                    animationDuration: 0,
                },
                responsiveAnimationDuration: 0,
                scales: {
                    y1: {
                        position: 'left',
                    },
                    y2: {
                        position: 'right',
                    },
                }
            }
        });
}

function createTable(id, set) {
    let element = document.getElementById(id);
    element.innerHTML = '';
    for (let line of set) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.classList.add('area');
        td.innerText = line.label;
        tr.appendChild(td);
        for (let value of line.data) {
            let td = document.createElement('td');
            td.classList.add('data');
            td.innerText = value;
            tr.appendChild(td);
        }
        element.appendChild(tr);
    }
}

function createTable2(id, set) {
    let element = document.getElementById(id);
    element.innerHTML = '';
    for (let i = 0; i < set.length; i++) {
        let line = set[i];
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.classList.add('area');
        if (i % 2 == 0) {
            td.innerText = set[i + 1].label;
        } else {
            td.innerText = line.label;
        }
        tr.appendChild(td);
        for (let value of line.data) {
            let td = document.createElement('td');
            td.classList.add('data');
            td.innerText = value;
            tr.appendChild(td);
        }
        element.appendChild(tr);
    }
}

function setHead(id) {
    let element = document.getElementById(id);
    element.innerHTML = '';
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.classList.add('data');
    th.innerText = "[taggen]ort\nJahr";
    tr.appendChild(th);
    for (let label of LABELS) {
        let th = document.createElement('th');
        th.classList.add('data');
        th.innerText = label;
        tr.appendChild(th);
    }
    element.appendChild(tr);
}

window.addEventListener('load', init);


