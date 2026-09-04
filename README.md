# 冰箱清空计划

《冰箱清空计划》是一款面向手机竖屏的小红书小工具轻策略游戏。

一句话：**在食材过期前，用有限食材组合出尽可能合理的菜，减少浪费。**

> 你的冰箱里没有剩菜，只有还没被想出来的晚饭。

## 当前阶段

当前优先开发：**DAY 1 Vertical Slice —「先救番茄」**。

不要先批量扩展 8 个关卡。第一阶段只验证核心玩法：多个菜谱争抢有限的万能食材，玩家必须理解自己的选择会关闭后续方案。

## AI / 开发者从这里开始

任何 AI 编码代理或开发者在修改工程前，请按顺序阅读：

1. [`AGENTS.md`](./AGENTS.md) — 项目总约束、AI 工作规则、文档优先级。
2. [`docs/README.md`](./docs/README.md) — 设计文档索引。
3. [`docs/03_DAY1_VERTICAL_SLICE.md`](./docs/03_DAY1_VERTICAL_SLICE.md) — 当前开发的 DAY 1 canonical 规格。
4. [`docs/05_IMPLEMENTATION_ACCEPTANCE.md`](./docs/05_IMPLEMENTATION_ACCEPTANCE.md) — 工程与验收规范。

同时提供：

- `CLAUDE.md`：Claude Code 入口。
- `GEMINI.md`：Gemini CLI 入口。

## 文档结构

```text
AGENTS.md
CLAUDE.md
GEMINI.md

docs/
  README.md
  00_PROJECT_CHARTER.md
  01_GAME_DESIGN_SPEC.md
  02_UI_UX_SPEC.md
  03_DAY1_VERTICAL_SLICE.md
  04_CONTENT_CATALOG.md
  05_IMPLEMENTATION_ACCEPTANCE.md
```

## 核心玩法

食材是有限资源，菜谱是不同的资源组合方案。

DAY 1 中四道菜都需要鸡蛋，但只有 3 个鸡蛋。玩家必须决定把鸡蛋分配给哪里。游戏真正要产生的思考不是“这个能做什么菜”，而是：

> **用了这个以后，我还能做什么？**

## 比赛版目标范围

- 8 个关卡。
- 约 25 种食材。
- 约 20 道菜。
- 4 类规则：保质期、人数、热量、游戏内烹饪时间。
- 1 个主要冰箱场景。
- 1 套结算/分享卡。
- 手机竖屏优先。
- 单局自然游玩约 60–120 秒，不设置现实倒计时。

详细规范以 `AGENTS.md` 与 `docs/` 为准。
