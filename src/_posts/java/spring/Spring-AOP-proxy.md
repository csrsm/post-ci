---
category: csrsm
title: Spring AOP
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
  - spring
date: 2020-11-23
---

## **设计模式：proxy**

###### 代理：增强一个对象的功能。

- 目标对象：被增强的对象

- 代理对象：增强后的对象

  不是绝对的，会根据代码发生改变。

## Java实现代理的两种方式：

### **1.静态代理**

**## 如果在不确定的情况下，尽量不要使用静态代理**

#### **继承**：

代理对象继承目标对象，重写目标对象的方法。

缺点：会导致代理类非常多，非常复杂。

#### **聚合：**

目标对象和代理对象实现同一接口，代理对象中，包含目标对象。实现同一接口是为了对外提供一致的api

缺点：也会导致代理类过多，但是比继承少一些。

### 2.动态代理

通过代码动态产生代理对象类。

### **自己模拟的动态代理**

.java --> .class --> 通过classloader 加载到 jvm中 ，以byte形式存在 --> object对象

不需要手动创建类文件，通过接口反射生成类文件，调用第三方的编译技术，动态编译这个产生的类文件成class文件，继而利用classloader（动态产生的class不在工程当中，所以需要使用URLClassLoader）把这个动态编译的类加载到jvm中，最后通过反射把这个类实例化。

缺点：生成文件、动态编译文件、IO操作效率慢、需要URLclassloader

##判断对象是否相同的前提，是否是同一个类加载器加载的类。

### **JDK动态代理**

通过接口反射的方法 -->byte字节码 --> object对象(通过一个native方法，底层使用c++实现)

### **CGLib代理**

使用asm实现对字节码的操作，与jdk动态代理的区别在于，jdk基于实现接口（因为jdk）

