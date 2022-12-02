import jwt from 'jsonwebtoken';

async function fetchuser(req, res, next) {
    const token = req.header('auth-token');
    // console.log(token);
    if(!token) {
        return res.status(401).send({error: "Please authencate using a valid token"});
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "Please authencate using a valid token"});
    }
}

// module.exports = fetchuser;
export default fetchuser;