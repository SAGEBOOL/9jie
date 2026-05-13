// 九界修真世界 - 百科系统核心逻辑

// ==================== 全局状态 ====================
const state = {
    characters: [],
    systems: [],
    storylines: [],
    currentCharacter: null,
    filters: {
        camp: 'all',
        search: ''
    }
};

// ==================== 人物数据 ====================
const charactersData = [
    {
        id: 'liulanglang',
        name: '刘浪浪',
        emoji: '🧙',
        camp: 'protagonist',
        campName: '主角团',
        identity: '苏易行转世 + 苏舟神识/一体双魂/AI脑机',
        personality: '智慧过人、重情重义、追求自由',
        abilities: ['宇宙能量操控', '一体双魂切换', 'AI辅助决策'],
        arc: '从凡人少年成长为九界守护者的历程',
        systems: ['能源体系', '灵根体系', '功法体系'],
        relations: [
            { id: 'heyi', name: '河一', type: 'brother' },
            { id: 'zhangleisheng', name: '张雷生', type: 'brother' },
            { id: 'ganchengchun', name: '甘承春', type: 'ally' },
            { id: 'lingxi', name: '灵汐', type: 'lover' },
            { id: 'xuanchen', name: '玄宸', type: 'enemy' }
        ],
        stories: [
            '第1卷：觉醒于地球山村',
            '第6-10卷：横扫六国建立势力',
            '第15卷：揭露献祭阴谋'
        ]
    },
    {
        id: 'heyi',
        name: '河一',
        emoji: '🧔',
        avatar: 'assets/images/河一.png',
        camp: 'protagonist',
        campName: '主角团',
        identity: '界域风水师',
        personality: '稳重可靠、刚正不阿',
        abilities: ['界域感知', '风水布局', '封闭派→开放派转变'],
        arc: '从封闭派信徒到开放派领袖的思想转变',
        systems: ['势力分布体系', '能源体系'],
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'brother' },
            { id: 'zhangleisheng', name: '张雷生', type: 'brother' }
        ],
        stories: ['第11卷：修真初触', '第18卷：道心考验']
    },
    {
        id: 'zhangleisheng',
        name: '张雷生',
        emoji: '💰',
        camp: 'protagonist',
        campName: '主角团',
        identity: '商会巨擘',
        personality: '精明能干、善于交际',
        abilities: ['资源调配', '经济操控', '情报网络'],
        arc: '从商会少主到跨九界商业帝国掌门人',
        systems: ['经济体系', '势力分布体系'],
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'brother' },
            { id: 'heyi', name: '河一', type: 'brother' }
        ],
        stories: ['第8卷：兄弟聚义', '第20卷：商业帝国']
    },
    {
        id: 'lingxi',
        name: '灵汐',
        emoji: '👩‍⚕️',
        camp: 'love',
        campName: '爱情线',
        identity: '战国公主/医者/道侣',
        personality: '温柔善良、医术精湛',
        abilities: ['医术', '炼丹', '治愈'],
        arc: '从战国公主到刘浪浪道侣的成长之路',
        systems: ['天材地宝体系', '功法体系'],
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'lover' }
        ],
        stories: ['第5卷：初相遇', '第12卷：医者仁心']
    },
    {
        id: 'xuanchen',
        name: '玄宸',
        emoji: '👑',
        camp: 'antagonist',
        campName: '界主/反派',
        identity: '仙界界主/旧秩序守护者',
        personality: '冷酷威严、秩序至上',
        abilities: ['仙界法则', '能量压制', '界域封锁'],
        arc: '维护旧秩序与主角开放理念的终极对抗',
        systems: ['能源体系', '势力分布体系', '黑暗核心'],
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'enemy' },
            { id: 'xueyan', name: '血衍', type: 'ally' }
        ],
        stories: ['第25卷：仙界对峙', '第30卷：终极对决']
    },
    {
        id: 'tiandaolaoren',
        name: '天道老人',
        emoji: '🧘',
        camp: 'special',
        campName: '特殊角色',
        identity: '三不原则/入梦点拨',
        personality: '超然物外、深不可测',
        abilities: ['入梦点拨', '天道推演', '能量观测'],
        arc: '作为主角成长道路上的神秘引路人',
        systems: ['能源体系', '灵根体系'],
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'mentor' }
        ],
        stories: ['第2卷：入梦点拨', '第28卷：天道真相']
    }
];

