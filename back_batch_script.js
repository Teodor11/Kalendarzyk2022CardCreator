//Kalendarzyk 2022
//back_batch_script.ts
/////////////////////////////////////////////////////////////////////////////////////////////
function init() {
    document.getElementById("batch_continue").addEventListener("click", getResult);
    document.getElementById("batch_hide").addEventListener("click", hideElements);
}
function getResult() {
    var first_data = document.getElementById("batch_data").value;
    var data_array = first_data.split(/\n/gm);
    first_data = null;
    var data = [];
    data_array.forEach(function (el, i) {
        var el_array = el.split(/\t/gm);
        data[i] = {};
        console.log(el_array);
        data[i].all = el_array;
        data[i].index = parseInt(el_array[0]);
        data[i].day = el_array[1];
        data[i].type = parseInt(el_array[2]);
        data[i].title = JSON.parse(el_array[3]);
        data[i].text = JSON.parse(el_array[4]);
        data[i].text2 = JSON.parse(el_array[5]);
        data[i].image = JSON.parse(el_array[6]);
        data[i].image2 = JSON.parse(el_array[7]);
        var elements = ["title", "text", "text2", "image", "image2"];
        for (var j = 0; j < elements.length; j++) {
            var el_1 = data[i][elements[j]]; //e.g. data.text
            el_1.content = formatText(el_1.content);
            if (!([null, "left", "center", "right", "justify"].includes(el_1.text_align))) {
                el_1.text_align = null;
            }
            if (!([null, "tiny", "small", "normal", "large"].includes(el_1.text_size))) {
                el_1.text_size = null;
            }
            if (!([null, "tiny", "small", "normal", "large"].includes(el_1.image_size))) {
                el_1.image_size = null;
            }
        }
    });
    createCards(data);
}
function createCards(data) {
    var result_el = document.getElementById("batch_result");
    result_el.innerHTML = "";
    var code;
    var path = document.getElementById("batch_image_path").value;
    data.forEach(function (el) {
        code = "";
        switch (el.type) {
            case 1:
                code += "<div class=\"card_back type1\">\n                <span class=\"card_back_text card_back_text_type1 " + el.text.text_align + " " + el.text.text_size + "\">" + el.text.content + "</span>";
                break;
            case 2:
                code += "<div class=\"card_back type2\">\n                 <img src=\"" + path + el.image.content + "\" alt=\"" + el.image.content + "\" class=\"card_back_image type2 " + el.image.image_size + "\" />";
                break;
            case 3:
                code += "<div class=\"card_back type3\">\n                <img src=\"" + path + el.image.content + "\" alt=\"" + el.image.content + "\" class=\"card_back_image type3\n                " + el.image.image_size + "\" />\n                <span class=\"card_back_text " + el.text.text_align + " " + el.text.text_size + "\"> " + el.text.content + "</span>";
                break;
            case 4:
                code += "<div class=\"card_back type4\">\n                <img src=\"" + path + el.image.content + "\" alt=\"" + el.image.content + "\" class=\"card_back_image type4\" />\n                <span class=\"card_back_text " + el.text.text_align + " " + el.text.text_size + " type4\">" + el.text.content + "</span>";
                break;
            case 5:
                code += " <div class=\"card_back type5\">\n                <img src=\"" + path + el.image.content + "\" alt=\"" + el.image.content + "\" class=\"card_back_image type5\" />\n                <span class=\"card_back_text " + el.text.text_align + " " + el.text.text_size + " type5\">" + el.text.content + "</span>\n                <hr />\n                <img src=\"" + path + el.image2.content + "\" alt=\"" + el.image2.content + "\" class=\"card_back_image type5\" />\n                <span class=\"card_back_text " + el.text2.text_align + " " + el.text2.text_size + " type5\">" + el.text2.content + "</span>";
                break;
            case 6:
                code += "<div class=\"card_back type6\">\n                <span class=\"card_back_text " + el.text.text_align + " " + el.text.text_size + "\">" + el.text.content + "</span>\n                <img src=\"" + path + el.image.content + "\" alt=\"" + el.image.content + "\" class=\"card_back_image type6 " + el.image.image_size + "\" />";
                break;
            case 7:
                code += "<div class=\"card_back type7\">\n                    <span class=\"card_back_text " + el.text.text_align + " " + el.text.text_size + "\">" + el.text.content + "</span>\n                    <img src=\"" + path + el.image.content + "\" alt=\"" + el.image.content + "\" class=\"card_back_image type7\" />";
                break;
            case 8:
                code += "<div class=\"card_back type8\">\n                    <span class=\"card_back_title type8 " + el.title.text_align + " " + el.title.text_size + "\">" + el.title.content + "</span>\n                    <img src=\"" + path + el.image.content + "\" alt=\"" + el.image.content + "\" class=\"card_back_image type8 " + el.image.image_size + "\" />";
                if (el.text.content) {
                    code += "<span class=\"card_back_text " + el.text.text_align + " " + el.text.image_size + "\"> " + el.text.content + "</span> ";
                }
                break;
        }
        code += "</div>";
        result_el.innerHTML += code;
    });
}
function formatText(text_in) {
    if (!text_in) {
        return "";
    }
    var t = text_in;
    t = t.replace(/\&lt\;/gm, "<");
    t = t.replace(/\&gt\;/gm, ">");
    t = t.replace(/\&/gm, "&amp;");
    t = t.replace(/</gm, "&lt;");
    t = t.replace(/>/gm, "&gt;");
    t = t.replace(/\\;/gm, ";");
    t = t.split(/\\n/).join("<br/>");
    t = t.split(/\n/).join("<br/>");
    t = t.replace(/---/gm, "<hr/>");
    if (t[0] == "\"" && t[t.length - 1] == "\"") {
        t = t.substring(1, t.length - 1);
    }
    t = t.replace(/\&amp\;nbsp\;/gm, "&nbsp;");
    t = t.replace(/\\\*/gm, "\&ast;");
    t = t.replace(/\[standardFont\]/gm, "<span class='standardFont'>");
    t = t.replace(/\[\/standardFont\]/gm, "</span>");
    var arrayCode = [];
    var arrayResult = [];
    var regExp = /([^\\]|^)\*.*?[^\\]\*/gm;
    arrayCode = t.match(regExp);
    if (arrayCode) {
        arrayCode.forEach(function (el, index) {
            if (arrayCode[index].substring(0, 1) !== "*") {
                arrayCode[index] = arrayCode[index].substring(1);
            }
        });
        arrayResult = arrayCode.slice();
        arrayResult.forEach(function (el, index) {
            arrayResult[index] = "<span class='bold'>" + arrayCode[index].substring(1);
            arrayResult[index] = arrayResult[index].substring(0, arrayResult[index].length - 1) + "</span>";
            // console.log("array code: ", arrayCode);
            // console.log("array result: ", arrayResult);
        });
        for (var i = 0; i < arrayResult.length; i++) {
            t = t.replace(arrayCode[i], arrayResult[i]);
        }
    }
    return t;
}
function hideElements() {
    var elements_to_hide = document.getElementsByClassName("to_hide");
    if (elements_to_hide) {
        for (var i = 0; i < elements_to_hide.length; i++) {
            elements_to_hide[i].classList.add("hidden");
        }
    }
    document.body.classList.add("batch_saving");
    document.getElementById("batch_result").classList.add("batch_saving");
    var cards = document.getElementsByClassName("card_back");
    if (cards) {
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.add("batch_saving");
        }
    }
}
(function () { init(); })();
