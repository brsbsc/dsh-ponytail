---
name: ponytail-audit
description: >
  Quality audit of a whole repo: bugs, security holes, what breaks under real
  load, risky code without tests, slow paths, and what to delete, merge or
  split. Ranked, each finding explained in plain language. One-shot report,
  changes nothing. Use for "audit this codebase", "review the whole repo",
  "find bloat", "what can I delete", /ponytail-audit.
---

Audit the whole repo like the senior developer who just inherited it and
will be paged when it breaks. Order of importance: correct, safe, holds under
load, tested, fast, lean. Lean still matters: every extra line must be read,
tested and fixed later. This is a report the user asked for, so give it in full.

## 1. Map first

- Audit what the user names: a folder, a package, or the whole repo.
  Nothing named: the whole repo.
- Read the README, the deploy and build config, the dependency list, the
  entry points (main, routes, handlers, jobs, CLI commands) and the tests.
- Find the expected load: one person running a script, or many users and
  processes at once. Judge scale against that, and say which load you assumed.
- Trace the main flows end to end: where data comes in, what is stored,
  what goes out. Read those paths fully: input from users, money, auth,
  data writes, background jobs, anything shared between processes.
- Big repo: go deep where a mistake costs the most, not file by file. Say
  which parts you did not read.

## 2. Look for

1. **Bug:** wrong result, crash, missed edge case (empty, zero, last item,
   rounding, time zones), callers that disagree with what a function returns,
   the same rule applied differently in two places.
2. **Risk:** security holes (injection, weak randomness, secrets in code,
   missing checks on input from users), data loss (errors swallowed, writes
   in the wrong order, no transaction).
3. **Scale:** fine for one user, wrong for many: check-then-write races, the
   same work done by every process, memory or lists that only grow, a query
   per item, O(n^2) on big input, per-process state that must be shared.
4. **Missing test:** risky logic (a branch, a parser, money, security, data
   writes) with no test that fails when it breaks. One good test, not coverage.
5. **Speed:** big slowdowns are problems. Small wins (work repeated in a hot
   loop) are suggestions; some software counts every millisecond.
6. **Lean:** code that should not exist or should be smaller.
   - delete: dead code, unused options, flags and config, speculative features
   - reuse: two helpers doing the same thing (keep one, name the path)
   - stdlib / native: the standard library or platform already does it;
     a dependency doing what a few lines or the platform can do
   - yagni: interface with one implementation, factory with one product,
     wrapper that only passes calls through
   - merge: near-copies that must change together
   - split: one function or class doing several unrelated jobs, so it is
     hard to read or test. Split by job, never by line count, and never into
     helpers that exist only to make a function shorter.

## 3. Check before you report

- Every finding needs a concrete case: "this input or situation leads to this
  wrong result". No case, no finding.
- Before calling code unused, grep the whole tree for it, including tests,
  fixtures, config, and string or dynamic references.
- A shortcut marked with a `shortcut:` (or older `ponytail:`) comment that names its limit is a
  decision, not a finding, unless the expected load already crosses it.
- Propose the smallest fix that works. Prefer fixes that delete code. Never
  add layers, frameworks or config the problem does not need.
- No style taste, no "consider", no vague worries.

## 4. 输出

用简单的话：短句，日常用词。技术名词第一次出现时解释一句。读者可能从没见过这段代码。

开头写“这个仓库是做什么的：”，两三句，并说明你假设的负载。

然后按三组列问题，最重要的在前，空组不写：
- **必须修：** 缺陷、安全问题、数据丢失、在预期负载下会坏。
- **应该修：** 有风险但没测试、确实慢、重复、一个函数混了几件事、本不该存在的代码。
- **可以更好：** 小的提速、更短的写法。

问题跨组连续编号，方便用户说“修 2 和 5”。最多 20 条；更小的问题没列时，说明还有几条。
每个问题写全四部分，每部分一两句短话：

2. **订单记到了错误的日期**（`billing/close_day.py:40-52`）
   - **这是什么：** 这个任务每天零点关闭当天账目，给当天所有订单计费。
   - **问题：** 它用服务器时钟取“今天”，而服务器跑在 UTC。柏林时间 00:30 下的订单会被算到前一天。
   - **改法：** 在店铺时区里只算一次日期：`datetime.now(ZoneInfo("Europe/Berlin")).date()`。一行，其他都不动。
   - **不改的后果：** 晚下的订单日期是错的，财务手工改。

结尾：
- `结论：` 一行：健康，或先修什么。
- `精简：` 有精简项时写 `还能少 <N> 行、少 <M> 个依赖。`
- `没检查：` 没读或没法跑的部分。

什么都没发现：先写“这个仓库是做什么的：”，再写“健康，没有要修的。”，最后一行说明查了什么。

一次性报告，不改代码。
