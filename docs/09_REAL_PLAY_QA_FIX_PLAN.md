# 09 — 真实试玩 QA 修复计划与执行状态

## 总体结论

真实试玩问题对应的 Batch A、Batch B、Batch C、首次推进规则和 DAY 1 正式资产接入已经完成。

当前三组 Chromium Gate：

- 主 QA Gate：**36 / 36 通过**。
- 首次推进规则 Gate：**20 / 20 通过**。
- DAY 1 正式资产 Gate：**38 / 38 通过**。

当前只剩正式部署 URL 的入口级 smoke test。

## Batch A — 可发布基础

状态：**完成。**

- QA-001：移除 DOM ID 自动全局事件依赖。
- QA-002：事务式做菜提交 + 真正耗尽资源的机会成本提示。
- QA-006：DAY 1 浪费金额、非满分重玩主 CTA、100% 鸡蛋 MVP。
- QA-007：食材名称 fallback，解决共用 Emoji 辨识问题。
- QA-008：`100svh` 弹性布局与短屏规则。
- QA-009：关键 Hitbox ≥约 44×44px。

## Batch B — 核心交互

状态：**完成。**

- QA-003：点击菜谱只高亮对应库存食材，约 800ms 后解除，不自动选菜。
- QA-004：Pointer Events 拖拽 + Ghost + drop target，同时保留点击并防止重复加入。
- QA-005：首次两步教学，第一次成功开火后持久化完成状态。
- QA-010：DAY 1 固定冰箱空间摆位与正式食材视觉已经接入。

### QA-010 正式食材最终状态

2026-09-05 用户上传 `fridge_clear_game_images_package.zip`，成功恢复此前验收通过的正式食材 PNG。

仓库运行版使用：

- `game/assets/ingredients/day1/day1_ingredients_atlas.webp`

图集由原 PNG 等比缩放 / 透明画布拼装 / WebP 编码生成，不重新生成美术内容。

正式视觉覆盖：

- 鸡蛋；
- 番茄；
- 剩米饭；
- 牛奶；
- 胡萝卜；
- 半颗洋葱；
- 午餐肉；
- 拖拽 Ghost；
- 料理槽单单位食材。

数量、“今天”、预扣与菜谱高亮继续由 UI 动态叠加。

## Batch C — 奖励与完整性

状态：**完成。**

- QA-011：约 800ms 烹饪锁定、锅体短动画、完成奖励卡、今晚菜单详情。
- QA-012：DAY 8 达到推进门槛后进入 `8 / 8` 完成首页。

### QA-011 正式菜品最终状态

同一素材包恢复四道 DAY 1 正式菜品：

- 番茄炒蛋；
- 蛋炒饭；
- 牛奶蒸蛋；
- 洋葱煎蛋。

运行版使用：

- `game/assets/dishes/day1/day1_dishes_atlas.webp`

正式菜品图已用于：

- 完成奖励卡；
- 今晚菜单缩略图；
- 已完成菜品详情。

源文件与运行图集完整映射见 `docs/12_DAY1_ASSET_MAPPING.md`。

## RISK-001 — 首次推进规则

状态：**完成。**

正式规则：

- 新玩家首次推进至少成功完成 1 道菜。
- 不要求 100%。
- 不要求三星。
- 已解锁关卡不会因 0 道菜重玩重新锁住。
- DAY 8 至少完成 1 道菜才进入最终完成态。

Issue #3 已关闭。

## 当前运行结构

- `game/index.html`
- `game/styles.css`
- `game/app.js`
- `game/enhancements.css`
- `game/enhancements.js`
- `game/formal-assets.js`
- `game/play.html`

`formal-assets.js` 只处理 DAY 1 正式视觉映射，不修改游戏规则。

## Gate 结果

### 1. 主 QA Gate

详见 `docs/10_BROWSER_GATE_REPORT.md`。

结果：**36 / 36 通过。**

覆盖教学、44px Hitbox、菜谱高亮、真实拖拽、800ms 烹饪锁定、DAY 1 75% / 100% 结算、DAY 8 完成态及四组移动端尺寸。

### 2. 推进规则 Gate

详见 `docs/11_PROGRESSION_GATE_REPORT.md`。

结果：**20 / 20 通过。**

覆盖首次 0 道菜不解锁、1 道菜可推进、已解锁进度不重锁以及 DAY 8 最终门槛。

### 3. 正式资产 Gate

详见 `docs/13_FORMAL_ASSET_GATE_REPORT.md`。

结果：**38 / 38 通过。**

覆盖：

- 7 种 DAY 1 正式食材；
- 正式食材菜谱高亮；
- 正式拖拽 Ghost；
- 正式料理槽食材；
- 四道 DAY 1 正式菜品奖励 / 菜单 / 详情；
- 360×640、375×667、390×844、430×844；
- 无横向溢出；
- 开火仍位于首屏；
- 无捕获到的 runtime JavaScript Error。

## CI

`.github/workflows/static-qa.yml` 已升级为检查：

- `app.js / enhancements.js / formal-assets.js` 语法；
- 运行入口文件；
- 首次推进规则标记；
- DAY 1 正式食材 / 菜品图集；
- 正式资产映射文档。

## 当前唯一剩余项

正式部署后执行 smoke test：

1. `game/index.html` 可访问。
2. `game/play.html` 可访问。
3. WebP 正式图集无 404 / MIME 错误。
4. 两入口均可完成 DAY 1 基础交互。
5. Console 无阻断错误。
6. 360×640 真机 / 部署环境再做一次快速检查。

当前仓库没有可解析的 Cloudflare / `pages.dev` / `workers.dev` 部署 URL，也没有已连接 Cloudflare 发布工具，因此无法在仓库侧自行完成这一项。

## 当前 Gate

功能、规则、移动端交互和 DAY 1 正式美术均已达到本地比赛版候选要求。

下一步固定为：**部署 → smoke test → PR #1 转 Ready → 合并 → 投稿包装 / 录屏。**
