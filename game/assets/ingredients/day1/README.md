# DAY 1 正式食材资产

这里存放已经验收通过的 DAY 1 正式透明背景食材 PNG。

建议固定文件名：

- `ingredient_egg.png` — 鸡蛋
- `ingredient_tomato.png` — 番茄
- `ingredient_rice.png` — 剩米饭
- `ingredient_milk.png` — 牛奶
- `ingredient_carrot.png` — 胡萝卜
- `ingredient_onion.png` — 半颗洋葱
- `ingredient_luncheon_meat.png` — 午餐肉

要求：

- 图片本体不写数量、“今天”、选中态或高亮。
- 透明背景，底部锚点稳定。
- 不重新生成替代图；应恢复此前已验收的原文件。
- 文件补齐后，在 `game/app.js` 对应 DAY 1 Ingredient 的 `asset` 字段填写相对路径。

接入后必须重新跑 360×640 与 390×844 Gate。
