const { readUsers } = require('../lib/storage');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(200).json({ success: false, message: '未登录' });
        }

        const users = await readUsers();
        const user = users.find(u => u.id === parseInt(userId));

        if (!user) {
            return res.status(200).json({ success: false, message: '用户不存在' });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        return res.status(200).json({ success: false, message: '获取失败' });
    }
};
