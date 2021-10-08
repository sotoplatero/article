// var Mercury = require'@postlight/mercury-parser';
var { Readability } = require('@mozilla/readability');
var { JSDOM } = require('jsdom');
var got = require('got');
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-clearbit')(),
])

module.exports = async (req, res) => {
  const { url } = req.query;

  try {


    const { body: html } = await got(url)

    const metadata = await metascraper({ html, url })
    // console.log(metadata)
    const doc = new JSDOM(html, { url });
    let reader = new Readability(doc.window.document);

    const article = reader.parse();

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.json({
      title: article.title,
      logo: metadata.logo,
      image: metadata.image,
      content: article.content,
      excerpt: article.excerpt,
      words: article.textContent.match(/\w+/g).length,
    });

  } catch(err) {
    console.log(err)
    res.status(500).json({message: e.message})
  }

};