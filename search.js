'use strict';

const DATA_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=Ck_8iWyBMuAAKcEW_TbafWC5Ta1NJyieS-dxLI4khVmITjhV9R16g2cIDxvPqaNwVxvt4hXN3Iu9Ghqo0hfUt7sjrN_ipT2_m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMPJeHxv25f9qoS9yDuMEjSoCsJYRNmt_qBZsGKrx9wSbCrxbLMd0Gwe9PxFQX8w-ltRP5uKlu21V7H6D3yDXGUm_JjsbyT8wtz9Jw9Md8uu&lib=MAwm_JUE8IwHoQhnd5-nbUEzgwH7sehr_";

var event_data = [];

function init() {
    fetch(DATA_URL, {
        method: 'GET',
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log('Success:', data);
        event_data = data;
        setContents();
        getEBI("input").addEventListener("change", onChange);
        getEBI("input").addEventListener("keyup", onChange);
        getEBI("popup").addEventListener("click", hidePop);
        getEBI("layer").addEventListener("click", hidePop);
        getEBI("search").style.display = 'block';
        getEBI("loading").style.display = 'none';
        console.log('Finish');
    }).catch((error) => {
        console.error('Error:', error);
        alert("データ取得失敗\n" + error.message);
    });
}

function getEBI(id) {
    return document.getElementById(id);
}

function createDiv(clazz, text) {
    let div = document.createElement("div");
    div.className = clazz;
    div.innerHTML = text;
    return div;
}

function createBr() {
    return document.createElement("br");
}

function createImg(src) {
    let img = document.createElement("img");
    img.src = "./img/cam.png";
    img.className = "imgicon";
    img.setAttribute("data-img", src);
    img.addEventListener("click", showPop);
    let div = createDiv("center", "");
    div.appendChild(img);
    return div;
}

function createImg2(gid) {
    let src = "http://drive.google.com/uc?export=view&id=" + encodeURIComponent(gid);
    return createImg(src);
}

function showPop(event) {
    let src = event.target.getAttribute("data-img");
    getEBI("popup").src = src;
    getEBI("popup").style.display = "block";
    getEBI("layer").style.display = "block";
}

function hidePop() {
    getEBI("popup").style.display = "none";
    getEBI("layer").style.display = "none";
}

function createDetails(id, title, event) {
    let details = document.createElement("details");
    let summary = document.createElement("summary");
    summary.innerHTML = title;
    details.id = id;
    details.appendChild(summary);
    details.appendChild(event);
    return details;
}

function setContents() {
    let total = event_data.length;
    for (let i = 0; i < event_data.length; i++) {
        let title = event_data[i].title_ja;
        let contents = event_data[i].contents_ja;
        let event = document.createElement("div");
        event.className = "content";
        for (let j = 0; j < contents.length; j++) {
            let data = contents[j];
            if (data[0] == "skip") {
                console.log("skip", data[0], data[1]);
            } else if (data[0] == "br") {
                event.appendChild(createBr());
            } else if (data[0] == "img") {
                event.appendChild(createImg(data[1]));
            } else if (data[0] == "img2") {
                event.appendChild(createImg2(data[1]));
            } else {
                event.appendChild(createDiv(data[0], data[1]));
            }
        }
        getEBI("contents").appendChild(createDetails("details-" + i, title, event));
        let hr = document.createElement("hr");
        hr.id = "hr-" + i;
        getEBI("contents").appendChild(hr);
    }
    getEBI("count").innerHTML = "" + total + " / " + total + " 件";
}

function onChange() {
    let input = getEBI("input").value;
    input = input.toLowerCase();
    let total = event_data.length;
    let cnt = total;
    for (let i = 0; i < event_data.length; i++) {
        let details = getEBI("details-" + i);
        let hr = getEBI("hr-" + i);
        details.style.display = "inline";
        hr.style.display = "block";
        if (input.length == 0) {
            continue;
        }
        let contents = event_data[i].contents_ja;
        let find = false;
        for (let j = 0; j < contents.length; j++) {
            let data = contents[j];
            if (data[1].toLowerCase().indexOf(input) >= 0) {
                find = true;
                break;
            }
        }
        if (!find) {
            details.style.display = "none";
            hr.style.display = "none";
            cnt--;
        }
    }
    getEBI("count").innerHTML = "" + cnt + " / " + total + " 件";
}

window.addEventListener('load', init);