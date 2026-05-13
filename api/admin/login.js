const { readAdmins, bcrypt } = require('../../lib/storage');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(200).json({ success: false, message: '用户名和密码不能为空' });
        }

        const admins = await readAdmins();
        const admin = admins.find(a => a.username === username);

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(200).json({ success: false, message: '管理员用户名或密码错误' });
        }

        return res.status(200).json({ success: true, message: '管理员登录成功！' });
    } catch (error) {
        console.error('管理员登录错误:', error);
        return res.status(200).json({ success: false, message: '登录失败' });
    }
};
