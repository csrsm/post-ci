---
category: csrsm
title: Helm命令
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - k8s
date: 2022-2-13
---
# Helm命令
## 仓库
```bash
helm repo add [repo-name] [repo-addr]  #添加仓库
helm repo list #查看仓库
helm repo remove [repo-name] 
```

## 应用
```bash
helm search repo [chart-name]
helm install [inst-name] [chart-name]
helm list
helm status [inst-name]
```

## Chart
```bash
helm create [chart-name]
```