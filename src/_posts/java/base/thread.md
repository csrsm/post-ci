---
category: csrsm
title: 多线程
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
# 一、多线程

## 1.基础知识

### （1）线程的两种创建方式：

- 继承Thread类。new MyThread().start()
- 实现Runnable接口。new MyThread(new MyRunnable()).start()
- lamda表达式。

### （2）启动线程的三种方式

- Thread类
- Runnable接口
- Executors线程池（使用的也是上述两种之一）

### （3）线程常用方法

- sleep() 
- yield() 
- join()

> sleep()方法和wait()方法的区别：
>
> sleep()方法是Thread类的方法，wait()方法是Object类提供的方法，sleep方法通过设置睡眠时间来唤醒线程，不释放锁，wait方法只能通过notify等方法唤醒线程，会释放锁。

### （4）线程状态迁移

java线程状态：new、runnable（ready、running）、teminated、timedWaiting、waiting、blocked

![线程状态迁移](img/线程状态迁移.jpg)

### （5）synchronized关键字

既保证了原子性又保证了可见性。 锁只针对于对象。

synchronized(Object)： 不能锁定String常量、Integer、Long等

> 可重入锁：一个同步方法调用另一个同步方法，一个线程已经拥有了某个对象的锁，再次申请时仍然会得到该对象的锁，也就是说synchronized获得的锁是可重入的。
>
> 程序中出现异常时，默认情况下锁会被释放。
>
> 锁定方法和非锁定方法可以同时执行。

**底层实现**：JDK早期时是重量级锁，需要申请操作系统的锁（内核态）。后续的改进引入锁升级的概念，效率大幅提高。

第一个申请锁的对象，会在markword记录这个线程的线程号，并不会给该对象加锁（偏向锁）

如果有线程争用，则会升级为自旋锁（用户态），自旋10次以后还是无法得到锁后，则会升级为重量级锁，申请操作系统的锁。

> 自旋锁占用cpu资源，不适用于执行时间长（加锁代码），且线程较多的情况。
>
> 操作系统的锁不占用cpu资源，竞争的线程是在等待队列中，不占用cpu，所以执行时间长、线程数多尽量使用synchronized。
