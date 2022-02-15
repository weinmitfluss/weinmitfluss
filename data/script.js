function init() {
    loadData();
    let select = document.getElementById('area');
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
    setHead('tHead');
    setHead('nHead');
    setHead('sHead');
}

function loadData() {
    let TRIER_DATA_HASH = {};
    for (let i = TRIER_DATA.length - 1; i >= 0; i--) {
        let data = TRIER_DATA[i];
        if (!TRIER_DATA_HASH[data[0]]) {
            TRIER_DATA_HASH[data[0]] = {
                t: [null, null, null, null, null, null, null, null, null, null, null, null],
                n: [null, null, null, null, null, null, null, null, null, null, null, null],
                s: [null, null, null, null, null, null, null, null, null, null, null, null],
            };
        }
        TRIER_DATA_HASH[data[0]].t[data[1] - 1] = parseFloat(data[2].replaceAll(',', '.'));
        TRIER_DATA_HASH[data[0]].n[data[1] - 1] = parseFloat(data[4].replaceAll(',', '.'));
        TRIER_DATA_HASH[data[0]].s[data[1] - 1] = parseFloat(data[6].replaceAll(',', '.'));
    }
    DATA_HASH['Trier'] = TRIER_DATA_HASH;
}

function setArea() {
    let area = document.getElementById('area').value;
    var data = DATA_HASH[area];
    let years = document.getElementById('years');
    while (years.childNodes.length > 0) {
        years.firstChild.remove();
    }
    for (let year in data) {
        let span = document.createElement('span');
        span.innerText = year.toString();
        span.classList.add('year');
        span.addEventListener('click', toggleYear);
        years.appendChild(span);
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
        if (cnt >= 6) {
            alert('最大6までしか選べません。');
        } else {
            event.target.classList.add('checkYear');
            selectYears();
        }
    }
}

function selectYears() {
    let area = document.getElementById('area').value;
    let years = [];
    let yearsList = document.getElementById('years');
    for (let year of yearsList.querySelectorAll('span')) {
        if (year.classList && year.classList.contains('checkYear')) {
            years.push(parseInt(year.innerText));
        }
    }
    if (years.length > 0) {
        createChart(years, DATA_HASH[area]);
        document.getElementById('chart').style.display = 'block';
    } else {
        clearChart();
        document.getElementById('chart').style.display = 'none';
    }
}

const BACK_GROUND_COLORS = ['#FF4B00', '#005AFF', '#03AF7A', '#4DC4FF', '#F6AA00', '#FFF100'];
const LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

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

function createChart(years, data) {
    clearChart();
    let tSet = [];
    let nSet = [];
    let sSet = [];
    let p = 0;
    for (let year of years) {
        if (data[year]) {
            let tdata = {
                label: year.toString(),
                data: data[year].t,
                backgroundColor: BACK_GROUND_COLORS[p % BACK_GROUND_COLORS.length]
            };
            let ndata = {
                label: year.toString(),
                data: data[year].n,
                backgroundColor: BACK_GROUND_COLORS[p % BACK_GROUND_COLORS.length]
            };
            let sdata = {
                label: year.toString(),
                data: data[year].n,
                backgroundColor: BACK_GROUND_COLORS[p % BACK_GROUND_COLORS.length]
            };
            tSet.push(tdata);
            nSet.push(ndata);
            sSet.push(sdata);
            p++;
        }
    }
    tChart = drawChart('tChart', tSet);
    createTable('tTable', tSet);
    nChart = drawChart('nChart', nSet);
    createTable('nTable', nSet);
    sChart = drawChart('sChart', sSet);
    createTable('sTable', sSet);
}

function drawChart(id, set) {
    return new Chart(document.getElementById(id).getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: LABELS,
                datasets: set,
            }
        });
}

function createTable(id, set) {
    let element = document.getElementById(id);
    element.innerHTML = '';
    for (let line of set) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerText = line.label;
        tr.appendChild(td);
        for (let value of line.data) {
            let td = document.createElement('td');
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
    th.innerText = 'Jahr';
    tr.appendChild(th);
    for (let label of LABELS) {
        let th = document.createElement('th');
        th.innerText = label;
        tr.appendChild(th);
    }
    element.appendChild(tr);
}

window.addEventListener('load', init);


