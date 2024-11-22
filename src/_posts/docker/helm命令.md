---
category: csrsm
title: Helm命令
header-title: true
header-image:
  - /img/background.jpg
  - /img/001.png
  - /img/0002.png
  - /img/0003.png
  - /img/0004.png
  - /img/0005.png
  - /img/0006.png
  - /img/0007.png
  - /img/0008.png
  - /img/0009.png
  - /img/0010.png
  - /img/0011.png
  - /img/0012.png
  - /img/0013.png
  - /img/0014.png
  - /img/0015.png
  - /img/0016.png
tags:
  - k8s
date: 2023-2-13
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