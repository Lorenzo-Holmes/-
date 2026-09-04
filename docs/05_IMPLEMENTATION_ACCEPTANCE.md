# 05 — 工程实现与验收规范

## 1. 当前优先级

当前只要求先完成 DAY 1 Vertical Slice。

开发顺序：

1. 规则层 / 数据模型。
2. DAY 1 配置。
3. 主游戏页布局。
4. 点击选食材。
5. 拖拽选食材。
6. 预扣 / 撤回。
7. multiset 配方匹配。
8. 开火事务。
9. urgent 进度。
10. “今晚还能做”。
11. 机会成本反馈。
12. 结算 / 重玩。
13. 动画与音效细化。

不要一开始批量制作 DAY 2–8。

## 2. 推荐数据驱动结构

技术栈由实际工程决定，但内容层建议具有类似结构：

```text
src/
  game/
    engine/
      recipeMatcher
      inventory
      scoring
      levelState
    data/
      ingredients
      recipes
      levels
    components/
      Fridge
      Ingredient
      CookingArea
      RecipeDrawer
      ResultCard
```

具体目录允许调整，关键原则是规则/数据/UI 解耦。

## 3. 最小数据接口

### Ingredient

```ts
interface IngredientDefinition {
  id: string
  name: string
  expireLevel: 'normal' | 'soon' | 'urgent'
  wasteValue: number
  calories: number
  category: string
  image?: string
}
```

关卡库存数量单独存在，不建议把运行时 `quantity` 写回全局定义。

### Recipe

```ts
interface RecipeDefinition {
  id: string
  name: string
  ingredients: Record<string, number>
  servings: number
  cookTime: number
  calories: number
  nutritionScore: number
  image?: string
}
```

### Level

```ts
interface LevelDefinition {
  id: string
  day: number
  title: string
  intro: string
  inventory: Record<string, number>
  urgentIngredients: Record<string, number>
  availableRecipes: string[]
  rules: unknown[]
  starConditions: unknown
}
```

## 4. 运行时状态建议

```ts
interface GameState {
  levelId: string
  status: 'LEVEL_INIT' | 'PLAYING' | 'COOKING' | 'RESULT'
  inventory: Record<string, number>
  selected: Record<string, number>
  completedRecipes: string[]
  initialUrgent: Record<string, number>
}
```

实际实现可增加 UI 状态，但不要把业务真相散落在多个组件本地 state 中。

## 5. 配方匹配测试

至少覆盖：

- 空选择 → EMPTY。
- `egg:1` → POSSIBLE。
- `tomato:1, egg:1` → POSSIBLE。
- `tomato:2, egg:1` → READY: tomato_egg。
- `milk:1, carrot:1` → INVALID。
- 同样食材不同加入顺序得到相同结果。
- 数量超过菜谱需求不能被当作子集。

## 6. 事务式烹饪

`cookRecipe()` 之前必须完成所有验证，验证失败时库存不能发生部分变化。

成功时一次性更新：

- 库存。
- 料理区选择。
- 完成菜。
- 即期完成进度。
- 当前可做菜谱。
- 是否可结束。

必须为该逻辑提供单元测试或至少纯函数测试。

## 7. DAY 1 功能测试

### TC01 — 选择鸡蛋

操作：点击鸡蛋。

期望：

- 料理槽加入 1 个鸡蛋。
- 正式库存仍为 3。
- UI 显示 1 个鸡蛋处于预扣。

### TC02 — 清空选择

操作：点击“清空”。

期望：

- selected 归零。
- 鸡蛋 UI 恢复完整 ×3。

### TC03 — 番茄炒蛋 READY

操作：选择番茄×2 + 鸡蛋×1。

期望：

- 状态 READY。
- 显示“番茄炒蛋”。
- 开火可用。

### TC04 — INVALID

操作：牛奶 + 胡萝卜。

期望：

- INVALID。
- 不可开火。
- 不消耗任何库存。

### TC05 — 正式制作

操作：完成番茄炒蛋。

期望：

- 番茄 2→0。
- 鸡蛋 3→2。
- 完成菜 +1。
- 番茄从 urgent 目标中完成/移除。

