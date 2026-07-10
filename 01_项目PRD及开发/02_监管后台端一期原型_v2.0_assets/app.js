(function () {
  "use strict";

  const app = document.getElementById("app-shell");
  const mapStage = document.getElementById("map-stage");
  const mapArt = document.getElementById("map-art");
  const detailPanel = document.getElementById("detail-panel");
  const detailHandle = document.getElementById("detail-handle");
  const levelBackButton = document.getElementById("level-back-button");
  const detailTitle = document.getElementById("detail-title");
  const detailEyebrow = document.getElementById("detail-eyebrow");
  const detailSubtitle = document.getElementById("detail-subtitle");
  const detailContent = document.getElementById("detail-content");
  const aiSummaryText = document.getElementById("ai-summary-text");
  const visibleSummary = document.getElementById("visible-summary");
  const regionFilter = document.getElementById("region-filter");
  const sourceFilter = document.getElementById("source-filter");
  const freshnessFilter = document.getElementById("freshness-filter");
  const mapEmpty = document.getElementById("map-empty");
  const exportTrigger = document.getElementById("export-trigger");
  const exportMenu = document.getElementById("export-menu");
  const toast = document.getElementById("toast");
  const printReport = document.getElementById("print-report");

  const LEVEL_VIEWBOXES = {
    0: [0, 0, 1600, 900],
    1: [560, 45, 730, 600],
    2: [650, 175, 520, 430]
  };

  const state = {
    level: 0,
    path: ["高新区"],
    viewBox: LEVEL_VIEWBOXES[0].slice(),
    selected: null,
    selectedType: null,
    lastTrigger: null,
    layers: {
      dog: true,
      jurisdiction: true,
      provider: true,
      friendly: true,
      restricted: true
    }
  };

  const icon = (name, className = "icon") => `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const formatTime = () => "2026-07-10 14:32";

  const dogProfiles = {
    "dog-electronic": {
      name: "年糕", emoji: "🐕", id: "DOG-2026-0186", plate: "CDHT-A08316",
      meta: ["3 岁", "雌性", "柯基"], plateType: "电子狗牌", report: "今天 14:30",
      status: "活跃定位 · 2 分钟前", phone: "138******09", risk: "暂无高风险行为", riskClass: "",
      note: "位置来自电子狗牌设备"
    },
    "dog-phone": {
      name: "桃子", emoji: "🐩", id: "DOG-2025-0742", plate: "CDHT-N04277",
      meta: ["5 岁", "雌性", "贵宾犬"], plateType: "普通狗牌", report: "今天 14:21",
      status: "较久未更新 · 11 分钟前", phone: "186******52", risk: "暂无高风险行为", riskClass: "",
      note: "位置来自犬主手机，并非犬只实时精确位置"
    },
    "dog-risk": {
      name: "豆包", emoji: "🐕‍🦺", id: "DOG-2026-0039", plate: "CDHT-A01906",
      meta: ["2 岁", "雄性", "柴犬"], plateType: "电子狗牌", report: "今天 14:31",
      status: "活跃定位 · 1 分钟前", phone: "159******73", risk: "存在 · 闯入锦晖小学禁入区域", riskClass: "risk-text",
      note: "位置来自电子狗牌设备"
    },
    "dog-expired": {
      name: "可乐", emoji: "🦮", id: "DOG-2024-1168", plate: "CDHT-N08831",
      meta: ["6 岁", "雄性", "拉布拉多"], plateType: "普通狗牌", report: "今天 13:58",
      status: "定位失效 · 34 分钟前", phone: "177******26", risk: "暂无高风险行为", riskClass: "",
      note: "位置来自犬主手机，并非犬只实时精确位置"
    }
  };

  function metric(label, value, suffix = "", extra = "") {
    return `<div class="metric ${extra}"><span>${label}</span><strong>${value}${suffix ? `<small>${suffix}</small>` : ""}</strong></div>`;
  }

  function aiCallout(text) {
    return `<div class="ai-callout"><span>${icon("spark")}AI 辅助摘要</span><p>${text}</p></div>`;
  }

  function detailTime() {
    return `<div class="detail-time"><span>${icon("clock")}数据更新时间</span><strong>${formatTime()}</strong></div>`;
  }

  function actionButtons(includeDrill = false) {
    return `<div class="detail-actions">
      ${includeDrill ? `<button type="button" class="button ghost" data-detail-action="drill">继续下钻</button>` : ""}
      <button type="button" class="button ghost" data-action="ai">${icon("spark")}AI 分析</button>
      <button type="button" class="button primary" data-detail-action="snapshot">${icon("export")}区域快照</button>
    </div>`;
  }

  function renderOverview() {
    return `
      <section class="detail-section">
        <h3 class="section-title">犬只态势</h3>
        <div class="metric-grid">
          ${metric("在册犬只", "4,286", "只")}
          ${metric("活跃定位犬只", "3,108", "只")}
          ${metric("电子狗牌犬只", "2,364", "只")}
          ${metric("手机定位犬只", "1,922", "只")}
        </div>
      </section>
      <section class="detail-section">
        <h3 class="section-title">治理资源</h3>
        <div class="metric-grid">
          ${metric("城管数量", "128", "人")}
          ${metric("当前巡查任务", "37", "项")}
          ${metric("服务商数量", "84", "家")}
          ${metric("高风险事件", "6", "起", "risk")}
        </div>
      </section>
      ${aiCallout("犬只密度主要集中在桂溪街道；禁入区域内当前检测到 6 起闯入事件，建议优先核查桂溪与中和街道的巡查力量覆盖。")}
      ${detailTime()}
      ${actionButtons(false)}
    `;
  }

  function regionNumbers(name) {
    const table = {
      "桂溪街道": [1567, 1218, 918, 649, 46, 15, 31, 3],
      "肖家河街道": [892, 662, 501, 391, 28, 7, 18, 1],
      "中和街道": [734, 516, 397, 337, 22, 8, 16, 2],
      "石羊街道": [681, 488, 352, 329, 20, 5, 12, 0],
      "合作街道": [412, 224, 196, 216, 12, 2, 7, 0],
      "交子公园社区": [386, 317, 226, 160, 12, 5, 8, 2],
      "锦城社区": [302, 238, 171, 131, 9, 4, 6, 1],
      "益州社区": [251, 184, 143, 108, 8, 3, 5, 0]
    };
    return table[name] || table["桂溪街道"];
  }

  function renderRegion(name) {
    const n = regionNumbers(name);
    const electronicRate = Math.round((n[2] / n[0]) * 100);
    const phoneRate = 100 - electronicRate;
    const isCommunity = name.endsWith("社区");
    return `
      <section class="detail-section">
        <h3 class="section-title">区域犬只</h3>
        <div class="metric-grid">
          ${metric("在册犬只", n[0].toLocaleString(), "只")}
          ${metric("活跃定位犬只", n[1].toLocaleString(), "只")}
          ${metric("电子狗牌犬只", n[2].toLocaleString(), `${electronicRate}%`) }
          ${metric("手机定位犬只", n[3].toLocaleString(), `${phoneRate}%`) }
        </div>
      </section>
      <section class="detail-section">
        <h3 class="section-title">治理资源</h3>
        <div class="metric-grid">
          ${metric("城管数量", n[4], "人")}
          ${metric("当前巡查任务", n[5], "项")}
          ${metric("服务商数量", n[6], "家")}
          ${metric("高风险事件", n[7], "起", n[7] ? "risk" : "")}
        </div>
      </section>
      ${aiCallout(`${name}犬只分布${isCommunity ? "集中在交子大道南侧居住区" : "呈现南高北低特征"}；当前${n[7]}起禁区闯入事件均有活跃定位依据，建议结合城管巡查任务分布进一步核查。`)}
      ${detailTime()}
      ${actionButtons(!isCommunity)}
    `;
  }

  function renderDog(type, fromMulti = false) {
    const dog = dogProfiles[type] || dogProfiles["dog-electronic"];
    return `
      ${fromMulti ? `<button type="button" class="back-link" data-detail-action="back-list">${icon("back")}返回关联犬只列表</button>` : ""}
      <div class="dog-identity">
        <span class="dog-avatar" aria-hidden="true">${dog.emoji}</span>
        <div><h3>${dog.name}</h3><p>${dog.note}</p></div>
      </div>
      <dl class="detail-list">
        <div class="detail-row"><dt>犬只 ID · 狗牌编号</dt><dd>${dog.id} · ${dog.plate}</dd></div>
        <div class="detail-row three"><dt>年龄 · 性别 · 品种</dt><dd>${dog.meta.map(value => `<span>${value}</span>`).join("")}</dd></div>
        <div class="detail-row"><dt>狗牌类型</dt><dd><span class="tag purple">${dog.plateType === "电子狗牌" ? "⚡ " : ""}${dog.plateType}</span></dd></div>
        <div class="detail-row"><dt>最后上报 · 定位状态</dt><dd>${dog.report}<br><span class="tag ${dog.status.includes("活跃") ? "green" : dog.status.includes("失效") ? "gray" : "yellow"}">${dog.status}</span></dd></div>
        <div class="detail-row"><dt>犬主脱敏手机号</dt><dd>${dog.phone}</dd></div>
        <div class="detail-row"><dt>高风险行为</dt><dd class="${dog.riskClass}">${dog.risk}</dd></div>
        <div class="detail-row"><dt>数据更新时间</dt><dd class="subtle">${formatTime()}</dd></div>
      </dl>
    `;
  }

  function renderMultiDog() {
    const dogs = [
      ["年糕", "🐕", "DOG-2026-0186", "CDHT-N08316", "暂无高风险行为", "dog-electronic"],
      ["团子", "🐶", "DOG-2025-0491", "CDHT-N06108", "暂无高风险行为", "dog-phone"],
      ["豆包", "🐕‍🦺", "DOG-2026-0039", "CDHT-N01906", "闯入禁入区域", "dog-risk"]
    ];
    return `
      <div class="multi-header"><strong>138******09（3）</strong><p>同一犬主手机定位 · 非犬只实时精确位置</p></div>
      <section class="detail-section">
        <h3 class="section-title">关联犬只</h3>
        <div class="dog-list">
          ${dogs.map(dog => `<button type="button" class="dog-list-item" data-dog-profile="${dog[5]}">
            <span class="dog-avatar" aria-hidden="true">${dog[1]}</span>
            <span><strong>${dog[0]}</strong><small>${dog[2]} · ${dog[3]}</small><em class="tag ${dog[4].includes("闯入") ? "red" : "gray"}">${dog[4]}</em></span>
            ${icon("chevron")}
          </button>`).join("")}
        </div>
      </section>
      ${detailTime()}
    `;
  }

  function renderJurisdiction() {
    return `
      <section class="detail-section">
        <h3 class="section-title">辖区概况</h3>
        <dl class="detail-list">
          <div class="detail-row"><dt>辖区名称</dt><dd>锦城执法辖区</dd></div>
          <div class="detail-row"><dt>覆盖街道 / 社区</dt><dd>桂溪街道<br><span class="subtle">交子公园、锦城、益州社区</span></dd></div>
          <div class="detail-row"><dt>城管数量</dt><dd>46 人</dd></div>
          <div class="detail-row"><dt>当前巡查任务数</dt><dd>15 项</dd></div>
          <div class="detail-row"><dt>在册 / 活跃定位犬只</dt><dd>1,567 / 1,218 只</dd></div>
          <div class="detail-row"><dt>高风险事件数</dt><dd class="risk-text">3 起</dd></div>
        </dl>
      </section>
      ${aiCallout("桂溪街道活跃犬只密度为高新区最高，当前每名城管对应约 26 只活跃定位犬只；锦晖小学周边存在连续风险点，建议核查巡查时段覆盖。")}
      ${detailTime()}
    `;
  }

  function renderProvider() {
    return `
      <section class="detail-section">
        <h3 class="section-title">服务信息</h3>
        <dl class="detail-list">
          <div class="detail-row"><dt>服务商名称</dt><dd>康桥宠物医院（锦城店）</dd></div>
          <div class="detail-row"><dt>服务商类型</dt><dd>宠物医院</dd></div>
          <div class="detail-row"><dt>所属街道 · 社区</dt><dd>桂溪街道 · 锦城社区</dd></div>
          <div class="detail-row"><dt>服务状态</dt><dd><span class="tag green">优质</span></dd></div>
          <div class="detail-row"><dt>服务地址摘要</dt><dd>锦城大道东段</dd></div>
          <div class="detail-row"><dt>1 公里内犬只数量</dt><dd>216 只</dd></div>
          <div class="detail-row"><dt>1 公里内活跃定位犬只</dt><dd>178 只</dd></div>
        </dl>
      </section>
      ${aiCallout("该服务点覆盖锦城社区西部犬只密集区，1 公里内活跃定位犬只占比 82%；服务状态由上游业务数据提供，本端不作评级判断。")}
      ${detailTime()}
    `;
  }

  function renderFriendly() {
    return `
      <section class="detail-section">
        <h3 class="section-title">空间覆盖</h3>
        <dl class="detail-list">
          <div class="detail-row"><dt>乐园名称</dt><dd>锦城湖宠物友好乐园</dd></div>
          <div class="detail-row"><dt>所属街道 / 社区</dt><dd>桂溪街道 · 交子公园社区</dd></div>
          <div class="detail-row"><dt>区域内 / 周边犬只</dt><dd>42 / 286 只</dd></div>
          <div class="detail-row"><dt>活跃定位犬只</dt><dd>231 只</dd></div>
          <div class="detail-row"><dt>附近服务商数量</dt><dd>7 家</dd></div>
        </dl>
      </section>
      <section class="detail-section">
        <h3 class="section-title">当前举办的活动</h3>
        <div class="activity-list">
          <article class="activity"><div><strong>文明养犬周末课堂</strong><span class="tag green">进行中</span></div><p>7 月 10 日 14:00–17:00</p></article>
          <article class="activity"><div><strong>宠物基础义诊</strong><span class="tag blue">即将开始</span></div><p>7 月 12 日 09:30–11:30</p></article>
        </div>
      </section>
      ${aiCallout("乐园位于活跃犬只集中带，周边服务资源充足；东南方向约 1.5 公里范围仍存在友好空间覆盖空缺，建议结合实际客流核查。")}
      ${detailTime()}
    `;
  }

  function renderRestricted() {
    return `
      <section class="detail-section">
        <h3 class="section-title">风险概况</h3>
        <dl class="detail-list">
          <div class="detail-row"><dt>区域名称</dt><dd>锦晖小学禁入区域</dd></div>
          <div class="detail-row"><dt>区域类型</dt><dd><span class="tag red">学校</span></dd></div>
          <div class="detail-row"><dt>所属街道 / 社区</dt><dd>桂溪街道 · 锦城社区</dd></div>
          <div class="detail-row"><dt>当前区域内犬只数量</dt><dd class="risk-text">2 只</dd></div>
          <div class="detail-row"><dt>当前接近区域犬只数量</dt><dd>5 只</dd></div>
        </dl>
      </section>
      ${aiCallout("当前 2 只犬进入锦晖小学禁入区域，均为活跃电子狗牌定位；另有 5 只犬位于边界附近。建议优先核查区域出入口与巡查时段。")}
      ${detailTime()}
    `;
  }

  function renderAnalysisLoading() {
    return `
      ${renderAiContext()}
      <div class="analysis-skeleton" aria-label="正在分析当前地图">
        <div class="skeleton-card"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>
        <div class="skeleton-card"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>
        <div class="skeleton-card"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>
      </div>`;
  }

  function renderAiContext() {
    const source = sourceFilter.options[sourceFilter.selectedIndex].text;
    const freshness = freshnessFilter.options[freshnessFilter.selectedIndex].text;
    const layers = Object.entries(state.layers).filter(([, on]) => on).map(([name]) => ({dog:"犬只",jurisdiction:"辖区",provider:"服务商",friendly:"乐园",restricted:"禁区"})[name]).join("、") || "无";
    return `<div class="ai-context"><span>区域：${state.path[state.path.length - 1]}</span><span>层级：${["高新区", "街道", "社区近景"][state.level]}</span><span>来源：${source}</span><span>时效：${freshness}</span><span>图层：${layers}</span><span>数据：14:32</span></div>`;
  }

  function renderAnalysis() {
    const area = state.path[state.path.length - 1];
    return `
      ${renderAiContext()}
      <article class="analysis-block"><span class="analysis-number">01</span><h3>结论</h3><p>${area}当前最需关注的是禁入区域风险与高密度犬只区域的巡查力量匹配。桂溪街道风险点相对集中，建议作为本次地图研判的优先区域。</p></article>
      <article class="analysis-block"><span class="analysis-number">02</span><h3>数据依据</h3><ul><li>高新区活跃定位犬只 3,108 只，桂溪街道 1,218 只，占全区 39%。</li><li>锦晖小学禁入区域当前 2 只犬进入、5 只犬接近边界。</li><li>桂溪街道 46 名城管对应 15 项未完成巡查任务。</li><li>锦城湖乐园周边 286 只犬，附近共有 7 家服务商。</li></ul></article>
      <article class="analysis-block inference"><span class="analysis-number">03</span><h3>可能原因 · 辅助推断</h3><p>可能与工作日下午公园周边遛犬活动增加、学校周边通行路径和禁入边界现场提示不足有关。该推断需结合现场客流与巡查记录进一步核查。</p></article>
      <article class="analysis-block advice"><span class="analysis-number">04</span><h3>决策建议</h3><ul><li>优先核查锦晖小学出入口附近禁入边界与提示设置。</li><li>结合 14:00–17:00 时段巡查计划，关注桂溪街道南部犬只密集带。</li><li>持续观察友好乐园对周边犬只活动的空间承接效果。</li></ul></article>
      <p class="detail-time">AI 仅提供辅助判断，不自动创建、分派或催办任务。</p>
    `;
  }

  function setDetailMeta(type, title, subtitle) {
    detailEyebrow.textContent = type;
    detailTitle.textContent = title;
    detailSubtitle.textContent = subtitle;
  }

  function openDetail(type, trigger, options = {}) {
    state.lastTrigger = trigger || state.lastTrigger;
    state.selectedType = type;

    if (state.selected) state.selected.classList.remove("is-selected");
    state.selected = trigger && trigger.closest ? trigger.closest(".map-object") : null;
    if (state.selected) state.selected.classList.add("is-selected");

    if (type === "overview") {
      setDetailMeta("区域总览", "高新区", "高新区 · 全局总览");
      detailContent.innerHTML = renderOverview();
    } else if (type === "region") {
      const name = options.name || state.path[state.path.length - 1];
      setDetailMeta(name.endsWith("社区") ? "社区聚合详情" : "街道聚合详情", name, `${name.endsWith("社区") ? "社区" : "街道"} · 当前地图上下文`);
      detailContent.innerHTML = renderRegion(name);
    } else if (type.startsWith("dog-")) {
      const dog = dogProfiles[type] || dogProfiles["dog-electronic"];
      setDetailMeta("单犬详情", dog.name, `${dog.id} · 只读信息`);
      detailContent.innerHTML = renderDog(type, options.fromMulti);
    } else if (type === "multi-dog") {
      setDetailMeta("多犬手机点位", "138******09（3）", "犬主手机定位 · 关联犬只列表");
      detailContent.innerHTML = renderMultiDog();
    } else if (type === "jurisdiction") {
      setDetailMeta("城管辖区详情", "锦城执法辖区", "辖区聚合信息 · 不展示个人位置");
      detailContent.innerHTML = renderJurisdiction();
    } else if (type === "provider") {
      setDetailMeta("服务商详情", "康桥宠物医院", "服务状态由上游提供 · 只读");
      detailContent.innerHTML = renderProvider();
    } else if (type === "friendly") {
      setDetailMeta("宠物友好乐园详情", "锦城湖宠物友好乐园", "友好空间与犬只覆盖关系");
      detailContent.innerHTML = renderFriendly();
    } else if (type === "restricted") {
      setDetailMeta("犬只禁入区域详情", "锦晖小学禁入区域", "学校 · 空间风险只读信息");
      detailContent.innerHTML = renderRestricted();
    } else if (type === "ai") {
      setDetailMeta("AI 深度分析", "当前地图辅助研判", "绑定当前区域、筛选、图层与数据时间");
      detailContent.innerHTML = renderAnalysisLoading();
      window.setTimeout(() => {
        if (state.selectedType === "ai") detailContent.innerHTML = renderAnalysis();
      }, 720);
    }

    detailContent.scrollTop = 0;
    app.classList.add("detail-open");
    detailPanel.setAttribute("aria-hidden", "false");
    detailHandle.setAttribute("aria-expanded", "true");
    window.setTimeout(() => detailTitle.focus({ preventScroll: true }), 210);
  }

  function closeDetail(restoreFocus = true) {
    app.classList.remove("detail-open");
    detailPanel.setAttribute("aria-hidden", "true");
    detailHandle.setAttribute("aria-expanded", "false");
    if (state.selected) state.selected.classList.remove("is-selected");
    state.selected = null;
    if (restoreFocus && state.lastTrigger && typeof state.lastTrigger.focus === "function") state.lastTrigger.focus({ preventScroll: true });
  }

  function updateBreadcrumb() {
    const crumbs = Array.from(document.querySelectorAll(".crumb"));
    const separators = Array.from(document.querySelectorAll(".crumb-separator"));
    crumbs.forEach((crumb, index) => {
      if (state.path[index]) {
        crumb.hidden = false;
        crumb.textContent = state.path[index];
        crumb.classList.toggle("is-current", index === state.path.length - 1);
        crumb.setAttribute("aria-current", index === state.path.length - 1 ? "page" : "false");
      } else {
        crumb.hidden = true;
        crumb.classList.remove("is-current");
      }
    });
    separators.forEach((separator, index) => { separator.hidden = !state.path[index + 1]; });
    const parentArea = state.path[state.path.length - 2];
    levelBackButton.hidden = state.level === 0;
    if (parentArea) {
      levelBackButton.querySelector("span").textContent = `返回${parentArea}`;
      levelBackButton.setAttribute("aria-label", `返回上一级：${parentArea}`);
    }
  }

  function setLevelGroups() {
    document.querySelectorAll("[data-level-group]").forEach(group => {
      const groupLevel = { district: 0, street: 1, community: 2 }[group.dataset.levelGroup];
      const visible = groupLevel === state.level && state.layers.dog;
      group.style.display = visible ? "" : "none";
    });
    visibleSummary.textContent = state.level === 0 ? "街道聚合" : state.level === 1 ? "社区聚合" : "单犬点位";
  }

  function updateMarkerScale(viewBoxWidth) {
    const scale = Math.max(.24, Math.min(1.15, viewBoxWidth / LEVEL_VIEWBOXES[0][2]));
    document.querySelectorAll("[data-scale-lock]").forEach(marker => {
      if (!marker.dataset.baseTransform) marker.dataset.baseTransform = marker.getAttribute("transform") || "";
      marker.setAttribute("transform", `${marker.dataset.baseTransform} scale(${scale})`.trim());
    });
  }

  function animateViewBox(target, duration = 280) {
    const start = state.viewBox.slice();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || duration === 0) {
      state.viewBox = target.slice();
      mapArt.setAttribute("viewBox", target.join(" "));
      updateMarkerScale(target[2]);
      return;
    }
    const startAt = performance.now();
    mapArt.classList.add("is-transitioning");
    function frame(now) {
      const progress = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = start.map((value, index) => value + (target[index] - value) * eased);
      mapArt.setAttribute("viewBox", next.join(" "));
      updateMarkerScale(next[2]);
      if (progress < 1) requestAnimationFrame(frame);
      else {
        state.viewBox = target.slice();
        mapArt.classList.remove("is-transitioning");
      }
    }
    requestAnimationFrame(frame);
  }

  function updateSummary() {
    const area = state.path[state.path.length - 1];
    const source = sourceFilter.value;
    const freshness = freshnessFilter.value;
    if (!state.layers.dog) {
      aiSummaryText.textContent = `${area}犬只图层当前已关闭；AI 摘要仅基于已开启的治理资源与区域图层，不对犬只密度作判断。`;
    } else if (source === "electronic") {
      aiSummaryText.textContent = `${area}当前仅查看电子狗牌定位，活跃点位主要集中在锦城社区，禁入区域内有 2 个高风险点需关注。`;
    } else if (source === "phone") {
      aiSummaryText.textContent = `${area}当前仅查看犬主手机定位；这些位置不代表犬只实时精确位置，多犬共用手机点已合并表达。`;
    } else if (freshness === "expired") {
      aiSummaryText.textContent = `${area}当前查看定位失效点位，演示数据中共 1 个手机定位超过 15 分钟未更新，建议谨慎解释空间位置。`;
    } else {
      aiSummaryText.textContent = `${area}犬只密度主要集中在桂溪街道，锦晖小学禁入区域检测到 2 只闯入犬只，建议优先核查周边巡查力量。`;
    }
  }

  function drillTo(targetLevel, name, viewBox, trigger) {
    state.level = targetLevel;
    state.path = targetLevel === 1 ? ["高新区", name] : ["高新区", state.path[1] || "桂溪街道", name];
    updateBreadcrumb();
    setLevelGroups();
    animateViewBox(viewBox || LEVEL_VIEWBOXES[targetLevel]);
    updateSummary();
    applyDogFilters();
    openDetail("region", trigger, { name });
    if (targetLevel === 1 && Array.from(regionFilter.options).some(option => option.value === name)) regionFilter.value = name;
  }

  function goToLevel(level, openRegion = false) {
    if (level <= 0) {
      state.level = 0;
      state.path = ["高新区"];
      regionFilter.value = "all";
      closeDetail(false);
    } else if (level === 1) {
      state.level = 1;
      state.path = state.path.slice(0, 2);
      if (openRegion) openDetail("region", null, { name: state.path[1] });
      else closeDetail(false);
    }
    updateBreadcrumb();
    setLevelGroups();
    animateViewBox(LEVEL_VIEWBOXES[level]);
    updateSummary();
    applyDogFilters();
  }

  function applyDogFilters() {
    const source = sourceFilter.value;
    const freshness = freshnessFilter.value;
    let visible = 0;
    document.querySelectorAll(".dog-object").forEach(point => {
      const sourceMatch = source === "all" || point.dataset.source === source;
      const freshnessMatch = freshness === "all" || point.dataset.freshness === freshness;
      const show = sourceMatch && freshnessMatch && state.layers.dog && state.level === 2;
      point.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    mapEmpty.hidden = !(state.level === 2 && state.layers.dog && visible === 0);
    updateSummary();
    if (state.selected && state.selected.style.display === "none") {
      closeDetail(false);
      showToast("当前对象已被筛选条件隐藏");
    } else if (detailPanel.getAttribute("aria-hidden") === "false" && state.selectedType === "region") {
      detailContent.innerHTML = renderRegion(state.path[state.path.length - 1]);
    }
  }

  function toggleLayer(button) {
    const layer = button.dataset.layer;
    state.layers[layer] = !state.layers[layer];
    button.classList.toggle("is-on", state.layers[layer]);
    button.setAttribute("aria-pressed", String(state.layers[layer]));
    document.querySelectorAll(`[data-layer-group="${layer}"]`).forEach(group => {
      if (layer !== "dog") group.style.display = state.layers[layer] ? "" : "none";
    });
    document.querySelectorAll(`[data-legend="${layer}"]`).forEach(item => item.classList.toggle("is-off", !state.layers[layer]));
    if (layer === "dog") setLevelGroups();
    applyDogFilters();
  }

  function resetAll() {
    sourceFilter.value = "all";
    freshnessFilter.value = "all";
    regionFilter.value = "all";
    Object.keys(state.layers).forEach(layer => {
      state.layers[layer] = true;
      const button = document.querySelector(`[data-layer="${layer}"]`);
      if (button) {
        button.classList.add("is-on");
        button.setAttribute("aria-pressed", "true");
      }
      document.querySelectorAll(`[data-layer-group="${layer}"]`).forEach(group => { group.style.display = ""; });
      document.querySelectorAll(`[data-legend="${layer}"]`).forEach(item => item.classList.remove("is-off"));
    });
    goToLevel(0);
    mapEmpty.hidden = true;
    showToast("已恢复高新区默认地图状态");
  }

  function showToast(message, delay = 2200) {
    window.clearTimeout(showToast.timer);
    toast.querySelector("span").textContent = message;
    toast.hidden = false;
    showToast.timer = window.setTimeout(() => { toast.hidden = true; }, delay);
  }

  async function mapDataUrl() {
    const clone = mapArt.cloneNode(true);
    clone.setAttribute("width", "1600");
    clone.setAttribute("height", "900");
    clone.setAttribute("viewBox", state.viewBox.join(" "));
    const source = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 980;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1600, 980);
      ctx.fillStyle = "#1f2937";
      ctx.font = "600 28px Microsoft YaHei UI, sans-serif";
      ctx.fillText("犬只治理监管地图", 36, 40);
      ctx.fillStyle = "#6b7280";
      ctx.font = "16px Microsoft YaHei UI, sans-serif";
      const sourceText = sourceFilter.options[sourceFilter.selectedIndex].text;
      const freshText = freshnessFilter.options[freshnessFilter.selectedIndex].text;
      ctx.fillText(`当前区域：${state.path.join(" / ")}  ·  定位来源：${sourceText}  ·  定位时效：${freshText}  ·  数据更新：14:32`, 36, 68);
      ctx.drawImage(image, 0, 80, 1600, 900);
      return canvas.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function exportImage() {
    exportMenu.hidden = true;
    exportTrigger.setAttribute("aria-expanded", "false");
    showToast("正在生成当前地图图片…", 4000);
    try {
      const url = await mapDataUrl();
      const link = document.createElement("a");
      link.href = url;
      link.download = `犬只治理监管地图_${state.path[state.path.length - 1]}_20260710.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast("当前地图图片已生成");
    } catch (error) {
      console.error(error);
      showToast("图片生成失败，请稍后重试");
    }
  }

  async function exportPdf() {
    exportMenu.hidden = true;
    exportTrigger.setAttribute("aria-expanded", "false");
    showToast("正在生成 PDF 决策快照…", 4000);
    try {
      const imageUrl = await mapDataUrl();
      const area = state.path[state.path.length - 1];
      const sourceText = sourceFilter.options[sourceFilter.selectedIndex].text;
      const freshText = freshnessFilter.options[freshnessFilter.selectedIndex].text;
      const layers = Object.entries(state.layers).filter(([, value]) => value).map(([key]) => ({dog:"犬只",jurisdiction:"城管辖区",provider:"服务商",friendly:"友好乐园",restricted:"禁入区域"})[key]).join("、");
      printReport.innerHTML = `
        <header class="print-head"><div><h1>犬只治理监管地图 · 决策快照</h1><p>当前区域：${state.path.join(" / ")}　生成时间：2026-07-10 14:32</p></div><span class="print-brand">监管后台端 2.0</span></header>
        <section class="print-kpis"><div class="print-kpi"><span>在册犬只数 · 高新区全局</span><strong>4,286</strong></div><div class="print-kpi"><span>活跃犬只数 · 高新区全局</span><strong>3,108</strong></div><div class="print-kpi"><span>当前巡查任务 · 高新区全局</span><strong>37</strong></div><div class="print-kpi"><span>高风险事件 · 高新区全局</span><strong>6</strong></div></section>
        <div class="print-grid"><div><img class="print-map" src="${imageUrl}" alt="当前地图快照"></div><aside class="print-side"><section class="print-box"><h2>当前筛选与图层</h2><p>定位来源：${sourceText}<br>定位时效：${freshText}<br>开启图层：${layers || "无"}</p></section><section class="print-box"><h2>当前区域摘要</h2><p>${area}犬只密度在锦城片区相对集中，当前地图检测到禁入区域风险点，右侧详情与地图上下文保持一致。</p></section><section class="print-box"><h2>AI 辅助结论</h2><p>优先关注禁入区域风险与高密度犬只区域的巡查力量匹配。</p><ul><li>数据依据：活跃定位、禁区闯入与巡查资源空间关系。</li><li>可能原因：遛犬活动增加与现场边界提示不足，需核查。</li><li>建议：关注锦晖小学周边与桂溪街道南部时段巡查。</li></ul></section></aside></div>
        <footer class="print-foot">数据口径：普通狗牌位置来自犬主手机，不代表犬只实时精确位置；高风险事件一期仅包括犬只闯入禁入区域。AI 仅提供辅助判断，不代替最终决策。</footer>`;
      showToast("PDF 快照已就绪，请在打印窗口选择“另存为 PDF”", 3200);
      window.setTimeout(() => window.print(), 320);
    } catch (error) {
      console.error(error);
      showToast("PDF 决策快照生成失败，请稍后重试");
    }
  }

  function handleMapObject(target) {
    const object = target.closest(".map-object");
    if (!object) return;
    if (object.classList.contains("cluster")) {
      const name = object.dataset.region;
      const viewBox = object.dataset.viewbox.split(" ").map(Number);
      if (state.level === 0) drillTo(1, name, viewBox, object);
      else if (state.level === 1) drillTo(2, name, viewBox, object);
      return;
    }
    if (object.dataset.detail) openDetail(object.dataset.detail, object);
  }

  mapArt.addEventListener("click", event => handleMapObject(event.target));
  mapArt.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.closest(".map-object")) {
      event.preventDefault();
      handleMapObject(event.target);
    }
  });

  document.addEventListener("click", event => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "ai") openDetail("ai", event.target.closest("button"));
    if (action === "close-detail") closeDetail();
    if (action === "reset") resetAll();
    if (action === "back-level" && state.level > 0) goToLevel(state.level - 1, state.level - 1 > 0);

    const layerButton = event.target.closest("[data-layer]");
    if (layerButton) toggleLayer(layerButton);

    const mapControl = event.target.closest("[data-map-control]")?.dataset.mapControl;
    if (mapControl === "home") resetAll();
    if (mapControl === "zoom-in") {
      if (state.level === 0) drillTo(1, "桂溪街道", LEVEL_VIEWBOXES[1], event.target.closest("button"));
      else if (state.level === 1) drillTo(2, "交子公园社区", LEVEL_VIEWBOXES[2], event.target.closest("button"));
      else {
        const [x, y, w, h] = state.viewBox;
        const next = [x + w * .075, y + h * .075, w * .85, h * .85];
        animateViewBox(next, 180);
      }
    }
    if (mapControl === "zoom-out") {
      if (state.level > 0) goToLevel(state.level - 1, state.level - 1 > 0);
      else showToast("已是高新区总览范围");
    }
    if (mapControl === "fullscreen") {
      if (!document.fullscreenElement) mapStage.requestFullscreen?.().catch(() => showToast("当前浏览器未允许全屏"));
      else document.exitFullscreen?.();
    }

    const crumb = event.target.closest(".crumb:not(.is-current)");
    if (crumb && !crumb.hidden) goToLevel(Number(crumb.dataset.levelIndex), Number(crumb.dataset.levelIndex) > 0);

    const dogProfile = event.target.closest("[data-dog-profile]")?.dataset.dogProfile;
    if (dogProfile) openDetail(dogProfile, state.lastTrigger, { fromMulti: true });

    const detailAction = event.target.closest("[data-detail-action]")?.dataset.detailAction;
    if (detailAction === "back-list") openDetail("multi-dog", state.lastTrigger);
    if (detailAction === "drill") {
      const firstCommunity = document.querySelector("#street-clusters .cluster");
      drillTo(2, "交子公园社区", LEVEL_VIEWBOXES[2], firstCommunity);
    }
    if (detailAction === "snapshot") exportImage();

    if (!event.target.closest(".export-wrap") && !exportMenu.hidden) {
      exportMenu.hidden = true;
      exportTrigger.setAttribute("aria-expanded", "false");
    }
  });

  detailHandle.addEventListener("click", () => {
    const type = state.selectedType && state.selected ? state.selectedType : state.level > 0 ? "region" : "overview";
    openDetail(type, detailHandle, { name: state.path[state.path.length - 1] });
  });

  exportTrigger.addEventListener("click", event => {
    event.stopPropagation();
    exportMenu.hidden = !exportMenu.hidden;
    exportTrigger.setAttribute("aria-expanded", String(!exportMenu.hidden));
  });

  exportMenu.addEventListener("click", event => {
    const type = event.target.closest("[data-export]")?.dataset.export;
    if (type === "image") exportImage();
    if (type === "pdf") exportPdf();
  });

  regionFilter.addEventListener("change", () => {
    if (regionFilter.value === "all") goToLevel(0);
    else drillTo(1, regionFilter.value, LEVEL_VIEWBOXES[1], regionFilter);
  });
  sourceFilter.addEventListener("change", applyDogFilters);
  freshnessFilter.addEventListener("change", applyDogFilters);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (!exportMenu.hidden) {
        exportMenu.hidden = true;
        exportTrigger.setAttribute("aria-expanded", "false");
        exportTrigger.focus();
      } else if (detailPanel.getAttribute("aria-hidden") === "false") closeDetail();
    }
  });

  window.addEventListener("afterprint", () => { printReport.innerHTML = ""; });

  updateBreadcrumb();
  setLevelGroups();
  updateMarkerScale(state.viewBox[2]);
  applyDogFilters();
})();
