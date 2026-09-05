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

## 文档优先关系

- DAY 1 的具体交互、状态机和核心教学：以 `03_DAY1_VERTICAL_SLICE.md` 为准。
- DAY 2–8 的库存、特殊约束和三星路线：以 `06_LEVEL_PROGRESSION.md` 为准。
- 当前实际完成度、QA 状态与剩余阻塞：以 `08_IMPLEMENTATION_STATUS.md` 和 `09_REAL_PLAY_QA_FIX_PLAN.md` 为准。
- 浏览器验收结果：以 `10_BROWSER_GATE_REPORT.md`、`11_PROGRESSION_GATE_REPORT.md` 为准。

### 2026-09-05 首次推进规则覆盖说明

`06_LEVEL_PROGRESSION.md` 中旧的“只要完成结算即可解锁下一关”规则已经被真实试玩后的正式决策覆盖。

当前正式规则：

- **首次推进至少成功完成 1 道菜，才解锁下一关；**
- 不要求 100%；
- 不要求三星；
- 已经解锁的下一关不会因为回头重玩 0 道菜而重新锁住；
- DAY 8 至少完成 1 道菜才进入 8 / 8 完成态。

该规则已实现，并通过 20 / 20 Chromium 回归。详见 `11_PROGRESSION_GATE_REPORT.md`。

## 当前项目状态

真实试玩 QA 的 Batch A–C 已完成代码修改。

本地 Chromium：

- 主 QA Gate：36 / 36 通过；
- 首次推进 Gate：20 / 20 通过。

当前剩余阻塞：

1. 从原生成会话或本地备份找回已验收的 DAY 1 正式食材 / 菜品 PNG。
2. 接入 `game/assets/...` 后重新跑正式图移动端视觉 Gate。
3. 正式部署后 smoke test `game/index.html` / `game/play.html` 与 Console。

稳定试玩入口：`../game/play.html`。

## Canonical 核心

DAY 1 必须保持：

- 4 道菜都争抢鸡蛋；
- 只有 3 个鸡蛋；
- 最优方案放弃洋葱煎蛋；
- 玩家不能被教程直接告知最优解；
- 最后一个鸡蛋消耗后必须反馈其他选择被关闭；
- 非 100% 结算必须明确告诉玩家剩余即期食材。

全游戏必须保持：

- 核心难度来自资源竞争与预算约束，而不是猜菜谱；
- 不设置现实时间倒计时；
- 特殊预算允许超出，但超出只影响目标 / 三星，不硬失败；
- 三星不是内容解锁门槛；
- 首次推进至少需要完成 1 道菜。

## 修改规则

设计变化不要只改代码。

若用户批准修改核心规则，应同步更新实现状态、QA 记录和 canonical 覆盖说明，避免代码与 AI 上下文漂移。
