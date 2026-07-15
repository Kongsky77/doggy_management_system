const insightRankData = [
  [
    ['624', '+12%'], ['495', '+8%'], ['402', '+38%'], ['268', '-4%'], ['207', '+6%'], ['165', '+9%'], ['109', '+3%'], ['93', '-2%'], ['64', '+5%'], ['58', '+1%']
  ],
  [
    ['1,148', '+15%'], ['792', '+18%'], ['660', '+9%'], ['448', '-3%'], ['272', '+6%'], ['168', '+4%'], ['144', '+11%'], ['116', '+2%'], ['84', '-5%'], ['72', '+1%']
  ]
];

document.querySelectorAll('.dashboard-insight-grid .rank-list').forEach((list, listIndex) => {
  list.querySelectorAll('li').forEach((row, rowIndex) => {
    const [count, delta] = insightRankData[listIndex][rowIndex];
    const proportion = row.querySelector('.rank-value').textContent;
    row.querySelector('.rank-value').textContent = count;
    const shareNode = document.createElement('span');
    shareNode.className = 'rank-share';
    shareNode.textContent = proportion;
    const deltaNode = document.createElement('em');
    deltaNode.className = `rank-delta ${delta.startsWith('+') ? 'up' : 'down'}`;
    deltaNode.textContent = delta;
    row.append(shareNode, deltaNode);
  });
});
