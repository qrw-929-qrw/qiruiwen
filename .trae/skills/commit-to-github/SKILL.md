---
name: commit-to-github
description: 将当前项目提交 commit 并推送到 GitHub，优先使用已配置的 SSH 公钥。用户说提交到 GitHub、commit 并 push、推送代码时使用。不要用于纯本地提交。
---

# 提交到 GitHub

按顺序执行，任一步失败先修复再继续，不要跳到后续步骤。

## 1. 前置检查

```bash
git rev-parse --is-inside-work-tree 2>/dev/null || echo "NOT_A_REPO"
git remote -v
git branch --show-current
git config user.name; git config user.email
```

- 不是仓库：先确认目标目录，再 `git init -b main`。
- 没有 `user.name` / `user.email`：先向用户索取，不要猜。
- 有 `origin` 时记下它是 SSH 还是 HTTPS 形式。

## 2. 校验 SSH 认证

```bash
ssh -T -o StrictHostKeyChecking=accept-new -o ConnectTimeout=10 git@github.com
```

输出 `Hi <用户名>! You've successfully authenticated` 即通过。
失败时依次尝试：

- `ssh-add -l` 查看密钥是否被 agent 加载，必要时 `ssh-add ~/.ssh/id_ed25519`
- `cat ~/.ssh/id_ed25519.pub` 把公钥交回用户，让其添加到 GitHub → Settings → SSH and GPG keys
- 仍失败就停止并报告，不要回退成 HTTPS + token 硬编码

## 3. 确认远程地址

远程必须是 SSH 形式 `git@github.com:<owner>/<repo>.git`。若为 HTTPS 则改写：

```bash
git remote set-url origin git@github.com:<owner>/<repo>.git
```

`https://github.com/settings/tokens/new` 是创建 token 的页面，**不是仓库地址**，不要把它当 remote。

仓库不存在时让用户提供 `owner/repo`，或确认是否有 `gh` 可用于建库：

```bash
command -v gh && gh auth status
```

## 4. 暂存与提交

```bash
git status --short
git diff --stat
```

- 按文件名显式 `git add`，避免 `git add -A` 带入 `.env`、凭证、大二进制。
- 提交前扫描敏感文件：`git status --short` 中出现 `.env`、`*.pem`、`id_rsa`、`credentials*` 时先停下告知用户。
- 提交信息用 heredoc：

```bash
git commit -m "$(cat <<'EOF'
<一句话说明改了什么、为什么>
EOF
)"
```

- 没有改动就不提交，直接报告。

## 5. 推送

```bash
git push -u origin $(git branch --show-current)
```

## 6. 常见失败处理

| 报错 | 处理 |
|---|---|
| `Permission denied (publickey)` | 回到第 2 步，不要改用 token |
| `Updates were rejected` / `non-fast-forward` | `git pull --rebase origin <branch>` 后再 push |
| `no upstream branch` | 加 `-u origin <branch>` |
| `src refspec does not match any` | 当前分支还没有 commit，先提交或核对分支名 |
| `GH001: Large files` | 告知用户，改用 Git LFS 或从历史中移除 |

## 约束

- 不执行 `git push --force`、`git reset --hard`、`--no-verify`，除非用户明确要求。
- 不在命令里内联暴露 token；优先 SSH。
- 推送后回报仓库地址与本次 commit 的短 hash。
