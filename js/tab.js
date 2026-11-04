/* ============================================================
 * 可复用 Tab 选项卡组件
 * 作者：戚瑞雯    创建时间：2026-11-04
 * 用法：页面引入本文件后，给选项卡容器加 data-tabs 属性即可自动初始化；
 *       也可手动调用 initTabs(容器DOM) 初始化任意多组选项卡。
 *       容器内每个按钮需带 data-panel="名称"，对应面板 id 为 panel-名称。
 * 
 * ============================================================ */
    //DOM查找方式
    //1.按照类选择器名称查找：getElementsByClassName()
    //2.按照标签选择器名称查找：getElementsByTagName()
    //3.按照选择器查找：querySelector()、querySelectorAll()
    //4.按照属性值查找：getElementsByAttribute()
(function () {
  "use strict";

  // 函数功能：初始化一组 Tab 选项卡——给容器绑定点击监听事件（事件委托），并把"清除全部选中 → 设置当前选中"的切换逻辑封装起来
  function initTabs(tabBar) {
    var buttons = tabBar.querySelectorAll("button");

    // 函数功能：切换选中状态——先清除所有选项卡按钮和面板的选中状态，再设置当前按钮及其对应面板为选中
    function activate(btn) {
      /* 第一步：先清除所有选项卡的选中状态 */
      buttons.forEach(function (b) {
        b.classList.remove("active");
      });
      document.querySelectorAll(".tab-panel").forEach(function (p) {
        p.classList.remove("active");
      });

      /* 第二步：再设置当前元素的选中状态 */
      btn.classList.add("active");
      var panel = document.getElementById("panel-" + btn.getAttribute("data-panel"));
      if (panel) panel.classList.add("active");
    }

    /* 监听事件：点击事件委托到选项卡容器上，点击任意按钮都触发切换 */
    tabBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;          // 点在空白处不处理
      if (btn.classList.contains("active")) return; // 已选中不重复切换
      activate(btn);
    });
  }

  // 函数功能：页面加载完成后，自动初始化页面中所有带 data-tabs 属性的选项卡容器
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-tabs]").forEach(initTabs);
  });

  // 暴露到全局，供其他页面手动调用，实现复用
  window.initTabs = initTabs;
})();
