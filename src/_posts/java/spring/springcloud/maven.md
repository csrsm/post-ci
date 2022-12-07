---
category: csrsm
title: dependencyManagement和dependencies
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - java
  - maven
date: 2020-11-23
---

dependencyManagement和dependencies

<!-- more -->

# dependencyManagement和dependencies

**dependencyManagement**：提供了一种管理依赖版本号的方式。

通常会在一个组织或者项目的最顶层的父pom中看到。

使用pom.xml中的dependencyManagement元素能让所有在子项目中引用一个依赖而不用显式的列出版本号。

Maven会沿着父子层次向上走，直到找到一个拥有dependencyManagement元素的项目，然后使用这个dependencyManagement元素中指定的版本号。子项目则不需要指定版本号，达到一次修改处处生效。

**只是父类的依赖声明，并不实现引入**，只有在子项目中声明，才会引入。

子项目中使用dependencies指定版本号时，优先指定子项目中的版本。

例如：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>2.2.2.RELEASE</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-dependencies</artifactId>
      <version>Hoxton.SR1</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-alibaba-dependencies</artifactId>
      <version>2.1.0.RELEASE</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>${mysql.version}</version>
    </dependency>
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>${druid.version}</version>
    </dependency>
    <dependency>
      <groupId>org.mybatis.spring.boot</groupId>
      <artifactId>mybatis-spring-boot-starter</artifactId>
      <version>${mybatis.spring.boot.version}</version>
    </dependency>
  </dependencies>
</dependencyManagement>
```