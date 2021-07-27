//Kalendarzyk 2022
//back_script.ts

"use strict";

//import { DateTimePickerComponent } from "./date-time-picker/date-time-picker-component.min";

type CardContentElement = {
    content: string,
    text_align?: string | "left" | "center" | "right" | "justify",
    text_size?: string | "tiny" | "small" | "normal" | "large",
    image_size?: string | "tiny" | "small" | "normal" | "large"
};


type CardFields = {
    image_path: string,
    title: CardContentElement,
    text: CardContentElement,
    text2: CardContentElement,
    image: CardContentElement,
    image2: CardContentElement
}


/////////////////////////////////////////////////////////////////////////////////////////////

function init()
{
    let card_type: number;
    let card_elements: string[];


    const card_type_radio_elements = Array.from(document.getElementsByName("card_type_option")) as Array<HTMLInputElement>;
    if (card_type_radio_elements)
    {
        for (let i = 0; i < card_type_radio_elements.length; i++)
        {
            card_type_radio_elements[i].checked = false;
            card_type_radio_elements[i].addEventListener("change", () => { ({ card_type, card_elements } = changeCardType()); });
        }
    }


    const image_path_input = document.getElementById("card_content_image_path") as HTMLInputElement;
    image_path_input.addEventListener("change", () => { if (window.localStorage) { window.localStorage.setItem("image_path", image_path_input.value); } });

    if (window.localStorage)
    {
        const image_path: string = window.localStorage.getItem("image_path");
        if (image_path) { image_path_input.value = image_path; }
    }


    const clear_day_button = document.getElementById("clear_day_button") as HTMLButtonElement;
    clear_day_button.addEventListener("click", clearDay);

    const get_card_button = document.getElementById("get_card_button") as HTMLButtonElement;
    get_card_button.addEventListener("click", () => { getCard(card_type, card_elements); });

    const clear_card_button = document.getElementById("clear_card_button") as HTMLButtonElement;
    clear_card_button.addEventListener("click", () => { clearCard(card_elements); });


    const copy_card_button = document.getElementById("result_copy_button") as HTMLButtonElement;
    copy_card_button.addEventListener("click", (e) => { copyResult(e); });

}


function initDatePicker()
{
    //@ts-ignore
    flatpickr("#card_content_day", {
        dateFormat: "d.m.Y",
        defaultDate: null,
        minDate: "01.01.2022",
        maxDate: "31.12.2022",
        locale: "pl"
    });
}


function clearDay(): void
{
    const day_input = document.getElementById("card_content_day") as HTMLInputElement;
    day_input.value = "";
}


function clearCard(card_elements: string[]): void
{
    card_elements.forEach(el =>
    {
        (document.getElementById("card_content_" + el) as HTMLInputElement | HTMLTextAreaElement).value = "";
    });

    document.getElementById("card_preview").innerHTML = "";
    document.getElementById("card_result").classList.add("invisible");
}



function changeCardType(): { card_type: number, card_elements: string[] }
{


    const card_type_radio_el = document.querySelector("input[name=card_type_option]:checked") as HTMLInputElement;
    const card_type = parseInt(card_type_radio_el.value);

    let card_elements = [] as string[];

    switch (card_type)
    {

        case 1:
            card_elements = ["text"];
            break;

        case 2:
            card_elements = ["image_path", "image"];
            break;

        case 3:
            card_elements = ["image_path", "image", "text"];
            break;

        case 4:
            card_elements = ["image_path", "image", "text"];
            break;

        case 5:
            card_elements = ["image_path", "image", "text", "image2", "text2"];
            break;

        case 6:
            card_elements = ["image_path", "text", "image"];
            break;

        case 7:
            card_elements = ["image_path", "text", "image"];
            break;

        case 8:
            card_elements = ["image_path", "title", "image", "text"];
            break;
    }

    card_elements.unshift("day");   //add "day" at the beginning


    const card_content_field_elements = document.getElementsByClassName("card_content_field");
    if (card_content_field_elements)
    {
        for (let i = 0; i < card_content_field_elements.length; i++)
        {
            card_content_field_elements[i].classList.add("hidden");
        }
    }

    card_elements.forEach(el =>
    {
        document.getElementById("card_content_field_" + el).classList.remove("hidden");
    });

    const preview_grid_el = document.getElementById("card_content_preview_grid");
    preview_grid_el.classList.remove("hidden");


    const options_elements = Array.from(document.getElementsByClassName("card_content_options_image"));
    if (options_elements)
    {
        for (let i = 0; i < options_elements.length; i++)
        {
            options_elements[i].classList.remove("hidden");
            if (card_type == 4 || card_type == 5 || card_type == 7) { options_elements[i].classList.add("hidden"); }
        }
    }


    initDatePicker();



    return { card_type, card_elements };
}



