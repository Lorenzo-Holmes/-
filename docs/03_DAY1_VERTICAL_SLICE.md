# 03 — DAY 1 Vertical Slice 开发规格

## 1. 目标

DAY 1 只验证核心玩法：

> 有限鸡蛋被多道菜争抢，玩家的选择会关闭其他方案。

原型不是为了展示完整内容，而是为了验证玩家是否能在做错后理解机会成本并愿意立即重玩。

## 2. 关卡信息

- ID：`day_01`
- 名称：`先救番茄`
- 开场文案：`冰箱里有几样东西撑不到明天了。今晚尽量把它们解决掉。`
- 自然游玩目标时长：60–120 秒。
- 无现实倒计时。

## 3. 初始库存

| ID | 食材 | 数量 | 状态 | 浪费价值 | 热量/单位 |
|---|---|---:|---|---:|---:|
| egg | 鸡蛋 | 3 | normal | 1.2 | 70 |
| tomato | 番茄 | 2 | urgent | 2.0/个 | 20 |
| rice | 剩米饭 | 1 | urgent | 2.5 | 230 |
| carrot | 胡萝卜 | 1 | normal | 1.0 | 30 |
| milk | 牛奶 | 1 | urgent | 4.8 | 130 |
| onion | 半颗洋葱 | 1 | normal | 1.2 | 40 |
| luncheon_meat | 午餐肉 | 2 | normal | 3.0/份 | 150 |

即期单位总数 = 4：番茄×2 + 米饭×1 + 牛奶×1。

## 4. 四道菜

### tomato_egg / 番茄炒蛋

```json
{
  "id": "tomato_egg",
  "name": "番茄炒蛋",
  "ingredients": {"tomato": 2, "egg": 1},
  "servings": 2,
  "cookTime": 8,
  "calories": 280,
  "nutritionScore": 80
}
```

### egg_fried_rice / 蛋炒饭

```json
{
  "id": "egg_fried_rice",
  "name": "蛋炒饭",
  "ingredients": {"rice": 1, "egg": 1, "carrot": 1},
  "servings": 2,
  "cookTime": 10,
  "calories": 430,
  "nutritionScore": 70
}
```

### milk_egg / 牛奶蒸蛋

```json
{
  "id": "milk_egg",
  "name": "牛奶蒸蛋",
  "ingredients": {"milk": 1, "egg": 1},
  "servings": 1,
  "cookTime": 9,
  "calories": 220,
  "nutritionScore": 82
}
```

### onion_egg / 洋葱煎蛋

```json
{
  "id": "onion_egg",
  "name": "洋葱煎蛋",
  "ingredients": {"onion": 1, "egg": 1},
  "servings": 1,
  "cookTime": 7,
  "calories": 180,
  "nutritionScore": 72
}
```

## 5. 核心资源结构

四道菜都需要 1 个鸡蛋，但初始只有 3 个鸡蛋。

因此四选三。

正确放弃项：`洋葱煎蛋`。

最优路径：

1. 番茄炒蛋。
2. 蛋炒饭。
3. 牛奶蒸蛋。

顺序可以不同，只要最终完成前三道且没有浪费鸡蛋给洋葱煎蛋即可。

洋葱煎蛋必须表现为“合理但本关不是最优”的诱饵，不能被 UI 标成错误菜。

## 6. 主要结局

### A — 最优

完成：番茄炒蛋 + 蛋炒饭 + 牛奶蒸蛋。

- 清空率：100%。
- 浪费：¥0。
- 菜品：3。
- 三星。
- 推荐人格：精算规划型。

### B — 留牛奶

完成：番茄炒蛋 + 蛋炒饭 + 洋葱煎蛋。

- 清空率：75%。
- 浪费：¥4.80。
- 两星。

### C — 留米饭

完成：番茄炒蛋 + 牛次蒸蛋 + 洋葱煎蛋。

> 实现时将“牛次蒸蛋”视为文档笔误，正确菜名始终为“牛奶蒸蛋”。

- 清空率：75%。
- 浪费：¥2.50。
- 两星。

### D — 留番茄

完成：蛋炒饭 + 牛奶蒸蛋 + 洋梅煎蛋。

