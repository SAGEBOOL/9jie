// 存储抽象层：本地用 fs，Vercel 用 KV
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// 判断是否在 Vercel 环境
const isVercel = () => !!process.env.KV_REST_API_URL;

// 本地文件路径
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

// 确保数据目录存在（本地模式）
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// ========== 本地存储（fs）==========
function readUsersLocal() {
    ensureDataDir();
    try {
        if (!fs.existsSync(USERS_FILE)) {
            writeUsersLocal([]);
        }
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function writeUsersLocal(users) {
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readAdminsLocal() {
    ensureDataDir();
    try {
        if (!fs.existsSync(ADMINS_FILE)) {
            const hashedPassword = bcrypt.hashSync('HYH18800050565hd', 10);
            writeAdminsLocal([{
                id: 1,
                username: 'HE-1',
                password: hashedPassword,
                created_at: new Date().toISOString()
            }]);
        }
        return JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function writeAdminsLocal(admins) {
    ensureDataDir();
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2));
}

// ========== Vercel KV 存储 ==========
// 动态导入 @vercel/kv（仅在 Vercel 环境使用）
let kv = null;
async function getKV() {
    if (!kv) {
        const { kv: kvClient } = await import('@vercel/kv');
        kv = kvClient;
    }
    return kv;
}

async function readUsersKV() {
    const client = await getKV();
    const data = await client.get('users');
    return data ? JSON.parse(data) : [];
}

async function writeUsersKV(users) {
    const client = await getKV();
    await client.set('users', JSON.stringify(users));
}

async function readAdminsKV() {
    const client = await getKV();
    const data = await client.get('admins');
    if (!data) {
        // 初始化管理员
        const hashedPassword = bcrypt.hashSync('HYH18800050565hd', 10);
        const admins = [{
            id: 1,
            username: 'HE-1',
            password: hashedPassword,
            created_at: new Date().toISOString()
        }];
        await writeAdminsKV(admins);
        return admins;
    }
    return JSON.parse(data);
}

async function writeAdminsKV(admins) {
    const client = await getKV();
    await client.set('admins', JSON.stringify(admins));
}

// ========== 统一导出 ==========
module.exports = {
    // 用户操作
    async readUsers() {
        if (isVercel()) {
            return await readUsersKV();
        }
        return readUsersLocal();
    },

    async writeUsers(users) {
        if (isVercel()) {
            return await writeUsersKV(users);
        }
        return writeUsersLocal(users);
    },

    // 管理员操作
    async readAdmins() {
        if (isVercel()) {
            return await readAdminsKV();
        }
        return readAdminsLocal();
    },

    async writeAdmins(admins) {
        if (isVercel()) {
            return await writeAdminsKV(admins);
        }
        return writeAdminsLocal(admins);
    },

    bcrypt,
    isVercel
};
