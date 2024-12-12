---
category: csrsm
title: MySQL数据库的核心MVCC详解
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
date: 2022-5-20
---

# MySQL数据库的核心MVCC详解



## 1.ACID

 <img :src="$withBase('/img/mysql/mysql-acid.png')" alt="单架构">

## 2.MySQL的核心日志

在MySQL数据库中有三个非常重要的日志：

- binlog：逻辑日志，二进制日志，全称binary log，存储着每条变更的SQL语句，也称归档日志，其属于MySQL Server，MySQL实例，真正提供数据存储和数据处理功能的MySQL服务器进程，主要是做主从复制，时间点恢复使用，只会在日志提交后，一次性记录执行过的事务中的sql语句以及其反向sql(作为回滚用)，保存的是逻辑日志，执行的sql语句 
- undolog：逻辑日志，属于存储引擎InnoDB特有的日志，回滚日志保存了事务发生之前的数据的一个版本，可以用于回滚，同时可以提供多版本并发控制下的读（MVCC），也即非锁定读。**select如果没有特定加锁的话就是快照读，用到了undolog，而insert delete和update都是当前读，与这个日志关系不大。** 将当前版本生成undo log，undo 也会产生 redo 来保证undo log的可靠性，保存的是逻辑日志->数据前一个版本 
- redolog：物理日志，属于存储引擎InnoDB特有的日志，用来保证事务安全 。在事务没有提交前，每一个修改操作都会记录变更后的数据，保存的是物理日志 ，防止在发生故障的时间点，尚有脏页未写入磁盘，在重启mysql服务的时候，根据redo log进行重做，从而达到事务的持久性这一特性，redo log只是先写入Innodb_log_buffer，定时fsync到磁盘 。

#### redo log 与binlog 区别

​	基于redo log直接恢复数据的效率 高于 基于binlog sql语句恢复 binlog不是循环使用，在写满或者重启之后，会生成新的binlog文件，redo log是循环使用。 binlog可以作为恢复数据使用，主从复制搭建，redo log作为异常宕机或者介质故障后的数据恢复使用。 

#### 两阶段提交

当执行一条update语句时，redo log和binlog的记录

- 写入：redo log（prepare）
- 写入：binlog
- 写入：redo log（commit）

为什么redo log分两个阶段：prepare和commit

先分两种情况讨论：

- 先写redo log， 再写binlog

  这样会出现redo log写入磁盘了，但是binlog还没写入磁盘，于是当发生了crash recovery时，恢复后，主库会应用redo log，恢复数据，但是由于没有binlog，从库就不会同步这些数据，主库比从库“新”，造成主从不一致。

- 先写binlog，再写redo log

  跟上一种情况类似，很容易知道，这样反过来，造成从库比主库“新”，也会造成主从不一致。

**而两阶段提交，就解决这个问题，crash recovery 时：** 

1. 如果 redo log 已经 commit，那毫不犹豫的，把事务提交 
2. 如果 redo log 处于 prepare，则去判断事务对应的 binlog 是不是完整的
3. 是，则把事务提交
4. 否，则事务回滚 

**两阶段提交，其实是为了保证 redo log 和 binlog 的逻辑一致性。** 

## 3.MVCC

​	Mvcc即多版本并发控制，是一种并发控制的方法（非具体实现），一般在数据库管理系统种，实现对数据库的并发访问，在编程语言中实现事务内存。

### 3.1并发事务可能产生的问题

- 当一个事务访问数据库时，无论读写都不会产生并发问题
- 当两个或者多个事务同事访问数据库中的相同数据时，可能出现以下几种情况
  - 读：两个事务都查询数据。即两个事务对相同数据全部是读操作时，不会产生任何并发问题。
  - 读+写：一个事务查询数据，一个事务修改数据。当两个事务对相同数据有读有写时，可能会产生**脏读、不可重复读、幻读**的问题。常规解决办法是对要操作的数据加锁来解决，而Mysql的InnoDB实现了MVCC来更好的处理读写冲突，可以做到即使存在并发读写，也不用加锁，实现非阻塞并发读。
  - 写+写：两个事务都修改数据，当两个事务对相同数据全部是写操作时，可能产生数据丢失（回滚丢失、覆盖丢失）等问题。只能通过加锁（乐观锁或者悲观锁）来解决。

### 3.2当前读和快照读

- 当前读：读取的数据是最新版本，读取数据时还要保证其它并发事务不会修改当前数据，当前读会对读取的记录加锁。`select …… lock in share mode（共享锁）`、`select …… for update | update | insert | delete（排他锁）` 
- 快照读：每一次修改数据，都会在undo log中存有快照记录，这里的快照，就是读取undo log中的某一版本的快照。这种方式的优点是可以不用加锁就可以读取到数据，缺点是读取到的数据可能不是最新版本。一般的查询都是快照读