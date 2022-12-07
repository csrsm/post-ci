---
category: csrsm
title: Redis
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - redis
date: 2022-5-2

---

# Redis

## 一、数据类型

### 1.字符串String

##### 应用场景：

1. 缓存
2. 计数

##### 常用操作

- incr key：自增1
- decr key：自减1
- incrby key k：自增k
- decrby key k：自减k
- set key value：key是否存在都设置
- setnx key value：key 不存在，才设置
- set key value xx：key存在，才设置
- set ex：set+expire组合 原子性操作
- mget：批量获取key 原子操作 高效率，多次计算，一次网络传输
- mset：批量设置键值对
- getset key newvalue：设置一个新的value 返回旧的value
- append key value：追加value
- strlen key：返回字符串长度（注意一个中文占用两个字节）
- incrbyfloat key k 增加浮点型值
- getrange key start end 获取制定下标的所有值（截取）
- setrange key index value 设置指定下标新的值

时间复杂度 o(n)：mget、 mset、 keys 其他均为o(1) 

### 2.哈希 hash（small redis）

##### 常用操作 

- hset、hget、hgetall、hdel、hexists、hlen、hmget、hmset （key field value）与字符串类似
- hincrby user:1:info pageview count 自增
- hgetall：获取所有的key和values 慎重使用
- hvals:获取所有的values
- Hkeys：获取所有的keys

存储对象的三种方式：

1. 一个键值对，key为用户唯一标示，value是用户信息json。简单，节约内存，序列化开销大，不能部分更新
2. 多个键值对，每个键值对为一个用户属性。 直观，可以部分更新，内存占用大，key分散 
3. 哈希的方式存储，一个key对应多个field。直观，节约空间，部分更新，编程复杂，ttl不好控制

### 3.列表结构

特点：有序、可重复、可以从左右插入弹出

##### 常用操作 

- rpush key val1 val2…… 从右边新增
- lpush key val1 val2…… 从左边新增
- linsert key before｜after value newvalue 在value 前/后插入newvalue
- lpop 从左边弹出
- rpop 从右边弹出
- lrem key count value
  - count=0 删除所有value相等的项
  - count>0 从左到右删除 count个value相等的项
  - count<0 从右到左删除 count个value相等的项
- ltrim key start end 按照索引范围修剪列表 左右闭合区间。
- lrange key start end 获取指定索引范围所有item
- Lindex key index 获取指定索引的item (索引从左到右0开始，右到左-1开始)
- llen key获取长度
- lset key index newvalue 设置列表指定索引值为newvalue
- blpop/rlpop key timeout 阻塞版本 timeout是阻塞超时，0位永久阻塞 ，一旦新增则执行弹出操作（实战：微博更新时间线等）

##### 小技巧

- LPUSH + LPOP = Stack 实现栈
- LPUSH + RPOP = Queue 实现队列
- LPUSH + LTRIM = Capped Collection 控制列表大小
- LPUSH + BRPOP = Message Queue 消息队列

### 4.集合结构

特点：无序、无重复、支持集合间操作

##### 常用操作 

集合内部api：

- sadd key element 添加元素，已存在则添加失败 可以添加多个
- srem key element 移除元素
- scard key 计算集合中的元素
- sismember key value 判断是否在集合中存在
- srandmember key count 随机取出count个元素，不会破坏集合数据
- spop key 随机弹出一个元素
- smembers ：无序、小心使用，返回集合所有元素，可以用sscan代替使用
- 实战：抽奖、点赞、踩等等

集合间api：

- sdiff key1 key2 差集
- sinter key1 key2 交集
- sunion key1 key2 并集
- sdiff｜sinter｜sunion + store destkey .. 将差集、交集、并集结果保存到destkey中，实战：微博共同关注、我关注的人关注了谁等等
- SAAD 标签功能
- SPOP/SRANDMEMBER 随机抽奖功能
- SADD + SINTER 社交功能

### 5.有序集合

组成： key ｜ score value 

特点：有序、无重复元素、值为元素+score

##### 常用操作

- zadd key score element 新增（可以是多对，score可以重复，element不能重复）o(logN)
- zrem key element 删除 o(1)
- zscore key element 获取元素分数 o(1)
- zincrby key increScore element 分数自增 o(1)
- zcard key 获取元素个数 o(1)
- zrank key element 获取元素排名，根据score从小到大排序后的排名（从0开始）
- zrange key start end withscores 获取指定索引范围内的生序元素并打印分数 o(log(n) + m)
- zrangebyscore key minScore maxScore 通过分数范围获取 o(log(n) + m)
- zcount key minScore maxScore 获取指定分数内元素个数 o(log(n) + m)
- zremrangebyrank key start end 根据指定排名范围删除 o(log(n) + m)
- zremrangebyscore key minScore maxScore 根据指定分数范围删除 o(log(n) + m)
- zrevrank、zrevrange、zrevrangebyscore ：反向排名
- zinterstore、zunionstore 集合间的api
- 实战：排行榜功能、热搜、新旧程度排名等

## 二、常用命令