> 实现时将“洋梅煎蛋”视为文档笔误，正确菜名始终为“洋葱煎蛋”。

- 清空率：50%。
- 浪费：¥4.00。
- 一星。

## 7. 三星规则

```text
1 star: finished
2 stars: clearRate >= 0.75
3 stars: clearRate == 1.0
```

## 8. 主界面布局

参考 390×844：

```text
0
┌────────────────────────┐
│ DAY 1  先救番茄    结束 │
├────────────────────────┤
│ 今天必须处理            │
│ 番茄×2  米饭×1  牛奶×1 │
├────────────────────────┤
│                        │
│       冰箱内部          │
│                        │
├────────────────────────┤
│ 今晚菜单 0 道           │
├────────────────────────┤
│ 今晚还能做 4 道菜  ＞   │
├────────────────────────┤
│ [槽1][槽2][槽3][槽4]    │
│        料理锅           │
│ 清空             开火！ │
└────────────────────────┘
844
```

## 9. DAY 1 冰箱摆位

冰箱内部使用相对坐标：x/y 为 0–100%。

- 牛奶：x≈12, y≈10，上层左侧。
- 鸡蛋：x≈14, y≈36，中层蛋托。
- 午餐肉：x≈70, y≈37，中层右侧。
- 剩米饭：x≈18, y≈60，透明保鲜盒。
- 番茄：x≈12, y≈82，蔬菜抽屉。
- 胡萝卜：x≈47, y≈83，略斜放。
- 洋葱：x≈76, y≈82，半颗洋葱。

不要把它们排成网格。

点击 Hitbox 最小 44×44 px。

鸡蛋托作为一个点击对象，每次取 1 个鸡蛋。

## 10. 料理状态

### EMPTY

- 文案：`放点什么进去试试。`
- 开火禁用。

### POSSIBLE

- 当前选择是至少一个配方的子集。
- 文案：`好像能做点什么……`

### READY

- 完全匹配一个菜谱。
- 显示菜名。
- `开火！` 高亮。

### INVALID

- 不属于任何候选菜谱子集。
- 文案：`这几样好像不太行。`
- 不允许消耗库存。

## 11. 配方匹配伪代码

```ts
function relation(selected, recipe) {
  // selected / recipe 都是 Record<ingredientId, count>
  const selectedKeys = Object.keys(selected)
  const isSubset = selectedKeys.every(
    id => selected[id] <= (recipe[id] ?? 0)
  )
  if (!isSubset) return 'NONE'

  const exact = Object.keys(recipe).every(
    id => (selected[id] ?? 0) === recipe[id]
  ) && selectedKeys.every(id => recipe[id] !== undefined)

  return exact ? 'EXACT' : 'SUBSET'
}
```

最终实现可以不同，但语义必须一致。

## 12. 选择与预扣

- 点击/拖入料理区时不真正减库存。
- 料理槽中每个单位占 1 格。
- 冰箱中对应单位做 40% 左右透明预扣表现。
- 点击槽位、拖回冰箱、点击“清空”都可以撤回。
- 只有 `cookRecipe()` 成功后才正式扣库存。

## 13. `cookRecipe()` 要求

必须先再次检查：

- 当前状态为 READY。
- 配方存在且唯一。
- 库存足够。

然后一次性：

1. 扣库存。
2. 清选择。
3. 记录完成菜。
4. 重算 urgent 进度。
5. 重算可制作菜。
6. 重算是否已满足完成条件。

不能边扣边校验。

## 14. “今晚还能做”初始与变化

初始为 4 道。

例如完成番茄炒蛋后：剩 3 道。

若再完成蛋炒饭：此时还剩一个鸡蛋，牛奶蒸蛋和洋葱煎蛋都“当前可做”，所以显示 2 道。

当最后一个鸡蛋用于牛奶蒸蛋：

- 牛奶蒸蛋本身进入已完成。
- 洋葱煎蛋因鸡蛋为 0 变成不可做。
- `今晚还能做 2 道` → `0 道`。
- 必须短提示：

```text
鸡蛋用完了
1 道菜暂时做不了了
```

## 15. 菜谱抽屉

DAY 1 直接公开四道菜名，不做猜配方：

