'use strict';

var lang = "ja";

// News length
const NEWSLEN = 5;

// Must 5 items
const IMG_LIST = [
    "./img/img01.jpg",
    "./img/img02.jpg",
    "./img/img03.jpg",
    "./img/img04.jpg",
    "./img/img05.jpg",
];

const DATA_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=Ck_8iWyBMuAAKcEW_TbafWC5Ta1NJyieS-dxLI4khVmITjhV9R16g2cIDxvPqaNwVxvt4hXN3Iu9Ghqo0hfUt7sjrN_ipT2_m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMPJeHxv25f9qoS9yDuMEjSoCsJYRNmt_qBZsGKrx9wSbCrxbLMd0Gwe9PxFQX8w-ltRP5uKlu21V7H6D3yDXGUm_JjsbyT8wtz9Jw9Md8uu&lib=MAwm_JUE8IwHoQhnd5-nbUEzgwH7sehr_";

function init() {
    lang = getLang();
    setInfo();
    setAbout();
    setContact();
    getEBI("event-select").addEventListener("change", changeEvent);
    getEBI("popup").addEventListener("click", hidePop);
    getEBI("layer").addEventListener("click", hidePop);
    fetch(DATA_URL, {
        method: 'GET',
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log('Success:', data);
        event_data = data;
        for (let event of event_data) {
            news_data.ja.push(event.title_ja);
        }
        setNews();
        setEvent();
        getEBI('news-body').style.display = 'block';
        getEBI('event-select').style.display = 'block';
        getEBI('event-body').style.display = 'block';
        getEBI('news-loading').style.display = 'none';
        getEBI('event-loading').style.display = 'none';
        console.log('Finish');
    }).catch((error) => {
        console.error('Error:', error);
        alert("データ取得失敗\n" + error.message);
    });
}

function getLang() {
    let lang = "ja";
    let params = location.search;
    console.log("params", params);
    if (params) {
        if (params.indexOf("lang=en") > 0) {
            lang = "en";
        } else if (params.indexOf("lang=de") > 0) {
            lang = "de";
        }
    }
    let langs = ["ja", "en", "de"];
    for (let i = 0; i < langs.length; i++) {
        if (lang == langs[i]) {
            getEBI("lang-link-" + langs[i]).style.display = "none";
        } else {
            getEBI("lang-link-" + langs[i]).style.display = "inline";
        }
    }
    return lang;
}

