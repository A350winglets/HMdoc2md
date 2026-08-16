// ==UserScript==
// @name         华为开发者文档导出 Markdown
// @namespace    https://developer.huawei.com/
// @version      1.0.0
// @description  将华为开发者文档内容一键转换为 Markdown 并下载为 .md 文件。
// @author       A350winglets
// @icon         https://0x3.com/icon?host=developer.huawei.com
// @match        *://developer.huawei.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const svg_md=`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.49124 4.04609C2.78636 3.93761 3.11782 4.02473 3.32145 4.2643L7 8.592L10.6785 4.2643C10.8822 4.02473 11.2136 3.93761 11.5088 4.04609C11.8039 4.15457 12 4.43561 12 4.75004V14.25C12 14.6642 11.6642 15 11.25 15C10.8358 15 10.5 14.6642 10.5 14.25V6.79043L7.57145 10.2358C7.42895 10.4034 7.22003 10.5 7 10.5C6.77997 10.5 6.57105 10.4034 6.42855 10.2358L3.5 6.79043V14.25C3.5 14.6642 3.16421 15 2.75 15C2.33579 15 2 14.6642 2 14.25V4.75004C2 4.43561 2.19613 4.15457 2.49124 4.04609ZM13.2197 11.7197C13.5126 11.4268 13.9874 11.4268 14.2803 11.7197L15 12.4394V4.75006C15 4.33585 15.3358 4.00006 15.75 4.00006C16.1642 4.00006 16.5 4.33585 16.5 4.75006V12.4394L17.2197 11.7197C17.5126 11.4268 17.9874 11.4268 18.2803 11.7197C18.5732 12.0126 18.5732 12.4875 18.2803 12.7804L16.2803 14.7804C15.9874 15.0733 15.5126 15.0733 15.2197 14.7804L13.2197 12.7804C12.9268 12.4875 12.9268 12.0126 13.2197 11.7197Z" fill="currentColor"/>
</svg>
`
  const svg_ok=`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.03212 13.9072L3.56056 10.0017C3.28538 9.69214 2.81132 9.66425 2.50174 9.93944C2.19215 10.2146 2.16426 10.6887 2.43945 10.9983L6.43945 15.4983C6.72614 15.8208 7.2252 15.8355 7.53034 15.5303L18.0303 5.03033C18.3232 4.73744 18.3232 4.26256 18.0303 3.96967C17.7374 3.67678 17.2626 3.67678 16.9697 3.96967L7.03212 13.9072Z" fill="currentColor"/>
</svg>
`

  const svg_question=`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 3C7.79386 3 6 4.79386 6 7C6 7.27614 6.22386 7.5 6.5 7.5C6.77614 7.5 7 7.27614 7 7C7 5.34614 8.34614 4 10 4C11.6539 4 13 5.34614 13 7C13 8.2486 12.3078 8.86333 11.4246 9.62037L11.3935 9.64699C10.5328 10.3845 9.5 11.2695 9.5 13V13.5C9.5 13.7761 9.72386 14 10 14C10.2761 14 10.5 13.7761 10.5 13.5V13C10.5 11.7514 11.1922 11.1367 12.0754 10.3796L12.1065 10.353C12.9672 9.61545 14 8.73053 14 7C14 4.79386 12.2061 3 10 3ZM10 17C10.4142 17 10.75 16.6642 10.75 16.25C10.75 15.8358 10.4142 15.5 10 15.5C9.58579 15.5 9.25 15.8358 9.25 16.25C9.25 16.6642 9.58579 17 10 17Z" fill="currentColor"/>
</svg>
`

  const svg_error=`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.89705 4.05379L3.96967 3.96967C4.23594 3.7034 4.6526 3.6792 4.94621 3.89705L5.03033 3.96967L10 8.939L14.9697 3.96967C15.2359 3.7034 15.6526 3.6792 15.9462 3.89705L16.0303 3.96967C16.2966 4.23594 16.3208 4.6526 16.1029 4.94621L16.0303 5.03033L11.061 10L16.0303 14.9697C16.2966 15.2359 16.3208 15.6526 16.1029 15.9462L16.0303 16.0303C15.7641 16.2966 15.3474 16.3208 15.0538 16.1029L14.9697 16.0303L10 11.061L5.03033 16.0303C4.76406 16.2966 4.3474 16.3208 4.05379 16.1029L3.96967 16.0303C3.7034 15.7641 3.6792 15.3474 3.89705 15.0538L3.96967 14.9697L8.939 10L3.96967 5.03033C3.7034 4.76406 3.6792 4.3474 3.89705 4.05379L3.96967 3.96967L3.89705 4.05379Z" fill="currentColor"/>
