const { readUsers } = require('../../lib/storage');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const users = await readUsers();
        const usersWithoutPassword = users.map(({ password, ...user }) => user);

        return res.status(200).json({
            success: true,
            users: usersWithoutPassword,
            pendingCount: users.filter(u => u.status === 'pending').length
        });
    } catch (error) {
        console.error('获取用户列表错误:', error);
        return res.status(200).json({ success: false, message: '获取失败' });
    }
};
