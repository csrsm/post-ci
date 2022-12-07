---

category: csrsm

title: SpringBoot-基础入门

header-title: true

header-image:

- http://img.icoisini.xyz/background.jpg

tags:

- java
- spring

date: 2020-01-21

---

 

 SpringBoot-基础入门

 

<!-- more -->



# SpringBoot2核心技术-基础入门 

## 学习要求

- 熟悉Spring基础
- 熟悉Maven使用

## 环境要求

- Java8及以上
- Maven 3.3及以上：<https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started-system-requirements>

## 学习资料

- 文档地址： <https://www.yuque.com/atguigu/springboot>

- - 文档不支持旧版本IE、Edge浏览器，请使用chrome或者firefox

- 视频地址： <http://www.gulixueyuan.com/>    <https://www.bilibili.com/video/BV19K4y1L7MT?p=1>
- 源码地址：<https://gitee.com/leifengyang/springboot2>



## 01、Spring与SpringBoot 

### 1、Spring能做什么

#### 1.1、Spring的能力

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1354552/1602641710418-5123a24a-60df-4e26-8c23-1d93b8d998d9.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_10%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fresize%2Cw_727) 

#### 1.2、Spring的生态

<https://spring.io/projects/spring-boot>

- 覆盖了：
- web开发
- 数据访问
- 安全控制
- 分布式
- 消息服务
- 移动开发
- 批处理
- ......

#### 1.3、Spring5重大升级

##### 1.3.1、响应式编程

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1354552/1602642309979-eac6fe50-dc84-49cc-8ab9-e45b13b90121.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_10%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fresize%2Cw_746) 

##### 1.3.2、内部源码设计

```
Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".
能快速创建出生产级别的Spring应用
```

#### 2.1、SpringBoot优点

- Create stand-alone Spring applications

- - 创建独立Spring应用

- Embed Tomcat, Jetty or Undertow directly (no need to deploy WAR files)

- - 内嵌web服务器

- Provide opinionated 'starter' dependencies to simplify your build configuration

- - 自动starter依赖，简化构建配置

- Automatically configure Spring and 3rd party libraries whenever possible

- - 自动配置Spring以及第三方功能

- Provide production-ready features such as metrics, health checks, and externalized configuration

- - 提供生产级别的监控、健康检查及外部化配置

- Absolutely no code generation and no requirement for XML configuration

- - 无代码生成、无需编写XML

```
SpringBoot是整合Spring技术栈的一站式框架
SpringBoot是简化Spring技术栈的快速开发脚手架
```

#### 2.2、SpringBoot缺点

- 人称版本帝，迭代快，需要时刻关注变化
- 封装太深，内部原理复杂，不容易精通

### 3、时代背景

#### 3.1、微服务

[James Lewis and Martin Fowler (2014)](https://martinfowler.com/articles/microservices.html)  提出微服务完整概念。<https://martinfowler.com/microservices/> 

```
In short, the microservice architectural style is an approach to developing a single application as a suite of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API. These services are built around business capabilities and independently deployable by fully automated deployment machinery. There is a bare minimum of centralized management of these services, which may be written in different programming languages and use different data storage technologies.-- James Lewis and Martin Fowler (2014)
```

- 微服务是一种架构风格
- 一个应用拆分为一组小型服务
- 每个服务运行在自己的进程内，也就是可独立部署和升级
- 服务之间使用轻量级HTTP交互
- 服务围绕业务功能拆分
- 可以由全自动部署机制独立部署
- 去中心化，服务自治。服务可以使用不同的语言、不同的存储技术

#### 3.2、分布式

![img](https://cdn.nlark.com/yuque/0/2020/png/1613913/1599562347965-a617a866-4270-44e9-9c5b-ced552683eda.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_14%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_14%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fresize%2Cw_746) 

##### 分布式的困难

- 远程调用
- 服务发现
- 负载均衡
- 服务容错
- 配置管理
- 服务监控
- 链路追踪
- 日志管理
- 任务调度
- ......

##### 分布式的解决

SpringBoot + SpringCloud 

![img](https://cdn.nlark.com/yuque/0/2020/png/1613913/1599799119457-841ef47a-6585-4ca4-8e3d-8298e796012c.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_10%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_10%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fresize%2Cw_746) 

#### 3.3、云原生

原生应用如何上云。 Cloud Native 

##### 上云的困难

- 服务自愈
- 弹性伸缩
- 服务隔离
- 自动化部署
- 灰度发布
- 流量治理
- ......

### 4、如何学习SpringBoot

#### 4.1、官网文档架构

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1354552/1602654700738-b6c50c90-0649-4d62-98d3-57658caf0fdb.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_14%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fresize%2Cw_746) 

查看版本新特性；

<https://github.com/spring-projects/spring-boot/wiki#release-notes>

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1354552/1602730009896-1b651f2c-133c-4f62-b21c-92a002f09e73.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_14%2Ctext_YXRndWlndS5jb20g5bCa56GF6LC3%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fresize%2Cw_746) 



## 02、SpringBoot2入门 

### 1、系统要求

- [Java 8](https://www.java.com/) & 兼容java14 .
- Maven 3.3+
- idea 2019.1.2

#### 1.1、maven设置

```
<mirrors>
      <mirror>
        <id>nexus-aliyun</id>
        <mirrorOf>central</mirrorOf>
        <name>Nexus aliyun</name>
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>
      </mirror>
  </mirrors>
 
  <profiles>
         <profile>
              <id>jdk-1.8</id>
              <activation>
                <activeByDefault>true</activeByDefault>
                <jdk>1.8</jdk>
              </activation>
              <properties>
                <maven.compiler.source>1.8</maven.compiler.source>
                <maven.compiler.target>1.8</maven.compiler.target>
                <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
              </properties>
         </profile>
  </profiles>
```

### 2、HelloWorld

需求：浏览发送/hello请求，响应 Hello，Spring Boot 2  

#### 2.1、创建maven工程

#### 2.2、引入依赖

```
<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.4.RELEASE</version>
    </parent>


    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

    </dependencies>
```

#### 2.3、创建主程序

```
/**
 * 主程序类
 * @SpringBootApplication：这是一个SpringBoot应用
 */
@SpringBootApplication
public class MainApplication {

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class,args);
    }
}
```

#### 2.4、编写业务

```
@RestController
public class HelloController {
    @RequestMapping("/hello")
    public String handle01(){
        return "Hello, Spring Boot 2!";
    }

}
```

#### 2.5、测试

直接运行main方法 

#### 2.6、简化配置

application.properties 

server.port=8888 

#### 2.7、简化部署

```
 <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

把项目打成jar包，直接在目标服务器执行即可。 



