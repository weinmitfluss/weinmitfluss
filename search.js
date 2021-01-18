
function init() {
    setContents();
    getEBI("input").addEventListener("change", onChange);
    getEBI("input").addEventListener("keyup", onChange);
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
    let a = document.createElement("a");
    a.href = src;
    a.target = "imgview";
    a.appendChild(img);
    let div = createDiv("center", "");
    div.appendChild(a);
    return div;
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
            if (data[0] == "br") {
                event.appendChild(createBr());
            } else if (data[0] == "img") {
                event.appendChild(createImg(data[1]));
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