(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const app = $("#app-shell");
  const mapArt = $("#map-art");
  const mapStage = $("#map-stage");
  const detailPanel = $("#detail-panel");
  const detailHandle = $("#detail-handle");
  const detailContent = $("#detail-content");
  const detailTitle = $("#detail-title");
  const detailEyebrow = $("#detail-eyebrow");
  const detailSubtitle = $("#detail-subtitle");
  const regionFilter = $("#region-filter");
  const timeViewFilter = $("#time-view-filter");
  const heatmapLayer = $("#heatmap-layer");
  const heatmapSummary = $("#heatmap-summary");
  const exportMenu = $("#export-menu");
  const exportTrigger = $("#export-trigger");
  const layerMenu = $("#layer-menu");
  const layerTrigger = $("#layer-trigger");
  const activityMenu = $("#activity-menu");
  const activityTrigger = $("#activity-trigger");
  const activityList = $("#activity-list");
  const activityModal = $("#activity-modal");
  const activityDialogTitle = $("#activity-dialog-title");
  const activityDialogContent = $("#activity-dialog-content");
  const toast = $("#toast");
  const printReport = $("#print-report");

  const regions = {
    all: { name: "高新区", box: [0, 0, 1600, 900], registered: "4,286", active: "3,108", risk: "6", providers: "28" },
    "桂溪街道": { box: [520, 40, 720, 405], registered: "1,567", active: "1,218", risk: "3", providers: "11" },
    "肖家河街道": { box: [60, 25, 700, 393.75], registered: "892", active: "641", risk: "1", providers: "6" },
    "中和街道": { box: [900, 90, 650, 365.625], registered: "734", active: "542", risk: "1", providers: "5" },
    "石羊街道": { box: [60, 330, 720, 405], registered: "681", active: "487", risk: "1", providers: "6" }
  };
  const names = {
    niangao: ["年糕", "PD-CD-240018", "ED-510109-0188", "2 岁", "母", "比熊", "1 分钟前", "活跃定位", "138******09", "无", "🐶"],
    taozi: ["桃子", "PD-CD-240026", "ED-510109-0261", "4 岁", "公", "柴犬", "9 分钟前", "较久未更新", "186******42", "无", "🐕"],
    doubao: ["豆包", "PD-CD-240031", "ED-510109-0315", "3 岁", "公", "柯基", "2 分钟前", "活跃定位", "159******18", "闯入禁入区域", "🐕"],
    kele: ["可乐", "PD-CD-240044", "ED-510109-0447", "6 岁", "母", "金毛", "18 分钟前", "定位失效", "133******76", "无", "🐶"],
    moka: ["摩卡", "PD-CD-240052", "ED-510109-0523", "1 岁", "公", "贵宾", "3 分钟前", "活跃定位", "177******31", "无", "🐩"],
    tuanzi: ["团子", "PD-CD-240063", "ED-510109-0639", "5 岁", "母", "博美", "4 分钟前", "活跃定位", "181******56", "无", "🐕"],
    buding: ["布丁", "PD-CD-240071", "ED-510109-0712", "2 岁", "母", "拉布拉多", "12 分钟前", "较久未更新", "136******25", "无", "🐶"],
    nuomi: ["糯米", "PD-CD-240084", "ED-510109-0840", "3 岁", "公", "雪纳瑞", "1 分钟前", "活跃定位", "139******82", "无", "🐕"],
    beibei: ["贝贝", "PD-CD-240097", "ED-510109-0971", "7 岁", "母", "中华田园犬", "5 分钟前", "活跃定位", "189******14", "无", "🐶"],
    xueqiu: ["雪球", "PD-CD-240108", "ED-510109-1086", "4 岁", "公", "萨摩耶", "22 分钟前", "定位失效", "152******63", "无", "🐕"],
    wangcai: ["旺财", "PD-CD-240116", "ED-510109-1164", "5 岁", "公", "中华田园犬", "2 分钟前", "活跃定位", "135******90", "无", "🐶"],
    naigai: ["奶盖", "PD-CD-240129", "ED-510109-1293", "2 岁", "母", "边牧", "1 分钟前", "活跃定位", "178******47", "闯入禁入区域", "🐕"],
    qixi: ["七喜", "PD-CD-240137", "ED-510109-1378", "6 岁", "公", "法斗", "8 分钟前", "较久未更新", "158******36", "无", "🐶"],
    doufu: ["豆乳", "PD-CD-240145", "ED-510109-1452", "1 岁", "母", "比格", "3 分钟前", "活跃定位", "137******71", "无", "🐕"]
  };
  const activities = {
    walk: { name: "周末文明遛犬课堂", status: "报名中", statusClass: "open", time: "7 月 18 日 10:00–11:30", place: "锦城湖东区草坪", description: "面向犬主讲解牵引绳规范、公共区域礼仪、犬只应激识别和突发情况处理，并安排现场示范与问答。", notice: "建议提前 15 分钟到场；携犬参加需佩戴狗牌、使用牵引绳并自备清洁用品。" },
    clinic: { name: "夏季宠物义诊与疫苗咨询", status: "进行中", statusClass: "live", time: "7 月 13 日 14:00–17:00", place: "康桥宠物医院锦城店", description: "提供基础健康问诊、疫苗接种周期咨询、夏季常见疾病预防讲解和体况初步评估。", notice: "义诊不替代正式诊断；如犬只存在明显不适，请直接进入医院诊疗流程。" },
    care: { name: "宠物基础护理公开课", status: "报名中", statusClass: "open", time: "7 月 20 日 15:00–16:30", place: "爪爪护理中心中和店", description: "由护理人员演示梳毛、清洁、指甲修剪和耳部日常检查方法，帮助犬主建立基础护理习惯。", notice: "现场席位有限，携犬参与需提前预约；攻击性或明显应激犬只不建议进入课堂。" },
    campaign: { name: "文明养犬宣传日", status: "已结束", statusClass: "done", time: "7 月 6 日 09:30–11:30", place: "交子公园北广场", description: "围绕依法登记、佩戴狗牌、牵绳出行和便溺清理开展现场宣传与咨询。", notice: "活动资料可在后续文明养犬主题活动中继续领取。" },
    market: { name: "宠物友好生活市集", status: "即将开始", statusClass: "soon", time: "7 月 27 日 10:00–18:00", place: "高新南区城市广场", description: "集合宠物用品展示、基础护理体验、文明养犬互动和犬主交流区域的开放式主题市集。", notice: "人流较大，请根据犬只状态决定是否携犬入场，并始终使用牵引绳。" }
  };
  const heatmapProfiles = {
    all: { period: "最近 7 天 · 全部时段", peak: "桂溪街道", finding: "与锦城湖周边为全天遛狗高峰区", points: [[770,330,170,.92],[870,560,150,.82],[1220,330,132,.68],[410,570,120,.58],[1090,675,108,.48]] },
    morning: { period: "最近 7 天 · 早间 06:00–10:00", peak: "桂溪街道", finding: "天府大道西侧为早间遛狗高峰区", points: [[720,305,158,.94],[920,350,126,.76],[1260,330,110,.62],[380,565,94,.45]] },
    noon: { period: "最近 7 天 · 午间 10:00–14:00", peak: "锦城湖周边", finding: "为午间遛狗高峰区", points: [[835,555,144,.91],[1010,470,110,.68],[510,440,92,.48],[1230,560,80,.38]] },
    afternoon: { period: "最近 7 天 · 下午 14:00–18:00", peak: "石羊街道", finding: "北部居住片区为下午遛狗高峰区", points: [[445,590,152,.9],[720,610,122,.7],[1040,600,106,.56],[1320,390,88,.4]] },
    evening: { period: "最近 7 天 · 晚间 18:00–22:00", peak: "桂溪街道", finding: "与锦城湖沿线为晚间遛狗最高峰区", points: [[820,420,190,1],[920,580,164,.9],[1220,350,132,.72],[430,570,120,.62],[1090,700,108,.5]] },
    night: { period: "最近 7 天 · 深夜 22:00–次日 06:00", peak: "中和街道", finding: "中部生活区为深夜相对高峰区", points: [[1230,365,128,.88],[1040,430,104,.68],[760,300,90,.48],[470,590,72,.32]] }
  };
  const state = { box: [...regions.all.box], region: "all", timeView: "realtime", layers: { dog: true, provider: true, friendly: true, restricted: true } };
  const formatTime = () => `2026-07-13 ${new Date().toTimeString().slice(0, 5)}`;
  const icon = name => `<svg class="icon"><use href="#i-${name}"/></svg>`;

  function setHeader(eyebrow, title, subtitle) {
    detailEyebrow.textContent = eyebrow;
    detailTitle.textContent = title;
    detailSubtitle.textContent = subtitle;
  }
  function updateTime() { return `<div class="detail-time"><span>${icon("clock")}数据更新时间</span><strong>${formatTime()}</strong></div>`; }
  function openDetail() {
    app.classList.add("detail-open");
    detailPanel.setAttribute("aria-hidden", "false");
    detailHandle.setAttribute("aria-expanded", "true");
    detailTitle.focus({ preventScroll: true });
  }
  function closeDetail() {
    app.classList.remove("detail-open");
    detailPanel.setAttribute("aria-hidden", "true");
    detailHandle.setAttribute("aria-expanded", "false");
    $$(".map-object.is-selected").forEach(item => item.classList.remove("is-selected"));
  }
  function showRegion() {
    const data = regions[state.region];
    const name = state.region === "all" ? "高新区" : state.region;
    setHeader("区域总览", name, `${name} · 当前筛选口径`);
    detailContent.innerHTML = `<section class="detail-section"><h3 class="section-title">区域指标</h3><div class="metric-grid">
      <div class="metric"><span>在册犬只数</span><strong>${data.registered}<small>只</small></strong></div>
      <div class="metric"><span>活跃犬只数</span><strong>${data.active}<small>只</small></strong></div>
      <div class="metric risk"><span>高风险事件</span><strong>${data.risk}<small>起</small></strong></div>
      <div class="metric"><span>服务商</span><strong>${data.providers}<small>家</small></strong></div></div></section>
      <section class="detail-section"><h3 class="section-title">当前地图口径</h3><dl class="detail-list">
      <div class="detail-row"><dt>犬只定位</dt><dd>仅电子狗牌</dd></div>
      <div class="detail-row"><dt>地图展示方式</dt><dd>${state.timeView === "realtime" ? "实时单犬点位" : "遛狗高峰热力图"}</dd></div>
      <div class="detail-row"><dt>时间视图</dt><dd>${timeViewFilter.options[timeViewFilter.selectedIndex].text}</dd></div></dl>${updateTime()}</section>`;
    openDetail();
  }
  function showDog(key, node) {
    const dog = names[key] || names.niangao;
    $$(".map-object.is-selected").forEach(item => item.classList.remove("is-selected"));
    node?.classList.add("is-selected");
    setHeader("犬只详情", dog[0], "电子狗牌实时定位");
    const risk = dog[9] !== "无";
    const statusClass = dog[7] === "活跃定位" ? "green" : dog[7] === "定位失效" ? "gray" : "yellow";
    detailContent.innerHTML = `<section class="detail-section"><div class="dog-identity"><div class="dog-avatar">${dog[10]}</div><div><h3>${dog[0]}</h3><p>电子狗牌犬只</p></div></div><dl class="detail-list">
      <div class="detail-row"><dt>犬只 ID · 狗牌编号</dt><dd>${dog[1]} · ${dog[2]}</dd></div>
      <div class="detail-row three"><dt>年龄 · 性别 · 品种</dt><dd><span>${dog[3]}</span><span>${dog[4]}</span><span>${dog[5]}</span></dd></div>
      <div class="detail-row"><dt>狗牌类型</dt><dd><span class="tag purple">⚡ 电子狗牌</span></dd></div>
      <div class="detail-row"><dt>最后上报 · 定位状态</dt><dd>${dog[6]}<br><span class="tag ${statusClass}">${dog[7]}</span></dd></div>
      <div class="detail-row"><dt>犬主脱敏手机号</dt><dd>${dog[8]}</dd></div>
      <div class="detail-row"><dt>高风险行为</dt><dd class="${risk ? "risk-text" : ""}">${dog[9]}</dd></div>
      <div class="detail-row"><dt>数据更新时间</dt><dd class="subtle">${formatTime()}</dd></div></dl></section>`;
    openDetail();
  }
  function showObject(type) {
    const contents = {
      provider: ["服务商详情", "康桥宠物医院（锦城店）", "服务商点位", [["服务商类型", "宠物医院"], ["所属街道 · 社区", "桂溪街道 · 锦城社区"], ["服务状态", "优质"], ["服务地址摘要", "锦城大道东段"], ["1 公里内犬只数量", "216 只"], ["1 公里内活跃犬只", "178 只"]]],
      friendly: ["友好乐园详情", "锦城湖宠物友好乐园", "宠物友好区域", [["所属街道 · 社区", "桂溪街道 · 交子公园社区"], ["区域内 / 周边犬只", "42 / 286 只"], ["活跃定位犬只", "231 只"], ["附近服务商数量", "7 家"]]],
      restricted: ["禁入区域详情", "锦晖小学禁入区域", "犬只禁入区域", [["区域类型", "学校"], ["所属街道 · 社区", "桂溪街道 · 锦城社区"], ["当前区域内犬只", "2 只"], ["当前接近区域犬只", "5 只"]]]
    }[type];
    setHeader(contents[0], contents[1], contents[2]);
    detailContent.innerHTML = `<section class="detail-section"><dl class="detail-list">${contents[3].map(([a,b]) => `<div class="detail-row"><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>${updateTime()}</section>`;
    openDetail();
  }
  function showAI() {
    setHeader("AI 辅助决策", "高新区犬只治理分析", "基于当前地图筛选状态");
    const hourLabels = Array.from({length:24}, (_,hour) => `<span>${[0,6,12,18].includes(hour) ? hour : ""}</span>`).join("");
    const heatRows = ["周一","周二","周三","周四","周五","周六","周日"].map((day,dayIndex) => {
      const cells = Array.from({length:24}, (_,hour) => {
        const peak = (hour >= 7 && hour <= 9 ? 2 : 0) + (hour >= 18 && hour <= 21 ? 3 : 0);
        const level = Math.min(4, (dayIndex * 2 + hour + peak) % 3 + peak);
        return `<i style="--level:${level}" title="${day} ${hour}:00 活跃等级 ${level}"></i>`;
      }).join("");
      return `<div class="heatmap-row"><span>${day.slice(1)}</span>${cells}</div>`;
    }).join("");
    const bars = [["00–04",18],["04–08",42],["08–12",67],["12–16",38],["16–20",92],["20–24",71]].map(([label,value]) => `<div class="bar-column"><strong>${value}</strong><i style="--height:${value}%"></i><span>${label}</span></div>`).join("");
    const risks = [1,3,2,5,4,6,3];
    const points = risks.map((value,index) => `${18 + index * 48},${96 - value * 12}`).join(" ");
    const dots = risks.map((value,index) => `<circle class="line-dot" cx="${18 + index * 48}" cy="${96 - value * 12}" r="3"/>`).join("");
    const labels = ["7/7","7/8","7/9","7/10","7/11","7/12","7/13"].map((label,index) => `<text class="line-label" x="${18 + index * 48}" y="118">${label}</text>`).join("");
    detailContent.innerHTML = `<section class="detail-section"><div class="ai-callout"><span>${icon("spark")}重点结论</span><p>当前电子狗牌犬只点位主要集中在桂溪街道；锦晖小学禁入区域内检测到 2 只犬只，建议优先核查犬只状态并关注持续停留情况。</p></div></section>
      <section class="detail-section"><h3 class="section-title">时段与风险分析</h3>
        <div class="ai-chart"><div class="ai-chart-head"><strong>犬只活跃时段热力图</strong><span>最近 7 天 · 星期 × 小时</span></div><div class="heatmap-hours">${hourLabels}</div>${heatRows}<div class="chart-legend"><span>低</span><i style="--alpha:.16"></i><i style="--alpha:.34"></i><i style="--alpha:.52"></i><i style="--alpha:.76"></i><span>高</span></div></div>
        <div class="ai-chart"><div class="ai-chart-head"><strong>今日遛狗时间段</strong><span>活跃犬只数量</span></div><div class="bar-chart">${bars}</div></div>
        <div class="ai-chart"><div class="ai-chart-head"><strong>风险事件趋势</strong><span>最近 7 天 · 闯入禁入区域</span></div><svg class="line-chart" viewBox="0 0 330 126" role="img" aria-label="最近七天风险事件趋势折线图"><path class="line-grid" d="M18 24H306M18 48H306M18 72H306M18 96H306"/><polygon class="line-area" points="18,96 ${points} 306,96"/><polyline class="line-path" points="${points}"/>${dots}${labels}</svg></div>
        ${updateTime()}<p class="detail-time">AI 仅提供辅助判断，不自动执行处置。</p></section>`;
    openDetail();
  }
  function renderActivities() {
    activityList.innerHTML = Object.entries(activities).map(([key,item]) => `<article class="activity-item"><div class="activity-item-main"><div class="activity-item-title"><strong title="${item.name}">${item.name}</strong><span class="activity-status ${item.statusClass}">${item.status}</span></div><div class="activity-meta"><span title="${item.time}">${icon("clock")}${item.time}</span><span title="${item.place}">地点：${item.place}</span></div></div><button type="button" class="text-button" data-activity-detail="${key}" aria-label="查看${item.name}详情">查看详情</button></article>`).join("");
  }
  function showActivity(key) {
    const item = activities[key];
    if (!item) return;
    activityDialogTitle.textContent = item.name;
    activityDialogContent.innerHTML = `<div class="activity-detail-grid"><div class="activity-detail-cell"><span>活动状态</span><strong><span class="activity-status ${item.statusClass}">${item.status}</span></strong></div><div class="activity-detail-cell"><span>活动时间</span><strong>${item.time}</strong></div><div class="activity-detail-cell" style="grid-column:1/-1"><span>举办地点</span><strong>${item.place}</strong></div></div><div class="activity-description"><h3>活动说明</h3><p>${item.description}</p></div><div class="activity-description"><h3>参与提示</h3><p>${item.notice}</p></div>`;
    activityModal.hidden = false;
    activityMenu.hidden = true;
    activityTrigger.setAttribute("aria-expanded", "false");
    $(".activity-dialog [data-action='close-activity']", activityModal)?.focus();
  }
  function closeActivity() { activityModal.hidden = true; }
  function visibleDogs() { return state.timeView === "realtime" ? $$(".dog-object").filter(node => node.style.display !== "none" && state.layers.dog).length : 0; }
  function renderHeatmap() {
    if (state.timeView === "realtime") return;
    const profile = heatmapProfiles[state.timeView];
    heatmapLayer.innerHTML = profile.points.map(([x,y,r,opacity]) => `<g class="heat-spot" transform="translate(${x} ${y})" opacity="${opacity}"><circle class="heat-halo" r="${r}"/><circle class="heat-core" r="${Math.round(r * .62)}"/></g>`).join("");
    $("#heatmap-period").textContent = profile.period;
    $("#heatmap-peak").textContent = profile.peak;
    $("#heatmap-finding").textContent = profile.finding;
  }
  function applyFilters() {
    const realtime = state.timeView === "realtime";
    $$(".dog-object").forEach(node => node.style.display = state.layers.dog && realtime ? "" : "none");
    if (!realtime) renderHeatmap();
    heatmapLayer.toggleAttribute("hidden", realtime || !state.layers.dog);
    heatmapSummary.hidden = realtime || !state.layers.dog;
    Object.entries(state.layers).forEach(([layer, on]) => {
      $$(`[data-layer-group="${layer}"]`).forEach(node => { if (layer !== "dog") node.style.display = on ? "" : "none"; });
      $$(`[data-legend="${layer}"]`).forEach(node => node.classList.toggle("is-off", !on));
    });
    $("#freshness-key").hidden = !realtime;
    $("#map-heat-key").hidden = realtime;
    $("#dog-legend-mark").classList.toggle("heat", !realtime);
    $("#dog-legend-mark").textContent = realtime ? "犬" : "";
    $("#dog-legend-text").textContent = realtime ? "头像 / ⚡电子狗牌" : "遛狗热力密度";
    $("#visible-summary").textContent = !state.layers.dog ? "犬只图层已关闭" : realtime ? `${visibleDogs()} 个犬只点位` : "最近 7 天热力分布";
    $("#ai-summary-text").textContent = realtime ? "犬只点位主要集中在桂溪街道，锦晖小学禁入区域检测到 2 只闯入犬只，建议优先核查风险犬只状态。" : `${heatmapProfiles[state.timeView].period.replace("最近 7 天 · ", "")}，${heatmapProfiles[state.timeView].peak}${heatmapProfiles[state.timeView].finding}，建议结合服务设施覆盖情况关注高峰承载。`;
  }
  function setViewBox(box) {
    state.box = clampBox(box.map(Number));
    mapArt.setAttribute("viewBox", state.box.join(" "));
    const scale = state.box[2] / 1600;
    $$("[data-scale-lock]").forEach(node => {
      if (!node.dataset.baseTransform) node.dataset.baseTransform = node.getAttribute("transform") || "";
      const match = node.dataset.baseTransform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
      if (match) node.setAttribute("transform", `translate(${match[1]} ${match[2]}) scale(${scale})`);
    });
  }
  function clampBox(box) {
    const width = Math.min(1600, Math.max(360, box[2]));
    const height = width * 9 / 16;
    return [Math.max(0, Math.min(1600 - width, box[0])), Math.max(0, Math.min(900 - height, box[1])), width, height];
  }
  function zoom(factor) {
    const [x,y,w,h] = state.box, nw = Math.min(1600, Math.max(360, w * factor)), nh = nw * 9 / 16;
    setViewBox(clampBox([x + (w - nw) / 2, y + (h - nh) / 2, nw, nh]));
  }
  function zoomAtPointer(event) {
    event.preventDefault();
    const rect = mapArt.getBoundingClientRect();
    const [x,y,w,h] = state.box;
    const ratioX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const ratioY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const factor = event.deltaY < 0 ? .86 : 1.16;
    const nw = Math.min(1600, Math.max(360, w * factor));
    const nh = nw * 9 / 16;
    const anchorX = x + ratioX * w;
    const anchorY = y + ratioY * h;
    setViewBox(clampBox([anchorX - ratioX * nw, anchorY - ratioY * nh, nw, nh]));
  }
  function notify(message) { $("span", toast).textContent = message; toast.hidden = false; clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.hidden = true, 2400); }
  function reset() {
    state.region = "all"; state.timeView = "realtime"; Object.keys(state.layers).forEach(key => state.layers[key] = true);
    regionFilter.value = "all"; timeViewFilter.value = "realtime";
    $$(".layer-chip").forEach(chip => { chip.classList.add("is-on"); chip.setAttribute("aria-pressed", "true"); });
    setViewBox(regions.all.box); applyFilters(); closeDetail(); closeActivity(); layerMenu.hidden = true; layerTrigger.setAttribute("aria-expanded", "false"); activityMenu.hidden = true; activityTrigger.setAttribute("aria-expanded", "false"); notify("已恢复高新区全量电子狗牌犬只点位");
  }
  function exportPdf() {
    const layers = Object.entries(state.layers).filter(([,on]) => on).map(([key]) => ({dog:"犬只",provider:"服务商",friendly:"友好乐园",restricted:"禁入区域"})[key]).join("、") || "无";
    printReport.innerHTML = `<h1>高新区犬只治理决策快照</h1><p>生成时间：${formatTime()}　当前区域：${state.region === "all" ? "高新区" : state.region}</p><h2>当前地图状态</h2><p>图层：${layers}；时间视图：${timeViewFilter.options[timeViewFilter.selectedIndex].text}；${state.timeView === "realtime" ? "犬只定位来源：仅电子狗牌。" : "热力统计口径：最近 7 天相同时段汇总。"}</p><h2>当前区域摘要</h2><p>区域指标与对象信息以当前右侧详情为准。</p><h2>AI 辅助摘要</h2><p>${$("#ai-summary-text").textContent}</p><p class="print-note">本报告为演示数据生成的辅助决策快照。</p>`;
    window.print();
  }

  document.addEventListener("click", event => {
    if (state.suppressClick) { state.suppressClick = false; return; }
    const dog = event.target.closest("[data-dog]");
    if (dog) return showDog(dog.dataset.dog, dog);
    const object = event.target.closest("[data-detail]");
    if (object) return showObject(object.dataset.detail);
    const activityDetail = event.target.closest("[data-activity-detail]");
    if (activityDetail) return showActivity(activityDetail.dataset.activityDetail);
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "close-detail") closeDetail();
    if (action === "close-activity") closeActivity();
    if (action === "reset") reset();
    if (action === "ai") showAI();
    const chip = event.target.closest("[data-layer]");
    if (chip) { const key = chip.dataset.layer; state.layers[key] = !state.layers[key]; chip.classList.toggle("is-on", state.layers[key]); chip.setAttribute("aria-pressed", String(state.layers[key])); applyFilters(); }
    const control = event.target.closest("[data-map-control]")?.dataset.mapControl;
    if (control === "zoom-in") zoom(.72);
    if (control === "zoom-out") zoom(1.35);
    if (event.target.closest("#detail-handle")) showRegion();
    if (event.target.closest("#layer-trigger")) {
      layerMenu.hidden = !layerMenu.hidden;
      layerTrigger.setAttribute("aria-expanded", String(!layerMenu.hidden));
      activityMenu.hidden = true;
      activityTrigger.setAttribute("aria-expanded", "false");
      exportMenu.hidden = true;
      exportTrigger.setAttribute("aria-expanded", "false");
    } else if (!event.target.closest(".layer-menu-wrap")) {
      layerMenu.hidden = true;
      layerTrigger.setAttribute("aria-expanded", "false");
    }
    if (event.target.closest("#activity-trigger")) {
      activityMenu.hidden = !activityMenu.hidden;
      activityTrigger.setAttribute("aria-expanded", String(!activityMenu.hidden));
      layerMenu.hidden = true;
      layerTrigger.setAttribute("aria-expanded", "false");
      exportMenu.hidden = true;
      exportTrigger.setAttribute("aria-expanded", "false");
    } else if (!event.target.closest(".activity-wrap")) {
      activityMenu.hidden = true;
      activityTrigger.setAttribute("aria-expanded", "false");
    }
    if (event.target.closest("#export-trigger")) { exportMenu.hidden = !exportMenu.hidden; exportTrigger.setAttribute("aria-expanded", String(!exportMenu.hidden)); }
    const exportType = event.target.closest("[data-export]")?.dataset.export;
    if (exportType === "pdf") exportPdf();
    if (exportType === "image") notify("演示原型：地图图片已进入导出队列");
    if (exportType) { exportMenu.hidden = true; exportTrigger.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".map-object")) { event.preventDefault(); event.target.click(); }
    if (event.key === "Escape") { closeDetail(); closeActivity(); exportMenu.hidden = true; layerMenu.hidden = true; layerTrigger.setAttribute("aria-expanded", "false"); activityMenu.hidden = true; activityTrigger.setAttribute("aria-expanded", "false"); }
  });
  regionFilter.addEventListener("change", () => { state.region = regionFilter.value; setViewBox(regions[state.region].box); showRegion(); });
  timeViewFilter.addEventListener("change", () => {
    state.timeView = timeViewFilter.value;
    applyFilters();
    if (app.classList.contains("detail-open")) showRegion();
    notify(state.timeView === "realtime" ? "已切换至实时单犬位置" : `已切换至${timeViewFilter.options[timeViewFilter.selectedIndex].text}热力图`);
  });
  mapArt.addEventListener("wheel", zoomAtPointer, { passive: false });
  mapArt.addEventListener("pointerdown", event => {
    if (event.button !== 0) return;
    state.drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, origin: [...state.box], moved: false };
  });
  mapArt.addEventListener("pointermove", event => {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.drag.startX;
    const dy = event.clientY - state.drag.startY;
    if (!state.drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!state.drag.moved) {
      state.drag.moved = true;
      mapArt.setPointerCapture?.(event.pointerId);
      mapStage.classList.add("is-dragging");
    }
    const rect = mapArt.getBoundingClientRect();
    const [x,y,w,h] = state.drag.origin;
    setViewBox(clampBox([x - dx / rect.width * w, y - dy / rect.height * h, w, h]));
  });
  function endDrag(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) return;
    state.suppressClick = event.type === "pointerup" && state.drag.moved;
    state.drag = null;
    mapStage.classList.remove("is-dragging");
    if (mapArt.hasPointerCapture?.(event.pointerId)) mapArt.releasePointerCapture(event.pointerId);
  }
  mapArt.addEventListener("pointerup", endDrag);
  mapArt.addEventListener("pointercancel", endDrag);
  renderActivities(); setViewBox(regions.all.box); applyFilters();
}());