</svg>
`

  // ---------------- 配置 ----------------
  const CONFIG = {
    containerSelector: '.markdown-body', // 文档正文容器
    // 是否在代码块末尾追加源码链接（以 HTML 注释形式，不影响渲染）
    appendCodeSource: true,
    // 快捷键：按住 Ctrl+Alt 再按 M
    hotkey: 'm',
  };

  // ---------------- 工具函数 ----------------

  function getContainer() {
    return document.querySelector(CONFIG.containerSelector);
  }

  // 去除不可见空格并 trim
  function cleanText(s) {
    return (s || '').replace(/ /g, ' ').replace(/​/g, '').trim();
  }

  // 需要整体跳过的 UI 装饰元素（锚点图标、代码块按钮、表格展开按钮等）
  function shouldSkip(el) {
    if (!el || el.nodeType !== 1) return false;
    const cls = typeof el.className === 'string' ? el.className : '';
    if (!cls) return false;
    return (
      cls.includes('anchor-icon') ||       // 标题锚点 / 设备图标
      cls.includes('highlight-div-header') || // 代码块头部按钮条
      cls.includes('screen-link-div') ||   // 代码块“源码”链接（用 codehub 属性代替）
      cls.includes('handle-button') ||
      cls.includes('handle-hover-tips') ||
      cls.includes('expand-btn') ||
      cls.includes('expand-box')           // 表格“展开”按钮
    );
  }

  function resolveUrl(href) {
    try {
      return new URL(href, location.href).href;
    } catch (e) {
      return href;
    }
  }

  function sanitizeFilename(name) {
    return (name || '')
      .replace(/[\\/:*?"<>|\r\n\t]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120) || '文档';
  }

  // ---------------- 行内内容转换 ----------------

  function childrenInline(el) {
    let s = '';
    for (const child of el.childNodes) s += inline(child);
    return s;
  }

  function inline(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node;
    if (shouldSkip(el)) return '';

    const tag = el.tagName.toLowerCase();
    switch (tag) {
      case 'br':
        return '\n';
      case 'img': {
        const src = el.getAttribute('src') || '';
        const alt = el.getAttribute('alt') || '';
        return src ? `![${alt}](${src})` : '';
      }
      case 'a': {
        const href = el.getAttribute('href') || '';
        const text = childrenInline(el).trim();
        if (!text) return '';
        if (href.startsWith('#')) return text; // 页面内锚点
        return `[${text}](${resolveUrl(href)})`;
      }
      case 'code': {
        const text = el.textContent;
        return text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``;
      }
      case 'strong':
      case 'b':
        return `**${childrenInline(el).trim()}**`;
      case 'em':
      case 'i':
        return `*${childrenInline(el).trim()}*`;
      default:
        // span、sup、sub、keyword、hljs-* 等：保留文本内容
        return childrenInline(el);
    }
  }

  // ---------------- 代码块 ----------------

  function convertCodeBlock(pre) {
    // 语言：优先 hw-language 属性，其次 class 中的 language-*
    const lang =
      pre.getAttribute('hw-language') ||
      ((pre.className.match(/language-([\w+-]+)/) || [])[1]) ||
      '';
    const codehub = pre.getAttribute('codehub') || '';

    // 行号结构：<ol class="linenums"><li>line</li>...</ol>
    const lines = [];
    const ol = pre.querySelector('ol.linenums');
    if (ol) {
      ol.querySelectorAll(':scope > li').forEach((li) => {
        lines.push(cleanText(li.textContent).replace(/^ +/, '') || '');
      });
    } else {
      lines.push(pre.textContent.replace(/ /g, ' '));
    }

    let code = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!code) return '';

    const fence = code.includes('```') ? '````' : '```';
    let out = `${fence}${lang}\n${code}\n${fence}`;
    if (CONFIG.appendCodeSource && codehub) {
      out += `\n<!-- 源码：${codehub} -->`;
    }
    return out;
  }

  // ---------------- 列表 ----------------

  function convertList(el, depth) {
    const isOl = el.tagName.toLowerCase() === 'ol';
    const indent = '  '.repeat(depth);
    const items = [];
    let idx = 1;

    for (const li of el.children) {
      if (li.tagName.toLowerCase() !== 'li') continue;
      const marker = isOl ? idx + '.' : '-';

      const textBlocks = [];
      const nested = [];
      for (const child of li.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const t = child.tagName.toLowerCase();
          if (t === 'ul' || t === 'ol') {
            nested.push(convertList(child, depth + 1));
          } else {
            const s = inline(child).trim();
            if (s) textBlocks.push(s);
          }
        } else {
          const s = cleanText(child.textContent);
          if (s) textBlocks.push(s);
        }
      }

      const first = textBlocks.shift() || '';
      const contIndent = indent + '  ';
      const contLines = textBlocks.map(
        (b) => contIndent + b.replace(/\n/g, '\n' + contIndent)
      );
      let itemStr = indent + marker + ' ' + first;
      if (contLines.length) itemStr += '\n' + contLines.join('\n');
      if (nested.length) itemStr += '\n' + nested.join('\n');
      items.push(itemStr);
      idx++;
    }
    return items.join('\n');
  }

  // ---------------- 表格 ----------------

  function cellToMarkdown(cell) {
    let s = '';
    for (const child of cell.childNodes) s += inline(child);
    return s.replace(/\n+/g, ' ').replace(/\|/g, '\\|').trim();
  }

  function convertTable(table) {
    const rows = [];
    table.querySelectorAll('tr').forEach((tr) => {
      const cells = [];
      tr.querySelectorAll('th, td').forEach((cell) => {
        cells.push(cellToMarkdown(cell));
      });
      if (cells.length) rows.push(cells);
    });
    if (!rows.length) return '';

    const colCount = Math.max(...rows.map((r) => r.length));
    const lines = [];
    rows.forEach((cells, ri) => {
      const filled = [];
      for (let i = 0; i < colCount; i++) filled.push(cells[i] !== undefined ? cells[i] : '');
      lines.push('| ' + filled.join(' | ') + ' |');
      if (ri === 0) lines.push('| ' + filled.map(() => '---').join(' | ') + ' |');
    });
    return lines.join('\n');
  }

  // ---------------- 提示框（说明/注意） ----------------

  function convertTip(el) {
    const titleEl = el.querySelector('.title');
    const contentEl = el.querySelector('.content');
    const parts = [];
    const titleText = titleEl ? cleanText(titleEl.textContent) : '';
    if (titleText) parts.push('**' + titleText + '**');
    if (contentEl) {
      const contentMd = convertBlocks(contentEl);
      if (contentMd) parts.push(contentMd);
    }
    if (!parts.length) return '';
    return parts.join('\n\n').split('\n').map((l) => '> ' + l).join('\n');
  }

  // ---------------- 设备支持列表 ----------------

  function convertDeviceList(el) {
    const names = [];
    el.querySelectorAll('.support-device-item').forEach((s) => {
      const t = cleanText(s.textContent);
      if (t) names.push(t);
    });
    return names.length ? '**支持设备**：' + names.join('、') : '';
  }

  // ---------------- 块级内容转换 ----------------

  function convertBlockNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = cleanText(node.textContent);
      return t || '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node;
    if (shouldSkip(el)) return '';

    const tag = el.tagName.toLowerCase();
    switch (tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const level = +tag[1];
        const text = inline(el).replace(/\s+/g, ' ').trim();
        return text ? '#'.repeat(level) + ' ' + text : '';
      }
      case 'p': {
        const text = inline(el).trim();
        return text;
      }
      case 'ul':
      case 'ol':
        return convertList(el, 0);
      case 'table':
        return convertTable(el);
      case 'pre':
        return convertCodeBlock(el);
      case 'blockquote': {
        const inner = convertBlocks(el);
        return inner ? inner.split('\n').map((l) => '> ' + l).join('\n') : '';
      }
      case 'hr':
        return '---';
      case 'img':
        return inline(el);
      case 'div': {
        if (el.classList.contains('hw-editor-tip')) return convertTip(el);
        if (el.classList.contains('device-list')) return convertDeviceList(el);
        // 代码块/表格的包裹容器、tiledSection、content 等：递归处理
        return convertBlocks(el);
      }
      default:
        return convertBlocks(el);
    }
  }

  function convertBlocks(container) {
    const out = [];
    for (const node of container.childNodes) {
      const md = convertBlockNode(node);
      if (md) out.push(md);
    }
    return out.join('\n\n');
  }

  // ---------------- 下载 ----------------

  function download(md, filename) {
    const blob = new Blob(['﻿' + md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // 文档标题：优先取页面头部 h1.doc-title，回退到正文内 h1/h2
  function getDocTitle() {
    const docTitle = document.querySelector('.doc-title');
    if (docTitle) {
      const t = cleanText(docTitle.textContent) || cleanText(docTitle.getAttribute('title'));
      if (t) return t;
    }
    const h1 = document.querySelector('.markdown-body h1, h1');
    if (h1) {
      const t = cleanText(h1.textContent);
      if (t) return t;
    }
    const h2 = document.querySelector('.markdown-body h2');
    if (h2) return cleanText(h2.textContent);
    return '';
  }

  // 更新时间：.doc-header-footer .dhf-left 中以“更新时间”开头的 span
  function getUpdateTime() {
    const left = document.querySelector('.doc-header-footer .dhf-left');
    if (!left) return '';
    const spans = left.querySelectorAll('span');
    for (const s of spans) {
      const t = cleanText(s.textContent);
      if (t && t.indexOf('更新时间') !== -1) return t;
    }
    const first = left.querySelector('span');
    return first ? cleanText(first.textContent) : '';
  }

  // 顶部信息：标题 + 更新时间
  function buildHeader() {
    const lines = [];
    const title = getDocTitle();
    const update = getUpdateTime();
    if (title) lines.push('# ' + title);
    if (update) lines.push(update);
    return lines.join('\n');
  }

  function getFilename() {
    let title = getDocTitle();
    if (!title && document.title) {
      title = document.title.replace(/\s*[|_\-–—].*$/, '').trim();
    }
    if (!title) title = '文档';
    return sanitizeFilename(title) + '.md';
  }

  // ---------------- 提示 ----------------

  function toast(msg) {
    let t = document.getElementById('md-export-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'md-export-toast';
      t.style.cssText =
        `
          position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483647;
          padding:4px 20px;
          border-radius:20px;
          background: #d8dadc;
          color: #333;
          font-size:16px;
          pointer-events:none;
          transition:opacity .3s;
          height:40px;
          display:flex;                       /* ← 关键：flex 布局 */
          align-items:center;                 /* ← 垂直居中 */
          justify-content:center;             /* ← 水平居中 */
          box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
          gap: 12px;
        `
      document.body.appendChild(t);
    }
    // t.textContent = msg;
    t.innerHTML=msg;
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => (t.style.opacity = '0'), 2500);
  }

  // ---------------- 主流程 ----------------

  function convert() {
    const container = getContainer();
    if (!container) {
      toast(`${svg_question}未找到 .markdown-body，文档可能尚未加载`);
      return;
    }

    // 深拷贝后再转换，避免影响页面
    const clone = container.cloneNode(true);
    // 冗余清理：整体移除所有装饰元素，确保输出干净
    clone.querySelectorAll(
      '.anchor-icon, .highlight-div-header, .screen-link-div, ' +
      '.handle-button, .handle-hover-tips, .expand-btn, .expand-box'
    ).forEach((n) => n.remove());

    const body = convertBlocks(clone).trim();
    if (!body) {
      toast(`${svg_error}转换结果为空`);
      return;
    }
    const header = buildHeader();
    const md = [header, body].filter(Boolean).join('\n\n');
    const filename = getFilename();
    download(md, filename);
    toast(`${svg_ok} 已导出：${filename}`);
  }

  // ---------------- 入口 ----------------

  function addButton() {

    GM_addStyle(`
        .md-export-btn{
          position:fixed;
          right:20px;bottom:20px;
          z-index:2147483647;
          padding:4px;
          border:none;
          border: 2px solid #007dfc;
          border-radius:100%;
          background: #d8dadc;
          color: #333;
          display:flex;                       /* ← 关键：flex 布局 */
          align-items:center;                 /* ← 垂直居中 */
          justify-content:center;             /* ← 水平居中 */
          width:40px;height:40px;
          transition: all 0.2s;
        }

        .md-export-btn:hover{
          background: #007dfc;
          color: #fff;
        }

        .md-export-btn:active{
          border: 2px solid #004c97;
          background: #004c97;
          color: #fff;
        }

        .suspension-menu{
          margin-bottom:35px !important;
        }
      `)



    const btn = document.createElement('button');
    btn.className = 'md-export-btn';
    btn.innerHTML=svg_md;
    btn.title = '导出 Markdown';
    btn.addEventListener('click', convert);
    document.body.appendChild(btn);
  }


  // 等待正文容器出现（SPA 页面由 JS 渲染，可能需要时间）
  function waitFor(selector, cb, timeout, interval) {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        cb(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
      }
    }, interval);
  }

  function init() {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('导出为 Markdown', convert);
    }
    // 等到正文出现后再显示按钮
    waitFor(
      CONFIG.containerSelector,
      () => addButton(),
      60000,
      500
    );
  }

  init();
})();
