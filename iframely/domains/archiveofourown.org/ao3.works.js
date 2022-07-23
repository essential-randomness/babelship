// Exported from AO3.js
export const getWorkAuthor = ($workPage) => {
  const author = [];
  $workPage('a[rel="author"]').each(function (i, element) {
    author[i] = $workPage(element).text().trim();
  });
  return author.join();
};

export const getWorkTitle = ($workPage) => {
  return $workPage("h2.title").text().trim();
};

export const getWorkRating = ($workPage) => {
  const rating = [];
  $workPage("dd.rating ul.commas li").each(function (i, element) {
    rating[i] = $workPage(element).text().trim();
  });
  return rating;
};

export const getWorkWarning = ($workPage) => {
  const warning = [];

  $workPage("dd.warning ul.commas li").each(function (i, element) {
    warning[i] = $workPage(element).text().trim();
  });
  return warning;
};

export const getWorkFandom = ($workPage) => {
  const fandom = [];
  $workPage("dd.fandom ul.commas li").each(function (i, element) {
    fandom[i] = $workPage(element).text().trim();
  });
  return fandom;
};

export default {
  re: [
    // https://archiveofourown.org/works/11194734/
    /^https?:\/\/archiveofourown\.org\/works\/(\d+)/i,
  ],

  mixins: ["*"],
  // getLink: function (urlMatch) {
  //   console.log(CONFIG.T);
  //   console.log(urlMatch[1]);
  //   return {
  //     accept: CONFIG.T.text_html,
  //     rel: [CONFIG.R.survey, CONFIG.R.ssl, CONFIG.R.html5],
  //     href: "https://archiveofourown.org/works/" + urlMatch[0],
  //     height: height,
  //     "max-width": width,
  //     test: "test",
  //     scrolling: "no",
  //     title: "jsdlaksjdkalsdj",
  //   };
  // },

  getMeta: function (urlMatch, cheerio) {
    console.log(cheerio.html());
    console.log(getWorkAuthor(cheerio));
    return {
      description: "!!!!sdjaksdjalksdjalskdja!!!!",
      title: "asjkdasdlasjdla",
      author: getWorkAuthor(cheerio),
      keywords: "fanfiction, transformative works, otw, fair use, archive",
      canonical: "https://archiveofourown.org/works/11194734",
    };
  },

  //   getData: function (urlMatch) {
  //     console.log(cheerio);
  //     console.log("&&&&&&&");
  //     console.log(getWorkAuthor(cheerio));

  //     cb({
  //       work: getWorkAuthor(cheerio),
  //     });
  //   },

  //   tests: [
  //     {
  //       noFeeds: true,
  //     },
  //     "http://www.buzzfeed.com/brentbennett/star-wars-cast-members-do-star-wars-impersonations#.idE4zm45aA",
  //   ],
};
