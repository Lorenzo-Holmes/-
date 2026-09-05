# 12 — DAY 1 正式资产来源与运行映射

## 来源

2026-09-05 用户上传：`fridge_clear_game_images_package.zip`。

压缩包 SHA-256：

`b78e926ddf5b577fa62e08cca304f9bb2304923e36f27aa01855d835764b47f6`

压缩包中的 `03_final_ingredient_assets/` 与 `04_dish_assets/` 与此前 DAY 1 验收记录一致，因此本轮直接使用这些已验收素材，不重新绘制。

## 食材源文件

| 运行含义 | 包内源文件 | SHA-256 |
|---|---|---|
| 胡萝卜 | `03_final_ingredient_assets/ingredient_carrot.png` | `35407aae513578bdc8aab6223b836b6b6a8daa90fe626b1aa4ff1dab5caec2e3` |
| 鸡蛋×1 | `03_final_ingredient_assets/ingredient_egg_1.png` | `323aaf8ca9a3ee02a8ead1be8ef3f4bab48e8bfd75287702b8997e84a0f45eea` |
| 鸡蛋×2 | `03_final_ingredient_assets/ingredient_egg_2.png` | `5c6dc6c7c7071385d3e549ba845813320152cddb5a3c9cdee691370a4aec9b90` |
| 鸡蛋×3 | `03_final_ingredient_assets/ingredient_egg_3.png` | `37618a6c47c2a812136a240c648ff93838986b9496b099bc50be774af3915bbc` |
| 午餐肉×1 | `03_final_ingredient_assets/ingredient_luncheon_meat_1.png` | `bc2aa3e61535747dfbb847f8af6283f3373ebc0f59d5a5fd28617452f591a512` |
| 午餐肉×2 | `03_final_ingredient_assets/ingredient_luncheon_meat_2.png` | `0b99611eba1952346e9c5a10708a5b551d5645a4d14c5d236b53487149b329fd` |
| 牛奶 | `03_final_ingredient_assets/ingredient_milk.png` | `f1ee706443ad87a33ae6e7c627172e59e1d9c69fa10b07afc61e61d9673a0796` |
| 半颗洋葱 | `03_final_ingredient_assets/ingredient_onion_half.png` | `4a484de6091b97d47a1a231eb1f1385fa861cbd71b0118cec7eda9487ad2fe43` |
| 剩米饭 | `03_final_ingredient_assets/ingredient_rice_leftover.png` | `adde3ddde0002eb4c66e38973d3002cdfc118545bb91d454a865fefaa30650bd` |
| 番茄×1 | `03_final_ingredient_assets/ingredient_tomato_1.png` | `384edc9a91f2c40cc5ba76249e832353d435f9cf0257fce23048352307f0fccd` |
| 番茄×2 | `03_final_ingredient_assets/ingredient_tomato_2.png` | `0a077caea23f2f315ed9a6ef108856c426756c7b410f9c8d25ae403e6de216de` |

包内另有 `ingredient_egg_0.png`，用于素材状态完整性，但库存为 0 时游戏不渲染食材按钮，因此运行图集没有占用该状态。

## 菜品源文件

| Recipe ID | 菜品 | 包内源文件 | SHA-256 |
|---|---|---|---|
| `te` | 番茄炒蛋 | `04_dish_assets/a_close_up_high_resolution_appetizing_food_illus.png` | `05bf6928b1b207f4bafb3d350b80132f5d660d56274d40ca04203aecef28964a` |
| `fr` | 蛋炒饭 | `04_dish_assets/金黄蛋炒饭白盘特写.png` | `0a80922cc5a47c00c1e881c2cff99c94328937a190faae8d7bebb58c2b90dc95` |
| `me` | 牛奶蒸蛋 | `04_dish_assets/dish_milk_egg.png` | `f76bc40e0f1d139e70233f7b9b642f6b129991fe53b8df990a1c364978e33836` |
| `oe` | 洋葱煎蛋 | `04_dish_assets/dish_onion_egg.png` | `b34140d62b74c87ae9d7f7ad0cff7e965cf539c67c237cd5d70f8fdc3e0a7277` |

## 运行优化资产

为了避免把多张高分辨率 PNG 直接加载到手机运行页，本轮从上述源素材制作两张运行图集。处理仅包括等比缩放、透明画布拼装和 WebP 编码，不包含重新生成、重绘、风格转换或内容增删。

- `game/assets/ingredients/day1/day1_ingredients_atlas.webp`
  - 320×240
  - SHA-256：`24cb522938b17982faf022c3919aac870fc75c8850f66c0861bd92f9968a8480`
- `game/assets/dishes/day1/day1_dishes_atlas.webp`
  - 256×256
  - SHA-256：`4837110cd85f1203b2b8fb8835f322f2b102426c34af67a7ee9c5de595553178`

具体图格排列见各自 `README.md`。

## 运行代码

`game/formal-assets.js` 是纯视觉覆盖层：

- DAY 1 冰箱食材使用正式食材图集；
- 拖拽 Ghost 与料理槽使用对应的单单位正式食材图格；
- DAY 1 完成菜奖励卡、今晚菜单和菜品详情使用正式菜品图集；
- DAY 2–8 仍使用当前 fallback，等待后续正式美术批次。

该层不修改库存、配方匹配、评分、解锁或关卡数值。

## 正式图 Gate

正式图接入后重新执行 Chromium Gate：**38 / 38 通过，0 失败**。

覆盖：

- 7 种 DAY 1 正式食材均正确渲染；
- 菜谱高亮仍只高亮对应食材且不自动选择；
- 真实鼠标拖拽 Ghost 使用正式食材图；
- 料理槽使用正式食材图；
- 800ms 烹饪事务不受视觉层影响；
- 四道 DAY 1 菜品图格均可在菜单 / 奖励 / 详情中渲染；
- 360×640、375×667、390×844、430×844 均无横向溢出，开火仍位于首屏；
- 无捕获到的运行时 JavaScript Error。
