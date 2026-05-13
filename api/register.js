const { readUsers, writeUsers, bcrypt } = require('../lib/storage');

module.exports = async function handler(req, res) {
    // 允许 CORS
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
        const { username, password, email, phone } = req.body;

        if (!username || !password) {
            return res.status(200).json({ success: false, message: '用户名和密码不能为空' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(200).json({ success: false, message: '用户名长度需在3-20个字符之间' });
        }

        if (password.length < 6) {
            return res.status(200).json({ success: false, message: '密码长度至少6位' });
        }

        const users = await readUsers();

        if (users.find(u => u.username === username)) {
            return res.status(200).json({ success: false, message: '用户名已存在' });
        }

        if (email && users.find(u => u.email === email)) {
            return res.status(200).json({ success: false, message: '邮箱已被注册' });
        }

        if (phone && users.find(u => u.phone === phone)) {
            return res.status(200).json({ success: false, message: '手机号已被注册' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username,
            password: hashedPassword,
            email: email || null,
            phone: phone || null,
            status: 'authorized', // 简化：Vercel 版本默认直接授权
            created_at: new Date().toISOString(),
            authorized_at: new Date().toISOString(),
            authorized_by: 'system'
        };

        users.push(newUser);
        await writeUsers(users);

        return res.status(200).json({
            success: true,
            message: '注册成功！已自动授权',
            userId: newUser.id
        });
    } catch (error) {
        console.error('注册错误:', error);
        return res.status(200).json({ success: false, message: '注册失败，请稍后重试' });
    }
};
