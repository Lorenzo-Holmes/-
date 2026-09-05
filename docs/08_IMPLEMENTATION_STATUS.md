# 08 — 游戏实现状态 v0.4（比赛版候选）

## 当前状态

**真实试玩 QA、首次推进规则和 DAY 1 正式美术层均已完成本地 Chromium Gate。当前唯一剩余发布 Gate 是正式部署后的入口 smoke test。**

稳定试玩入口：[`../game/play.html`](../game/play.html)

运行版：

- `../game/index.html` — 页面壳与脚本加载。
- `../game/styles.css` — 基础视觉与移动适配。
- `../game/app.js` — 数据、规则与核心交互。
- `../game/enhancements.css` — 烹饪奖励 / 完成态样式。
- `../game/enhancements.js` — 奖励、结果、最终通关与首次推进规则。
- `../game/formal-assets.js` — DAY 1 正式食材 / 菜品视觉覆盖层。

详细记录：

- `09_REAL_PLAY_QA_FIX_PLAN.md`
- `10_BROWSER_GATE_REPORT.md`
- `11_PROGRESSION_GATE_REPORT.md`
- `12_DAY1_ASSET_MAPPING.md`
- `13_FORMAL_ASSET_GATE_REPORT.md`

## 核心玩法状态

保持不变：

- 8 个首发关卡。
- 25 种食材。
- 20 道首发菜品。
- 即期食材、累计烹饪时间、总份数、总热量四类规则。
- 四格料理区与 multiset 配方匹配。
- 放入料理区只预扣，开火成功后才正式扣库存。
- DAY 1 仍为 4 道鸡蛋菜争抢 3 个鸡蛋，最优解不由教程直接告知。

## 首次推进规则

RISK-001 已完成：

- 首次推进至少成功完成 1 道菜。
- 不要求 100%。
- 不要求三星。
- 已解锁关卡不会因重玩 0 道菜重新锁住。
- DAY 8 至少完成 1 道菜才进入 `8 / 8` 完成态。

推进规则 Chromium Gate：**20 / 20 通过。**

## 真实试玩 QA 已修复

- DOM ID 全局变量冲突已移除。
- 烹饪事务先验证、后一次性扣库存。
- 关键食材耗尽会明确反馈被关闭的方案。
- DAY 1 留牛奶路线恢复 `¥4.80` 浪费。
- 非 100% 结算以“重新规划”为主 CTA。
- 100% 恢复“精算规划型 / 三个鸡蛋，一个都没白用 / 今晚 MVP：鸡蛋”。
- 菜谱点击只高亮对应食材。
- 食材支持 Pointer Events 拖拽与点击快速加入。
- DAY 1 首次两步教学已恢复并持久化。
- 关键触控区约 44×44px 或更大。
- 360×640 等短屏使用 `100svh` 弹性布局。
- 开火有约 800ms 轻量奖励反馈并锁定关键操作。
- 今晚菜单可查看已完成菜品详情。
- DAY 8 满足推进门槛后进入 8 / 8 完成首页。

主 QA Chromium Gate：**36 / 36 通过。**

## DAY 1 正式美术

用户于 2026-09-05 提供 `fridge_clear_game_images_package.zip`，成功恢复此前验收通过的正式食材与四道 DAY 1 菜品素材。

为移动端运行优化，仓库使用两张由这些源 PNG 等比缩放 / 拼装 / WebP 编码得到的图集：

- `game/assets/ingredients/day1/day1_ingredients_atlas.webp`
- `game/assets/dishes/day1/day1_dishes_atlas.webp`

`game/formal-assets.js` 只覆盖视觉渲染，不修改库存、配方、评分、关卡或解锁逻辑。

正式图层当前覆盖：

- DAY 1 冰箱中的 7 种正式食材；
- 鸡蛋 / 番茄 / 午餐肉的库存数量视觉状态；
- 拖拽 Ghost；
- 料理槽单单位食材；
- 番茄炒蛋、蛋炒饭、牛奶蒸蛋、洋葱煎蛋的奖励卡 / 今晚菜单 / 详情。

源文件映射与 SHA-256 见 `12_DAY1_ASSET_MAPPING.md`。

正式美术 Chromium Gate：**38 / 38 通过。**

验证尺寸：

- 360×640
- 375×667
- 390×844
- 430×844

均确认无横向溢出、正式食材位于冰箱区域、顶部目标可见，且开火操作仍位于首屏。

## 自动检查

GitHub Actions：`.github/workflows/static-qa.yml`

当前检查：

- `app.js / enhancements.js / formal-assets.js` JS 语法；
- 核心运行文件存在；
- 首次推进规则标记；
- DAY 1 正式食材 / 菜品图集存在；
- 正式资产映射文档存在。

## 关卡数值验证

8 / 8 三星核心路线仍可达。

最终关核心路线保持：

- 即期食材：6 / 6；
- 时间：38 / 40 分钟；
- 份数：7 / 7；
- 热量：1180 / 1250 kcal。

本轮没有修改已验证的库存、菜谱和三星条件。

## 当前唯一剩余 Gate

正式部署后完成：

1. 打开 `game/index.html`。
2. 打开 `game/play.html`。
3. 两入口各完成至少一次 DAY 1 基础操作。
4. 检查正式 WebP 图集实际通过部署环境返回成功。
5. Console 无阻断错误 / 404 / MIME 问题。
6. 手机实际尺寸再做一次 360×640 smoke check。

仓库目前没有 Cloudflare / `pages.dev` / `workers.dev` 或其他正式部署 URL 配置，当前环境也没有已连接的 Cloudflare 发布工具，因此此 Gate 需要部署 URL 可访问后执行。

## 下一步

不要再新增玩法系统。

下一步固定为：**部署当前分支 → 两入口 smoke test → PR #1 从 Draft 转 Ready → 合并 → 进入投稿包装 / 录屏。**