1. Keys：查询所有或匹配相应的key，不推荐在生产环境使用，可以通过热备节点，在备用服务上使用，或用scan命令代替。
2. Dbsize 查看键值对数量
3. exists key 查看key是否存在
4. expire key seconds 设置key在多少秒以后失效
5. Ttl key 查看key还有多少秒失效 （-2没有key，-1没有失效时间）
6. persist key 设置key不失效
7. type key 查询值的类型

redis速度快的原因：

- 纯内存
- 非IO阻塞
- 避免线程切换和竞态消耗

## 三、常用功能

### 客户端使用：

- Java：Jedis
  - 直连：Jedis jedis = new Jedis(“127.0.0.1”,6379) 使用后关闭连接
  - 连接池：Jedis jedis = JedisPool.getResource() 使用后归还连接
- Python：redis-py

### 慢查询

获取查询较慢的查询对列，对应配置：

- slowlog-max-len 不要设置过大，默认10ms，通常设置1ms
- slowlog-log-slower-than 队列长度不要设置过小，便于查询历史数据，默认128，理解命令的生命周期，定期持久化慢查询，记录历史操作

### PipeLine

​		批量打包命令，1次网络 + n次命令，非原子操作，Redis命令时间很快，pipeline就是控制网络时间，注意每次携带的数量，每次只能作用在一个redis节点。

### 发布订阅

​		不能读取历史发布的消息

- publish channel message 发布消息 返回订阅数
- [un]subscribe channel 订阅/取消订阅一个或多个频道

### 消息队列

发布一个消息只有一个订阅者能获取到，只是利用list模拟消息队列功能 。

### 位图bitmap

- setbit key offset value 给位图指定索引设置值
- getbit key offset 获取位图指定索引的值
- bitcount key [start end] 获取指定范围值为1的个数
- bitop op destkey key [key…] 做多个bitmap的and（交集）、or（并集）、not（非）、xor（异或）等操作并将结果保存到destkey中
- bitpos key targetBit [start][end] 计算位图指定范围第一个偏移量对应的值等于targetBit的位置

本身是string 最大512M，使用时注意setbit时的偏移量，可能出现较大的耗时

```
对比 set 和 bitmap  假设 1亿用户数
Set     每个userid占用32位（假设是整型） 5000万日活用户  全部存储200MB   10万日活用户  4MB
Bitmap  每个用户占1位                  1亿全部存储         12.5MB               
```

### hyperLogLog

极小的空间完成独立数量统计，本质是string ，不能重复

- pfadd key element … 添加元素
- pfcount key [key…] 计算hyperLogLog中独立数据的总数
- pfmerge destkey sourcekey [sourcekey…] 合并多个hyperLogLog
- 百万独立数据 15kb左右
- 错误率 0.81%
- 不能取出单条数据

### GEO 地理位置

类型为zset

- geoadd key longitude latitude member [….] 添加经纬度信息
- geopos key member […] 获取地理位置信息
- geodist key member1 member2 [unit] 获取两个位置的距离 unit:m、km、mi英里、ft尺
- Georadius 获取指定位置范围内的地理位置信息集合

## 四、缓存

### 1.缓存的收益与成本

- 收益：
  - 加速读写
  - 降低后端负载：业务段通过使用redis降低后端数据库的负载
- 成本：
  - 数据不一致：缓存层和数据层有时间窗口不一致，和更新策略有关
  - 代码维护成本：多了一层缓存逻辑
  - 运维成本：例如redis cluster

### 2.缓存的使用场景

- 降低后端负载：对高消耗的sql，join结果集/分组统计结果缓存
- 加速请求响应时间：利用redis/memcache 优化IO响应时间
- 大量写合并为批量写：如计数器先redis累加再批量写db

### 3.缓存更新策略

（1）LRU/LFU/FIFO算法剔除：例如maxmemory-policy控制最大内存，一致性最差、维护成本低

（2）超时剔除：例如expire，一致性较差、维护成本低

（3）主动更新：开发控制生命周期，一致性较强、维护成本高

建议：

- 低一致性：最大内存和淘汰策略
- 高一致性：超时剔除和主动更新结合，最大内存和淘汰策略兜底

### 4.缓存粒度控制

（1）通用性：全量属性更好

（2）占用空间：部分属性更好

（3）代码维护：表面上全量属性更好

（4）实际业务中，大部分业务不需要全量属性缓存

### 5.缓存穿透问题

大量请求不命中缓存，直接请求存储层

原因：

- 业务代码自身问题
- 恶意攻击、爬虫等等，请求一些不存在的数据

如何发现：

- 业务的响应时间
- 业务本身问题，功能问题
- 相关指标：总调用数、缓存层命中数、存储层命中数

解决方法：

（1）缓存空对象

将缓存中不存在的数据且存储层不存在的数据，缓存空对象到缓存中

问题：

- 需要更多的键。
- 缓存层和存储层数据短期不一致，由于意外因素导致存储层返回空，缓存层将会存储空对象到对应键中，当意外恢复（如网络波动）时，空对象到过期时间没有到时，会出现数据不一致

（2）布隆过滤器拦截

 在缓存层之前，使用布隆过滤器拦截，需要特殊的业务场景，维护成本较高

### 6.雪崩问题

缓存层面高可用、客户端降级、提前演练是解决雪崩问题的重要方法

