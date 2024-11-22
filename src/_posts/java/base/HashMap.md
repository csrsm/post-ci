---
category: csrsm
title: HashMap
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
date: 2020-11-23
---

## 概述

HashMap基于Map接口实现，元素以键值对的方式存储，并且允许使用null作为键和值，key不允许重复。不能保证放入元素的顺序，是无序的，并且HashMap是**线程不安全**的。

## 继承关系

```java
public class HashMap<K,V>extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable
```

## 基本属性

```java
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; //默认初始化大小 16 
static final float DEFAULT_LOAD_FACTOR = 0.75f;     //负载因子0.75
static final Entry<?,?>[] EMPTY_TABLE = {};         //初始化的默认数组
transient int size;     //HashMap中元素的数量
int threshold;          //判断是否需要调整HashMap的容量 capacity*loadFactor
```

⚠️HashMap的扩容操作是一项很耗时的任务，如果能估算出Map的容量，最好设置一个默认初始值避免多次扩容。在多线程环境中，推荐使用ConcurrentHashMap。



## **HashMap与HashTable：**

#### ***1.线程安全***

HashTable是线程安全的，其实现的方法中都添加了synchronized关键字来确保线程同步，因此相对而言，HashMap性能会更高一些，在多线程环境下若使用HashMap需要使用Collections.synchronizedMap()方法来获取一个线程安全的集合。

#### ***2.针对null的不同***

HashTable不允许使用null作为key，同时也不推荐HashMap使用null作为key，不好排查问题。⚠️HashMap以null作为key时，总是存储在table数组的第一个节点上。

#### ***3.继承结构***

HashMap实现了Map接口，HashTable实现了Map接口和Dictionary抽象类。

#### ***4.初始容量和扩容***

- HashMap的初始容量为16，Hashtable初始容量为11，两者的填充因子默认都是0.75。
- HashMap扩容时是当前容量翻倍即:capacity2，Hashtable扩容时是容量翻倍+1即:capacity2+1。

#### ***5.两者计算hash的方法不同***

Hashtable计算hash是直接使用key的hashcode对table数组的长度直接进行取模

```java
int hash = key.hashCode();
int index = (hash & 0x7FFFFFFF) % tab.length;
```

HashMap计算hash对key的hashcode进行了二次hash，以获得更好的散列值，然后对table数组长度取模

```java
int hash = hash(key.hashCode());
int i = indexFor(hash, table.length);

static int hash(int h) {
        // This function ensures that hashCodes that differ only by
        // constant multiples at each bit position have a bounded
        // number of collisions (approximately 8 at default load factor).
        h ^= (h >>> 20) ^ (h >>> 12);
        return h ^ (h >>> 7) ^ (h >>> 4);
    }
 
 static int indexFor(int h, int length) {
        return h & (length-1)
```



## HashMap的数据存储结构

#### ***HashMap是有数组以及链表来实现的***

HashMap采用Entry数组来存储key-value，每一个键值对组成了一个Entry实体，Entry类实际上是一个单向的链表结构，具有next指针，可以连接下一个Entry实体，以此来解决Hash冲突问题。

- 数组存储区间是连续的，占用内存严重，故空间复杂的很大。但数组的二分查找时间复杂度小，为O(1)；数组的特点是：寻址容易，插入和删除困难；
- 链表存储区间离散，占用内存比较宽松，故空间复杂度很小，但时间复杂度很大，达O（N）。链表的特点是：寻址困难，插入和删除容易。

HashMap里面用到链式数据结构的一个概念。上面我们提到过Entry类里面有一个next属性，作用是指向下一个Entry。打个比方， 第一个键值对A进来，通过计算其key的hash得到的index=0，记做:Entry[0] = A。一会后又进来一个键值对B，通过计算其index也等于0，现在怎么办？HashMap会这样做:*B.next = A*,Entry[0] = B,如果又进来C,index也等于0,那么*C.next = B*,Entry[0] = C；这样我们发现index=0的地方其实存取了A,B,C三个键值对,他们通过next这个属性链接在一起。所以疑问不用担心。也就是说数组中存储的是最后插入的元素。到这里为止，HashMap的大致实现，我们应该已经清楚了。

#### ***重要方法***

1. ### 构造方法

   ```java
   HashMap()    //无参构造方法
   HashMap(int initialCapacity)  //指定初始容量的构造方法 
   HashMap(int initialCapacity, float loadFactor) //指定初始容量和负载因子
   HashMap(Map<? extends K,? extends V> m) 
     //前三个方法都没有进行数组的初始化操作，即使调用了构造方法此时存放HaspMap中数组元素的table表长度依旧为0 。在第四个构造方法中调用了inflateTable()方法完成了table的初始化操作，并将m中的元素添加到HashMap中
     //当指定初始容量时，会默认为大于等于指定值当2的n次方的值，即指定28时，容量为32
   ```

   

