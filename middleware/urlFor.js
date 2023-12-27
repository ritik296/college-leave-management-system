function urlFor (req, res, next) {
    res.locals.urlFor = (path) => {
        // console.log(path);
        // console.log(`${req.protocol}://${req.get('host')}${path}`);
      return `${req.protocol}://${req.get('host')}${path}`;
    };
    next();
}

export default urlFor;