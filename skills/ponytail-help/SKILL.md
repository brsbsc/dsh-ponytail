---
name: ponytail-help
description: >
  Quick reference for ponytail levels, skills and commands. One-shot display.
  Use for /ponytail-help, "ponytail help", "how do I use ponytail".
---

# Ponytail 帮助

被调用时显示下面这张卡片。一次性显示，不要改档位、不要写文件、不要持久化任何东西。

## 档位

| 档位 | 触发 | 改动方式 |
|------|------|----------|
| **精简** | `/ponytail lite` | 照需求做；有更小的方案时，先用一行说出来。 |
| **完整** | `/ponytail` | 最小完整改动，逻辑需要时加一处检查，结尾说明跳过了什么、有什么风险。默认。 |
| **极致** | `/ponytail ultra` | 动手前先点名哪些需求理由不足；仍然照做，除非你说不要。 |

档位会一直保持，直到你改它。

## 技能

| 技能 | 触发 | 作用 |
|------|------|------|
| **ponytail** | `/ponytail` | 懒惰模式本身：最少新代码，回复里说清跳过了什么、有什么风险。 |
| **ponytail-review** | `/ponytail-review` | 审查一次改动：缺陷、安全、负载、缺测试、速度、能砍什么。每条都说明会怎样出错、怎么改。 |
| **ponytail-audit** | `/ponytail-audit` | 对整个仓库做同样的审查，按重要性排序。 |
| **ponytail-debt** | `/ponytail-debt` | 把 `shortcut:` 注释收成一份账本。 |
| **ponytail-gain** | `/ponytail-gain` | 基准收益记分牌：更少代码、更低成本、更快。 |
| **ponytail-help** | `/ponytail-help` | 这张卡片。 |

在 DeepSeek Harness 里，六个技能都是斜杠命令，由本插件注册。在输入框里敲 `/` 就能看到。

## 关闭

`/ponytail off` 关掉规则；模型会收到一行提示，让它丢弃这些规则。`/ponytail` 不带参数时报告当前档位；当前是关闭则切回完整。用 `/ponytail` 或输入框上方的横幅恢复。

## 档位保存在哪

档位就是本插件的 `mode` 设置。`/ponytail lite|full|ultra|off` 写它，输入框上方的横幅切换它，两者都按 profile 保存在 `cordis.patch.yml` 里：

```yaml
- id: ponytail
  name: dsh-ponytail
  config:
    mode: full
```

如果在 home 级 patch 或 `--patch` overlay 里固定了 `mode`，切换会被拒绝并显示原因。

## 更新

```sh
dsh plugin --profile <profile> add github:BRSBSC/dsh-ponytail#<sha>
```

把 commit 写死，然后重启应用或重载 profile。

## 更多

规则原文与上游文档：https://github.com/DietrichGebert/ponytail
