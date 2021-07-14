//Kalendarzyk 2022
//back_batch_script.ts


type CardContentElement = {
    content: string,
    text_align?: string | "left" | "center" | "right" | "justify",
    text_size?: string | "tiny" | "small" | "normal" | "large",
    image_size?: string | "tiny" | "small" | "normal" | "large"
};


type SingleDay = {
    all: Array<string>,

    index: number,
    day: string,
    type: number,

    title: CardContentElement,
    text: CardContentElement,
    text2: CardContentElement,
    image: CardContentElement,
    image2: CardContentElement
};


/////////////////////////////////////////////////////////////////////////////////////////////


function init(): void
{
    document.getElementById("batch_continue").addEventListener("click", getResult);
    document.getElementById("batch_hide").addEventListener("click", hideElements);
}


function getResult(): void
{
    let first_data: string = (document.getElementById("batch_data") as HTMLTextAreaElement).value;
    let data_array: string[] = first_data.split(/\n/gm);

    first_data = null;

    let data: SingleDay[] = [];

    data_array.forEach((el, i) =>
    {
        const el_array: string[] = el.split(/\t/gm)

        data[i] = {} as SingleDay;

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

    });


    createCards(data);
}


function createCards(data: SingleDay[]): void
{

    const result_el = document.getElementById("batch_result");
    result_el.innerHTML = "";

    let code: string;
    let path: string = (document.getElementById("batch_image_path") as HTMLInputElement).value;

    data.forEach(el =>
    {
        code = "";

        switch (el.type)
        {
            case 1:
                code += `<div class="card_back type1">
                <span class="card_back_text card_back_text_type1 ${el.text.text_align} ${el.text.text_size}">${el.text.content}</span>`;
                break;
            case 2:
                code += `<div class="card_back type2">
                 <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type2 ${el.image.image_size}" />`
                break;
            case 3:
                code += `<div class="card_back type3">
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type3
                ${el.image.image_size}" />
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size}"> ${el.text.content}</span>`;
                break;
            case 4:
                code += `<div class="card_back type4">
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type4" />
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size} type4">${el.text.content}</span>`;
                break;
            case 5:
                code += ` <div class="card_back type5">
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type5" />
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size} type5">${el.text.content}</span>
                <hr />
                <img src="${path}${el.image2.content}" alt="${el.image2.content}" class="card_back_image type5" />
                <span class="card_back_text ${el.text2.text_align} ${el.text2.text_size} type5">${el.text2.content}</span>`;
                break;
            case 6:
                code += `<div class="card_back type6">
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size}">${el.text.content}</span>
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type6 ${el.image.image_size}" />`;
                break;
            case 7:
                code += `<div class="card_back type7">
                    <span class="card_back_text ${el.text.text_align} ${el.text.text_size}">${el.text.content}</span>
                    <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type7" />`
                break;
            case 8:
                code += `<div class="card_back type8">
                    <span class="card_back_title type8 ${el.title.text_align} ${el.title.text_size}">${el.title.content}</span>
                    <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type8 ${el.image.image_size}" />`

                if (el.text.content)
                {
                    code += `<span class="card_back_text ${el.text.text_align} ${el.text.image_size}"> ${el.text.content}</span> `
                }

                break;
        }

        code += "</div>";

        result_el.innerHTML += code;


    });




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

    t = t.replace(/</gm, "&lt;");
    t = t.replace(/>/gm, "&gt;");

    t = t.replace(/\&nbsp\;/gm, "\u00a0");


    t = t.replace(/\&/gm, "&amp;");

    t = t.replace(/\\\*/gm, "\&ast;");

    t = t.replace(/\[standardFont\]/gm, "<span class='standardFont'>");
    t = t.replace(/\[\/standardFont\]/gm, "</span>");


    let arrayCode = [] as string[];
    let arrayResult = [] as string[];
    let regExp = /([^\\]|^)\*.*?[^\\]\*/gm;


    arrayCode = t.match(regExp);

    //console.log("array code 1: ", arrayCode);

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





function hideElements()
{

    const elements_to_hide = document.getElementsByClassName("to_hide");
    if (elements_to_hide)
    {
        for (let i = 0; i < elements_to_hide.length; i++)
        {
            elements_to_hide[i].classList.add("hidden");
        }
    }






    document.body.classList.add("batch_saving");
    document.getElementById("batch_result").classList.add("batch_saving");

    const cards = document.getElementsByClassName("card_back");

    if (cards)
    {
        for (let i = 0; i < cards.length; i++)
        {
            cards[i].classList.add("batch_saving");
        }
    }
}




















(function () { init(); })()