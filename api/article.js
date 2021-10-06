import Mercury from '@postlight/mercury-parser';

module.exports = async (req, res) => {
  const { url } = req.query;
  let article = {}

  try {
    const { 
      title, 
      author,
      date_published: date,
      lead_image_url: image,
      word_count: words,
      content,
      excerpt,
     } = await Mercury.parse(url)

     article = { title, image, date, content, excerpt, author}

  } catch(err) {
    console.log(err)
  }

  res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000');
  res.json(article);
};