---
category: csrsm
title: Java容器集合
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
  - java
  - base
date: 2022-5-2
---

# Java容器集合-Collection

## 1、算法与数据结构

- 算法：解决问题的流程

- 数据结构：计算机存储、组织数据的方式。

  - 逻辑结构：线性表（数组、链表）、图、树、栈、队列等

  - 物理结构：

    - 紧密结构（顺序结构，元素地址紧密相邻）

      优点：

      - 寻址快，意味着查找元素快

      缺点：

      - 删除和增加元素效率低

    - 跳转结构（链式结构，当前元素会保存上一个、下一个元素的地址信息）

      优点：

      - 删除和插入元素效率高

      缺点：

      - 查询元素效率低

以线性表为例：

- 相同的数据类型
- 序列（顺序性）
- 有限

> 线性表逻辑结构，对应真实结构如果是紧密结构，则对应的就是数组
>
> 线性表逻辑结构，对应真实结构如果是跳转结构，则对应的就是链表

## 2、List集合

### 1.ArrayList

底层Object数组，int类型属性数组长度，**线程不安全**，效率高

- jdk1.7：底层是Object类型的数组，在调用构造器的时候，数组长度初始化10，扩容时为原数组的1.5倍
- jdk1.8：底层是Objcet类型的数组，在调用构造器的时候，底层数组为空，在调用add方法后，才能重新赋值新数组，数组长度为10，节省了内存，扩容时为原数组的1.5倍

### 2.Vector

底层Object数组，int类型属性数组长度，在调用构造器的时候，数组长度初始化10，扩容时为原数组的2倍，add方法使用synchronized关键字修饰，**线程安全**，效率低。

##### Stack

是Vector的子类，底层是Object数组。

栈：后进先出（LIFO - last in first out）

### 3、泛型

- 泛型类可以定义多个参数类型
- 泛型类的构造器中不能指定泛型
- 不同的泛型的引用类型不能相互赋值
- 泛型如果不指定，则会被擦除，泛型对应的类型是Object类型
- 泛型类中的静态方法，不能使用类泛型
- 不能直接使用泛型数组的创建

### 4.LinkedList

jdk1.7和1.8实现是一样的，底层是双向链表

#### 1.transient关键字

transient特点：

- 一旦变量被transient修饰，变量将不再是对象持久化的一部分，该变量内容在序列化后无法被访问。
- transient关键字只能修饰变量，而不能修饰方法和类。注意，本地变量是不能被transient关键字修饰的。变量如果是用户自定义类变量，则该类需要实现Serializable接口。
- 一个静态变量不管是否被transient修饰，均不能被序列化(如果反序列化后类中static变量还有值，则值为当前JVM中对应static变量的值)。序列化保存的是对象状态，静态变量保存的是类状态，因此序列化并不保存静态变量。

transient使用场景：

- 类中的字段值可以根据其它字段推导出来，如一个长方形类有三个属性长度、宽度、面积，面积不需要序列化。
- 一些安全性的信息，一般情况下是不能离开JVM的
- 如果类中使用了Logger实例，那么Logger实例也是不需要序列化的

> Java中的transient关键字，transient是短暂的意思。对于transient 修饰的成员变量，在类的实例对象的序列化处理过程中会被忽略。 因此，transient变量不会贯穿对象的序列化和反序列化，生命周期仅存于调用者的内存中而不会写到磁盘里进行持久化。 
>
> 在持久化对象时，对于一些特殊的数据成员（如用户的密码，银行卡号等），我们不想用序列化机制来保存它。为了在一个特定对象的一个成员变量上关闭序列化，可以在这个成员变量前加上关键字transient。
>
>  transient是Java语言的关键字，用来表示一个成员变量不是该对象序列化的一部分。当一个对象被序列化的时候，transient型变量的值不包括在序列化的结果中。而非transient型的变量是被包括进去的。 注意static修饰的静态变量天然就是不可序列化的。

#### 2.迭代

iterator()、Iterator、Iterable区别

Iterable是Collection接口继承的一个接口，iterator()方法是Iterable接口中的一个抽象方法，而抽象方法需要在具体的实现类中得到实现，iterator()方法的返回值为Iterator接口，Iterator接口中包含两个经典方法，hasNext()和next()。**增强for循环的底层也是通过迭代器实现的**

