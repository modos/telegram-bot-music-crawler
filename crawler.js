const cheerio = require("cheerio");
const axios = require("axios");

const AXIOS_OPTIONS = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
    },
};

async function getOrganicResults(searchString) {
    const encodedString = encodeURI(searchString);

    let d;
    let $;
    
    const links = [];
    const titles = [];
    const snippets = [];

    const final = [];
    try {
        d = (await axios.get(`https://www.google.com/search?q=${encodedString}&hl=en&gl=us`, AXIOS_OPTIONS)).data;
        $ = cheerio.load(d);
    } catch (error) {
        console.log(error);
    }


    $(".yuRUbf > a").each((i, el) => {
        links[i] = $(el).attr("href");
    });
    $(".yuRUbf > a > h3").each((i, el) => {
        titles[i] = $(el).text();
    });
    $(".IsZvec").each((i, el) => {
        snippets[i] = $(el).text().trim();
    });

    const result = [];
    for (let i = 0; i < links.length; i++) {
        result[i] = {
            link: links[i],
            title: titles[i],
            snippet: snippets[i],
        };

    }

    for (let index = 0; index < result.length; index++) {
        try {

            const page = await (await axios.get(result[index].link, AXIOS_OPTIONS)).data;
            $ = cheerio.load(page);
            const ass = $('a');

            for (let i = 0; i < ass.length; i++) {
                if (ass[i].attribs.href.includes(".mp3")) {
                    console.log(ass[i].attribs.href);
                    final.push(encodeURI(ass[i].attribs.href));
                }

            }
        } catch (error) {

        }
    }


    return final;
}

module.exports = {
    getOrganicResults
}