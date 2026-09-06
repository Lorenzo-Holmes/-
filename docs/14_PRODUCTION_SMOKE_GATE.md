# 14 — Production Smoke 与 v0.4 冻结规程

本文件定义执行方式，不复制当前状态。当前候选基线、阻塞与发布状态唯一见 `08_IMPLEMENTATION_STATUS.md`；发布证据集中回填 Issue #2。

## 验收对象

正式 Worker：`https://worker.1106314996.workers.dev/`。

必须验证根入口 `/`、直接入口 `/game/index.html` 与 iframe 兼容入口 `/game/play.html`。后者必须进入其实际子框架操作，不能只确认 iframe 壳返回 200。

## 证据类型

每次运行保存确切 Git SHA、执行时间、目标地址、HTTP / MIME / 运行文件 SHA-256、浏览器错误、分步骤结果、360×640 与 390×844 截图及测试录像。

运行文件内容一致只证明这些运行文件与候选快照相同，不证明 Cloudflare 后台构建的提交 ID。存在后台构建来源记录时一并记录；不得把内容一致描述为已读取 Cloudflare 部署元数据。

历史 36 / 36、20 / 20、38 / 38 结果不是本次新测。HTTP 200 不是交互通过。代码覆盖检查不是人工视觉验收。测试录像不是剪辑完成的投稿视频。

## 自动化契约

自动化入口为 `scripts/production-smoke.cjs`，工作流为 `.github/workflows/production-smoke.yml`。脚本分两阶段：

```bash
node scripts/production-smoke.cjs --http-only
node scripts/production-smoke.cjs --browser-only
```

默认目标为上述正式 Worker，输出目录为 `artifacts/production-smoke/`。可用 `SMOKE_BASE_URL` 和 `SMOKE_OUTPUT` 调整；不得把本地服务器测试结果称为线上结果。

HTTP 阶段检查入口实际响应、当前 `index.html` 引用的脚本 / 样式，以及仓库正式图片文件。脚本不向服务写入账号或业务数据，不执行部署、打 Tag、关闭 Issue。失败时必须保留逐项记录，不使用 `continue-on-error` 将失败伪装为成功。

浏览器阶段使用独立的新浏览器上下文，真实点击页面控件，仅只读检查游戏状态。两入口、两尺寸分别覆盖：初始目标与首屏布局、图片解码、零道菜不解锁、预扣 / 撤回、无效配方不扣库存、75% 留牛奶与 ¥4.80、无刷新重玩、100% / ¥0 / 精算规划型、进入 DAY 2、Console 和资源错误。它是发布 smoke，不替代八关完整回归、Pointer Events 拖拽专项、真机或小红书容器测试。

HTTP 结果未通过时，不将浏览器阶段记为通过。浏览器未执行或缺少依赖属于未完成，不是已通过。报告中的 `releaseApproved` 保持 false，最终放行须人工复核。

## 人工复核

在实际部署环境复核 screenshot 中正式食材 / 菜品可辨认、首屏无溢出、关键控件可见，无错误占位或图片裁切。用真实手机至少补一次点击与拖拽；小红书容器兼容不能仅凭桌面 Chromium 手机尺寸模拟宣布通过。

录屏与截图对应的运行代码应与候选一致。若中途修改任何运行代码，重新跑受影响的测试并更新基线。

## 放行与冻结

只有目标提交的 CI、Production Smoke、截图 / 必要现场复核均通过且 Issue #2 无未处理阻断项，才关闭 Issue #2 并冻结 v0.4。

冻结对象必须是验收通过的确切 SHA，不能无条件使用稍后漂移的 main。记录 Tag 名、SHA、部署地址、验证运行和已知边界；若 v0.4 已存在，先核对对象，不覆盖、不移动既有 Tag。

可在验收之前准备文案、分镜和 Release Notes 草稿。没有真实截图、录像或投稿回执时，分别标为“待采集”“待录制”“未投稿”。

## 外部限制处理

网络无法解析、浏览工具拒绝访问、DevSpace 权限错误，只说明当前执行路径受限。保留错误原文和未验证项，不据此下结论网站宕机，不关闭发布 Gate，不强行创建正式版本。
