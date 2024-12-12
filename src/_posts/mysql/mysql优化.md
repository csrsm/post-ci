---
category: csrsm
title: MySQL调优
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

# MySQL调优

## 1. show profile

> show profile 和 show profiles 在未来的版本中有可能废弃掉，使用 Performance Schema来替代

MySQL内置的sql查询剖析工具，可以查看sql具体的执行时间

```shell
使用方法：
// mysql -uroot -p 进入mysql命令行
// 查询当前profiling状态 
mysql> show variables like "%profiling%";
// 如果当前状态关闭，则执行以下命令开启
mysql> set profiling=on;
// 开启后执行需要查询的sql，然后查看执行时间
mysql> show profiles  // 查看总时间
mysql> show profile   // 查看各个步骤详细时间
```

可以指定具体的type：（ n是query_id，即查询的sql索引）

- all：显示所有性能信息，show profile all for query n
- block io：显示块io操作的次数，show profile block io for query n
- context switches：显示上下文切换次数，被动和主动，show profile contexts switches for query n
- cpu：显示有用户cpu时间、系统cpu时间， show profile cpu for query n
- IPC：显示发送和接受的消息数量，show profile ipc for query n
- Memory：暂未实现
- page faults：显示页面错误数量，show profile page faults for query n
- source：显示源码中的函数名称与位置，show profile source for query n
- swaps：显示swap的次数，show profile swaps for query n

## 2. performance schema

用于监控MySQL server在一个较低级别的运行过程中的资源消耗、资源等待等情况

```shell
// 使用方法，默认开启
// 查询当前performance schema状态 
mysql> show variables like 'performance_schema' 
// 关闭或打开performance_schema，首先要对mysql配置进行修改
vim /etc/my.cnf  
mysql> set performance_schema=off;
```

performance_schema中的配置是保存在内存中的，是易失的，也就是说保存在performance_schema配置表(本章后续内容会讲到)中的配置项在MySQL实例停止时会全部丢失。所以，如果想要把配置项持久化，就需要在MySQL的配置文件中使用启动选项来持久化配置项，让MySQL每次重启都自动加载配置项，而不需要每次重启都再重新配置。 

### **特点如下：**

1. 提供了一种在数据库运行时实时检查server的内部执行情况的方法。performance_schema数据库中的表使用performance_schema存储引擎。该数据库主要关注数据库运行过程中的性能相关的数据，与 information_schema不同，information_schema主要关注server运行过程中的元数据信息
2. performance_schema通过监视server的事件来实现监视server内部运行情况，“事件”就是server内部活动中所做的任何事情以及对应的时间消耗，利用这些信息来判断server中的相关资源消耗在了哪里?一般来说，事件可以是的数调用，操作系统的等待，SQL语包执行的阶段(如sa语包执行过程中的parsing或sorting阶段)或者整个SQL语句与SQL语句集合。事件的采集可以方便的提供server中的相关存储引警对磁盘文件，表I/0，表锁等资源的同步调用信息。
3. performance_schema中的事件与写入二进制日志中的事件(描述数据修改的events)、事件计划调度程序(这是一种存储程序)的事件不同。performance_schema中的事件记录的是server执行某些活动对某些资源的消耗、耗时、这些活动执行的次数等情况。
4. performance_schema中的事件只记录在本地server的performance_schema中，其下的这些表中数据发生变化时不会被写入binlog中，也不会通过复制机制被复制到其他server中。
5. 当前活跃事件，历史事件和事件摘要相关的表中记录的信息。能提供某个事件的执行次数，使用时长。进而可用于分析某个特定线程、特定对象(如mutex或file)相关联的活动。
6. PERFORMANCE_SCHEMA存储引擎使用server源代码中的“检测点”来实现事件数据的收集。对于performance_schema实现机制本身的代码没有相关的单独线程来检测，这与其他功能(如复制或事件计划程序)不同
7. 收集的事件数据存储在performance_schema数据库的表中。这些表可以使用SELECT语句查询，也可以使用SQL语句更新performance_schema数据库中的表记录(如动态修改performance_schema的setup*开头的几个配置表，但要注意:配置表的更改会立即生效，这会影响数据收集)
8. performance_schema的表中的数据不会持久化存储在磁盘中，而是保存在内存中，一旦服务器重启，这些数据会丢失(包括配置表在内的整个performance_schema下的所有数据)
9. MySQL支持的所有平台中事件监控功能都可用，但不同平台中用干统计事件时间开销的计时器类型可能会有所差异。



​	**instruments**：生产者，用于采集mysql中各种各样的操作生产的事件信息，对应配置表中的配置项，我们可以称之为监控采集配置项。

​	**consumers**：消费者，对应的消费者表用于存储来自instruments采集的数据，对应配置表中的配置项，我们可以称之为消费存储配置项。

### performance_schema表的分类

performance_schema库下的表可以按照监视不同的维度进行分组

1. 语句事件记录表，这些表记录了语句事件信息

   ```shell
   查询方式：show tables like '%statement%'
   ```

   - 当前语句事件表events_statements_current
   - 历史语句记录表events_statements_history
   - 长语句历史事件表events_statements_history_long
   - 聚合后的摘要表summary，可以根据账号（account）、主机（host）、程序（program）、线程（thread）、用户（user）、全局（global）等维度在进行细分

2. 等待事件记录表，与语句事件类型的相关记录表类似

   ```shell
   查询方式：show tables like '%wait%'
   ```

3. 阶段事件记录表，记录语句执行的阶段事件的表
      ```shell
      查询方式：show tables like '%stage%'
      ```

4. 事务事件记录表，记录事务相关的事件的表
   ```shell
   查询方式：show tables like '%transaction%'
   ```

5. 监控文件系统层调用的表

      ```shell
      查询方式：show tables like '%file%'
      ```

6. 监控内存使用的表

      ```shell
      查询方式：show tables like '%memory%'
      ```

7. 动态对performance_schema进行配置的表

      ```shell
      查询方式：show tables like '%setup%'
      ```



### performance_schema的简单配置和使用

数据库刚刚初始化并启动时，并非所有instruments(事件采集项，在采集项的配置表中每一项都有一个开关字段，或为YES，或为NO)和consumers(与采集项类似，也有一个对应的事件类型保存表配置项，为YES就表示对应的表保存性能数据，为NO就表示对应的表不保存性能数据)都启用了，所以默认不会收集所有的事件，可能你需要检测的事件并没有打开，需要进行设置，可以使用如下两个语句打开对应的instruments和consumers(行计数可能会因MySQL版本而异)。

- 打开等待事件的采集器配置项开关，需要修改setup_instruments配置表中对应的采集器配置项

  ```shell
  UPDATE setup_instruments SET ENABLED = 'YES', TIMED = 'YES'where name like 'wait%'
  ```

- 打开等待事件的保存表配置开关，修改setup_consumers配置表中对应的配置项

  ```shell
  UPDATE setup_consumers SET ENABLED=YESwhere name ike%wait%;
  ```

- 当配置完成之后可以查看当前server正在做什么，可以通过查询events_waits_current表来得知，该表中链个线程只包含一行数据，用于显示每个线程的最新监视事件 

  ```shell
  select * from events_waits_current\G
  **在shell中\G表示查询的结果以每一列的详细信息展示
  ```

  