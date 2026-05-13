const { readUsers, bcrypt } = require('../lib/storage');

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

        const users = await readUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(200).json({ success: false, message: '用户名或密码错误' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(200).json({ success: false, message: '用户名或密码错误' });
        }

        if (user.status !== 'authorized') {
            return res.status(200).json({
                success: false,
                message: '账号未授权，请联系管理员',
                status: user.status
            });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ success: true, message: '登录成功！', user: userWithoutPassword });
    } catch (error) {
        console.error('登录错误:', error);
        return res.status(200).json({ success: false, message: '登录失败，请稍后重试' });
    }
};