### 7.无底洞问题优化

问题描述：2010年，Facebook有了3000个memcache节点，加机器性能没能提升，反而下降了

问题关键点：批量请求mget，会有更多的网络io

- 更多的机器不等于更高的性能
- 批量接口需求（mget、mset等）
- 数据增长与水平扩展需求

**优化IO的几种方法：**

1. 命令本身优化：例如慢查询keys、hgetall bigkey
2. 减少网络通信次数
3. 降低接入成本：例如客户端长连接/链接池、NIO等
4. 批量操作优化可以看上一章笔记

### 8.热点key重建优化

问题描述：热点key + 较长的重建时间 + 高并发

三个目标：

- 减少重缓存的次数
- 数据尽可能一致
- 减少潜在危险

两个解决方案：

（1）互斥锁：减少了重缓存的次数，

​		优点：思路简单，保证一致性

​		缺点：代码复杂，存在死锁的风险

（2）永不过期：缓存层面不设置过期时间，在value中设置逻辑过期时间，当发现逻辑过期时间过期时间到期时，使用异步的线程执行更新热点数据操作

​		优点：基本杜绝热点key重建问题

​		缺点：不保证一致性，逻辑过期时间增加维护成本和内存成本

​		建议逻辑过期时间比预想的过期时间提前一些，给出更新热点key的操作时间

## 五、持久化

Redis 持久化：所有的数据保持在内存中，对数据的更新将异步的保存到磁盘上

常用的持久化方式：

- 快照：mysql dump 、redis RDB
- 写日志： mysql binlog、hbase HLog、 redis AOF

### 1.RDB

在指定的时间间隔能对你的数据进行快照存储，以二进制形式保存在硬盘上，用于备份、数据恢复等。

#### （1）触发方式

1. save（同步） 容易阻塞，生成临时文件，执行完成后会替换旧的文件，不会消耗额外内存

2. bgsave（异步） 调用linux fork()函数，如果fork执行慢，依旧会阻塞redis，但大部分执行很快，fork会调用子线程执行RDB操作，消耗额外内存

3. 自动 通过配置，满足任意条件 生成rdb文件，可以自定义修改，不建议使用

   ```properties
   # 900s内如果有1条是写入命令，就触发产生一次快照
   save 900s 1条 
   # 300s内如果有10条是写入命令，就触发产生一次快照
   save 300s 10条
   # 60s内如果有10000条是写入命令，就触发产生一次快照
   save 60s  10000条
   ```

#### （2）配置策略

```properties
# 持久化rdb文件名
dbfilename dump-${port}.rdb  
# rdb存储当前目录，建议放到大存储磁盘下
dir ./
# 有问题停止
Stop-writes-on-bgsave-error yes
# 压缩配置开启
Rdbcompression yes
# 导入时是否检查
rdbchecksum yes

```

#### （3）触发机制

1. 全量复制， 主从备份时会出发rdb生成 
2. debug reload 重启不清空内存，触发rdb生成
3. shutdown 会触发rdb生成

#### （4）存在问题

1. 耗时、耗性能 fork()消耗内存
2. 不可控、容易丢失数据，宕机不可控

### 2.AOF重写

以日志的形式将写入命令保存到AOF文件中，记录每次对服务器写的操作,当服务器重启的时候会重新执行这些命令来恢复原始的数据。

AOF重写作用：减少磁盘占用量、加快恢复速度

#### （1）三种策略

- always：写命令刷新到硬盘缓冲区，每条命令fsync到硬盘AOF文件，不丢失数据，但是io开销大
- everysec：每秒把缓冲区fsync到硬盘，可能丢失1秒数据
- no：根据操作系统决定什么时候刷新AOF文件，不可控，

#### （2）重写的实现方式：

1. bgrewriteaof：异步执行，fork子进程，对redis数据回溯、重写到AOF文件

2. AOF重写的配置：

   - auto-aof-rewrite-min-size 重写需要的尺寸

   - auto-aof-rewrite-percentage 文件增长率

同时满足时，自动触发aof重写，两种方式本质都是执行 bgrewriteaof，异步执行

#### （3）配置策略

```properties
# 打开aof功能
appendonly yes 
# 持久化aof文件名
appendfilename “appendonly-${port}.aof”
# 同步方式
appendfsync everysec
# aof重写期间是否同步
no-appendfsync-on-rewrite no
# aof存储当前目录，建议放到大存储磁盘下
dir ./
# 重写触发配置
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
# 加载aof时如果有错如何处理
aof-load-truncated yes
# 文件重写策略
aof-rewrite-incremental-fsync yes
```

### 3.对比RDB和AOF

|            | RDB            | AOF            |
| ---------- | -------------- | -------------- |
| 启动优先级 | 低             | 高             |
| 体积       | 小             | 大             |
| 恢复速度   | 快             | 慢             |
| 数据安全性 | 丢数据         | 根据策略决定   |
| 轻重       | 重（计算密集） | 轻（日志追加） |

RDB最佳策略： 建议关闭，集中管理，大量级的数据备份，可以主从部署时，从节点打开，根据实际需求制定。

AOF策略：建议开启，有内存开销，如果仅把redis当作缓存，对数据库压力不大可以关掉。重写AOF集中管理。建议每秒刷盘

