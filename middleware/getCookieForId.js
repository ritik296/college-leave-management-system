import jwt from 'jsonwebtoken';

async function getCookieForId(req, res, next) {
    const token = req.cookies['auth-token'];
    // console.log(token);
    if(!token) {
        return res.status(401).render('login');
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).render('login');
    }
}

// module.exports = getCookieForId;
export default getCookieForId;