// description = Get Urls
// route - Get /api/url
// access - Private

const getUrls = (req, res) => {
  res.status(200).json({ message: 'Get Url' });
};

export { getUrls };
