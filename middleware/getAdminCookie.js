import jwt from 'jsonwebtoken';

async function getAdminCookie(req, res, next) {
    const token = req.cookies['admin-token'];
    // console.log(token);
    if(!token) {
        return res.status(401).render('admin/login');
    }
    try {
        const data = jwt.verify(token, process.env.ADMIN_SECRET);

        if(Date.now() > data.access.valid){
            // console.log("expired");
            return res.status(401).render('admin/login');
        }
        // console.log(process.env.ADMIN_SECRET ," ", data.access.key);
        if(process.env.ADMIN_KEY !== data.access.key){
            return res.status(401).render('admin/login');
        }
        next();
    } catch (error) {
        res.status(401).render('login');
    }
}

// module.exports = getAdminCookie;
export default getAdminCookie;