function setInfo() {
    document.getElementsByTagName("title")[0].innerHTML = info_data[lang].title + " - Homepage";
    let now = new Date();
    let idx = 0;
    let header = getEBI("header");
    let imgs = header.getElementsByTagName('img');
    let list = shuffle();
    for (let img of imgs) {
        img.src = list[idx];
        idx++;
    }
    getEBI("header-title").innerHTML = info_data[lang].title;
    getEBI("footer-title").innerHTML = info_data[lang].title;
    let names = ["news", "about", "event", "contact"];
    for (let i = 0; i < names.length; i++) {
        getEBI("menu-" + names[i]).innerHTML = info_data[lang][names[i]];
        getEBI(names[i] + "-title").innerHTML = info_data[lang][names[i]];
    }
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

function shuffle() {
    let list = IMG_LIST.concat();
    for (let i = 0; i < list.length; i++) {
        let j = Math.floor(Math.random() * list.length);
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
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

function createOption(value, text) {
    let op = document.createElement("option");
    op.value = value;
    op.innerHTML = text;
    return op;
}

function setNews() {
    getEBI("news-body").innerHTML = "";
    let news = news_data[lang];
    if (!news) {
        news = news_data["ja"];
        getEBI("news-body").appendChild(createDiv("bold under", "Sorry Japanese Only."));
    }
    for (let i = 0; i < news.length; i++) {
        if (i >= NEWSLEN) {
            break;
        }
        getEBI("news-body").appendChild(createDiv("", news[i]));
    }
}

function setAbout() {
    let msg = about_data[lang];
    if (!msg) {
        msg = about_data["ja"];
    }
    getEBI("about-body").innerHTML = msg;
}

function setEvent() {
    for (let i = 0; i < event_data.length; i++) {
        let title = event_data[i]["title_" + lang];
        if (!title) {
            title = event_data[i]["title_ja"];
        }
        getEBI("event-select").appendChild(createOption(i, title));
    }
    changeEvent();
}

function changeEvent() {
    getEBI("event-body").innerHTML = "";
    let idx = getEBI("event-select").value;
    let event = event_data[idx];
    let contents = event["contents_" + lang];
    if (!contents) {
        contents = event["contents_ja"];
        getEBI("event-body").appendChild(createDiv("bold under", "Sorry Japanese Only."));
    }
    for (let i = 0; i < contents.length; i++) {
        let data = contents[i];
        if (data[0] == "skip") {
            console.log("skip", data[0], data[1]);
        } else if (data[0] == "br") {
            getEBI("event-body").appendChild(createBr());
        } else if (data[0] == "img") {
            getEBI("event-body").appendChild(createImg(data[1]));
        } else if (data[0] == "img2") {
            getEBI("event-body").appendChild(createImg2(data[1]));
        } else {
            getEBI("event-body").appendChild(createDiv(data[0], data[1]));
        }
    }
}

function setContact() {
    getEBI("contact-body").innerHTML = "";
    let contacts = contact_data[lang];
    if (!contacts) {
        contacts = contact_data["ja"];
        getEBI("news-body").appendChild(createDiv("bold under", "Sorry Japanese Only."));
    }
    for (let i = 0; i < contacts.length; i++) {
        let data = contacts[i];
        if (data[0] == "br") {
            getEBI("contact-body").appendChild(createBr());
        } else {
            getEBI("contact-body").appendChild(createDiv(data[0], data[1]));
        }
    }
}

var info_data = {
    ja: {
        title: "支流の会",
        news: "News",
        about: "About",
        event: "Event",
        contact: "Contact"
    },
    en: {
        title: "Wine with river",
        news: "News",
        about: "About",
        event: "Event",
        contact: "Contact"
    },
    de: {
        title: "Wein mit Fluss",
        news: "News",
        about: "Über",
        event: "Veranstaltungen",
        contact: "Kontakt"
    },
};

var about_data = {
    ja: "川の流れとワイン。ドイツワインに魅せられ、現地のぶどう畑を訪問して、そこからの眺めでまず目に映ったのが川でした。ドイツワインと川には、とても深いつながりがあると直感できる光景でした。それから数十年、ワインに出会い、食に出会い、その繋がりの多様さに目を見張るばかりです。そんな愛すべきドイツワインと食事のマリアージュについて、深く探究していくことを目的として立ち上げたのが、<span class='bold'>『支流の会』</span>です。",
    en: "River flow and wine. We were fascinated by German wine, visited a local vineyard, and the first thing we saw in the view was the river. We were attracted to German wine, visited a local vineyard, and we first saw that the view of river. It was enough to intuitively feel that there was a very deep connection between German wine and the river. Over last ten years, we have met wine, met food, and the variety of these marriage are surprised for us. We have founded <span class='bold'>\"Wine with river\"</span> to explore the beloved German wine and food marriage.",
    de: "Fluss und Wein. Wir waren fasziniert von deutschem Wein, besuchten einen lokalen Weinberg und das erste, was wir in der Aussicht sahen, war der Fluss. Wir waren von deutschem Wein angezogen, besuchten einen lokalen Weinberg und sahen zuerst den Blick auf den Fluss. Es genügte, intuitiv zu spüren, dass es eine sehr tiefe Verbindung zwischen deutschem Wein und dem Fluss gab. Über den letzten zehn Jahren haben wir Wein und Essen getroffen, und die Vielfalt dieses Marriage überrascht uns. Wir haben <span class='bold'>\"Wein mit Fluss\"</span> gegründet, um das liebenswerte Marriage von deutschem Wein und dem Essen zu erkunden."
};

var contact_data = {
    ja: [
        ["", "お問い合わせは以下のメールアドレス宛にお願いします。"],
        ["br", ""],
        ["", "weinmitfluss@gmail.com"],
        ["br", ""],
        ["", "※ ご回答には数日かかる場合がございますのでご了承ください。"],
        ["", "※ お問い合わせの内容によりましては、ご回答いたしかねる場合がございますのでご了承ください。"],
    ],
    en: [
        ["", "Please send inquiries to the following e-mail address."],
        ["br", ""],
        ["", "weinmitfluss@gmail.com"],
        ["br", ""],
        ["", "- Please note that answers may take several days. "],
        ["", "- Please note that we may not be able to answer depending on the content of the inquiry."],
    ],
    de: [
        ["", "Anfragen senden Sie bitte an folgende E-Mail-Adresse."],
        ["br", ""],
        ["", "weinmitfluss@gmail.com"],
        ["br", ""],
        ["", "- Bitte beachten Sie, dass Antworten mehrere Tage dauern können. "],
        ["", "- Bitte beachten Sie, dass wir je nach Inhalt der Anfrage möglicherweise nicht antworten können."],
    ],
};


var news_data = { ja: [] };

var event_data = [];

window.addEventListener("load", init);