```text
可以做
- 番茄炒蛋
- 蛋炒饭
- 牛奶蒸蛋
- 洋葱煎蛋

现在做不了
- ...
```

点击菜谱只高亮相关食材，不自动加入、不自动开火。

## 16. 教学

首次进入只有两条强制教学：

1. `点击或拖动食材，把它放进料理区。`
2. 第一次 READY 时：`配方凑齐了，开火试试。`

禁止明确提示：

- “鸡蛋只有三个”。
- “不要先做洋葱煎蛋”。
- “正确答案是……”。
- 自动高亮最优三道菜。

如果第一次重玩，可只出现一次：

> 这次，留意一下哪些菜在抢同一种食材。

仍然不要点名鸡蛋。

## 17. 目标完成反馈

完成对应 urgent 食材后，从顶部目标中短暂打勾再消失。

全部 urgent 完成：

`✓ 今天要救的东西都处理好了`

`结束` 按钮高亮为 `完成今晚`。

## 18. 提前结束

仍有 urgent 食材时：

```text
今晚还有东西没处理

牛奶 ×1

现在结束，它会被算作浪费。

[再看看] [就这样吧]
```

## 19. 结算公式

```text
clearRate = usedUrgentUnits / 4
waste = sum(remaining urgent wasteValue)
nutritionAverage = average(completedRecipe.nutritionScore)
```

DAY 1 营养等级：

- S：≥90
- A：75–89
- B：60–74
- C：<60

## 20. 推荐结果文案

### 100%

```text
100%
冰箱清空率

浪费 ¥0
做出 3 道菜
营养 A
★★★

「精算规划型」
三个鸡蛋，一个都没白用。

今晚 MVP：鸡蛋
```

主按钮：`下一关`。

### 75%

应突出剩余物，例如：

```text
75%
冰箱清空率
浪费 ¥4.80

今晚留下了：
牛奶 ×1

「明天再说型」
差一点，冰箱里还有个小尾巴。
```

主按钮：`重新规划`。

## 21. 推荐初始状态 JSON

```json
{
  "levelId": "day_01",
  "status": "PLAYING",
  "inventory": {
    "egg": 3,
    "tomato": 2,
    "rice": 1,
    "carrot": 1,
    "milk": 1,
    "onion": 1,
    "luncheon_meat": 2
  },
  "selected": {},
  "completedRecipes": [],
  "urgent": {
    "tomato": 2,
    "rice": 1,
    "milk": 1
  }
}
```

## 22. 必要核心函数

建议至少拆分：

```text
addIngredient()
removeIngredient()
clearSelection()
matchRecipe()
getPossibleRecipes()
cookRecipe()
calculateUrgentClearRate()
calculateWaste()
calculateNutritionGrade()
finishLevel()
resetLevel()
```

UI 不直接修改库存。

## 23. 埋点/本地日志

即使没有后端，也建议记录：

```text
level_start
ingredient_selected
recipe_ready
recipe_cooked
recipe_became_unavailable
level_finish
restart_level
```

重点分析：

- 第一做菜是什么。
- 首次成绩。
- 是否重玩。
- 第二次成绩。

## 24. DAY 1 核心验收瞬间

### Moment A

玩家看到最后 1 个鸡蛋，同时还有两个菜可做，并停顿思考。

### Moment B

玩家用掉最后一个鸡蛋，看到另一个原本可做的菜变灰/移入“现在做不了”。

### Moment C

75% 结算后玩家能自己说出类似：

> “我刚才不应该先做那个。”

只有 Moment C 出现，核心 Vertical Slice 才算真正成立。

## 25. DAY 1 开发完成定义

必须全部满足：

- 冰箱场景可用。
- 7 种食材可交互。
- 点击与拖拽都可用。
- 4 槽料理区完成。
- multiset 匹配完成。
- 4 道菜可制作。
- 预扣/撤回正确。
- 库存正式扣除正确。
- urgent 目标正确更新。
- “今晚还能做”实时刷新。
- 最后鸡蛋的机会成本反馈存在。
- 可提前结束。
- 50/75/100% 结果正确。
- 三星正确。
- 无刷新重玩。
- 手机竖屏布局正常。
