---
category: csrsm
title: spring面试题
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

## 1.谈谈对Spring IOC的理解，原理和实现？
总分总结构回答问题，分为两种思路
###### （1）总体介绍：

- ioc即Inversion of Control，控制反转，是一种理论思想，传统的对象是由使用者来控制，而有了spring后，可以把整个对象交给spring来进行管理，这是spring的核心。
- spring是一个容器，可以存储对象，使用map结构来存储，在spring中一般存在三级缓存，其中singletonObjects中存放完整的对象
- 整个bean的生命周期，从创建到使用到销毁的过程全部都是由容器来管理（bean的生命周期）
###### （2）分
spring中的bean都是通过反射的方式生成的。同时其中包含的很多扩展点，比如最常用的对BeanFactory的扩展，对bean的扩展（对占位符${}的处理），除此之外，ioc中最核心的就是填充具体bean的属性，和生命周期。
## 2.谈一下Spring IOC的底层实现

- 先通过createBeanFactory创建出一个Bean工厂，DefaultListableBeanFactory
- 开始循环创建对象，因为容器中的bean都是单例的，所有优先通过getBean、doGetBean从容器中查找，找不到的话，通过createBean、doCreateBean方法，以反射的方式创建对象，一般情况下使用的是无参的构造方法（getDeclareConstructor， newInstance）
- 进行对象的属性填充 populateBean
- 进行其他初始化操作 initializingBean
## 3.描述一下生命周期
<img :src="$withBase('/img/interview/spring1.png')">

- 实例化Bean：反射的方式生成对象
- 填充Bean的属性：populateBean，此处由循环依赖问题引出三级缓存概念
- 调用aware接口相关方法
   - 如果Bean实现了BeanNameAware接口，则调用setBeanName(…)；
   - 如果Bean实现了BeanFactoryAware接口，则调用setBeanFactory(…)；
   - 如果Bean实现了BeanClassLoaderAware接口，则调用setBeanClassLoader(…)；；
   - 如果Bean实现了ApplicationContextAware接口，则调用setApplicationContext(…)；
- 调用BeanPostProcessor中的前置处理方法：postProcessorBeforeInitialization
- 调用InitializingBean的afterPropertiesSet
- 调用BeanPostProcessor中的后置处理方法：postProcessorAfterInitialization，
   - AOP就是在此处实现，AbstractAutoProxyCreator 
   - @PostConstruct方法回调
- 获取到完整的对象，可以用getBean的方式来进行对象的获取
- 销毁流程
   - @PreDestroy注释，注释回调方法上，销毁Bean之前调用；
   - 实现DisposableBean接口，调用destroy(…)，销毁Bean之前调用；
   - Bean定义中包含destroy-method（在XML中标签的属性）或@Bean(destroyMethod="…")指定的方法，销毁Bean之前调用；
## 4.Spring如何解决循环依赖问题
三点：三级缓存、提前暴露对象、aop
###### （1）总

- 什么是循环依赖问题，A依赖B，B依赖A
###### （2）分

- 先说明bean的创建过程：实例化，初始化（属性填充）形成闭环的原因：
   - 先创建A对象，实例化A对象，此时A对象中的b属性为空
   - 从容器中查找B对象，如果找到了，直接赋值，找不到直接创建B对象
   - 实例化B对象，此时B对象中的a属性为空，填充属性a
   - 容器中查找A对象，找不到，直接创建
- 解决方法：
   - 此时A对象是存在的，但是此时A对象不是一个完整的状态，只完成了实例化，未完成初始化
   - 而所有的对象完成实例化和初始化之后，需要把完整的对象放到容器中，此时在容器中存在对象的几个状态：完成实例化但未初始化、完整状态，因为都在容器中，所以要使用不同的map结构来进行存储，此时就有了一级缓存和二级缓存，如果一级缓存中有了，那么二级缓存中就不会存在同名的对象，因为查找顺序是1级-2级-3级这样的方式来查找的，一级缓存中放的是完整的对象（单例池），二级缓存中放的是非完整对象。
   - 为什么要有三级缓存？三级缓存的value是ObjectFactory，是一个函数式接口，存在的意义是保证整个容器的运行过程中同名的bean只有一个
   - 如果一个对象需要被代理，或者说需要生成代理对象，那么要优先生成一个普通对象，
   - 普通对象和代理对象是不能同时出现在容器中的，因此当一个对象需要被代理的时候，就要使用代理对象覆盖掉之前的普通对象，在实际调用过程中，是没有办法确定什么时候对象被使用，所有就要求当某个对象被调用的时候，优先判断此对象是否需要被代理，类似于一种回调机制的实现，因此传入lambda表达式来执行对象的覆盖过程，getEarlyBeanReference()
   - 因此，所有的bean对象在创建的时候都要优先放到三级缓存中，在后续的使用过程中，如果需要被代理则返回代理对象，如果不需要被代理，则直接返回普通对象
###### （3）另一种回答
Spring通过三级缓存解决了循环依赖，其中一级缓存为单例池（singletonObjects）,二级缓存为早期曝光对象earlySingletonObjects，三级缓存为早期曝光对象工厂（singletonFactories）。当A、B两个类发生循环引用时，在A完成实例化后，就使用实例化后的对象去创建一个对象工厂，并添加到三级缓存中，如果A被AOP代理，那么通过这个工厂获取到的就是A代理后的对象，如果A没有被AOP代理，那么这个工厂获取到的就是A实例化的对象。当A进行属性注入时，会去创建B，同时B又依赖了A，所以创建B的同时又会去调用getBean(a)来获取需要的依赖，此时的getBean(a)会从缓存中获取，第一步，先获取到三级缓存中的工厂；第二步，调用对象工工厂的getObject方法来获取到对应的对象，得到这个对象后将其注入到B中。紧接着B会走完它的生命周期流程，包括初始化、后置处理器等。当B创建完后，会将B再注入到A中，此时A再完成它的整个生命周期。至此，循环依赖结束！
###### （4）缓存的放置时间和删除时间

