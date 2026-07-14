const pointsTabs = document.querySelector('#pointsTabs');
const pointsContent = document.querySelector('#pointsContent');

function renderAnalysisChart() {
  pointsContent.innerHTML = `<div class="analysis-grid"><section class="analysis-box"><h3>近 7 日积分流转趋势</h3><p>发放与核销均按自然日汇总</p><div class="chart-caption"><span>单位：积分</span><div class="chart-legend"><span><i class="orange-line"></i>发放</span><span><i class="blue-line"></i>核销</span></div></div><div class="chart-canvas line-chart analysis-line-chart"><svg viewBox="0 0 520 180" role="img" aria-label="近七日积分发放与核销趋势图"><g class="chart-grid"><path d="M46 14H510M46 52H510M46 90H510M46 128H510M46 150H510"/></g><g class="chart-y"><text x="0" y="18">6k</text><text x="0" y="56">4k</text><text x="0" y="94">2k</text><text x="20" y="154">0</text></g><path class="series grant" d="M56 118 L124 100 L192 72 L260 86 L328 48 L396 68 L464 36"/><path class="series redeem" d="M56 132 L124 120 L192 98 L260 108 L328 76 L396 94 L464 60"/><g class="chart-points grant"><circle cx="56" cy="118" r="3"/><circle cx="124" cy="100" r="3"/><circle cx="192" cy="72" r="3"/><circle cx="260" cy="86" r="3"/><circle cx="328" cy="48" r="3"/><circle cx="396" cy="68" r="3"/><circle cx="464" cy="36" r="3"/></g><g class="chart-x"><text x="53" y="174">一</text><text x="121" y="174">二</text><text x="189" y="174">三</text><text x="257" y="174">四</text><text x="325" y="174">五</text><text x="393" y="174">六</text><text x="461" y="174">日</text></g></svg></div></section><section class="analysis-box"><h3>积分使用率</h3><p>本周期核销积分 ÷ 发放积分</p><div class="donut"></div><p style="text-align:center">21,320 / 28,640 积分</p></section></div><div class="analysis-grid" style="padding-top:0"><section class="analysis-box"><h3>核销服务商 Top 3</h3><div class="mini-list"><span>东湖宠物服务点 <b>486</b></span><span>春熙路宠物医院 <b>132</b></span><span>乐犬生活馆 <b>27</b></span></div></section><section class="analysis-box"><h3>口径说明</h3><p>当本周期发放积分为 0 时，使用率显示“暂无可计算数据”，不以 0% 替代。</p></section></div>`;
}

pointsTabs.addEventListener('click', (event) => {
  const tab = event.target.closest('[data-point-tab="analysis"]');
  if (tab) renderAnalysisChart();
});