AOF最佳策略：小分片的缓存或存储，监控硬盘、内存、负载、网络，足够的内存余负

### 4.持久化常见的运维问题

#### （1）fork操作

同步操作，与内存量息息相关，fork执行过慢时会引起redis主线程阻塞，当超过超时时间时，会引起程序超时。

查持久化的执行时间，info：lastest_fork_usec

改善fork：

- 优先使用物理机或者高效支持fork操作的虚拟化技术
- 控制redis实例最大可用内存：maxmemory
- 合理配置linux内存分配策略：vm.overcommit_memory=1
- 降低fork频率：例如放宽AOF重写自动触发时机，不必要的全量复制

#### （2）进程外开销

子进程开销：

- CPU：RDB和AOF文件生成，属于CPU密集型
  - 优化：不做CPU绑定，不和CPU密集型的一些应用部署在一起，单机部署不要大量重写或bgsave
- 内存：fork内存开销，copy-on-write
  - 优化：单机部署不要大量重写或bgsave，echo never > /sys/kernel/mm/transparet_hugepage/enabled
- 硬盘：AOF和RDB文件写入，可以结合iostat，iotop工具解析
  - 优化：不要与高硬盘负载服务部署一起：存储服务、消息队列等，配置no-appendfsync-on-rewrite = yes，根据写入量决定磁盘类型是否用ssd，单机多实例持久化文件目录可以考虑分盘写入。

#### （3）AOF追加阻塞

​		通常每秒刷盘，主线程写入AOF缓冲区，同步线程负责每秒同步刷盘操作，记录同步时间，主线程会对比上次的同步时间，如果大于2秒，则会阻塞，小于两秒则通过。这种刷盘策略可能会丢失两秒数据。

定位主线程阻塞的方式：

- redis日志 async AOF too long……
- 命令行 info persistence -> aof_delayed_fsync:100 (这个次数是累加的过程，需要记录后差值计算)
- top命令查看IO资源是否紧张

#### （4）单机多实例部署

## 六、复制

### 主从复制

主从复制不能做到自动故障转移

主从复制的作用 依赖rdb文件bgsave,无论rdb配置是否开启，主从复制时依旧会启用

（1）数据副本，高可用、分布式的基础

（2）扩展读性能，读写分离

一个master可以有多个slave，一个slave只有一个master，数据流向是单向的：master->slave

实现：

- 命令：slaveof ip port 无需重启，但不便于管理
- 配置：slaveof ip port |  slave-read-only yes(从节点只能读不能写)  统一配置，需要重启

run_id 是一个标示，重启或者有其他变化而导致runid变化时，从节点会进行全量复制的操作

偏移量offset：当主从的偏移量过大时，表示主从复制的内容有问题

### 1.全量复制

#### 过程

（1）slave/repl -> master (执行psync，参数是run_id和偏移量，主节点会把偏移量之后的数据复制给从节点，第一次执行是，可以传递 ？和-1 ，表示从主节点进行全量复制)

（2）master -> slave/repl (全量复制时，会返回runid和偏移量是多少) 

（3）slave/repl节点会保存master的基本信息

（4）master会执行bgsave操作，生成rdb文件，发送给从节点

（5）同时主节点会将最新的数据记录到 repl_back_buffer缓冲区（默认1M），发送完rdb文件后，将缓冲区中的buffer发给slave/repl节点

（6）slave/repl节点会清除自己的原有数据，加载rdb文件以及buffer数据完成全量同步复制的功能

#### 开销

（1）master节点的bgsave操作时间

（2）rdb文件的网络传输时间

（3）slave/repl节点清空数据时间

（4）slave/repl加载rdb文件以及buffer数据的时间

（5）可能存在的AOF重写时间（AOF开启的情况下）

### 2.部分复制

当网络出现波动的时候，master节点更新数据会丢失，slave/repl节点获取不到，如果在进行全量复制，会占用过多的资源。

1.  slave/repl -> master Connection lost
2.  master 将新的数据写入缓冲区 repl_back_buffer 默认大小1M
3.  slave/repl -> masterConnecting to master
4.  slave/repl -> master 执行psync {offset}{runid} 
5.  master -> slave/repl 当偏移量在buffer偏移量队列范围内，会返回continue，将buffer数据返回，实现部分复制的功能，当偏移量不在buffer的范围内时，表示丢失了很多数据，可以执行全量复制操作

### 3.常见问题

#### （1）读写分离

读流量分摊到从节点，减少master压力，首先考虑优化master节点

 可能遇到的问题： 

- 复制数据延迟，slave发生阻塞时，可能会发生读写不一致的情况，可以监控偏移量，不一致的时候可以切换到master节点
- 读到过期数据，slave没有删除数据权限，master过期数据删除延迟，3.2版本以后已经优化了这个问题
- 从节点故障，怎么将从节点迁移，成本非常高

#### （2）主从配置不一致

- 例如maxmemory不一致：丢失数据。会触发最大内存的策略，淘汰数据（例如过期数据）
- 例如数据结构优化参数（例如hash-max-ziplist-entries）:内存不一致
- 尽量规避主从配置不一致

