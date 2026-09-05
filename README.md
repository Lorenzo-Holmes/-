# 冰箱清空计划

《冰箱清空计划》是一款面向手机竖屏的小红书小工具轻策略游戏。

一句话：**在食材过期前，用有限食材组合出尽可能合理的菜，减少浪费。**

> 你的冰箱里没有剩菜，只有还没被想出来的晚饭。

## 当前状态

**比赛版候选 v0.4 已在 `fix/real-play-batch-a` 完成功能 QA、首次推进规则和 DAY 1 正式美术接入。当前只剩正式部署入口 smoke test。**

稳定试玩入口：[`game/play.html`](./game/play.html)

运行版：

- [`game/index.html`](./game/index.html) — 页面壳；
- [`game/styles.css`](./game/styles.css) — 基础视觉与移动适配；
- [`game/app.js`](./game/app.js) — 数据、规则与核心交互；
- [`game/enhancements.css`](./game/enhancements.css) — 烹饪奖励、完成态与推进提示；
- [`game/enhancements.js`](./game/enhancements.js) — 奖励反馈、菜单详情、最终通关与首次推进规则；
- [`game/formal-assets.js`](./game/formal-assets.js) — DAY 1 正式食材 / 菜品视觉层。

当前版本包含：

- 8 个首发关卡；
- 25 种食材；
- 20 道菜；
- 即期食材、累计烹饪时间、总份数、总热量四类规则；
- 四格料理区、配方匹配、预扣 / 撤回 / 正式库存扣除；
- 点击与 Pointer Events 拖拽；
- 菜谱高亮、两步首次教学、机会成本反馈；
- 三星结算、浪费、营养、冰箱人格；
- 约 800ms 烹饪反馈、菜品奖励卡、今晚菜单详情；
- DAY 8 的 8 / 8 完成首页；
- DAY 1 已验收正式食材与四道菜美术；
- localStorage 进度保存；
- 手机竖屏优先；
- 不设置现实倒计时。

首次推进规则：

- **至少成功完成 1 道菜，才首次解锁下一关；**
- 不要求 100%；
- 不要求三星；
- 已解锁的下一关不会因为回头重玩 0 道菜而重新锁住。

8 个关卡的三星核心路线仍已程序化验证可达；最终关可达：**38 / 40 分钟、7 / 7 份、1180 / 1250 kcal**。

当前 Chromium Gate：

- 主 QA Gate：36 / 36 通过；
- 首次推进规则 Gate：20 / 20 通过；
- DAY 1 正式资产 Gate：38 / 38 通过。

DAY 1 正式素材来源与运行图集映射见 [`docs/12_DAY1_ASSET_MAPPING.md`](./docs/12_DAY1_ASSET_MAPPING.md)。

当前唯一剩余发布 Gate：正式部署后 smoke test `game/index.html` / `game/play.html`、正式 WebP 加载与 Console。

## AI / 开发者从这里开始

修改工程前请按顺序阅读：

1. [`AGENTS.md`](./AGENTS.md) — 项目总约束、AI 工作规则、文档优先级。
2. [`docs/README.md`](./docs/README.md) — canonical 设计文档索引。
3. [`docs/08_IMPLEMENTATION_STATUS.md`](./docs/08_IMPLEMENTATION_STATUS.md) — 当前实际实现状态。
4. [`docs/09_REAL_PLAY_QA_FIX_PLAN.md`](./docs/09_REAL_PLAY_QA_FIX_PLAN.md) — 真实试玩 QA 修复记录。
5. [`docs/10_BROWSER_GATE_REPORT.md`](./docs/10_BROWSER_GATE_REPORT.md) — 主浏览器 Gate。
6. [`docs/11_PROGRESSION_GATE_REPORT.md`](./docs/11_PROGRESSION_GATE_REPORT.md) — 首次推进规则 Gate。
7. [`docs/12_DAY1_ASSET_MAPPING.md`](./docs/12_DAY1_ASSET_MAPPING.md) — 正式素材来源与校验值。
8. [`docs/13_FORMAL_ASSET_GATE_REPORT.md`](./docs/13_FORMAL_ASSET_GATE_REPORT.md) — 正式资产浏览器 Gate。
9. [`docs/06_LEVEL_PROGRESSION.md`](./docs/06_LEVEL_PROGRESSION.md) — 8 关正式难度曲线与数值。

注意：`docs/06_LEVEL_PROGRESSION.md` 中旧的“只要完成结算即可解锁下一关”表述，已被 2026-09-05 批准并实现的首次推进规则覆盖。当前以 `docs/11_PROGRESSION_GATE_REPORT.md` 与实际实现为准。

同时提供：

- `CLAUDE.md`：Claude Code 入口。
- `GEMINI.md`：Gemini CLI 入口。

## 核心玩法

食材是有限资源，菜谱是不同的资源组合方案。

DAY 1 中四道菜都需要鸡蛋，但只有 3 个鸡蛋。玩家必须决定把鸡蛋分配给哪里。游戏真正要产生的思考不是“这个能做什么菜”，而是：

> **用了这个以后，我还能做什么？**

详细设计与后续开发约束以 `AGENTS.md` 与 `docs/` 为准。
