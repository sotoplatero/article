import Mercury from '@postlight/mercury-parser';

module.exports = async (req, res) => {
  const { url } = req.query;
  const article = await Mercury.parse(url)
  console.log(article)
  res.json(article);
};