---
name: ponytail-review
description: >
  Quality review of a change: is the logic right, is it safe, does it hold
  under real load, is risky code tested, is it fast enough, and is every line
  needed. Reads the connected code, not only the diff. Each finding is
  explained in plain language. Use for "review this", "code review", "review
  the last commit", "review my PR", "is this over-engineered", /ponytail-review.
---

Review a change like the senior developer who will be paged when it breaks.
Order of importance: correct, safe, holds under load, tested, fast, lean.
Lean still matters: every extra line must be read, tested and fixed later.
This is a report the user asked for, so give it in full.

## 1. Understand first

- Review what the user names: uncommitted or staged changes, a branch, a PR
  link, or files. Nothing named: the uncommitted changes, or the last commit
  if there are none.
- Read the diff, then the code it touches: callers of every changed function,
  the functions it calls, the tests, the README.
- Trace the real flow: where data comes in, what is stored, what goes out.
- A change can break code it does not touch. When a signature, return value
  or behavior changes, grep every caller.
- Find the expected load in the repo (README, deploy config): one person
  running a script, or many users and processes at once. Judge scale against
  that, and say which load you assumed.

## 2. Look for

1. **Bug:** wrong result, crash, missed edge case (empty, zero, last item,
   rounding, time zones), a caller broken by the change, a fix applied in one
   caller while the shared function stays broken.
2. **Risk:** security holes (injection, weak randomness, secrets, missing
   checks on input from users), data loss (errors swallowed, writes in the
   wrong order, no transaction).
3. **Scale:** fine for one user, wrong for many: check-then-write races, the
   same work done by every process, memory or lists that only grow, a query
   per item, O(n^2) on big input, per-process state that must be shared.
4. **Missing test:** risky new logic (a branch, a parser, money, security,
   data writes, a bug fix) with no test that fails when it breaks. One good
   test, not coverage.
5. **Speed:** big slowdowns are problems. Small wins (work repeated in a hot
   loop) are suggestions; some software counts every millisecond.
6. **Lean:** code that should not exist or should be smaller.
   - delete: dead code, unused options, speculative features
   - reuse: the repo already has this helper (name the path)
   - stdlib / native: the standard library or platform already does it; a
     new dependency for a few lines
   - yagni: abstraction with one implementation, config nobody sets
   - merge: near-copies that must change together
   - split: one function doing several unrelated jobs, so it is hard to read
     or test. Split by job, never by line count, and never into helpers that
     exist only to make a function shorter.

## 3. Check before you report

- Every finding needs a concrete case: "this input or situation leads to this
  wrong result". No case, no finding.
- Re-read the lines and confirm: the caller exists, the value can really be
  empty, the code really is unused.
- A shortcut marked with a `shortcut:` (or older `ponytail:`) comment that names its limit is a
  decision, not a finding, unless the expected load already crosses it.
- Propose the smallest fix that works. Prefer fixes that delete code. Never
  add layers, frameworks or config the problem does not need.
- No style taste, no "consider", no vague worries.

## 4. 输出

用简单的话：短句，日常用词。技术名词第一次出现时解释一句。读者可能从没见过这段代码。

开头写“这次改动做了什么：”，两三句。

然后按三组列问题，空组不写：
- **必须修：** 缺陷、安全问题、数据丢失、在预期负载下会坏。
- **应该修：** 有风险但没测试、确实慢、重复、一个函数混了几件事、本不该存在的代码。
- **可以更好：** 小的提速、更短的写法。

问题跨组连续编号，方便用户说“修 2 和 5”。
每个问题写全四部分，每部分一两句短话：

2. **订单记到了错误的日期**（`billing/close_day.py:40-52`）
   - **这是什么：** 这个任务每天零点关闭当天账目，给当天所有订单计费。
   - **问题：** 它用服务器时钟取“今天”，而服务器跑在 UTC。柏林时间 00:30 下的订单会被算到前一天。
   - **改法：** 在店铺时区里只算一次日期：`datetime.now(ZoneInfo("Europe/Berlin")).date()`。一行，其他都不动。
   - **不改的后果：** 晚下的订单日期是错的，财务手工改。

结尾：
- `结论：` 一行：可以发，或先修哪几个。
- `精简：` 有精简项时写 `还能少 <N> 行。`
- `没检查：` 有重要部分没看或没法跑时写一行。

什么都没发现：先写“这次改动做了什么：”，再写“看着没问题，可以发。”，最后一行说明查了什么。

只列问题，不改代码。
