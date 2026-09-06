# 08 — 游戏实现状态 v0.4（比赛版候选，未正式冻结）

本文件是当前阶段、实现完成度和发布状态的唯一事实源。其他规范保留设计约束；旧聊天记录、旧素材计划和历史 Gate 报告不能覆盖这里的当前状态。

## 当前状态（2026-09-06 核对）

**当前进入发布收敛，不再处于 DAY 1 原型开发阶段。Production Smoke Gate 尚未通过，不宣布正式发布。**

本次核对的代码基线：`bfc5dd86e17f8c97791d583b974f138df237acc9`，提交说明为 `fix: make game compatible with xhs mini tool container`。

PR #1 已于 2026-09-05 合并，合并提交为 `5d337968c23be70cfc932ac35b342f84c5199bd8`。这是历史 QA / DAY 1 美术合并点，**不是现在的 main HEAD**，不得继续要求 PR #1 转 Ready 或再次合并。

正式 Worker：`https://worker.1106314996.workers.dev/`。

用户此前确认根路径、`/game/index.html`、`/game/play.html` 可以打开；该历史确认不等于本次基线的部署、资源和交互验收。当前发布跟踪为 Issue #2。

## 已实现范围（保持不变）

- 8 个首发关卡、25 种食材、20 道菜。
- 即期食材、累计烹饪时间、总份数、总热量四类规则。
- 四格料理区、多重集合配方匹配；放入料理区仅预扣，成功开火后一次性扣库存。
- 点击与 Pointer Events 拖拽、撤回、菜谱对应食材高亮、机会成本反馈。
- DAY 1 两步首次教学、约 800ms 烹饪反馈、菜品奖励、今晚菜单详情。
- 三星结算、浪费、营养、冰箱人格；localStorage 保存进度。
- DAY 8 达到推进门槛后进入 8 / 8 完成态。
- 手机竖屏优先，不设置现实倒计时。

DAY 1 仍是四道菜争抢三个鸡蛋；库存、配方、目标、三星条件不在本次发布收敛中调整，教程不揭示最优路线。

## 首次推进规则（已实现）

至少成功完成一道菜，才首次解锁下一关；不要求 100% 或三星。已解锁关卡不会因回头重玩零道菜重新锁住。DAY 8 至少完成一道菜才写入最终完成态。

`docs/06_LEVEL_PROGRESSION.md` 内旧的“只要完成结算即可解锁下一关”表述由此规则覆盖，详见 `11_PROGRESSION_GATE_REPORT.md`。

## 美术与运行文件

DAY 1 的 B03 四道菜品素材已完成并接入：番茄炒蛋、蛋炒饭、牛奶蒸蛋、洋葱煎蛋。**不要根据旧的《冰箱清空计划设计》记录重新进入 B03，或重新生成已验收素材。**

DAY 1 正式素材来自 2026-09-05 用户提供的 `fridge_clear_game_images_package.zip`；来源、映射与校验值见 `12_DAY1_ASSET_MAPPING.md`。数量、“今天”、预扣、高亮由 UI 动态叠加。

本次基线还已包含 DAY 2 食材与菜品 WebP 图集，入口已经加载 `day3-8-food-assets.js` 和 `dish-render-hotfix.js`。这说明后续视觉代码已经存在；**代码或文件存在不代表 DAY 2–8 已通过正式视觉验收**，不能将其重新列为完全未开发，也不能沿用 DAY 1 历史报告宣布全关卡验收完成。

实际脚本加载顺序以 `game/index.html` 为准：

1. `game/app.js`：数据、规则与核心交互。
2. `game/enhancements.js`：奖励、结果、完成态与首次推进规则。
3. `game/day3-8-food-assets.js`：后续关卡视觉扩展。
4. `game/formal-assets.js`：正式食材 / 菜品视觉层。
5. `game/dish-render-hotfix.js`：菜品部署兼容补丁。

样式为 `game/styles.css` 和 `game/enhancements.css`；兼容试玩入口为 `game/play.html`，其 iframe 加载 `index.html`。

## 验收证据分层

以下为仓库已有历史报告，不是 2026-09-06 本次重新执行的测试：

| 历史验证 | 记录结果 | 证据 |
| --- | --- | --- |
| 主 QA Chromium Gate | 36 / 36 | `10_BROWSER_GATE_REPORT.md` |
| 首次推进规则 Gate | 20 / 20 | `11_PROGRESSION_GATE_REPORT.md` |
| DAY 1 正式资产 Gate | 38 / 38 | `13_FORMAL_ASSET_GATE_REPORT.md` |

历史正式资产 Gate 覆盖 360×640、375×667、390×844、430×844。历史数值验证记录 8 / 8 三星核心路线可达；最终关核心路线为即期 6 / 6、38 / 40 分钟、7 / 7 份、1180 / 1250 kcal。

当前 `.github/workflows/static-qa.yml` 已覆盖五个运行脚本语法、运行文件、推进规则标记、全食材美术覆盖、DAY 1 图集和菜品部署兼容标记。每次发布仍须读取目标提交自己的 CI 结果；旧合并点的 run #29 通过不能替代当前提交验证。

## 本次执行条件与发布阻塞

本次尝试调用 DevSpace `open_workspace`，返回 `FORBIDDEN: This conversation does not support developer MCPs`，未建立本机工作区，未修改用户本机文件。改用已连接 GitHub 执行仓库更新。

本会话的网页工具未能打开上述 Worker 三个入口；容器 Git 拉取也遇到 DNS 解析限制。**这属于执行环境限制，不是已证实的线上故障，更不是 smoke 通过。**

尚待验证：目标运行文件与线上版本一致、两个入口的实际交互、正式图集 HTTP / MIME / 解码、Console、360×640 布局，以及当前基线新增视觉层是否正常。

## 发布收敛顺序

同步状态文档和 Issue #2 → 执行 Production Smoke 并保存证据 → 通过后关闭 Issue #2 → 将验收通过的确切提交固定为 v0.4 → 正式录屏 / 截图 / 投稿。

验收前可准备投稿文案和分镜，但不得将脚本称为已录视频，也不得把本地截图称为线上截图。没有可复核的部署验收证据时，不创建正式 v0.4 Tag / Release，不关闭 Issue #2。

本轮不新增玩法、库存、配方或关卡，不重绘已有素材。v0.5 先评估现有 DAY 2–8 视觉覆盖和一致性，再处理尚未完成的部分，避免重复开发。