// ==================== 体系数据 ====================
const systemsData = [
    {
        id: 1,
        name: '能源体系',
        color: 'purple',
        description: '九类能量：五行基础+宇宙级，对应功法/灵根',
        details: '金、木、水、火、土为基础五行能量，加上宇宙级能量（暗能量、光能、虚空能等），构成完整的能量体系。',
        relatedCharacters: ['刘浪浪', '玄宸', '天道老人']
    },
    {
        id: 2,
        name: '灵根体系',
        color: 'blue',
        description: '灵根=能量吸收端口，五行俱全为顶级，多灵根>单灵根',
        details: '灵根是修真者吸收能量的端口。五行俱全为顶级灵根，多灵根优于单灵根，遵循相生相克规则。',
        relatedCharacters: ['刘浪浪', '天道老人']
    },
    {
        id: 3,
        name: '功法体系',
        color: 'teal',
        description: '功法=能量转化算法，通用/顶级功法，进阶路径',
        details: '功法是将吸收的能量转化为自身修为的算法。分通用功法和顶级功法，有明确的进阶路径。',
        relatedCharacters: ['刘浪浪', '甘承春', '灵汐']
    },
    {
        id: 4,
        name: '势力分布体系',
        color: 'amber',
        description: '七大区域：东方/南方/西方/北方/中央/海外/星际',
        details: '九界分为七大势力区域，每个区域有不同的资源、灵根偏好和势力格局。',
        relatedCharacters: ['河一', '张雷生', '玄宸']
    },
    {
        id: 5,
        name: '经济体系',
        color: 'coral',
        description: '玄石五级体系：凡→灵→真→神→星玄石',
        details: '玄石是修真界通用货币，分为五级：凡品、灵品、真品、神品、星品，形成完整的经济循环。',
        relatedCharacters: ['张雷生']
    },
    {
        id: 6,
        name: '黑暗核心设定',
        color: 'red',
        description: '灵根本源掠夺：截杀/抽源钉/夺灵大法',
        details: '通过截杀、抽源钉、夺灵大法等手段掠夺他人灵根的黑暗设定，是故事冲突的核心发动机。',
        relatedCharacters: ['玄宸', '血衍']
    },
    {
        id: 7,
        name: '天材地宝体系',
        color: 'green',
        description: '三种跨系宝药：安魂紫芝/五行均衡玉膏/续脉幽花',
        details: '三种跨系珍稀宝药：安魂紫芝、五行均衡玉膏、续脉幽花，用于平衡修炼中的各种问题。',
        relatedCharacters: ['甘承春', '灵汐']
    }
];

// ==================== 故事线数据 ====================
const storylineData = [
    {
        volume: 1,
        title: '觉醒',
        mainPlots: ['生存线：凡人出身', '地球背景'],
        subPlots: ['神秘觉醒'],
        characters: ['刘浪浪'],
        hook: '平凡少年突然发现自己与众不同'
    },
    {
        volume: 6,
        title: '兄弟聚义',
        mainPlots: ['生存线：兄弟聚首', '势力线：初建势力'],
        subPlots: ['河一、张雷生登场'],
        characters: ['刘浪浪', '河一', '张雷生'],
        hook: '三位主角正式聚义，开启宏图大业'
    },
    {
        volume: 10,
        title: '急流勇退',
        mainPlots: ['生存线：横扫六国', '人性线：功成身退'],
        subPlots: ['建立势力后选择隐退'],
        characters: ['刘浪浪', '张雷生'],
        hook: '爽点：功成名就急流勇退，开启修真之路'
    },
    {
        volume: 15,
        title: '献祭阴谋',
        mainPlots: ['回家线：揭露阴谋', '人性线：道心考验'],
        subPlots: ['发现修真界黑暗秘密'],
        characters: ['刘浪浪', '河一'],
        hook: '钩子：发现九界背后的献祭阴谋'
    },
    {
        volume: 20,
        title: '终极对决伏笔',
        mainPlots: ['生存线：兄弟对立', '回家线：地球信号'],
        subPlots: ['收到来自地球的求救信号'],
        characters: ['刘浪浪', '玄宸'],
        hook: '刚入修真界被追杀，却收到地球家人的信号'
    },
    {
        volume: 25,
        title: '灵气重构',
        mainPlots: ['生存线：重构灵气', '回家线：寻找罗布泊'],
        subPlots: ['揭开核战关联'],
        characters: ['刘浪浪', '玄宸'],
        hook: '寻找改变九界格局的关键'
    },
    {
        volume: 30,
        title: '双向圆满',
        mainPlots: ['回家线：救赎地球', '人性线：克服本性证道'],
        subPlots: ['治愈地球、人性救赎'],
        characters: ['刘浪浪', '灵汐'],
        hook: '主角与地球家人的双向圆满结局'
    }
];

