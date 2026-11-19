---
name: ponytail-debt
description: >
  List every `shortcut:` comment (and older `ponytail:` ones) as a debt ledger. One-shot report,
  changes nothing. Use for "ponytail debt", "what did ponytail defer", "list the
  shortcuts", /ponytail-debt.
---

Every deliberate ponytail shortcut is marked with a `shortcut:` comment naming
its ceiling and upgrade path (older code may say `ponytail:`). This collects them into one ledger so a deferral
can't quietly become permanent.

## Scan

Grep the repo for comment markers, skipping `.git` and everything the
`.gitignore` files ignore (dependencies, build output, caches, in any stack):

`git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?(shortcut|ponytail):'`  (add other comment prefixes if your stack uses them)

If the user names their own marker word (`/ponytail-debt TODO`), grep for that word instead.

Each hit is one ledger row. The comment prefix keeps prose that merely mentions
the convention out of the ledger. Skip hits that are not a deferral, like a note
about a keyboard shortcut.

## 输出

每个标记一行，按文件分组：

`<文件>:<行号>，简化了什么。上限：<写明的限制>。升级：<何时回头看>。`

约定是 `shortcut: <限制>, <升级触发>`，上限和触发条件直接从注释里取。想每行带 owner 就加 `git blame -L<行号>,<行号>`。

标出腐坏风险：没写升级路径或触发条件的标记，打上 `无触发` 标签，这些会悄悄烂掉。

结尾写 `<N> 个标记，<M> 个没有触发条件。` 什么都没找到：`没有 shortcut 债务，账本干净。`

## Boundaries

Reads and reports only, changes nothing. To persist it, ask and it writes the
ledger to a file (e.g. `PONYTAIL-DEBT.md`). One-shot.
