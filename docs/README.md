# 《冰箱清空计划》文档索引

本目录是《冰箱清空计划》的 canonical 设计与实现规范。

AI 或开发者进入项目后，建议按以下顺序阅读：

1. `../AGENTS.md` — AI 总约束与文档优先级。
2. `00_PROJECT_CHARTER.md` — 项目定位、核心循环、比赛版范围。
3. `03_DAY1_VERTICAL_SLICE.md` — DAY 1 核心交互与 Vertical Slice 规格。
4. `02_UI_UX_SPEC.md` — 手机竖屏 UI、交互、反馈与视觉规范。
5. `01_GAME_DESIGN_SPEC.md` — 玩法、配方匹配与结算原则。
6. `04_CONTENT_CATALOG.md` — 25 食材 / 20 菜基础内容池。
7. `05_IMPLEMENTATION_ACCEPTANCE.md` — 工程结构与测试验收规范。
8. `06_LEVEL_PROGRESSION.md` — 8 关正式难度曲线、库存、约束组合与三星规则。
9. `08_IMPLEMENTATION_STATUS.md` — 当前实际实现状态。
10. `09_REAL_PLAY_QA_FIX_PLAN.md` — 真实试玩问题修复记录。
11. `10_BROWSER_GATE_REPORT.md` — 主 Chromium 浏览器 Gate。
12. `11_PROGRESSION_GATE_REPORT.md` — 首次推进规则 Chromium Gate。
13. `12_DAY1_ASSET_MAPPING.md` — DAY 1 正式素材来源、SHA-256 与运行图集映射。
14. `13_FORMAL_ASSET_GATE_REPORT.md` — DAY 1 正式美术 Chromium Gate。

## 文档优先关系

- DAY 1 的交互、状态机与教学：以 `03_DAY1_VERTICAL_SLICE.md` 为基础；真实试玩后的修复状态以 `09_REAL_PLAY_QA_FIX_PLAN.md` 为准。
- DAY 2–8 的库存、特殊约束和三星路线：以 `06_LEVEL_PROGRESSION.md` 为准。
- 当前实际完成度：以 `08_IMPLEMENTATION_STATUS.md` 为准。
- 浏览器验收：以 `10_BROWSER_GATE_REPORT.md`、`11_PROGRESSION_GATE_REPORT.md`、`13_FORMAL_ASSET_GATE_REPORT.md` 为准。
- DAY 1 正式素材来源：以 `12_DAY1_ASSET_MAPPING.md` 为准。

### 2026-09-05 首次推进规则覆盖说明

`06_LEVEL_PROGRESSION.md` 中旧的“只要完成结算即可解锁下一关”规则已被真实试玩后的正式决策覆盖。

当前规则：

- 首次推进至少成功完成 1 道菜；
- 不要求 100%；
- 不要求三星；
- 已解锁的下一关不会因回头重玩 0 道菜重新锁住；
- DAY 8 至少完成 1 道菜才进入 8 / 8 完成态。

该规则已实现并通过 20 / 20 Chromium Gate。

## 当前项目状态

比赛版候选已完成三组本地 Chromium Gate：

- 主 QA Gate：36 / 36；
- 首次推进 Gate：20 / 20；
- DAY 1 正式资产 Gate：38 / 38。

此前缺失的 DAY 1 正式食材与四道菜素材已经通过用户上传的 `fridge_clear_game_images_package.zip` 恢复，并以移动端运行图集接入仓库。

当前唯一剩余发布 Gate：正式部署后 smoke test `game/index.html` / `game/play.html`、正式 WebP 请求和 Console。

稳定试玩入口：`../game/play.html`。

## Canonical 核心

DAY 1 必须保持：

- 4 道菜争抢 3 个鸡蛋；
- 最优方案放弃洋葱煎蛋；
- 教程不直接告知最优解；
- 最后一个关键资源消耗后必须反馈其他选择被关闭；
- 非 100% 结算明确显示剩余即期食材。

全游戏必须保持：

- 核心难度来自资源竞争与预算约束，而不是猜菜谱；
- 不设置现实时间倒计时；
- 特殊预算允许超出，但超出只影响目标 / 三星，不硬失败；
- 三星不是内容解锁门槛；
- 首次推进至少需要完成 1 道菜。

## 修改规则

设计变化不要只改代码。若用户批准修改核心规则，应同步更新实现状态、QA 记录和 canonical 覆盖说明，避免代码与 AI 上下文漂移。
