---
category: SixGeek
title: JVM-类加载过程
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - JVM
  - Java
date: 2021-11-23
---

# 类加载过程

## 1.通过Java命令执行代码的大体流程如下:



其中loadClass的类加载过程有如下几步：

  <img :src="$withBase('/img/java/JVM加载类机制.png')" alt="JVM加载类机制"> 

**加载 >> 验证 >> 准备 >> 解析 >> 初始化 >>** 使用 >> 卸载

- 加载：在硬盘上查找并通过IO读入字节码文件，使用到类时才会加载，例如调用类的main()方法，new对象等等，在加载阶段会在内存中生成一个**代表这个类的java.lang.Class对象**，作为方法区这个类的各种数据的访问入口
- 验证：校验字节码文件的正确性
- 准备：给类的静态变量分配内存，并赋予默认值
- 解析：将**符号引用**替换为直接引用，该阶段会把一些静态方法(符号引用，比如main()方法)替换为指向数据所存内存的指针或句柄等(直接引用)，这是所谓的**静态链接**过程(类加载期间完成)，**动态链接**是在程序运行期间完成的将符号引用替换为直接引用
- **初始化**：对类的静态变量初始化为指定的值，执行静态代码块

  <img :src="$withBase('/img/java/loadclass类加载过程.png')" alt="loadclass类加载过程"> 

- 类被加载到方法区中后主要包含 **运行时常量池、类型信息、字段信息、方法信息、类加载器的引用、对应class实例的引用**等信息。
- **类加载器的引用**：这个类到类加载器实例的引用
- **对应class实例的引用**：类加载器在加载类信息放到方法区中后，会创建一个对应的Class 类型的对象实例放到堆(Heap)中, 作为开发人员访问方法区中类定义的入口和切入点。

## 2.**类加载器和双亲委派机制**

- 引导类加载器：负责加载支撑JVM运行的位于JRE的lib目录下的核心类库，比如rt.jar、charsets.jar等()
- 扩展类加载器：负责加载支撑JVM运行的位于JRE的lib目录下的ext扩展目录中的JAR类包(ExtClassLoader)
- 应用程序类加载器：负责加载ClassPath路径下的类包，主要就是加载你自己写的那些类(AppClassLoader)
- 自定义加载器：负责加载用户自定义路径下的类包

### **2.1类加载器初始化过程：**

- 参见类运行加载全过程图可知其中会创建JVM启动器实例sun.misc.Launcher。
- 在Launcher构造方法内部，其创建了两个类加载器，分别是sun.misc.Launcher.ExtClassLoader(扩展类加载器)和sun.misc.Launcher.AppClassLoader(应用类加载器)。
- JVM默认使用Launcher的getClassLoader()方法返回的类加载器AppClassLoader的实例加载我们的应用程序。

```java
//Launcher的构造方法
public Launcher() {
    Launcher.ExtClassLoader var1;
    try {
        //构造扩展类加载器，在构造的过程中将其父加载器设置为null
        var1 = Launcher.ExtClassLoader.getExtClassLoader();
    } catch (IOException var10) {
        throw new InternalError("Could not create extension class loader", var10);
    }

    try {
        //构造应用类加载器，在构造的过程中将其父加载器设置为ExtClassLoader，
        //Launcher的loader属性值是AppClassLoader，我们一般都是用这个类加载器来加载我们自己写的应用程序
        this.loader = Launcher.AppClassLoader.getAppClassLoader(var1);
    } catch (IOException var9) {
        throw new InternalError("Could not create application class loader", var9);
    }

    Thread.currentThread().setContextClassLoader(this.loader);
    String var2 = System.getProperty("java.security.manager");
    。。。 。。。 //省略一些不需关注代码
}
```

### 2.2双亲委派机制:

  <img :src="$withBase('/img/java/双亲委派机制.png')" alt="双亲委派机制"> 


- 这里类加载其实就有一个**双亲委派机制**，加载某个类时会先委托父加载器寻找目标类，找不到再委托上层父加载器加载，如果所有父加载器在自己的加载类路径下都找不到目标类，则在自己的类加载路径中查找并载入目标类。