在迭代时，同时对list进行操作，则会报并发修改的错，这是需要使用ListIterator对象来替代Iterator，对list迭代和操作都通过该对象来实现。

## 3、Set集合

### 1.HashSet

底层原理：数组+链表=哈希表

注意 放入HashSet中的数据，一定要重写两个方法：hashCode()和equals()

hashCode()用于计算位置、equals()用于比较元素是否相等

底层是HashMap，将每一个元素放到HashMap的key中。

### 2.LinkedHashSet

其实就是在HashSet的基础上，多了一个总的链表，这个总链表将放入的元素串在一起，方便有序的遍历

### 3.TreeSet

底层是二叉树（逻辑结构，红黑树），物理结构是跳转结构

特点：唯一，无序（没有按照输入顺序进行输出），有序（按照升序进行遍历）

放入TreeSet中的元素，会根据实现的比较器进行升序排序，如果TreeSet的泛型类（自定义类）没有实现内部比较器，或者没有创建TreeSet时没有通过构造方法指定外部比较器，则会在添加元素时报错。

> 创建TreeSet时可以在构造器中传入一个外部比较器对象，可以是声明的匿名内部类，也可以是实现Comparator接口的类

二叉树的遍历：

- 中序遍历：左=>根=>右  当前二叉树用的遍历方式
- 先序遍历：根=>左=>右
- 后序遍历：左=>右=>根

所以TreeSet底层二叉树的遍历结果是升序的，这个升序是靠中序遍历的方式得到的。

底层是TreeMap，将每一个元素放到TreeMap的key中。

## 4.比较器

### 1.Java对象内比较（内部比较器） 

实现Comparable接口，重写compareTo方法

### 2.Java对象外比较（外部比较器）

实现Comparator接口，泛型为Java对象类型，重写compare方法

推荐使用对象外比较方法，可以使用多态特性

<img :src="$withBase('/img/java/集合.jpg')" alt="单架构">

## Collections工具类

常用方法

- addAll
- binarySearch
- sort
- copy
- synchronizedList
- ......

# Java容器集合-Map

## 1.常用方法

- 新增：put(k, v)
- 删除：clear()、 remove(key)
- 查看：entrySet()、get(key)、keySet()、size()、values()
- 判断：containsKey(key)、containsValue(v)、 equals()、 isEmpty()

## 2.HashMap（详细见HashMap笔记）

JDK1.2版本

特点：无序、唯一，按照key进行总结的，因为底层的key遵照哈希表结构（数组+链表）

哈希表：放入这个集合中的数据对应的类，必须重写hashCode()和equals()方法

> HashMap与HashTable对于null值的区别：
>
> HashMap key可以存入null值，只能存入一个key为null的值，遵循唯一的特点
>
> HashTable key不可以存入null值

## 3.LinkedHashMap

底层：哈希表+链表

特点：唯一、有序（按照输入顺序进行输出）

## 4.HashTable

JDK1.0版本

与HashMap基本相同，但是操作集合的方法加了synchronized关键字保证线程安全。

## 5.TreeMap

特点：唯一、有序（按照升序或者降序）

原理：二叉树（红黑树），key遵照二叉树的特点，放入集合的key的数据对应的类型内部一定要实现比较器（内部比较器和外部比较器二选一）

# 同步类容器

## 1.Collections.synchronizedList(List/Map)

在原有容器上加synchronized关键字，保证其线程安全。

## 2.ConcurrentHashMap

对比：

- ConcurrentHashMap：性能高，线程安全
- HashTable：性能低，线程安全
- HashMap：性能高，线程不安全
- Collections.synchronizedList(HashMap)：性能低，线程安全

## 3.COW-Copy On Write

读写分离容器：向容器中添加元素时，先将容器进行copy复制出一个新的容器，再将元素添加到新容器中，再将原容器的引用指向新容器中，并发读的时候不需要锁定容器，因为原容器没有变化，所以可以读取原容器中的值，使用的是一种读写分离的思想。

### 好处

数组无锁，读写分离，读数据时读原有的数组，提高了并发性能

### 注意

