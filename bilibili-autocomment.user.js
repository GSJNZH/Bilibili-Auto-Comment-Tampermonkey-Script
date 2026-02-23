// ==UserScript==
// @name         B站自动评论 v7.8（多系列·标点限制·数量调整）
// @namespace    https://github.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/
// @version      7.8
// @description  每次随机选择1-2个系列的表情包，根据文案长度动态抽取4-15个，每个标点后最多跟一个表情（最后一个除外），随机分布在开头、标点后、结尾
// @author       GSJNZH
// @match        www.bilibili.com/video/BV1fy4y1L7Rq/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/70/ab/15/70ab1507-a468-1dc9-ad3b-d4fe7d6f70dd/AppIcon-1x_U007epad-0-0-0-85-220-0.png/434x0w.webp
// @downloadURL  https://raw.githubusercontent.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/refs/heads/main/bilibili-autocomment.user.js
// @updateURL    https://raw.githubusercontent.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/refs/heads/main/bilibili-autocomment.user.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🔥 B站自动评论 v7.8 (多系列·标点限制·数量调整) 已启动');

    // ---------- 表情包元素按系列分组 ----------
    const SERIES = {
        aveMujica: [
            '[Ave Mujica_挺好]',
            '[Ave Mujica_再等一下]',
            '[Ave Mujica_震惊]',
            '[Ave Mujica_比叉叉]',
            '[Ave Mujica_开心]',
            '[Ave Mujica_哼]',
            '[Ave Mujica_怎么突然]',
            '[Ave Mujica_诶]',
            '[Ave Mujica_一次买够]',
            '[Ave Mujica_难道？]',
            '[Ave Mujica_睡觉]',
            '[Ave Mujica_我要告你]',
            '[Ave Mujica_赌气]',
            '[Ave Mujica_记得微笑]',
            '[Ave Mujica_委屈]',
            '[Ave Mujica_不行]',
            '[Ave Mujica_美味]',
            '[Ave Mujica_我有话说]',
            '[Ave Mujica_害怕]',
            '[Ave Mujica_愉快]'
        ],
        mygo: [
            '[Mygo表情包_害羞]',
            '[Mygo表情包_生气]',
            '[Mygo表情包_发送消息]',
            '[Mygo表情包_抹茶芭菲]',
            '[Mygo表情包_请点单]',
            '[Mygo表情包_不要吵架]',
            '[Mygo表情包_Love]',
            '[Mygo表情包_让我看看]',
            '[Mygo表情包_溜了溜了]',
            '[Mygo表情包_那我呢？]',
            '[Mygo表情包_创作中]',
            '[Mygo表情包_探头]',
            '[Mygo表情包_为什么！]',
            '[Mygo表情包_刚睡醒]',
            '[Mygo表情包_哈？]',
            '[Mygo表情包_忧郁]',
            '[Mygo表情包_不会吧？]',
            '[Mygo表情包_大哭]',
            '[Mygo表情包_有趣的女人]',
            '[Mygo表情包_Block!]'
        ],
        year25: [
            '[25年度表情包_一]',
            '[25年度表情包_起]',
            '[25年度表情包_摸]',
            '[25年度表情包_凹]',
            '[25年度表情包_猫]',
            '[25年度表情包_福到了]',
            '[25年度表情包_马上有钱]',
            '[25年度表情包_赞个点]',
            '[25年度表情包_不太冷]',
            '[25年度表情包_点个赞]',
            '[25年度表情包_坏笑]',
            '[25年度表情包_伸手]',
            '[25年度表情包_戳一下]',
            '[25年度表情包_点点]',
            '[25年度表情包_问号]',
            '[25年度表情包_藏狐]',
            '[25年度表情包_ok]',
            '[25年度表情包_比心]',
            '[25年度表情包_戳戳]',
            '[25年度表情包_马]',
            '[25年度表情包_狗头]',
            '[25年度表情包_ye]',
            '[25年度表情包_送花]',
            '[25年度表情包_强]',
            '[25年度表情包_立]',
            '[25年度表情包_猴]',
            '[25年度表情包_趴趴]',
            '[25年度表情包_鱼头]',
            '[25年度表情包_鱼尾]',
            '[25年度表情包_嗷]',
            '[25年度表情包_马不]',
            '[25年度表情包_停]',
            '[25年度表情包_蹄]',
            '[25年度表情包_拍一下]',
            '[25年度表情包_当古人]'
        ],
        hotWords: [
            // 原有的热词系列
            '[热词系列_再给一集]',
            '[热词系列_我真棒]',
            '[热词系列_有点意思]',
            '[热词系列_可爱捏]',
            '[热词系列_真正的英雄]',
            '[热词系列_什么叫惊喜]',
            '[热词系列_再飞亿会儿]',
            '[热词系列_啊?]',
            '[热词系列_发刀大队]',
            '[热词系列_道友请了]',
            '[热词系列_念头通达]',
            '[热词系列_课代表]',
            '[热词表情_世萌双冠]',
            '[热词系列_谢谢老师]',
            '[热词系列_大好人]',
            '[热词系列_夸夸]',
            '[热词系列_六到无语]',
            '[热词系列_美貌惊人]',
            '[热词系列_干杯]',
            '[热词系列_肥肠自信]',
            // 之前新增的热词
            '[热词系列_“狼火”]',
            '[热词系列_你可真星]',
            '[热词系列_献上膝盖]',
            '[热词系列_我裂开了]',
            '[热词系列_有内味了]',
            '[热词系列_猛男必看]',
            '[热词系列_奥力给]',
            '[热词系列_神仙UP]',
            '[热词系列_问号]',
            '[热词系列_我哭了]',
            '[热词系列_不愧是你]',
            '[热词系列_高产]',
            '[热词系列_真香]',
            '[热词系列_我全都要]',
            '[热词系列_爷关更]',
            '[热词系列_锤]',
            '[热词系列_我酸了]',
            '[热词系列_有生之年]',
            '[热词系列_镇站之宝]',
            '[热词系列_我太南了]',
            '[热词系列_完结撒花]',
            '[热词系列_大师球]',
            '[热词系列_知识盲区]',
            '[热词系列_爷青回]',
            '[热词系列_芜湖起飞]',
            '[热词系列_夺笋呐]',
            '[热词系列_两面包夹芝士]',
            '[热词系列_梦幻联动]',
            '[热词系列_泪目]',
            '[热词系列_保护]',
            '[热词系列_爱了爱了]',
            '[热词系列_可以]',
            '[热词系列_希望没事]',
            '[热词系列_打卡]',
            '[热词系列_DNA]',
            '[热词系列_这次一定]',
            '[热词系列_AWSL]',
            '[热词系列_霸体在此]',
            '[热词系列_递话筒]',
            '[热词系列_你细品]',
            '[热词系列_咕咕]',
            '[热词系列_张三]',
            '[热词系列_害]',
            '[念诗之王]',
            '[热词系列_对象]',
            '[热词系列_不孤鸟]',
            '[热词系列_洛水天依]',
            '[热词系列_秀]',
            '[热词系列_标准结局]',
            '[热词系列_B站有房]',
            '[热词系列_破防了]',
            '[热词系列_多谢款待]',
            '[热词系列_燃起来了]',
            '[热词系列_YYDS]',
            '[热词系列_入站必刷]',
            '[热词系列_赛博考古]',
            '[热词系列_饮茶先啦]',
            '[热词系列_再来亿遍]',
            '[热词系列_热乎]',
            '[热词系列_好活]',
            '[热词系列_热门通知]',
            '[热词系列_好家伙]',
            '[热词系列_排面]',
            '[热词系列_我故意的]',
            '[热词系列_知识增加]',
            '[热词系列_三连]',
            '[热词系列_妙啊]',
            '[热词系列_哇酷哇酷]',
            '[热词系列_呵呵]',
            '[热词系列_上任鹅城]',
            '[热词系列_好人好抱]',
            '[热词系列_好起来了]',
            '[热词系列_守护世界]',
            '[热词系列_暖暖的]',
            '[热词系列_因为TA善]',
            '[热词系列_助力梦想]',
            '[热词系列_确诊为好人]',
            '[热词系列_你是这个]',
            '[热词系列_优雅]',
            '[热词表情_哎呦不错哦]',
            '[热词系列_好耶]',
            '[热词系列_你币有了]',
            '[热词系列_吹爆]'
        ],
        pigeon: [
            '[有鸽调]',
            '[可爱捏]',
            '[手工鸽]',
            '[田园牧鸽]',
            '[B站一鸽]',
            '[冻鳗高手]',
            '[鸽你太美]',
            '[神操作]',
            '[吃瓜群鸽]',
            '[求更新]',
            '[Vlo鸽]',
            '[如听仙乐]',
            '[字少事大]',
            '[笑出咕叫]',
            '[鸽物致知]',
            '[鸽就鸽位]',
            '[量子啾缠]',
            '[来一勺]',
            '[行鸽无疆]',
            '[载鸽载舞]',
            '[飞驰鸽生]',
            '[催更]',
            '[神剧打卡]',
            '[神片打卡]',
            '[神作打卡]'
        ],
        che: [
            '[CHE_emmm]',
            '[CHE_respect]',
            '[CHE_salute]',
            '[CHE_吹空调]',
            '[CHE_大为震撼]',
            '[CHE_拿来吧你]',
            '[CHE_强壮]',
            '[CHE_晒化了]',
            '[CHE_学习ing]',
            '[CHE_嘬奶茶]'
        ],
        tarot: [
            '[2233塔罗牌_？？？]',
            '[2233塔罗牌_666]',
            '[2233塔罗牌_AWSL]',
            '[2233塔罗牌_奥利给]',
            '[2233塔罗牌_比心心]',
            '[2233塔罗牌_不愧是我]',
            '[2233塔罗牌_不约]',
            '[2233塔罗牌_撒花]',
            '[2233塔罗牌_我觉得星]',
            '[2233塔罗牌_下次一定]'
        ]
    };

    // 系列名称列表，用于随机选择
    const SERIES_NAMES = ['aveMujica', 'mygo', 'year25', 'hotWords', 'pigeon', 'che', 'tarot'];

    // ---------- 配置存储 ----------
    const STORAGE_KEY_TEXT = 'bili_comment_texts_v15';
    const STORAGE_KEY_INTERVAL = 'bili_comment_interval_v15';
    const DEFAULT_TEXTS = `打卡\n路过\n支持一下\n好视频\n学到了\n三连支持`;

    let timerId = null;
    let isRunning = false;
    let failCount = 0;
    const MAX_FAILS = 3;
    let panel, textareaInput, intervalInput, startBtn, stopBtn, statusDiv;

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function getCommentShadowRoot(timeout = 10000) {
        const host = document.querySelector('bili-comments');
        if (!host) {
            console.error('❌ 未找到 bili-comments 元素');
            return null;
        }
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (host.shadowRoot) {
                console.log('✅ 获取到 bili-comments shadowRoot');
                return host.shadowRoot;
            }
            await delay(200);
        }
        console.error('❌ 等待 bili-comments shadowRoot 超时');
        return null;
    }

    async function expandComment(shadowRoot) {
        const newDiv = shadowRoot.querySelector('#new');
        if (newDiv) {
            console.log('👆 点击 #new 展开评论区');
            newDiv.click();
            await delay(1500);
        } else {
            console.warn('⚠️ 未找到 #new 元素');
        }
    }

    async function findElements(shadowRoot) {
        // 1. 找到 bili-comment-box
        let commentBox = shadowRoot.querySelector('bili-comment-box');
        if (!commentBox) {
            console.log('⏳ bili-comment-box 尚未出现，等待...');
            for (let i = 0; i < 10; i++) {
                await delay(500);
                commentBox = shadowRoot.querySelector('bili-comment-box');
                if (commentBox) break;
            }
        }
        if (!commentBox) {
            console.error('❌ 未找到 bili-comment-box');
            return null;
        }
        console.log('✅ 找到 bili-comment-box');

        console.log('👆 点击 bili-comment-box 激活输入框');
        commentBox.click();
        await delay(800);

        // 2. 获取 bili-comment-box 的 shadowRoot
        let boxShadowRoot = null;
        for (let i = 0; i < 20; i++) {
            if (commentBox.shadowRoot) {
                boxShadowRoot = commentBox.shadowRoot;
                console.log('✅ 获取到 bili-comment-box shadowRoot');
                break;
            }
            await delay(200);
        }
        if (!boxShadowRoot) {
            console.error('❌ bili-comment-box 无 shadowRoot');
            return null;
        }

        // 3. 在 boxShadowRoot 中查找 bili-comment-rich-textarea
        let richTextarea = boxShadowRoot.querySelector('bili-comment-rich-textarea');
        if (!richTextarea) {
            console.error('❌ 未找到 bili-comment-rich-textarea');
            return null;
        }
        console.log('✅ 找到 bili-comment-rich-textarea');

        // 4. 获取 richTextarea 的 shadowRoot
        let richShadowRoot = null;
        for (let i = 0; i < 20; i++) {
            if (richTextarea.shadowRoot) {
                richShadowRoot = richTextarea.shadowRoot;
                console.log('✅ 获取到 bili-comment-rich-textarea shadowRoot');
                break;
            }
            await delay(200);
        }
        if (!richShadowRoot) {
            console.error('❌ bili-comment-rich-textarea 无 shadowRoot');
            return null;
        }

        // 5. 在 richShadowRoot 中查找 contenteditable 输入框（等待出现）
        let input = null;
        for (let i = 0; i < 10; i++) {
            input = richShadowRoot.querySelector('div[contenteditable="true"]');
            if (input) break;
            await delay(500);
        }
        if (!input) {
            console.error('❌ 未找到输入框');
            return null;
        }
        console.log('✅ 找到输入框');

        // 6. 查找发布按钮（可能在 richShadowRoot 或 boxShadowRoot）
        let publishBtn = null;
        // 先在 richShadowRoot 中找
        const richButtons = richShadowRoot.querySelectorAll('button');
        for (const btn of richButtons) {
            if (btn.textContent.trim() === '发布') {
                publishBtn = btn;
                break;
            }
        }
        if (!publishBtn) {
            // 再到 boxShadowRoot 中找
            const boxButtons = boxShadowRoot.querySelectorAll('button');
            for (const btn of boxButtons) {
                if (btn.textContent.trim() === '发布') {
                    publishBtn = btn;
                    break;
                }
            }
        }
        if (!publishBtn) {
            console.error('❌ 未找到发布按钮');
            return null;
        }
        console.log('✅ 找到发布按钮');

        return { input, publishBtn };
    }

    async function scrollToComment() {
        const host = document.querySelector('bili-comments');
        if (host) {
            host.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(1000);
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            await delay(1500);
        }
    }

    /**
     * 智能分布表情包（新规则）：
     * - 将 selected 数组中的元素随机分配到三个位置：start（开头）、middle（标点后）、end（结尾）
     * - 每个标点符号（除最后一个外）后面最多跟一个表情包，最后一个标点后面可以跟多个
     * - 省略号"……"和连续英文点号"..."视为一个标点
     */
    function distributeElements(selected, text) {
        if (selected.length === 0) return { startPart: '', middleMap: new Map(), endPart: '' };

        // 1. 随机分配每个元素到 start/middle/end
        const positions = [];
        for (let i = 0; i < selected.length; i++) {
            const r = Math.random();
            if (r < 0.33) positions.push('start');
            else if (r < 0.66) positions.push('middle');
            else positions.push('end');
        }

        // 2. 分离 start、end 和 middle 元素
        let startPart = '';
        let endPart = '';
        const middleElements = [];
        for (let i = 0; i < selected.length; i++) {
            if (positions[i] === 'start') startPart += selected[i];
            else if (positions[i] === 'end') endPart += selected[i];
            else middleElements.push(selected[i]);
        }

        // 3. 找出所有标点符号的位置（包括省略号和连续英文点号）
        // 匹配中文和英文标点，以及省略号……，以及连续英文点号（至少2个）
        const punctuationRegex = /[，。！？；：,.!?;:]|…+|\.{2,}/g;
        const matches = [...text.matchAll(punctuationRegex)];
        // 记录每个标点的起始索引
        const punctuationIndices = matches.map(m => m.index);

        let middleMap = new Map(); // 键为插入位置（标点后的索引），值为要插入的字符串

        if (punctuationIndices.length > 0 && middleElements.length > 0) {
            // 确定最后一个标点的索引
            const lastPunctIndex = punctuationIndices[punctuationIndices.length - 1];
            
            // 为每个标点分配 middle 元素
            let elementIndex = 0;
            for (let i = 0; i < punctuationIndices.length; i++) {
                const punctIndex = punctuationIndices[i];
                const insertPos = punctIndex + 1; // 标点后面
                if (i === punctuationIndices.length - 1) {
                    // 最后一个标点：分配剩余所有 middle 元素
                    let remaining = '';
                    while (elementIndex < middleElements.length) {
                        remaining += middleElements[elementIndex];
                        elementIndex++;
                    }
                    if (remaining) {
                        if (!middleMap.has(insertPos)) middleMap.set(insertPos, '');
                        middleMap.set(insertPos, middleMap.get(insertPos) + remaining);
                    }
                } else {
                    // 非最后一个标点：最多分配一个元素
                    if (elementIndex < middleElements.length) {
                        if (!middleMap.has(insertPos)) middleMap.set(insertPos, '');
                        middleMap.set(insertPos, middleMap.get(insertPos) + middleElements[elementIndex]);
                        elementIndex++;
                    }
                }
            }
            // 如果还有剩余的 middle 元素（理论上不会，但以防万一），追加到 endPart
            if (elementIndex < middleElements.length) {
                endPart = middleElements.slice(elementIndex).join('') + endPart;
            }
        } else {
            // 没有标点，全部 middle 元素归入 endPart
            endPart = middleElements.join('') + endPart;
            middleMap.clear();
        }

        return { startPart, middleMap, endPart };
    }

    async function sendOneComment() {
        try {
            statusDiv.innerText = '⏳ 滚动到评论区...';
            await scrollToComment();

            statusDiv.innerText = '⏳ 获取评论区 Shadow DOM...';
            const shadowRoot = await getCommentShadowRoot();
            if (!shadowRoot) {
                statusDiv.innerText = '❌ 无法获取评论区';
                return false;
            }

            statusDiv.innerText = '⏳ 展开评论框...';
            await expandComment(shadowRoot);

            statusDiv.innerText = '⏳ 查找输入框和发布按钮...';
            const elements = await findElements(shadowRoot);
            if (!elements) {
                statusDiv.innerText = '❌ 未找到输入框或发布按钮';
                return false;
            }

            const { input, publishBtn } = elements;
            const texts = getCommentList();
            if (texts.length === 0) {
                statusDiv.innerText = '⚠️ 文案列表为空';
                stop();
                return false;
            }
            const randomComment = texts[Math.floor(Math.random() * texts.length)];
            const commentLength = randomComment.length;
            
            // --- 随机选择 1 到 2 个不重复的系列 ---
            const seriesCount = Math.floor(Math.random() * 2) + 1; // 1 或 2
            const shuffledNames = [...SERIES_NAMES];
            for (let i = shuffledNames.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
            }
            const selectedSeriesNames = shuffledNames.slice(0, seriesCount);
            console.log(`🎨 选择系列个数: ${seriesCount}, 系列: ${selectedSeriesNames.join(', ')}`);

            // 合并选中系列的元素
            let combinedElements = [];
            for (const name of selectedSeriesNames) {
                combinedElements = combinedElements.concat(SERIES[name]);
            }
            console.log(`📦 合并后元素总数: ${combinedElements.length}`);

            // --- 根据文案长度动态决定表情包数量范围 ---
            let minCount = 4;   // 新最低值
            let maxCount = 15;  // 新最高值
            if (commentLength < 5) {
                // 短文本（<5字）：表情包少一点，最多8个
                maxCount = 8;
            } else if (commentLength > 20) {
                // 长文本（>20字）：表情包多一点，最少8个
                minCount = 8;
            }
            // 中等长度（5-20字）：保持4-15

            // 确保 maxCount 不超过合并后元素总数
            maxCount = Math.min(maxCount, combinedElements.length);
            minCount = Math.min(minCount, maxCount); // 调整 minCount 不能超过 maxCount

            const tailCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount; // 动态范围

            // 从合并的元素中随机抽取 tailCount 个不重复的元素（打乱后取前N个）
            const shuffled = [...combinedElements];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            const selected = shuffled.slice(0, tailCount);
            // 再次打乱选中的子集，增加随机性
            for (let i = selected.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [selected[i], selected[j]] = [selected[j], selected[i]];
            }

            // 智能分布表情包（新规则）
            const { startPart, middleMap, endPart } = distributeElements(selected, randomComment);

            // 构建最终评论：startPart + 插入表情后的文案 + endPart
            let finalComment = startPart;
            // 逐字符构建文案，在标点后插入对应表情
            for (let i = 0; i < randomComment.length; i++) {
                finalComment += randomComment[i];
                if (middleMap.has(i + 1)) { // 注意插入位置是在当前字符之后
                    finalComment += middleMap.get(i + 1);
                }
            }
            finalComment += endPart;

            console.log(`📝 选择文案: "${randomComment}" (长度 ${commentLength} 字)`);
            console.log(`🎲 抽取 ${tailCount} 个元素 (范围 ${minCount}-${maxCount}): ${selected.join(', ')}`);
            console.log(`📤 最终评论: "${finalComment}"`);

            input.focus();
            await delay(300);

            input.innerText = finalComment;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
            await delay(800);

            if (publishBtn.disabled) {
                statusDiv.innerText = '⚠️ 发布按钮不可用';
                return false;
            }

            publishBtn.click();
            statusDiv.innerText = `✅ 发送成功: ${finalComment.substring(0, 15)}...`;
            console.log('✅ 评论已发送');
            await delay(2000);
            return true;

        } catch (error) {
            console.error('❌ 发送出错:', error);
            statusDiv.innerText = '❌ 发送出错';
            return false;
        }
    }

    function getCommentList() {
        return textareaInput.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    }

    function scheduleNext() {
        if (!isRunning) return;
        const intervalSec = parseInt(intervalInput.value, 10) || 60;
        timerId = setTimeout(async () => {
            const success = await sendOneComment();
            if (success) {
                failCount = 0;
            } else {
                failCount++;
                if (failCount >= MAX_FAILS) {
                    statusDiv.innerText = `⛔ 连续失败${MAX_FAILS}次，自动停止`;
                    stop();
                    return;
                }
            }
            if (isRunning) {
                scheduleNext();
            }
        }, intervalSec * 1000);
    }

    function start() {
        if (isRunning) return;
        const texts = getCommentList();
        if (texts.length === 0) {
            alert('请至少填写一条文案');
            return;
        }
        const interval = parseInt(intervalInput.value, 10);
        if (isNaN(interval) || interval < 10) {
            alert('间隔时间建议不小于10秒');
            return;
        }
        GM_setValue(STORAGE_KEY_TEXT, textareaInput.value);
        GM_setValue(STORAGE_KEY_INTERVAL, intervalInput.value);
        isRunning = true;
        failCount = 0;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusDiv.innerText = '▶️ 自动评论已启动';
        scheduleNext();
    }

    function stop() {
        isRunning = false;
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statusDiv.innerText = '⏸️ 已停止';
    }

    async function manualSend() {
        const wasRunning = isRunning;
        if (wasRunning) stop();
        startBtn.disabled = true;
        await sendOneComment();
        startBtn.disabled = false;
        if (wasRunning) start();
    }

    function createUI() {
        panel = document.createElement('div');
        panel.id = 'bili-auto-comment-panel-v15';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 280px;
            background: white;
            border: 1px solid #e5e9ef;
            border-radius: 12px;
            padding: 16px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: 'Microsoft YaHei', sans-serif;
            font-size: 14px;
            border-left: 4px solid #00a1d6;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin:0; font-size: 16px; color: #00a1d6;">📝 B站自动评论 v7.8 (多系列·数量调整)</h3>
                <span style="cursor:pointer; font-size:18px; color:#99a2aa;" id="close-panel-v15">✕</span>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display:block; margin-bottom: 4px;">📋 评论文案（一行一个）</label>
                <textarea id="comment-texts-v15" rows="4" style="width:100%; border:1px solid #e5e9ef; border-radius:6px; padding:8px; font-size:13px;">${DEFAULT_TEXTS}</textarea>
            </div>
            <div style="margin-bottom: 16px; display: flex; align-items: center;">
                <label style="margin-right: 8px;">⏱️ 间隔</label>
                <input type="number" id="comment-interval-v15" min="10" value="60" style="width:70px; padding:4px; border:1px solid #e5e9ef; border-radius:4px;">
                <span>秒</span>
            </div>
            <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                <button id="start-auto-v15" style="flex:2; background:#00a1d6; color:white; border:none; border-radius:20px; padding:8px;">▶ 开始自动</button>
                <button id="stop-auto-v15" style="flex:1; background:#f4f5f7; border:none; border-radius:20px; padding:8px;" disabled>⏹️ 停止</button>
                <button id="send-now-v15" style="flex:1; background:#e5e9ef; border:none; border-radius:20px; padding:8px;">✍️ 发一次</button>
            </div>
            <div id="status-message-v15" style="background:#f4f5f7; border-radius:16px; padding:8px 12px; text-align:center;">🟢 就绪</div>
        `;

        document.body.appendChild(panel);

        textareaInput = document.getElementById('comment-texts-v15');
        intervalInput = document.getElementById('comment-interval-v15');
        startBtn = document.getElementById('start-auto-v15');
        stopBtn = document.getElementById('stop-auto-v15');
        statusDiv = document.getElementById('status-message-v15');
        const closeBtn = document.getElementById('close-panel-v15');
        const manualBtn = document.getElementById('send-now-v15');

        const savedTexts = GM_getValue(STORAGE_KEY_TEXT, DEFAULT_TEXTS);
        const savedInterval = GM_getValue(STORAGE_KEY_INTERVAL, 60);
        textareaInput.value = savedTexts;
        intervalInput.value = savedInterval;

        startBtn.addEventListener('click', start);
        stopBtn.addEventListener('click', stop);
        manualBtn.addEventListener('click', manualSend);
        closeBtn.addEventListener('click', () => {
            if (isRunning) stop();
            panel.style.display = 'none';
        });

        let isDragging = false, offsetX, offsetY;
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'H3' || e.target === panel) {
                isDragging = true;
                offsetX = e.clientX - panel.offsetLeft;
                offsetY = e.clientY - panel.offsetTop;
                panel.style.cursor = 'move';
                e.preventDefault();
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
                panel.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });
    }

    createUI();
})();
