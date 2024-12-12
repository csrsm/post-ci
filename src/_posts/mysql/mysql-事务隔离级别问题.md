---
category: csrsm
title: MySQL事务隔离级别问题
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
  - mysql
date: 2022-5-2
---

# MySQL事务隔离级别问题

## 1. 问题描述

​	在使用全局编码生成器时，使用频率多的情况下，总会出现获取编码失败的情况。

## 2. 问题原因

​	MySQL默认事务隔离级别时**REPEATABLE READ**，即在一个事务内，如果你对同一数据进行多次读取，你会得到相同的结果，即使其他事务在这期间对数据进行了修改并提交。当出现并发时，获取编码的方法读取当前规则最大编码时会出现可重复读现象，当其中一个update事务提交，其他的查询语句在当前事务内查询的最大编码还是没修改之前的编码，执行update会校验，进而导致获取编码失败。

## 3. 基本概念

MySQL 不同版本下的默认存储引擎和事务隔离级别可能会有所不同。以下是 MySQL 一些主要版本的默认设置概述：

### 存储引擎

- **MySQL 5.1 及之前**：默认存储引擎是 MyISAM。
- **MySQL 5.5 及之后**：默认存储引擎变更为 InnoDB。InnoDB 支持事务、行级锁定和外键约束，适合大多数生产环境。

### 事务隔离级别

MySQL 的事务隔离级别可以通过 `SET TRANSACTION ISOLATION LEVEL` 命令来设定，支持以下四种标准的隔离级别：

1. **READ UNCOMMITTED**：允许脏读，即一个事务可以读取另一个未提交事务的数据更改。
2. **READ COMMITTED**：只允许读取已经提交的数据，防止脏读。
3. **REPEATABLE READ**：在同一个事务中多次读取相同数据时，保证结果一致。这是 MySQL InnoDB 引擎的默认隔离级别。
4. **SERIALIZABLE**：最高的隔离级别，完全串行化处理，强制事务排序执行，避免了幻读。

#### 默认隔离级别

- **MySQL 5.0 到 8.0**：对于 InnoDB 存储引擎，默认的事务隔离级别是 **REPEATABLE READ**。这意味着在一个事务内，如果你对同一数据进行多次读取，你会得到相同的结果，即使其他事务在这期间对数据进行了修改并提交。

#### 注意事项

- 如果你使用的是较新的 MySQL 版本（例如 8.0），并且希望改变默认的事务隔离级别，可以在 MySQL 配置文件 (`my.cnf` 或 `my.ini`) 中设置 `innodb_default_row_lock` 和 `transaction-isolation` 参数，或者在运行时通过 SQL 语句临时改变当前会话或全局的事务隔离级别。

例如，要将当前会话的事务隔离级别设置为 `READ COMMITTED`，你可以执行如下命令：

```sql
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

要永久改变默认的事务隔离级别，你需要编辑 MySQL 配置文件，并添加或修改如下行：

```ini
[mysqld]
transaction-isolation=READ-COMMITTED
```

然后重启 MySQL 服务以使更改生效。
