---
category: csrsm
title: spring IOC
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
## spring IOC和DI区别

IOC：控制反转，是面向对象编程中的一种设计原则可以用来减低计算机代码之间的耦合度，其中最常见的方式叫做依赖注入（DI）。

DI：依赖注入，实现IOC的一种技术手段。

还有另外两种方式：依赖查找、依赖拖拽。

## spring实现IOC的思路和方法

```
spring实现IOC的思路是提供一些配置信息来描述类之间的关系，然后由容器去解析这些配置信息，进而维护好对象之间的依赖关系，前提是对象之间的依赖关系必须在类中定义好。
```

1. 应用程序中提供类，提供依赖关系（属性或构造方法）
2. 把需要交给容器管理的对象通过配置告诉容器（xml、annotation、javaconfig）
3. 把各个类之间的依赖关系通过配置信息告诉容器。

## spring编程的风格(三者可以混合使用)

1. Schema-based   --xml

   ClassPathXmlApplicationContext Bean工厂，不具备解析注解开启的功能，需要在xml中配置

2. Annotation-based    --annotation  

   需要在xml配置文件中开启注解以及扫描路径，或者在java configuration中开启扫描，当扫描路径下不需要扫描某些类时，可以在**@ComponentScan**中对其进行配置，

   ```
   @ComponentScan(value = "com.cm", includeFilters = {@ComponentScan.Filter(type = FilterType.REGEX, pattern = "com.cm.service.*")},excludeFilters = {@ComponentScan.Filter(type = FilterType.REGEX, pattern = "com.cm.service.*")})
   ```

   当工程中类过多时，可以在maven中加入依赖，来加速对类扫描。

   ```
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context-indexer</artifactId>
      <version>5.2.7.RELEASE</version>
      <optional>true</optional>
    </dependency>
   ```

   

3. Java-based    --java configuration

   AnnotationConfigApplicationContext Bean工厂

## IOC的两种方法（xml风格）

1. 构造方法，在xml配置文件中加入

   ```
   <constructor-arg ref="dao"></constructor-arg>
   ```

2. set方法，在xml配置文件中加入

   ```
   <property name="dao" ref="dao"></property>
   ```

## 自动装配

优点：减少xml中的配置，当对象发生改变时，自动更新。

1. ### xml编程方式：全局配置

   ```
   在beans中配置default-autowire="byType"
   ```

   四种配置方式：

   - byName：通过依赖注入时，定义的set方法来进行匹配，bean中配置name属性，不配置时默认与id相同。
   - byType：通过依赖注入时，依赖的类进行匹配，当匹配的接口有两个实现类时，启动报错，此时可以通过配置指定bean的autowire属性来定义。
   - constructor：通过构造器来匹配。
   - no：不开启自动装配，同default。

2. ### 注解方式

   ```
   @Component是@Service、@Controller、@Repository等注解的父类。
   @Service、@Controller、@Repository未来可能会拥有额外的功能（官网解释）。
   ```

   @Autowired 与 @Resource区别：

   ```
   @Autowired默认优先使用byType进行自动注入，当byType匹配不到时，则会根据byName通过定义的属性名来进行匹配。属性名：private IndexDao indexDaoImpl;
   ```

   ```
   @Resource默认使用byName进行自动注入，通过定义的属性名来进行匹配，与set方法名无关。可以在注解上面指定装配类型: @Resource(type = IndexDao.class)。当指定name时，默认为需要注入的类首字母小写：@Resource(name = indexDaoImpl)，可以通过相应的注解设置bean name：@Repository("myIndexDao")，
   或者通过继承AnnotationBeanNameGenerator，重写generateBeanName生成器来定制bean name的生成规则，此方式需要在配置中指定命名规则生成类。
   ```

   ```
   当一个接口被多个类实现时，注入时除上述方法外还可以通过以下方式：
   1.在想要注入的实现类上，加入@Primary注解。
   2.在注入时，加入@Qualifier(name="")指定具体要注入的类。
   ```

   

   ### springbean作用域

   singleton：单例，默认。

   prototype：每次调用时，创建新的实例，@Scope("prototype")。

   当在singleton作用域中，使用prototype-bean时，会失效，因为单例作用域中只会执行一次初始化的方法，所以只会实例化一次prototype-bean。

   **想要解决这个问题，有两种方式：**

   1.需要在singleton类中继承ApplicationContextAware，重写setApplicationContext方法，调用时使用ApplicationContextAware.getBean()，此时不需要@Autowired注入。

   2.使用@Lookup注解，@Lookup需要定义到抽象方法上或get方法上，此时不需要@Autowired注入，@Lookup可以指定类的name。

## Spring生命周期的回调：

#### 初始化：

1. 在方法上面使用 **@PostConstruct** 注解
2. 在类中实现InitializingBean接口，重写afterPropertiesSet方法。
3. 自定义方法，在配置文件bean标签中指定init方法

#### 销毁：

1. 在方法上面使用 **@PreDestroy** 注解
2. 在类中实现DisposableBean接口，重写destroy方法。
3. 自定义方法，在配置文件bean标签中指定destroy方法

## Spring bean相互引用：

可以相互引用，但是当bean作用域为prototype时，不可以相互引用。

## 切换不同环境的类：

**@Profile**注解，通过AnnotationConfigApplicationContext设置环境的activeProfile





