const archiveTabLabels = {
  dogs: '新增犬只',
  officers: '新增城管队员',
  services: '新增服务商',
  areas: '新增地图区域'
};

const archiveNewButton = document.querySelector('#newObject');
const archiveTabGroup = document.querySelector('#archiveTabs');
const archiveModal = document.querySelector('#formModal');
const archiveModalKicker = document.querySelector('#modalKicker');
const archiveModalTitle = document.querySelector('#modalTitle');
const archiveModalForm = document.querySelector('#modalForm');

function updateArchiveNewButton(type) {
  archiveNewButton.textContent = `＋ ${archiveTabLabels[type]}`;
}

function newObjectFields(type) {
  const fields = {
    dogs: [['犬只姓名', 'name'], ['品种 / 年龄 / 性别', 'sub'], ['犬只 ID', 'id'], ['狗牌编号与种类', 'tag'], ['内部设备编号（电子狗牌必填）', 'device'], ['犬主人手机号', 'phone']],
    officers: [['姓名', 'name'], ['队员编号', 'id'], ['所属大队', 'team'], ['辖区', 'area']],
    services: [['服务商名称', 'name'], ['服务商类别', 'sub'], ['服务商编号', 'id'], ['服务商品质', 'quality'], ['服务地址', 'address']],
    areas: [['区域名称', 'name'], ['区域类型', 'sub'], ['区域编号', 'id'], ['所属街道 / 社区', 'location'], ['位置与边界描述', 'boundary']]
  };
  return fields[type];
}

function openNewObjectForm(type) {
  const objectName = archiveTabLabels[type].replace('新增', '');
  modalMode = 'new-object';
  archiveModalKicker.textContent = '新增对象';
  archiveModalTitle.textContent = archiveTabLabels[type];
  archiveModalForm.innerHTML = newObjectFields(type).map(([label, name]) => `<label>${label}<input name="${name}" required></label>`).join('') + `<div class="reason-note">保存后会生成操作历史；删除、下线和恢复需在详情中另行填写原因。</div>`;
  archiveModal.classList.add('open');
}

updateArchiveNewButton('dogs');
archiveTabGroup.addEventListener('click', (event) => {
  const tab = event.target.closest('[data-type]');
  if (tab) updateArchiveNewButton(tab.dataset.type);
});

archiveNewButton.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
  openNewObjectForm(currentType);
}, true);