// ==================== 核心功能 ====================

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    state.characters = charactersData;
    state.systems = systemsData;
    state.storylines = storylineData;
    
    renderCharacters();
    renderSystems();
    renderStorylines();
    initSearch();
    initFilters();
    
    console.log('九界修真百科系统初始化完成');
});

// 滚动到指定区块
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 渲染人物卡牌
function renderCharacters() {
    const container = document.querySelector('#characters .grid');
    if (!container) return;
    
    const filtered = state.characters.filter(char => {
        const matchCamp = state.filters.camp === 'all' || char.camp === state.filters.camp;
        const matchSearch = char.name.includes(state.filters.search) || 
                            char.identity.includes(state.filters.search);
        return matchCamp && matchSearch;
    });
    
    container.innerHTML = filtered.map(char => `
        <div class="character-card" 
             onclick="showCharacterDetail('${char.id}')">
            <div class="h-32 flex items-center justify-center" style="background: linear-gradient(135deg, ${getCampColor(char.camp)});">
                ${char.avatar 
                    ? `<img src="${char.avatar}" alt="${char.name}" class="w-16 h-16 rounded-full object-cover">`
                    : `<span class="text-4xl">${char.emoji}</span>`
                }
            </div>
            <div class="p-3">
                <h3 class="font-bold text-lg" style="color: #ccd6f6;">${char.name}</h3>
                <p class="text-sm" style="color: #8892b0;">${char.campName}</p>
            </div>
        </div>
    `).join('');
}

// 获取阵营颜色
function getCampColor(camp) {
    const colors = {
        protagonist: 'rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)',
        antagonist: 'rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2)',
        love: 'rgba(236, 72, 153, 0.2), rgba(159, 42, 99, 0.2)',
        special: 'rgba(107, 114, 128, 0.2), rgba(75, 85, 99, 0.2)',
        neutral: 'rgba(245, 158, 11, 0.2), rgba(202, 138, 4, 0.2)'
    };
    return colors[camp] || colors.special;
}

