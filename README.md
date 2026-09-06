# 冰箱清空计划

《冰箱清空计划》是一款面向手机竖屏的小红书小工具轻策略游戏。

一句话：**在食材过期前，用有限食材组合出尽可能合理的菜，减少浪费。**

> 你的冰箱里没有剩菜，只有还没被想出来的晚饭。

## 当前阶段与入口

当前为 **v0.4 比赛版候选的发布收敛阶段**，不是已经完成冻结的正式 Release。

当前完成度、代码基线、验收结果和未验证项目统一维护在 [`docs/08_IMPLEMENTATION_STATUS.md`](./docs/08_IMPLEMENTATION_STATUS.md)。其他入口文档不重复维护动态状态表。

正式 Worker：`https://worker.1106314996.workers.dev/`

**线上路径是 `/`、`/index.html`、`/play.html`，不是 `/game/index.html` 或 `/game/play.html`。** 仓库的 `game/` 目录被部署到站点根目录。2026-09-06 的生产路径诊断确认，根目录下的 13 个运行文件与候选内容一致；旧 `/game/` 路径返回 404。不要混淆仓库目录与公网路径，不把内容一致称为已读取 Cloudflare 后台构建元数据。

仓库兼容入口：[`game/play.html`](./game/play.html)。本地从仓库根目录启动静态 HTTP 服务时，仍使用 `/game/play.html`；不要用文件协议打开。

PR #1 已合并；Issue #2 只跟踪 Production Smoke，不再承担 PR 转 Ready / 合并步骤。发布验收通过以前，不关闭 Issue #2，不创建正式 v0.4 Tag / Release。

## 比赛版范围

- 8 个关卡，25 种食材，20 道菜。
- 即期食材、累计烹饪时间、总份数、总热量四类规则。
- 四格料理区、多重集合配方匹配，预扣 / 撤回 / 成功后正式扣库存。
- 点击和 Pointer Events 拖拽、菜谱食材高亮、两步首次教学、机会成本反馈。
- 约 800ms 烹饪反馈、菜品奖励卡、今晚菜单详情。
- 三星结算、浪费、营养、冰箱人格、localStorage 进度保存。
- 首次推进至少完成一道菜；不要求 100% 或三星；已解锁进度不重锁。
- DAY 8 完成门槛满足后显示 8 / 8 完成态。
- 手机竖屏优先，不设置现实倒计时。

DAY 1 七种食材与 B03 四道正式菜品已接入，不要根据旧素材计划重新制作。仓库还存在后续关卡视觉扩展，实际覆盖和验收状态见当前状态文档；不能把 DAY 1 历史报告推广为全关卡正式美术验收。

## 核心玩法

食材是有限资源，菜谱是不同的资源组合方案。

DAY 1 中四道菜都需要鸡蛋，但只有三个鸡蛋。玩家必须决定把鸡蛋分配给哪里。核心问题不是“这个能做什么菜”，而是：

> **用了这个以后，我还能做什么？**

教程不直接告诉玩家最优路线。发布收敛不修改库存、配方、关卡、三星条件或首次推进规则，也不增加大型系统。

## AI / 开发者从这里开始

先阅读 [`AGENTS.md`](./AGENTS.md) 和 [`docs/08_IMPLEMENTATION_STATUS.md`](./docs/08_IMPLEMENTATION_STATUS.md)，再按 [`docs/README.md`](./docs/README.md) 阅读任务对应规范。

运行文件与启动说明见 [`game/README.md`](./game/README.md)。脚本加载顺序以 `game/index.html` 为准，不删除已存在的后续美术或部署兼容层。

发布执行：

- [`docs/14_PRODUCTION_SMOKE_GATE.md`](./docs/14_PRODUCTION_SMOKE_GATE.md)：线上验收、证据和冻结规程。
- [`docs/15_SUBMISSION_PACKAGE.md`](./docs/15_SUBMISSION_PACKAGE.md)：投稿文案、录屏分镜和 Release Notes 草稿。

历史证据：

- [`docs/10_BROWSER_GATE_REPORT.md`](./docs/10_BROWSER_GATE_REPORT.md)：主 QA。
- [`docs/11_PROGRESSION_GATE_REPORT.md`](./docs/11_PROGRESSION_GATE_REPORT.md)：首次推进规则。
- [`docs/12_DAY1_ASSET_MAPPING.md`](./docs/12_DAY1_ASSET_MAPPING.md)：正式素材来源与校验值。
- [`docs/13_FORMAL_ASSET_GATE_REPORT.md`](./docs/13_FORMAL_ASSET_GATE_REPORT.md)：DAY 1 正式资产。

`docs/06_LEVEL_PROGRESSION.md` 中旧的“只要完成结算即可解锁下一关”表述由已实现的“首次至少完成一道菜”规则覆盖。

`CLAUDE.md` 与 `GEMINI.md` 为其他 AI 编码工具入口。
