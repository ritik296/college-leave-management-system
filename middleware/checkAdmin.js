import jwt from 'jsonwebtoken';
async function checkAdmin(req, res, next) {
    const token = req.header('admin-token');
    // console.log(token);
    if(!token) {
        return res.status(401).send({error: "Please authencate using a valid token"});
    }
    try {
        const data = jwt.verify(token, process.env.ADMIN_SECRET);
        // console.log(Date.now() > data.access.valid);
        // if(Date.now() > data.access.valid){
        //     return res.status(401).json({error: "Token expired"});
        // }
        // console.log(process.env.ADMIN_SECRET ," ", data.access.key);
        if(process.env.ADMIN_KEY !== data.access.key){
            return res.status(401).json({error: "Invalid Token"});
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({error: "Please authencate using a valid token"});
    }
}

// module.exports = checkAdmin;
export default checkAdmin;