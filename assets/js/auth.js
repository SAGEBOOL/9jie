// 前端存储工具库 - 使用 localStorage 代替后端 API
const AUTH_KEYS = {
    USERS: '9jie_users',
    ADMINS: '9jie_admins',
    CURRENT_USER: '9jie_current_user'
};

const bcrypt = {
    hashSync: function(password, salt) {
        // 简单哈希（浏览器环境用 btoa 代替 bcrypt）
        return btoa(password + salt);
    },
    compareSync: function(password, hash) {
        return btoa(password + '10') === hash;
    }
};

// ========== 用户操作 ==========
function getUsers() {
    const data = localStorage.getItem(AUTH_KEYS.USERS);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse users data:', e);
        localStorage.removeItem(AUTH_KEYS.USERS);
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
}

// ========== 管理员操作 ==========
function getAdmins() {
    const data = localStorage.getItem(AUTH_KEYS.ADMINS);
    if (!data) {
        // 初始化管理员
        const admins = [{
            id: 1,
            username: 'HE-1',
            // 简单编码密码（生产环境请用更好方式）
            password: btoa('HYH18800050565hd'),
            created_at: new Date().toISOString()
        }];
        saveAdmins(admins);
        return admins;
    }
    return JSON.parse(data);
}

function saveAdmins(admins) {
    localStorage.setItem(AUTH_KEYS.ADMINS, JSON.stringify(admins));
}

// ========== 注册 ==========
function registerUser(username, password, email, phone) {
    if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
    }
    if (username.length < 3 || username.length > 20) {
        return { success: false, message: '用户名长度需在3-20个字符之间' };
    }
    if (password.length < 6) {
        return { success: false, message: '密码长度至少6位' };
    }

    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return { success: false, message: '用户名已存在' };
    }
    if (email && users.find(u => u.email === email)) {
        return { success: false, message: '邮箱已被注册' };
    }
    if (phone && users.find(u => u.phone === phone)) {
        return { success: false, message: '手机号已被注册' };
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username,
        password: btoa(password),  // 简单编码（非加密，仅做存储）
        email: email || null,
        phone: phone || null,
        status: 'authorized',  // 默认授权
        created_at: new Date().toISOString(),
        authorized_at: new Date().toISOString(),
        authorized_by: 'system'
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, message: '注册成功！已自动授权', userId: newUser.id };
}

// ========== 登录 ==========
function loginUser(username, password) {
    if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
    }

    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return { success: false, message: '用户名或密码错误' };
    }

    if (user.password !== btoa(password)) {
        return { success: false, message: '用户名或密码错误' };
    }

    if (user.status !== 'authorized') {
        return {
            success: false,
            message: user.status === 'pending' ? '账号待审核中' : '账号已被拒绝',
            status: user.status
        };
    }

    // 保存登录状态
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    return { success: true, message: '登录成功！', user: userWithoutPassword };
}

// ========== 管理员登录 ==========
function loginAdmin(username, password) {
    if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
    }

    const admins = getAdmins();
    const admin = admins.find(a => a.username === username);

    if (!admin || admin.password !== btoa(password)) {
        return { success: false, message: '管理员用户名或密码错误' };
    }

    localStorage.setItem('9jie_admin_logged_in', 'true');
    return { success: true, message: '管理员登录成功！' };
}

// ========== 获取当前用户 ==========
function getCurrentUser() {
    const data = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
}

// ========== 退出登录 ==========
function logoutUser() {
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
}

// ========== 管理员操作 ==========
function getAdminUserList() {
    const users = getUsers();
    return {
        success: true,
        users: users.map(({ password, ...user }) => user),
        pendingCount: users.filter(u => u.status === 'pending').length
    };
}

// ========== 初始化默认管理员 ==========
getAdmins();
