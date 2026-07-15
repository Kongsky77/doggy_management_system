document.querySelectorAll('.heat-period').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.heat-period').forEach((item) => item.classList.toggle('active', item === button));
    const summary = document.querySelector('#heatSummary');
    const content = {
      '近 7 日': '<b>晚间 18:00–22:00</b> 为最高活跃时段',
      '早间': '<b>东湖街道</b> 早间遛狗活跃度最高',
      '晚间': '<b>春熙路街道</b> 晚间热度较上周上升 18.6%'
    };
    summary.innerHTML = content[button.textContent] || content['近 7 日'];
  });
});