// 显示人物详情
function showCharacterDetail(charId) {
    const char = state.characters.find(c => c.id === charId);
    if (!char) return;
    
    state.currentCharacter = char;
    
    const modal = document.getElementById('character-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    // 设置标题（支持头像图片）
    if (char.avatar) {
        title.innerHTML = `<img src="${char.avatar}" alt="${char.name}" class="w-8 h-8 rounded-full inline-block mr-2"> ${char.name}`;
    } else {
        title.textContent = `${char.emoji} ${char.name}`;
    }
    content.innerHTML = `
        <div class="space-y-6" style="color: #ccd6f6;">
            <!-- 基本信息 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">基本信息</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm" style="color: #8892b0;">阵营</span>
                        <p class="font-medium" style="color: #e0e0e0;">${char.campName}</p>
                    </div>
                    <div>
                        <span class="text-sm" style="color: #8892b0;">身份</span>
                        <p class="font-medium" style="color: #e0e0e0;">${char.identity}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <span class="text-sm" style="color: #8892b0;">性格</span>
                    <p style="color: #ccd6f6;">${char.personality}</p>
                </div>
            </div>
            
            <!-- 能力 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">核心能力</h3>
                <div class="flex flex-wrap gap-2">
                    ${char.abilities.map(a => `<span class="px-3 py-1 rounded-full text-sm" style="background: rgba(139, 92, 246, 0.2); color: #a78bfa;">${a}</span>`).join('')}
                </div>
            </div>
            
            <!-- 人物弧光 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">人物弧光</h3>
                <p style="color: #ccd6f6;">${char.arc}</p>
            </div>
            
            <!-- 体系位置 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">在体系中的位置</h3>
                <div class="flex flex-wrap gap-2">
                    ${char.systems.map(s => `<span class="px-3 py-1 rounded-full text-sm" style="background: rgba(96, 165, 250, 0.2); color: #60a5fa;">${s}</span>`).join('')}
                </div>
            </div>
            
            <!-- 关系图谱 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">人物关系图谱</h3>
                <div id="relationship-graph" class="mb-4">
                    ${renderMiniGraph(char)}
                </div>
                <div class="space-y-2">
                    ${char.relations.map(r => `
                        <div class="flex items-center justify-between p-2 rounded-lg" style="background: rgba(255, 255, 255, 0.05);">
                            <span class="cursor-pointer font-medium" style="color: #60a5fa;" onclick="showCharacterDetail('${r.id}')">${r.name}</span>
                            <span class="px-2 py-1 text-xs rounded ${
                                r.type === 'brother' ? 'relation-brother' :
                                r.type === 'enemy' ? 'relation-enemy' :
                                r.type === 'lover' ? 'relation-lover' :
                                r.type === 'mentor' ? 'relation-mentor' :
                                'relation-ally'
                            }">${
                                r.type === 'brother' ? '兄弟' :
                                r.type === 'enemy' ? '宿敌' :
                                r.type === 'lover' ? '道侣' :
                                r.type === 'mentor' ? '导师' : '盟友'
                            }</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 相关剧情 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">相关剧情</h3>
                <ul class="list-disc list-inside space-y-1">
                    ${char.stories.map(s => `<li style="color: #8892b0;">${s}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// 渲染迷你关系图谱
function renderMiniGraph(char) {
    const graphContainer = document.createElement('div');
    graphContainer.className = 'relative w-full h-48 rounded-lg overflow-hidden';
    graphContainer.style.background = 'rgba(0, 0, 0, 0.3)';
    
    // 中心节点
    const centerX = 50;
    const centerY = 50;
    
    // 根据关系数量调整布局
    const relCount = char.relations.length;
    
    // SVG滤镜：液态玻璃磨砂效果
    const svgFilters = `
        <defs>
            <!-- 液态玻璃磨砂滤镜 -->
            <filter id="frostedGlass" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/>
                <feColorMatrix in="blur" type="matrix" 
                    values="1 0 0 0 0.1
                            0 1 0 0 0.1
                            0 0 1 0 0.15
                            0 0 0 0.85 0" result="frosted"/>
                <feComposite in="SourceGraphic" in2="frosted" operator="over"/>
            </filter>
            <!-- 发光效果 -->
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
    `;
    
    let svg = `<svg viewBox="0 0 200 100" class="w-full h-full">${svgFilters}`;
    
    // 点划线图案定义
    svg += `<defs>
        <!-- 不同关系类型的点划线图案 -->
        <pattern id="dash-brother" patternUnits="userSpaceOnUse" width="6" height="2" patternTransform="rotate(0)">
            <line x1="0" y1="1" x2="4" y2="1" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"/>
        </pattern>
        <pattern id="dash-enemy" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round"/>
        </pattern>
        <pattern id="dash-lover" patternUnits="userSpaceOnUse" width="6" height="2" patternTransform="rotate(0)">
            <line x1="0" y1="1" x2="3" y2="1" stroke="#EC4899" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3,3"/>
        </pattern>
        <pattern id="dash-mentor" patternUnits="userSpaceOnUse" width="8" height="2" patternTransform="rotate(0)">
            <line x1="0" y1="1" x2="2" y2="1" stroke="#8B5CF6" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2,2,2,2"/>
        </pattern>
        <pattern id="dash-ally" patternUnits="userSpaceOnUse" width="5" height="2" patternTransform="rotate(0)">
            <line x1="0" y1="1" x2="2" y2="1" stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2,3"/>
        </pattern>
    </defs>`;
    
    // 绘制关系线（使用点划线）
    char.relations.forEach((rel, index) => {
        const angle = (index / relCount) * Math.PI * 2 - Math.PI / 2;
        const radius = Math.min(32, 25 + relCount * 2); // 根据关系数量调整半径
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.75; // 椭圆布局
        
        // 获取关系类型对应的颜色和点划线样式
        const color = getRelationColor(rel.type);
        const dashType = getDashType(rel.type);
        
        // 绘制发光效果底层
        svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" 
                    stroke="${color}" stroke-width="3" opacity="0.2" filter="url(#glow)"/>`;
        
        // 绘制点划线（带呼吸动效）
        svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" 
                    stroke="${color}" stroke-width="1.2" opacity="0.7" 
                    stroke-dasharray="4,3" stroke-linecap="round"
                    class="relation-line"/>`;
        
        // 关系类型图标（在线中间）
        const midX = (centerX + x) / 2;
        const midY = (centerY + y) / 2;
        const icon = getRelationIcon(rel.type);
        svg += `<circle cx="${midX}" cy="${midY}" r="4" fill="rgba(0,0,0,0.6)" stroke="${color}" stroke-width="0.8"/>`;
        svg += `<text x="${midX}" y="${midY + 1.5}" text-anchor="middle" font-size="4" fill="${color}" font-weight="bold">${icon}</text>`;
        
        // 液态玻璃磨砂圆形节点（优化比例）
        const nodeRadius = Math.max(6, Math.min(8, 7 - relCount * 0.3)); // 根据关系数量调整大小
        svg += `<circle cx="${x}" cy="${y}" r="${nodeRadius}" fill="${color}" filter="url(#frostedGlass)" class="cursor-pointer" opacity="0.9"/>`;
        // 添加白色边框
        svg += `<circle cx="${x}" cy="${y}" r="${nodeRadius}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>`;
        // 名字标签
        svg += `<text x="${x}" y="${y + nodeRadius + 8}" text-anchor="middle" font-size="5.5" fill="#e0e0e0" font-weight="500" pointer-events="none">${rel.name}</text>`;
    });
    
    // 中心节点（主角 - 稍大一些）
    const centerRadius = Math.max(9, 10 - relCount * 0.2);
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${centerRadius + 2}" fill="rgba(102,126,234,0.3)" filter="url(#glow)"/>`;
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${centerRadius}" fill="#667eea" filter="url(#frostedGlass)" opacity="0.95"/>`;
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${centerRadius}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>`;
    svg += `<text x="${centerX}" y="${centerY + 3}" text-anchor="middle" font-size="5.5" fill="white" font-weight="bold">${char.name.slice(0, 3)}</text>`;
    
    svg += '</svg>';
    
    return svg;
}

// 获取点划线类型
function getDashType(type) {
    const dashTypes = {
        brother: '4,3',      // 兄弟 - 长虚线
        enemy: '2,2',        // 敌人 - 短密集虚线
        lover: '2,2,6,2',    // 道侣 - 点划线
        mentor: '1,2',        // 导师 - 点线
        ally: '3,2'          // 盟友 - 中等虚线
    };
    return dashTypes[type] || '4,3';
}

// 获取关系图标
function getRelationIcon(type) {
    const icons = {
        brother: '👥',
        enemy: '⚔',
        lover: '♥',
        mentor: '★',
        ally: '◆'
    };
    return icons[type] || '●';
}

// 获取关系颜色
function getRelationColor(type) {
    const colors = {
        brother: '#3B82F6',
        enemy: '#EF4444',
        lover: '#EC4899',
        mentor: '#8B5CF6',
        ally: '#10B981'
    };
    return colors[type] || '#6B7280';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('character-modal').classList.add('hidden');
    state.currentCharacter = null;
}

// 点击弹窗背景关闭
document.getElementById('character-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'character-modal') {
        closeModal();
    }
});

// 渲染体系图
function renderSystems() {
    const container = document.querySelector('#systems .space-y-6');
    if (!container) return;
    
    const colors = [
        { bg: 'rgba(139, 92, 246, 0.2)', border: '#a78bfa', text: '#a78bfa' },
        { bg: 'rgba(96, 165, 250, 0.2)', border: '#60a5fa', text: '#60a5fa' },
        { bg: 'rgba(52, 211, 153, 0.2)', border: '#34d399', text: '#34d399' },
        { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24', text: '#fbbf24' },
        { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#f97316' },
        { bg: 'rgba(248, 113, 113, 0.2)', border: '#f87171', text: '#f87171' },
        { bg: 'rgba(74, 222, 128, 0.2)', border: '#4ade80', text: '#4ade80' }
    ];
    
    container.innerHTML = `
        <div class="rounded-xl p-6" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);">
            <h3 class="text-xl font-semibold mb-4" style="color: #ccd6f6;">七层递进结构</h3>
            <div class="flex flex-col space-y-4">
                ${state.systems.map((sys, index) => {
                    const c = colors[index] || colors[0];
                    return `
                    <div class="system-layer flex items-center p-4 rounded-lg cursor-pointer" 
                         style="background: ${c.bg}; border-left: 4px solid ${c.border};"
                         onclick="showSystemDetail(${sys.id})">
                        <span class="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4" 
                              style="background: ${c.border}; color: #1a1a2e;">${index + 1}</span>
                        <div class="flex-1">
                            <h4 class="font-bold" style="color: ${c.text};">${sys.name}</h4>
                            <p class="text-sm" style="color: #8892b0;">${sys.description}</p>
                        </div>
                        <span style="color: ${c.border};">→</span>
                    </div>
                `}).join('')}
            </div>
        </div>
        
        <!-- 灵根测试入口 -->
        <div class="rounded-xl p-6 text-white" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));">
            <h3 class="text-xl font-semibold mb-2">🧪 灵根测试</h3>
            <p class="mb-4 opacity-90">根据设定测试你的灵根属性</p>
            <button onclick="startLinggenTest()" class="px-6 py-2 rounded-full font-bold" style="background: rgba(100, 255, 218, 0.9); color: #1a1a2e;">
                开始测试 →
            </button>
        </div>
    `;
}

// 显示体系详情
function showSystemDetail(sysId) {
    const sys = state.systems.find(s => s.id === sysId);
    if (!sys) return;
    
    const modal = document.getElementById('character-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = sys.name;
    title.style.color = '#64ffda';
    content.innerHTML = `
        <div class="space-y-6">
            <div class="rounded-xl p-4" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">体系说明</h3>
                <p style="color: #ccd6f6;">${sys.details}</p>
            </div>
            
            <div class="rounded-xl p-4" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">相关人物</h3>
                <div class="flex flex-wrap gap-2">
                    ${sys.relatedCharacters.map(c => `
                        <span class="px-3 py-1 rounded-full text-sm cursor-pointer" 
                              style="background: rgba(96, 165, 250, 0.2); color: #60a5fa;"
                              onclick="showCharacterDetail('${getCharId(c)}')">${c}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// 根据名字获取角色ID
function getCharId(name) {
    const char = state.characters.find(c => c.name === name);
    return char ? char.id : '';
}

// 渲染故事线
function renderStorylines() {
    const container = document.querySelector('#story .space-y-4');
    if (!container) return;
    
    // 渲染三条主线
    const mainPlots = [
        { id: 'survival', name: '生存+势力线', color: 'red', plot: '凡人建势力→统战国→修真探九界→九界守护者' },
        { id: 'home', name: '回家+救赎线', color: 'blue', plot: '寻罗布泊之眼→揭核战关联→救地球家人→治愈地球' },
        { id: 'humanity', name: '人性+道线', color: 'green', plot: '人性黑暗与光辉→修仙即修心→克服本性证道' }
    ];
    
    const storySection = document.querySelector('#story');
    
    // 插入时间轴
    const timelineHTML = `
        <div class="rounded-xl p-6 mb-8" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
            <h3 class="text-xl font-semibold mb-6" style="color: #64ffda;">📅 30卷时间轴</h3>
            <div class="timeline-container">
                ${state.storylines.map(s => `
                    <div class="timeline-item" style="background: rgba(255, 255, 255, 0.06);">
                        <div class="flex justify-between items-start mb-2">
                            <span class="px-3 py-1 rounded-full text-sm font-bold" style="background: ${getPlotBg(s)}; color: ${getPlotColor(s)};">
                                第${s.volume}卷
                            </span>
                            <span class="text-sm" style="color: #8892b0;">${s.title}</span>
                        </div>
                        <h4 class="font-bold mb-2" style="color: #ccd6f6;">${s.title}</h4>
                        <p class="text-sm mb-2" style="color: #8892b0;">${s.mainPlots.join(' | ')}</p>
                        <p class="text-sm" style="color: #ff9f1c;">🎣 钩子：${s.hook}</p>
                        <div class="mt-2">
                            ${s.characters.map(c => `
                                <span class="inline-block px-2 py-0.5 rounded text-xs mr-1" style="background: rgba(255, 255, 255, 0.1); color: #8892b0;">${c}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    storySection.insertAdjacentHTML('afterbegin', timelineHTML);
}

// 获取剧情颜色
function getPlotColor(story) {
    if (story.mainPlots.some(p => p.includes('生存线') || p.includes('势力线'))) return '#f87171';
    if (story.mainPlots.some(p => p.includes('回家线'))) return '#60a5fa';
    if (story.mainPlots.some(p => p.includes('人性线'))) return '#4ade80';
    return '#8892b0';
}

// 获取剧情背景色
function getPlotBg(story) {
    if (story.mainPlots.some(p => p.includes('生存线') || p.includes('势力线'))) return 'rgba(248, 113, 113, 0.2)';
    if (story.mainPlots.some(p => p.includes('回家线'))) return 'rgba(96, 165, 250, 0.2)';
    if (story.mainPlots.some(p => p.includes('人性线'))) return 'rgba(74, 222, 128, 0.2)';
    return 'rgba(136, 155, 176, 0.2)';
}

// 初始化搜索
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.filters.search = e.target.value;
            renderCharacters();
        });
    }
}

