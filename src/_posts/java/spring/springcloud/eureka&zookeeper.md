---
category: csrsm
title: Eureka和ZooKeeper的区别
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - java
  - springcloud
date: 2020-11-21
---

# Eureka和ZooKeeper的区别

**前提：**

在分布式领域有一个很著名的CAP定理：C：数据一致性。A：服务可用性。P：分区容错性（服务对网络分区故障的容错性）。**在这个特性中任何分布式系统只能保证两个。**

**CAP理论也就是说在分布式存储系统中，最多只能实现以上两点。而由于当前网络延迟故障会导致丢包等问题，所以我们分区容错性是必须实现的。也就是NoSqL数据库P肯定要有，我们只能在一致性和可用性中进行选择，没有Nosql数据库能同时保证三点。（==>AP 或者 CP）**

提出一个想法，当你面对双十一这种业务处理时，你是选择AP还是CP呢？

个人想法是在面对这种业务处理时，先保证可用性也就是AP原则（服务器不能瘫痪），在过了双十一高峰，再核对数据，保证数据一致性。

------

**前面铺垫了那么多也就是想说下，Eureka和Zookeeper就是CAP定理中的实现，Eureka（保证AP），Zookeeper（保证CP）。** 

![1613454766524](C:\Users\cm\AppData\Local\Temp\1613454766524.png)



![1613454797520](C:\Users\cm\AppData\Local\Temp\1613454797520.png)

**Zookeeper的设计理念就是分布式协调服务，保证数据（配置数据，状态数据）在多个服务系统之间保证一致性，这也不难看出Zookeeper是属于CP特性（Zookeeper的核心算法是Zab，保证分布式系统下，数据如何在多个服务之间保证数据同步）。****Eureka是吸取Zookeeper问题的经验，先保证可用性。** 