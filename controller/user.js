const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models/tabelmodels');

const signUpHandler = async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;
    if (name === undefined) {
        return res.json({
            success: false,
            message: 'Nama tidak boleh kosong',
        });
    }
    try {
        const user = await Users.findOne({
            where: {
                email,
            },
        });
        if (user !== null) {
            return res.json({
                success: false,
                message: 'Gagal menambahkan user, email telah terdaftar',
            });
        }
        const salt = await bcrypt.genSalt();
        const hastPassword = await bcrypt.hash(password, salt);
        try {
            await Users.create({
                name,
                email,
                verifiedEmail: false,
                password: hastPassword,
            });
            return res.status(201).json({
                success: true,
                message: 'Berhasil menambahkan user',
            });
        } catch (err) {
            return res.json({
                success: false,
                message: 'Gagal menambahkan user',
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const signInHandler = async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({
        where: {
            email,
        },
    });
    if (user === null) {
        return res.json({
            success: false,
            message: 'Email tidak terdaftar',
        });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: 'Password salah' });
    try {
        const { id, name } = user;
        const accessToken = jwt.sign({ id, name, email }, process.env.ACCESS_TOKEN, {
            expiresIn: '25s',
        });
        const refreshToken = jwt.sign({ id, name, email }, process.env.REFRESH_TOKEN);
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id,
            },
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({
            success: true,
            data: {
                name,
                accessToken,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    signUpHandler,
    signInHandler,
};
