# 09 — 真实试玩 QA 修复计划与执行状态

## 总体结论

真实试玩问题对应的 Batch A、Batch B、Batch C 已全部完成代码实现。

本地 Chromium 已完成两组交互 Gate：

- 主 QA Gate：**36 / 36 通过，0 失败**。
- 首次推进规则 Gate：**20 / 20 通过，0 失败**。

DAY 1 的“4 道鸡蛋菜争抢 3 个鸡蛋”结构、8 关库存和菜谱数值没有被改变。

当前剩余工作只与正式 PNG 和最终部署入口有关。

## Batch A — 可发布基础

状态：**完成并通过浏览器 Gate。**

已修复：

- QA-001：移除 DOM ID 自动暴露到 `window` 的事件依赖；`play.html` 不再承担 `close/confirm` iframe 补丁。
- QA-002：烹饪改为事务式提交；机会成本提示只点名真正导致方案关闭的耗尽资源。
- QA-006：DAY 1 恢复浪费金额；非满分优先“重新规划”；100% 恢复精算规划型、鸡蛋 MVP。
- QA-007：所有食材增加名称 fallback，白菜 / 生菜可直接区分。
- QA-008：`100svh` 弹性布局、即期 Chip 换行、短屏适配。
- QA-009：主要 Hitbox 提高到约 44×44px 或更大。

DAY 2–8 的逐食材 `wasteValue` 没有完整正式数据，因此没有自行编造；无法计算时结算金额显示 `—`。

## Batch B — 核心交互

状态：**QA-003 / 004 / 005 完成并通过浏览器 Gate；QA-010 接入层完成，正式 PNG 待恢复。**

### QA-003 菜谱点击高亮

- 点击菜谱只高亮当前仍在库存中的对应食材。
- 抽屉自动收起。
- 高亮约 800ms 后解除。
- 不自动加入、不扣库存、不自动开火。

浏览器验证：点击“番茄炒蛋”实际高亮 2 个对应食材，料理槽保持为空。

### QA-004 Pointer Events 拖拽

- 支持 `pointerdown / pointermove / pointerup / pointercancel`。
- 8px 位移阈值后进入拖拽。
- 有 Ghost 与 drop target 反馈。
- 放入料理区调用与点击相同的 `addIngredient()`。
- 拖拽后抑制紧随其后的 click，避免重复加入。

浏览器验证：真实鼠标把鸡蛋拖入料理槽，只加入 1 个鸡蛋。

### QA-005 两步教学

首次 DAY 1：

1. `点击或拖动食材，把它放进料理区。`
2. 第一次 READY 时：`配方凑齐了，开火试试。`

第一次成功开火后写入教学完成状态，重新规划不重复强制播放。

### QA-010 DAY 1 正式资产

已完成：

- DAY 1 固定空间摆位。
- `Ingredient.asset` 接口。
- UI 动态数量、“今天”、预扣与高亮层。
- 正式资源目录骨架：
  - `game/assets/ingredients/day1/`
  - `game/assets/dishes/day1/`
  - `game/assets/scene/day1/`

未完成原因：此前已验收的正式 PNG 从未进入 Git，当前环境也没有原文件，无法从历史恢复。

资产阻塞追踪：Issue #2。

## Batch C — 奖励与完整性

状态：**完成并通过浏览器 Gate；正式菜品图片待恢复。**

### QA-011 做菜奖励反馈

- READY 后约 800ms `cooking` 状态。
- 烹饪期间锁定冰箱、菜单、料理槽、清空、结束与重复开火。
- 锅体轻量动画。
- 约 800ms 后再次验证并一次性提交库存。
- 完成后显示短奖励卡。
- 今晚菜单升级为缩略条；点击完成菜查看人份、时间、kcal。
- `DISH_ASSETS` 已预留正式菜品图片入口。

浏览器验证：烹饪中删除按钮无法撤回；完成后菜品详情正确显示。

### QA-012 DAY 8 完成态

- 满足首次完成门槛后写入 `P.completed=true`。
- 结果页显示“完成计划”。
- 首页显示 `8 / 8` 与最好总星数。
- 可查看关卡或重玩 DAY 8。

## RISK-001 — 首次推进规则

状态：**已按推荐方案实现并关闭 Issue #3。**

正式规则：

- 新玩家首次推进至少成功完成 1 道菜。
- 不要求 100%。
- 不要求三星。
- 已经解锁的关卡不会因回头重玩 0 道菜而重新锁住。
- DAY 8 至少完成 1 道菜才进入最终完成态。

0 道菜仍允许查看结算，但首次不会出现“下一关”，而是提示推进条件并返回关卡。

浏览器回归：**20 / 20 通过**，详见 `docs/11_PROGRESSION_GATE_REPORT.md`。

## 结构调整

运行版：

- `game/index.html`
- `game/styles.css`
- `game/app.js`
- `game/enhancements.css`
- `game/enhancements.js`

`game/play.html` 继续作为 iframe 兼容入口。

## 规则与浏览器验证

### 规则检查

- `app.js` 通过 `node --check`。
- `enhancements.js` 通过 `node --check`。
- DAY 1 最优路线：100%，浪费 ¥0。
- DAY 1 洋葱煎蛋错误分配路线：75%，剩牛奶×1，浪费 ¥4.80。
- 最后一个鸡蛋耗尽时，因果提示只点名鸡蛋。

### 主 Chromium Gate

`docs/10_BROWSER_GATE_REPORT.md`

结果：**36 / 36 通过。**

包括：

- 两步教学。
- 44px Hitbox。
- 菜谱高亮。
- 真实拖拽。
- 800ms 烹饪锁定。
- 菜品奖励卡与详情。
- DAY 1 75% / 100% 结算。
- DAY 8 完成首页。
- 360×640 / 375×667 / 390×844 / 430×844。
- 无捕获到的 runtime JS Error / unhandled rejection。

### 推进规则 Chromium Gate

`docs/11_PROGRESSION_GATE_REPORT.md`

结果：**20 / 20 通过。**

验证：

- 首次 0 道菜不解锁。
- 完成 1 道菜即可推进。
- 已解锁进度不会重锁。
- DAY 8 0 道菜不完成。
- DAY 8 完成 1 道菜后进入 8 / 8。

## 当前剩余项

1. 从原生成会话或本地备份找回此前已验收的 DAY 1 正式食材 PNG。
2. 找回四道 DAY 1 正式菜品 PNG。
3. 将文件放入既定 `game/assets/...` 目录，并填写 `Ingredient.asset` / `DISH_ASSETS`。
4. 正式图接入后重新跑 360×640 与 390×844 视觉 Gate。
5. 正式部署后 smoke test `game/index.html` / `game/play.html` 与 Console。

## 当前 Gate

现在不应继续新增任何系统。

下一步固定为：**恢复正式 PNG → 接入资产 → 正式图移动端复测 → 部署 smoke test → PR 转 Ready / 合并。**
