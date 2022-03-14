const jwt = require('jsonwebtoken');
const { Users } = require('../models/tabelmodels');

const refreshToken = async (req, res) => {
    try {
        const tokenCookie = req.cookies.refreshToken;
        if (!tokenCookie) return res.status(401).json({ status: false, message: 'Cookie tidak ditemukan' });
        const user = await Users.findOne({
            where: {
                refresh_token: tokenCookie,
            },
        });
        if (!user) return res.status(403).json({ status: false, message: 'Cookie tidak ditemukan di database' });
        const { id, name, email } = user;
        jwt.verify(tokenCookie, process.env.REFRESH_TOKEN, (err, decode) => {
            if (err || !decode) return res.status(403).json({ status: false, message: 'Cookie tidak valid' });
            const accessToken = jwt.sign({ id, name, email }, process.env.ACCESS_TOKEN, {
                expiresIn: '25s',
            });
            return res.status(200).json({ status: true, data: { name, accessToken } });
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};

module.exports = {
    refreshToken,
};