2. ### 添加方法

   ```java
   public V put(K key, V value) {
           if (table == EMPTY_TABLE) { //是否初始化
               inflateTable(threshold);
           }
           if (key == null) //放置在0号位置
               return putForNullKey(value);
           int hash = hash(key); //计算hash值
           int i = indexFor(hash, table.length);  //计算在Entry[]中的存储位置
           for (Entry<K,V> e = table[i]; e != null; e = e.next) {
               Object k;
               if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
                   V oldValue = e.value;
                   e.value = value;
                   e.recordAccess(this);
                   return oldValue;
               }
           }
    
           modCount++;
           addEntry(hash, key, value, i); //添加到Map中
           return null;
   }
   ```

   在该方法中，添加键值对时，首先进行table是否初始化的判断，如果没有进行初始化（分配空间，Entry[]数组的长度）。然后进行key是否为null的判断，如果key==null ,放置在Entry[]的0号位置。计算在Entry[]数组的存储位置，判断该位置上是否已有元素，如果已经有元素存在，则遍历该Entry[]数组位置上的单链表。判断key是否存在，如果key已经存在，则用新的value值，替换点旧的value值，并将旧的value值返回（只替换value，不替换key）。如果key不存在于HashMap中，程序继续向下执行。将key-vlaue, 生成Entry实体，添加到HashMap中的Entry[]数组中。

3. ### addEntry()

   ```java
   void addEntry(int hash, K key, V value, int bucketIndex) {
        if ((size >= threshold) && (null != table[bucketIndex])) {
            resize(2 * table.length); //扩容操作，将数据元素重新计算位置后放入newTable中，链表的顺序与之前的顺序相反
            hash = (null != key) ? hash(key) : 0;
            bucketIndex = indexFor(hash, table.length);
        }
    
       createEntry(hash, key, value, bucketIndex);
   }
   void createEntry(int hash, K key, V value, int bucketIndex) {
       Entry<K,V> e = table[bucketIndex];
       table[bucketIndex] = new Entry<>(hash, key, value, e);
       size++;
   }
   ```

   添加到方法的具体操作，在添加之前先进行容量的判断，如果当前容量达到了阈值，并且需要存储到Entry[]数组中，先进性扩容操作，空充的容量为table长度的2倍。重新计算hash值，和数组存储的位置，扩容后的链表顺序与扩容前的链表顺序相反。然后将新添加的Entry实体存放到当前Entry[]位置链表的头部。**在1.8之前，新插入的元素都是放在了链表的头部位置，但是这种操作在高并发的环境下容易导致死锁，所以1.8之后，新插入的元素都放在了链表的尾部。**

4. ### 获取方法：get

   ```java
   public V get(Object key) {
        if (key == null)
            //返回table[0] 的value值
            return getForNullKey();
        Entry<K,V> entry = getEntry(key);
    
        return null == entry ? null : entry.getValue();
   }
   final Entry<K,V> getEntry(Object key) {
        if (size == 0) {
            return null;
        }
    
        int hash = (key == null) ? 0 : hash(key);
        for (Entry<K,V> e = table[indexFor(hash, table.length)];
            e != null;
            e = e.next) {
            Object k;
            if (e.hash == hash &&
                ((k = e.key) == key || (key != null && key.equals(k))))
               return e;
         }
        return null;
   }
   ```

   在get方法中，首先计算hash值，然后调用indexFor()方法得到该key在table中的存储位置，得到该位置的单链表，遍历列表找到key和指定key内容相等的Entry，返回entry.value值。

5. ### 删除方法

   ```java
   public V remove(Object key) {
        Entry<K,V> e = removeEntryForKey(key);
        return (e == null ? null : e.value);
   }
   final Entry<K,V> removeEntryForKey(Object key) {
        if (size == 0) {
            return null;
        }
        int hash = (key == null) ? 0 : hash(key);
        int i = indexFor(hash, table.length);
        Entry<K,V> prev = table[i];
        Entry<K,V> e = prev;
    
        while (e != null) {
            Entry<K,V> next = e.next;
            Object k;
            if (e.hash == hash &&
                ((k = e.key) == key || (key != null && key.equals(k)))) {
                modCount++;
                size--;
                if (prev == e)
                    table[i] = next;
                else
                    prev.next = next;
                e.recordRemoval(this);
                return e;
            }
            prev = e;
            e = next;
       }
       return e;
   }
   ```

   删除操作，先计算指定key的hash值，然后计算出table中的存储位置，判断当前位置是否Entry实体存在，如果没有直接返回，若当前位置有Entry实体存在，则开始遍历列表。定义了三个Entry引用，分别为pre, e ,next。 在循环遍历的过程中，首先判断pre 和 e 是否相等，若相等表明，table的当前位置只有一个元素，直接将table[i] = next = null 。若形成了pre -> e -> next 的连接关系，判断e的key是否和指定的key 相等，若相等则让pre -> next ,e 失去引用。