#### （3）规避全量复制

- 第一次全量复制不可避免：小主节点、低峰时处理，数据分片，maxmemory不要过大

- 节点运行id不匹配：主节点重启，runid会变，从节点会全量复制。使用故障转移的方式处理

- 复制积压缓冲区不足，当出现网络波动或中断时，恢复时偏移量不在缓冲区队列内时，部分复制无法满足，会全量复制，可以通过设置增大复制缓冲区配置 rel_bcaklog_size.

#### （4）规避复制风暴

​	Master节点宕机后重启 runid发生改变，所有的slave/repl节点都会进行全量复制，对于master的开销非常大（cpu、内存、带宽等等），可以通过更换复制拓扑，减轻master负担，这种解决方式问题较多

## 七、Redis Sentinel

### 1.主从复制问题

手动故障转移、写能力和存储能力受限

### 2.Redis Sentinel

- redis sentinel会对master和slave/repl节点进行监控，客户端从sentinel获取数据
- 故障转移：
  - 多个sentinel发现并确认master有问题
  - 选举出一个sentinel作为领导
  - 选出一个slave/repl作为master
  - 通知其余的slave/repl成为新的master的slave
  - 通知客户端主从变化
  - 等待老的master复活成为新的master节点的slave/repl节点
- 一套sentinel可以监控多个主从节点，使用master-name进行配置

### 3.安装与配置

- 配置开启主从节点
- 配置开启sentinel监控主节点（sentinel是特殊的redis）
- 实际应该多机器
- 详细配置节点（默认端口是26379）

sentinel主要配置:

```properties
 # 端口
 port ${port}
 # 文件夹位置
 dir "/xx/xx/xx"
 # 日志
 logfile “xx.log”
 # n表示有n个sentinel发现故障后，执行故障转移操作
 sentinel monitor xx ip port n
 # ping 30秒后不通后认为master有问题
 sentinel down-after-milliseconds xx 30000 
 # 每次只能复制一个slave/repl节点
 sentinel parallel-syncs xx 1
 # 故障转移时间
 sentinel failover-timeout xx 180000
```

服务端高可用和客户端高可用：

服务端：故障自动转移，master宕机，转移到slave后

客户端：

1. 遍历sentinel节点，获取一个可用的sentinel节点 + masterName
2. sentinel get-master-addr-by-name masterName 获取节点信息
3. role命令 验证master节点
4. sentinel 对客户端 进行redis数据节点的变化通知

接入流程：

1. Sentinel地址集合
2. masterName
3. 不是代理模式

### 4.使用jedis操作sentinel：

```java
JedisSentinelPool sentinel = new JedisSentinelPool(masterName,sentinelSet,poolConfig,timeout)
Jedis jedis = sentinel.getResource()
```

### 5.三个定时任务

1. 每10秒每个sentinel 对master和slave执行info：发现slave节点，确认主从关系
2. 每2秒每个sentinel通过master节点的channel交换信息(发布订阅模式)， 通过_sentinel _:hello频道交互，交互主要作用是对节点的看法和自身信息
3. 每1秒每个sentinel对其他sentinel和redis执行ping操作：心跳检测的过程，失败判定的依据

### 6.主观下线和客观下线

```properties
# quorum表示有quorum个sentinel发现故障后，执行故障转移操作
sentinel monitor <masterName> <ip> <port> <quorum>
# sentinel定时任务每1秒对redis执行ping操作失败 30秒不通后认为master有问题 
sentinel down-after-milliseconds <masterName> <timeout>
```

主观下线：其中一个sentinel节点对redis节点ping失败，认为其有问题

客观下线：其中一个sentinel节点发现redis节点ping失败后，通过定时任务(2)告诉其他sentinel节 点，其他节点会通过sentinel is-master-down-by-addr masterName 去判定改节点是否失效，当认为其失效的sentinel数超过 quorun时，则判定master客观下线，然后进行故障转移的相关操作。slave/repl节点不需要客观下线，不需要故障转移。quorum常设置为 1/2+1

### 7.sentinel领导者选举

原因：只有一个sentinel节点完成故障转移

选举：通过 sentinel is-master-down-by-addr命令都希望成为领导者

- 每个做主观下线的sentinel节点向其他sentinel节点发送命令，要求将它设置为领导者。
- 收到命令的sentinel节点如果没有同意通过其他sentinel节点发送的命令，则同意该请求，否则拒绝
- 当前的sentinel节点发现自己的票数已经超过sentinel集合的半数且超过quorum，则成为领导者
- 如果此过程有多个sentinel节点成为了领导者，则将等待一段时间重新进行选举

### 8.故障转移

1. 从slave/repl节点中选出一个“合适的”节点作为新的master节点
2. 对上述slave节点执行slaveof no one 命令让其成为master节点
3. 向剩余的slave节点发送命令，让它们成为新master的slave节点，复制规则和parallel-syncs参数有关，希望有几个slave节点同时去复制master节点数据
4. 更新对原来的master节点配置为slave并保持关注，当期恢复后命令它去复制新的master节点

### 9.故障转移时选择slave节点

1. 选择slave-priority（slave节点优先级）最高的slave节点，如果存在则返回，不存在继续
2. 选择复制偏移量最大的slave节点（复制的最完整），如果存在则返回，不存在则继续
3. 选择runid最小的slave节点

