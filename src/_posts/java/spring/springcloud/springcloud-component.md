---
category: peiheLiu
title: springcloud各个组件
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - java
  - springcloud
date: 2022-05-10
---

问答

<!-- more -->

# 用过的springcloud框架或者组件都有哪些？

**gateway**：网关。

路由：统一前缀、路由策略配置、服务名屏蔽、路径屏蔽、敏感请求头屏蔽
过滤功能：限流 ，灰度发布 ，权限控制

**eureka**：注册中心。

**Hystrix**：断路器。

Hystrix 就是一个能进行 熔断 和 降级 的库，通过使用它能提高整个系统的弹性。
所谓 熔断 就是服务雪崩的一种有效解决方案。当指定时间窗内的请求失败率达到设定阈值时，系统将通过 断路器 直接将此请求链路断开。
降级是为了更好的用户体验，当一个方法调用异常时，通过执行另一种代码逻辑来给用户友好的回复。

**ribbon**：基于Http和Tcp的客户端负载均衡，使得面向REST请求时变换为客户端的负载服务调用，提供客户端的软件负载均衡算法。

Ribbon 是一个客户端/进程内负载均衡器，运行在消费者端 。
其工作原理就是 Consumer 端获取到了所有的服务列表之后，在其内部 使用负载均衡算法 ，进行对多个系统的调用。

**Nginx 和 Ribbon 的对比**

nginx 是客户端所有请求统一交给 nginx，由 nginx 进行实现负载均衡请求转发，属于服务器端负载均衡。
Ribbon 是从 eureka 注册中心服务器端上获取服务注册信息列表，缓存到本地，然后在本地实现轮询负载均衡策略，属于客户端负载均衡。

**Open Feign**

OpenFeign 也是运行在消费者端的，使用 Ribbon 进行负载均衡，所以 OpenFeign 直接内置了 Ribbon。 主要用于消费者和服务者的调用。

**SpringCloud-Config**：配置管理

使用 Bus 消息总线 + Spring Cloud Config 进行配置的动态刷新。

**SpringCloud-Bus**：消息总线

 Spring Cloud Bus 的作用就是管理和广播分布式系统中的消息 ，也就是消息引擎系统中的广播模式。当然作为 消息总线 的Spring Cloud Bus 可以做很多事而不仅仅是客户端的配置刷新功能。
拥有了 Spring Cloud Bus 之后，我们只需要创建一个简单的请求，并且加上 @ResfreshScope 注解就能进行配置的动态修改了 。