- 三级缓存：createBeanInstance之后，addSingletonFactory
- 二级缓存：第一次从三级缓存确定对象是代理对象还是普通对象的时候，同时删除三级缓存getSingleton
- 一级缓存：生成完整对象之后放到一级缓存，删除二三级缓存，addSingleton
## 5.BeanFactory和FactoryBean区别
###### （1）相同点

- 都是用来创建bean对象
###### （2）不同点

- 当使用BeanFactory创建bean对象时，必须要遵循严格的生命周期流程，过于复杂
- 如果想要简单的自定义某个对象的创建，同时创建完成的对象交给spring管理，那么就需要实现FactoryBean接口了
   - isSingleton:是否是单例对象
   - getObjectType：获取返回对象的类型
   - getObject：自定义创建对象的过程（new、反射、动态代理）
## 6.Spring中用到的设计模式

- 单例模式：bean默认都是单例模式
- 原型模式：指定作用域为prototype
- 工厂模式：beanFactory
- 模板方法
- 适配器模式：Adapter
- 策略模式
- 装饰者模式
- 责任链模式：aop拦截器链
- 代理模式：动态代理
- 观察者模式：
- 委托者模式
- 门面模式
## 7.Spring的AOP的底层实现
动态代理
aop是ioc的一个扩展功能，现有ioc，再有aop，只是在ioc的整个流程中新增的一个扩展点而已：BeanPostProcessor
###### （1）总:

- aop概念
- 应用场景
- 动态代理
###### （2）分

- bean的创建过程中有一个步骤可以对bean进行扩展实现，aop本身就是一个扩展功能，所以在BeanPostProcessor的后置处理方法中来进行实现
- 代理对象的创建过程（advice、切面、切点）
- 通过jdk或者cglib的方式来生成代理对象（jdk代理是继承proxy，单继承，cglib是实现接口，多继承）
- 在执行方法调用的时候，会调用到生成的字节码到文件中，直接会找到DynamicAdvisedInterceptor类中的Intercept方法，从此方法开始执行。
- 根据之前定义好的advice来生成拦截器链
- 从拦截器链中依次获取每一个通知开始进行执行，在执行过程中，为了方便找到下一个通知是哪个，会有一个 InvocationInterceptor的对象，找的时候从-1的位置依次开始查找，执行
## 8.Spring的事务是如何回滚的
spring的事务管理按照AOP实现时：

- 在before切面建立连接，开启事务
- 执行业务逻辑，即sql操作
- 执行成功时在after切面中commit
- 执行失败时在afterThrowing切面中rollback

实际事务管理只是使用AOP的逻辑实现，但是并不是使用AOP的通知实现的
###### （1）总
spring的事务是由aop来实现的，首先要生成具体的代理对象，然后按照aop的整套流程来执行具体的操作逻辑，正常情况下要通过通知来完成核心功能，但是事务不是通过通知来实现的，而是通过一个TransactionInterceptor来实现的，然后调用invoke来实现具体的逻辑
###### （2）分

1. 先做准备工作，解析各个方法上事务相关的属性（隔离性、传播特性等）
2. 根据具体的属性来判断是否开启新事务
3. 当需要开启的时候，获取数据库的连接，关闭自动提交功能，开启事务
4. 执行具体的sql逻辑操作
5. 在操作过程中，执行失败了，那么会通过completeTransactionAfterThrowing来完成事务的回滚操作，回滚的具体逻辑通过doRollBack方法来实现的，实现的时候也要是先获取连接对象，通过连接对象来回滚
6. 如果执行过程中没有任何异常发生，那么通过commitTransactionAfterRunning来完成事务的提交操作，提交的具体逻辑通过doCommit方法来实现，，实现的时候也要是先获取连接对象，通过连接对象来提交
7. 当事务执行完毕，需要清除相关的事务信息cleanupTransactionInfo

`疑问：为什么事务不通过Advice的方式来实现呢？`
## 9.谈一下Spring的事务传播
传播特性有7种

- Required
- Requires_new
- nested
- Support
- Not_Support
- Never
- Mandatory

某个事务嵌套另一个事务的时候怎么办？
A方法调用B方法，AB方法都有事务，并且传播特性不同，那么A如果有异常，B怎么办，B如果有异常，A怎么办？
###### （1）总
事务的传播特性指的是不同的方法的嵌套调用过程中，事务应该如何进行处理，使用同一个事务还是不同的事务，当出现异常的时候时回滚还是提交，两方法之间的相关影响，在日常工作中，使用比较多的是：Required、Requires_new、nested
###### （2）分

1. 先说事务的不同分类，可以分为三个：支持当前事务，不支持当前事务，嵌套事务
2. 如果外层方法是Required，内层方法是Required、Requires_new、nested
3. 如果外层方法是Requires_new，内层方法是Required、Requires_new、nested
4. 如果外层方法是nested，内层方法是Required、Requires_new、nested

核心处理逻辑非常简单：

1. 判断内外方法是否是同一个事务：
   1. 是：异常统一在外层处理
   2. 内层方法可能会影响到外层方法，但是外层方法不会影响内层方法（nested是特例）
