# Swiper 课堂作业记录 · 任务一 / 任务二 / 任务三

> 作者：戚瑞雯（qrw）　创建时间：2026-11-11　使用大模型：DeepSeek-V4.1-Flash（Trae）
> 配套页面：[swiper-task.html](swiper-task.html)

---

## 任务一 · 提示词工程师：让 AI 听懂需求

### 一、把需求翻译成 4 个配置点

| 需求原文 | 对应配置 | 我写进提示词的"硬约束" |
|---|---|---|
| ① 无缝循环 | `loop` | `loop: true` |
| ② 3.2 秒自动翻页、拖动后不停止 | `autoplay` | `autoplay: { delay: 3200, disableOnInteraction: false }` |
| ③ 圆点分页器可点击 | `pagination` | `pagination: { el: '#wyPag4', clickable: true }` |
| ④ 初始效果为 cube | `effect` / `speed` | `effect: 'cube'`，`speed: 800` |

### 二、第 1 轮提示词（故意写得很随意）

```
帮我写一个 Swiper 轮播的初始化配置，要能循环播放、自动播放、有分页器、立方体效果。
```

**AI 第 1 版输出（关键片段）：**

```js
new Swiper('#wySw4', {
  loop: true,
  autoplay: 3000,
  pagination: { el: '.swiper-pagination' },
  effect: 'cube'
});
```

**第 1 版的问题（我逐条对照需求找出来的）：**

1. `autoplay: 3000` 用了数字简写 → 没有 `disableOnInteraction: false`，**用户拖动后自动播放会停止**（默认 true），与需求②冲突；
2. 延迟是 3000 而不是 3200；
3. `pagination` 只写了 `el`，没写 `clickable: true` → **圆点点了不动**，与需求③冲突；
4. 选择器用默认类名 `.swiper-pagination`，页面上分页器是 `#wyPag4`，多轮播页面会串台；
5. 没写 `speed`，切换动画是默认 300ms，切换太"急"。

> 截图位 ①：第 1 轮对话（提示词 + AI 首版代码）

### 三、第 2 轮提示词（把"目标"改成"可验证的约束"）

```
基于页面里已有的 <div class="swiper" id="wySw4">，输出 Swiper 11 的初始化代码，必须同时满足：
1) loop: true（最后一张往后翻回到第一张）
2) autoplay.delay = 3200 毫秒，并且 disableOnInteraction: false（用户拖动松手后自动播放继续）
3) 分页器使用页面中已有的 id 为 wyPag4 的元素，clickable: true（圆点可点击跳转）
4) 初始 effect 为 'cube'，切换动画 speed 为 800 毫秒
5) 只输出一段可直接粘贴的 JS，不要解释文字
```

**AI 第 2 版输出（终稿，已粘贴进页面）：**

```js
var qrw_swiper4Cfg = {
  loop: true,
  effect: 'cube',
  speed: 800,
  autoplay: { delay: 3200, disableOnInteraction: false },
  pagination: { el: '#wyPag4', clickable: true }
};
var qrw_swiper4 = new Swiper('#wySw4', qrw_swiper4Cfg);
```

> 截图位 ②：第 2 轮对话（补充提示词 + 修正后的代码）

### 四、验证记录

| 轮次 | 验证动作 | 结论 |
|---|---|---|
| 第 1 版 | 拖动一次后停手，观察是否继续自动翻页 | ❌ 不继续翻 → 缺少 `disableOnInteraction: false` |
| 第 2 版 | 拖动松手等 3.2 秒；点第 3 个圆点；点 cube 后的 3D 效果 | ✅ 自动继续、圆点可跳转、立方体生效 |

### 五、答辩

**Q1：你的第一版提示词漏掉了哪个需求？**
A：四个需求都"提了"，但都只给了**方向**没给**验收标准**：没写 3200ms 这个数值、没说"拖动后自动播放要继续"（`disableOnInteraction: false`）、没说圆点要可点（`clickable`）、也没指定分页器的具体元素 id 和动画时长。结果是 AI 只能按默认值猜。

**Q2：你是怎么在第二轮里"说清楚"的？**
A：把模糊目标改写成**可检查的约束**——每一条都写清 ① 配置项路径（如 `autoplay.delay`）② 具体取值 ③ 对应的页面元素 ④ 期望的行为现象。再追加"只输出代码"，避免在解释文字里夹带错误信息。

**Q3：AI 第一次给的代码错在哪？**
A：三处实质错误——① `autoplay` 用数字简写，拖动后自动播放会停；② `pagination` 缺 `clickable`，圆点不可点；③ 分页器选择器是类名而非页面里的 `#wyPag4`，多轮播页面会串台。另有两处"能用但不合要求"：延迟 3000≠3200、缺 `speed: 800`。

---

## 任务二 · creative 仿写：课堂没讲，AI 教我

### 一、先读官方示例

我打开 `swiper/demo/257-effect-creative.html`，发现它只写了一个空壳：

```js
effect: 'creative',
creativeEffect: {
  prev: { shadow: true, translate: [0, 0, -400] },
  next: { translate: ['100%', 0, 0] }
}
```

读懂的结论：`creativeEffect` 是一个**"状态描述"对象**——`prev` 描述"已经退到左边那张"要变成什么样，`next` 描述"还在右边等着进来那张"当前是什么样，中间过程由 Swiper 按 `translate / rotate / scale / opacity` 自动插值。

### 二、我要的"电影投影"参数

