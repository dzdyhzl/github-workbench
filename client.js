// Client half of the GitHub repository workbench.
//
// Registers one lazy factory whose id equals the package name: it mounts the
// Host Remote contribution (githubWorkbench namespace, SRC descriptors), the
// sidebar panel entry with its icon, and the workbench page in the root
// `main` keyed slot. React comes from the browser module table.

window.__ModuleLoader__.load({
  id: '@dsh-local/view-11cbfdbc-7886-4863-a239-bb0858fede55',
  factory(require) {
    const React = require('react')
    const ReactDOM = require('react-dom')
    const h = React.createElement
    const { useState, useEffect, useMemo, useCallback, useRef } = React

    const PKG = '@dsh-local/view-11cbfdbc-7886-4863-a239-bb0858fede55'
    const NS = 'githubWorkbench'
    const PANEL_ID = 'github-repo-workbench'

    // ------------------------------------------------------------ dictionaries

    const zh = {
      panel: 'GitHub 仓库工作台',
      loading: '正在加载…',
      retry: '重试',
      refresh: '刷新',
      refreshDone: '已刷新',
      searchPlaceholder: '搜索仓名、描述、归属…',
      noMatch: '没有匹配的仓库',
      loadMore: '加载更多',
      loadMoreDone: '已加载全部',
      createForWorkspace: '为工作区建仓',
      workspaceScope: '匹配 DSH 中已登记工作区的 Git origin。',
      workspaceEmpty: '尚无已登记的工作区。',
      workspaceScanning: '正在匹配本地工作区…',
      workspaceScanFailed: '无法匹配本地工作区：{message}',
      workspaceLinkUnknown: '本地链接待确认',
      workspacePicker: '选择已登记的工作区',
      workspaceManual: '手动输入目录路径',
      workspaceOpenFailed: '无法打开工作区：{message}',
      workspaceRemoved: '这个工作区已不在当前列表中，请刷新后重试。',
      statusFailed: '无法读取 GitHub 工作台状态',
      accountLabel: '账户',
      accountSingleHint: '当前仅有一个账户',
      switchConfirmTitle: '切换 GitHub 账户？',
      switchConfirmBody: '切换会修改本机 gh CLI 的活动账户，影响本机其他使用 gh 的流程。之后不再询问。',
      switchConfirm: '切换',
      cancel: '取消',
      ghMissingTitle: '需要安装 GitHub CLI（gh）',
      ghMissingBody: '此页面依赖本机的 gh CLI。请安装 GitHub CLI，然后在终端运行 gh auth login 登录，再点击"重新检测"。',
      ghAuthTitle: 'gh 已安装，但还没有已登录的 GitHub 账户',
      ghAuthBody: '请在终端运行 gh auth login 完成 GitHub 登录，然后点击"重新检测"。检测通过后会自动进入工作台。',
      recheck: '重新检测',
      diagnostic: '诊断信息',
      categoryPersonal: '个人',
      categoryCollaborator: '协作',
      categoryOrg: '组织',
      visibilityPrivate: '私有',
      visibilityPublic: '公开',
      updated: '更新于 {time}',
      linkedOne: '已链接 1 个工作区',
      linkedMany: '已链接 {n} 个工作区',
      openOnGithub: '在 GitHub 打开',
      candidateTitle: '选择要打开的工作区',
      candidateByRecent: '按最近使用排序',
      openWorkspace: '打开',
      sessionCreated: '已创建并打开会话',
      sessionManual: '已跳转到工作区，请手动新建会话',
      createTitle: '为工作区创建 GitHub 仓库',
      createWorkspace: '工作区',
      createName: '仓名',
      createNameHint: '默认为目录名，可修改',
      createDescription: '描述（可选）',
      createVisibility: '可见性',
      createSubmit: '创建仓库',
      createPrivate: '私有',
      createPublic: '公开',
      createExistsTitle: '同名仓库已存在',
      createExistsBody: '{owner}/{name} 已存在于当前账户下。请修改仓名，或改为关联已有仓库。',
      createRename: '改名重建',
      createLinkExisting: '关联已有仓库',
      createSuccess: '已创建 {url}。请完成首次提交后推送：',
      createFailed: '操作失败：{message}',
      declinedTitle: '被拒绝建仓的工作区',
      declinedAccount: '当前账户：{account}',
      declinedEmpty: '当前账户还没有被拒绝建仓的工作区记录。',
      declinedPath: '工作区路径',
      declinedTime: '拒绝时间',
      declinedRemark: '备注',
      declinedRemarkPlaceholder: '默认空，可手动编辑保存',
      declinedSave: '保存',
      declinedSaved: '备注已保存',
      declinedCreateNow: '立即建仓',
      declinedRemove: '移除',
      gateTitle: '这个工作区还没有关联 GitHub 仓库',
      gateBody: '{path}',
      gateCreate: '创建仓库',
      gateCreateHint: '在 GitHub 上新建仓库并关联此目录',
      gateDecline: '拒绝创建',
      gateDeclineHint: '记录到黑名单，此目录不再询问',
      gateClose: '关闭',
      gateDeclineFailed: '写入黑名单失败：{message}',
      removeConfirmTitle: '移除该记录？',
      removeConfirmBody: '移除后，下次会话在 {path} 首轮检查时会重新询问是否建仓。',
      removeConfirm: '移除',
      templateTitle: '建仓提示词模板（点击复制）',
      templateCopied: '模板已复制',
      copy: '复制',
      close: '关闭',
      remarkFailed: '操作失败：{message}',
      storePathLabel: '数据文件',
      visibilityAction: '可见性',
      visibilityChangeTitle: '修改仓库可见性',
      visibilityChangeToPublic: '将 {owner}/{name} 从私有改为公开？',
      visibilityChangeToPrivate: '将 {owner}/{name} 从公开改为私有？',
      visibilityChangePublicBody: '公开后，任何人都能查看该仓库的代码、提交与 Issue。',
      visibilityChangePrivateBody: '私有后，该仓库仅你和被授权的协作者可见；已绑定的 GitHub Pages 站点会下线，公开链接将失效。',
      visibilityChangeConfirm: '确认修改',
      visibilityChanged: '可见性已更新：{owner}/{name} 现为{visibility}',
      visibilityNoPermission: '没有管理权限，无法修改可见性',
    }

    const en = {
      panel: 'GitHub repository workbench',
      loading: 'Loading…',
      retry: 'Retry',
      refresh: 'Refresh',
      refreshDone: 'Refreshed',
      searchPlaceholder: 'Search name, description, owner…',
      noMatch: 'No matching repositories',
      loadMore: 'Load more',
      loadMoreDone: 'All loaded',
      createForWorkspace: 'Create repository for a workspace',
      workspaceScope: 'Matches the Git origin of workspaces registered in DSH.',
      workspaceEmpty: 'No workspaces are registered yet.',
      workspaceScanning: 'Matching local workspaces…',
      workspaceScanFailed: 'Could not match local workspaces: {message}',
      workspaceLinkUnknown: 'Local link not checked',
      workspacePicker: 'Choose a registered workspace',
      workspaceManual: 'Enter a directory path manually',
      workspaceOpenFailed: 'Could not open the workspace: {message}',
      workspaceRemoved: 'The workspace is no longer in the list. Refresh and try again.',
      statusFailed: 'Could not read GitHub workbench status',
      accountLabel: 'Account',
      accountSingleHint: 'Only one account is signed in',
      switchConfirmTitle: 'Switch GitHub account?',
      switchConfirmBody: 'Switching changes the active account of the local gh CLI and affects other local gh flows. This will not ask again.',
      switchConfirm: 'Switch',
      cancel: 'Cancel',
      ghMissingTitle: 'The GitHub CLI (gh) is required',
      ghMissingBody: 'This page depends on the local gh CLI. Install the GitHub CLI, run gh auth login in a terminal, then press "Re-check".',
      ghAuthTitle: 'gh is installed but no GitHub account is signed in',
      ghAuthBody: 'Run gh auth login in a terminal, then press "Re-check". The workbench opens automatically once detection passes.',
      recheck: 'Re-check',
      diagnostic: 'Diagnostic',
      categoryPersonal: 'Personal',
      categoryCollaborator: 'Collaborator',
      categoryOrg: 'Organization',
      visibilityPrivate: 'Private',
      visibilityPublic: 'Public',
      updated: 'Updated {time}',
      linkedOne: 'Linked to 1 workspace',
      linkedMany: 'Linked to {n} workspaces',
      notLinked: 'No local workspace linked',
      openOnGithub: 'Open on GitHub',
      candidateTitle: 'Choose a workspace to open',
      candidateByRecent: 'Sorted by recent use',
      openWorkspace: 'Open',
      sessionCreated: 'Session created and opened',
      sessionManual: 'Moved to the workspace; create the session manually',
      createTitle: 'Create a GitHub repository for a workspace',
      createWorkspace: 'Workspace',
      createName: 'Repository name',
      createNameHint: 'Defaults to the directory name; editable',
      createDescription: 'Description (optional)',
      createVisibility: 'Visibility',
      createSubmit: 'Create repository',
      createPrivate: 'Private',
      createPublic: 'Public',
      createExistsTitle: 'A repository with this name exists',
      createExistsBody: '{owner}/{name} already exists under this account. Rename the new repository, or link the existing one instead.',
      createRename: 'Rename and create',
      createLinkExisting: 'Link the existing repository',
      createSuccess: 'Created {url}. Push after your first commit:',
      createFailed: 'Operation failed: {message}',
      declinedTitle: 'Workspaces that declined repository creation',
      declinedAccount: 'Current account: {account}',
      declinedEmpty: 'No declined-workspace records for this account yet.',
      declinedPath: 'Workspace path',
      declinedTime: 'Declined at',
      declinedRemark: 'Remark',
      declinedRemarkPlaceholder: 'Empty by default; edit and save',
      declinedSave: 'Save',
      declinedSaved: 'Remark saved',
      declinedCreateNow: 'Create now',
      declinedRemove: 'Remove',
      gateTitle: 'This workspace is not linked to a GitHub repository',
      gateBody: '{path}',
      gateCreate: 'Create repository',
      gateCreateHint: 'Create a new GitHub repository and link this directory',
      gateDecline: 'Decline',
      gateDeclineHint: 'Record to the blacklist; this directory will not be asked again',
      gateClose: 'Close',
      gateDeclineFailed: 'Failed to record the blacklist entry: {message}',
      removeConfirmTitle: 'Remove this record?',
      removeConfirmBody: 'After removal, the first-turn check asks about creating a repository again in {path}.',
      removeConfirm: 'Remove',
      templateTitle: 'Repository creation prompt template (click to copy)',
      templateCopied: 'Template copied',
      copy: 'Copy',
      close: 'Close',
      remarkFailed: 'Operation failed: {message}',
      storePathLabel: 'Data file',
      visibilityAction: 'Visibility',
      visibilityChangeTitle: 'Change repository visibility',
      visibilityChangeToPublic: 'Make {owner}/{name} public?',
      visibilityChangeToPrivate: 'Make {owner}/{name} private?',
      visibilityChangePublicBody: 'Once public, anyone can view the code, commits, and issues of this repository.',
      visibilityChangePrivateBody: 'Once private, only you and authorized collaborators can see it; attached GitHub Pages sites go offline and public links stop working.',
      visibilityChangeConfirm: 'Change visibility',
      visibilityChanged: 'Visibility updated: {owner}/{name} is now {visibility}',
      visibilityNoPermission: 'No admin permission; visibility cannot be changed',
    }

    function makeT(locale) {
      const dict = locale === 'zh' ? zh : en
      return (key, params) => {
        let template = dict[key] ?? en[key] ?? key
        if (params !== undefined) {
          template = template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
        }
        return template
      }
    }

    // ---------------------------------------------------------------- helpers

    function formatDate(iso) {
      if (typeof iso !== 'string' || iso === '') return ''
      const date = new Date(iso)
      if (Number.isNaN(date.getTime())) return iso
      return date.toISOString().slice(0, 10)
    }

    function repoCategory(repo) {
      const affiliation = String(repo.affiliation ?? '')
      if (affiliation === 'collaborator') return 'collaborator'
      if (affiliation === 'organization_member') return 'organization'
      return 'owner'
    }

    function categoryKey(category) {
      if (category === 'collaborator') return 'categoryCollaborator'
      if (category === 'organization') return 'categoryOrg'
      return 'categoryPersonal'
    }

    function repoKey(repo) {
      return String(repo.fullName || `${repo.owner}/${repo.name}`).toLowerCase()
    }

    const PROMPT_TEMPLATE_ZH = [
      '请在本工作区创建 GitHub 仓库并推送：',
      '1. 用 gh 检查本目录是否已是 git 仓库，不是则 git init；',
      '2. 和我确认仓库名（默认目录名）、描述和可见性（默认私有）；若当前账户下已存在同名仓库，提示我改名或改为关联已有仓库；',
      '3. 检查是否包含 .env、密钥等敏感文件，发现时列出清单暂停，等我确认后再继续；',
      '4. 用 gh repo create <仓名> --source . --push 创建，并用 git push -u 设置分支上游。',
    ].join('\n')

    // --------------------------------------------------------------- styles

    const css = `
.gwb-page { --gwb-inset: clamp(20px, 3.5vw, 40px); display: flex; flex-direction: column; align-items: center;
  height: 100%; box-sizing: border-box; padding: 0 var(--gwb-inset); overflow-y: auto;
  padding-top: var(--dsh-frame-top-clearance, 0px); color: var(--dsw-alias-label-primary); }
.gwb-page > * { width: 100%; max-width: 960px; }
.gwb-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 0 4px; flex-wrap: wrap; }
.gwb-title { margin: 0; font-size: 20px; font-weight: 500; line-height: 28px; }
.gwb-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.gwb-account { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
.gwb-account select { border: 0.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-md, 6px);
  background: var(--dsw-alias-bg-layer-3, transparent); color: var(--dsw-alias-label-primary);
  font: inherit; font-size: 12.5px; padding: 3px 8px; max-width: 200px; }
.gwb-account-static { border: 0.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-md, 6px);
  padding: 3px 8px; font-size: 12.5px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-3, transparent); }
.gwb-btn { border: 0.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-md, 6px);
  background: var(--dsw-alias-bg-layer-3, transparent); color: var(--dsw-alias-label-primary);
  font: inherit; font-size: 12.5px; padding: 4px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; }
.gwb-btn:hover { background: var(--dsw-alias-interactive-bg-hover); }
.gwb-btn:disabled { opacity: 0.55; cursor: default; }
.gwb-btn:focus-visible { outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); outline-offset: 2px; }
.gwb-btn-primary { border-color: transparent; background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-state-business-primary));
  color: var(--dsw-alias-label-primary-foreground, #fff); }
.gwb-btn-primary:hover { background: var(--dsw-alias-button-primary-hover, var(--dsw-alias-state-business-primary)); }
.gwb-btn-danger { color: var(--dsw-alias-state-error-primary); }
.gwb-search { width: 100%; box-sizing: border-box; margin: 8px 0 4px; border: 0.5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md, 6px); background: var(--dsw-alias-bg-layer-3, transparent);
  color: var(--dsw-alias-label-primary); font: inherit; font-size: 13px; padding: 6px 10px; }
.gwb-search:focus-visible { outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); outline-offset: 1px; }
.gwb-section { margin: 14px 0 4px; font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-secondary); }
.gwb-cards { display: flex; flex-direction: column; gap: 8px; }
.gwb-card { display: flex; align-items: center; gap: 12px; border: 0.5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-lg, 10px); background: var(--dsw-alias-bg-layer-1, transparent); padding: 10px 14px; cursor: pointer; text-align: left; font: inherit; color: inherit; }
.gwb-card:hover { background: var(--dsw-alias-interactive-bg-hover); }
.gwb-card:focus-visible { outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); outline-offset: 2px; }
.gwb-card-main { min-width: 0; flex: 1; }
.gwb-card-name { font-weight: 600; font-size: 13.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gwb-card-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 3px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.gwb-badge { border-radius: 999px; padding: 1px 8px; font-size: 11px; border: 0.5px solid var(--dsw-alias-border-l3); color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.gwb-badge-linked { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent); color: var(--dsw-alias-state-success-primary); border-color: transparent; }
.gwb-visibility-btn { cursor: pointer; font: inherit; font-size: 11px; background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 16%, transparent); color: var(--dsw-alias-state-error-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 45%, transparent); }
.gwb-visibility-btn:hover { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 32%, transparent); color: var(--dsw-alias-state-error-primary); }
.gwb-visibility-public { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 16%, transparent); color: var(--dsw-alias-state-success-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 45%, transparent); }
.gwb-visibility-public:hover { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 32%, transparent); color: var(--dsw-alias-state-success-primary); }
.gwb-visibility-btn:disabled { cursor: default; opacity: 0.45; background: var(--dsw-alias-bg-layer-3, transparent); color: var(--dsw-alias-label-tertiary); border-color: var(--dsw-alias-border-l3); }
.gwb-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.gwb-table th { text-align: left; font-weight: 500; color: var(--dsw-alias-label-tertiary); padding: 6px 10px; border-bottom: 0.5px solid var(--dsw-alias-border-l3); white-space: nowrap; }
.gwb-table td { padding: 8px 10px; border-bottom: 0.5px solid var(--dsw-alias-border-l2); vertical-align: middle; }
.gwb-path { font-family: var(--dsw-font-mono, ui-monospace, monospace); font-size: 12px; overflow-wrap: anywhere; }
.gwb-remark-input { width: 100%; box-sizing: border-box; border: 0.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-sm, 4px);
  background: var(--dsw-alias-bg-layer-3, transparent); color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px; padding: 3px 6px; }
.gwb-row-actions { display: flex; gap: 6px; justify-content: flex-end; white-space: nowrap; }
.gwb-empty { color: var(--dsw-alias-label-tertiary); font-size: 12.5px; padding: 14px 10px; margin: 0; }
.gwb-note { font-size: 12.5px; color: var(--dsw-alias-label-secondary); margin: 6px 0; overflow-wrap: anywhere; }
.gwb-error { color: var(--dsw-alias-state-error-primary); font-size: 12.5px; overflow-wrap: anywhere; }
.gwb-success { color: var(--dsw-alias-state-success-primary); font-size: 12.5px; overflow-wrap: anywhere; }
.gwb-gate { max-width: 460px; margin: 12vh auto 0; border: 0.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-xl, 14px);
  background: var(--dsw-alias-bg-layer-1, transparent); padding: 28px; text-align: center; }
.gwb-gate h2 { margin: 0 0 10px; font-size: 16px; font-weight: 600; }
.gwb-gate p { margin: 0 0 8px; font-size: 13px; line-height: 1.55; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.gwb-gate code { font-family: var(--dsw-font-mono, ui-monospace, monospace); font-size: 12px; }
.gwb-modal-mask { position: fixed; inset: 0; background: color-mix(in srgb, var(--dsw-alias-label-primary) 24%, transparent);
  display: flex; align-items: center; justify-content: center; z-index: 60; }
.gwb-modal { width: min(520px, calc(100vw - 48px)); max-height: 80vh; overflow-y: auto; box-sizing: border-box;
  border: 0.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-xl, 14px);
  background: var(--dsw-alias-bg-base, var(--dsw-alias-bg-layer-1, #fff)); padding: 18px 20px;
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0,0,0,0.18)); }
.gwb-modal h3 { margin: 0 0 10px; font-size: 15px; font-weight: 600; }
.gwb-modal p { font-size: 13px; line-height: 1.55; color: var(--dsw-alias-label-secondary); margin: 0 0 10px; }
.gwb-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.gwb-form { display: flex; flex-direction: column; gap: 10px; }
.gwb-form label { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; color: var(--dsw-alias-label-secondary); }
.gwb-form input, .gwb-form select { border: 0.5px solid var(--dsw-alias-border-l3); border-radius: var(--dsw-radius-md, 6px);
  background: var(--dsw-alias-bg-layer-3, transparent); color: var(--dsw-alias-label-primary); font: inherit; font-size: 13px; padding: 6px 9px; }
.gwb-form input:focus-visible, .gwb-form select:focus-visible { outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); outline-offset: 1px; }
.gwb-radio-row { display: flex; gap: 14px; font-size: 12.5px; color: var(--dsw-alias-label-primary); }
.gwb-radio-row label { flex-direction: row; align-items: center; gap: 5px; }
.gwb-pre { font-family: var(--dsw-font-mono, ui-monospace, monospace); font-size: 12px; line-height: 1.5;
  background: var(--dsw-alias-bg-layer-3, transparent); border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md, 6px); padding: 10px 12px; white-space: pre-wrap; overflow-wrap: anywhere; margin: 0; }
.gwb-candidate-row { display: flex; align-items: center; gap: 10px; padding: 8px 4px; border-bottom: 0.5px solid var(--dsw-alias-border-l2); font-size: 12.5px; }
.gwb-candidate-path { overflow-wrap: anywhere; color: var(--dsw-alias-label-secondary); font-size: 11.5px; }
.gwb-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 70;
  background: var(--dsw-alias-toast-bg, var(--dsw-alias-label-primary)); color: var(--dsw-alias-toast-label, var(--dsw-alias-label-primary-foreground, #fff));
  border-radius: 999px; padding: 8px 18px; font-size: 12.5px; box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgba(0,0,0,0.2)); }
.gwb-spinner { width: 13px; height: 13px; border-radius: 50%; border: 2px solid var(--dsw-alias-border-l3);
  border-top-color: var(--dsw-alias-state-business-primary); animation: gwb-spin 0.8s linear infinite; display: inline-block; vertical-align: -2px; }
@keyframes gwb-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .gwb-spinner { animation: none; } }
`

    function Styles() {
      return h('style', { 'data-plugin-css': PKG, dangerouslySetInnerHTML: { __html: css } })
    }

    // ----------------------------------------------------------- primitives

    /** Minimal snapshot store for the fullscreen gate overlay request. */
    function createGateStore() {
      let current = null
      const listeners = new Set()
      const publish = () => { for (const listener of [...listeners]) listener() }
      return {
        source: {
          getSnapshot: () => current,
          subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
          dismiss() { current = null; publish() },
        },
        set(next) { current = next; publish() },
      }
    }

    /** Minimal snapshot store for the pending multi-workspace candidate request. */
    function createCandidateStore() {
      let current = null
      const listeners = new Set()
      const publish = () => { for (const listener of [...listeners]) listener() }
      return {
        source: {
          getSnapshot: () => current,
          subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener) } },
        },
        request(value) { current = value; publish() },
        dismiss() { current = null; publish() },
      }
    }

    function Spinner() { return h('span', { className: 'gwb-spinner', 'aria-hidden': true }) }

    function Toast({ text, onDone }) {
      useEffect(() => {
        const timer = setTimeout(onDone, 2600)
        return () => clearTimeout(timer)
      }, [text, onDone])
      return ReactDOM.createPortal(
        h('div', { className: 'gwb-toast', role: 'status' }, text),
        document.body,
      )
    }

    function Modal({ title, onClose, children, footer }) {
      useEffect(() => {
        const onKey = event => { if (event.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey, true)
        return () => document.removeEventListener('keydown', onKey, true)
      }, [onClose])
      return ReactDOM.createPortal(h('div', {
        className: 'gwb-modal-mask',
        onMouseDown: event => { if (event.target === event.currentTarget) onClose() },
      }, h('div', { className: 'gwb-modal', role: 'dialog', 'aria-modal': true, 'aria-label': title },
        h('h3', null, title),
        children,
        h('div', { className: 'gwb-modal-actions' }, footer),
      )), document.body)
    }

    // Self-contained stylesheet for the gate overlay: the overlay mounts in
    // the shell.overlay seat, which renders even when the workbench page (the
    // usual Styles injector) has never been opened.
    const GATE_CSS = `
.gwb-gate-overlay { position: fixed; z-index: 40; display: flex; align-items: center; justify-content: center; }
.gwb-gate-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px;
  max-width: 560px; width: min(560px, calc(100% - 48px)); box-sizing: border-box; padding: 28px 32px; border-radius: 16px; text-align: center;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2, #fff) 62%, transparent);
  backdrop-filter: blur(22px) saturate(1.4); -webkit-backdrop-filter: blur(22px) saturate(1.4);
  border: 0.5px solid color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent);
  box-shadow: var(--dsw-elevation-prominent, 0 16px 48px rgba(0,0,0,0.22)); }
.gwb-gate-close { position: absolute; top: 12px; right: 12px; cursor: pointer; font: inherit; font-size: 14px; line-height: 1;
  width: 30px; height: 30px; border-radius: 999px; display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent); color: var(--dsw-alias-label-secondary);
  border: 0.5px solid color-mix(in srgb, var(--dsw-alias-label-primary) 14%, transparent); }
.gwb-gate-close:hover { color: var(--dsw-alias-label-primary); }
.gwb-gate-heading { margin: 0 0 4px; font-size: 17px; font-weight: 650; color: var(--dsw-alias-label-primary); }
.gwb-gate-path { margin: 0 0 14px; font-size: 12.5px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.gwb-gate-choices { display: flex; gap: 14px; width: 100%; }
.gwb-gate-choice { flex: 1; cursor: pointer; font: inherit; display: flex; flex-direction: column; gap: 6px; align-items: center;
  padding: 22px 16px; border-radius: 12px; box-sizing: border-box; transition: background 120ms ease, border-color 120ms ease; }
.gwb-gate-create { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary) 40%, transparent); color: var(--dsw-alias-state-success-primary); }
.gwb-gate-create:hover { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 22%, transparent); }
.gwb-gate-decline { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent); color: var(--dsw-alias-state-error-primary); }
.gwb-gate-decline:hover { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 22%, transparent); }
.gwb-gate-choice:disabled { cursor: default; opacity: 0.55; }
.gwb-gate-choice-title { font-size: 14.5px; font-weight: 650; }
.gwb-gate-choice-hint { font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
`

    /**
     * Conversation-anchored gate overlay. Anchored over the chat content area
     * (the [data-conversation-content] container): it covers only the
     * conversation, never the composer or the sidebars, and keeps tracking the
     * region through window resizes. The card uses a frosted-glass surface.
     */
    function GateOverlay({ gateSource, actions, locale }) {
      const t = useMemo(() => makeT(locale), [locale])
      const [gate, setGate] = useState(gateSource.getSnapshot())
      const [region, setRegion] = useState(null)
      useEffect(() => gateSource.subscribe(() => setGate(gateSource.getSnapshot())), [gateSource])
      useEffect(() => {
        if (gate === null) return
        const measure = () => {
          // Preferred: the resident session view wrapper — the chat area only,
          // never the composer (a sibling [data-composer-seat]) or sidebars.
          // The [data-chat-following-tail] attribute inside it is conditional,
          // so anchor on the structural wrapper instead of the view root.
          let anchor = document.querySelector("[data-slot='conversation.session']")
          if (anchor === null || anchor.getBoundingClientRect().height < 80) {
            // Fallback: the whole conversation body (chat + composer).
            anchor = document.querySelector('[data-conversation-content]')
          }
          if (anchor === null) { setRegion(null); return }
          const box = anchor.getBoundingClientRect()
          if (box.width < 80 || box.height < 80) { setRegion(null); return }
          setRegion({ top: box.top, left: box.left, width: box.width, height: box.height })
        }
        measure()
        window.addEventListener('resize', measure)
        const observer = new ResizeObserver(measure)
        const anchor = document.querySelector('[data-conversation-content]')
        if (anchor !== null) observer.observe(anchor)
        return () => { window.removeEventListener('resize', measure); observer.disconnect() }
      }, [gate !== null])
      const styleEl = h('style', { 'data-plugin-css': PKG + '-gate', dangerouslySetInnerHTML: { __html: GATE_CSS } })
      if (gate === null || region === null) return styleEl

      return h(React.Fragment, null, styleEl, h('div', {
        className: 'gwb-gate-overlay',
        role: 'dialog', 'aria-modal': false, 'aria-label': t('gateTitle'),
        style: { top: region.top, left: region.left, width: region.width, height: region.height },
      },
        h('div', { className: 'gwb-gate-card' },
          h('button', {
            className: 'gwb-gate-close', title: t('gateClose'), 'aria-label': t('gateClose'),
            onClick: () => actions.close(gate),
          }, "✕"),
          h('h2', { className: 'gwb-gate-heading' }, t('gateTitle')),
          h('p', { className: 'gwb-gate-path' }, t('gateBody', { path: gate.path })),
          gate.error != null ? h('p', { className: 'gwb-error' }, gate.error) : null,
          h('div', { className: 'gwb-gate-choices' },
            h('button', {
              className: 'gwb-gate-choice gwb-gate-create', disabled: gate.busy === true,
              onClick: () => actions.create(gate),
            },
              h('span', { className: 'gwb-gate-choice-title' }, t('gateCreate')),
              h('span', { className: 'gwb-gate-choice-hint' }, t('gateCreateHint')),
            ),
            h('button', {
              className: 'gwb-gate-choice gwb-gate-decline', disabled: gate.busy === true,
              onClick: () => actions.decline(gate),
            },
              h('span', { className: 'gwb-gate-choice-title' }, t('gateDecline')),
              h('span', { className: 'gwb-gate-choice-hint' }, t('gateDeclineHint')),
            ),
          ),
        ),
      ))
    }
    // --------------------------------------------------------------- visuals

    function PanelIcon({ size }) {
      return h('svg', {
        viewBox: '0 0 36 36', width: size, height: size, 'aria-hidden': true,
        style: { display: 'block' },
      }, h('path', {
        d: 'M18 6.5c-6.6 0-12 5.2-12 11.6 0 5.1 3.4 9.5 8.1 11 .6.1.8-.25.8-.55v-2c-3.3.7-4-1.55-4-1.55-.54-1.35-1.32-1.7-1.32-1.7-1.08-.72.08-.7.08-.7 1.2.08 1.83 1.2 1.83 1.2 1.06 1.78 2.79 1.27 3.47.97.1-.75.42-1.27.75-1.56-2.64-.3-5.42-1.29-5.42-5.72 0-1.27.46-2.3 1.22-3.11-.13-.3-.53-1.5.11-3.1 0 0 .98-.31 3.22 1.18a11.3 11.3 0 0 1 5.82 0c2.23-1.49 3.21-1.18 3.21-1.18.65 1.6.25 2.8.12 3.1.76.81 1.22 1.84 1.22 3.11 0 4.44-2.79 5.42-5.44 5.71.43.36.81 1.07.81 2.16v3.2c0 .3.21.66.82.55 4.73-1.53 8.09-5.9 8.09-11C30 11.7 24.6 6.5 18 6.5Z',
        fill: 'currentColor',
        style: { color: 'var(--dsw-alias-label-secondary)' },
      }))
    }

    function directoryName(path) {
      const value = String(path ?? '').replace(/[\\/]+$/, '')
      const index = Math.max(value.lastIndexOf('\\'), value.lastIndexOf('/'))
      return index >= 0 ? value.slice(index + 1) : value
    }

    function RemarkCell({ row, onSave, t }) {
      const [value, setValue] = useState(row.remark ?? '')
      useEffect(() => { setValue(row.remark ?? '') }, [row.remark])
      return h('span', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
        h('input', {
          className: 'gwb-remark-input', value,
          placeholder: t('declinedRemarkPlaceholder'),
          onChange: event => setValue(event.target.value),
          'aria-label': t('declinedRemark'),
        }),
        h('button', { className: 'gwb-btn', disabled: value === (row.remark ?? ''), onClick: () => { void onSave(row, value) } }, t('declinedSave')),
      )
    }

    function CreateRepoModal({ t, api, target, workspaces, onCreated, onClose }) {
      const [cwd, setCwd] = useState(target.cwd ?? '')
      const [name, setName] = useState(target.name ?? '')
      const nameEdited = useRef(false)
      const changeDirectory = path => {
        setCwd(path)
        if (!nameEdited.current) setName(directoryName(path.trim()))
      }
      const [description, setDescription] = useState(target.description ?? '')
      const [visibility, setVisibility] = useState('private')
      const [phase, setPhase] = useState('form') // form | exists | running | done
      const [existsInfo, setExistsInfo] = useState(null)
      const [result, setResult] = useState(null)
      const [error, setError] = useState(null)

      const submit = async () => {
        setPhase('running')
        setError(null)
        try {
          const created = await api.createRepository({ cwd, name, description, visibility, link: true })
          setResult(created)
          setPhase('done')
          onCreated?.(created)
        } catch (caught) {
          if (caught?.code === 'github-workbench/repository-exists') {
            setExistsInfo({ owner: caught?.details?.owner ?? '', name: caught?.details?.name ?? name })
            setPhase('exists')
            return
          }
          setError(caught?.message ?? String(caught))
          setPhase('form')
        }
      }

      const linkExisting = async () => {
        setPhase('running')
        setError(null)
        try {
          const created = await api.linkExisting({ cwd, owner: existsInfo.owner, name: existsInfo.name })
          setResult(created)
          setPhase('done')
          onCreated?.(created)
        } catch (caught) {
          setError(caught?.message ?? String(caught))
          setPhase('exists')
        }
      }

      return h(Modal, {
        title: t('createTitle'), onClose,
        footer: phase === 'done'
          ? [h('button', { key: 'close', className: 'gwb-btn gwb-btn-primary', onClick: onClose }, t('close'))]
          : [h('button', { key: 'cancel', className: 'gwb-btn', onClick: onClose, disabled: phase === 'running' }, t('cancel'))],
      },
        phase === 'done'
          ? [
              h('p', { key: 'ok', className: 'gwb-success' }, t('createSuccess', { url: result.url })),
              h('pre', { key: 'cmds', className: 'gwb-pre' }, (result.followUp ?? []).join('\n')),
            ]
          : phase === 'exists'
            ? [
                h('p', { key: 'title', className: 'gwb-error' }, t('createExistsTitle')),
                h('p', { key: 'body' }, t('createExistsBody', { owner: existsInfo.owner, name: existsInfo.name })),
                h('div', { key: 'actions', className: 'gwb-modal-actions' },
                  h('button', {
                    className: 'gwb-btn',
                    onClick: () => {
                      const renamed = window.prompt(t('createRename'), name)
                      if (renamed !== null && renamed.trim() !== '') { setName(renamed.trim()); setPhase('form') }
                    },
                  }, t('createRename')),
                  h('button', { className: 'gwb-btn gwb-btn-primary', onClick: () => { void linkExisting() } }, t('createLinkExisting')),
                ),
              ]
            : h('div', { className: 'gwb-form' },
                workspaces.length > 0 && h('label', null, t('workspacePicker'),
                  h('select', {
                    value: workspaces.some(workspace => workspace.path === cwd) ? cwd : '',
                    disabled: phase === 'running',
                    onChange: event => changeDirectory(event.target.value),
                  }, h('option', { value: '' }, t('workspaceManual')),
                  workspaces.map(workspace => h('option', { key: workspace.workspaceId, value: workspace.path },
                    `${workspace.title || directoryName(workspace.path)} · ${workspace.path}`)))),
                h('label', null, t('createWorkspace'),
                  h('input', {
                    value: cwd, placeholder: 'C:\\path\\to\\workspace', spellCheck: false,
                    disabled: phase === 'running',
                    onChange: event => changeDirectory(event.target.value),
                  })),
                h('label', null, t('createName'),
                  h('input', { value: name, spellCheck: false, onChange: event => { nameEdited.current = true; setName(event.target.value) } }),
                  h('span', null, t('createNameHint'))),
                h('label', null, t('createDescription'),
                  h('input', { value: description, onChange: event => setDescription(event.target.value) })),
                h('span', null, t('createVisibility')),
                h('div', { className: 'gwb-radio-row', role: 'radiogroup', 'aria-label': t('createVisibility') },
                  h('label', null, h('input', { type: 'radio', name: 'gwb-visibility', checked: visibility === 'private', onChange: () => setVisibility('private') }), t('createPrivate')),
                  h('label', null, h('input', { type: 'radio', name: 'gwb-visibility', checked: visibility === 'public', onChange: () => setVisibility('public') }), t('createPublic')),
                ),
                error !== null ? h('p', { className: 'gwb-error' }, t('createFailed', { message: error })) : null,
                h('div', { className: 'gwb-modal-actions' },
                  h('button', {
                    className: 'gwb-btn gwb-btn-primary', disabled: phase === 'running' || cwd.trim() === '' || name.trim() === '',
                    onClick: () => { void submit() },
                  }, phase === 'running' ? h(Spinner) : null, t('createSubmit')),
                ),
              ),
      )
    }

    // ----------------------------------------------------------------- page

    /**
     * Workbench page. Data and actions reach the page through the injected
     * face: `api` (typed calls into the mounted namespace), the session
     * navigation callback, and the pending multi-workspace candidate request.
     */
    function WorkbenchPage(props) {
      const { api, openWorkspaceSession, openOne, candidateSource, createRequestSource, mountFailure, locale, useWorkspaces } = props
      const workspaces = useWorkspaces(snapshot => snapshot.items)
      const workspacePhase = useWorkspaces(snapshot => snapshot.phase)
      const workspaceError = useWorkspaces(snapshot => snapshot.error)
      // Only a change in workspace identity or path requires another Git probe.
      const rosterKey = useWorkspaces(snapshot => JSON.stringify(snapshot.items.map(({ workspaceId, path }) => ({ workspaceId, path }))))
      const t = useMemo(() => makeT(locale), [locale])
      const [status, setStatus] = useState({ phase: 'loading' })
      const [repos, setRepos] = useState([])
      const [page, setPage] = useState(0)
      const [hasMore, setHasMore] = useState(true)
      const [listState, setListState] = useState({ phase: 'idle' })
      const [query, setQuery] = useState('')
      const [linkScan, setLinkScan] = useState(null)
      const [linkRevision, setLinkRevision] = useState(0)
      const [navigationError, setNavigationError] = useState(null)
      const [declined, setDeclined] = useState(null)
      const [confirmSwitch, setConfirmSwitch] = useState(null)
      const [createTarget, setCreateTarget] = useState(null)
      const [removeTarget, setRemoveTarget] = useState(null)
      const [templateTarget, setTemplateTarget] = useState(null)
      const [visibilityTarget, setVisibilityTarget] = useState(null)
      const [toast, setToast] = useState(null)
      const [switchConfirmedOnce, setSwitchConfirmedOnce] = useState(false)
      const [candidateRequest, setCandidateRequest] = useState(null)
      const startedRef = useRef(false)

      const activeAccount = status.phase === 'ready' ? status.data.activeAccount : null
      const accountKey = activeAccount ?? ''

      // The candidate request is a plain snapshot store; mirror it into state
      // so a request raised from a card click re-renders this page.
      useEffect(() => candidateSource.subscribe(() => {
        setCandidateRequest(candidateSource.getSnapshot())
      }), [candidateSource])

      // The gate overlay's "create" choice lands here: prefill and open the
      // create-repository modal for the gated directory.
      const [gateCreate, setGateCreate] = useState(null)
      useEffect(() => {
        if (createRequestSource === undefined) return
        const consume = () => {
          const next = createRequestSource.getSnapshot()
          if (next !== null) { setGateCreate(next); createRequestSource.dismiss() }
        }
        consume()
        return createRequestSource.subscribe(consume)
      }, [createRequestSource])
      useEffect(() => {
        if (gateCreate !== null) setCreateTarget(gateCreate)
      }, [gateCreate])

      const loadDeclined = useCallback(async () => {
        try {
          const result = await api.declinedList(accountKey)
          setDeclined({ phase: 'ready', rows: result.rows, storePath: result.storePath })
        } catch (error) {
          setDeclined({ phase: 'error', message: error?.message ?? String(error) })
        }
      }, [api, accountKey])

      // Gate detection runs on mount and after every recheck press.
      useEffect(() => {
        let cancelled = false
        setStatus({ phase: 'loading' })
        api.status().then(data => {
          if (cancelled) return
          setStatus({ phase: 'ready', data })
          if (data.signedIn) startedRef.current = true
        }).catch(error => {
          if (!cancelled) setStatus({ phase: 'error', message: error?.message ?? String(error) })
        })
        return () => { cancelled = true }
      }, [api])

      const fetchPage = useCallback(async (nextPage, replace) => {
        setListState({ phase: 'loading' })
        try {
          const result = await api.repositories(nextPage, 100)
          setRepos(previous => replace ? result.repositories : [...previous, ...result.repositories])
          setPage(nextPage)
          setHasMore(result.repositories.length >= 100)
          setListState({ phase: 'ready' })
        } catch (error) {
          setListState({ phase: 'error', message: error?.message ?? String(error) })
        }
      }, [api])

      // Opening the page auto-fetches the first page once the gate passes.
      useEffect(() => {
        if (status.phase !== 'ready' || !status.data.signedIn) return
        if (startedRef.current === false) return
        if (repos.length > 0 || listState.phase === 'loading' || listState.phase === 'ready') return
        void fetchPage(1, true)
      }, [status, repos.length, listState.phase, fetchPage])

      const signedIn = status.phase === 'ready' && status.data.signedIn
      const refreshLinks = useCallback(() => { setLinkRevision(revision => revision + 1) }, [])
      useEffect(() => {
        if (!signedIn || workspacePhase !== 'ready' || workspaceError != null) return
        let current = true
        const roster = JSON.parse(rosterKey)
        const scan = roster.length ? api.localOrigins(roster) : Promise.resolve({ origins: [] })
        scan.then(result => {
          if (!current) return
          const matches = new Map()
          for (const { origin, workspaceId } of result.origins) {
            if (typeof origin !== 'string') continue
            const key = origin.toLowerCase()
            const ids = matches.get(key) ?? []
            ids.push(workspaceId)
            matches.set(key, ids)
          }
          setLinkScan({ rosterKey, revision: linkRevision, matches })
        }).catch(error => {
          if (current) setLinkScan({ rosterKey, revision: linkRevision, error: error?.message ?? String(error) })
        })
        return () => { current = false }
      }, [api, signedIn, workspacePhase, workspaceError, rosterKey, linkRevision])

      useEffect(() => {
        if (signedIn) void loadDeclined()
      }, [signedIn, loadDeclined])

      const refresh = useCallback(() => {
        setRepos([])
        setHasMore(true)
        setListState({ phase: 'idle' })
        void fetchPage(1, true)
        void refreshLinks()
        void loadDeclined()
      }, [fetchPage, refreshLinks, loadDeclined])

      const switchAccount = useCallback(async login => {
        try {
          await api.switchAccount(login)
          setRepos([])
          setHasMore(true)
          setListState({ phase: 'idle' })
          const data = await api.status()
          setStatus({ phase: 'ready', data })
          startedRef.current = true
          setToast(t('refreshDone'))
        } catch (error) {
          setToast(t('createFailed', { message: error?.message ?? String(error) }))
        }
      }, [api, t])

      const requestSwitch = useCallback(login => {
        if (switchConfirmedOnce) { void switchAccount(login); return }
        setConfirmSwitch(login)
      }, [switchConfirmedOnce, switchAccount])

      const recheck = useCallback(() => {
        setStatus({ phase: 'loading' })
        api.status().then(data => {
          setStatus({ phase: 'ready', data })
          if (data.signedIn) startedRef.current = true
        }).catch(error => setStatus({ phase: 'error', message: error?.message ?? String(error) }))
      }, [api])

      const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase()
        if (needle === '') return repos
        return repos.filter(repo => `${repo.fullName} ${repo.name} ${repo.owner} ${repo.visibility}`.toLowerCase().includes(needle))
      }, [repos, query])

      const currentScan = linkScan?.rosterKey === rosterKey && linkScan.revision === linkRevision ? linkScan : null
      const scanError = workspaceError?.message ?? currentScan?.error
      const linksReady = workspacePhase === 'ready' && scanError == null && currentScan?.matches !== undefined
      const openCandidate = async workspaceId => {
        setNavigationError(null)
        try {
          await openOne(workspaceId)
          candidateSource.dismiss()
          setCandidateRequest(null)
        } catch (error) {
          setNavigationError(error?.message ?? String(error))
        }
      }

      const removeDeclined = useCallback(async row => {
        try {
          await api.declinedRemove(accountKey, row.path)
          setRemoveTarget(null)
          setTemplateTarget(row)
          void loadDeclined()
        } catch (error) {
          setToast(t('remarkFailed', { message: error?.message ?? String(error) }))
        }
      }, [api, accountKey, loadDeclined, t])

      const saveRemark = useCallback(async (row, remark) => {
        try {
          await api.declinedSetRemark(accountKey, row.path, remark)
          setToast(t('declinedSaved'))
          void loadDeclined()
        } catch (error) {
          setToast(t('remarkFailed', { message: error?.message ?? String(error) }))
        }
      }, [api, accountKey, loadDeclined, t])

      // The confirm modal flips this to the requested value; a running change
      // disables the card so a double click cannot stack two gh calls.
      const applyVisibility = useCallback(async (repo, next) => {
        const previous = repo.private ? 'private' : 'public'
        if (previous === next) return
        setRepos(list => list.map(item => repoKey(item) === repoKey(repo) ? { ...item, private: next === 'private', visibility: next === 'private' ? 'PRIVATE' : 'PUBLIC' } : item))
        try {
          await api.setVisibility({ owner: repo.owner, name: repo.name, visibility: next })
          setToast(t('visibilityChanged', { owner: repo.owner, name: repo.name, visibility: t(next === 'private' ? 'visibilityPrivate' : 'visibilityPublic') }))
        } catch (error) {
          // Roll the optimistic update back and surface the reason.
          setRepos(list => list.map(item => repoKey(item) === repoKey(repo) ? { ...item, private: previous === 'private', visibility: previous === 'private' ? 'PRIVATE' : 'PUBLIC' } : item))
          setToast(t('createFailed', { message: error?.message ?? String(error) }))
        }
      }, [api, t])

      if (status.phase === 'loading') {
        return h('section', { className: 'gwb-page', 'data-github-workbench-page': true }, h(Styles), h('div', { className: 'gwb-gate' }, h(Spinner), h('p', null, t('loading'))))
      }
      if (status.phase === 'error') {
        return h('section', { className: 'gwb-page', 'data-github-workbench-page': true }, h(Styles), h('div', { className: 'gwb-gate' },
          h('h2', null, t('statusFailed')),
          h('p', { className: 'gwb-error' }, status.message + (typeof mountFailure === 'function' && mountFailure() ? ' — mount: ' + (mountFailure()?.message ?? String(mountFailure())) : '')),
          h('button', { className: 'gwb-btn gwb-btn-primary', onClick: recheck }, t('recheck')),
        ))
      }
      const gate = status.data
      if (!gate.ghAvailable || !gate.signedIn) {
        return h('section', { className: 'gwb-page', 'data-github-workbench-page': true }, h(Styles), h('div', { className: 'gwb-gate' },
          h('h2', null, gate.ghAvailable ? t('ghAuthTitle') : t('ghMissingTitle')),
          h('p', null, gate.ghAvailable ? t('ghAuthBody') : t('ghMissingBody')),
          gate.diagnostic !== null && gate.diagnostic !== ''
            ? h('p', null, `${t('diagnostic')}: `, h('code', null, gate.diagnostic))
            : null,
          h('button', { className: 'gwb-btn gwb-btn-primary', onClick: recheck }, t('recheck')),
        ))
      }

      const singleAccount = gate.accounts.length <= 1

      return h('section', { className: 'gwb-page', 'data-github-workbench-page': true },
        h(Styles),
        h('header', { className: 'gwb-head' },
          h('h1', { className: 'gwb-title' }, t('panel')),
          h('div', { className: 'gwb-toolbar' },
            h('span', { className: 'gwb-account' },
              h('span', null, t('accountLabel')),
              singleAccount
                ? h('span', { className: 'gwb-account-static', title: t('accountSingleHint') }, gate.accounts[0]?.login ?? '')
                : h('select', {
                    value: gate.activeAccount ?? '',
                    onChange: event => { const login = event.target.value; if (login !== '' && login !== gate.activeAccount) requestSwitch(login) },
                  }, gate.accounts.map(account => h('option', { key: account.login, value: account.login }, account.login))),
            ),
            h('button', { className: 'gwb-btn', onClick: refresh, 'aria-busy': listState.phase === 'loading' }, t('refresh')),
            h('button', { className: 'gwb-btn gwb-btn-primary', onClick: () => setCreateTarget({ cwd: null, name: '' }) }, t('createForWorkspace')),
          ),
        ),
        h('input', {
          className: 'gwb-search', type: 'search', value: query,
          placeholder: t('searchPlaceholder'),
          onChange: event => setQuery(event.target.value),
          'aria-label': t('searchPlaceholder'),
        }),

        h('p', { className: 'gwb-note', role: 'status' }, t('workspaceScope'), ' ',
          scanError != null ? h('span', { className: 'gwb-error' }, t('workspaceScanFailed', { message: scanError }))
            : !linksReady ? t('workspaceScanning')
              : workspaces.length === 0 ? t('workspaceEmpty') : null),
        navigationError !== null && h('p', { className: 'gwb-error', role: 'alert' },
          t('workspaceOpenFailed', { message: navigationError })),
        listState.phase === 'error'
          ? h('p', { className: 'gwb-error' }, t('createFailed', { message: listState.message }))
          : null,
        filtered.length === 0 && listState.phase !== 'loading'
          ? h('p', { className: 'gwb-empty' }, t('noMatch'))
          : h('div', { className: 'gwb-cards' },
              filtered.map(repo => {
                const workspaceIds = linksReady ? currentScan.matches.get(repoKey(repo)) ?? [] : []
                return h('button', {
                  key: repoKey(repo), className: 'gwb-card', disabled: !linksReady,
                  onClick: () => {
                    setNavigationError(null)
                    void openWorkspaceSession(workspaceIds, repo).catch(error => {
                      setNavigationError(error?.message ?? String(error))
                    })
                  },
                },
                  h('div', { className: 'gwb-card-main' },
                    h('div', { className: 'gwb-card-name' }, repo.fullName),
                    h('div', { className: 'gwb-card-meta' },
                      h('span', { className: 'gwb-badge' }, t(categoryKey(repoCategory(repo)))),
                      h('button', {
                        className: 'gwb-badge gwb-visibility-btn' + (repo.private ? '' : ' gwb-visibility-public'),
                        title: t('visibilityAction'),
                        disabled: !(repo.permissions?.admin ?? false),
                        onClick: event => { event.stopPropagation(); setVisibilityTarget(repo) },
                      }, '\u270E ', t(repo.private ? 'visibilityPrivate' : 'visibilityPublic')),
                      repo.updatedAt !== null ? h('span', null, t('updated', { time: formatDate(repo.updatedAt) })) : null,
                    ),
                  ),
                  h('span', { className: `gwb-badge${workspaceIds.length > 0 ? ' gwb-badge-linked' : ''}` },
                    !linksReady ? t('workspaceLinkUnknown')
                      : workspaceIds.length === 0 ? t('openOnGithub')
                        : workspaceIds.length === 1 ? t('linkedOne') : t('linkedMany', { n: workspaceIds.length }),
                  ),
                )
              }),
            ),
        listState.phase === 'loading' ? h('p', { className: 'gwb-note' }, h(Spinner), ' ', t('loading')) : null,
        hasMore && repos.length > 0
          ? h('div', { style: { display: 'flex', justifyContent: 'center', margin: '10px 0 16px' } },
              h('button', { className: 'gwb-btn', disabled: listState.phase === 'loading', onClick: () => { void fetchPage(page + 1, false) } }, t('loadMore')))
          : (repos.length > 0 ? h('p', { className: 'gwb-empty', style: { textAlign: 'center' } }, t('loadMoreDone')) : null),

        h('h2', { className: 'gwb-section' }, t('declinedTitle')),
        h('p', { className: 'gwb-note' }, t('declinedAccount', { account: accountKey === '' ? '—' : accountKey })),
        declined === null
          ? h('p', { className: 'gwb-note' }, t('loading'))
          : declined.phase === 'error'
            ? h('p', { className: 'gwb-error' }, declined.message)
            : declined.rows.length === 0
              ? h('p', { className: 'gwb-empty' }, t('declinedEmpty'))
              : h('table', { className: 'gwb-table' },
                  h('thead', null, h('tr', null,
                    h('th', null, t('declinedPath')),
                    h('th', null, t('declinedTime')),
                    h('th', null, t('declinedRemark')),
                    h('th', { 'aria-label': t('declinedTitle') }),
                  )),
                  h('tbody', null, declined.rows.map(row => h('tr', { key: row.path },
                    h('td', { className: 'gwb-path' }, row.path),
                    h('td', { style: { whiteSpace: 'nowrap' } }, formatDate(row.declinedAt)),
                    h('td', null, h(RemarkCell, { row, onSave: saveRemark, t })),
                    h('td', null, h('div', { className: 'gwb-row-actions' },
                      h('button', { className: 'gwb-btn', onClick: () => setCreateTarget({ cwd: row.path, name: directoryName(row.path) }) }, t('declinedCreateNow')),
                      h('button', { className: 'gwb-btn gwb-btn-danger', onClick: () => setRemoveTarget(row) }, t('declinedRemove')),
                    )),
                  ))),
                ),
        h('p', { className: 'gwb-note' }, `${t('storePathLabel')}: ${declined?.storePath ?? '~/.dsh/github-workbench.json'}`),

        confirmSwitch !== null && h(Modal, {
          title: t('switchConfirmTitle'), onClose: () => setConfirmSwitch(null),
          footer: [
            h('button', { key: 'cancel', className: 'gwb-btn', onClick: () => setConfirmSwitch(null) }, t('cancel')),
            h('button', {
              key: 'ok', className: 'gwb-btn gwb-btn-primary',
              onClick: () => { setConfirmSwitch(null); setSwitchConfirmedOnce(true); void switchAccount(confirmSwitch) },
            }, t('switchConfirm')),
          ],
        }, h('p', null, t('switchConfirmBody'))),

        candidateRequest !== null && h(Modal, {
          title: t('candidateTitle'), onClose: () => { candidateSource.dismiss(); setCandidateRequest(null) },
          footer: [h('button', { key: 'close', className: 'gwb-btn', onClick: () => { candidateSource.dismiss(); setCandidateRequest(null) } }, t('close'))],
        },
          h('p', null, t('candidateByRecent')),
          navigationError !== null && h('p', { className: 'gwb-error', role: 'alert' },
            t('workspaceOpenFailed', { message: navigationError })),
          candidateRequest.workspaces.map(workspace => h('div', { key: workspace.workspaceId, className: 'gwb-candidate-row' },
            h('div', { style: { minWidth: 0 } },
              h('div', null, workspace.title ?? workspace.workspaceId),
              h('div', { className: 'gwb-candidate-path' }, workspace.path),
            ),
            h('button', {
              className: 'gwb-btn', style: { marginLeft: 'auto' },
              onClick: () => { void openCandidate(workspace.workspaceId) },
            }, t('openWorkspace')),
          )),
        ),

        createTarget !== null && h(CreateRepoModal, {
          t, api, target: createTarget, workspaces,
          onCreated: refreshLinks,
          onClose: () => setCreateTarget(null),
        }),

        removeTarget !== null && h(Modal, {
          title: t('removeConfirmTitle'), onClose: () => setRemoveTarget(null),
          footer: [
            h('button', { key: 'cancel', className: 'gwb-btn', onClick: () => setRemoveTarget(null) }, t('cancel')),
            h('button', { key: 'ok', className: 'gwb-btn gwb-btn-danger', onClick: () => { void removeDeclined(removeTarget) } }, t('removeConfirm')),
          ],
        }, h('p', null, t('removeConfirmBody', { path: removeTarget.path }))),

        templateTarget !== null && h(Modal, {
          title: t('templateTitle'), onClose: () => setTemplateTarget(null),
          footer: [
            h('button', {
              key: 'copy', className: 'gwb-btn gwb-btn-primary',
              onClick: async () => {
                try { await navigator.clipboard.writeText(PROMPT_TEMPLATE_ZH); setToast(t('templateCopied')) } catch { /* clipboard refused */ }
              },
            }, t('copy')),
            h('button', { key: 'close', className: 'gwb-btn', onClick: () => setTemplateTarget(null) }, t('close')),
          ],
        }, h('pre', { className: 'gwb-pre' }, PROMPT_TEMPLATE_ZH)),

        visibilityTarget !== null && h(Modal, {
          title: t('visibilityChangeTitle'), onClose: () => setVisibilityTarget(null),
          footer: [
            h('button', { key: 'cancel', className: 'gwb-btn', onClick: () => setVisibilityTarget(null) }, t('cancel')),
            h('button', {
              key: 'ok', className: 'gwb-btn gwb-btn-primary',
              onClick: () => { const repo = visibilityTarget; const next = repo.private ? 'public' : 'private'; setVisibilityTarget(null); void applyVisibility(repo, next) },
            }, t('visibilityChangeConfirm')),
          ],
        },
          h('p', null, t(visibilityTarget.private ? 'visibilityChangeToPrivate' : 'visibilityChangeToPublic', { owner: visibilityTarget.owner, name: visibilityTarget.name })),
          h('p', null, t(visibilityTarget.private ? 'visibilityChangePublicBody' : 'visibilityChangePrivateBody')),
        ),

        toast !== null && h(Toast, { text: toast, onDone: () => setToast(null) }),
      )
    }

    // ------------------------------------------------- Remote contribution

    // One mountable contribution over this plugin's Host methods. Parameter
    // codecs are strict with the page's own parser factories (the module seed
    // supplies zod); results stay `src-json`, so the Gateway resolves each
    // method against the live Service conservatively at call time.
    const z = require('zod')

    const strictJson = schema => ({ mode: 'strict', typeSymbol: `${PKG}#json`, create: () => schema })
    const stringJson = strictJson(z.string())
    const numberJson = strictJson(z.number())
    const requestJson = strictJson(z.record(z.string(), z.unknown()))
    const workspacesJson = strictJson(z.array(z.record(z.string(), z.unknown())))

    function method(service, description, parameters) {
      return {
        service,
        description,
        invocation: { kind: 'direct' },
        parameters,
        result: { mode: 'src-json' },
      }
    }

    const TYPERT_REMOTE = {
      package: PKG,
      get descriptors() {
        const descriptors = []
        for (const [endpoint, definition] of Object.entries(this.methods)) {
          const separator = endpoint.indexOf('/')
          const namespace = endpoint.slice(0, separator)
          const name = endpoint.slice(separator + 1)
          descriptors.push({
            ...definition,
            id: `${PKG}#${endpoint}`,
            namespace,
            method: name,
            parameters: definition.parameters.map(parameter => ({ ...parameter, wire: parameter.wire ?? parameter.name })),
          })
        }
        return descriptors
      },
      methods: {
        'githubWorkbench/status': method('githubWorkbench',
          'Detect gh availability and enumerate signed-in GitHub accounts.', []),
        'githubWorkbench/switchAccount': method('githubWorkbench',
          'Switch the active gh account after the user confirmed.',
          [{ name: 'account', description: 'The GitHub login to make active.', source: 'json', codec: stringJson }]),
        'githubWorkbench/repositories': method('githubWorkbench',
          'Read one page of the active account repositories.',
          [
            { name: 'page', description: 'One-based page index.', source: 'json', codec: numberJson },
            { name: 'perPage', description: 'Page size; the page asks for 100.', source: 'json', codec: numberJson },
          ]),
        'githubWorkbench/createRepository': method('githubWorkbench',
          'Create the repository for a local workspace directory.',
          [{ name: 'request', description: 'cwd, name, description, visibility, and link flag.', source: 'json', codec: requestJson }]),
        'githubWorkbench/linkExisting': method('githubWorkbench',
          'Point a workspace origin at an existing repository.',
          [{ name: 'request', description: 'cwd, owner, and name.', source: 'json', codec: requestJson }]),
        'githubWorkbench/setVisibility': method('githubWorkbench',
          'Change a repository visibility after the user confirmed.',
          [{ name: 'request', description: 'owner, name, and visibility.', source: 'json', codec: requestJson }]),
        'githubWorkbench/localOrigins': method('githubWorkbench',
          'Read each workspace remote origin and classify it against github.com.',
          [{ name: 'workspaces', description: 'Workspace roster of workspaceId and path.', source: 'json', codec: workspacesJson }]),
        'githubWorkbench/declinedList': method('githubWorkbench',
          "Read one account's declined workspaces.",
          [{ name: 'account', description: 'The account key; empty selects the unattributed bucket.', source: 'json', codec: stringJson }]),
        'githubWorkbench/declinedSetRemark': method('githubWorkbench',
          "Update one declined workspace's remark.",
          [
            { name: 'account', description: 'The account key.', source: 'json', codec: stringJson },
            { name: 'path', description: 'The recorded workspace path.', source: 'json', codec: stringJson },
            { name: 'remark', description: 'The new remark text.', source: 'json', codec: stringJson },
          ]),
        'githubWorkbench/sessionGate': method('githubWorkbench',
          'Gate facts for one working directory: github origin and declined coverage.',
          [{ name: 'request', description: 'cwd and an optional account hint.', source: 'json', codec: requestJson }]),
        'githubWorkbench/declinedAdd': method('githubWorkbench',
          'Record one declined workspace after the user declined from the gate overlay.',
          [
            { name: 'account', description: 'The account key.', source: 'json', codec: stringJson },
            { name: 'cwd', description: 'The declined workspace directory.', source: 'json', codec: stringJson },
          ]),
        'githubWorkbench/declinedRemove': method('githubWorkbench',
          'Remove one declined record after the user confirmed.',
          [
            { name: 'account', description: 'The account key.', source: 'json', codec: stringJson },
            { name: 'path', description: 'The recorded workspace path.', source: 'json', codec: stringJson },
          ]),
      },
    }
    // ------------------------------------------------------------ mounting

    function apply(ctx) {
      // Mount the Host Remote contribution on this plugin's fiber; the
      // namespace unloads with it, so teardown removes only this plugin's
      // entry points. The mount settles in the background: this apply stays
      // synchronous so the page and its sidebar entry always register, and
      // every API call awaits the mount before its first request.
      let remoteMounted = false
      let remoteDispose
      let remoteFailure
      let settleRemoteReady
      const remoteReady = new Promise((resolve, reject) => {
        settleRemoteReady = { resolve, reject }
      })
      ctx.effect(() => {
        Promise.resolve()
          .then(() => ctx.remote.$mount(TYPERT_REMOTE))
          .then(dispose => {
            remoteMounted = true
            remoteDispose = dispose
            // Resolve with the namespace service face read through the
            // registered service key, not the context accessor.
            const namespace = ctx.get('remote.githubWorkbench')
            settleRemoteReady.resolve(namespace)
          }, error => {
            // A mount rejected with "already registered" means a previous
            // generation of this page still owns the namespace: keep polling
            // until that namespace service is reachable, then proceed.
            if (String(error?.message ?? error).includes('already registered')) {
              remoteMounted = true
              // A previous generation still owns the namespace. Poll for its
              // face briefly; if the stale owner dies (page reload after a
              // plugin update), re-attempt the mount instead of failing the
              // whole plugin with a dead namespace.
              let attempt = 0
              const waitForService = () => {
                try {
                  const namespace = ctx.get('remote.githubWorkbench')
                  if (namespace !== undefined) {
                    settleRemoteReady.resolve(namespace)
                    return
                  }
                } catch { /* the accessor throws while the service is absent */ }
                attempt += 1
                if (attempt > 25) {
                  Promise.resolve()
                    .then(() => ctx.remote.$mount(TYPERT_REMOTE))
                    .then(dispose => {
                      remoteMounted = true
                      remoteDispose = dispose
                      settleRemoteReady.resolve(ctx.get('remote.githubWorkbench'))
                    }, retryError => {
                      remoteFailure = retryError
                      settleRemoteReady.reject(retryError)
                    })
                  return
                }
                setTimeout(waitForService, 400)
              }
              waitForService()
              return
            }
            // Any other mount failure: retry with backoff instead of leaving
            // the plugin with a permanently dead namespace.
            let retries = 0
            const retryMount = () => {
              retries += 1
              if (retries > 10) {
                remoteFailure = error
                settleRemoteReady.reject(error)
                return
              }
              setTimeout(() => {
                Promise.resolve()
                  .then(() => ctx.remote.$mount(TYPERT_REMOTE))
                  .then(dispose => {
                    remoteMounted = true
                    remoteDispose = dispose
                    settleRemoteReady.resolve(ctx.get('remote.githubWorkbench'))
                  }, retryError => {
                    if (String(retryError?.message ?? retryError).includes('already registered')) {
                      retryMount()
                      return
                    }
                    remoteFailure = retryError
                    settleRemoteReady.reject(retryError)
                  })
              }, Math.min(500 * retries, 4000))
            }
            retryMount()
          })
      }, 'github-workbench: remote mount')
      remoteReady.catch(() => { /* failures surface through API calls */ })


      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'github-workbench: dictionaries')
      const t = ctx.locale.bind(NS)

      // Every namespace call answers a RemoteResult envelope; unwrap it and
      // rethrow failures with their code and details attached so the page can
      // route on `github-workbench/repository-exists`.
      const call = async (method, ...rest) => {
        // The mount path resolves remoteReady with the namespace service face,
        // so calls never depend on the context accessor at call time.
        let namespace = await remoteReady
        const invoke = (face, m, ...args) => face[m](...args)
        try {
          return await unwrap(await invoke(namespace, method, ...rest))
        } catch (error) {
          // A face adopted from a stale registration routes nowhere (404):
          // re-mount under this fiber once, then retry the call.
          if (!/404|not found/i.test(String(error?.message ?? error))) throw error
          const remounted = await ctx.remote.$mount(TYPERT_REMOTE)
          remoteDispose = remounted
          namespace = ctx.get('remote.githubWorkbench')
          if (namespace === undefined) throw error
          return await unwrap(await invoke(namespace, method, ...rest))
        }
      }
      const unwrap = async promise => {
        const result = await promise
        if (!result.ok) {
          const failure = result.error
          const error = new Error(failure?.message ?? 'the call failed')
          error.code = failure?.code
          error.details = failure?.details
          throw error
        }
        return result.value
      }
      /** The mount failure, if the namespace never became reachable. */
      const mountFailure = () => remoteFailure
      const api = {
        status: () => call('status'),
        switchAccount: login => call('switchAccount', login),
        repositories: (page, perPage) => call('repositories', page, perPage),
        createRepository: request => call('createRepository', request),
        linkExisting: request => call('linkExisting', request),
        setVisibility: request => call('setVisibility', request),
        localOrigins: workspaces => call('localOrigins', workspaces),
        declinedList: account => call('declinedList', account),
        declinedSetRemark: (account, path, remark) => call('declinedSetRemark', account, path, remark),
        declinedRemove: (account, path) => call('declinedRemove', account, path),
        sessionGate: request => call('sessionGate', request),
        declinedAdd: (account, cwd) => call('declinedAdd', account, cwd),
      }

      const openOne = async workspaceId => {
        const uiWorkspace = ctx.get('uiWorkspace')
        if (uiWorkspace === undefined) throw new Error('workspace navigation is unavailable')
        await uiWorkspace.openWorkspace(workspaceId)
      }

      const candidateStore = createCandidateStore()
      const gateStore = createGateStore()
      const createRequestStore = createGateStore()
      // A dismissed path stays quiet for this browser session even if the gate
      // re-evaluates the same directory.
      const gateDismissed = new Set()
      let gateBusy = false
      // Gate trigger: evaluate once per session, at the moment the user
      // first acts in it (the session row's updatedAt moves past its initial
      // value, i.e. the first message has been sent). Not linked and not
      // declined -> raise the request overlay; anything else stays silent.
      let gateShownSessionId
      let gateShownDismissed = false
      const evaluateGate = async currentSession => {
        const snapshot = ctx.get('workspaces')?.list?.getSnapshot()
        if (snapshot === undefined) return
        const workspace = snapshot.items.find(item => item.sessionIds.includes(currentSession.id))
        const path = workspace?.path ?? (typeof currentSession.cwd === 'string' && currentSession.cwd !== '' ? currentSession.cwd : undefined)
        if (path === undefined || gateDismissed.has(path)) return
        const account = ctx.get('sessions')?.account ?? ''
        if (gateBusy) return
        gateBusy = true
        try {
          const result = await api.sessionGate({ cwd: path, account })
          if (result.linked === true || result.declined === true || gateDismissed.has(path)) return
          gateShownSessionId = currentSession.id
          gateShownDismissed = false
          gateStore.set({ path, account: result.account ?? account, busy: false, sessionId: currentSession.id })
        } catch {
          // Gate is best-effort: a failed probe never blocks the conversation.
        } finally {
          gateBusy = false
        }
      }
      const gateActions = {
        close: gate => { gateDismissed.add(gate.path); gateStore.set(null) },
        create: gate => {
          // Not treated as handled: until a repository actually exists and is
          // linked, the next conversation in this directory asks again.
          gateStore.set(null)
          const roster = ctx.get('workspaces')?.list?.getSnapshot()?.items ?? []
          const workspace = roster.find(item => item.path === gate.path)
          const description = typeof workspace?.title === 'string' && workspace.title.trim() !== ''
            ? workspace.title.trim()
            : undefined
          createRequestStore.set({ cwd: gate.path, name: gate.path.replace(/[\\/]+$/, '').split(/[\\/]/).pop() ?? '', description })
          try { ctx.layout.selectPanel('github-repo-workbench') } catch { /* panel selection is best-effort */ }
        },
        decline: async gate => {
          gateStore.set({ ...gate, busy: true })
          try {
            await api.declinedAdd(gate.account ?? '', gate.path)
            gateDismissed.add(gate.path)
            gateStore.set(null)
          } catch (error) {
            gateStore.set({ ...gate, busy: false, error: makeT(ctx.locale.getSnapshot().active === 'zh' ? 'zh' : 'en')('gateDeclineFailed', { message: error?.message ?? String(error) }) })
          }
        },
      }
      // The list subscription is the activity sensor: the current main-view
      // session's first message moves its updatedAt; from then on the gate is
      // evaluated exactly once for that session. Switching conversations
      // silently drops a visible prompt (no blacklist write, not dismissed).
      ctx.effect(() => {
        // Baseline per current session; the first message moves updatedAt.
        let currentId
        let baselineUpdatedAt = Number.NEGATIVE_INFINITY
        let baselineRunning = false
        let evaluated = false
        const unsubscribe = ctx.get('sessions')?.list?.subscribe(() => {
          const sessions = ctx.get('sessions')?.list?.getSnapshot()
          if (sessions === undefined) return
          const currentSession = Object.values(sessions.byId).find(row => (row.retainedBy?.mainView ?? 0) > 0)
          if (currentSession === undefined) { currentId = undefined; return }
          if (currentId !== currentSession.id) {
            // Conversation switch: drop a visible prompt silently (no blacklist
            // write, not dismissed) and re-baseline for the new session.
            if (gateShownSessionId !== undefined && gateShownSessionId !== currentSession.id) {
              gateShownSessionId = undefined
              gateShownDismissed = false
              gateStore.set(null)
            }
            currentId = currentSession.id
            baselineUpdatedAt = currentSession.updatedAt
            baselineRunning = currentSession.running === true
            evaluated = false
          }
          if (evaluated) return
          const firstMessage = currentSession.updatedAt > baselineUpdatedAt
            || (currentSession.running === true && !baselineRunning)
          if (!firstMessage) return
          evaluated = true
          void evaluateGate(currentSession)
        })
        return () => { unsubscribe?.() }
      }, 'github-workbench: gate evaluation')
      ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay', id: 'github-workbench.gate', locale: NS,
        inject: () => ({ gateSource: gateStore.source, actions: gateActions, locale: ctx.locale.getSnapshot().active === 'zh' ? 'zh' : 'en' }),
      }, GateOverlay)), 'github-workbench: gate overlay')

      const openWorkspaceSession = async (workspaceIds, repo) => {
        const workspaces = ctx.get('workspaces')
        const byId = new Map((workspaces?.list?.getSnapshot()?.items ?? []).map(item => [item.workspaceId, item]))
        const resolved = workspaceIds.map(id => byId.get(id)).filter(Boolean)
        if (workspaceIds.length === 0) {
          window.open(repo.url, '_blank', 'noopener')
          return
        }
        if (resolved.length === 0) throw new Error(t('workspaceRemoved'))
        if (resolved.length === 1) {
          await openOne(resolved[0].workspaceId)
          return
        }
        // Multiple candidates: the page renders the modal list, ordered by
        // the most recent session use of each workspace.
        const sessions = ctx.get('sessions')?.list?.getSnapshot() ?? { byId: {} }
        const latestUse = workspace => {
          let latest = Number.NEGATIVE_INFINITY
          for (const id of workspace.sessionIds ?? []) {
            const summary = sessions.byId[id]
            if (summary !== undefined) latest = Math.max(latest, summary.updatedAt)
          }
          return latest
        }
        candidateStore.request({ repo, workspaces: [...resolved].sort((a, b) => latestUse(b) - latestUse(a)) })
      }

      const injected = () => ({
        api,
        mountFailure,
        openWorkspaceSession,
        openOne,
        candidateSource: candidateStore.source,
        createRequestSource: createRequestStore.source,
        locale: ctx.locale.getSnapshot().active === 'zh' ? 'zh' : 'en',
      })

      ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main', key: PANEL_ID, locale: NS, inject: injected,
      }, WorkbenchPage)), 'github-workbench: main panel')

      ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist', id: PANEL_ID, order: 5, label: () => t('panel'), locale: NS,
      }, PanelIcon)), 'github-workbench: sidebar entry')
    }

    // NOTE: do not add 'remote.githubWorkbench' to this inject list — the
    // namespace service is provided by this very plugin's background mount,
    // so injecting it would deadlock the fiber before apply ever runs. The
    // namespace face is resolved through ctx.get() inside the mount flow.
    return { inject: ['remote', 'slots', 'locale', 'layout', 'workspaces', 'sessions'], apply }
  },
})
