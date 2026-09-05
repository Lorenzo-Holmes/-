# DAY 1 正式菜品资产

此前验收通过的 DAY 1 四道菜原 PNG 已通过用户提供的 `fridge_clear_game_images_package.zip` 恢复。

运行版使用：

- `day1_dishes_atlas.webp` — 256×256，2 列 × 2 行 WebP 图集。

该图集仅做运行尺寸与编码优化，不重新生成菜品美术。源 PNG 文件与 SHA-256 记录见 `docs/12_DAY1_ASSET_MAPPING.md`。

## 图集布局

| 行 / 列 | 0 | 1 |
|---|---|---|
| 0 | 番茄炒蛋 | 蛋炒饭 |
| 1 | 牛奶蒸蛋 | 洋葱煎蛋 |

运行时由 `game/formal-assets.js` 映射到 `te / fr / me / oe`。

正式图已用于：

- 完成菜品奖励卡；
- “今晚菜单”缩略图；
- 已完成菜品详情。

正式图接入后的浏览器 Gate 已确认四道 DAY 1 菜品图格都可正常渲染。
