---
category: csrsm
title: Spring AOP 应用
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - java
  - spring
date: 2020-11-23
---

## **AOP**

面向切面编程，传统的面向对象编程（OOP）开发中的代码逻辑是至上而下的，在这些至上而下的过程中会产生一些横切性的问题，这些横切性问题和业务逻辑关系不大，会散落在代码的各个地方，难以维护，AOP的编程思想就是把业务逻辑和横切性问题进行分离，从而达到解藕的目的，使代码的重用性和开发效率更高。

Spring AOP是对AOP的一种实现。

AspectJ是对AOP的一种实现框架。

spring借助aspectj的语法，几种注解。

#### **应用场景**

日志记录、权限验证、效率检查、事务管理等。 

## **AOP Concepts**

- **Joinpoint**：连接点，目标对象中的方法。
- **Aspect**：切面，连接点、切点、通知等信息的载体，spring管理(声明成spring bean)。
- **pointcut**：切点，连接点的集合。
- **target object**：目标对象，原始对象。
- **AOP proxy**：代理对象，包含了原始对象的代码和增强的代码（横切性），使用JDK代理时，与目标对象不等，使用CGLIB时，与目标对象相等，两者均与目标对象实现的接口相等。
- **Weaving**：织入，把代理逻辑加到目标对象上的过程。
- **Introduction**：
- **Advice**：通知，包含位置（before、after、around）以及逻辑。

### **声明Pointcut**

通知指定切点可以通过逻辑运算符指定多个。 

**1.execution**：

```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)
问号表示可有可无，其中各项如下：
modifiers-pattern：方法可见性，如public、protected。
ret-type-pattern：方法返回值类型，如int、void。
declaring-type-pattern：方法所在类的全路径名，如com.spring.Aspect。
name-pattern：方法名类型。
param-pattern：方法的参数类型，如java.lang.string。
throws-pattern：方法抛出的异常类型，如java.lang.Exception。
##doc:https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/core.html#aop-pointcuts-examples
```

**2.within**：

```
  与execution区别在于，execution最小的粒度可以匹配方法修饰符、返回值、参数等等。
  within只能匹配包路径。如：within(com.xyz.service.*)
```

**3.args**

```
    args(java.lang.String)
    与包名类名无关，只与参数类型、个数有关
```

**4.@annotation**

```
 @annotation(org.springframework.transaction.annotation.Transactional)
 在切点上指定注解，则使用该注解的类会收到通知。
```

**5.this**

```
@Pointcut(value = "this(com.cm.dao.IndexDao)")
this指向的是当前作用目标的代理对象。
jdk代理时，代理对象与目标对象不一致，不会生效
gclib代理时，代理对象与目标对象一致，有效
```

**6.target**

```
@Pointcut(value = "target(com.cm.dao.IndexDao)")
目标对象不变。
```

#### **##jdk动态代理为什么只能是基于接口？**

jdk底层源码，在动态代理时，已经继承了Proxy类，java是单继承，所以要基于接口实现。

#### **##CGLIB与JDK动态代理**

jdk动态代理需要目标对象实现一个或多个接口，当代理没有实现接口的继承的类时，使用CGLIB包。

```
@EnableAspectJAutoProxy(proxyTargetClass = false)  ----JDK代理（默认使用）
indexdao instanceof IndexDao（true）
indexdao instanceof Proxy（true）
indexdao instanceof IndexDaoImpl（false）
@EnableAspectJAutoProxy(proxyTargetClass = true)   ----CGLIB代理
indexdao instanceof IndexDao（true）
indexdao instanceof Proxy（false）
indexdao instanceof IndexDaoImpl（true）
```

### **通知 Advice**

**1.@before**：在连接点方法运行之前执行。

**2.@After**：在连接点方法运行之后执行。

**3.@Around**：

```
ProceedingJoinPoint与JoinPoint区别：
ProceedingJoinPoint继承了JoinPoint，proceed()是aop代理链执行的方法。
JoinPoint的方法：
1.Object[] getArgs();获取连接点方法运行的入参列表
2.Object getTarget();获取连接点所在的目标对象
3.Object getThis();获取连接点所在的代理对象本身
4.Signature getSignature();获取连接点的方法签名对象
proceed()有重载，有个带参数的方法，可以修改目标方法的参数
⚠️proceed()方法需要执行，否则被aop的方法不会继续执行。
⚠️该方法需要有返回值，返回proceed()，否则被aop的方法返回值为空。
```

### **aspect Introductions** 扩展

```
@DeclareParents(value="com.cm.dao.*+", defaultImpl= IndexDao.class)
public static Dao dao;
当在该路径下类强转成Dao时，可以使用默认实现defaultImpl中的方法。
```

### **Aspect Instantiation Models 切面实例化模型**

```
@Aspect("perthis(this(com.cm.dao.Dao))")
可以设置切面的作用域，单例、原型
```

#### **spring-aop有两种风格：**

1. @AspectJ注解风格（推荐）
2. xml风格（）



### 设计模式：

工厂模式：spring BeanFactory或ApplicationContext创建对象

代理模式：jdk proxy动态代理

单例模式：依赖注入默认单例模式