function formatText(text_in: string): string
{
    if (!text_in) { return ""; }

    let t = text_in;

    // console.log("text in: ", text_in);


    if (t[0] == `"` && t[t.length - 1] == `"`)
    {
        t = t.substring(1, t.length - 1)
    }


    t = t.replace(/\&/gm, "&amp;");

    //t = t.replace(/[<|\&amp\;lt\;]/gm, "&lt;");
    //t = t.replace(/[>|\&amp\;gt\;]/gm, "&gt;");
    t = t.replace(/\&amp\;nbsp\;/gm, "&nbsp;");

    t = t.replace(/</gm, "&lt;");
    t = t.replace(/>/gm, "&gt;");
    t = t.replace(/\\\*/gm, "\&ast;");

    t = t.replace(/\[standardFont\]/gm, "<span class='standardFont'>");
    t = t.replace(/\[\/standardFont\]/gm, "</span>");


    let arrayCode = [] as string[];
    let arrayResult = [] as string[];
    let regExp = /([^\\]|^)\*.*?[^\\]\*/gm;


    arrayCode = t.match(regExp);


    if (arrayCode)
    {
        arrayCode.forEach((el, index) =>
        {
            if (arrayCode[index].substring(0, 1) !== "*")
            {
                arrayCode[index] = arrayCode[index].substring(1);
            }
        });

        arrayResult = arrayCode.slice();

        arrayResult.forEach((el, index) =>
        {
            arrayResult[index] = "<span class='bold'>" + arrayCode[index].substring(1);
            arrayResult[index] = arrayResult[index].substring(0, arrayResult[index].length - 1) + "</span>";

            // console.log("array code: ", arrayCode);
            // console.log("array result: ", arrayResult);
        });


        for (let i = 0; i < arrayResult.length; i++)
        {
            t = t.replace(arrayCode[i], arrayResult[i]);
        }

    }

    t = t.replace(/\\;/gm, ";");

    t = t.split(/\\n/).join("<br/>");
    t = t.split(/\n/).join("<br/>");

    t = t.replace(/---/gm, "<hr/>")


    return t;
}


function formatTextResult(text_in: string): string
{
    if (!text_in) { return ""; }

    let t = text_in;

    t = t.split(/<span class='bold'>/gm).join("*");
    t = t.split(/<\/span>/gm).join("*");

    t = t.split(/<br\/>/gm).join("\\n");
    t = t.split(/<hr\/>/gm).join("---");

    t = t.replace(/</gm, "&lt;");
    t = t.replace(/>/gm, "&gt;");

    return t;
}



function copyResult(e: Event): void
{

    const copy_card_button = e.target as HTMLButtonElement;

    const result = document.getElementById("card_result_line").textContent;
    navigator.clipboard.writeText(result);

    const icon = copy_card_button.firstElementChild;


    icon.classList.remove("fa-copy");
    icon.classList.add("fa-check");
    copy_card_button.classList.add("result_copy_animation");

    window.setTimeout(() =>
    {
        icon.classList.remove("fa-check");
        copy_card_button.classList.remove("result_copy_animation");
        icon.classList.add("fa-copy");
    }, 500);
}