COW容器只能保证数据的最终一致性，不能保证数据实时一致性。

### 特定场景

适合读多写少的情况，每次更新操作都会复制新容器，所以如果数据量较大并且更新操作频繁则对内存消耗很高，建议在搞并发读的场景下使用。

### CopyOnWriteArrayList和CopyOnWriteArraySet

CopyOnWriteArrayList add方法和addIfAbsent方法加锁，addIfAbsent会遍历当前集合，降低效率。

CopyOnWriteArraySet add方法基于addIfAbsent实现，效率低。

# 队列-Queue

## 阻塞队列-BlockingQueue

BlockingQueue继承自Queue，Queue继承自Collection，所以Collection最基础的增删改查操作是有的，多了Queue的特点先进先出，在这个基础上又多了BlockingQueue的特点，不允许添加null。

### 常用方法：

- add：向指定队列中添加元素，成功返回true，如果没有可用空间，则抛出IllegalStateException
- offer：向指定队列中添加元素，成功返回true，如果没有可用空间，返回false
- put：向指定队列中添加元素，如果没有可用空间，将等待可用空间，阻塞方法
- take：获取并移除此队列的头部，在元素变得可用之前一直等待，阻塞方法，如果队列为空，则一直阻塞等待
- poll：获取并移除此队列的头部，在指定的等待时间前等待可用的元素，阻塞方法，如果队列为空，则返回null

### ArrayBlockingQueue

​		底层基于数组，有边界的队列（需指定长度），FIFO（first-in-first-out）添加元素时放到队列头部，取元素时，从尾部取。

- 添加元素同BlockingQueue常用方法，不可以添加null元素，会报错空指针异常
- peek：查询头部元素但是不会移除元素，如果队列为空，则返回null
- 添加/获取方法都依赖于入队和出队方法
- 不支持读写同时操作，源码中添加/获取阻塞时使用同一个ReentrantLock，所以不支持读写同时操作

### LinkedBlockingQueue

​		支持读写同时操作，并发情况下，效率高，底层基于链表，可选择的有边界的队列（可指定长度，可不指定长度，不指定长度时是一个无界队列，此处的无界不是真正意义的无界，是Integer的最大值Integer.MAX_VALUE 21亿左右），FIFO（first-in-first-out）

- 阻塞的前提是队列有界
- 不可以添加null元素，会报错空指针异常

### SynchronousQueue

没有长度，必须有一个线程阻塞获取数据，才能放入数据

- add添加数据时，如果先放数据则会抛异常IllegalStateException：Queue Full
- put添加数据时，由于队列没有长度，则会阻塞
- 取出元素不能用peek，peek支持查看方法

优点：

- 方便高效的进行线程间数据的传送，效率极高，不会产生队列中数据争抢的问题
- 数据没有经过队列直接被消费线程取走，数据可以准确的传送，队列就是一个标记，性能很高

### PriorityBlockingQueue

​		带有优先级的阻塞队列，即队列有先后顺序，数据有不同的权重，所以不允许放入不可比较的对象（会抛出ClassCastException），对象必须实现内部比较器或者外部比较器不可以放入null。

​		无界的队列，没有长度限制，不指定长度时，默认初始长度为11，也可以手动指定，而随着数据的不断增加，底层（Object数组）会自动扩容，直到内存全部消耗殆尽 ，导致OOM内存溢出才会结束。

### DelayQueue

​		是一个无界的BlockingQueue，用于放置**实现了Delayed接口**的对象，其中的对象只能在其到期时才能从队列中取走。

​		当生产线程调用put之类的方法加入元素时，会触发Delayed接口中的CompareTo方法进行排序，也就是说队列中元素的顺序是按到期时间排序的，而非它们进入队列的顺序，排在队列头部的元素是最早期的，越往后到期时间越晚。

​		当消费线程查看队列头部的元素，注意是查看不是取出。然后调用getDelay方法，如果此方法返回的值小于0或者等于0，则消费线程会从队列中取出元素，并进行处理，如果返回值大于0，则消费线程wait返回的时间值后，在从头部取出元素，此时元素到期。

​		放入队列的元素必须重写Delayed接口中的getDelay方法和Comparable接口中compareTo方法

### Deque

双端队列，