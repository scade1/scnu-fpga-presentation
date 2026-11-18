/* Slide text is audience-facing. Full oral scripts live in content.js and the presenter window. */
(() => {
  const evidence = [
    ['Trimberger · 三个时代', 'R01', 'Proceedings of the IEEE, 2015 · 103(3): 318–331'],
    ['30 年的器件尺度演进', 'R01', 'Trimberger, 2015 · Fig. 1'],
    ['FPGA / ASIC 成本交叉点', 'R01', 'Trimberger, 2015 · Fig. 2'],
    ['FPGA 与 ASIC 的定量差距', 'R02', 'Kuon & Rose · IEEE TCAD, 2007'],
    ['面积基准 · Table II', 'R02', 'Kuon & Rose, 2007 · Table II · 90 nm CMOS'],
    ['Freeman 奠基专利', 'R04', 'US 4,870,302 · granted 1989-09-26'],
    ['可配置电路专利附图', 'R04', 'Freeman · US 4,870,302 · 专利附图'],
    ['Kilby 集成电路专利', 'S1-01', 'US 3,138,743 · filed 1959 · granted 1964'],
    ['Noyce 平面互连专利', 'S1-02', 'US 2,981,877 · granted 1961'],
    ['现代 FPGA 架构综述', 'S2-01', 'Boutros & Betz · IEEE CAS Magazine, 2021'],
    ['早期与现代 FPGA 架构', 'S2-01', 'Boutros & Betz, 2021 · Fig. 1'],
    ['GW5AST 产品数据手册', 'S2-08', 'Gowin DS1104-1.0E · Table 1-1 · Preliminary'],
    ['Catapult · 数据中心加速', 'R03', 'Putnam et al. · ISCA, 2014'],
    ['Catapult · FPGA 环网', 'R03', 'Putnam et al., 2014 · 原始拓扑与加速卡'],
    ['SmartNIC · 云规模架构', 'S3-04', 'Caulfield et al. · MICRO, 2016'],
    ['Brainwave · 实时 AI', 'S3-06', 'Fowers et al. · ISCA, 2018'],
    ['CNN · Roofline 设计', 'S3-07', 'Zhang et al. · ACM/SIGDA FPGA, 2015'],
    ['体系结构的新黄金时代', 'S5-08', 'Hennessy & Patterson · CACM, 2019'],
    ['处理器性能增长曲线', 'S5-08', 'Hennessy & Patterson, 2019 · Fig. 6 · SPECintCPU'],
    ['OpenFPGA · 原始论文', 'S5-04', 'Tang et al. · IEEE Micro, 2020 · 作者主页论文预览'],
  ].map((e, i) => ({id: i + 1, title: e[0], ref: e[1], caption: e[2], src: `assets/evidence/c${String(i + 1).padStart(2, '0')}.png`}));
  const figureTitles = ['IC 与 FPGA 发展历程全景时间轴', 'FPGA 微观硬件架构解析', '四类计算架构的五维定性对照', 'FPGA 产业应用矩阵', '技术与产业挑战双维模型', '后摩尔时代 FPGA 演化路径'];
  const figures = figureTitles.map((title, i) => ({id: `f${i + 1}`, title, src: `assets/figures/f${String(i + 1).padStart(2, '0')}.png`, caption: '架构与机制示意。'}));
  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paper = (id, label, cls = '') => {
    const item = typeof id === 'number' ? evidence[id - 1] : figures[Number(id.slice(1)) - 1];
    return `<button class="paper ${cls}" data-image="${id}" aria-label="放大${esc(item.title)}"><img src="${item.src}" alt="${esc(item.title)}" draggable="false"><span class="paper-label"><strong>${esc(label || item.title)}</strong><span class="zoom-mark" aria-hidden="true">↗</span></span></button>`;
  };
  const point = (n, title, text) => `<div class="point"><span class="point-no">${n}</span><div><h3>${title}</h3><p>${text}</p></div></div>`;
  const stat = (n, label, unit = '') => `<div class="stat"><div class="big-number">${n}<span class="number-unit">${unit}</span></div><p class="metric-title">${label}</p></div>`;
  const chip = `<div class="chip-scene" aria-label="FPGA 可编程逻辑阵列艺术示意"><div class="chip-orbit"></div><div class="chip-board"><svg class="circuit-lines" viewBox="0 0 570 570" aria-hidden="true">${Array.from({length:12},(_,i)=>`<path d="M0 ${35+i*43} H${90+(i%3)*13} V${150+i*19} H180 M570 ${35+i*43} H${477-(i%3)*13} V${150+i*19} H390 M${35+i*43} 0 V100 H${150+i*19} V180 M${35+i*43} 570 V470 H${150+i*19} V390"/>`).join('')}</svg><div class="chip-package"><div class="chip-die">${'<i></i>'.repeat(64)}</div><div class="chip-lettering">FPGA</div><span class="chip-code">FIELD PROGRAMMABLE · 1985—</span></div></div><div class="chip-float float-a">LUT<span>RECONFIGURABLE LOGIC</span></div><div class="chip-float float-b">DSP / BRAM<span>HETEROGENEOUS FABRIC</span></div><div class="chip-float float-c">BITSTREAM<span>HARDWARE, REDEFINED.</span></div><p class="chip-caption">ARCHITECTURE VISUALIZATION · 示意</p></div>`;
  const slides = [
    {
      chapter: 0, section: '开篇', en: 'RECONFIGURABLE COMPUTING', title: '集成电路 · 信息产业的基石', short: '可重构的基石', dark: true, cover: true,
      citation: '', duration: 40,
      body: `<div class="cover-brand"><img src="assets/brand/scnu_logo_transparent.png" alt="华南师范大学校徽"><div><strong>华南师范大学</strong><small>电子与信息工程学院</small></div></div><div class="cover-copy"><span class="eyebrow">INTEGRATED CIRCUITS × FPGA</span><h1>集成电路<span>信息产业的基石</span></h1><p class="cover-subtitle">以 FPGA 为例<br>从芯片集成到产业系统</p><p class="cover-detail"><span class="line"></span><span>逻辑与互连</span><span>系统与产业</span></p></div>${chip}<div class="cover-motto">艰苦奋斗 · 严谨治学 · 求实创新 · 为人师表</div>`,
    },
    {
      chapter: 0, section: '研究路径', en: 'RESEARCH FRAMEWORK', title: '沿五个维度，理解可重构集成电路', short: '五段式论述路径',
      subtitle: '从历史事实到物理机制，再以产业实测检验其支撑价值。', duration: 45,
      citation: '',
      body: '',
    },
    {
      chapter: 1, section: '国内外发展历程', en: 'ORIGINS OF INTEGRATION', title: '集成电路的起点，是器件与互连的共同集成', short: 'IC 起源与缩放规律',
      subtitle: '从单一半导体基底到平面工艺，制造能力推动信息系统规模扩张。', duration: 60,
      citation: '[S1-01] Kilby, US 3,138,743（申请 1959，授权 1964）. [S1-02] Noyce, US 2,981,877（1961）. [S1-03] Moore, 1965. [S1-04] Dennard et al., JSSC, 1974.',
      body: `<div class="split-wide"><div class="stack"><div class="milestones"><div class="milestone"><span class="year">1959</span><h3>单基底集成</h3><p>Kilby 申请专利<br>有源与无源器件集成于半导体</p></div><div class="milestone"><span class="year">1961</span><h3>平面工艺与互连</h3><p>Noyce 专利获批<br>绝缘层与金属引线支持量产</p></div><div class="milestone"><span class="year">1965</span><h3>摩尔的规模预测</h3><p>最初预测最低成本对应的<br>元件数约每年翻倍</p></div><div class="milestone"><span class="year">1974</span><h3>恒电场缩放</h3><p>尺寸、电压同步缩放<br>理想条件下维持功率密度</p></div></div><div class="callout">器件密度与互连工艺，构成信息处理能力持续增长的物理基础。</div></div><div class="patent-pair">${paper(8,'Kilby · US 3,138,743')}${paper(9,'Noyce · US 2,981,877')}</div></div>`,
    },
    {
      chapter: 1, section: '国内外发展历程', en: 'THE PROGRAMMABLE BREAKTHROUGH', title: 'FPGA 将“出厂后可配置”引入集成电路', short: 'FPGA 的诞生',
      subtitle: '配置存储位控制逻辑函数与互连拓扑，同一颗器件支持不同硬件实现。', duration: 55,
      citation: '[R04] Freeman R H. Configurable electrical circuit… US 4,870,302, 1989（优先权 1984）. XC2064 产品历史节点见 Carter et al., CICC, 1986.',
      body: `<div class="two-column"><div class="stack"><div><span class="eyebrow">XILINX XC2064</span><div class="year-hero">1985</div><p class="lead" style="margin-top:16px">首款商用 FPGA<br><span class="highlight">可编程逻辑 + 可编程互连</span></p></div><div class="xc-specs"><div class="stat"><strong>64</strong><span>CLB 可配置逻辑块</span></div><div class="stat"><strong>2 μm</strong><span>CMOS 工艺</span></div><div class="stat"><strong>≈1,000</strong><span>等效逻辑门</span></div></div><div class="callout">Bitstream → SRAM 配置位 → 逻辑功能 / 连接关系</div><p class="fine">1984 年专利优先权 → 1985 年商用器件 → 1989 年专利授权</p></div><div class="patent-pair">${paper(6,'Freeman · 专利首页')}${paper(7,'可配置逻辑与互连 · 专利附图')}</div></div>`,
    },
    {
      chapter: 1, section: '国内外发展历程', en: 'THREE AGES OF FPGAS', title: '从胶水逻辑到片上系统，规模与经济性共同演进', short: '三个时代与经济性',
      subtitle: 'Trimberger 的三阶段划分覆盖 1984–2007 年，论文进一步回顾三十年器件演进。', duration: 60,
      citation: '[R01] Trimberger S. Three Ages of FPGAs. Proceedings of the IEEE, 2015, 103(3): 318–331. 增长倍数为文献回顾区间，非未来性能预测。',
      body: `<div class="era-band"><div class="era"><div class="year">1984–1991</div><h3>发明时代</h3><p>替代板级离散胶水逻辑<br>建立配置与设计工具范式</p></div><div class="era"><div class="year">1992–1999</div><h3>扩张时代</h3><p>切入通信与数字信号处理<br>增加片上存储等专用资源</p></div><div class="era"><div class="year">2000–2007</div><h3>积累时代</h3><p>串行收发器、乘法器与处理器<br>推动系统功能片上集成</p></div></div><div class="history-evolution"><div class="history-figures">${paper(2,'器件能力与单位成本 · Fig. 1')}${paper(3,'出货规模与成本交叉点 · Fig. 2')}</div><div class="history-insights"><div class="history-stats">${stat('10⁴×','容量增长超')}${stat('100×','性能提升')}${stat('10³×','单次操作能耗 / 成本降幅超')}</div><p>ASIC 的前期投入与单位成本，共同影响 FPGA 的适用出货规模。</p><button class="evidence-link" data-image="1">Trimberger 三十年回顾 ↗</button></div></div>`,
    },
    {
      chapter: 1, section: '国内外发展历程', en: 'CHINA’S FPGA LANDSCAPE', title: '中国 FPGA 走向器件、工具与应用协同演进', short: '中国 FPGA 发展',
      subtitle: '政策引导与本土厂商积累形成多层次产品布局，具体能力以器件手册为准。', duration: 60,
      citation: '[S1-07] 国家集成电路产业发展推进纲要, 2014 / 国发〔2020〕8号. [S3-03] 安路科技招股说明书, 2021. [S2-08] Gowin DS1104-1.0E, 2023. 厂商定位为所引资料期概述。',
      body: `<div class="split-wide"><div><div class="policy-line"><strong>2014</strong><p>《国家集成电路产业发展推进纲要》<br><span class="muted">推动设计、制造、封测与产业生态建设</span></p></div><div class="policy-line"><strong>2020</strong><p>国发〔2020〕8 号<br><span class="muted">支持集成电路与软件产业高质量发展</span></p></div><table class="vendor-table"><tbody><tr><td>紫光同创</td><td>Titan / Logos 等产品与工具生态</td></tr><tr><td>安路科技</td><td>工业控制、显示与可编程系统应用</td></tr><tr><td>高云半导体</td><td>GW 系列器件与自主开发工具</td></tr><tr><td>复旦微电</td><td>高可靠 FPGA 与异构 SoC 产品布局</td></tr></tbody></table></div><div class="stack"><div class="national-spec"><div><strong>138,240</strong><span>LUT4 · GW5AST-138</span></div><div><strong>12.5</strong><span>Gbps / lane · 手册上限</span></div></div>${paper(12,'国产实物参数 · GW5AST 系列数据手册','grow')}<p class="fine">代表性器件数据，2023 年预发布手册。逻辑资源、时序与接口能力需分别比较。</p></div></div>`,
    },
    {
      chapter: 2, section: '技术特点', en: 'LUT & PROGRAMMABLE INTERCONNECT', title: '查找表决定函数，配置开关决定连接', short: 'LUT 与岛式互连',
      subtitle: 'K 输入 LUT 以 2ᴷ 个配置位编码布尔函数，逻辑块通过 CB / SB 互连。', duration: 70,
      citation: '[S2-01] Boutros A, Betz V. IEEE Circuits and Systems Magazine, 2021, 21(2): 4–29. [S2-03] Ahmed E, Rose J. IEEE TVLSI, 2004. 可配置逻辑与互连为架构示意。',
      body: `<div class="split-narrow"><div class="stack"><div class="lut-demo"><span class="eyebrow">2-INPUT LUT · 交互示例</span><div class="logic-choices"><button data-logic="xor" class="selected">XOR</button><button data-logic="and">AND</button><button data-logic="or">OR</button></div><div class="lut-controls"><button class="bit-button" data-bit="0" aria-label="切换输入 A">0</button><button class="bit-button" data-bit="1" aria-label="切换输入 B">0</button><span class="lut-address">A B →</span><output class="lut-result" id="lut-output">0</output></div><p class="lut-formula" id="lut-formula">配置内容 0 1 1 0 · 输出 Y = A ⊕ B</p></div>${point('01','LUT / 触发器','组合函数与寄存器形成可流水化逻辑。')}${point('02','连接盒 / 开关盒','配置位选择逻辑引脚与布线通道的连接。')}${point('03','专用进位链','缩短算术运算路径，减少通用布线开销。')}</div><div class="architecture-figure">${paper('f2','可配置逻辑与互连')}<button class="evidence-link" data-image="11">Boutros 与 Betz 的 FPGA 架构图 ↗</button></div></div>`,
    },
    {
      chapter: 2, section: '技术特点', en: 'THE COST OF PROGRAMMABILITY', title: '可编程能力，伴随可测量的面积、延迟与功耗开销', short: 'FPGA / ASIC 定量代价',
      subtitle: 'Kuon & Rose 的同工艺实验揭示可编程互连的代价，以及专用硬核的收益。', duration: 75,
      citation: '[R02] Kuon I, Rose J. Measuring the Gap Between FPGAs and ASICs. IEEE TCAD, 2007, 26(2): 203–215. 基于 90 nm 实验，结论具有基准与架构条件。',
      body: `<div class="two-column"><div><div class="bench-context"><span>90 nm CMOS</span><span>标准单元 ASIC = 1</span><span>面积比值</span></div><div class="benchmark-chart"><span class="bar-label">ASIC</span><div class="bar-track" style="--bar:2.857%"><span class="bar-fill"></span><span class="bar-value">1×</span></div><span class="bar-label">FPGA<br><small class="muted">纯逻辑实现</small></span><div class="bar-track full" style="--bar:100%"><span class="bar-fill red-fill"></span><span class="bar-value">35×</span></div><span class="bar-label">FPGA<br><small class="muted">硬核资源基准</small></span><div class="bar-track" style="--bar:51.429%"><span class="bar-fill blue"></span><span class="bar-value">18×</span></div></div><div class="chart-axis"><span>0</span><span>10</span><span>20</span><span>30</span><span>35</span></div><div class="benchmark-metrics"><div><div class="big-number">3.4–4.6×</div><p>关键路径延迟比</p></div><div><div class="big-number">≈14×</div><p>动态功耗比</p></div></div><p class="fine" style="margin-top:28px">实验均值与具体实现相关。面积比 35 → 18 为不同资源映射结果。</p></div><div class="bench-papers">${paper(4,'论文摘要 · 实验口径')}${paper(5,'Table II · 面积数据原表')}</div></div>`,
    },
    {
      chapter: 2, section: '技术特点', en: 'HETEROGENEITY & DESIGN AUTOMATION', title: '现代 FPGA 是异构资源与编译工具链的组合', short: '异构硬核与 HLS',
      subtitle: 'DSP、块存储与处理器减少软逻辑开销，EDA 将算法和 RTL 映射到物理资源。', duration: 60,
      citation: '[S2-08] Gowin DS1104-1.0E, Table 1-1, 2023. [S2-06] Cong et al. High-Level Synthesis for FPGAs, IEEE TCAD, 2011. 架构矩阵为定性对照。',
      body: `<div class="two-column"><div class="stack"><div><h3 class="rule-heading">GW5AST-138 · 异构资源示例</h3><div class="chip-resources"><div class="resource"><strong>6,120 Kb</strong><span>BSRAM 块存储</span></div><div class="resource"><strong>298</strong><span>27 × 18-bit DSP</span></div><div class="resource"><strong>RISC-V</strong><span>AE350_SOC 硬核</span></div></div></div><div><h3 class="rule-heading">从设计描述到配置比特流</h3><div class="pipeline">${[['综合','SYNTHESIS'],['映射','MAPPING'],['布局','PLACEMENT'],['布线','ROUTING'],['比特流','BITSTREAM']].map(x=>`<div class="pipe-stage">${x[0]}<small>${x[1]}</small></div>`).join('')}</div></div><div class="callout">HLS 将 C / C++ 描述转换为 RTL，性能仍取决于并行度、数据复用与时序约束。</div><p class="fine">吞吐、时延、能效与开发成本，随任务和实现方式共同变化。</p></div><div class="radar-panel">${paper('f3','计算架构的分工与取舍')}<p class="figure-note">五维评分用于概念比较。具体工作负载需采用统一口径实测。</p></div></div>`,
    },
    {
      chapter: 3, section: '在信息产业中的作用', en: 'STRATEGIC VALUE', title: '异构算力布局，推动 FPGA 进入战略资源组合', short: '并购与异构算力布局',
      subtitle: '两次代表性并购反映企业对可编程硬件、IP 与工程生态的长期投入。', duration: 55,
      citation: '[S3-02] AMD 2022 Form 10-K（总收购对价 $48.8B）. [S3-01] Intel Form 8-K, 2015（Altera 交易金额约 $16.7B）. [S5-08] Hennessy & Patterson, CACM, 2019.',
      body: `<div class="two-column"><div><div class="deal"><span class="deal-year">2022</span><div><h3>AMD × Xilinx</h3><div class="big-number">48.8<span>十亿美元</span></div></div></div><div class="deal deal-small"><span class="deal-year">2015</span><div><h3>Intel × Altera</h3><div class="big-number">16.7<span>十亿美元</span></div></div></div><p class="deal-caption">历史交易金额，不同交易的报价时点和会计口径存在差异。<br>产业价值来自器件、工具链、IP 与应用能力的组合。</p></div><div class="stack">${paper(19,'通用处理器性能增长放缓 · CACM 原文图','grow')}<div class="callout">CPU 控制 + GPU 吞吐 + FPGA 定制数据流<br><span class="muted" style="font-size:17px">协同满足数据中心与边缘系统的不同需求</span></div></div></div>`,
    },
    {
      chapter: 3, section: '在信息产业中的作用', en: 'APPLICATION LANDSCAPE', title: 'FPGA 将可配置电路用于产业数据通路', short: '信息产业应用全景',
      subtitle: '可重构接口、并行流水线与原型验证能力，将器件特性转化为系统价值。', duration: 60,
      citation: '[S3-08] Lockwood et al., IEEE Hot Interconnects, 2012, Fig. 7（156 MHz，OUCH 字段提取）. [S3-07] Zhang et al., ACM/SIGDA FPGA, 2015. 具体实时性与可靠性须由系统设计验证。',
      body: `<div class="two-column"><div class="application-grid"><div class="application"><div class="app-symbol">COMMUNICATION</div><h3>通信前传与基带处理</h3><p>高速接口与协议适配<br><b>波束赋形 / 信号预处理</b></p></div><div class="application"><div class="app-symbol">LOW-LATENCY SYSTEMS</div><h3>金融网络与测控</h3><p>OUCH 报文字段提取 <b class="highlight">6.4 ns</b><br>156 MHz · 单级寄存器</p></div><div class="application"><div class="app-symbol">SENSING & VISION</div><h3>工业与车载感知</h3><p>多路视频 / 传感数据融合<br><b>线速并行预处理</b></p></div><div class="application"><div class="app-symbol">CHIP PROTOTYPING</div><h3>芯片原型验证</h3><p>投片前功能与软硬件联调<br><b>缩短系统验证周期</b></p></div></div><div class="application-figure">${paper('f4','四类应用的约束与硬件响应')}${paper(17,'CNN 加速 · Roofline 分析的原始论文','compact')}</div></div>`,
    },
    {
      chapter: 3, section: '在信息产业中的作用', en: 'MEASURED AT CLOUD SCALE', title: '从搜索排序到实时 AI，生产系统给出定量检验', short: 'Catapult / Brainwave 实测',
      subtitle: '选择项目标签查看实验指标与对应论文。吞吐与时延结果均保留原始测试条件。', duration: 90,
      citation: '[R03] Putnam et al., ISCA, 2014. [S3-04] Caulfield et al., MICRO, 2016. [S3-06] Fowers et al., ISCA, 2018. Catapult 两项提升来自不同约束下的实验。',
      body: `<div class="case-tabs"><button class="selected" data-case-target="catapult">CATAPULT <small>搜索排序 · ISCA 2014</small></button><button data-case-target="smartnic">SMARTNIC <small>云规模加速 · MICRO 2016</small></button><button data-case-target="brainwave">BRAINWAVE <small>实时推理 · ISCA 2018</small></button></div><div class="case-content selected" data-case="catapult"><div class="case-layout"><div><div class="case-metrics">${stat('+95%','固定时延分布下<br>排序吞吐提升')}${stat('−29%','固定吞吐下<br>尾延迟下降')}</div><p class="case-lead"><b>1,632 台服务器</b>部署验证<br><span class="muted">每 48 台组成 6 × 8 FPGA 环网</span></p><div class="case-network" aria-hidden="true">${'<i></i>'.repeat(48)}</div><p class="fine">两个结果对应不同约束条件，分别测量。<br>硬件流水线与服务器软件共同完成搜索排序。</p></div><div class="case-evidence catapult-evidence">${paper(14,'Catapult 加速卡与 6 × 8 环网')}<button class="evidence-link" data-image="13">查阅 ISCA 2014 论文首页 ↗</button></div></div></div><div class="case-content" data-case="smartnic"><div class="case-layout"><div><span class="eyebrow">BUMP IN THE WIRE</span><div class="big-number highlight" style="margin-top:22px">40<span class="number-unit"> Gbps</span></div><p class="case-lead">FPGA 位于 NIC 与 ToR 交换机之间<br><span class="muted">网络、存储与计算的数据平面加速</span></p><div class="callout">同一 FPGA 可承载本地服务卸载，并通过网络参与分布式加速。</div><p class="fine" style="margin-top:22px">速率为论文所述部署架构的网络接口口径。</p></div><div class="case-evidence single">${paper(15,'MICRO 2016 · 云规模加速架构')}</div></div></div><div class="case-content" data-case="brainwave"><div class="case-layout"><div><div class="case-metrics">${stat('1.8','ResNet-50 图像特征提取<br>Arria 10 · Batch = 1',' ms')}${stat('35.9','DeepBench 大型 GRU 层<br>Stratix 10 · 无批处理',' TF')}</div><p class="case-lead">面向单请求响应优化的 NPU<br><span class="muted">存储复用与定制数据流协同设计</span></p><div class="callout" style="font-size:19px">1.8 ms 与 35.9 TFLOPS 来自不同器件及模型实验，分别报告。</div><p class="fine" style="margin-top:20px">数值精度采用论文所述低精度格式，不能等同于 FP32 峰值。</p></div><div class="case-evidence single">${paper(16,'ISCA 2018 · Brainwave 论文')}</div></div></div>`,
    },
    {
      chapter: 4, section: '面临的挑战', en: 'POWER & MEMORY LIMITS', title: '逻辑规模扩张，受供电、散热与数据搬运约束', short: '功耗墙与访存墙',
      subtitle: '后摩尔时代的性能增长，需要同时优化计算密度、数据局部性和器件活动率。', duration: 60,
      citation: '[S4-01] Esmaeilzadeh et al. Dark Silicon and the End of Multicore Scaling, ISCA, 2011（模型预测）. [S4-02] Horowitz, ISSCC, 2014, Fig. 1.1.9（能耗量级估计）。数值对应各自操作口径。',
      body: `<div class="split-wide"><div class="stack"><div class="energy-contrast"><div class="energy-block"><span class="eyebrow">32-BIT INTEGER ADD</span><div class="big-number" style="margin-top:20px">0.1<span class="number-unit"> pJ</span></div><p>32-bit 整数加法<br>Horowitz 能耗示例</p></div><div class="energy-block"><span class="eyebrow">DRAM ACCESS</span><div class="big-number" style="margin-top:20px">1.3–2.6</div><p>nJ / 片外 DRAM 访问<br>45 nm · 0.9 V 量级估计</p></div></div><div class="callout">存储访问能耗可高出算术运算多个数量级，数据复用决定能效。</div><div><h3 class="rule-heading">暗硅 · 同时活动面积受限</h3><div class="dark-silicon" aria-label="活动面积受限的示意">${'<i></i>'.repeat(10)}</div><p class="fine" style="margin-top:15px">2011 年模型预测 8 nm 节点可能约半数面积无法同时活动。该结论依赖缩放与功耗假设。</p></div></div><div class="stack">${paper('f5','功耗、带宽与工程约束','grow')}<p class="fine">暗硅比例与漏电占比随器件、工艺和工作负载变化。 <button class="evidence-link" data-ref="S4-02">查看 ISSCC 来源 ↗</button></p></div></div>`,
    },
    {
      chapter: 4, section: '面临的挑战', en: 'THE FPGA CAD BARRIER', title: '器件可编程性，必须由可收敛的工具链兑现', short: 'EDA 与生态壁垒',
      subtitle: '综合、布局、布线与时序分析相互耦合，芯片资源数量不能直接等同于可用设计规模。', duration: 60,
      citation: '[S4-04] Bacon et al. FPGA Programming for the Masses. CACM, 2013. Murray et al. VTR 8: High-Performance CAD…, ACM TRETS, 2020. 算法难度与设计收敛时间依赖具体问题及实例。',
      body: `<div class="challenge-flow"><div class="flow-column"><span class="flow-en">01 / SYNTHESIS</span><h3>逻辑综合与映射</h3><p>布尔优化与资源推断<br>共享、复制与流水化<br>面积和性能联合折中</p></div><div class="flow-column"><span class="flow-en">02 / PLACEMENT</span><h3>时序驱动布局</h3><p>逻辑 / DSP / BRAM 分布<br>跨区域连接代价<br>组合优化与启发式搜索</p></div><div class="flow-column"><span class="flow-en">03 / ROUTING</span><h3>拥塞驱动布线</h3><p>有限开关与通道容量<br>线长、拥塞与延迟耦合<br>反复迭代寻求可行解</p></div><div class="flow-column"><span class="flow-en">04 / SIGN-OFF</span><h3>约束与时序收敛</h3><p>建立 / 保持时间检查<br>时钟与跨时钟域约束<br>大规模工程验证</p></div></div><div class="timing-formula"><strong>QoR = f (architecture, CAD, constraints)</strong><span>设计质量取决于架构、算法与约束协同</span></div><div style="display:flex;justify-content:space-between;margin-top:26px;align-items:center"><p class="note">核心 IP、器件数据库与长期用户反馈，共同形成工具生态。</p><button class="evidence-link" data-image="f5">查看挑战模型 ↗</button></div>`,
    },
    {
      chapter: 4, section: '面临的挑战', en: 'CHINA’S SYSTEM-LEVEL CHALLENGE', title: '中国高端化，需要设计、制造与应用生态共同突破', short: '供应链与中国高端化',
      subtitle: '以历史政策与公司披露观察供应链约束，按器件、接口与工具能力识别技术差距。', duration: 55,
      citation: '[S4-06] BIS, 87 FR 62186, 2022（历史规则示例，适用范围依具体分类、参数及最终用途判定）. [S4-07] 复旦微电 2023 年年度报告. 产业材料对应所引资料年份。',
      body: `<div class="risk-policy"><div><div class="big-number">2022</div><span class="fine">历史规则样本</span></div><p><b>出口管制与先进制造获取条件变化</b><br><span class="muted">器件、设计软件、制造设备与最终用途，分别具有合规分类和技术条件。</span></p></div><div class="risk-chain"><div class="risk-node"><span>DESIGN</span><h3>架构与高速 IP</h3><p>高速 SerDes、时钟网络<br>大规模片上存储<br>硬核 IP 的可靠集成</p></div><div class="risk-node"><span>MANUFACTURING</span><h3>制造与封装</h3><p>先进制程获取与良率<br>高带宽互连与 HBM<br>测试与可靠性验证</p></div><div class="risk-node"><span>SOFTWARE</span><h3>EDA 与 IP 生态</h3><p>大设计的时序收敛<br>可迁移的接口与 IP 库<br>工具稳定性与文档</p></div><div class="risk-node"><span>APPLICATION</span><h3>场景与工程反馈</h3><p>真实负载持续验证<br>板卡、系统与软件协同<br>规模应用形成反馈</p></div></div><div class="risk-priorities"><span>资源规模<br><b class="highlight">可用逻辑与存储</b></span><span>系统带宽<br><b class="highlight">接口 / NoC / 外存</b></span><span>设计质量<br><b class="highlight">频率 / 功耗 / 收敛</b></span><span>工程能力<br><b class="highlight">良率 / 可靠性 / 生态</b></span></div>`,
    },
    {
      chapter: 5, section: '未来发展趋势', en: 'ADAPTIVE COMPUTE PLATFORMS', title: '异构平台将可编程逻辑融入片上计算系统', short: 'ACAP 异构平台',
      subtitle: '标量引擎、自适应逻辑与 AI 阵列，通过硬核片上网络协同处理数据流。', duration: 60,
      citation: '[S5-01] Gaide B, Gaitonde D, Ravishankar C, et al. Xilinx Adaptive Compute Acceleration Platform: Versal Architecture. ACM/SIGDA FPGA, 2019: 84–93. 具体引擎数量与型号有关。',
      body: `<div class="two-column"><div class="acap-system"><div class="acap-chip-title">VERSAL / ADAPTIVE SOC · 架构示意</div><div class="engine-row"><div class="engine"><h3>标量引擎</h3><p>ARM 处理系统<br>系统控制与任务调度</p></div><div class="engine"><h3>自适应引擎</h3><p>可编程逻辑 / DSP / BRAM<br>接口适配与定制数据流</p></div><div class="engine wide"><div><h3>智能引擎</h3><p>VLIW / SIMD 阵列</p></div><div class="aie-array">${'<i></i>'.repeat(60)}</div></div></div><div class="noc-bus">HARD NETWORK-ON-CHIP</div><div class="memory-row"><span>DDR / MEMORY</span><span>HIGH-SPEED I/O</span><span>PCIe</span></div></div><div class="trend-text stack"><div><span class="eyebrow">REPRESENTATIVE GENERATION</span><div class="big-number" style="margin:20px 0 8px">7<span class="number-unit"> nm</span></div><p class="metric-title">2019 年 Versal 架构论文</p></div>${point('01','按计算粒度分工','CPU 负责控制，AI 引擎执行密集运算，可编程逻辑处理定制数据通路。')}${point('02','NoC 提升互连可预测性','以硬核网络组织跨区域数据传输，减少部分通用布线负担。')}<div class="callout">可编程性从逻辑门级扩展到片上系统的数据流组织。</div><button class="evidence-link" data-image="f6">未来演化技术全景 ↗</button></div></div>`,
    },
    {
      chapter: 5, section: '未来发展趋势', en: 'CHIPLETS & EMBEDDED FPGA', title: '先进封装与 eFPGA，扩展可重构硬件的边界', short: 'Chiplet 与 eFPGA',
      subtitle: '以芯粒互连组织计算、接口和存储，并将可编程逻辑作为 SoC 的可集成模块。', duration: 60,
      citation: '[S5-03] Mahajan et al. Embedded Multi-die Interconnect Bridge (EMIB), IEEE ECTC, 2016. [S5-04] Tang et al. OpenFPGA, IEEE Micro, 2020, 40(4): 41–48. 封装图为结构示意。',
      body: `<div class="two-column"><div><div class="packaging"><div class="pack-diagram-label">异构芯粒 + 高密度封装互连<br><span class="muted">逻辑与 I/O 可选择不同工艺</span></div><div class="interposer"><div class="hbm-die hbm-left">HBM</div><div class="logic-die">FPGA CORE</div><div class="hbm-die hbm-right">I/O</div></div><p class="pack-label">2.5D 封装 / 桥接互连 · 原理示意，未按比例绘制</p></div><div class="callout" style="margin-top:27px">提高封装内带宽与集成灵活性，同时引入互连、散热与测试挑战。</div></div><div class="stack">${point('01','Chiplet / EMIB','将计算核心、高速接口与存储拆分为芯粒，通过封装互连协同。')}${point('02','eFPGA 嵌入式可编程逻辑','在专用 SoC 内集成可重构模块，保留协议适配与出厂后修改能力。')}<div class="efpga-strip">${paper(20,'OpenFPGA · IEEE Micro 原文','compact')}<p><b>可定制架构 → 可生成设计</b><br><span class="muted">开源框架支持可编程阵列的<br>架构探索与设计生成。</span></p></div><p class="fine">先进封装的收益依赖芯粒划分、封装工艺、互连能耗与系统设计。</p></div></div>`,
    },
    {
      chapter: 5, section: '未来发展趋势', en: 'OPEN TOOLS & DOMAIN-SPECIFIC DESIGN', title: '开放工具与领域专用架构，推动软硬件协同创新', short: '开源 EDA 与 DSA',
      subtitle: '开源流程降低研究与定制门槛，面向场景的架构优化仍需工程验证。', duration: 60,
      citation: '[S5-06] Shah et al. Yosys + nextpnr: An Open Source Framework…, FCCM, 2019. [S5-08] Hennessy J L, Patterson D A. A New Golden Age for Computer Architecture. CACM, 2019, 62(2): 48–60.',
      body: `<div class="two-column"><div class="stack"><div><span class="eyebrow">OPEN SOURCE FLOW</span><div class="open-flow"><span>RTL</span><span>Yosys</span><span>nextpnr</span><span>Bitstream</span></div><p class="fine">完整支持范围依目标器件、数据库和比特流后端而定。</p></div><div class="callout">中国 FPGA 的升级，需要器件、工具、IP 与应用反馈形成协同。</div></div><div class="route-figure">${paper('f6','技术路线与工程权衡')}<button class="evidence-link" data-image="18">Hennessy 与 Patterson 的架构综述 ↗</button></div></div>`,
    },
    {
      chapter: 6, section: '结论', en: 'A RECONFIGURABLE FOUNDATION', title: '信息产业基石的可重构维度', short: '五维结论', dark: true, duration: 60,
      subtitle: '以 FPGA 为样本，连接集成电路的物理实现、系统能力与产业演进。',
      citation: '核心证据回溯 · Trimberger, 2015 / Kuon & Rose, 2007 / Putnam et al., 2014 / Fowers et al., 2018 / Hennessy & Patterson, 2019.',
      body: `<img class="conclusion-brand" src="assets/brand/scnu_logo_transparent.png" alt=""><h2 class="conclusion-title">集成电路提供物理承载<br><em>FPGA 提供出厂后的硬件适应能力</em></h2><div class="conclusion-grid">${[['01','发展历程','从逻辑阵列走向<br>异构系统级平台'],['02','技术特点','以面积与功耗开销<br>换取可配置数据通路'],['03','产业作用','以产业实测检验<br>吞吐与时延收益'],['04','现实挑战','能耗、EDA 与供应链<br>共同约束系统能力'],['05','未来趋势','异构、芯粒与开放工具<br>支持场景驱动创新']].map(x=>`<div class="conclusion-item"><div class="chapter-id">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div>`,
    },
    {
      chapter: 6, section: '参考文献', en: 'SELECTED REFERENCES', title: '主要参考文献与原始证据索引', short: '参考文献与致谢',
      subtitle: '代表性论文与专利按 GB/T 7714 列示。数据手册、年报及其他来源可在文献库检索。', duration: 30,
      citation: '完整引文与来源信息见文献库 / 交付包《03_【文献证据库】引文表_34篇顶刊与专利.xlsx》。图表来源随对应条目列出。',
      body: `<div class="bibliography-layout"><div class="reference-list">${[
        ['1','TRIMBERGER S.','Three ages of FPGAs: A retrospective on the first thirty years of FPGA technology[J].','Proceedings of the IEEE, 2015, 103(3): 318–331.'],
        ['2','KUON I, ROSE J.','Measuring the gap between FPGAs and ASICs[J].','IEEE TCAD, 2007, 26(2): 203–215.'],
        ['3','PUTNAM A, et al.','A reconfigurable fabric for accelerating large-scale datacenter services[C]//ISCA.','2014: 13–24.'],
        ['4','CAULFIELD A M, et al.','A cloud-scale acceleration architecture[C]//MICRO.','2016: 1–13.'],
        ['5','FOWERS J, et al.','A configurable cloud-scale DNN processor for real-time AI[C]//ISCA.','2018: 1–14.'],
        ['6','BOUTROS A, BETZ V.','FPGA architecture: Principles and progression[J].','IEEE Circuits and Systems Magazine, 2021, 21(2): 4–29.'],
        ['7','HENNESSY J L, PATTERSON D A.','A new golden age for computer architecture[J].','Communications of the ACM, 2019, 62(2): 48–60.'],
        ['8','FREEMAN R H.','Configurable electrical circuit having configurable logic elements and configurable interconnects: US 4870302[P].','1989-09-26.'],
        ['9','TANG X, GIACOMIN E, CHAUVIERE B, et al.','OpenFPGA: An open-source framework for agile prototyping customizable FPGAs[J].','IEEE Micro, 2020, 40(4): 41–48.'],
        ['10','GAIDE B, et al.','Xilinx adaptive compute acceleration platform: Versal architecture[C]//FPGA.','2019: 84–93.'],
        ['11','KILBY J S.','Miniaturized electronic circuits: US 3138743[P].','1964-06-23.'],
        ['12','NOYCE R N.','Semiconductor device-and-lead structure: US 2981877[P].','1961-04-25.'],
      ].map(x=>`<div class="reference-item"><span class="ref-no">[${x[0]}]</span><div><b>${x[1]}</b> ${x[2]} ${x[3]}</div></div>`).join('')}</div><div class="bibliography-side"><span class="eyebrow">TRACEABLE SOURCES</span><div class="big-number" style="margin-top:21px">34</div><p>篇调研资料<br>期刊 · 会议 · 专利<br>政策 · 数据手册 · 年报</p><button class="primary-button" data-action="library">打开完整文献库 ↗</button><div class="thanks">感谢聆听<br>敬请批评指正<small>华南师范大学 电子与信息工程学院</small></div></div></div>`,
    },
  ];
  window.DECK_SLIDES = slides;
  window.DECK_EVIDENCE = evidence;
  window.DECK_FIGURES = figures;
  window.DECK_ESCAPE = esc;
  window.DECK_PAPER = paper;
})();
