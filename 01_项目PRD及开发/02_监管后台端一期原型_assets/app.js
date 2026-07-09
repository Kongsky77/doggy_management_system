    const navButtons = document.querySelectorAll(".nav button");
    const pages = document.querySelectorAll(".page");
    const topbarTitle = document.getElementById("topbarTitle");
    const topbarRangeButtons = document.querySelectorAll(".topbar-range-tabs button");
    const drawerBadge = document.getElementById("drawerBadge");
    const drawerTitle = document.getElementById("drawerTitle");
    const drawerNoteTitle = document.getElementById("drawerNoteTitle");
    const drawerNoteText = document.getElementById("drawerNoteText");
    const drawerBody = document.getElementById("drawerBody");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");
    const drawerResetBtn = document.getElementById("drawerResetBtn");
    const drawerActionBtn = document.getElementById("drawerActionBtn");
    const drawerShell = document.getElementById("drawerShell");
    const drawerOpenBtn = document.getElementById("drawerOpenBtn");
    const topbarMenu = document.querySelector(".topbar-menu");
    const mapMarkers = document.querySelectorAll(".map-marker");
    const mapDetailBadge = document.getElementById("mapDetailBadge");
    const mapDetailTitle = document.getElementById("mapDetailTitle");
    const mapDetailType = document.getElementById("mapDetailType");
    const mapDetailSummaryTitle = document.getElementById("mapDetailSummaryTitle");
    const mapDetailNote = document.getElementById("mapDetailNote");
    const mapDetailBody = document.getElementById("mapDetailBody");
    const archiveTabs = document.querySelectorAll(".archive-tab");
    const archiveList = document.getElementById("archiveList");
    const archiveListTitle = document.getElementById("archiveListTitle");
    const archiveListDesc = document.getElementById("archiveListDesc");
    const archiveListCount = document.getElementById("archiveListCount");
    const archiveDetailTitle = document.getElementById("archiveDetailTitle");
    const archiveDetailSubtitle = document.getElementById("archiveDetailSubtitle");
    const archiveDetailStatus = document.getElementById("archiveDetailStatus");
    const archiveDetailBody = document.getElementById("archiveDetailBody");

    const mapPointDetails = {
      "dog-001": {
        badge: "DOG POINT",
        title: "豆豆 / D-2048",
        noteTitle: "犬只点位",
        noteText: "当前点位为犬只对象，展示犬只状态、主手机号摘要和最近定位时间，可继续跳转对象档案。",
        body: `
          <div class="drawer-block">
            <strong>基础摘要</strong>
            <p>状态：正常<br>主手机号：138****2048<br>最近定位：今日 10:24<br>所属区域：春熙路街道</p>
          </div>
          <div class="drawer-block">
            <strong>关联动作</strong>
            <ul>
              <li>查看犬只档案</li>
              <li>查看最近核验记录</li>
              <li>定位到周边事件</li>
            </ul>
          </div>
        `
      },
      "dog-002": {
        badge: "DOG POINT",
        title: "可乐 / D-3186",
        noteTitle: "犬只点位",
        noteText: "当前犬只免疫即将到期，适合从地图快速进入档案继续判断，不在地图内展开复杂处理流程。",
        body: `
          <div class="drawer-block">
            <strong>基础摘要</strong>
            <p>状态：待关注<br>主手机号：186****3186<br>最近定位：今日 09:42<br>提醒：免疫 7 日内到期</p>
          </div>
          <div class="drawer-block">
            <strong>关联动作</strong>
            <ul>
              <li>查看犬只档案</li>
              <li>查看免疫状态</li>
              <li>查看积分账户摘要</li>
            </ul>
          </div>
        `
      },
      "event-001": {
        badge: "EVENT POINT",
        title: "无证养犬线索",
        noteTitle: "事件点位",
        noteText: "一期地图只展示事件摘要、处理状态、负责辖区和关联犬只，不做完整事件中心。",
        body: `
          <div class="drawer-block">
            <strong>事件摘要</strong>
            <p>风险等级：高<br>发生时间：今日 08:36<br>关联犬只：待核验<br>处理状态：待分派核查</p>
          </div>
          <div class="drawer-block">
            <strong>负责信息</strong>
            <p>负责辖区：牛王庙街道<br>建议动作：街道联合核查<br>快捷入口：查看地图周边点位 / 查看犬只档案</p>
          </div>
        `
      },
      "event-002": {
        badge: "EVENT POINT",
        title: "夜间扰民投诉",
        noteTitle: "事件点位",
        noteText: "该事件已进入处理中状态，地图页主要帮助监管人员确认空间位置和关联对象。",
        body: `
          <div class="drawer-block">
            <strong>事件摘要</strong>
            <p>风险等级：中<br>发生时间：昨晚 21:18<br>关联犬只：D-2761<br>处理状态：处理中</p>
          </div>
          <div class="drawer-block">
            <strong>处理信息</strong>
            <p>处理人：锦江区二中队<br>负责辖区：合江亭片区<br>下一步：查看犬只档案并补充核验记录</p>
          </div>
        `
      },
      "service-001": {
        badge: "SERVICE SITE",
        title: "东湖宠物服务点",
        noteTitle: "服务商点位",
        noteText: "服务商点位用于查看合作状态、核销活跃度和服务覆盖摘要，经营分析不在一期范围内。",
        body: `
          <div class="drawer-block">
            <strong>服务商摘要</strong>
            <p>类型：积分核销服务点<br>合作状态：合作中<br>最近核销：今日 10:12<br>今日核销：18 次</p>
          </div>
          <div class="drawer-block">
            <strong>关联动作</strong>
            <ul>
              <li>查看服务商档案</li>
              <li>查看核销流水摘要</li>
              <li>查看服务覆盖区域</li>
            </ul>
          </div>
        `
      },
      "area-001": {
        badge: "DUTY AREA",
        title: "春熙路责任区",
        noteTitle: "城管任务区域",
        noteText: "城管区域只表达负责辖区和任务覆盖，不展示人员实时定位和轨迹回放。",
        body: `
          <div class="drawer-block">
            <strong>辖区摘要</strong>
            <p>负责队伍：锦江区一中队<br>今日任务：6 单<br>待处理：2 单<br>重点对象：12 个</p>
          </div>
          <div class="drawer-block">
            <strong>区域提示</strong>
            <p>当前区域游客高峰明显，建议继续关注商圈扰民投诉和无牵引遛犬线索。</p>
          </div>
        `
      }
    };

    const archiveData = {
      dogs: {
        title: "犬只列表",
        desc: "默认承接犬只 ID、主手机号和地图点位进入。",
        items: [
          {
            id: "dog-2048",
            name: "豆豆 / D-2048",
            meta: "春熙路街道 · 最近更新 10:24",
            status: "正常",
            statusClass: "good",
            subtitle: "犬只档案，锦江区春熙路街道，最近更新 10:24",
            scoreLabel: "当前积分",
            score: "2,860",
            hero: "狗牌绑定来源：政府统一绑定。主号绑定来源：犬主人端绑定 / 认领。当前设备在线，定位状态稳定。",
            cards: [
              ["基础", "基础信息", "犬种：柯基<br>状态：正常<br>所属区域：春熙路街道"],
              ["狗牌设备", "狗牌 / 设备", "狗牌：TAG-510248<br>设备在线：是<br>最近定位：今日 10:24"],
              ["主手机号", "主手机号", "138****2048<br>绑定状态：已认领<br>积分归属：主手机号"],
              ["积分", "积分摘要", "当前积分：2,860<br>近 30 日新增：+320<br>最近核销：宠物服务"],
              ["定位", "定位状态", "最后点位：IFS 周边<br>定位可信度：高<br>异常：无"],
              ["异常", "异常记录", "近 30 日异常：0<br>投诉关联：0<br>待复查：无"]
            ],
            records: [
              ["今日 10:24", "定位上报", "正常"],
              ["昨天 18:32", "扫码核验", "通过"],
              ["07-05", "积分发放", "+40"],
              ["07-01", "主号认领", "完成"]
            ]
          },
          {
            id: "dog-3186",
            name: "可乐 / D-3186",
            meta: "东湖街道 · 免疫 7 日内到期",
            status: "待关注",
            statusClass: "warn",
            subtitle: "犬只档案，锦江区东湖街道，免疫即将到期",
            scoreLabel: "当前积分",
            score: "1,420",
            hero: "狗牌绑定来源：政府统一绑定。主号绑定来源：犬主人端绑定 / 认领。当前需关注免疫到期提醒。",
            cards: [
              ["基础", "基础信息", "犬种：柴犬<br>状态：待关注<br>所属区域：东湖街道"],
              ["狗牌设备", "狗牌 / 设备", "狗牌：TAG-513186<br>设备在线：是<br>最近定位：今日 09:42"],
              ["主手机号", "主手机号", "186****3186<br>绑定状态：已认领<br>积分归属：主手机号"],
              ["积分", "积分摘要", "当前积分：1,420<br>近 30 日新增：+80<br>最近核销：无"],
              ["定位", "定位状态", "最后点位：东湖公园<br>定位可信度：中<br>异常：免疫到期提醒"],
              ["异常", "异常记录", "近 30 日异常：1<br>投诉关联：0<br>待复查：免疫状态"]
            ],
            records: [
              ["今日 09:42", "定位上报", "正常"],
              ["07-06", "免疫提醒", "待处理"],
              ["07-03", "扫码核验", "通过"],
              ["06-28", "积分发放", "+20"]
            ]
          },
          {
            id: "dog-2761",
            name: "糯米 / D-2761",
            meta: "合江亭片区 · 关联夜间投诉",
            status: "风险",
            statusClass: "risk",
            subtitle: "犬只档案，锦江区合江亭片区，关联夜间扰民投诉",
            scoreLabel: "异常记录",
            score: "2",
            hero: "狗牌绑定来源：政府统一绑定。主号绑定来源：犬主人端绑定 / 认领。当前关联夜间投诉，需查看核验记录。",
            cards: [
              ["基础", "基础信息", "犬种：边牧<br>状态：风险<br>所属区域：合江亭片区"],
              ["狗牌设备", "狗牌 / 设备", "狗牌：TAG-512761<br>设备在线：是<br>最近定位：昨晚 21:18"],
              ["主手机号", "主手机号", "177****2761<br>绑定状态：已认领<br>积分归属：主手机号"],
              ["积分", "积分摘要", "当前积分：860<br>近 30 日变化：-40<br>最近扣减：投诉核验"],
              ["定位", "定位状态", "最后点位：合江亭商圈<br>定位可信度：高<br>异常：夜间高频"],
              ["异常", "异常记录", "近 30 日异常：2<br>投诉关联：1<br>待复查：扰民线索"]
            ],
            records: [
              ["昨晚 21:18", "投诉关联", "处理中"],
              ["07-04", "现场核验", "需复查"],
              ["07-02", "积分扣减", "-40"],
              ["06-29", "定位上报", "正常"]
            ]
          }
        ]
      },
      officers: {
        title: "城管列表",
        desc: "展示城管编号、所属辖区和近期任务量摘要。",
        items: [
          {
            id: "officer-01",
            name: "李明 / CG-018",
            meta: "春熙路街道 · 今日任务 6 单",
            status: "在岗",
            statusClass: "good",
            subtitle: "城管档案，锦江区一中队，负责春熙路街道",
            scoreLabel: "近7日任务",
            score: "42",
            hero: "城管档案只展示任务负责范围、近期核验记录和在管区域摘要，不承接复杂绩效考核。",
            cards: [
              ["基础", "基础信息", "姓名：李明<br>编号：CG-018<br>队伍：锦江区一中队"],
              ["辖区", "所属辖区", "春熙路街道<br>负责重点区域：商圈 / 公园"],
              ["任务范围", "任务负责范围", "犬只核验<br>投诉复查<br>重点区域巡查"],
              ["近期任务", "近期任务", "近 7 日任务：42<br>已完成：37<br>待处理：5"],
              ["核验", "核验记录", "扫码核验：28<br>异常复查：6<br>通过率：91%"],
              ["区域摘要", "在管区域摘要", "热点对象：12<br>高风险事件：2<br>服务点：5"]
            ],
            records: [
              ["今日 10:10", "无证线索核查", "待处理"],
              ["今日 09:30", "犬只扫码核验", "通过"],
              ["昨天 17:20", "投诉复查", "完成"],
              ["07-05", "重点区域巡查", "完成"]
            ]
          },
          {
            id: "officer-02",
            name: "周倩 / CG-026",
            meta: "东湖街道 · 今日任务 4 单",
            status: "在岗",
            statusClass: "good",
            subtitle: "城管档案，锦江区二中队，负责东湖街道",
            scoreLabel: "近7日任务",
            score: "31",
            hero: "该人员近期任务集中在公园场景和免疫到期回访协同，适合从档案查看近期处理情况。",
            cards: [
              ["基础", "基础信息", "姓名：周倩<br>编号：CG-026<br>队伍：锦江区二中队"],
              ["辖区", "所属辖区", "东湖街道<br>负责重点区域：东湖公园"],
              ["任务范围", "任务负责范围", "公园巡查<br>犬只核验<br>宣传提醒"],
              ["近期任务", "近期任务", "近 7 日任务：31<br>已完成：29<br>待处理：2"],
              ["核验", "核验记录", "扫码核验：19<br>异常复查：3<br>通过率：94%"],
              ["区域摘要", "在管区域摘要", "热点对象：8<br>高风险事件：1<br>服务点：4"]
            ],
            records: [
              ["今日 11:05", "公园巡查", "进行中"],
              ["今日 09:48", "免疫提醒协同", "待回访"],
              ["昨天 16:10", "扫码核验", "通过"],
              ["07-05", "宣传提醒", "完成"]
            ]
          }
        ]
      },
      services: {
        title: "服务商列表",
        desc: "展示服务商类型、合作状态和最近核销时间。",
        items: [
          {
            id: "service-01",
            name: "东湖宠物服务点",
            meta: "积分核销服务点 · 最近核销 今日 10:12",
            status: "合作中",
            statusClass: "good",
            subtitle: "服务商档案，东湖街道，积分核销服务点",
            scoreLabel: "本期核销",
            score: "486",
            hero: "服务商档案只展示基础信息、位置、合作状态和积分核销摘要，不做经营分析大盘。",
            cards: [
              ["基础", "基础信息", "名称：东湖宠物服务点<br>类型：积分核销<br>合作状态：合作中"],
              ["位置", "位置", "东湖街道 A-12<br>服务覆盖：东湖公园周边"],
              ["积分核销", "积分核销", "本期核销：486<br>今日核销：18<br>最近核销：10:12"],
              ["服务覆盖", "服务覆盖", "覆盖犬只：1,240<br>活跃账户：386<br>低参与提醒：无"],
              ["合作状态", "合作状态", "协议有效<br>最近巡检：07-05<br>异常：无"],
              ["关联入口", "关联入口", "查看核销流水<br>查看积分效果<br>查看服务商点位"]
            ],
            records: [
              ["今日 10:12", "积分核销", "18 次"],
              ["昨天 18:30", "服务点巡检", "正常"],
              ["07-05", "核销对账", "完成"],
              ["07-01", "合作状态检查", "有效"]
            ]
          },
          {
            id: "service-02",
            name: "春熙路宠物合作店",
            meta: "合作商户 · 最近核销 昨日 18:20",
            status: "观察",
            statusClass: "warn",
            subtitle: "服务商档案，春熙路街道，合作商户",
            scoreLabel: "本期核销",
            score: "132",
            hero: "该服务商本周核销活跃度下降，需要在积分管理页继续观察区域参与率变化。",
            cards: [
              ["基础", "基础信息", "名称：春熙路宠物合作店<br>类型：合作商户<br>合作状态：观察"],
              ["位置", "位置", "春熙路商圈 B-08<br>服务覆盖：商圈周边"],
              ["积分核销", "积分核销", "本期核销：132<br>今日核销：2<br>最近核销：昨日 18:20"],
              ["服务覆盖", "服务覆盖", "覆盖犬只：680<br>活跃账户：126<br>低参与提醒：有"],
              ["合作状态", "合作状态", "协议有效<br>最近巡检：07-02<br>异常：活跃下降"],
              ["关联入口", "关联入口", "查看核销流水<br>查看积分效果<br>查看服务商点位"]
            ],
            records: [
              ["昨日 18:20", "积分核销", "2 次"],
              ["07-06", "活跃下降提醒", "观察"],
              ["07-02", "服务点巡检", "正常"],
              ["07-01", "核销对账", "完成"]
            ]
          }
        ]
      }
    };

    const pageMeta = {
      dashboard: {
        title: "治理驾驶舱",
        desc: "基于 CDHT 橙色主视觉与现代结构化工作台风格，先看全局指标，再定位风险区域，最后判断治理成效。",
        badge: "DASHBOARD READY",
        drawerTitle: "全局抽屉组件",
        noteTitle: "当前承接",
        noteText: "当前在治理驾驶舱里，右侧抽屉承接筛选说明和监管关注点。地图工作台已改为页面内右侧详情卡承接点位与轻量闭环。",
        body: `
          <div class="drawer-block">
            <strong>这次已经落下来的内容</strong>
            <ul>
              <li>统一后台骨架切换为 CDHT 橙色主视觉与温和结构化治理风格</li>
              <li>治理驾驶舱筛选条与 6 张指标卡</li>
              <li>65% 地图主视觉 + 35% 风险提醒</li>
              <li>趋势、排行、治理成效三组信息区</li>
            </ul>
          </div>
          <div class="drawer-block">
            <strong>筛选口径说明</strong>
            <p>当前演示数据默认按“锦江区 / 近 7 天 / 犬只全量”聚合。风险指数由投诉频次、办证状态、免疫状态与巡查结果综合生成，用于演示监管端的扫读逻辑。</p>
          </div>
        `
      },
      map: {
        title: "地图工作台",
        desc: "顶部连续过滤、中部大地图、右侧详情承接与底部统计收口，聚焦空间监管和轻量事件闭环。",
        badge: "MAP WORKBENCH",
        drawerTitle: "地图工作台说明",
        noteTitle: "页面内承接",
        noteText: "地图页现在以右侧详情卡承接点位信息，抽屉只保留为全局说明入口。",
        body: `
          <div class="drawer-block">
            <strong>本页结构</strong>
            <p>地图工作台采用顶部连续筛选、图层 chip、大地图、右侧详情卡与底部 8 项统计条。点位点击不会打开全局抽屉，而是在页面内刷新详情。</p>
          </div>
          <div class="drawer-block">
            <strong>一期边界</strong>
            <ul>
              <li>展示犬只、事件、辖区、服务商和重点区域</li>
              <li>支持事件摘要、当前状态和负责辖区查看</li>
              <li>不展示城管实时定位，不做轨迹回放</li>
            </ul>
          </div>
        `
      },
      archive: {
        title: "对象档案",
        desc: "承接驾驶舱、地图和全局搜索进入的对象查询，默认查看犬只档案。",
        badge: "对象档案",
        drawerTitle: "对象档案说明",
        noteTitle: "当前承接",
        noteText: "对象档案主工作区采用左列表右详情结构，覆盖犬只、城管、服务商三类主体。右侧抽屉只保留辅助说明，不替代详情区。",
        body: `
          <div class="drawer-block">
            <strong>本页已经落下来的内容</strong>
            <ul>
              <li>犬只 / 城管 / 服务商三类 tab</li>
              <li>左侧对象列表与右侧详情联动</li>
              <li>犬只详情展示狗牌绑定来源与主号绑定来源</li>
              <li>服务商档案展示积分核销摘要</li>
            </ul>
          </div>
          <div class="drawer-block">
            <strong>一期边界</strong>
            <p>本页不新增独立犬主管理、城管管理或服务商经营后台，只在对象档案中承接查询和详情查看。</p>
          </div>
        `
      },
      points: {
        title: "积分管理",
        desc: "查看积分参与、规则命中、账户状态、流水抽样与治理效果，形成监管激励闭环。",
        badge: "积分管理",
        drawerTitle: "积分管理说明",
        noteTitle: "当前承接",
        noteText: "积分管理页围绕监管端需要的指标、规则、账户、流水和效果展开。右侧抽屉保留规则解释与一期边界说明，避免把本页做成复杂运营后台。",
        body: `
          <div class="drawer-block">
            <strong>本页已经落下来的内容</strong>
            <ul>
              <li>积分参与率、活跃账户、发放、核销、服务核销和异常账户 6 个指标</li>
              <li>规则清单采用展示型设计，只展示触发行为、分值、状态和适用范围</li>
              <li>账户概览以主手机号为归属对象，承接犬只关联和账户状态</li>
              <li>流水与治理效果用于抽样复核和判断积分机制有效性</li>
            </ul>
          </div>
          <div class="drawer-block">
            <strong>一期边界</strong>
            <p>本期不开放手动调分、不建设复杂权益商城，也不替代业务经营分析；监管端只看积分机制是否被正确触发、是否存在异常账户，以及是否带来治理行为改善。</p>
          </div>
        `
      }
    };

    function syncDrawer(key) {
      const meta = pageMeta[key];
      drawerBadge.textContent = meta.badge;
      drawerTitle.textContent = meta.drawerTitle;
      drawerNoteTitle.textContent = meta.noteTitle;
      drawerNoteText.textContent = meta.noteText;
      drawerBody.innerHTML = meta.body;
    }

    function openDrawer() {
      document.body.classList.add("drawer-open");
      drawerShell.setAttribute("aria-hidden", "false");
      drawerOpenBtn.setAttribute("aria-expanded", "true");
    }

    function closeDrawer() {
      document.body.classList.remove("drawer-open");
      drawerShell.setAttribute("aria-hidden", "true");
      drawerOpenBtn.setAttribute("aria-expanded", "false");
    }

    function syncMapPoint(pointKey, shouldOpen = false) {
      const point = mapPointDetails[pointKey];
      if (!point) return;

      if (mapDetailBadge && mapDetailTitle && mapDetailBody) {
        mapDetailBadge.textContent = point.badge;
        mapDetailTitle.textContent = point.title;
        mapDetailType.textContent = point.noteTitle;
        mapDetailSummaryTitle.textContent = point.title;
        mapDetailNote.textContent = point.noteText;
        mapDetailBody.innerHTML = point.body.replaceAll("drawer-block", "map-detail-block");
      }

      if (shouldOpen) {
        drawerBadge.textContent = point.badge;
        drawerTitle.textContent = point.title;
        drawerNoteTitle.textContent = point.noteTitle;
        drawerNoteText.textContent = point.noteText;
        drawerBody.innerHTML = point.body;
        openDrawer();
      }

      mapMarkers.forEach((marker) => {
        marker.classList.toggle("active", marker.dataset.point === pointKey);
      });
    }

    function renderArchiveDetail(item) {
      archiveDetailTitle.textContent = item.name;
      archiveDetailSubtitle.textContent = item.subtitle;
      archiveDetailStatus.textContent = item.status;
      archiveDetailStatus.className = `status-tag ${item.statusClass}`;

      const cards = item.cards.map(([, title, text]) => `
        <section class="detail-card">
          <strong>${title}</strong>
          <p>${text}</p>
        </section>
      `).join("");

      const records = item.records.map(([time, action, status]) => `
        <div class="record-row">
          <time>${time}</time>
          <b>${action}</b>
          <span>${status}</span>
        </div>
      `).join("");

      archiveDetailBody.innerHTML = `
        <section class="object-hero">
          <div>
            <h2>${item.name}</h2>
            <p>${item.hero}</p>
          </div>
          <div class="object-score">
            <small>${item.scoreLabel}</small>
            <strong>${item.score}</strong>
          </div>
        </section>

        <section class="detail-grid">${cards}</section>

        <section class="record-grid">
          <div class="record-panel">
            <small>近期记录</small>
            <div class="record-list">${records}</div>
          </div>
          <div class="record-panel">
            <small>关联说明</small>
            <p>当前详情可从驾驶舱指标、地图点位或全局搜索进入。后续第 6 步会继续补齐跨页跳转和模拟数据联动。</p>
          </div>
        </section>
      `;
    }

    function renderArchive(tabKey, itemId) {
      const group = archiveData[tabKey];
      if (!group) return;

      archiveTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.archiveTab === tabKey);
      });

      archiveListTitle.textContent = group.title;
      archiveListDesc.textContent = group.desc;
      archiveListCount.textContent = `${group.items.length} 条`;

      const selected = group.items.find((item) => item.id === itemId) || group.items[0];
      archiveList.innerHTML = group.items.map((item) => `
        <button class="archive-list-item ${item.id === selected.id ? "active" : ""}" type="button" data-archive-tab="${tabKey}" data-archive-id="${item.id}">
          <div>
            <strong>${item.name}</strong>
            <small>${item.meta}</small>
          </div>
          <span class="status-tag ${item.statusClass}">${item.status}</span>
        </button>
      `).join("");

      renderArchiveDetail(selected);

      archiveList.querySelectorAll(".archive-list-item").forEach((button) => {
        button.addEventListener("click", () => renderArchive(button.dataset.archiveTab, button.dataset.archiveId));
      });
    }

    function activatePage(key) {
      navButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.page === key);
      });

      pages.forEach((page) => {
        page.classList.toggle("active", page.id === `page-${key}`);
      });

      topbarTitle.textContent = pageMeta[key].title;
      syncDrawer(key);
      if (key === "map") {
        syncMapPoint("dog-001");
      }
      if (key === "archive") {
        renderArchive("dogs");
      }
    }

    navButtons.forEach((button) => {
      button.addEventListener("click", () => activatePage(button.dataset.page));
    });

    topbarMenu.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-compact");
      const compact = document.body.classList.contains("sidebar-compact");
      topbarMenu.setAttribute("aria-pressed", String(compact));
    });

    topbarRangeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        topbarRangeButtons.forEach((item) => item.classList.toggle("active", item === button));
      });
    });

    mapMarkers.forEach((marker) => {
      marker.addEventListener("click", () => syncMapPoint(marker.dataset.point));
    });

    archiveTabs.forEach((tab) => {
      tab.addEventListener("click", () => renderArchive(tab.dataset.archiveTab));
    });

    closeDrawerBtn.addEventListener("click", () => {
      closeDrawer();
    });

    drawerOpenBtn.addEventListener("click", () => {
      const activeButton = document.querySelector(".nav button.active");
      const activePage = activeButton?.dataset.page || "dashboard";
      if (activePage === "map") {
        const activeMarker = document.querySelector(".map-marker.active") || document.querySelector(".map-marker");
        syncMapPoint(activeMarker?.dataset.point || "dog-001");
      } else {
        syncDrawer(activePage);
      }
      openDrawer();
    });

    drawerResetBtn.addEventListener("click", () => {
      const activeButton = document.querySelector(".nav button.active");
      if (activeButton.dataset.page === "map") {
        syncMapPoint("dog-001");
      } else if (activeButton.dataset.page === "archive") {
        syncDrawer("archive");
        renderArchive("dogs");
      } else {
        syncDrawer(activeButton.dataset.page);
      }
      openDrawer();
    });

    drawerActionBtn.addEventListener("click", () => {
      const order = ["dashboard", "map", "archive", "points"];
      const activeButton = document.querySelector(".nav button.active");
      const currentIndex = order.indexOf(activeButton.dataset.page);
      const nextKey = order[(currentIndex + 1) % order.length];
      activatePage(nextKey);
    });

    closeDrawer();
