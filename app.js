(() => {
  'use strict';

  const slides = window.DECK_SLIDES;
  const data = window.DECK_DATA;
  const evidence = window.DECK_EVIDENCE;
  const figures = window.DECK_FIGURES;
  const escape = window.DECK_ESCAPE;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const fmt = page => String(page).padStart(2, '0');
  const mode = new URLSearchParams(location.search);
  const preview = mode.has('preview');
  const pageFromHash = () => Math.max(1, Math.min(slides.length, Number(location.hash.slice(1)) || 1)) | 0;
  const clock = seconds => `${fmt(Math.floor(seconds / 60))}:${fmt(seconds % 60)}`;
  const total = slides.reduce((sum, slide) => sum + slide.duration, 0);
  const labs = window.DECK_LABS;
  const crest = 'assets/brand/scnu_logo_transparent.png';
  let page = pageFromHash();
  let presenterWindow;

  const rehearsalCorrections = {
    3: 'Moore 1965 年原预测约每年翻倍，1975 年修订为约两年翻倍。Kilby 的专利申请与授权分别在 1959 年和 1964 年。',
    4: '优先权、商用器件与专利授权对应不同日期。避免使用“无限次”或声称所有 FPGA 都支持运行时局部重构。',
    5: 'Trimberger 的 100 倍指性能，1,000 倍指每次操作的成本和能耗降幅。经济交叉点取决于项目出货量和具体成本。',
    6: 'GW5AST-138 的配置、接口速率与应用范围以手册为准。代表型号不足以推断整个国产供应链的自主程度。',
    7: 'LUT 粒度的优劣取决于基准和架构。讲解时用 2 输入示例演示配置位如何编码真值表。',
    8: '35× 和 18× 对应不同的资源利用条件。14× 是动态功耗比，3.4–4.6× 是纯逻辑设计在不同速度等级下的平均关键路径延迟比，均限定在论文比较口径内。',
    9: 'GW5AST-138 手册列出 298 个 27 × 18-bit DSP。右侧矩阵定性归纳各架构的分工。吞吐、时延与能效应在相同工作负载下测量。',
    10: 'AMD Form 10-K 披露 Xilinx 总收购对价为 488 亿美元。Intel 8-K 披露 Altera 交易金额约 167 亿美元。行业市场规模及排名需单独给出年份和统计范围。',
    11: '6.4 ns 指 Lockwood 论文中 156 MHz 下的 OUCH 报文字段提取。完整交易链路的时延需另行测量。车规功能安全需独立验证，FPGA 原型可用于投片前功能和系统联调。',
    12: '现场先讲 Catapult。保持时延分布时吞吐增加 95%，保持吞吐时尾延迟下降 29%。Brainwave 的 1.8 ms 和 35.9 TFLOPS 来自不同硬件与模型。',
    13: '暗硅比例是历史模型预测。Horowitz 的能耗数据用于说明量级，操作位宽与访问条件应结合原表。器件漏电占比随工艺和实现变化。',
    14: '围绕资源布置、拥塞和时序三个约束展开。编译时间随设计、工具和机器变化。',
    15: '以 2022 年 BIS 规则为历史样本。政策适用性按产品分类、参数及最终用途判断，国产能力按所引用型号和年份描述。',
    16: 'AI Engine 的数量和 NoC 带宽依具体 Versal 产品与配置，示意阵列用来讲解分工。',
    17: 'EMIB 说明封装互连路径，实测带宽与功耗需同时说明器件、封装和基准。eFPGA 的成本与收益受面积、性能和验证条件约束。',
    18: '开源流程依器件支持与比特流后端。领域专用架构的收益需以具体任务和基准验证。',
    19: '回扣五段证据链。用具体实验条件说明可配置性、性能收益与工程代价。',
    20: '从参考文献页按需打开来源，可查阅论文、专利、厂商资料与政策文件。',
  };
  const demoCues = {
    2: '顺着「器件集成 → 系统能力 → 产业服务」讲解，再用 FPGA 提出本次案例问题。历程时间轴在第 3 页。',
    7: '先把 A、B 切到 01，再从 XOR 切到 AND，观察高亮地址保持不变、输出从 1 变为 0。',
    8: '先看面积的 35× 与 18×，再切换延迟和动态功耗。每个维度单独使用从零开始的比例轴。',
    11: '切到金融网络，说明 6.4 ns 属于数据通路中的字段提取，再切到芯片原型对比验证目标。',
    12: '在 Catapult 中切换固定时延和固定吞吐两个条件。若有时间再选择 SmartNIC 或 Brainwave。',
    14: '将时钟周期拖到 4.5 ns，再切换到绕行布线，观察裕量由 +0.9 ns 变为 −0.3 ns。',
    16: '依次选择系统控制、密集运算和流式处理，指向负责这些任务的高亮模块。',
    18: '选择一条技术路线，说明它缓解的瓶颈和必须验证的代价。',
  };

  function formatNotes(source) {
    return source.split(/\r?\n/).map(line => {
      const text = escape(line.trim().replace(/^(?:>\s*|\*\s+)/, ''))
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      if (!text) return '';
      return line.trim().startsWith('>') ? `<blockquote>${text}</blockquote>` : `<p>${text}</p>`;
    }).join('');
  }

  function showPresenter() {
    document.title = '演讲者视图 · 华师 FPGA';
    document.body.className = 'presenter-mode';
    document.body.innerHTML = `
      <main class="presenter-shell">
        <header class="presenter-top"><h1>演讲者视图 · 华师 FPGA</h1><span id="presenter-status">观众画面与讲稿独立显示</span></header>
        <div class="presenter-layout">
          <div class="presenter-left">
            <iframe class="presenter-preview" title="当前观众画面" src="index.html?preview#${page}"></iframe>
            <div class="presenter-controls"><button data-step="-1">← 上一页</button><span class="count"></span><button data-step="1">下一页 →</button><button id="qa-toggle" aria-pressed="false">Q&amp;A 预案</button></div>
            <div class="timer-panel"><div><label>已用时间 / 计划 ${clock(total)}</label><div id="timer" class="timer">00:00</div></div><div class="timer-actions"><button id="timer-toggle">开始</button><button id="timer-reset">重置</button></div></div>
            <div class="presenter-cue"><h3>下一页</h3><p id="next-title"></p></div>
          </div>
          <section class="presenter-notes" aria-label="讲稿"><div class="notes-head"><div><span class="eyebrow" id="presenter-duration"></span><h2 id="presenter-title"></h2></div><button id="notes-size" title="切换讲稿字号">Aa</button></div><div id="notes-body" class="notes-body"></div></section>
        </div>
      </main>`;

    let elapsed = 0;
    let startedAt = null;
    let isQa = false;
    let enlarged = false;
    const previewFrame = $('.presenter-preview');
    const output = $('#notes-body');
    let audienceState;

    function updatePreview() {
      previewFrame.contentWindow?.postMessage({type: 'deck-preview', page, state: audienceState}, '*');
    }

    function loadPage(nextPage, sync) {
      if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > slides.length) return;
      page = nextPage;
      history.replaceState(null, '', '#' + page);
      updatePreview();
      if (sync && window.opener && !window.opener.closed) {
        window.opener.postMessage({type: 'deck-go', page}, '*');
      }
      const slide = slides[page - 1];
      $('.presenter-controls .count').textContent = `${fmt(page)} / ${slides.length}`;
      $('.presenter-controls [data-step="-1"]').disabled = page === 1;
      $('.presenter-controls [data-step="1"]').disabled = page === slides.length;
      $('#presenter-title').textContent = isQa ? 'Q&A 提问预案' : slide.title;
      $('#presenter-duration').textContent = isQa ? '答辩备用' : `本页 ${slide.duration} 秒 · 计划累计 ${clock(slides.slice(0, page).reduce((sum, item) => sum + item.duration, 0))}`;
      $('#next-title').textContent = slides[page] ? `${fmt(page + 1)} · ${slides[page].title}` : '汇报结束 · Q&A';
      $('#qa-toggle').setAttribute('aria-pressed', String(isQa));
      const correction = isQa
        ? '按主屏脚注的来源与实验口径回答。ASIC 经济交叉点应结合实际 NRE、批量和迭代周期，高端产品差距应以器件和设计基准对照。'
        : rehearsalCorrections[page];
      const source = isQa ? String(data.qa).replace(/^[^\n]*\n+/, '') : (data.notes[page] || '本页暂无讲稿。');
      const cue = isQa ? '' : demoCues[page];
      output.innerHTML = `${cue ? `<div class="note-correction demo-cue"><strong>现场演示</strong><br>${escape(cue)}</div>` : ''}${correction ? `<div class="note-correction"><strong>现场校订</strong><br>${escape(correction)}</div>` : ''}${formatNotes(source)}`;
      output.scrollTop = 0;
    }

    function readTimer() {
      const seconds = Math.floor((elapsed + (startedAt === null ? 0 : Date.now() - startedAt)) / 1000);
      $('#timer').textContent = clock(seconds);
      $('#timer').classList.toggle('warning', seconds >= 20 * 60);
    }

    $('#timer-toggle').addEventListener('click', event => {
      if (startedAt === null) {
        startedAt = Date.now();
        event.currentTarget.textContent = '暂停';
      } else {
        elapsed += Date.now() - startedAt;
        startedAt = null;
        event.currentTarget.textContent = '继续';
      }
      readTimer();
    });
    $('#timer-reset').addEventListener('click', () => {
      elapsed = 0;
      startedAt = null;
      $('#timer-toggle').textContent = '开始';
      readTimer();
    });
    $('#qa-toggle').addEventListener('click', () => { isQa = !isQa; loadPage(page, false); });
    $('#notes-size').addEventListener('click', () => {
      enlarged = !enlarged;
      output.style.fontSize = enlarged ? '22px' : '';
    });
    $$('.presenter-controls [data-step]').forEach(button => {
      button.addEventListener('click', () => loadPage(page + Number(button.dataset.step), true));
    });
    addEventListener('keydown', event => {
      if (event.target.closest('button, a, input')) return;
      if (['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(event.key)) {
        event.preventDefault();
        loadPage(page + (['ArrowLeft', 'PageUp'].includes(event.key) ? -1 : 1), true);
      }
    });
    addEventListener('message', event => {
      if (event.source === window.opener && event.data?.type === 'deck-sync') {
        $('#presenter-status').textContent = '已连接观众窗口';
        audienceState = event.data.state;
        if (event.data.page !== page) loadPage(event.data.page, false);
        else updatePreview();
      }
    });
    previewFrame.addEventListener('load', updatePreview);
    setInterval(readTimer, 250);
    loadPage(page, false);
    if (window.opener) window.opener.postMessage({type: 'deck-ready'}, '*');
  }

  if (mode.has('presenter')) {
    showPresenter();
    return;
  }

  const canvas = $('#canvas');
  const viewport = $('#viewport');
  const chapters = [
    ['历程', 3], ['技术', 7], ['作用', 10], ['挑战', 13], ['趋势', 16],
  ];
  const library = $('#library-dialog');
  const librarySearch = $('#library-search');
  const imageDialog = $('#image-dialog');
  const imageStage = $('#image-stage');
  const zoomImage = $('#zoom-image');
  const referenceIds = new Set(data.references.map(ref => ref.id));
  let libraryTab = 'references';
  let zoom = 1;
  let imageX = 0;
  let imageY = 0;
  let dragStart;
  let toastTimeout;
  let laser = false;
  let swipeStart;
  let fullScreenTimeout;

  function citationHtml(text) {
    return escape(text).replace(/\[([RS][0-9-]+)\]/g, (label, id) => {
      return referenceIds.has(id)
        ? `<button class="citation-link" data-ref="${id}" title="查看引文 ${id}">${label}</button>`
        : label;
    });
  }

  canvas.innerHTML = slides.map((slide, index) => {
    const slideNumber = index + 1;
    const chapterLabel = slide.chapter >= 1 && slide.chapter <= 5
      ? `<span class="chapter-number">${fmt(slide.chapter)}</span>`
      : '';
    const header = slide.cover ? '' : `
      <header class="slide-header">
        <div class="section-label">${chapterLabel}${escape(slide.section)}<span class="en">${escape(slide.en)}</span></div>
        <div class="mini-brand"><img src="${crest}" alt=""><span>华南师范大学</span></div>
        <h1>${escape(slide.title)}</h1>
        ${slide.subtitle ? `<p class="subtitle">${escape(slide.subtitle)}</p>` : ''}
      </header>`;
    return `<article class="slide${slide.dark ? ' dark' : ''}${slide.cover ? ' cover' : ''}" data-slide="${slideNumber}" aria-label="第 ${slideNumber} 页 · ${escape(slide.short)}">
      ${header}${slide.cover ? slide.body : `<div class="slide-body">${slide.body}</div>`}
      <footer class="slide-footer"><div class="citation">${citationHtml(slide.citation || '')}</div><span class="folio">${fmt(slideNumber)} / ${slides.length}</span></footer>
    </article>`;
  }).join('');

  $('#chapter-nav').innerHTML = chapters.map(([title, start], i) =>
    `<button data-page="${start}" data-chapter="${i + 1}">${fmt(i + 1)} ${title}</button>`).join('');

  function fit() {
    const {width, height} = viewport.getBoundingClientRect();
    const scale = Math.min(width / 1600, height / 900);
    canvas.style.left = `${(width - 1600 * scale) / 2}px`;
    canvas.style.top = `${(height - 900 * scale) / 2}px`;
    canvas.style.transform = `scale(${scale})`;
  }

  function go(nextPage, animate = true) {
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > slides.length) return;
    const previous = $('.slide.active');
    const current = $(`[data-slide="${nextPage}"]`);
    if (previous !== current) {
      const direction = nextPage >= page ? 1 : -1;
      previous?.classList.remove('active', 'enter');
      current.classList.add('active');
      if (animate && !preview) {
        current.style.setProperty('--direction', direction);
        current.classList.add('enter');
      }
    }
    page = nextPage;
    history.replaceState(null, '', '#' + page);
    $('#page-indicator').innerHTML = `${fmt(page)} <small>/ ${slides.length}</small>`;
    $('#deck-progress').style.width = `${100 * page / slides.length}%`;
    $('[data-action="prev"]').disabled = page === 1;
    $('[data-action="next"]').disabled = page === slides.length;
    $$('#chapter-nav button').forEach(button =>
      button.classList.toggle('current', Number(button.dataset.chapter) === slides[page - 1].chapter));
    publishState();
  }

  function toast(message) {
    const notice = $('#toast');
    notice.textContent = message;
    notice.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => notice.classList.remove('visible'), 2400);
  }

  function openOverview() {
    $('#overview-grid').innerHTML = slides.map((slide, i) => `
      <button data-page="${i + 1}" class="overview-tile${page === i + 1 ? ' current' : ''}">
        <span class="tile-no">${fmt(i + 1)}</span>
        <span class="tile-title">${escape(slide.short)}</span>
        <span class="tile-chapter">${escape(slide.section)}</span>
      </button>`).join('');
    $('#overview-dialog').showModal();
  }

  const urlAllowed = url => typeof url === 'string' && /^https?:\/\//i.test(url) && !/\s/.test(url);

  function renderLibrary() {
    const query = librarySearch.value.trim().toLocaleLowerCase();
    const matching = entry => !query || entry.filter(Boolean).join(' ').toLocaleLowerCase().includes(query);
    let html;
    if (libraryTab === 'references') {
      html = data.references.filter(ref => matching([ref.id, ref.author, ref.title, ref.venue, ref.year])).map(ref => `
        <article class="library-reference">
          <span class="ref-code">${escape(ref.id)}</span>
          <div><h3>${escape(ref.author)}. ${escape(ref.title)}[${escape(ref.type)}].</h3>
            <p>${escape([ref.venue, ref.year, ref.pages].filter(Boolean).join(' · '))}</p>
            ${ref.status && ref.status !== '原始条目' ? `<span class="verification">${escape(ref.status)}</span>` : ''}
          </div>
          <div class="ref-actions">
            ${ref.pdf ? `<a href="${escape(ref.pdf)}" target="_blank" rel="noopener">离线原文 ↗</a>` : ''}
            ${urlAllowed(ref.url) ? `<a href="${escape(ref.url)}" target="_blank" rel="noopener">来源网页 ↗</a>` : ''}
            <small>${escape(ref.chapter || '')} ${escape(ref.slide || '')}</small>
          </div>
        </article>`).join('');
    } else {
      const items = libraryTab === 'evidence' ? evidence : figures;
      const cards = items.filter(item => matching([item.id, item.ref, item.title, item.caption]))
        .map(item => window.DECK_PAPER(item.id, item.title, 'compact')).join('');
      html = cards && `<div class="library-gallery">${cards}</div>`;
    }
    $('#library-results').innerHTML = html || '<p class="library-empty">未找到匹配条目。</p>';
    $('#library-results').scrollTop = 0;
  }

  function openLibrary() {
    renderLibrary();
    library.showModal();
  }

  function setLibraryTab(tab) {
    libraryTab = tab;
    $$('.tab-buttons button').forEach(button => {
      const selected = button.dataset.libraryTab === tab;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function updateZoom() {
    const maxX = Math.max(0, (zoomImage.clientWidth * zoom - imageStage.clientWidth) / 2 + 25);
    const maxY = Math.max(0, (zoomImage.clientHeight * zoom - imageStage.clientHeight) / 2 + 25);
    imageX = zoom === 1 ? 0 : Math.max(-maxX, Math.min(maxX, imageX));
    imageY = zoom === 1 ? 0 : Math.max(-maxY, Math.min(maxY, imageY));
    zoomImage.style.transform = `translate(${imageX}px,${imageY}px) scale(${zoom})`;
    imageStage.style.cursor = zoom > 1 ? 'grab' : 'default';
    $('#zoom-label').textContent = `${Math.round(zoom * 100)}%`;
  }

  function viewImage(id) {
    const item = id.startsWith('f') ? figures.find(figure => figure.id === id) : evidence.find(card => card.id === Number(id));
    if (!item) return;
    const ref = data.references.find(reference => reference.id === item.ref);
    const pdf = $('#image-pdf');
    $('#image-title').textContent = item.title;
    $('#image-kicker').textContent = item.ref ? `原始图证 · ${item.ref} · ${fmt(item.id)}` : '机制与对照图';
    $('#image-caption').textContent = item.caption;
    zoomImage.src = item.src;
    zoomImage.alt = item.title;
    pdf.hidden = !ref?.pdf && !urlAllowed(ref?.url);
    if (ref?.pdf) {
      pdf.href = ref.pdf;
      pdf.textContent = '离线原文 ↗';
    } else if (urlAllowed(ref?.url)) {
      pdf.href = ref.url;
      pdf.textContent = '来源网页 ↗';
    } else {
      pdf.removeAttribute('href');
    }
    zoom = 1;
    imageX = imageY = 0;
    imageDialog.showModal();
    updateZoom();
  }

  function setZoom(value) {
    zoom = Math.max(1, Math.min(5, value));
    updateZoom();
  }

  function toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => toast('可用 Esc 退出全屏'));
    } else {
      document.documentElement.requestFullscreen().catch(() => toast('可用浏览器 F11 切换全屏'));
    }
  }

  function showFullScreenControls() {
    if (!document.fullscreenElement) return;
    document.body.classList.add('show-full-controls');
    clearTimeout(fullScreenTimeout);
    fullScreenTimeout = setTimeout(() => document.body.classList.remove('show-full-controls'), 2400);
  }

  function openPresenter() {
    if (presenterWindow && !presenterWindow.closed) {
      presenterWindow.focus();
      return;
    }
    presenterWindow = window.open(`index.html?presenter#${page}`, 'scnu-fpga-presenter',
      'popup,width=1200,height=780');
    if (!presenterWindow) toast('浏览器阻止了讲者窗口，请允许此页面弹窗。');
  }

  function toggleBlackout() {
    const blackout = $('#blackout');
    blackout.hidden = !blackout.hidden;
    $('#laser').hidden = !blackout.hidden || !laser;
  }

  function actions(action) {
    switch (action) {
      case 'home': go(1); break;
      case 'prev': go(page - 1); break;
      case 'next': go(page + 1); break;
      case 'end': go(slides.length); break;
      case 'overview': openOverview(); break;
      case 'library': librarySearch.value = ''; openLibrary(); break;
      case 'presenter': openPresenter(); break;
      case 'fullscreen': toggleFullScreen(); break;
      case 'help': $('#help-dialog').showModal(); break;
      case 'goto':
        $('#goto-number').value = page;
        $('#goto-dialog').showModal();
        $('#goto-number').select();
        break;
      case 'blackout': toggleBlackout(); break;
      case 'laser':
        laser = !laser;
        $('#laser').hidden = !laser;
        toast(laser ? '激光指示已开启' : '激光指示已关闭');
        break;
      case 'zoomin': setZoom(zoom * 1.25); break;
      case 'zoomout': setZoom(zoom / 1.25); break;
      case 'zoomreset': setZoom(1); break;
      case 'print': $('#help-dialog').close(); window.print(); break;
    }
  }

  function selectCase(name) {
    if (!$('[data-case="' + name + '"]')) return;
    caseName = name;
    $$('.case-tabs button').forEach(button => {
      const selected = button.dataset.caseTarget === name;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $$('.case-content').forEach(panel => panel.classList.toggle('selected', panel.dataset.case === name));
  }

  const lutTable = {
    xor: {bits: [0, 1, 1, 0], expression: 'A ⊕ B'},
    and: {bits: [0, 0, 0, 1], expression: 'A ∧ B'},
    or: {bits: [0, 1, 1, 1], expression: 'A ∨ B'},
  };
  let logic = 'xor';
  const inputs = [0, 0];
  let caseName = 'catapult';
  function updateLut() {
    $$('.bit-button').forEach((button, index) => {
      button.textContent = inputs[index];
      button.classList.toggle('on', Boolean(inputs[index]));
      button.setAttribute('aria-pressed', String(Boolean(inputs[index])));
    });
    $$('[data-logic]').forEach(button => {
      button.classList.toggle('selected', button.dataset.logic === logic);
      button.setAttribute('aria-pressed', String(button.dataset.logic === logic));
    });
    const {bits, expression} = lutTable[logic];
    const address = inputs[0] * 2 + inputs[1];
    $('#lut-output').textContent = bits[address];
    $('#lut-formula').textContent = `LUT 配置 ${bits.join(' ')} · 地址 ${inputs.join('')}₂ · Y = ${expression}`;
    labs.updateTruthTable(bits, address);
  }

  function readDemoState() {
    return {caseName, lutLogic: logic, lutInputs: [...inputs], labs: labs.state()};
  }

  function publishState() {
    if (presenterWindow && !presenterWindow.closed) {
      presenterWindow.postMessage({type: 'deck-sync', page, state: readDemoState()}, '*');
    }
  }

  function applyDemoState(state) {
    if (!state) return;
    if (caseName !== state.caseName) selectCase(state.caseName);
    if (Object.hasOwn(lutTable, state.lutLogic) && Array.isArray(state.lutInputs) &&
        (logic !== state.lutLogic || inputs.some((value, i) => value !== state.lutInputs[i]))) {
      logic = state.lutLogic;
      inputs[0] = Number(state.lutInputs[0] === 1);
      inputs[1] = Number(state.lutInputs[1] === 1);
      updateLut();
    }
    labs.apply(state.labs);
  }

  new ResizeObserver(fit).observe(viewport);
  addEventListener('hashchange', () => go(pageFromHash(), false));
  addEventListener('message', event => {
    if (preview && event.source === window.parent && event.data?.type === 'deck-preview') {
      go(event.data.page, false);
      applyDemoState(event.data.state);
    } else if (!preview && event.source === presenterWindow) {
      if (event.data?.type === 'deck-go') go(event.data.page);
      if (event.data?.type === 'deck-ready') publishState();
    }
  });
  go(page, false);
  updateLut();
  selectCase('catapult');
  setLibraryTab('references');
  labs.initialize(preview, publishState);

  if (preview) {
    document.body.classList.add('embedded');
    canvas.inert = true;
    return;
  }

  const defaultDemoState = readDemoState();
  let prePrintState;
  addEventListener('beforeprint', () => {
    if (prePrintState) return;
    prePrintState = readDemoState();
    applyDemoState(defaultDemoState);
  });
  addEventListener('afterprint', () => {
    applyDemoState(prePrintState);
    prePrintState = null;
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const attributes = button.dataset;
    if ('close' in attributes) button.closest('dialog').close();
    else if (attributes.page) {
      button.closest('dialog')?.close();
      go(Number(attributes.page));
    } else if (attributes.image) viewImage(attributes.image);
    else if (attributes.ref) {
      setLibraryTab('references');
      librarySearch.value = attributes.ref;
      openLibrary();
    }
    else if (attributes.libraryTab) {
      setLibraryTab(attributes.libraryTab);
      renderLibrary();
    } else if (attributes.caseTarget) { selectCase(attributes.caseTarget); publishState(); }
    else if (attributes.logic) { logic = attributes.logic; updateLut(); publishState(); }
    else if (attributes.bit) {
      const index = Number(attributes.bit);
      inputs[index] = 1 - inputs[index];
      updateLut();
      publishState();
    } else if (attributes.action) actions(attributes.action);
  });

  librarySearch.addEventListener('input', renderLibrary);
  $('#goto-form').addEventListener('submit', event => {
    event.preventDefault();
    go(Number($('#goto-number').value));
    $('#goto-dialog').close();
  });

  const keyActions = {
    ArrowLeft: 'prev', ArrowUp: 'prev', PageUp: 'prev', ArrowRight: 'next',
    ArrowDown: 'next', PageDown: 'next', ' ': 'next', Home: 'home', End: 'end',
    o: 'overview', e: 'library', p: 'presenter', f: 'fullscreen',
    g: 'goto', b: 'blackout', l: 'laser', '?': 'help',
  };
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.matches('input, textarea, select, [contenteditable]')) return;
    if ($('dialog[open]')) return;
    if (!$('#blackout').hidden) {
      if (['Escape', 'b', 'B'].includes(event.key)) {
        event.preventDefault();
        toggleBlackout();
      }
      return;
    }
    if ((event.key === ' ' || event.key === 'Enter') && event.target.closest('button, a, input')) return;
    const action = keyActions[event.key] || keyActions[event.key.toLowerCase()];
    if (!action) return;
    event.preventDefault();
    actions(action);
  });

  document.addEventListener('pointermove', event => {
    if (event.clientY > innerHeight - 60) showFullScreenControls();
    if (!laser || !$('#blackout').hidden) return;
    const dot = $('#laser');
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
  });

  document.addEventListener('fullscreenchange', () => {
    document.body.classList.remove('show-full-controls');
    if (document.fullscreenElement) {
      document.activeElement?.blur();
      showFullScreenControls();
    }
    fit();
  });

  viewport.addEventListener('touchstart', event => {
    swipeStart = event.target.closest('button, a, input') ? null : event.changedTouches[0];
  }, {passive: true});
  viewport.addEventListener('touchend', event => {
    if (!swipeStart) return;
    const touch = event.changedTouches[0];
    const difference = touch.clientX - swipeStart.clientX;
    if (Math.abs(difference) > 60 && Math.abs(touch.clientY - swipeStart.clientY) < 40) {
      go(page + (difference > 0 ? -1 : 1));
    }
    swipeStart = null;
  }, {passive: true});

  imageStage.addEventListener('wheel', event => {
    event.preventDefault();
    setZoom(zoom * (event.deltaY < 0 ? 1.15 : 1 / 1.15));
  }, {passive: false});
  imageStage.addEventListener('dblclick', () => setZoom(zoom === 1 ? 2 : 1));
  imageStage.addEventListener('pointerdown', event => {
    if (zoom <= 1) return;
    imageStage.setPointerCapture(event.pointerId);
    dragStart = {x: event.clientX - imageX, y: event.clientY - imageY};
  });
  imageStage.addEventListener('pointermove', event => {
    if (!dragStart) return;
    imageX = event.clientX - dragStart.x;
    imageY = event.clientY - dragStart.y;
    updateZoom();
    imageStage.style.cursor = 'grabbing';
  });
  function releaseImage() { dragStart = null; updateZoom(); }
  imageStage.addEventListener('pointerup', releaseImage);
  imageStage.addEventListener('pointercancel', releaseImage);
})();