// 初始化筛选
function initFilters() {
    // 筛选按钮逻辑
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filters.camp = btn.dataset.camp;
            renderCharacters();
        });
    });
}

// 灵根测试
function startLinggenTest() {
    const modal = document.getElementById('character-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = '🧪 灵根测试';
    content.innerHTML = `
        <div id="test-container" class="space-y-6">
            <div class="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4">
                <p class="text-center text-lg mb-4">问题 1/5：你更擅长吸收哪种能量？</p>
                <div class="grid grid-cols-2 gap-3">
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-purple-200 hover:border-purple-500 transition" onclick="answerTest('木')">🪵 木能 - 生命成长</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-red-200 hover:border-red-500 transition" onclick="answerTest('火')">🔥 火能 - 热烈爆发</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-gray-200 hover:border-gray-500 transition" onclick="answerTest('金')">⚔️ 金能 - 锐利坚硬</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-blue-200 hover:border-blue-500 transition" onclick="answerTest('水')">💧 水能 - 灵活适应</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-yellow-200 hover:border-yellow-500 transition" onclick="answerTest('土')">🏔️ 土能 - 稳重厚重</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-indigo-200 hover:border-indigo-500 transition col-span-2" onclick="answerTest('宇宙')">✨ 宇宙能 - 超越五行</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    
    window.testAnswers = [];
}

function answerTest(element) {
    window.testAnswers.push(element);
    
    const questions = [
        '你更擅长吸收哪种能量？',
        '你的修炼风格更倾向于？',
        '面对强敌你会？',
        '你的终极目标是？',
        '你的心性更接近？'
    ];
    
    const options = [
        ['木', '火', '金', '水', '土', '宇宙'],
        ['稳扎稳打', '爆发输出', '以柔克刚', '灵活多变', '厚积薄发', '超越常规'],
        ['正面硬刚', '智取周旋', '防守反击', '寻找队友', '战略撤退', '打破规则'],
        ['成为至强者', '守护重要的人', '探究真理', '逍遥自在', '拯救苍生', '超越一切'],
        ['刚正不阿', '热血冲动', '冷静理智', '圆滑世故', '淡泊名利', '叛逆不羁']
    ];
    
    if (window.testAnswers.length < 5) {
        const container = document.getElementById('test-container');
        const qIndex = window.testAnswers.length;
        const colorClass = ['purple', 'blue', 'teal', 'amber', 'green'][qIndex];
        
        container.innerHTML = `
            <div class="bg-${colorClass}-50/80 backdrop-blur-sm rounded-xl p-4">
                <p class="text-center text-lg mb-4">问题 ${qIndex + 1}/5：${questions[qIndex]}</p>
                <div class="grid grid-cols-2 gap-3">
                    ${options[qIndex].map(opt => `
                        <button class="p-3 bg-white/90 rounded-lg border-2 border-${colorClass}-200 hover:border-${colorClass}-500 transition"
                                onclick="answerTest('${opt}')">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        showTestResult();
    }
}

function showTestResult() {
    const container = document.getElementById('test-container');
    
    // 分析答案
    const counts = { '木': 0, '火': 0, '金': 0, '水': 0, '土': 0, '宇宙': 0 };
    window.testAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    
    const elements = Object.entries(counts)
        .filter(([k, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([k]) => k);
    
    let result = '';
    let description = '';
    let grade = '';
    
    if (elements.includes('宇宙')) {
        result = '五灵根圆满 + 宇宙根';
        description = '传说中超越五行的完美灵根，注定成为改变九界格局的存在！';
        grade = '传说级';
    } else if (elements.length === 5) {
        result = '五灵根俱全';
        description = '五行均衡，万法皆通，是顶级修炼天才！';
        grade = '史诗级';
    } else if (elements.length >= 3) {
        result = elements.join('') + '多灵根';
        description = `拥有${elements.join('、')}灵根，修炼潜力优异！`;
        grade = '稀有级';
    } else {
        result = elements.join('') + '灵根';
        description = `擅长${elements.join('和')}能量的修炼！`;
        grade = '普通级';
    }
    
    container.innerHTML = `
        <div class="text-center">
            <div class="linggen-result mb-6">
                <p class="text-sm opacity-80 mb-2">你的灵根类型</p>
                <p class="text-3xl font-bold mb-4">${result}</p>
                <p class="text-sm opacity-80">评级：${grade}</p>
            </div>
            
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-left">
                <h4 class="font-bold mb-2">灵根分析</h4>
                <p class="text-gray-700">${description}</p>
                
                <h4 class="font-bold mt-4 mb-2">建议修炼方向</h4>
                <p class="text-gray-700">
                    ${elements.includes('木') ? '• 木能修炼：偏向生命恢复和成长型功法<br>' : ''}
                    ${elements.includes('火') ? '• 火能修炼：偏向爆发攻击型功法<br>' : ''}
                    ${elements.includes('金') ? '• 金能修炼：偏向锐利攻击型功法<br>' : ''}
                    ${elements.includes('水') ? '• 水能修炼：偏向灵活适应型功法<br>' : ''}
                    ${elements.includes('土') ? '• 土能修炼：偏向防御持久型功法<br>' : ''}
                    ${elements.includes('宇宙') ? '• 宇宙能修炼：超越五行，探索未知领域<br>' : ''}
                </p>
            </div>
            
            <button onclick="closeModal()" class="mt-6 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition">
                关闭
            </button>
        </div>
    `;
    
    window.testAnswers = [];
}

// ESC键关闭弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});