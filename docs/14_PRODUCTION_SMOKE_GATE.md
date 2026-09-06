# 14 — Production Smoke 与 v0.4 冻结规程

本文件定义执行方式，不复制当前状态。当前候选基线、阻塞与发布状态唯一见 `08_IMPLEMENTATION_STATUS.md`；发布证据集中回填 Issue #2。

## 验收对象与路径映射

正式 Worker：`https://worker.1106314996.workers.dev/`。

**公网入口是 `/`、`/index.html` 与 iframe 兼容入口 `/play.html`。** 仓库中的 `game/` 目录被挂载到站点根目录，故 `game/app.js` 对应公网 `/app.js`，不是 `/game/app.js`。本地从仓库根目录启动静态服务时，才使用 `/game/index.html` 和 `/game/play.html`。

此映射来自 2026-09-06 实测：run `34041936788` 的路径诊断确认全部 13 个根目录运行文件 HTTP 200 且 SHA-256 与候选一致，根页面也与 `game/index.html` 一致。旧 `/game/` 入口与资源返回 404 的失败记录保留，不改写成通过。本次修正文档及测试的公网映射，不宣称已添加旧路径兼容跳转。

兼容入口必须进入实际 iframe 操作，不能只确认外壳返回 200。

## 证据类型

每次运行保存确切 Git SHA、执行时间、目标地址、路径映射、HTTP / MIME / 运行文件 SHA-256、浏览器错误、分步骤结果、360×640 与 390×844 截图及测试录像。

运行文件内容一致只证明这些运行文件与候选快照相同，不证明 Cloudflare 后台构建的提交 ID。存在后台构建来源记录时一并记录；不得把内容一致描述为已读取 Cloudflare 部署元数据。

历史 36 / 36、20 / 20、38 / 38 结果不是本次新测。HTTP 200 不是交互通过。代码覆盖检查不是人工视觉验收。测试录像不是剪辑完成的投稿视频。

## 自动化契约

入口为 `scripts/production-smoke.cjs`，工作流为 `.github/workflows/production-smoke.yml`。生产工作流已显式设置 `SMOKE_PUBLIC_PREFIX: /`。

从仓库根目录执行生产检查：

```bash
export SMOKE_BASE_URL=https://worker.1106314996.workers.dev/
export SMOKE_PUBLIC_PREFIX=/
node scripts/production-smoke.cjs --http-only
node scripts/production-smoke.cjs --browser-only
```

浏览器阶段需要 Playwright 与 Chromium；工作流在 runner 临时目录安装固定版本依赖，通过 `PLAYWRIGHT_MODULE` 指定模块位置，不写入游戏运行依赖。

输出为 `artifacts/production-smoke/`，可用 `SMOKE_OUTPUT` 调整。脚本的默认公网前缀为 `/game/`；脱离工作流执行时必须按部署映射设置，不得把本地测试冒充线上测试。`--browser-only` 检查报告 SHA、目标地址及公网前缀一致。

HTTP 阶段检查入口实际响应、当前 `index.html` 引用的脚本 / 样式及仓库图片。脚本不向服务写入账号或业务数据，不部署、不打 Tag、不关闭 Issue。失败保留逐项记录，不用 `continue-on-error` 伪装成功。

浏览器阶段使用独立的新浏览器上下文，通过真实页面操作改变该测试上下文的本地游戏进度；状态断言只读，不直接改库存、进度或 DOM 伪造结果。两入口、两尺寸覆盖初始目标与首屏布局、图片解码、零道菜不解锁、预扣 / 撤回、无效配方不扣库存、75% 留牛奶与 ¥4.80、无刷新重玩、100% / ¥0 / 精算规划型、进入 DAY 2、Console 和资源错误。

此 smoke 不替代八关完整回归、Pointer Events 拖拽专项、真机或小红书容器测试。HTTP 未通过时不将浏览器阶段记为通过；依赖缺失或浏览器未运行属于未完成。`releaseApproved` 保持 false，最终放行须复核。

## 人工复核

复核实际部署截图中的正式食材 / 菜品辨识度、图片裁切、首屏布局和关键控件；真实手机至少补一次点击与拖拽。小红书容器兼容不能仅凭桌面 Chromium 手机尺寸模拟宣布通过。

若修改任何运行代码，重跑受影响测试并更新基线。只修改文档不等于改动游戏运行内容，但冻结的确切提交仍需记录。

## 放行与冻结

只有目标提交的 CI、Production Smoke、截图 / 必要现场复核均通过且 Issue #2 无未处理阻断项，才关闭 Issue #2 并冻结 v0.4。

冻结对象必须是验收通过的确切 SHA，不能无条件使用稍后漂移的 main。记录 Tag 名、SHA、部署地址、验证运行和已知边界。若 v0.4 已存在，核对对象，不覆盖、不移动既有 Tag。

旧 `/game/` 公网路径不作为实际两个入口替身；其兼容性和已分发旧链接应单独记录，不能声称路径修复已部署。

验收之前可准备文案、分镜与 Release Notes 草稿。没有真实截图、录像或投稿回执时，分别标为待采集、待录制、未投稿。

## 外部限制处理

网络无法解析、浏览工具拒绝访问、DevSpace 权限错误，只说明当前执行路径受限。保留错误及未验证项，不据此判断网站宕机，不强行关闭发布 Gate 或创建正式版本。