function getCard(card_type: number, card_elements: string[])
{
    let path = "";

    const fields = {
        image_path: "",
        title: {} as CardContentElement,
        text: {} as CardContentElement,
        text2: {} as CardContentElement,
        image: {} as CardContentElement,
        image2: {} as CardContentElement
    };


    card_elements.forEach(el =>
    {
        switch (el)
        {
            case "image_path":
                path = (document.getElementById("card_content_image_path") as HTMLInputElement).value;
                break;

            case "title":
            case "text":
            case "text2":
                fields[el].content = formatText((document.getElementById("card_content_" + el) as HTMLInputElement | HTMLTextAreaElement).value);
                fields[el].text_align = (document.querySelector("input[name=card_content_" + el + "_align]:checked") as HTMLInputElement).value;
                fields[el].text_size = (document.querySelector("input[name=card_content_" + el + "_size]:checked") as HTMLInputElement).value;
                break;

            case "image":
            case "image2":
                const temp_array = ((document.getElementById("card_content_" + el) as HTMLInputElement).value).split("\\");
                fields[el].content = temp_array[temp_array.length - 1]; //take last element from array (only filename - remove path)
                fields[el].image_size = (document.querySelector("input[name=card_content_" + el + "_size]:checked") as HTMLInputElement).value;
                break;
        }
    });


    console.log("fields: ", fields);



    let code = "";

    switch (card_type)
    {
        case 1:
            code += `<div class="card_back type1">
                <span class="card_back_text card_back_text_type1 ${fields.text.text_align} ${fields.text.text_size}">${fields.text.content}</span>`;
            break;
        case 2:
            code += `<div class="card_back type2">
                 <img src="${path}${fields.image.content}" alt="${fields.image.content}" class="card_back_image type2 ${fields.image.image_size}" />`
            break;
        case 3:
            code += `<div class="card_back type3">
                <img src="${path}${fields.image.content}" alt="${fields.image.content}" class="card_back_image type3
                ${fields.image.image_size}" />
                <span class="card_back_text ${fields.text.text_align} ${fields.text.text_size}"> ${fields.text.content}</span>`;
            break;
        case 4:
            code += `<div class="card_back type4">
                <img src="${path}${fields.image.content}" alt="${fields.image.content}" class="card_back_image type4" />
                <span class="card_back_text ${fields.text.text_align} ${fields.text.text_size} type4">${fields.text.content}</span>`;
            break;
        case 5:
            code += ` <div class="card_back type5">
                <img src="${path}${fields.image.content}" alt="${fields.image.content}" class="card_back_image type5" />
                <span class="card_back_text ${fields.text.text_align} ${fields.text.text_size} type5">${fields.text.content}</span>
                <hr />
                <img src="${path}${fields.image2.content}" alt="${fields.image2.content}" class="card_back_image type5" />
                <span class="card_back_text ${fields.text2.text_align} ${fields.text2.text_size} type5">${fields.text2.content}</span>`;
            break;
        case 6:
            code += `<div class="card_back type6">
                <span class="card_back_text ${fields.text.text_align} ${fields.text.text_size}">${fields.text.content}</span>
                <img src="${path}${fields.image.content}" alt="${fields.image.content}" class="card_back_image type6 ${fields.image.image_size}" />`;
            break;
        case 7:
            code += `<div class="card_back type7">
                    <span class="card_back_text ${fields.text.text_align} ${fields.text.text_size}">${fields.text.content}</span>
                    <img src="${path}${fields.image.content}" alt="${fields.image.content}" class="card_back_image type7" />`
            break;
        case 8:
            code += `<div class="card_back type8">
                    <span class="card_back_title type8 ${fields.title.text_align} ${fields.title.text_size}">${fields.title.content}</span>
                    <img src="${path}${fields.image.content}" alt="${fields.image.content}" class="card_back_image type8 ${fields.image.image_size}" />`

            if (fields.text.content)
            {
                code += `<span class="card_back_text ${fields.text.text_align} ${fields.text.image_size}"> ${fields.text.content}</span> `
            }

            break;
    }

    code += "</div>";

    const preview_container = document.getElementById("card_preview_container");
    preview_container.classList.remove("invisible");

    const preview_el = document.getElementById("card_preview");
    preview_el.innerHTML = code;

    const result_el = document.getElementById("card_result");
    result_el.classList.remove("invisible");

    getResultLine(card_type, fields);



}


function getResultLine(card_type: number, fields: CardFields): void
{

    const day = (document.getElementById("card_content_day") as HTMLInputElement).value;

    let result = "";

    // u00a0 - non-breaking space
    // u0009 - tab



    //0 - card index
    //result += ""
    // result += "\u0009"

    //1 - day
    if (day)
    {
        result += day;
    }
    else
    {
        result += "\u00a0";
    }

    result += "\u0009"

    //2 - type
    result += card_type.toString();

    //3-7 - card fields
    (["title", "text", "text2", "image", "image2"]).forEach(el =>
    {
        result += "\u0009";
        result += formatTextResult(JSON.stringify(fields[el]));
    });


    const result_line_el = document.getElementById("card_result_line");
    result_line_el.textContent = result;

}





(function () { init(); })()