- 比如我们的Math类，最先会找应用程序类加载器加载，应用程序类加载器会先委托扩展类加载器加载，扩展类加载器再委托引导类加载器，顶层引导类加载器在自己的类加载路径里找了半天没找到Math类，则向下退回加载Math类的请求，扩展类加载器收到回复就自己加载，在自己的类加载路径里找了半天也没找到Math类，又向下退回Math类的加载请求给应用程序类加载器，应用程序类加载器于是在自己的类加载路径里找Math类，结果找到了就自己加载了。。**双亲委派机制说简单点就是，先找父亲加载，不行再由儿子自己加载**



### 2.3双亲委派机制源码分析:

我们来看下应用程序类加载器AppClassLoader加载类的双亲委派机制源码，AppClassLoader的loadClass方法最终会调用其父类ClassLoader的loadClass方法，该方法的大体逻辑如下：

1. 首先，检查一下指定名称的类是否已经加载过，如果加载过了，就不需要再加载，直接返回。
2. 如果此类没有加载过，那么，再判断一下是否有父加载器；如果有父加载器，则由父加载器加载（即调用parent.loadClass(name, false);）.或者是调用bootstrap类加载器来加载。
3. 如果父加载器及bootstrap类加载器都没有找到指定的类，那么调用当前类加载器的findClass方法来完成类加载。

```java
//ClassLoader的loadClass方法，里面实现了双亲委派机制
protected Class<?> loadClass(String name, boolean resolve)
    throws ClassNotFoundException
{
    synchronized (getClassLoadingLock(name)) {
        // 检查当前类加载器是否已经加载了该类
        Class<?> c = findLoadedClass(name);
        if (c == null) {
            long t0 = System.nanoTime();
            try {
                if (parent != null) {  //如果当前加载器父加载器不为空则委托父加载器加载该类
                    c = parent.loadClass(name, false);
                } else {  //如果当前加载器父加载器为空则委托引导类加载器加载该类
                    c = findBootstrapClassOrNull(name);
                }
            } catch (ClassNotFoundException e) {
                // ClassNotFoundException thrown if class not found
                // from the non-null parent class loader
            }

            if (c == null) {
                // If still not found, then invoke findClass in order
                // to find the class.
                long t1 = System.nanoTime();
                //都会调用URLClassLoader的findClass方法在加载器的类路径里查找并加载该类
                c = findClass(name);

                // this is the defining class loader; record the stats
                sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                sun.misc.PerfCounter.getFindClasses().increment();
            }
        }
        if (resolve) {  //不会执行
            resolveClass(c);
        }
        return c;
    }
}
```

**为什么要设计双亲委派机制？**

- 沙箱安全机制：自己写的java.lang.String.class类不会被加载，这样便可以防止核心API库被随意篡改
- 避免类的重复加载：当父亲已经加载了该类时，就没有必要子ClassLoader再加载一次，保证**被加载类的唯一性**

### 2.4**自定义类加载器示例：**

自定义类加载器只需要继承 java.lang.ClassLoader 类，该类有两个核心方法，一个是loadClass(String, boolean)，实现了**双亲委派机制**，还有一个方法是findClass，默认实现是空方法，所以我们自定义类加载器主要是重写**findClass方法**。

```java
package com.caijj.classloader;

import java.io.FileInputStream;
import java.lang.reflect.Method;

/**
 * @ClassName : MyClassLoaderTest
 * @Description : 初始化ClassLoader
 * @Author : sanxianer
 * @Date: 2022-03-25 14:37
 */
public class MyClassLoaderTest {
    static class MyClassLoader extends ClassLoader {
        private String classPath;

        public MyClassLoader(String classPath) {
            this.classPath = classPath;
        }

        private byte[] loadByte(String name) throws Exception {
            name = name.replaceAll("\\.", "/");
            FileInputStream fis = new FileInputStream(classPath + "/" + name
                    + ".class");
            int len = fis.available();
            byte[] data = new byte[len];
            fis.read(data);
            fis.close();
            return data;
        }

        protected Class<?> findClass(String name) throws ClassNotFoundException {
            try {
                byte[] data = loadByte(name);
                //defineClass将一个字节数组转为Class对象，这个字节数组是class文件读取后最终的字节数组。
                return defineClass(name, data, 0, data.length);
            } catch (Exception e) {
                e.printStackTrace();
                throw new ClassNotFoundException();
            }
        }

    }

    public static void main(String args[]) throws Exception {
        //初始化自定义类加载器，会先初始化父类ClassLoader，其中会把自定义类加载器的父加载器设置为应用程序类加载器AppClassLoader
        MyClassLoader classLoader = new MyClassLoader("D:/test");
        //D盘创建 test/com/caijj/model/ 几级目录，将User类的复制类User.class丢入该目录
        /**
         * 如果项目中存在User类,根据双亲委派机制,用AppClassLoader进行加载
         * 如果项目中不存在User类,自定义类加载器进行加载:
         */
        Class clazz = classLoader.loadClass("com.caijj.model.User");
        Object obj = clazz.newInstance();
        Method method = clazz.getDeclaredMethod("sout", null);
        method.invoke(obj, null);
        System.out.println(clazz.getClassLoader().getClass().getName());
    }
}
=====================================================
运行结果：
自定义类加载器,加载成功!
com.caijj.classloader.MyClassLoaderTest$MyClassLoader
```

