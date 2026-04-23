// ==UserScript==
// @name         B站自动评论 v8.8 精简版
// @namespace    https://github.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/
// @version      8.8
// @description  远程表情包，备用仅aveMujica/mygo/pigeon，间隔随机±15s，后台运行
// @author       GSJNZH
// @match        www.bilibili.com/video/BV1fy4y1L7Rq/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/70/ab/15/70ab1507-a468-1dc9-adb3-d4fe7d6f70dd/AppIcon-1x_U007epad-0-0-0-85-220-0.png/434x0w.webp
// @downloadURL  https://raw.githubusercontent.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/refs/heads/main/bilibili-autocomment.user.js
// @updateURL    https://raw.githubusercontent.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/refs/heads/main/bilibili-autocomment.user.js
// ==/UserScript==

(async function() {
  'use strict';
  const EMOTE_URL = 'https://p1.ru.cloudns.nz/Project/Bilibili-Auto-Comment-Tampermonkey-Script/bilibili-emotes.json';
  const FALLBACK_SERIES = {
    aveMujica: ['[Ave Mujica_挺好]','[Ave Mujica_再等一下]','[Ave Mujica_震惊]','[Ave Mujica_比叉叉]','[Ave Mujica_开心]','[Ave Mujica_哼]','[Ave Mujica_怎么突然]','[Ave Mujica_诶]','[Ave Mujica_一次买够]','[Ave Mujica_难道？]','[Ave Mujica_睡觉]','[Ave Mujica_我要告你]','[Ave Mujica_赌气]','[Ave Mujica_记得微笑]','[Ave Mujica_委屈]','[Ave Mujica_不行]','[Ave Mujica_美味]','[Ave Mujica_我有话说]','[Ave Mujica_害怕]','[Ave Mujica_愉快]'],
    mygo: ['[Mygo表情包_害羞]','[Mygo表情包_生气]','[Mygo表情包_发送消息]','[Mygo表情包_抹茶芭菲]','[Mygo表情包_请点单]','[Mygo表情包_不要吵架]','[Mygo表情包_Love]','[Mygo表情包_让我看看]','[Mygo表情包_溜了溜了]','[Mygo表情包_那我呢？]','[Mygo表情包_创作中]','[Mygo表情包_探头]','[Mygo表情包_为什么！]','[Mygo表情包_刚睡醒]','[Mygo表情包_哈？]','[Mygo表情包_忧郁]','[Mygo表情包_不会吧？]','[Mygo表情包_大哭]','[Mygo表情包_有趣的女人]','[Mygo表情包_Block!]'],
    pigeon: ['[有鸽调]','[可爱捏]','[手工鸽]','[田园牧鸽]','[B站一鸽]','[冻鳗高手]','[鸽你太美]','[神操作]','[吃瓜群鸽]','[求更新]','[Vlo鸽]','[如听仙乐]','[字少事大]','[笑出咕叫]','[鸽物致知]','[鸽就鸽位]','[量子啾缠]','[来一勺]','[行鸽无疆]','[载鸽载舞]','[飞驰鸽生]','[催更]','[神剧打卡]','[神片打卡]','[神作打卡]']
  };

  let SERIES = FALLBACK_SERIES, SERIES_NAMES = Object.keys(FALLBACK_SERIES);
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const STORAGE_KEY_TEXT = 'bili_comment_texts_v15';
  const STORAGE_KEY_INTERVAL = 'bili_comment_interval_v15';
  const DEFAULT_TEXTS = '打卡\n路过\n支持一下\n好视频\n学到了\n三连支持';
  let timerId, isRunning = false, failCount = 0;
  const MAX_FAILS = 3;
  let panel, textareaInput, intervalInput, startBtn, stopBtn, statusDiv, countSpan;

  // 远程加载
  await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET', url: EMOTE_URL,
      onload: r => {
        try {
          const d = JSON.parse(r.responseText);
          if (d && typeof d === 'object') { SERIES = d; SERIES_NAMES = Object.keys(d); console.log('✅ 远程表情包加载成功'); }
        } catch(e) { console.warn('⚠️ 使用备用表情包'); }
        resolve();
      },
      onerror: () => { console.warn('⚠️ 使用备用表情包'); resolve(); },
      ontimeout: () => { console.warn('⚠️ 使用备用表情包'); resolve(); }
    });
  });

  // 评论区元素获取
  async function getShadowRoot() {
    const host = document.querySelector('bili-comments');
    if (!host) return null;
    for (let i = 0; i < 50; i++) { if (host.shadowRoot) return host.shadowRoot; await delay(200); }
    return null;
  }

  async function expand(shadow) {
    const el = shadow.querySelector('#new');
    if (el) { el.click(); await delay(1500); }
  }

  async function findElements(shadow) {
    let cb = shadow.querySelector('bili-comment-box');
    if (!cb) { for (let i = 0; i < 10; i++) { await delay(500); cb = shadow.querySelector('bili-comment-box'); if (cb) break; } }
    if (!cb) return null;
    cb.click(); await delay(800);
    let cbShadow;
    for (let i = 0; i < 30; i++) { if (cb.shadowRoot) { cbShadow = cb.shadowRoot; break; } await delay(200); }
    if (!cbShadow) return null;

    const rta = cbShadow.querySelector('bili-comment-rich-textarea');
    if (!rta) return null;
    let rtaShadow;
    for (let i = 0; i < 30; i++) { if (rta.shadowRoot) { rtaShadow = rta.shadowRoot; break; } await delay(200); }
    if (!rtaShadow) return null;

    let input;
    for (let i = 0; i < 10; i++) { input = rtaShadow.querySelector('div[contenteditable="true"]'); if (input) break; await delay(500); }
    if (!input) return null;

    const buttons = [...rtaShadow.querySelectorAll('button'), ...cbShadow.querySelectorAll('button')];
    const publish = buttons.find(b => b.textContent.trim() === '发布');
    return publish ? { input, publishBtn: publish } : null;
  }

  async function scrollToComment() {
    const el = document.querySelector('bili-comments');
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); await delay(1000); }
    else { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); await delay(1500); }
  }

  function distributeElements(selected, text) {
    if (!selected.length) return { startPart: '', middleMap: new Map(), endPart: '' };
    const positions = selected.map(() => { const r = Math.random(); return r < 0.33 ? 'start' : r < 0.66 ? 'middle' : 'end'; });
    let start = '', end = '', middleElems = [];
    selected.forEach((e, i) => { if (positions[i] === 'start') start += e; else if (positions[i] === 'end') end += e; else middleElems.push(e); });

    const punctRegex = /[，。！？；：,.!?;:]|…+|\.{2,}/g;
    const matches = [...text.matchAll(punctRegex)];
    const rawIndices = matches.map(m => m.index);
    const merged = [];
    if (rawIndices.length) {
      let grp = [rawIndices[0]];
      for (let i = 1; i < rawIndices.length; i++) {
        if (rawIndices[i] === rawIndices[i-1] + 1) grp.push(rawIndices[i]);
        else { merged.push(grp[grp.length-1]); grp = [rawIndices[i]]; }
      }
      merged.push(grp[grp.length-1]);
    }

    const midMap = new Map();
    if (merged.length && middleElems.length) {
      let ei = 0;
      for (let i = 0; i < merged.length; i++) {
        const pos = merged[i] + 1;
        if (i === merged.length - 1) {
          let rem = '';
          while (ei < middleElems.length) rem += middleElems[ei++];
          if (rem) midMap.set(pos, (midMap.get(pos)||'') + rem);
        } else if (ei < middleElems.length) {
          midMap.set(pos, (midMap.get(pos)||'') + middleElems[ei++]);
        }
      }
      if (ei < middleElems.length) end = middleElems.slice(ei).join('') + end;
    } else {
      end = middleElems.join('') + end;
    }
    return { startPart: start, middleMap: midMap, endPart: end };
  }

  function getList() { return textareaInput.value.split('\n').map(s => s.trim()).filter(Boolean); }
  function updateCount() { countSpan.textContent = `剩余 ${getList().length} 条`; }

  async function sendOne() {
    if (!SERIES_NAMES.length) { statusDiv.textContent = '❌ 表情包数据未就绪'; return false; }
    try {
      statusDiv.textContent = '⏳ 滚动到评论区...'; await scrollToComment();
      const shadow = await getShadowRoot(); if (!shadow) { statusDiv.textContent = '❌ 未找到评论区'; return false; }
      await expand(shadow);
      const els = await findElements(shadow); if (!els) { statusDiv.textContent = '❌ 未找到输入框/按钮'; return false; }
      const { input, publishBtn } = els;
      const list = getList(); if (!list.length) { statusDiv.textContent = '⚠️ 文案列表为空'; stop(); return false; }

      const idx = Math.floor(Math.random() * list.length);
      const comment = list[idx];
      const len = comment.length;

      const seriesCount = Math.floor(Math.random() * 2) + 1;
      const shuffledNames = [...SERIES_NAMES].sort(() => Math.random() - 0.5);
      let selectedSeries = shuffledNames.slice(0, seriesCount);

      let minC = 4, maxC = 15;
      if (len < 5) maxC = 8; else if (len > 20) minC = 8;

      let total = selectedSeries.reduce((s, n) => s + SERIES[n].length, 0);
      while (total < minC) {
        const rest = SERIES_NAMES.filter(n => !selectedSeries.includes(n));
        if (!rest.length) break;
        const ns = rest[Math.floor(Math.random() * rest.length)];
        selectedSeries.push(ns);
        total += SERIES[ns].length;
      }

      let combined = [];
      selectedSeries.forEach(n => combined = combined.concat(SERIES[n]));
      maxC = Math.min(maxC, combined.length);
      minC = Math.min(minC, maxC);
      const count = Math.floor(Math.random() * (maxC - minC + 1)) + minC;
      const picked = combined.sort(() => Math.random() - 0.5).slice(0, count);

      const { startPart, middleMap, endPart } = distributeElements(picked, comment);
      let final = startPart;
      for (let i = 0; i < comment.length; i++) { final += comment[i]; if (middleMap.has(i+1)) final += middleMap.get(i+1); }
      final += endPart;

      input.focus(); await delay(300);
      input.innerText = final;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      await delay(800);

      if (publishBtn.disabled) { statusDiv.textContent = '⚠️ 发布按钮不可用'; return false; }
      publishBtn.click();
      statusDiv.textContent = `✅ 发送成功: ${final.substring(0, 15)}...`;

      list.splice(idx, 1);
      textareaInput.value = list.join('\n');
      GM_setValue(STORAGE_KEY_TEXT, textareaInput.value);
      updateCount();
      await delay(2000);
      return true;
    } catch(e) { console.error(e); statusDiv.textContent = '❌ 发送出错'; return false; }
  }

  function scheduleNext() {
    if (!isRunning) return;
    const base = parseInt(intervalInput.value, 10) || 60;
    const offset = Math.floor(Math.random() * 31) - 15;
    const wait = Math.max(10, base + offset);
    timerId = setTimeout(async () => {
      const ok = await sendOne();
      failCount = ok ? 0 : failCount + 1;
      if (failCount >= MAX_FAILS) { statusDiv.textContent = `⛔ 连续失败${MAX_FAILS}次，已停止`; stop(); return; }
      scheduleNext();
    }, wait * 1000);
  }

  function start() {
    if (isRunning) return;
    if (!getList().length) { alert('请至少填写一条文案'); return; }
    const v = parseInt(intervalInput.value, 10);
    if (isNaN(v) || v < 10) { alert('间隔不小于10秒'); return; }
    GM_setValue(STORAGE_KEY_TEXT, textareaInput.value);
    GM_setValue(STORAGE_KEY_INTERVAL, intervalInput.value);
    isRunning = true; failCount = 0;
    startBtn.disabled = true; stopBtn.disabled = false;
    statusDiv.textContent = '▶️ 自动评论已启动';
    scheduleNext();
  }

  function stop() {
    isRunning = false; clearTimeout(timerId);
    startBtn.disabled = false; stopBtn.disabled = true;
    statusDiv.textContent = '⏸️ 已停止';
  }

  async function manualSend() {
    const was = isRunning; if (was) stop();
    startBtn.disabled = true;
    await sendOne();
    startBtn.disabled = false;
    if (was) start();
  }

  // UI
  function createUI() {
    const tmp = document.getElementById('__bili_loading__');
    if (tmp) tmp.remove();

    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const cssVar = (light, darkVal) => dark ? darkVal : light;
    const html = `
    <div id="bili-panel-v15" style="position:fixed;top:100px;right:20px;width:260px;background:${cssVar('white','#2d2d2d')};border:1px solid ${cssVar('#e5e9ef','#555')};border-radius:12px;padding:16px;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,.15);font:14px 'Microsoft YaHei',sans-serif;color:${cssVar('#222','#e0e0e0')};border-left:4px solid #00a1d6;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="margin:0;font-size:16px;color:#00a1d6">📝 B站自动评论</h3>
        <span id="close-panel-v15" style="cursor:pointer;font-size:18px;color:#99a2aa">✕</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <label style="font-weight:bold">📋 文案（一行一个）</label>
        <span id="comment-count" style="color:${cssVar('#00a1d6','#ffa500')};font-weight:bold">剩余 0 条</span>
      </div>
      <textarea id="comment-texts-v15" rows="4" style="width:100%;box-sizing:border-box;border:1px solid ${cssVar('#e5e9ef','#555')};border-radius:6px;padding:8px;font-size:13px;resize:vertical;background:${cssVar('white','#3c3c3c')};color:${cssVar('#222','#fff')};margin-bottom:12px">${DEFAULT_TEXTS}</textarea>
      <div style="display:flex;align-items:center;margin-bottom:12px">
        <label style="font-weight:bold;margin-right:8px">⏱️ 间隔</label>
        <input type="number" id="comment-interval-v15" min="10" value="60" style="width:70px;padding:4px;border:1px solid ${cssVar('#e5e9ef','#555')};border-radius:4px;background:${cssVar('white','#3c3c3c')};color:${cssVar('#222','#fff')}">
        <span style="margin-left:4px">秒</span>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px">
        <button id="start-auto-v15" style="flex:2;background:#00a1d6;color:white;border:none;border-radius:20px;padding:8px;cursor:pointer;font-weight:bold">▶ 开始</button>
        <button id="stop-auto-v15" style="flex:1;background:${cssVar('#f4f5f7','#3c3c3c')};color:${cssVar('#222','#e0e0e0')};border:none;border-radius:20px;padding:8px;cursor:pointer;font-weight:bold" disabled>⏹️ 停止</button>
        <button id="send-now-v15" style="flex:1;background:${cssVar('#f4f5f7','#3c3c3c')};color:${cssVar('#222','#e0e0e0')};border:none;border-radius:20px;padding:8px;cursor:pointer">✍️ 发一次</button>
      </div>
      <div id="status-message-v15" style="background:${cssVar('#f4f5f7','#3c3c3c')};border-radius:16px;padding:8px 12px;font-size:13px;color:${cssVar('#6d757a','#b0b0b0')};text-align:center">🟢 就绪</div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    panel = document.getElementById('bili-panel-v15');
    textareaInput = document.getElementById('comment-texts-v15');
    intervalInput = document.getElementById('comment-interval-v15');
    startBtn = document.getElementById('start-auto-v15');
    stopBtn = document.getElementById('stop-auto-v15');
    statusDiv = document.getElementById('status-message-v15');
    countSpan = document.getElementById('comment-count');

    textareaInput.value = GM_getValue(STORAGE_KEY_TEXT, DEFAULT_TEXTS);
    intervalInput.value = GM_getValue(STORAGE_KEY_INTERVAL, 60);
    updateCount();

    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    document.getElementById('send-now-v15').addEventListener('click', manualSend);
    document.getElementById('close-panel-v15').addEventListener('click', () => { if (isRunning) stop(); panel.style.display = 'none'; });

    let isDragging = false, ox, oy;
    panel.addEventListener('mousedown', e => {
      if (e.target.tagName === 'H3' || e.target === panel) {
        isDragging = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop;
        panel.style.cursor = 'move'; e.preventDefault();
      }
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      panel.style.left = (e.clientX - ox) + 'px';
      panel.style.top = (e.clientY - oy) + 'px';
      panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { isDragging = false; panel.style.cursor = 'default'; });
  }

  // 临时加载提示
  document.body.insertAdjacentHTML('beforeend', '<div id="__bili_loading__" style="position:fixed;top:100px;right:20px;background:#fff;border:1px solid #ccc;padding:10px 20px;border-radius:8px;z-index:99999;font-size:14px">🔄 加载中...</div>');
  createUI();
  console.log('🚀 脚本启动');
})();
