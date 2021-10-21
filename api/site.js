// var Mercury = require'@postlight/mercury-parser';
var got = require('got');
var cheerio = require('cheerio');
const { getDomain } = require('tldjs');
const metascraper = require('metascraper')([
  require('metascraper-title')(),
  require('metascraper-author')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-clearbit')(),
  require('metascraper-lang')(),
])

  const selectors = {
    rss: 'link[type="application/rss+xml"],link[type="application/atom+xml"]',
    twitter: 'meta[name="twitter:creator"],meta[property="twitter:creator"],meta[property="twitter:site"]',
  }

module.exports = async (req, res) => {
  const { url } = req.query;

  try {

    const { body: html } = await got(url)
    const metadata = await metascraper({ html, url })
    const $ = cheerio.load(html)

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.json({
      ...metadata,
      url,
      hostname: getDomain(url),
      rss: $(selectors.rss)?.attr('href'),
      twitter: $(selectors.twitter)?.attr('content'),
    });

  } catch(err) {
    console.log(err)
    res.status(500).json({message: e.message})
  }

};