### 2.5**打破双亲委派机制**:

再来一个沙箱安全机制示例，尝试打破双亲委派机制，用自定义类加载器加载我们自己实现的 java.lang.String.class

```java
package com.caijj.classloader;

import java.io.FileInputStream;
import java.lang.reflect.Method;

/**
 * @ClassName : MyClassLoaderDp
 * @Description : 打破双亲委派机制
 * @Author : sanxianer
 * @Date: 2022-03-25 15:06
 */
public class MyClassLoaderDp {

    static class MyClassLoader extends ClassLoader {
        private String classPath;

        public MyClassLoader(String classPath) {
            this.classPath = classPath;
        }

        private byte[] loadByte(String name) throws Exception {
            name = name.replaceAll("\\.", "/");
            FileInputStream fis = new FileInputStream(classPath + "/" + name
                    + ".class");
            int len = fis.available();
            byte[] data = new byte[len];
            fis.read(data);
            fis.close();
            return data;

        }

        protected Class<?> findClass(String name) throws ClassNotFoundException {
            try {
                byte[] data = loadByte(name);
                return defineClass(name, data, 0, data.length);
            } catch (Exception e) {
                e.printStackTrace();
                throw new ClassNotFoundException();
            }
        }

        /**
         * 重写类加载方法，实现自己的加载逻辑，不委派给双亲加载
         * @param name
         * @param resolve
         * @return
         * @throws ClassNotFoundException
         */
        protected Class<?> loadClass(String name, boolean resolve)
                throws ClassNotFoundException {
            synchronized (getClassLoadingLock(name)) {
                // First, check if the class has already been loaded
                Class<?> c = findLoadedClass(name);
                /**
                 * 去除父类加载器实现
                 */
                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    if (!name.startsWith("com.caijj.model.User1")){
                        //原生类或者jar包类,保持双亲委派机制委托
                        c = this.getParent().loadClass(name);
                    } else {
                        //自己的类用打破双亲委派机制加载
                        c = findClass(name);
                    }
                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
                if (resolve) {
                    resolveClass(c);
                }
                return c;
            }
        }
    }

    public static void main(String args[]) throws Exception {
        MyClassLoader classLoader = new MyClassLoader("D:/test");
        //加载本地User1打破双亲委派机制,用自定义Loader进行加载
        Class clazz = classLoader.loadClass("com.caijj.model.User1");
        Object obj = clazz.newInstance();
        Method method= clazz.getDeclaredMethod("sout", null);
        method.invoke(obj, null);
        System.out.println(clazz.getClassLoader().getClass().getName());

        MyClassLoader classLoader2 = new MyClassLoader("D:/test");
        //加载本地User->父级加载器本地项目中可以加载,用父级加载器AppClassLoader进行加载
        Class clazz2 = classLoader2.loadClass("com.caijj.model.User");
        Object obj2 = clazz2.newInstance();
        Method method2= clazz2.getDeclaredMethod("sout", null);
        method2.invoke(obj2, null);
        System.out.println(clazz2.getClassLoader().getClass().getName());
    }
}
=====================================================
运行结果：
User1~自定义类加载器,加载成功!
com.caijj.classloader.MyClassLoaderDp$MyClassLoader
自定义类加载器,加载成功!
sun.misc.Launcher$AppClassLoader

```

## 3.HotSpot源码JVM启动执行main方法流程(c/c++了解即可)

  <img :src="$withBase('/img/java/Hotspot源码JVM启动执行main方法流程.jpg')" alt="Hotspot源码"> 