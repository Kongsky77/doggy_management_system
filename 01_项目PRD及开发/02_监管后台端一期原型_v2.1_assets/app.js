(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const app = $("#app-shell");
  const mapArt = $("#map-art");
  const detailPanel = $("#detail-panel");
  const detailHandle = $("#detail-handle");
  const detailContent = $("#detail-content");
  const detailTitle = $("#detail-title");
  const detailEyebrow = $("#detail-eyebrow");
  const detailSubtitle = $("#detail-subtitle");
  const regionFilter = $("#region-filter");
  const freshnessFilter = $("#freshness-filter");
  const exportMenu = $("#export-menu");
  const exportTrigger = $("#export-trigger");
  const layerMenu = $("#layer-menu");
  const layerTrigger = $("#layer-trigger");
  const toast = $("#toast");
  const printReport = $("#print-report");

  const regions = {
    all: { name: "高新区", box: [0, 0, 1600, 900], registered: "4,286", active: "3,108", risk: "6", providers: "28" },
    "桂溪街道": { box: [520, 40, 720, 520], registered: "1,567", active: "1,218", risk: "3", providers: "11" },
    "肖家河街道": { box: [60, 25, 700, 520], registered: "892", active: "641", risk: "1", providers: "6" },
    "中和街道": { box: [900, 90, 650, 520], registered: "734", active: "542", risk: "1", providers: "5" },
    "石羊街道": { box: [60, 330, 720, 520], registered: "681", active: "487", risk: "1", providers: "6" }
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
  const state = { box: [...regions.all.box], region: "all", freshness: "all", layers: { dog: true, provider: true, friendly: true, restricted: true } };
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
      <div class="detail-row"><dt>点位展示方式</dt><dd>全部独立显示</dd></div>
      <div class="detail-row"><dt>定位时效</dt><dd>${freshnessFilter.options[freshnessFilter.selectedIndex].text}</dd></div></dl>${updateTime()}</section>`;
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
    detailContent.innerHTML = `<section class="detail-section"><dl class="detail-list">${contents[3].map(([a,b]) => `<div class="detail-row"><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>${updateTime()}</section>${type === "friendly" ? `<section class="detail-section"><h3 class="section-title">当前举办活动</h3><div class="ai-callout"><span>周末文明遛犬课堂</span><p>7 月 18 日 10:00–11:30 · 乐园东区</p></div></section>` : ""}`;
    openDetail();
  }
  function showAI() {
    setHeader("AI 辅助决策", "高新区犬只治理分析", "基于当前地图筛选状态");
    detailContent.innerHTML = `<section class="detail-section"><div class="ai-callout"><span>${icon("spark")}重点结论</span><p>当前电子狗牌犬只点位主要集中在桂溪街道；锦晖小学禁入区域内检测到 2 只犬只，建议优先核查犬只状态并关注持续停留情况。</p></div></section>
      <section class="detail-section"><h3 class="section-title">辅助判断依据</h3><dl class="detail-list"><div class="detail-row"><dt>当前区域</dt><dd>${state.region === "all" ? "高新区" : state.region}</dd></div><div class="detail-row"><dt>可见犬只点</dt><dd>${visibleDogs()} 个演示点</dd></div><div class="detail-row"><dt>定位来源</dt><dd>电子狗牌</dd></div><div class="detail-row"><dt>高风险规则</dt><dd>闯入禁入区域</dd></div></dl>${updateTime()}<p class="detail-time">AI 仅提供辅助判断，不自动执行处置。</p></section>`;
    openDetail();
  }
  function visibleDogs() { return $$(".dog-object").filter(node => node.style.display !== "none" && state.layers.dog).length; }
  function applyFilters() {
    $$(".dog-object").forEach(node => node.style.display = state.layers.dog && (state.freshness === "all" || node.dataset.freshness === state.freshness) ? "" : "none");
    Object.entries(state.layers).forEach(([layer, on]) => {
      $$(`[data-layer-group="${layer}"]`).forEach(node => { if (layer !== "dog") node.style.display = on ? "" : "none"; });
      $$(`[data-legend="${layer}"]`).forEach(node => node.classList.toggle("is-off", !on));
    });
    $("#visible-summary").textContent = state.layers.dog ? `${visibleDogs()} 个犬只点位` : "犬只图层已关闭";
  }
  function setViewBox(box) {
    state.box = box.map(Number);
    mapArt.setAttribute("viewBox", state.box.join(" "));
    const scale = state.box[2] / 1600;
    $$("[data-scale-lock]").forEach(node => {
      if (!node.dataset.baseTransform) node.dataset.baseTransform = node.getAttribute("transform") || "";
      const match = node.dataset.baseTransform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
      if (match) node.setAttribute("transform", `translate(${match[1]} ${match[2]}) scale(${scale})`);
    });
  }
  function zoom(factor) {
    const [x,y,w,h] = state.box, nw = Math.min(1600, Math.max(360, w * factor)), nh = nw * 9 / 16;
    setViewBox([Math.max(0, Math.min(1600 - nw, x + (w - nw) / 2)), Math.max(0, Math.min(900 - nh, y + (h - nh) / 2)), nw, nh]);
  }
  function notify(message) { $("span", toast).textContent = message; toast.hidden = false; clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.hidden = true, 2400); }
  function reset() {
    state.region = "all"; state.freshness = "all"; Object.keys(state.layers).forEach(key => state.layers[key] = true);
    regionFilter.value = "all"; freshnessFilter.value = "all";
    $$(".layer-chip").forEach(chip => { chip.classList.add("is-on"); chip.setAttribute("aria-pressed", "true"); });
    setViewBox(regions.all.box); applyFilters(); closeDetail(); layerMenu.hidden = true; layerTrigger.setAttribute("aria-expanded", "false"); notify("已恢复高新区全量电子狗牌犬只点位");
  }
  function exportPdf() {
    const layers = Object.entries(state.layers).filter(([,on]) => on).map(([key]) => ({dog:"犬只",provider:"服务商",friendly:"友好乐园",restricted:"禁入区域"})[key]).join("、") || "无";
    printReport.innerHTML = `<h1>高新区犬只治理决策快照</h1><p>生成时间：${formatTime()}　当前区域：${state.region === "all" ? "高新区" : state.region}</p><section class="print-kpis"><div class="print-kpi"><span>在册犬只数</span><strong>4,286</strong></div><div class="print-kpi"><span>活跃犬只数</span><strong>3,108</strong></div><div class="print-kpi"><span>高风险事件数</span><strong>6</strong></div></section><h2>当前地图状态</h2><p>图层：${layers}；定位时效：${freshnessFilter.options[freshnessFilter.selectedIndex].text}；犬只定位来源：仅电子狗牌。</p><h2>AI 辅助摘要</h2><p>${$("#ai-summary-text").textContent}</p><p class="print-note">本报告为演示数据生成的辅助决策快照。</p>`;
    window.print();
  }

  document.addEventListener("click", event => {
    const dog = event.target.closest("[data-dog]");
    if (dog) return showDog(dog.dataset.dog, dog);
    const object = event.target.closest("[data-detail]");
    if (object) return showObject(object.dataset.detail);
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "close-detail") closeDetail();
    if (action === "reset") reset();
    if (action === "ai") showAI();
    const chip = event.target.closest("[data-layer]");
    if (chip) { const key = chip.dataset.layer; state.layers[key] = !state.layers[key]; chip.classList.toggle("is-on", state.layers[key]); chip.setAttribute("aria-pressed", String(state.layers[key])); applyFilters(); }
    const control = event.target.closest("[data-map-control]")?.dataset.mapControl;
    if (control === "zoom-in") zoom(.72);
    if (control === "zoom-out") zoom(1.35);
    if (control === "home") { state.region = "all"; regionFilter.value = "all"; setViewBox(regions.all.box); }
    if (control === "fullscreen") { const stage = $("#map-stage"); if (!document.fullscreenElement) stage.requestFullscreen?.(); else document.exitFullscreen?.(); }
    if (event.target.closest("#detail-handle")) showRegion();
    if (event.target.closest("#layer-trigger")) {
      layerMenu.hidden = !layerMenu.hidden;
      layerTrigger.setAttribute("aria-expanded", String(!layerMenu.hidden));
      exportMenu.hidden = true;
      exportTrigger.setAttribute("aria-expanded", "false");
    } else if (!event.target.closest(".layer-menu-wrap")) {
      layerMenu.hidden = true;
      layerTrigger.setAttribute("aria-expanded", "false");
    }
    if (event.target.closest("#export-trigger")) { exportMenu.hidden = !exportMenu.hidden; exportTrigger.setAttribute("aria-expanded", String(!exportMenu.hidden)); }
    const exportType = event.target.closest("[data-export]")?.dataset.export;
    if (exportType === "pdf") exportPdf();
    if (exportType === "image") notify("演示原型：地图图片已进入导出队列");
    if (exportType) { exportMenu.hidden = true; exportTrigger.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".map-object")) { event.preventDefault(); event.target.click(); }
    if (event.key === "Escape") { closeDetail(); exportMenu.hidden = true; layerMenu.hidden = true; layerTrigger.setAttribute("aria-expanded", "false"); }
  });
  regionFilter.addEventListener("change", () => { state.region = regionFilter.value; setViewBox(regions[state.region].box); showRegion(); });
  freshnessFilter.addEventListener("change", () => { state.freshness = freshnessFilter.value; applyFilters(); });
  setViewBox(regions.all.box); applyFilters();
}());
