---
category: csrsm
title: jvm面试题
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
  - 面试
date: 2022-12-2
---

## 1.描述一下jvm内存模型，以及这些空间存放的内容？
<img :src="$withBase('/img/interview/jvm1.png')">
## 2.类加载过程
<img :src="$withBase('/img/interview/jvm2.png')">
加载过程是双亲委派机制，主要方法为 loadClass --> defineClass--> findClass
Bootstrap ClassLoader 是逻辑上的类加载器，实际并不存在，是空的，主要加载 JAVA_HOME/jre/lib/rt.jar
Extension ClassLoader 主要加载JAVA_HOME/jre/lib/*.jar或者是-Djava.ext.dirs下的jar
Application ClassLoader 主要加载classpath中指定的jar
Custom ClassLoader 是自定义类加载器，自己指定加载类，举例tomcat
静态变量在验证被创建，赋默认值，初始化时赋初始值。

## 3.堆内存划分，如何回收内存对象，有哪些回收算法
<img :src="$withBase('/img/interview/jvm3.png')">
垃圾回收算法：标记清除、复制（多为新生代垃圾回收使用）、标记整理

## 4.如何解决线上gc频繁问题

1. 查看监控或日志，了解问题出现的时间点以及当前的FGC的频率，对比正常情况频率查看是否正常。
2. 查看出现问题的时间点之前有没有程序上线或者升级操作，如果有，排查更新的代码是否有问题。
3. 了解JVM参数设置，包括：堆空间各区域大小设置，新生代、老年代分别采用了哪些垃圾回收器，分析参数设置的是否合理
4. 再对步骤1中列出的可能原因做排除法，其中元空间被打满、内存泄漏、代码显示调用gc方法，比较容易排查
5. 针对大对象、长周期对象导致的FGC，可通过jmap-histo命令结合dump堆内存文件作进一步分析，需要先定位到可疑对象。
6. 通过可疑对象定位到具体代码再次分析，这时候要结合GC原理和JVM参数设置，弄清楚可疑对象是否满足了进入老年代的条件再下结论。
## 5.简述一下内存溢出的原因，如何排查线上问题

- java.lang.OutOfMemoryError:.....java.heap.space.....堆栈溢出，代码问题的可能性极大
- java.lang.OutOfMemoryError:GC over head limit exceeded 系统处于高频GC状态，而且回收的效果依然不佳的情况，就会开始报这个错误，这种情况一般是产生了很多不可以被释放的对象，有可能是引用使用不当导致，或申请大对象导致，但是java.heap.space的内存溢出有可能提前不会报这个错误，也就是可能内存就直接不够导致，而不是高频gc
- java.lang.OutOfMemoryError:PermGen space jdk1.7之前才会出现的问题，原因是系统的代码非常多或引用的第三方包非常多，或代码中使用了大量的常量，或通过intern注入常量、或者通过动态代码加载等方法，导致常量池的膨胀
- java.lang.OutOfMemoryError:Direct buffer memory 直接内存不足，因为jvm垃圾回收不会回收掉直接内存这部分内存，所以可能原因是直接或者间接使用了ByteBuffer中的allocatedDirect方法的时候，没有做clear
- java.lang.StactOverflowError: -Xss设置太小
- java.lang.OutOfMemoryError: unable to create new native thread堆外内存不足，无法为线程分配内存区域
- java.lang.OutOfMemoryError：request {} byte for {} out of swap地址空间不够
## 6.jvm有哪些垃圾回收器，实际中如何选择
## 7.三色标记算法
常见的判断对象存活的算法：

- 引用计数法：会产生循环引用的问题
- 可达性分析算法：GC roots包括
   -  虚拟机栈中引用的对象
   - 本地方法栈JNI引用的对象
   - 方法区中的类静态属性引用的对象
   - 方法区中的常量引用的对象

垃圾收集算法：标记-清除、标记-复制、标记-整理算法以及在此基础上的分代收集算法（新生代/老年代），每代采取不同的回收算法，以提高整体的分配和回收效率。
迄今为止，所有垃圾收集器在根节点枚举这一步骤时都是必须暂停用户线程的，因此毫无疑问会面临 ”Stop The World“ 的困扰。啊？啥是 ”Stop The World“，也就是我们平时说的 STW，其实就是根节点枚举过程中必须在一个能保障一致性的快照中进行，说白了就相当于持久化的快照一样，在某个时间点这个过程像被冻结了。如果根节点枚举过程中整个根节点集合对象引用关系还在变化，那垃圾回收分析的结果也不会准确，所以这就导致垃圾收集过程中必须停顿所有用户线程。
**想要解决或者降低用户线程的停顿，三色标记算法就登场了。**
三色标记法事先约定：
<img :src="$withBase('/img/interview/jvm4.png')">
根据可达性分析算法，从 GC Roots 开始进行遍历访问。

- 初始状态，所有的对象都是白色的，只有 GC Roots 是黑色的。

<img :src="$withBase('/img/interview/jvm5.png')">

- 初始标记阶段，GC Roots 标记直接关联对象置为灰色。

<img :src="$withBase('/img/interview/jvm6.png')">

- 并发标记阶段，扫描整个引用链。
   - 没有子节点的话，将本节点变为黑色。
   - 有子节点的话，则当前节点变为黑色，子节点变为灰色。

<img :src="$withBase('/img/interview/jvm7.png')">

- 重复并发标记阶段，直至灰色对象没有其它子节点引用时结束。

<img :src="$withBase('/img/interview/jvm8.png')">
<img :src="$withBase('/img/interview/jvm9.png')">

- 扫描完成此时黑色对象就是存活的对象，白色对象就是已消亡可回收的对象。即（A、D、E、F、G）可达也就是存活对象，（B、C、H）不可达可回收的对象。

**三色标记算法缺陷**
不知道你是否还记得我们前言说的，所有垃圾收集器在根节点枚举这一步骤时都是必须暂停用户线程的，产生STW，这对实时性要求高的系统来说，这种需要长时间挂起用户线程是不可接受的。想要解决或者降低用户线程的停顿的问题，我们才引入了三色标记算法。
三色标记算法也存在缺陷，在并发标记阶段的时候，因为用户线程与 GC 线程同时运行，有可能会产生多标或者漏标。
**多标**
假设已经遍历到 E（变为灰色了），此时应用执行了 objD.fieldE = null (D > E 的引用断开)
<img :src="$withBase('/img/interview/jvm10.png')">
D > E 的引用断开之后，E、F、G 三个对象不可达，应该要被回收的。然而因为 E 已经变为灰色了，其仍会被当作存活对象继续遍历下去。最终的结果是：这部分对象仍会被标记为存活，即本轮 GC 不会回收这部分内存。
这部分本应该回收但是没有回收到的内存，被称之为浮动垃圾。浮动垃圾并不会影响应用程序的正确性，只是需要等到下一轮垃圾回收中才被清除。
另外，针对并发标记开始后的新对象，通常的做法是直接全部当成黑色，本轮不会进行清除。这部分对象期间可能会变为垃圾，这也算是浮动垃圾的一部分。
**漏标**
假设 GC 线程已经遍历到 E（变为灰色了），此时应用线程先执行了：
var G = objE.fieldG; objE.fieldG = null; // 灰色E 断开引用 白色G objD.fieldG = G; // 黑色D 引用 白色G
<img :src="$withBase('/img/interview/jvm11.png')">
此时切回到 GC 线程，因为 E 已经没有对 G 的引用了，所以不会将 G 置为灰色；尽管因为 D 重新引用了 G，但因为 D 已经是黑色了，不会再重新做遍历处理。
最终导致的结果是：G 会一直是白色，最后被当作垃圾进行清除。这直接影响到了应用程序的正确性，是不可接受的。
不难分析，漏标只有同时满足以下两个条件时才会发生：

- 一个或者多个黑色对象重新引用了白色对象；即黑色对象成员变量增加了新的引用。
- 灰色对象断开了白色对象的引用（直接或间接的引用）；即灰色对象原来成员变量的引用发生了变化。

如下代码：
var G = objE.fieldG; // 1.读objE.fieldG = null; // 2.写objD.fieldG = G; // 3.写
我们只需在上面三个步骤中任意一个中，将对象 G 记录起来，然后作为灰色对象再进行遍历即可。比如放到一个特定的集合，等初始的 GC Roots 遍历完（并发标记），该集合的对象遍历即可（重新标记）。
重新标记是需要 STW 的，因为应用程序一直在跑的话，该集合可能会一直增加新的对象，导致永远都跑不完。当然，并发标记期间也可以将该集合中的大部分先跑了，从而缩短重新标记 STW 的时间，这个是优化问题了。看到了没？三色标记算法也并不能完全解决 STW 的问题，只能尽可能缩短 STW 的时间，尽可能达到停顿时间最少。
**读屏障与写屏障**
针对于漏标问题，JVM 团队采用了读屏障与写屏障的方案。
读屏障是拦截第一步；而写屏障用于拦截第二和第三步。
它们拦截的目的很简单：就是在读写前后，将对象 G 给记录下来。
**读屏障**
oop oop_field_load(oop* field) { pre_load_barrier(field); // 读屏障-读取前操作 return *field;}
读屏障是直接针对第一步：var G = objE.fieldG;，当读取成员变量之前，先记录下来。
void pre_load_barrier(oop* field, oop old_value) { if ($gc_phase == GC_CONCURRENT_MARK && !isMarkd(field)) { oopold_value = *field; remark_set.add(old_value); // 记录读取到的对象 }}
这种做法是保守的，但也是安全的。因为条件一中【一个或者多个黑色对象重新引用了白色对象】，重新引用的前提是：得获取到该白色对象，此时已经读屏障就发挥作用了。
**写屏障**
我们再来看下第二、三步的写操作，给某个对象的成员变量赋值时，底层代码：
/*** @param field 某对象的成员变量，如 E.fieldG* @param new_value 新值，如 null*/void oop_field_store(oop* field, oopnew_value) { *field = new_value; // 赋值操作}
所谓的写屏障，其实就是指给某个对象的成员变量赋值操作前后，加入一些处理（类似 Spring AOP 的概念）。
void oop_field_store(oop* field, oop new_value) { pre_write_barrier(field); // 写屏障-写前操作 *field = new_value; post_write_barrier(field, value); // 写屏障-写后操作}

**增量更新（Incremental Update）与原始快照（Snapshot At The Beginning，SATB）**
**4.1 增量更新**
当对象 D 的成员变量的引用发生变化时（objD.fieldG = G;），我们可以利用写屏障，将 D 新的成员变量引用对象 G 记录下来：
void post_write_barrier(oop* field, oop new_value) { if ($gc_phase == GC_CONCURRENT_MARK && !isMarkd(field)) { remark_set.add(new_value); // 记录新引用的对象 }}
这种做法的思路是：不要求保留原始快照，而是针对新增的引用，将其记录下来等待遍历，即增量更新（Incremental Update）。
增量更新破坏了漏标的条件一：【 一个或者多个黑色对象重新引用了白色对象】，从而保证了不会漏标。
**4.2 原始快照**
当对象 E 的成员变量的引用发生变化时（objE.fieldG = null;），我们可以利用写屏障，将 E 原来成员变量的引用对象 G 记录下来：
void pre_write_barrier(oop* field) { oop old_value = *field; // 获取旧值 remark_set.add(old_value); // 记录 原来的引用对象}
当原来成员变量的引用发生变化之前，记录下原来的引用对象。

**总结**
基于可达性分析的 GC 算法，标记过程几乎都借鉴了三色标记的算法思想，尽管实现的方式不尽相同，比如标记的方式有栈、队列、多色指针等。
对于读写屏障，以 Java HotSpot VM 为例，其并发标记时对漏标的处理方案如下：

- CMS：写屏障 + 增量更新
- G1、Shenandoah：写屏障 + 原始快照
- ZGC：读屏障

上面的的方案为啥是这样的，你有想过为什么吗？

- 原始快照相对增量更新来说效率更高（当然原始快照可能造成更多的浮动垃圾），因为不需要在重新标记阶段再次深度扫描被删除引用对象。
- 而 CMS 对增量引用的根对象会做深度扫描，G1 因为很多对象都位于不同的 region，CMS 就一块老年代区域，重新深度扫描对象的话 G1 的代价会比 CMS 高，所以 G1 选择原始快照不深度扫描对象，只是简单标记，等到下一轮 GC 再深度扫描。
- 而 ZGC 有一个标志性的设计是它采用的染色指针技术，染色指针可以大幅减少在垃圾收集过程中内存屏障的使用数量，设置内存屏障，尤其是写屏障的目的通常是为了记录对象引用的变动情况，如果讲这些信息直接维护在指针中，显然可以省去一些专门的记录操作。而 ZGC 没有使用写屏障，只使用了读屏障，显然对性能大有裨益的。
