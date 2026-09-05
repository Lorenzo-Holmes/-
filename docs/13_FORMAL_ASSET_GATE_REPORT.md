# 13 — DAY 1 正式资产浏览器 Gate

日期：2026-09-05

分支：`fix/real-play-batch-a`

## 目的

在此前功能 / 推进规则 Gate 已通过的基础上，验证恢复的 DAY 1 正式食材与四道菜素材接入后，不破坏核心交互、移动端首屏和烹饪事务。

## 资产来源

用户提供：`fridge_clear_game_images_package.zip`。

源文件和 SHA-256 映射见 `12_DAY1_ASSET_MAPPING.md`。

运行版使用两张从已验收源 PNG 等比优化得到的 WebP 图集：

- `game/assets/ingredients/day1/day1_ingredients_atlas.webp`
- `game/assets/dishes/day1/day1_dishes_atlas.webp`

## 环境

- Chromium 144
- Playwright
- 当前分支等价完整页面字节
- 视口：360×640、375×667、390×844、430×844

与此前浏览器 Gate 一样，执行环境策略阻止直接导航 `http://` / `file://` / `data:`，因此使用 `Page.setDocumentContent` 等价加载页面；正式部署 URL 仍需最后一次入口 smoke test。

## 结果

**38 / 38 通过，0 失败。**

### 正式食材层

- DAY 1 初始 7 种食材全部使用正式图集。
- 鸡蛋、番茄、午餐肉根据当前库存使用对应数量状态。
- 食材名称、数量与“今天”标签仍由 UI 动态显示。
- 菜谱点击“番茄炒蛋”后，正式番茄 / 鸡蛋仍正确高亮 2 个对象。
- 菜谱点击不会自动选择食材。

### 拖拽与料理槽

- 真实鼠标拖拽鸡蛋时 Ghost 使用正式食材图。
- 拖入料理区只加入 1 个单位，没有重复 click。
- 料理槽使用正式单单位食材图。
- 正式视觉层没有改变预扣 / 撤回语义。

### 烹饪与菜品

- 番茄×2 + 鸡蛋×1 仍正确进入 READY。
- 点击开火后仍进入 800ms cooking 状态。
- cooking 中开火禁用、料理槽保持锁定。
- 800ms 后菜品正常事务式提交。
- 番茄炒蛋奖励卡使用正式菜品图。
- 今晚菜单使用正式菜品缩略图。
- 菜品详情使用正式菜品图，并正确显示 `2 人份 / 8 分钟 / 280 kcal`。
- `te / fr / me / oe` 四个 DAY 1 菜品图格均可正常渲染。

### 移动端布局

以下四个尺寸均通过：

- 360×640
- 375×667
- 390×844
- 430×844

每个尺寸均验证：

- 7 种正式食材位于冰箱区域内；
- 顶部即期目标可见；
- 无横向溢出；
- `开火 / 再想想` 操作仍位于第一屏；
- 正式图片没有挤破固定空间布局。

### 运行时错误

- 未捕获到 JavaScript runtime error。
- 未捕获到 unhandled rejection。

## Gate 结论

DAY 1 正式食材与正式菜品视觉 Gate 通过。

截至本报告，已完成：

1. 主 QA Chromium Gate：36 / 36。
2. 首次推进规则 Gate：20 / 20。
3. 正式资产 Gate：38 / 38。

功能、规则和 DAY 1 正式美术层均已达到本地比赛版候选要求。剩余最后 Gate 为：正式部署后的 `game/index.html` / `game/play.html` 入口 smoke test 与 Console 检查。
