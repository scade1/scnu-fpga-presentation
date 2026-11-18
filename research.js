(() => {
  'use strict';
  const slides = window.DECK_SLIDES;
  const escape = window.DECK_ESCAPE;
  const paper = window.DECK_PAPER;
  const byPage = page => slides[page - 1];
  const titles = [
    '集成电路与 FPGA 的关键节点', '可配置逻辑与可配置互连', '计算架构的分工与取舍',
    '四类应用的约束与硬件响应', '约束如何传导到可验证指标', '技术路线与工程权衡',
  ];
  const descriptions = [
    '线性年份轴标出从单基底集成、现场配置到中国产业政策的关键节点。来源：Kilby、Noyce、Freeman 专利，Trimberger 2015，以及中国集成电路产业政策。',
    '两组图说明配置存储位如何选择阵列互连，以及 XOR 查找表如何以输入为地址选择配置位。参照 Freeman 专利与 Boutros & Betz 2021。',
    '对照 CPU、GPU、FPGA 与 ASIC 的执行组织、典型任务和工程约束。依据架构综述归纳。各列为定性分类。',
    '将通信前传、金融网络、工业感知、芯片原型与相应系统约束、硬件实现及验证指标对应。场景示例。',
    '将功耗散热、片外访问、布线和供应链条件与其系统影响及工程指标对应。依据 Horowitz 2014 与 Esmaeilzadeh 等 2011 归纳。',
    '将片上异构与 NoC、芯粒与 eFPGA、开放 EDA 对应到待解决问题与工程验证条件。依据所引架构、封装及 EDA 文献归纳。',
  ];
  window.DECK_FIGURES.forEach((item, i) => {
    item.title = titles[i];
    item.src = 'assets/figures/research-0' + (i + 1) + '.svg';
    item.caption = descriptions[i];
  });

  const chapters = [
    ['国内外历程', '从单片集成到现场配置', '03–06', 3],
    ['技术特点', '从电路机制到实现代价', '07–09', 7],
    ['产业作用', '从硬件能力到业务指标', '10–12', 10],
    ['现实挑战', '功耗、工具与供应链', '13–15', 13],
    ['未来趋势', '异构、封装与开放工具', '16–18', 16],
  ];

  function panel(kicker, name, choices, content, extra = '') {
    const tabs = choices.map(([key, label], i) =>
      '<button type="button" data-lab="' + name + '" data-choice="' + key + '" aria-pressed="' +
      (i === 0) + '">' + escape(label) + '</button>').join('');
    return '<div class="lab-panel ' + extra + '"><div class="lab-head"><span class="eyebrow">' +
      escape(kicker) + '</span><div class="lab-tabs">' + tabs + '</div></div><div class="lab-readout" data-readout="' +
      name + '" aria-live="polite">' + content + '</div></div>';
  }

  function roadmap() {
    return '<nav class="story-map" aria-label="五章导览">' + chapters.map(([title, question, range, target], i) =>
      '<button class="roadmap-step" data-page="' + target + '" style="--step:' + i + '">' +
      '<span class="chapter-range">' + range + '<span aria-hidden="true">↗</span></span><h3>' + title + '</h3><p>' + question + '</p></button>'
    ).join('') + '</nav>';
  }

  byPage(2).title = '集成电路如何支撑信息产业？';
  byPage(2).short = '主题与五章导览';
  byPage(2).subtitle = '集成电路将计算、存储与通信集成到硬件系统中。以 FPGA 为例，观察硬件能力如何转化为产业价值。';
  byPage(2).body = '<div class="foundation-overview"><div class="foundation-chain">' + [
    ['器件集成', '逻辑 · 存储 · 互连', '在芯片上组织可量产的硬件功能'],
    ['系统能力', '计算 · 存储 · 通信', '用芯片与软件构成信息处理系统'],
    ['产业服务', '网络 · 云计算 · 工业系统', '用吞吐、时延和能效衡量系统价值'],
  ].map(([label, title, detail], i) =>
    '<div class="foundation-node" style="--step:' + i + '"><span>' + label + '</span><h2>' + title + '</h2><p>' + detail + '</p></div>'
  ).join('') + '</div><div class="foundation-focus"><strong>以 FPGA 为例</strong><p>同一颗芯片可以重配逻辑与数据通路。哪些任务值得为此承担面积、时延与功耗开销？</p></div>' +
    roadmap() + '</div>';

  byPage(3).subtitle = '单片集成与平面互连推动芯片规模化。FPGA 在这一物理基础上，把硬件功能的选择延伸到出厂之后。';
  byPage(3).citation += ' 时间轴节点依据相关专利、Trimberger（2015）及中国产业政策。';
  byPage(3).body = '<div class="history-opening"><div class="history-origins">' + [
    ['1959', '单基底集成', 'Kilby 申请集成电路专利'],
    ['1961', '平面互连', 'Noyce 专利获批'],
    ['1965', '集成规模', 'Moore 讨论最低成本对应的元件数'],
    ['1974', '恒电场缩放', 'Dennard 等提出等比例缩放模型'],
  ].map(([year, title, detail]) =>
    '<div><span>' + year + '</span><h3>' + title + '</h3><p>' + detail + '</p></div>'
  ).join('') + '</div><div class="history-map">' + paper('f1', '从集成电路到 FPGA 的关键节点', 'flat') +
    '</div><div class="history-sources"><button class="evidence-link" data-image="8">Kilby 集成电路专利 ↗</button>' +
    '<button class="evidence-link" data-image="9">Noyce 平面互连专利 ↗</button></div></div>';
  byPage(6).subtitle = '从政策与产业布局收束到具体型号，以下用 GW5AST-138 观察资源清单如何体现芯片能力。';
  byPage(7).subtitle = '输入是地址，配置位决定输出。改变输入或逻辑函数，可逐步观察查表过程。';
  byPage(7).body = byPage(7).body
    .replace('<span class="lut-address">A B →</span>', '<span class="lut-address">地址选择</span><span class="lut-signal" aria-hidden="true"></span>')
    .replace('<p class="lut-formula"', '<div class="truth-cells" aria-label="当前函数的查找表"></div><p class="lut-formula"');

  const benchmarks = {
    area: {
      title: '面积比 · FPGA / ASIC',
      note: '35× 为纯逻辑基准组的约值。使用硬核资源的相关基准面积比可低至约 18×。见论文 Table II。',
      max: 40, ticks: [0, 10, 20, 30, 40], values: [
        {label: 'ASIC 基准', low: 1},
        {label: 'FPGA · 纯逻辑', low: 35},
        {label: 'FPGA · 硬核资源', low: 18},
      ],
    },
    delay: {
      title: '关键路径延迟比 · FPGA / ASIC',
      note: '纯逻辑基准在不同 FPGA 速度等级下的平均延迟比为 3.4–4.6×。斜线段表示跨速度等级范围。',
      max: 5, ticks: [0, 1, 2, 3, 4, 5], values: [
        {label: 'ASIC 基准', low: 1},
        {label: 'FPGA · 纯逻辑', low: 3.4, high: 4.6},
      ],
    },
    power: {
      title: '动态功耗比 · FPGA / ASIC',
      note: '约 14× 对应论文的纯逻辑设计组。比较对象为动态功耗。',
      max: 16, ticks: [0, 4, 8, 12, 16], values: [
        {label: 'ASIC 基准', low: 1},
        {label: 'FPGA · 纯逻辑', low: 14},
      ],
    },
  };

  function benchmarkMarkup(key) {
    const item = benchmarks[key];
    const rows = item.values.map(({label, low, high}, index) => {
      const span = high ? high - low : 0;
      const length = (high || low) / item.max * 100;
      const labelSide = length > 81 ? 'inside' : '';
      return '<div class="metric-row" style="--step:' + index + '"><span>' + label + '</span><div class="metric-track"><div class="metric-bars ' +
        (index === 1 ? 'is-red' : '') + '"><i style="width:' + (low / item.max * 100) + '%"></i>' +
        (span ? '<i class="metric-range" style="width:' + (span / item.max * 100) + '%"></i>' : '') +
        '</div><b class="metric-value ' + labelSide + '" style="--end:' + length + '%">' + low + (high ? '–' + high : '') + '×</b></div></div>';
    }).join('');
    const axis = item.ticks.map(tick => '<span>' + tick + '</span>').join('');
    return '<div class="metric-caption">' + item.title + ' <small>90 nm CMOS · 线性轴从 0 开始</small></div><div class="metric-rows">' +
      rows + '</div><div class="metric-axis">' + axis + '</div><p class="metric-note fine">' + item.note + '</p>';
  }

  byPage(8).body = '<div class="two-column"><div class="stack">' +
    panel('FPGA / ASIC', 'benchmark', [['area', '面积'], ['delay', '延迟'], ['power', '动态功耗']], benchmarkMarkup('area'), 'benchmark-lab') +
    '<div class="benchmark-summary"><p><b>≈35×</b><span>纯逻辑面积</span></p><p><b>3.4–4.6×</b><span>平均关键路径延迟</span></p><p><b>≈14×</b><span>动态功耗</span></p></div></div><div class="bench-papers">' +
    paper(4, '论文摘要 · 实验口径') + paper(5, 'Table II · 面积数据原表') + '</div></div>';
  byPage(9).subtitle = '专用硬核减少纯逻辑的开销。选择计算架构时，还需结合负载、开发周期和系统约束。';
  byPage(9).body = byPage(9).body
    .replace(/<div class="radar-panel">[\s\S]+?<\/div><\/div>$/, '<div class="radar-panel">' +
      paper('f3', '图 03 · 架构分工与取舍') + '<p class="figure-note">定性架构比较。具体应用需按同一工作负载测量吞吐、时延和能效。</p></div></div>');
  byPage(9).citation = '[S2-08] Gowin DS1104-1.0E, Table 1-1, 2023. [S2-06] Cong et al., IEEE TCAD, 2011. 图 03 依据架构综述定性归纳。';
  byPage(10).subtitle = '芯片、工具链和 IP 共同形成系统供给能力。两笔并购体现了企业对可配置硬件生态的长期投入。';

  const scenarios = {
    link: {
      stages: ['高速接口', '协议适配', '流式预处理'],
      constraint: '通信协议演进，处理流水线仍须跟上线速。',
      advantage: '按协议要求调整接口与流水线。',
      measure: '线速吞吐 · 误码率 · 协议兼容性',
    },
    packet: {
      stages: ['OUCH 报文', '字段提取', '策略逻辑'],
      constraint: '报文解析是交易系统中可单独测量的一段。',
      advantage: '定制数据通路可在 156 MHz 下用一个周期提取字段。',
      measure: '字段提取 6.4 ns · 策略与网络时延另计',
    },
    sensor: {
      stages: ['多路传感', '并行滤波', '输出融合'],
      constraint: '多路输入须持续处理，并满足最坏响应时间约束。',
      advantage: '过滤和预处理可以按通道并行。',
      measure: '通道吞吐 · 最坏响应时间 · 资源上限',
    },
    proto: {
      stages: ['待验证 RTL', 'FPGA 映射', '系统联调'],
      constraint: '投片前需要在可运行的硬件上检查软件和接口。',
      advantage: '修改设计后可重新生成配置，继续软硬件联调。',
      measure: '功能覆盖 · 接口行为 · 原型资源限制',
    },
  };

  function scenarioMarkup(key) {
    const scene = scenarios[key];
    const phases = ['输入', 'FPGA 处理', '后续环节'];
    return '<p class="lab-thesis">' + scene.constraint + '</p><div class="animated-stages">' +
      '<div class="flow-signal" aria-hidden="true"></div>' +
      scene.stages.map((name, i) => '<div class="flow-stage" style="--step:' + i + '"><small>' +
        phases[i] + '</small><strong>' + name + '</strong></div>').join('') +
      '</div><div class="scenario-outcome"><div><span>可配置性的作用</span><b>' + scene.advantage +
      '</b></div><div><span>验证指标</span><b>' + scene.measure + '</b></div></div>';
  }

  byPage(11).subtitle = '从通信、金融网络、工业感知和芯片设计看可配置硬件如何回应不同系统约束。';
  byPage(11).body = '<div class="scenario-slide">' +
    panel('数据通路', 'scenario', [['link','通信'],['packet','金融网络'],['sensor','工业感知'],['proto','芯片原型']], scenarioMarkup('link'), 'scenario-lab') +
    '<button class="evidence-link" data-image="f4">四类应用的工程对照 ↗</button></div>';
  byPage(11).citation = '[S3-08] Lockwood et al., IEEE Hot Interconnects, 2012, Fig. 7（156 MHz，OUCH 字段提取）。其他数据通路为应用示意，指标按目标系统验证。';

  byPage(12).subtitle = '比较项目架构与测试口径。Catapult 的两项收益来自两组独立实验。';
  byPage(12).body = byPage(12).body.replace('<div class="case-network" aria-hidden="true">',
    '<div class="catapult-constraints"><button data-lab="catapult" data-choice="latency" aria-pressed="true">固定时延分布</button>' +
    '<button data-lab="catapult" data-choice="throughput" aria-pressed="false">固定吞吐</button></div><div class="case-network" aria-hidden="true">')
    .replace('两个结果对应不同约束条件，分别测量。<br>硬件流水线与服务器软件共同完成搜索排序。',
      '<span data-readout="catapult" aria-live="polite">在相近时延分布下，比较单位服务器的排序吞吐。</span>');

  byPage(13).subtitle = '规模扩大后，计算是否更快还取决于同时可活动的资源，以及数据能否及时到达。';

  byPage(14).subtitle = '综合决定逻辑结构，布局和布线决定信号路径。用最差时序裕量判断目标频率是否可达。';

  const logicDelay = 2.4;
  const routeDelays = {compact: 1.2, detour: 2.4};
  const maxPeriod = 6.5;

  function timingMarkup() {
    return '<label class="timing-control"><span>时钟周期</span><input type="range" min="3.5" max="' + maxPeriod +
      '" value="5" step="0.1" data-timing-period aria-label="时钟周期，纳秒"><output data-timing-period-value>5.0 ns</output></label>' +
      '<div class="timing-diagram"><div class="timing-track"><span class="logic-delay" style="width:' +
      logicDelay / maxPeriod * 100 + '%">逻辑 ' + logicDelay.toFixed(1) + '</span><span class="route-delay"></span>' +
      '<i class="timing-deadline" aria-hidden="true"></i></div><div class="timing-status"><span>裕量</span><output data-timing-slack></output></div></div>';
  }

  byPage(14).body = byPage(14).body.replace(/<div class="timing-formula">[\s\S]+$/, 
    panel('建立时序 · 简化模型', 'timing', [['compact','紧凑布线'],['detour','绕行布线']], timingMarkup(), 'timing-lab') +
    '<div class="timing-foot"><p class="fine">示例假设（ns）。裕量 = 时钟周期 − 逻辑延迟 − 布线延迟。时钟偏斜与建立时间从略。</p>' +
    '<button class="evidence-link" data-image="f5">约束与指标 ↗</button></div>');

  byPage(15).subtitle = '跨过单器件的时序与带宽约束，还须解决架构 IP、制造封测、工具和应用验证条件。';
  byPage(16).subtitle = '将控制、密集算术与定制流式处理映射到不同引擎，再用 NoC 组织数据传输。';
  const accelerator = {
    control: {name:'标量引擎', task:'系统控制、配置与任务调度', target:'scalar'},
    compute: {name:'智能引擎', task:'密集向量运算与矩阵乘加', target:'adaptive-ai'},
    stream: {name:'自适应引擎', task:'可定制的数据通路与协议适配', target:'fabric'},
  };
  function engineMarkup(key) {
    const engine = accelerator[key];
    return '<div class="engine-result"><b>' + engine.name + '</b><span>' + engine.task + '</span></div>';
  }

  byPage(16).body = byPage(16).body
    .replace('<div class="engine"><h3>标量引擎', '<div class="engine" data-engine-target="scalar"><h3>标量引擎')
    .replace('<div class="engine"><h3>自适应引擎', '<div class="engine" data-engine-target="fabric"><h3>自适应引擎')
    .replace('<div class="engine wide">', '<div class="engine wide" data-engine-target="adaptive-ai">')
    .replace('<button class="evidence-link" data-image="f6">未来演化技术全景 ↗</button>',
      panel('任务映射 · 架构示意', 'engine', [['control','系统控制'], ['compute','密集运算'], ['stream','流式处理']], engineMarkup('control'), 'engine-lab'));

  byPage(18).subtitle = '开放工具支持可重复的综合与布局布线，领域专用架构通过数据复用、精度和并行设计适配工作负载。';
  const future = {
    hetero: {route:'异构与 NoC', problem:'计算组织与片上数据搬运', validation:'用目标负载检查映射效率与互连拥塞。', page:16},
    chiplet: {route:'芯粒与 eFPGA', problem:'封装内集成与逻辑复用', validation:'检查跨芯粒带宽、功耗、封装和验证成本。', page:17},
    open: {route:'开放 EDA', problem:'工具与器件适配', validation:'核对目标器件、比特流支持范围及收敛结果。', page:14},
  };

  function futureMarkup(key) {
    const route = future[key];
    return '<div class="future-result"><div><span>技术路线</span><strong>' + route.route +
      '</strong></div><div><span>对应瓶颈</span><strong>' + route.problem + '</strong></div>' +
      '<div class="future-verification"><span>验证条件</span><p>' + route.validation +
      '</p><button class="evidence-link" data-page="' + route.page + '">回看第 ' + route.page + ' 页 ↗</button></div></div>';
  }

  byPage(18).body = byPage(18).body.replace(
    '<div class="callout">中国 FPGA 的升级，需要器件、工具、IP 与应用反馈形成协同。</div>',
    panel('从瓶颈回到技术路线', 'future', [['hetero','异构'],['chiplet','芯粒'],['open','EDA']], futureMarkup('hetero'), 'future-lab'));
  byPage(19).title = '集成电路奠定产业基础，FPGA 扩展硬件适应能力';
  byPage(19).short = '结论与适用条件';
  byPage(19).subtitle = '从芯片到产业的价值，要经过器件能力、系统实现和应用验证三个环节。';
  byPage(19).body = '<div class="foundation-summary">' + [
    ['器件基础', '在芯片上集成逻辑、存储与互连', '材料、工艺与互连决定可实现的功能和规模。', 3, '回看集成电路历程'],
    ['系统实现', '通过 FPGA 重配逻辑与数据通路', '可配置性带来面积、时延、动态功耗及工具开销。', 8, '回看 FPGA 与 ASIC 对比'],
    ['产业价值', '在具体负载中验证可编程收益', 'Catapult 分别在固定时延分布与固定吞吐下验证收益。', 12, '回看云端实测'],
  ].map(([layer, claim, detail, page, label], i) => '<div class="summary-layer" style="--step:' + i + '">' +
    '<span>' + layer + '</span><h2>' + claim + '</h2><p>' + detail + '</p><button class="evidence-link" data-page="' + page + '">' +
    label + ' ↗</button></div>').join('') + '</div><p class="foundation-verdict">当需求会变、数据流可并行，且系统收益覆盖实现开销时，可配置硬件就有产业价值。</p>';
  for (const slide of slides) {
    slide.body = slide.body.replace(/assets\/figures\/f0([1-6])\.png" alt="[^"]*"/g,
      (_, number) => 'assets/figures/research-0' + number + '.svg" alt="' + escape(titles[number - 1]) + '"');
  }

  const state = {
    benchmark:'area', scenario:'link', catapult:'latency', timing:'compact',
    period:5, engine:'control', future:'hetero',
  };
  const initial = Object.freeze({...state});
  const views = {benchmark:benchmarkMarkup, scenario:scenarioMarkup, engine:engineMarkup, future:futureMarkup};
  const options = {
    benchmark:Object.keys(benchmarks), scenario:Object.keys(scenarios), catapult:['latency','throughput'],
    timing:Object.keys(routeDelays), engine:Object.keys(accelerator), future:Object.keys(future),
  };
  const choiceButtons = () => [...document.querySelectorAll('[data-lab]')];

  function readTiming() {
    const input = document.querySelector('[data-timing-period]');
    if (!input) return;
    const value = state.period;
    const extraDelay = routeDelays[state.timing];
    const slack = Math.round((value - logicDelay - extraDelay) * 10) / 10;
    input.value = value;
    const track = input.closest('.lab-readout').querySelector('.timing-track');
    track.style.setProperty('--deadline', value / maxPeriod * 100 + '%');
    track.style.setProperty('--route-width', extraDelay / maxPeriod * 100 + '%');
    track.querySelector('.route-delay').textContent = '布线 ' + extraDelay.toFixed(1);
    document.querySelector('[data-timing-period-value]').value = value.toFixed(1) + ' ns';
    const output = document.querySelector('[data-timing-slack]');
    output.value = (slack >= 0 ? '+' : '−') + Math.abs(slack).toFixed(1) + ' ns';
    output.classList.toggle('violation', slack < 0);
    output.parentElement.classList.toggle('violation', slack < 0);
    output.setAttribute('aria-label', slack < 0 ? '建立时序违例' : '满足建立时序');
  }

  function select(name, value) {
    if (!options[name]?.includes(value)) return;
    state[name] = value;
    choiceButtons().filter(button => button.dataset.lab === name).forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.choice === value)));
    const readout = document.querySelector('[data-readout="' + name + '"]');
    if (views[name]) readout.innerHTML = views[name](value);
    if (name === 'timing') readTiming();
    if (name === 'engine') {
      document.querySelectorAll('[data-engine-target]').forEach(block =>
        block.classList.toggle('engine-active', block.dataset.engineTarget === accelerator[value].target));
      replay(document.querySelector('.noc-bus'), 'engine-signal');
    }
    if (name === 'catapult') {
      const metrics = [...document.querySelectorAll('[data-case="catapult"] .stat')];
      metrics.forEach((metric, i) => metric.classList.toggle('metric-selected', i === (value === 'latency' ? 0 : 1)));
      replay(metrics[value === 'latency' ? 0 : 1], 'metric-pulse');
      readout.textContent = value === 'latency'
        ? '在相近时延分布下，比较单位服务器的排序吞吐。'
        : '在排序吞吐相当时，比较响应分布的尾延迟。';
    }
  }

  function apply(next, force = false) {
    if (!next) return;
    if (Number.isFinite(next.period) && next.period >= 3.5 && next.period <= 6.5) {
      state.period = next.period;
      readTiming();
    }
    for (const name of Object.keys(options)) {
      if (force || state[name] !== next[name]) select(name, next[name]);
    }
  }

  function replay(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  function updateTruthTable(bits, address) {
    const cells = document.querySelector('.truth-cells');
    if (!cells) return;
    cells.innerHTML = bits.map((value, i) => '<div class="' + (address === i ? 'active' : '') + '"' +
      (address === i ? ' aria-current="true"' : '') + '><small>' + i.toString(2).padStart(2, '0') +
      '</small><b>' + value + '</b></div>').join('');
    replay(cells.closest('.lut-demo'), 'lut-trace');
  }

  function initialize(preview, publish) {
    apply(initial, true);
    if (preview) return;
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-lab]');
      if (!button) return;
      select(button.dataset.lab, button.dataset.choice);
      publish();
    });
    document.addEventListener('input', event => {
      if (!event.target.matches('[data-timing-period]')) return;
      state.period = Number(event.target.value);
      readTiming();
      publish();
    });
  }

  window.DECK_LABS = {initialize, apply, state:() => ({...state}), updateTruthTable};
})();