```js
creativeEffect: {
  limitProgress: 2,                    // 允许前后各堆叠一层"胶片"
  prev: {
    translate: ['-42%', 0, -400],      // 左退 42%，z 轴再远离观众 400px
    rotate: [0, 0, -10],               // 逆时针倾斜 10°
    scale: 0.72,                       // 缩小到 72%
    opacity: 0.38                      // 压暗，退到后景
  },
  next: {
    translate: ['112%', 0, 140],       // 停在右侧屏外、且比屏幕更靠近观众
    rotate: [0, 0, 9],                 // 顺时针倾斜 9°
    scale: 1.18,                       // 放大到 118%
    opacity: 0.3                       // 半透明
  }
}
```

**为什么这样就像"电影投影"：** 上一张缩成小片、带角度歪在左后方并压暗，像放映机后面垂着的旧胶片；下一张比你正看的那幅**更大**，从右侧斜着扑进来，再落回正常尺寸，形成"投影打过来"的压迫感。

### 三、prev / next 的 transform 各控制什么（答辩）

- **`prev`**：控制"刚被翻过去、退到左侧的那一张"的**终态**。
  - `translate: ['-42%', 0, -400]` → x 轴左移 42%、z 轴后退 400px（后退 = 视觉变小、变远）；
  - `rotate: [0, 0, -10]` → 在屏幕平面内逆时针歪 10°；
  - `scale: 0.72` → 再额外缩小到 72%；
  - `opacity: 0.38` → 压暗，制造景深。
- **`next`**：控制"还在右侧、尚未进场的那一张"的**初始态**。
  - `translate: ['112%', 0, 140]` → 停在容器右侧之外，且 z 轴**朝观众方向**前进 140px；
  - `scale: 1.18` → 比当前图更大（这就是"放大"的来源）；
  - `rotate: [0, 0, 9]` → 顺时针带一点角度；
  - `opacity: 0.3` → 入场前半透明。
  - 切换时这一张从该状态插值回到"居中、scale 1、opacity 1"，看起来就是**放大右移着滑进来**。

### 四、追问 AI 后确认的两点

**Q1：`transform` 里那些百分号是相对的？**
A：相对**轮播容器（`.swiper`）自身尺寸**，不是相对图片：`translate` 的 x 用容器宽度的百分比、y 用容器高度的百分比。所以容器换成响应式宽度时，参数不用重算。

**Q2：改一个数值让下一张转 20 度？**
A：改 `next.rotate` 的第三个数——`rotate: [0, 0, 20]`。三个数分别绕 X / Y / Z 轴：X 轴是上下翻转、Y 轴是左右翻牌、Z 轴才是"屏幕平面内打转"。想做立体翻牌要改第一个或第二个数。

---

## 任务三 · 综合创作 + 技术答辩

### 一、第六件展品：爱达·魔都号

- **配图**：AI 生成，横版 16:9（2560×1440），保存为 `swiper-imgs/ada_modu.jpg`；
  提示词要点："国产大型邮轮、船坞港口黄昏、船身彩绘、低空三分之四视角、电影感纪实摄影、16:9 无人无文字"。
- **结构**（四个演示台都补齐，保证整套"光影展"完整）：

```html
<div class="swiper-slide">
  <img src="swiper-imgs/ada_modu.jpg" alt="爱达·魔都号">
  <div class="wy-cap">
    <h3>爱达·魔都号</h3>
    <p>2024 年 1 月商业首航 · 首艘国产大型邮轮</p>
  </div>
</div>
```

- **为什么只加 HTML 就够**：`swiper-slide` 由 Swiper 自动计数，圆点分页器、loop、autoplay 都按实际张数重新计算，不需要改 JS。

### 二、加分能力：keyboard 键盘控制

```js
keyboard: { enabled: true, onlyInViewport: true }
```

- `enabled: true`：开启键盘控制，聚焦轮播后按 ← / → 切换；
- `onlyInViewport: true`：**只有轮播在视口内时**按键才生效。本页有 4 个轮播，没有这一项会出现"按一次键 4 个轮播一起翻"。

### 三、技术答辩

**Q1：这段代码什么意思？**
A：`keyboard` 是 Swiper 的键盘模块配置。`enabled` 打开键盘控制，左右方向键触发上/下一张；`onlyInViewport` 用 IntersectionObserver 判断当前轮播是否可见，不可见时忽略按键，避免多轮播页面同时响应。

**Q2：AI 第一次给的不对在哪？**
A：AI 第一版给的是 `keyboard: true`（Swiper 5 时代的布尔写法）。Swiper 8 之后该参数只接受对象，布尔值会被忽略——表现就是"写了但按键没反应"；而且它没有加 `onlyInViewport`，页面上 4 个轮播会同时被同一个按键驱动。

**Q3：新增的作用？**
A：一是**可访问性**：不用鼠标也能翻页，键盘用户/读屏用户可用；二是**体验**：看大图时手不用在鼠标和方向键之间来回切换。

---

## 验收自测清单

| 项目 | 结果 |
|---|---|
| 演示四点"creative 电影投影"按钮 → 按钮高亮、图片正常显示、不白屏 | ✅ |
| 演示四共 6 张，最后一张"爱达·魔都号"图片正常加载 | ✅ |
| 浏览器控制台无 JS 报错 | ✅ |
| 演示四在视口内按 ← / → 可切换 | ✅ |
| 其余 6 种效果切换仍正常 | ✅ |
