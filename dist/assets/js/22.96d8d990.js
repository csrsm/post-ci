(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{496:function(a,t,e){"use strict";e.r(t);var _=e(5),v=Object(_.a)({},(function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h1",{attrs:{id:"java容器集合-collection"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#java容器集合-collection"}},[a._v("#")]),a._v(" Java容器集合-Collection")]),a._v(" "),e("h2",{attrs:{id:"_1、算法与数据结构"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1、算法与数据结构"}},[a._v("#")]),a._v(" 1、算法与数据结构")]),a._v(" "),e("ul",[e("li",[e("p",[a._v("算法：解决问题的流程")])]),a._v(" "),e("li",[e("p",[a._v("数据结构：计算机存储、组织数据的方式。")]),a._v(" "),e("ul",[e("li",[e("p",[a._v("逻辑结构：线性表（数组、链表）、图、树、栈、队列等")])]),a._v(" "),e("li",[e("p",[a._v("物理结构：")]),a._v(" "),e("ul",[e("li",[e("p",[a._v("紧密结构（顺序结构，元素地址紧密相邻）")]),a._v(" "),e("p",[a._v("优点：")]),a._v(" "),e("ul",[e("li",[a._v("寻址快，意味着查找元素快")])]),a._v(" "),e("p",[a._v("缺点：")]),a._v(" "),e("ul",[e("li",[a._v("删除和增加元素效率低")])])]),a._v(" "),e("li",[e("p",[a._v("跳转结构（链式结构，当前元素会保存上一个、下一个元素的地址信息）")]),a._v(" "),e("p",[a._v("优点：")]),a._v(" "),e("ul",[e("li",[a._v("删除和插入元素效率高")])]),a._v(" "),e("p",[a._v("缺点：")]),a._v(" "),e("ul",[e("li",[a._v("查询元素效率低")])])])])])])])]),a._v(" "),e("p",[a._v("以线性表为例：")]),a._v(" "),e("ul",[e("li",[a._v("相同的数据类型")]),a._v(" "),e("li",[a._v("序列（顺序性）")]),a._v(" "),e("li",[a._v("有限")])]),a._v(" "),e("blockquote",[e("p",[a._v("线性表逻辑结构，对应真实结构如果是紧密结构，则对应的就是数组")]),a._v(" "),e("p",[a._v("线性表逻辑结构，对应真实结构如果是跳转结构，则对应的就是链表")])]),a._v(" "),e("h2",{attrs:{id:"_2、list集合"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2、list集合"}},[a._v("#")]),a._v(" 2、List集合")]),a._v(" "),e("h3",{attrs:{id:"_1-arraylist"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-arraylist"}},[a._v("#")]),a._v(" 1.ArrayList")]),a._v(" "),e("p",[a._v("底层Object数组，int类型属性数组长度，"),e("strong",[a._v("线程不安全")]),a._v("，效率高")]),a._v(" "),e("ul",[e("li",[a._v("jdk1.7：底层是Object类型的数组，在调用构造器的时候，数组长度初始化10，扩容时为原数组的1.5倍")]),a._v(" "),e("li",[a._v("jdk1.8：底层是Objcet类型的数组，在调用构造器的时候，底层数组为空，在调用add方法后，才能重新赋值新数组，数组长度为10，节省了内存，扩容时为原数组的1.5倍")])]),a._v(" "),e("h3",{attrs:{id:"_2-vector"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-vector"}},[a._v("#")]),a._v(" 2.Vector")]),a._v(" "),e("p",[a._v("底层Object数组，int类型属性数组长度，在调用构造器的时候，数组长度初始化10，扩容时为原数组的2倍，add方法使用synchronized关键字修饰，"),e("strong",[a._v("线程安全")]),a._v("，效率低。")]),a._v(" "),e("h5",{attrs:{id:"stack"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#stack"}},[a._v("#")]),a._v(" Stack")]),a._v(" "),e("p",[a._v("是Vector的子类，底层是Object数组。")]),a._v(" "),e("p",[a._v("栈：后进先出（LIFO - last in first out）")]),a._v(" "),e("h3",{attrs:{id:"_3、泛型"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3、泛型"}},[a._v("#")]),a._v(" 3、泛型")]),a._v(" "),e("ul",[e("li",[a._v("泛型类可以定义多个参数类型")]),a._v(" "),e("li",[a._v("泛型类的构造器中不能指定泛型")]),a._v(" "),e("li",[a._v("不同的泛型的引用类型不能相互赋值")]),a._v(" "),e("li",[a._v("泛型如果不指定，则会被擦除，泛型对应的类型是Object类型")]),a._v(" "),e("li",[a._v("泛型类中的静态方法，不能使用类泛型")]),a._v(" "),e("li",[a._v("不能直接使用泛型数组的创建")])]),a._v(" "),e("h3",{attrs:{id:"_4-linkedlist"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-linkedlist"}},[a._v("#")]),a._v(" 4.LinkedList")]),a._v(" "),e("p",[a._v("jdk1.7和1.8实现是一样的，底层是双向链表")]),a._v(" "),e("h4",{attrs:{id:"_1-transient关键字"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-transient关键字"}},[a._v("#")]),a._v(" 1.transient关键字")]),a._v(" "),e("p",[a._v("transient特点：")]),a._v(" "),e("ul",[e("li",[a._v("一旦变量被transient修饰，变量将不再是对象持久化的一部分，该变量内容在序列化后无法被访问。")]),a._v(" "),e("li",[a._v("transient关键字只能修饰变量，而不能修饰方法和类。注意，本地变量是不能被transient关键字修饰的。变量如果是用户自定义类变量，则该类需要实现Serializable接口。")]),a._v(" "),e("li",[a._v("一个静态变量不管是否被transient修饰，均不能被序列化(如果反序列化后类中static变量还有值，则值为当前JVM中对应static变量的值)。序列化保存的是对象状态，静态变量保存的是类状态，因此序列化并不保存静态变量。")])]),a._v(" "),e("p",[a._v("transient使用场景：")]),a._v(" "),e("ul",[e("li",[a._v("类中的字段值可以根据其它字段推导出来，如一个长方形类有三个属性长度、宽度、面积，面积不需要序列化。")]),a._v(" "),e("li",[a._v("一些安全性的信息，一般情况下是不能离开JVM的")]),a._v(" "),e("li",[a._v("如果类中使用了Logger实例，那么Logger实例也是不需要序列化的")])]),a._v(" "),e("blockquote",[e("p",[a._v("Java中的transient关键字，transient是短暂的意思。对于transient 修饰的成员变量，在类的实例对象的序列化处理过程中会被忽略。 因此，transient变量不会贯穿对象的序列化和反序列化，生命周期仅存于调用者的内存中而不会写到磁盘里进行持久化。")]),a._v(" "),e("p",[a._v("在持久化对象时，对于一些特殊的数据成员（如用户的密码，银行卡号等），我们不想用序列化机制来保存它。为了在一个特定对象的一个成员变量上关闭序列化，可以在这个成员变量前加上关键字transient。")]),a._v(" "),e("p",[a._v("transient是Java语言的关键字，用来表示一个成员变量不是该对象序列化的一部分。当一个对象被序列化的时候，transient型变量的值不包括在序列化的结果中。而非transient型的变量是被包括进去的。 注意static修饰的静态变量天然就是不可序列化的。")])]),a._v(" "),e("h4",{attrs:{id:"_2-迭代"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-迭代"}},[a._v("#")]),a._v(" 2.迭代")]),a._v(" "),e("p",[a._v("iterator()、Iterator、Iterable区别")]),a._v(" "),e("p",[a._v("Iterable是Collection接口继承的一个接口，iterator()方法是Iterable接口中的一个抽象方法，而抽象方法需要在具体的实现类中得到实现，iterator()方法的返回值为Iterator接口，Iterator接口中包含两个经典方法，hasNext()和next()。"),e("strong",[a._v("增强for循环的底层也是通过迭代器实现的")])]),a._v(" "),e("p",[a._v("在迭代时，同时对list进行操作，则会报并发修改的错，这是需要使用ListIterator对象来替代Iterator，对list迭代和操作都通过该对象来实现。")]),a._v(" "),e("h2",{attrs:{id:"_3、set集合"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3、set集合"}},[a._v("#")]),a._v(" 3、Set集合")]),a._v(" "),e("h3",{attrs:{id:"_1-hashset"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-hashset"}},[a._v("#")]),a._v(" 1.HashSet")]),a._v(" "),e("p",[a._v("底层原理：数组+链表=哈希表")]),a._v(" "),e("p",[a._v("注意 放入HashSet中的数据，一定要重写两个方法：hashCode()和equals()")]),a._v(" "),e("p",[a._v("hashCode()用于计算位置、equals()用于比较元素是否相等")]),a._v(" "),e("p",[a._v("底层是HashMap，将每一个元素放到HashMap的key中。")]),a._v(" "),e("h3",{attrs:{id:"_2-linkedhashset"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-linkedhashset"}},[a._v("#")]),a._v(" 2.LinkedHashSet")]),a._v(" "),e("p",[a._v("其实就是在HashSet的基础上，多了一个总的链表，这个总链表将放入的元素串在一起，方便有序的遍历")]),a._v(" "),e("h3",{attrs:{id:"_3-treeset"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-treeset"}},[a._v("#")]),a._v(" 3.TreeSet")]),a._v(" "),e("p",[a._v("底层是二叉树（逻辑结构，红黑树），物理结构是跳转结构")]),a._v(" "),e("p",[a._v("特点：唯一，无序（没有按照输入顺序进行输出），有序（按照升序进行遍历）")]),a._v(" "),e("p",[a._v("放入TreeSet中的元素，会根据实现的比较器进行升序排序，如果TreeSet的泛型类（自定义类）没有实现内部比较器，或者没有创建TreeSet时没有通过构造方法指定外部比较器，则会在添加元素时报错。")]),a._v(" "),e("blockquote",[e("p",[a._v("创建TreeSet时可以在构造器中传入一个外部比较器对象，可以是声明的匿名内部类，也可以是实现Comparator接口的类")])]),a._v(" "),e("p",[a._v("二叉树的遍历：")]),a._v(" "),e("ul",[e("li",[a._v("中序遍历：左=>根=>右  当前二叉树用的遍历方式")]),a._v(" "),e("li",[a._v("先序遍历：根=>左=>右")]),a._v(" "),e("li",[a._v("后序遍历：左=>右=>根")])]),a._v(" "),e("p",[a._v("所以TreeSet底层二叉树的遍历结果是升序的，这个升序是靠中序遍历的方式得到的。")]),a._v(" "),e("p",[a._v("底层是TreeMap，将每一个元素放到TreeMap的key中。")]),a._v(" "),e("h2",{attrs:{id:"_4-比较器"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-比较器"}},[a._v("#")]),a._v(" 4.比较器")]),a._v(" "),e("h3",{attrs:{id:"_1-java对象内比较-内部比较器"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-java对象内比较-内部比较器"}},[a._v("#")]),a._v(" 1.Java对象内比较（内部比较器）")]),a._v(" "),e("p",[a._v("实现Comparable接口，重写compareTo方法")]),a._v(" "),e("h3",{attrs:{id:"_2-java对象外比较-外部比较器"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-java对象外比较-外部比较器"}},[a._v("#")]),a._v(" 2.Java对象外比较（外部比较器）")]),a._v(" "),e("p",[a._v("实现Comparator接口，泛型为Java对象类型，重写compare方法")]),a._v(" "),e("p",[a._v("推荐使用对象外比较方法，可以使用多态特性")]),a._v(" "),e("img",{attrs:{src:a.$withBase("/img/java/集合.jpg"),alt:"单架构"}}),a._v(" "),e("h2",{attrs:{id:"collections工具类"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#collections工具类"}},[a._v("#")]),a._v(" Collections工具类")]),a._v(" "),e("p",[a._v("常用方法")]),a._v(" "),e("ul",[e("li",[a._v("addAll")]),a._v(" "),e("li",[a._v("binarySearch")]),a._v(" "),e("li",[a._v("sort")]),a._v(" "),e("li",[a._v("copy")]),a._v(" "),e("li",[a._v("synchronizedList")]),a._v(" "),e("li",[a._v("......")])]),a._v(" "),e("h1",{attrs:{id:"java容器集合-map"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#java容器集合-map"}},[a._v("#")]),a._v(" Java容器集合-Map")]),a._v(" "),e("h2",{attrs:{id:"_1-常用方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-常用方法"}},[a._v("#")]),a._v(" 1.常用方法")]),a._v(" "),e("ul",[e("li",[a._v("新增：put(k, v)")]),a._v(" "),e("li",[a._v("删除：clear()、 remove(key)")]),a._v(" "),e("li",[a._v("查看：entrySet()、get(key)、keySet()、size()、values()")]),a._v(" "),e("li",[a._v("判断：containsKey(key)、containsValue(v)、 equals()、 isEmpty()")])]),a._v(" "),e("h2",{attrs:{id:"_2-hashmap-详细见hashmap笔记"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-hashmap-详细见hashmap笔记"}},[a._v("#")]),a._v(" 2.HashMap（详细见HashMap笔记）")]),a._v(" "),e("p",[a._v("JDK1.2版本")]),a._v(" "),e("p",[a._v("特点：无序、唯一，按照key进行总结的，因为底层的key遵照哈希表结构（数组+链表）")]),a._v(" "),e("p",[a._v("哈希表：放入这个集合中的数据对应的类，必须重写hashCode()和equals()方法")]),a._v(" "),e("blockquote",[e("p",[a._v("HashMap与HashTable对于null值的区别：")]),a._v(" "),e("p",[a._v("HashMap key可以存入null值，只能存入一个key为null的值，遵循唯一的特点")]),a._v(" "),e("p",[a._v("HashTable key不可以存入null值")])]),a._v(" "),e("h2",{attrs:{id:"_3-linkedhashmap"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-linkedhashmap"}},[a._v("#")]),a._v(" 3.LinkedHashMap")]),a._v(" "),e("p",[a._v("底层：哈希表+链表")]),a._v(" "),e("p",[a._v("特点：唯一、有序（按照输入顺序进行输出）")]),a._v(" "),e("h2",{attrs:{id:"_4-hashtable"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-hashtable"}},[a._v("#")]),a._v(" 4.HashTable")]),a._v(" "),e("p",[a._v("JDK1.0版本")]),a._v(" "),e("p",[a._v("与HashMap基本相同，但是操作集合的方法加了synchronized关键字保证线程安全。")]),a._v(" "),e("h2",{attrs:{id:"_5-treemap"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_5-treemap"}},[a._v("#")]),a._v(" 5.TreeMap")]),a._v(" "),e("p",[a._v("特点：唯一、有序（按照升序或者降序）")]),a._v(" "),e("p",[a._v("原理：二叉树（红黑树），key遵照二叉树的特点，放入集合的key的数据对应的类型内部一定要实现比较器（内部比较器和外部比较器二选一）")]),a._v(" "),e("h1",{attrs:{id:"同步类容器"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#同步类容器"}},[a._v("#")]),a._v(" 同步类容器")]),a._v(" "),e("h2",{attrs:{id:"_1-collections-synchronizedlist-list-map"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-collections-synchronizedlist-list-map"}},[a._v("#")]),a._v(" 1.Collections.synchronizedList(List/Map)")]),a._v(" "),e("p",[a._v("在原有容器上加synchronized关键字，保证其线程安全。")]),a._v(" "),e("h2",{attrs:{id:"_2-concurrenthashmap"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-concurrenthashmap"}},[a._v("#")]),a._v(" 2.ConcurrentHashMap")]),a._v(" "),e("p",[a._v("对比：")]),a._v(" "),e("ul",[e("li",[a._v("ConcurrentHashMap：性能高，线程安全")]),a._v(" "),e("li",[a._v("HashTable：性能低，线程安全")]),a._v(" "),e("li",[a._v("HashMap：性能高，线程不安全")]),a._v(" "),e("li",[a._v("Collections.synchronizedList(HashMap)：性能低，线程安全")])]),a._v(" "),e("h2",{attrs:{id:"_3-cow-copy-on-write"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-cow-copy-on-write"}},[a._v("#")]),a._v(" 3.COW-Copy On Write")]),a._v(" "),e("p",[a._v("读写分离容器：向容器中添加元素时，先将容器进行copy复制出一个新的容器，再将元素添加到新容器中，再将原容器的引用指向新容器中，并发读的时候不需要锁定容器，因为原容器没有变化，所以可以读取原容器中的值，使用的是一种读写分离的思想。")]),a._v(" "),e("h3",{attrs:{id:"好处"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#好处"}},[a._v("#")]),a._v(" 好处")]),a._v(" "),e("p",[a._v("数组无锁，读写分离，读数据时读原有的数组，提高了并发性能")]),a._v(" "),e("h3",{attrs:{id:"注意"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#注意"}},[a._v("#")]),a._v(" 注意")]),a._v(" "),e("p",[a._v("COW容器只能保证数据的最终一致性，不能保证数据实时一致性。")]),a._v(" "),e("h3",{attrs:{id:"特定场景"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#特定场景"}},[a._v("#")]),a._v(" 特定场景")]),a._v(" "),e("p",[a._v("适合读多写少的情况，每次更新操作都会复制新容器，所以如果数据量较大并且更新操作频繁则对内存消耗很高，建议在搞并发读的场景下使用。")]),a._v(" "),e("h3",{attrs:{id:"copyonwritearraylist和copyonwritearrayset"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#copyonwritearraylist和copyonwritearrayset"}},[a._v("#")]),a._v(" CopyOnWriteArrayList和CopyOnWriteArraySet")]),a._v(" "),e("p",[a._v("CopyOnWriteArrayList add方法和addIfAbsent方法加锁，addIfAbsent会遍历当前集合，降低效率。")]),a._v(" "),e("p",[a._v("CopyOnWriteArraySet add方法基于addIfAbsent实现，效率低。")]),a._v(" "),e("h1",{attrs:{id:"队列-queue"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#队列-queue"}},[a._v("#")]),a._v(" 队列-Queue")]),a._v(" "),e("h2",{attrs:{id:"阻塞队列-blockingqueue"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#阻塞队列-blockingqueue"}},[a._v("#")]),a._v(" 阻塞队列-BlockingQueue")]),a._v(" "),e("p",[a._v("BlockingQueue继承自Queue，Queue继承自Collection，所以Collection最基础的增删改查操作是有的，多了Queue的特点先进先出，在这个基础上又多了BlockingQueue的特点，不允许添加null。")]),a._v(" "),e("h3",{attrs:{id:"常用方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#常用方法"}},[a._v("#")]),a._v(" 常用方法：")]),a._v(" "),e("ul",[e("li",[a._v("add：向指定队列中添加元素，成功返回true，如果没有可用空间，则抛出IllegalStateException")]),a._v(" "),e("li",[a._v("offer：向指定队列中添加元素，成功返回true，如果没有可用空间，返回false")]),a._v(" "),e("li",[a._v("put：向指定队列中添加元素，如果没有可用空间，将等待可用空间，阻塞方法")]),a._v(" "),e("li",[a._v("take：获取并移除此队列的头部，在元素变得可用之前一直等待，阻塞方法，如果队列为空，则一直阻塞等待")]),a._v(" "),e("li",[a._v("poll：获取并移除此队列的头部，在指定的等待时间前等待可用的元素，阻塞方法，如果队列为空，则返回null")])]),a._v(" "),e("h3",{attrs:{id:"arrayblockingqueue"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#arrayblockingqueue"}},[a._v("#")]),a._v(" ArrayBlockingQueue")]),a._v(" "),e("p",[a._v("​\t\t底层基于数组，有边界的队列（需指定长度），FIFO（first-in-first-out）添加元素时放到队列头部，取元素时，从尾部取。")]),a._v(" "),e("ul",[e("li",[a._v("添加元素同BlockingQueue常用方法，不可以添加null元素，会报错空指针异常")]),a._v(" "),e("li",[a._v("peek：查询头部元素但是不会移除元素，如果队列为空，则返回null")]),a._v(" "),e("li",[a._v("添加/获取方法都依赖于入队和出队方法")]),a._v(" "),e("li",[a._v("不支持读写同时操作，源码中添加/获取阻塞时使用同一个ReentrantLock，所以不支持读写同时操作")])]),a._v(" "),e("h3",{attrs:{id:"linkedblockingqueue"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#linkedblockingqueue"}},[a._v("#")]),a._v(" LinkedBlockingQueue")]),a._v(" "),e("p",[a._v("​\t\t支持读写同时操作，并发情况下，效率高，底层基于链表，可选择的有边界的队列（可指定长度，可不指定长度，不指定长度时是一个无界队列，此处的无界不是真正意义的无界，是Integer的最大值Integer.MAX_VALUE 21亿左右），FIFO（first-in-first-out）")]),a._v(" "),e("ul",[e("li",[a._v("阻塞的前提是队列有界")]),a._v(" "),e("li",[a._v("不可以添加null元素，会报错空指针异常")])]),a._v(" "),e("h3",{attrs:{id:"synchronousqueue"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#synchronousqueue"}},[a._v("#")]),a._v(" SynchronousQueue")]),a._v(" "),e("p",[a._v("没有长度，必须有一个线程阻塞获取数据，才能放入数据")]),a._v(" "),e("ul",[e("li",[a._v("add添加数据时，如果先放数据则会抛异常IllegalStateException：Queue Full")]),a._v(" "),e("li",[a._v("put添加数据时，由于队列没有长度，则会阻塞")]),a._v(" "),e("li",[a._v("取出元素不能用peek，peek支持查看方法")])]),a._v(" "),e("p",[a._v("优点：")]),a._v(" "),e("ul",[e("li",[a._v("方便高效的进行线程间数据的传送，效率极高，不会产生队列中数据争抢的问题")]),a._v(" "),e("li",[a._v("数据没有经过队列直接被消费线程取走，数据可以准确的传送，队列就是一个标记，性能很高")])]),a._v(" "),e("h3",{attrs:{id:"priorityblockingqueue"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#priorityblockingqueue"}},[a._v("#")]),a._v(" PriorityBlockingQueue")]),a._v(" "),e("p",[a._v("​\t\t带有优先级的阻塞队列，即队列有先后顺序，数据有不同的权重，所以不允许放入不可比较的对象（会抛出ClassCastException），对象必须实现内部比较器或者外部比较器不可以放入null。")]),a._v(" "),e("p",[a._v("​\t\t无界的队列，没有长度限制，不指定长度时，默认初始长度为11，也可以手动指定，而随着数据的不断增加，底层（Object数组）会自动扩容，直到内存全部消耗殆尽 ，导致OOM内存溢出才会结束。")]),a._v(" "),e("h3",{attrs:{id:"delayqueue"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#delayqueue"}},[a._v("#")]),a._v(" DelayQueue")]),a._v(" "),e("p",[a._v("​\t\t是一个无界的BlockingQueue，用于放置"),e("strong",[a._v("实现了Delayed接口")]),a._v("的对象，其中的对象只能在其到期时才能从队列中取走。")]),a._v(" "),e("p",[a._v("​\t\t当生产线程调用put之类的方法加入元素时，会触发Delayed接口中的CompareTo方法进行排序，也就是说队列中元素的顺序是按到期时间排序的，而非它们进入队列的顺序，排在队列头部的元素是最早期的，越往后到期时间越晚。")]),a._v(" "),e("p",[a._v("​\t\t当消费线程查看队列头部的元素，注意是查看不是取出。然后调用getDelay方法，如果此方法返回的值小于0或者等于0，则消费线程会从队列中取出元素，并进行处理，如果返回值大于0，则消费线程wait返回的时间值后，在从头部取出元素，此时元素到期。")]),a._v(" "),e("p",[a._v("​\t\t放入队列的元素必须重写Delayed接口中的getDelay方法和Comparable接口中compareTo方法")]),a._v(" "),e("h3",{attrs:{id:"deque"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#deque"}},[a._v("#")]),a._v(" Deque")]),a._v(" "),e("p",[a._v("双端队列，")])])}),[],!1,null,null,null);t.default=v.exports}}]);