6. ### containsKey

   ```java
   public boolean containsKey(Object key) {
           return getEntry(key) != null;
       }
   final Entry<K,V> getEntry(Object key) {
           int hash = (key == null) ? 0 : hash(key.hashCode());
           for (Entry<K,V> e = table[indexFor(hash, table.length)];
                e != null;
                e = e.next) {
               Object k;
               if (e.hash == hash &&
                   ((k = e.key) == key || (key != null && key.equals(k))))
                   return e;
           }
           return null;
       }
   ```

   containsKey方法是先计算hash然后使用hash和table.length取摸得到index值，遍历table[index]元素查找是否包含key相同的值。

7. ### containsValue

   ```java
   public boolean containsValue(Object value) {
       if (value == null)
               return containsNullValue();
    
       Entry[] tab = table;
           for (int i = 0; i < tab.length ; i++)
               for (Entry e = tab[i] ; e != null ; e = e.next)
                   if (value.equals(e.value))
                       return true;
       return false;
   }
   ```

   containsValue方法就比较粗暴了，就是直接遍历所有元素直到找到value，由此可见HashMap的containsValue方法本质上和普通数组和list的contains方法没什么区别，你别指望它会像containsKey那么高效。



## JDK 1.8的 改变

#### ***HashMap采用数组+链表+红黑树实现。***

在Jdk1.8中HashMap的实现方式做了一些改变，但是基本思想还是没有变得，只是在一些地方做了优化，下面来看一下这些改变的地方,数据结构的存储由数组+链表的方式，变化为数组+链表+红黑树的存储方式，当链表长度超过阈值（8）且当主数组的长度大于64时，将链表转换为红黑树。在性能上进一步得到提升。

put方法简单解析：

```java
public V put(K key, V value) {
    //调用putVal()方法完成
    return putVal(hash(key), key, value, false, true);
}
 
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    //判断table是否初始化，否则初始化操作
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    //计算存储的数组索引位置，如果没有元素，直接赋值
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        //节点若已经存在，执行赋值操作
        if (p.hash == hash &&
            // 建议key使用String类型，直接比较地址，地址相等就不会走equals方法
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        //判断链表是否是红黑树
        else if (p instanceof TreeNode)
            //红黑树对象操作
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            //为链表，
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    //链表长度8，将链表转化为红黑树存储
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                //key存在，直接覆盖
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    //记录修改次数
    ++modCount;
    //判断是否需要扩容
    if (++size > threshold)
        resize();
    //空操作
    afterNodeInsertion(evict);
    return null;
}

// 树化
 final void treeifyBin(Node<K,V>[] tab, int hash) {
        int n, index; Node<K,V> e;
   			// 如果数组长度小于64，则只是进行扩容操作，不会进行树化操作
        if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
            resize();
        else if ((e = tab[index = (n - 1) & hash]) != null) {
            TreeNode<K,V> hd = null, tl = null;
            do {
                TreeNode<K,V> p = replacementTreeNode(e, null);
                if (tl == null)
                    hd = p;
                else {
                  // 单向链表变成双向链表，树化做准备，红黑树是双向链表
                    p.prev = tl;
                    tl.next = p;
                }
                tl = p;
            } while ((e = e.next) != null);
            if ((tab[index] = hd) != null)
              // 树化的方法
                hd.treeify(tab);
        }
    }
```

## 面试题：

### 1.负载因子为什么默认是0.75

- 如果负载因子为1时，数组的空间利用率高，很容易碰撞，更容易产生链表，查询效率会降低
- 如果负载因子为0.5，则产生哈希碰撞的概率低，查询效率高，但是空间利用率低

所以取中间值，较为合理。

### 2.主数组的长度为什么必须是2的n次方

- 在使用哈希码计算数组位置时，源码中使用的是 h & (length -1)取余，这种方法比 h%(length -1)效率更高，而使用这种方式取余的前提是，length必须是2的n次方
- 避免哈希冲突，位置冲突。(n -1)&hash，当n不是2的n次方时，容易产生哈希冲突。