### 10.常见的运维问题

​	节点运维：主节点、从节点、sentinel节点

​	节点下线：机器下线、机器性能不足（cpu、内存、硬盘、网络）、节点自身故障，下线时考虑是否要做清理工作，从节点考虑读写分离情况

​	节点上线：主节点上线 sentinel failover进行替换，从节点上线 slaveof即可，sentinel可以感知

### 11.高可用读写分离

从节点作用：

- 副本：高可用的基础
- 扩展：读能力

客户端需要知道的三个消息：

- switch-master：切换主节点（从节点晋升）
- convert-to-slave：切换从节点（原主降为从）
- sdown：主观下线

### 12.总结

1. Redis Sentinel通过三个定时任务实现了Sentinel节点对于主节点、从节点、其余Sentinel节点的监控
2. Redis Sentinel在对节点做失败判定时分为主观下线和客观下线
3. 理解Redis Sentinel故障转移日志
4. Redis Sentinel实现读写分离高可用可以依赖Sentinel节点的消息通知，获取Redis数据节点的状态变化

## 八、Redis Cluster

使用集群的原因：

- 并发量
- 数据量

### 1.数据分布

数据分区：

- 顺序分区
- 哈希分区

特点：

- 顺序分批：数据分散度易倾斜、键值业务相关、顺序访问
- 哈希分布：数据分散度高、键值分布业务无关、无法顺序访问、支持批量操作

Redis Cluster 是哈希分区的方式

### 2.节点取余分区

hash（key）%nodes 一般不建议使用

优势：简单易懂

缺点：节点伸缩时，数据迁移量非常大（80%左右），迁移数量和添加节点数量有关：建议多倍扩容（50%） 重新分配数据，需要从数据库重新load ，回写缓存，开销较大

### 3.一致性哈希

​		设定token=0～2的32次方，为每个节点分配token值，负责一部分的token范围，通过对key进行hash计算token结果，顺时针的寻找第一个遇到的节点，数据就会存到该节点，节点伸缩的时候只影响临近的节点，但是仍然有数据迁移，所以只能在缓存的场景下使用，建议多倍扩容来保证最小迁移数据和负载均衡。

### 4.虚拟槽分区

redis cluster使用的方式：16384个槽

- 预设虚拟槽：每个槽映射一个数据子集，一般比节点数大
- 良好的哈希函数：如CRC16。 keyhash = hash(key) slot(槽) = keyhash%16383
- 服务端管理节点、槽、数据的关系

### 5.Redis Cluster

分布式架构：节点之间是互相通信的，每个节点都负责读写。

Redis Cluster：节点、节点之间的meet操作（gossip协议）、指派槽、复制

特点：主从复制、高可用、分片

### 6.安装

#### （1）原声命令安装：

生产环境不使用，可以用开理解cluster架构原理

1. 配置节点开启

   ```properties
   # 端口
   port ${}
   # 守护线程
   daemonize yes
   # 文件位置
   dir "/xx/xx/xx/xx"
   # rdb文件名
   dbfilename "dump-${port}.rdb"
   # 日志文件
   logfile “${port}.log”
   # cluster节点配置
   cluster-enabled yes
   # 集群配置文件
   cluster-config-file nodes-${port}.conf
   # 主观下线的超时时间
   cluster-node-timeout 15000 
   # 当有一个节点不可用则不对外服务
   cluster-require-full-coverage yes/no 
   ```

2. meet

   cluster meet ip port 

3. 指派槽

   ```shell
   cluster addslots slot [slot…]  //例如{0…16383}
   // 可以通过脚本执行:
   start=$1
   end=$2
   port=$3
   for slot in `seq ${start} ${end}`
   	do
   		echo "slot:${slot}"
   		redis-cli -p ${port} cluster addslots ${slot}
   	done
   ```

4. 主从分配

   ```shell
   # (区别于runid，不会重置)
   cluster replicate node-id 
   # 查看集群node信息
   cluster nodes 
   ```

   

#### （2）官方工具安装

ruby工具一键安装 ，高效，准确

- 下载、编译、安装ruby
- 安装rubygem redis客户端
- 安装redis-trib.rb

**低版本按照以上方法执行，高版本已经集成在redis-cli中**

#### （3）其他工具可视化部署

## 九、Redis Cluster 深入理解

### 1.moved重定向

- 客户端发送键命令时，请求任意redis节点
- redis根据计算槽点结果和对应的节点后，判断是否指向自身
- 如果指向自身，则继续执行命令
- 如果不是自身，回复moved命令(异常)，告诉客户端该数据在哪个节点上
- 客户端重定向发送命令

当redis是以集群模式连接服务时，即redis-cli -c -p 7000 时，会自动重定向到指定的节点并执行命令。

当不是以集群模式时，即redis-cli -p 7000时，会返回moved异常，不会自动执行重定向并执行命令。

### 2.ask重定向

由于虚拟槽从源节点正在迁移到目标节点，而客户端记录的是源节点时，就会出现ask重定向的现象

- 发送键命令到源节点
- 源节点回复ask重定向信息
- asking并发送命令到目标节点
- 目标节点相应结果

