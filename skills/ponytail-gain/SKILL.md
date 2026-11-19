---
name: ponytail-gain
description: >
  Show ponytail's measured savings (code, cost, speed) from the benchmark.
  One-shot display. Use for /ponytail-gain, "what does ponytail save",
  "ponytail impact".
---

# Ponytail Gain

Display this scoreboard when invoked. One-shot: do NOT change mode, write flag
files, or persist anything.

The figures are the published agentic benchmark of Ponytail 5: headless Claude
Code (Opus 5.5, default effort) on 39 tasks (feature tickets in a real FastAPI +
React repo, bug fixes, security and privacy cases, small apps), 5 runs each,
against the same agent without the skill. 18 of the tasks have hidden checks
for correctness and safety. Each figure is the geometric mean of the per-task
medians. They are measured, not computed from the current repo.
Source: the benchmark results and README in https://github.com/DietrichGebert/ponytail.

## Scoreboard

Render plain ASCII bars. The bar length shows ponytail as a share of the
no-skill baseline; the label carries the exact figure:

```
  ponytail 收益           基准 · 39 个任务 × 5 次运行 · Opus 5.5

  无技能            ████████████████████  100%
  代码行数          █████████···········   47%   ▼ 53%
  输出 token        ███████████·········   55%   ▼ 45%
  成本              ███████████████·····   74%   ▼ 26%
  时间              ████████████········   59%   ▼ 41%
  隐藏检查通过率    97%（无技能 96%）
  逻辑需要检查处有测试   98%（无技能 68%）

  这个仓库：  /ponytail-debt（你推迟的捷径）
              /ponytail-audit（还有什么可以砍）
```

## Honesty boundary

These are benchmark averages, not this repo. NEVER print a per-repo savings
number ("you saved X lines/tokens here"): the unbuilt version was never
written, so there is no real baseline to subtract from in a live repo. The
only real per-repo figures come from `/ponytail-debt` (a counted ledger), and
this card points there instead of inventing one.

## Boundaries

One-shot display. Edits nothing, changes no mode.
