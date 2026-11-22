# 工作区提示（github-workbench）

- 本插件是三插件联合开发区的一员，依赖 ../shared/ 两个模块：
  - agents-block —— 本插件写入 AGENTS.md 的推送提醒托管块（`<!-- github-workbench:start -->`）由它读写；块内内容改动后无需手动迁移，下次建仓/关联时自动刷新。
  - local-store —— 拒绝工作区表（~/.dsh/github-workbench.json）的读写协议。
- 改动 shared/ 下模块前，先评估对 project-cognition-plugin 的影响（它是两模块的另一消费方）；改完回归其测试（29 例）。
- session-gate 传感器：本插件 client.js 内的副本以 ../shared/session-gate/index.js 为权威算法，改启发式先改共享模块再移植。
- 提交习惯：本仓库单独提交；涉及 shared/ 时在提交信息中注明模块指纹（见仓库 git log 的 previous 提交样例）。