### 3.smart客户端实现

#### （1）smart客户端原理：追求性能

1. 从集群中选一个可运行节点，使用cluster clots初始化槽和节点映射
2. 将cluster slots的结果映射到本地，为每个节点创建JedisPool
3. 准备执行命令
4. 当连接出现错误时，会随机连接一个活跃节点，返回moved异常时，重新初始化槽和节点映射缓存

不要轻易刷新本地的缓存，会影响执行效率。在出现moved重定向异常的情况下，需要刷新本地缓存

#### （2）JedisCluster

1. JedisCluster基本使用

   - 单例模式：内置了所有节点的连接池
   - 无需手动借还链接池
   - 合理设置commons-pool

2. 整合spring

3. 多节点命令实现

   - 获取所有节点的jedisPool，jedisCluster.getClusterNodes() 结果是Map
   - 判断是否是主节点，通过info返回的结果，查看role字段的值

4. 批量命令实现

   mget、mset必须在一个槽内

   四种优化批量的方法：

   - 串行mget：遍历所有key，获取结果后汇总 n次网络时间。

     优点：简单，满足少量key的需求

     缺点：大量key请求延迟严重

   - 串行IO：在客户端通过计算key的hash值后，根据节点的slot范围，将key分组后通过papeline请求redis获取结果。分组节点次网络时间。

     优点：简单、少量节点满足需求

     缺点：大量节点时延迟严重

   - 并行IO：在串行的基础上，并行通过pipeline获取结果。1次网络时间

     优点：并行、延迟取决于最慢的节点

     缺点：复杂、超时定位难

   - hash_tag：将key进行tag包装，保证所有的key都在一个redis节点上。一次网络请求。

     优点：性能最高

     缺点：读写增加tag维护成本，容易出现但节点压力过大，数据倾斜

### 4.RedisCluster故障转移

#### （1）故障发现

1. 通过ping/pong消息实现故障发现：不需要sentinel
2. 主观下线：某个节点认为另一个节点不可用 pfail状态
3. 客观下线：当半数以上持有槽的主节点都标记了某个节点主观下线时，尝试客观下线

尝试时，先计算有效的下线报告数量，是否大于槽节点总数的一半，大于就更新为客观下线，然后向集群广播下线节点的fail消息，通知故障节点的从节点触发故障转移流程

#### （2）故障恢复

1. 资格检查

   - 每个从节点检查与故障主节点的断线时间
   - cluster-node-timeout* cluster-slave-validity-factor（默认15*10）
   - 超过上述时间则没有成为主节点的可能性

2. 准备选举时间

   偏移量更大的，更接近与故障主节点数据一致性的从节点，准备选举时间越短小，越容易成为主节点

3. 选举投票

   准备选举时间结束后会使主节点发起选举，所以选举时间越短，偏移量越大，则获取投票数越多，当投票数大于N/2 +1 时，就可以替换主节点。

4. 替换主节点

   - 执行slaveof no one，取消复制变为主节点
   - 执行clusterDelSlot撤销故障主节点负责的槽，并执行clusterAddSlot把这些槽分配给自己
   - 向集群广播消息，表明已经替换了故障节点

### 5.常见问题

#### （1）集群的完整性

```
配置参数cluster-require-full-coverage 默认时yes
    在部分key所在的节点不可用时，如果此参数设置为"yes"(默认值), 则整个集群停止接受操作；如果此参数设置为"no"，则集群依然为可达节点上的key提供读操作。集群中16384个槽全部可用：保证集群完整性，节点故障或故障转移时集群不可用，只针对key的操作，所以不适用于大部分的业务，建议设置为no。
```

#### （2）带宽消耗

官方建议：小于1000个节点

影响因素：

- 发送消息频率：节点发现与其他节点最后通信时间超过cluster-node-timeout/2时会直接发送ping消息
- 消息数据量：slots槽数组（2kb空间）和整个集群1/10的状态数据（10个节点状态数据约1kb）
- 节点部署到机器规模：集群分布的机器越多且每台机器划分的节点数越均匀，则集群整体的可用带宽越高

优化：

- 避免大集群，避免多业务使用一个集群，可以拆分成多个集群
- cluster-node-timeout：带宽和故障转移速度的均衡
- 尽量均匀分配到多机器上：保证高可用和带宽

#### （3）Pub/Sub广播

问题：publish在集群每个节点广播，会加重带宽消耗

可以单独开启一套redis sentinel解决

#### （4）集群倾斜

1. 数据倾斜：内存不均匀

   - 节点和槽分配不均匀
     - 查看槽和节点的信息：redis-cli --cluster info ip：port
     - 重新均衡分配槽(谨慎使用)：redis-cli --cluster rebalance ip:port
   - 不同槽对应的键值数差异较大
     - CRC16正常情况下比较均匀
     -  可能存在hash_tag
     - cluster countkeysinslot {slot}获取槽对应的键值个数
   - 包含bigkey
     - redis-cli --bigkeys建议在从节点执行
   - 内存相关配置不一致
     - ziplist、intset等配置，定期检查一致性
   - 客户端缓冲区不一致等等原因很多

