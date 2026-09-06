# 《冰箱清空计划》文档索引

本目录是《冰箱清空计划》的 canonical 设计与实现规范。

## 阅读入口

先读 `../AGENTS.md`，再读 `08_IMPLEMENTATION_STATUS.md`。**当前阶段、实际实现完成度和发布状态只在 `08_IMPLEMENTATION_STATUS.md` 维护。** 本索引、聊天记录与旧素材计划不能覆盖它。

## 文档职责

| 文档 | 职责 |
| --- | --- |
| `00_PROJECT_CHARTER.md` | 项目定位、核心循环与比赛版范围 |
| `03_DAY1_VERTICAL_SLICE.md` | DAY 1 资源结构、交互、教学与原型规格 |
| `02_UI_UX_SPEC.md` | 手机竖屏 UI、反馈与视觉规范 |
| `01_GAME_DESIGN_SPEC.md` | 配方匹配与结算设计 |
| `04_CONTENT_CATALOG.md` | 25 食材 / 20 菜基础内容池 |
| `05_IMPLEMENTATION_ACCEPTANCE.md` | 工程结构、事务与功能 / 玩家测试标准 |
| `06_LEVEL_PROGRESSION.md` | 八关库存、预算、难度曲线与三星路线 |
| `08_IMPLEMENTATION_STATUS.md` | 唯一当前状态源：代码基线、完成度、阻塞、发布阶段 |
| `09_REAL_PLAY_QA_FIX_PLAN.md` | 历史真实试玩 QA 修复记录 |
| `10_BROWSER_GATE_REPORT.md` | 历史主 Chromium Gate |
| `11_PROGRESSION_GATE_REPORT.md` | 已实现首次推进规则与历史 Chromium Gate |
| `12_DAY1_ASSET_MAPPING.md` | DAY 1 正式素材来源、SHA-256 与图集映射 |
| `13_FORMAL_ASSET_GATE_REPORT.md` | 历史 DAY 1 正式资产 Chromium Gate |

## 优先关系与历史状态

设计约束以 `../AGENTS.md` 的优先级为准。DAY 1 交互以 `03_DAY1_VERTICAL_SLICE.md` 为基础，后续 QA 修复参照 `09_REAL_PLAY_QA_FIX_PLAN.md`；DAY 2–8 的库存与预算以 `06_LEVEL_PROGRESSION.md` 为准。

总纲和工程规范中“当前先做 DAY 1”的阶段性表述，是原型起步阶段的历史要求，不是当前排期。DAY 1 B03 四道菜已完成，不应重新生成。后续关卡视觉代码是否存在和是否通过验收是两种不同状态，均由 `08_IMPLEMENTATION_STATUS.md` 说明。

历史报告只证明报告所记录的那次测试。当前提交、正式部署或新增视觉层必须有相应的新证据，不能把 36 / 36、20 / 20、38 / 38 直接当作新一轮线上验收。

## 首次推进规则覆盖说明

`06_LEVEL_PROGRESSION.md` 内旧的“只要完成结算即可解锁下一关”规则已被 2026-09-05 的正式决策覆盖：

- 首次推进至少成功完成一道菜，不要求 100% 或三星。
- 已解锁关卡不因回头重玩零道菜重新锁住。
- DAY 8 至少完成一道菜才写入 8 / 8 完成态。

该规则已实现，历史验收见 `11_PROGRESSION_GATE_REPORT.md`。

## Canonical 核心

DAY 1 保持四道菜争抢三个鸡蛋；最优方案放弃洋葱煎蛋；教程不直接给最优解；关键资源耗尽后反馈选择关闭；非 100% 结果明确剩余即期食材。

全游戏保持资源竞争和预算约束为核心，不使用现实倒计时。特殊预算允许超出，但影响目标 / 三星，不硬失败。三星不作为内容解锁门槛。

## 修改规则

用户批准的设计变化必须同步规范和实现。当前阶段更新只维护 `08_IMPLEMENTATION_STATUS.md`；其他入口保持指向它。发布证据应关联确切提交、部署入口、测试环境与产物。没有证据不能关闭发布 Issue、宣布正式冻结或把待录分镜称为已完成视频。