### TC06 — 四槽限制

操作：槽位满后继续加入。

期望：

- 第五单位不进入。
- 短提示“锅里放不下更多了”。

### TC07 — 最后一个鸡蛋

操作：消耗最后一个鸡蛋。

期望：

- 所有需要鸡蛋且未完成的菜重新评估。
- 相关菜移入“现在做不了”。
- 出现一次机会成本短反馈。

### TC08 — 75% 结算

例如留下牛奶。

期望：

- 清空率 75%。
- 浪费 ¥4.80。
- ★★☆。
- 剩余牛奶明确展示。

### TC09 — 100% 结算

完成番茄炒蛋、蛋炒饭、牛奶蒸蛋。

期望：

- 清空率 100%。
- 浪费 ¥0。
- ★★★。
- 精算规划型。

### TC10 — 无刷新重玩

操作：结果页点击“重新规划”。

期望：

- 页面不 reload。
- 全部运行时状态恢复 DAY 1 初始值。
- 不再次强制播放首次教学。

## 8. UI 验收

至少在 360、390、430 宽度下检查：

- 关键按钮没有被安全区遮挡。
- 冰箱始终是最大视觉主体。
- 食材 hitbox ≥44×44 px。
- 料理区四槽全部可点击。
- Header 目标不会因小屏换行到不可读。
- Bottom Sheet 可关闭。
- 无横向溢出。

## 9. 性能与交互

- 开火动画目标约 800ms。
- 结果重玩过渡目标约 700ms。
- 核心点击反馈应即时。
- 不要用重动画阻塞资源决策。
- 移动端拖拽中必须阻止不必要的页面滚动，但不要破坏普通页面行为。

## 10. 可访问性最低要求

- 不能只靠颜色表达 urgent；同时使用“今天”标签。
- 点击目标区域足够大。
- 主要文字对比度可读。
- 所有重要操作都应可通过点击完成，拖拽不是唯一输入方式。

## 11. 美术占位原则

实现规则前可以用简单占位素材，但：

- 不能把 Emoji 当最终素材。
- 最终食材风格必须统一。
- 不要从不同图库随意混照片。
- 即使占位也应保持冰箱空间布局，而不是退化成卡片列表。

## 12. 不通过的典型情况

出现以下任一情况时，不应宣布 DAY 1 完成：

- 玩家无法知道哪些食材今天必须处理。
- 食材放入料理区立即永久扣除，无法撤回。
- 顺序不同导致同一菜谱无法匹配。
- 最后一个鸡蛋用掉后其他选择没有明显变化反馈。
- 75% 结果不告诉玩家具体剩了什么。
- 重玩需要刷新整个网页。
- 只有拖拽，没有点击备用操作。
- UI 看起来像菜谱/健康 App，而非游戏场景。

## 13. 产品试玩 Gate

找未阅读设计文档的试玩者，只告诉对方：

> 把今晚快坏的东西尽量处理掉。

不要解释鸡蛋策略。

重点记录：

1. 第一做菜是什么。
2. 首次清空率。
3. 未满 100% 时是否能自行解释原因。
4. 是否主动点击重新规划。
5. 第二次成绩是否改善。

核心目标不是某个固定统计阈值，而是明确观察到：玩家理解“资源被多个方案争抢”。

若多数玩家只是照菜谱列表操作、没有资源规划感，必须先修主界面反馈和关卡诱饵，不要继续扩关卡。

## 14. AI 提交前检查清单

每次 AI 修改实现后至少检查：

- [ ] 未擅自扩大 MVP 范围。
- [ ] DAY 1 的 4 菜争抢 3 鸡蛋结构未改变。
- [ ] 核心规则仍数据驱动。
- [ ] UI 没有直接修改库存。
- [ ] 配方匹配顺序无关。
- [ ] 预扣可以完整撤回。
- [ ] 开火是原子操作。
- [ ] “今晚还能做”在库存变化后实时更新。
- [ ] 最后关键资源耗尽有选择关闭反馈。
- [ ] 结算数字与剩余食材一致。
- [ ] 重玩无需刷新。
- [ ] 手机竖屏可正常完成整局。