2. 请求倾斜：热点数据

   热点key：重要的key或者bigkey

   优化：

   - 避免bigkey
   - 热键不要使用hash_tag
   - 当一致性不高时，使用本地缓存+mq实现

### 6.集群读写分离

集群模式的从节点不接受任何的读写请求

只读连接： 重定向到负责槽的主节点，readonly命令可以读(从节点)，

读写分离更加复杂：需要自己实现客户端，成本很高，不建议使用。参考sentinel连接级别的命令，连接断开时需重连

### 7.数据迁移：在线/离线

#### （1）官方迁移工具：redis-cli --cluster import

- 只能从单机迁移到集群
- 不支持在线迁移：source需要停写，迁移时的数据不支持迁移
- 不支持断点续传
- 单线程迁移：影响速度

#### （2）在线迁移：唯品会redis-migrate-tool、豌豆荚redis-port

### 8.集群vs单机

#### （1）集群

- key批量操作支持有限：例如mget、mset必须在一个槽内
- key事务和lua支持有限，操作的key必须在一个节点
- key是数据分区的最小粒度：不支持bigkey分区
- 复制只支持一层：不支持树形复制结构

1. RedisCluster满足容量和性能的扩展性，但是很多业务不需要。
2. 大多数时客户端的性能会降低。
3. 命令无法跨节点使用
4. 客户端维护更复杂：sdk和应用本身消耗，更多的连接池

RedisSentinel就已经足够大多数场景使用。

### 9.总结

1. Redis cluster数据分区规则采用虚拟槽方式（16384个槽），每个节点负责一部分槽和相关数据，实现数据和请求的负载均衡。
2. 搭建集群划分四个步骤：准备节点，节点握手，分配槽、复制。redis-cli --cluster（低版本使用redis-trib.rb）工具快速搭建集群
3. 集群伸缩通过在节点之间移动槽和相关数据实现。
4. 使用smart客户端操作集群达到通信效率最大化，客户端内部负责计算维护键->槽->节点的映射，用于快速定位到目标节点。每种语言维护各自的客户端。
5. 集群自动故障转移过程分为故障发现和节点恢复。节点下线分为主观下线和客观下线，当超过半数主节点认为故障节点为主观下线时，标记它为客观下线状态。从节点负责对客观下线的主节点触发故障恢复流程，保证集群的高可用性。
6. 常见的开发运维问题：超大规模的集群带宽消耗、pub/sub广播问题、集群倾斜问题、单机和集群的对比等。

## 十、Redis集群扩容

### 1.集群伸缩

原理：虚拟槽和对应的数据在节点之间的移动

### 2.收缩集群

1. 下线迁移槽：同扩容

   ```shell
   redis-cli --cluster reshard --cluster-from b8ae8c6e744afd3cb7eb8cd0662ad3862f0ae921 --cluster-to d99559b0168a683bc811e80c3a684098e31bf797  --cluster-slots 1366 127.0.0.1:7006
   ```

2. 忘记节点：cluster forget {downNodeId}

   ```shell
   redis-cli --cluster del-node 127.0.0.1:7000 7bc190508cfd3027dfbd000b9ab111d97ba152c8
   ```

3. 关闭节点

   下线时，先下从节点，再下主节点，否则会触发故障转移

### 3.扩容集群

1. 准备新节点：集群模式、配置和其他节点统一、孤立节点
2. 加入集群：通过cluster meet 加入集群
3. 迁移虚拟槽和数据

作用：

- 迁移槽和数据实现扩容
- 作为从节点负责故障转移

使用官方工具redis-trib.rb add-node 为集群添加节点时，会检测改节点是否是孤立节点。如果新节点不是孤立节点，而是其他集群的节点时，会导致两个集群混合，影响较为严重。

迁移虚拟槽和数据：

- 对目标节点发送：cluster setslot {slot} importing {sourceNodeId} 命令，让目标节点准备导入槽点数据
- 对源节点发送：cluster setslot {slot} migrating {targetNodeId} 命令，让源节点准备迁出槽的数据
- 源节点循环执行cluster getkeysinslot {slot} {count}命令，每次获取count个属于槽的键
- 在源节点执行migrate {targetIp} {targetPort} key 0 {timeout} 命令把指定key迁移
- 重复3、4，直到槽下所有的键数据迁移到目标节点
- 向集群内所有主节点发送cluster setslot {slot} node {targetNodeId}命令，通知槽分配给目标节点

  <img :src="$withBase('/img/redis/redis-数据迁移.jpg')" alt="redis">

可以使用redis-cli --cluster reshard 127.0.0.1 7000 命令添加节点。

高版本已经不使用redis-trib.rb来执行，已被redis-cli --cluster代替

## 十一、CacheCloud

问题：

1.发布构建繁琐，私搭乱盖

2.节点、机器等运维成本

3.监控报警初级



CacheCloud

1.一键开启Redis（Standalone、Sentinel、Cluster）

2.机器、应用、实例监控和报警

3.客户端：透明使用、性能上报

4.可视化运维：配置、扩容、failover、机器/应用/实例上下线

5.已存在redis直接接入和数据迁移

6.具体文档见http://github.com/sohutv/cachecloud

7.运维工具，不是代理

