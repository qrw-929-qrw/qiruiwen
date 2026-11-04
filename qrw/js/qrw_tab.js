/* ============================================================
 * 旅游投诉新闻 Tab 选项卡 —— 交互脚本
 * 作者：戚瑞雯（qrw）    创建时间：2026-11-04
 * 规则：本文件所有 JS 变量 / 函数名均以 qrw_ 开头
 * 功能：点击选项卡切换对应新闻面板，默认选中"最新投诉"
 * ============================================================ */
(function () {
  "use strict";

  var qrw_nav = document.getElementById("qrw_tabNav");        // 选项卡导航栏
  var qrw_btns = qrw_nav.querySelectorAll("li");              // 3 个选项卡按钮
  var qrw_panels = document.querySelectorAll(".qrw_panel");   // 3 个新闻面板

  /* 函数功能：切换选项卡——先清除所有选项卡按钮和面板的选中状态（qrw_active），
     再设置当前点击的选项卡按钮及其对应面板为选中状态。作者：戚瑞雯（qrw） */
  function qrw_switchTab(qrw_btn) {
    /* 第一步：先清除所有选项卡的选中状态 */
    qrw_btns.forEach(function (qrw_b) {
      qrw_b.classList.remove("qrw_active");
    });
    qrw_panels.forEach(function (qrw_p) {
      qrw_p.classList.remove("qrw_active");
    });

    /* 第二步：再设置当前元素的选中状态 */
    qrw_btn.classList.add("qrw_active");
    var qrw_idx = Array.prototype.indexOf.call(qrw_btns, qrw_btn);
    if (qrw_panels[qrw_idx]) {
      qrw_panels[qrw_idx].classList.add("qrw_active");
    }
  }

  /* 监听事件：点击事件委托到选项卡导航栏上，点击任意选项卡触发切换。
     作者：戚瑞雯（qrw） */
  qrw_nav.addEventListener("click", function (qrw_e) {
    var qrw_btn = qrw_e.target.closest("li");
    if (!qrw_btn) return;                                    // 点在导航栏空白处不处理
    if (qrw_btn.classList.contains("qrw_active")) return;    // 已选中的不重复切换
    qrw_switchTab(qrw_btn);
  });
})();
