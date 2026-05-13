const { readUsers, writeUsers } = require('../../lib/storage');

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
        const { userId, action, adminUsername } = req.body;

        if (!userId || !action) {
            return res.status(200).json({ success: false, message: '参数不完整' });
        }

        const users = await readUsers();
        const userIndex = users.findIndex(u => u.id === parseInt(userId));

        if (userIndex === -1) {
            return res.status(200).json({ success: false, message: '用户不存在' });
        }

        const statusMap = { authorize: 'authorized', reject: 'rejected', reset: 'pending' };
        const newStatus = statusMap[action];

        if (!newStatus) {
            return res.status(200).json({ success: false, message: '无效的操作' });
        }

        users[userIndex].status = newStatus;
        users[userIndex].authorized_at = newStatus !== 'pending' ? new Date().toISOString() : null;
        users[userIndex].authorized_by = newStatus !== 'pending' ? (adminUsername || 'admin') : null;

        await writeUsers(users);

        const messages = {
            authorize: '用户已授权',
            reject: '用户已被拒绝',
            reset: '用户已重置为待审核'
        };

        return res.status(200).json({ success: true, message: messages[action] });
    } catch (error) {
        console.error('授权操作错误:', error);
        return res.status(200).json({ success: false, message: '操作失败' });
    }
};
