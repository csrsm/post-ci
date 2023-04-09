(window.webpackJsonp=window.webpackJsonp||[]).push([[56],{560:function(t,a,v){"use strict";v.r(a);var _=v(5),s=Object(_.a)({},(function(){var t=this,a=t.$createElement,v=t._self._c||a;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("h1",{attrs:{id:"微服务简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#微服务简介"}},[t._v("#")]),t._v(" 微服务简介")]),t._v(" "),v("h2",{attrs:{id:"_1-特征"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-特征"}},[t._v("#")]),t._v(" 1.特征")]),t._v(" "),v("ol",[v("li",[t._v("单一职责：拆分粒度更小，每个服务对应唯一的业务能力，做到单一职责，避免重复开发")]),t._v(" "),v("li",[t._v("面向服务：对外暴露业务接口")]),t._v(" "),v("li",[t._v("自治：团队独立、技术独立、数据独立、部署独立")]),t._v(" "),v("li",[t._v("隔离性强：服务调用做好隔离、容错、降级，避免出现级联问题")])]),t._v(" "),v("h2",{attrs:{id:"_2-技术对比"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2-技术对比"}},[t._v("#")]),t._v(" 2.技术对比")]),t._v(" "),v("table",[v("thead",[v("tr",[v("th"),t._v(" "),v("th",[t._v("Dubbo")]),t._v(" "),v("th",[t._v("SpringCloud")]),t._v(" "),v("th",[t._v("SpringCloudAlibaba")])])]),t._v(" "),v("tbody",[v("tr",[v("td",[t._v("注册中心")]),t._v(" "),v("td",[t._v("zookeeper、redis")]),t._v(" "),v("td",[t._v("Eureka、consul")]),t._v(" "),v("td",[t._v("Nacos、Eureka")])]),t._v(" "),v("tr",[v("td",[t._v("远程服务调用")]),t._v(" "),v("td",[t._v("Dubbo协议")]),t._v(" "),v("td",[t._v("Feign（http协议）")]),t._v(" "),v("td",[t._v("Dubbo、Feign")])]),t._v(" "),v("tr",[v("td",[t._v("配置中心")]),t._v(" "),v("td",[t._v("无")]),t._v(" "),v("td",[t._v("SpringCloudConfig")]),t._v(" "),v("td",[t._v("SpringCloudConfig、Nacos")])]),t._v(" "),v("tr",[v("td",[t._v("服务网关")]),t._v(" "),v("td",[t._v("无")]),t._v(" "),v("td",[t._v("SpringCloudGateway、Zuul")]),t._v(" "),v("td",[t._v("SpringCloudGateway、Zuul")])]),t._v(" "),v("tr",[v("td",[t._v("服务监控与保护")]),t._v(" "),v("td",[t._v("dubbo-admin 功能弱")]),t._v(" "),v("td",[t._v("Hystrix")]),t._v(" "),v("td",[t._v("Sentinel")])])])]),t._v(" "),v("p",[t._v("四种工作场景：")]),t._v(" "),v("ul",[v("li",[t._v("SpringCloud + Feign")]),t._v(" "),v("li",[t._v("SpringCloudAlibaba + Feign")]),t._v(" "),v("li",[t._v("SpringCloudAlibaba + Dubbo")]),t._v(" "),v("li",[t._v("Dubbo")])]),t._v(" "),v("p",[t._v("3.SpringCloud\n"),v("img",{attrs:{src:t.$withBase("/img/java/微服务1.png")}})]),t._v(" "),v("h2",{attrs:{id:"_4-远程调用"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_4-远程调用"}},[t._v("#")]),t._v(" 4.远程调用")]),t._v(" "),v("ul",[v("li",[t._v("基于restTemplate发起的http请求实现远程调用")]),t._v(" "),v("li",[t._v("http请求做远程调用与语言无关，只需要知道对方服务的IP、端口、接口路径、入参即可")])]),t._v(" "),v("h1",{attrs:{id:"具体技术实现"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#具体技术实现"}},[t._v("#")]),t._v(" 具体技术实现")]),t._v(" "),v("h2",{attrs:{id:"_1-eureka注册中心"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-eureka注册中心"}},[t._v("#")]),t._v(" 1.Eureka注册中心")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务2.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务3.png")}}),t._v(" "),v("h2",{attrs:{id:"_2-rebbon负载均衡"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2-rebbon负载均衡"}},[t._v("#")]),t._v(" 2.Rebbon负载均衡")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务4.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务5.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务6.png")}}),t._v(" "),v("h2",{attrs:{id:"_3-nacos"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-nacos"}},[t._v("#")]),t._v(" 3.Nacos")]),t._v(" "),v("h3",{attrs:{id:"_3-1-nacos注册中心"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-nacos注册中心"}},[t._v("#")]),t._v(" 3.1 Nacos注册中心")]),t._v(" "),v("p",[v("strong",[t._v("负载均衡：")]),t._v("\nNacosRule 优先访问本地集群服务实例，当没有本地实例需要跨集群访问是，日志会打印警告信息。确定实例集群后，执行随机策略。\n"),v("strong",[t._v("根据权重负载均衡：")]),t._v("\n在Nacos控制台设置权重值。权重值为0时，不会访问该实例。\n"),v("strong",[t._v("环境隔离：")]),t._v("\n通过namespace实现，每一个namespace有一个唯一的id，不同的namespace下的服务不可见。\n默认是临时实例，临时实例只采用心跳检测，不会主动询问服务是否正常，不正常时会被踢出服务列表。而非临时实例，当服务挂掉时会主动询问服务是否正常，不会被踢出服务列表中，配置：ephemeral: false（非临时）\n"),v("strong",[t._v("原理分析：")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务7.png")}}),t._v(" "),v("strong",[t._v("Nacos与Eureka：")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务8.png")}})]),t._v(" "),v("h3",{attrs:{id:"_3-2-nacos配置管理"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-nacos配置管理"}},[t._v("#")]),t._v(" 3.2 Nacos配置管理")]),t._v(" "),v("p",[t._v("bootstrap.yml文件加载是在项目启动时，在application.yml之前，nacos配置管理相关的配置信息需要在bootstrap.yml文件中进行配置。\n"),v("img",{attrs:{src:t.$withBase("/img/java/微服务9.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务10.png")}}),t._v(" "),v("strong",[t._v("实现配置热更新的两种方式：")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("在注入配置的类上增加@RefreshScope注解")])]),t._v(" "),v("li",[v("strong",[t._v("使用@ConfigurationProperties注解，将配置注入到配置bean中")])])]),t._v(" "),v("h3",{attrs:{id:"_3-3-远程调用feign"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-远程调用feign"}},[t._v("#")]),t._v(" 3.3 远程调用Feign")]),t._v(" "),v("p",[v("strong",[t._v("使用步骤：")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("引入依赖")])]),t._v(" "),v("li",[v("strong",[t._v("添加EnableFeignClients注解")])]),t._v(" "),v("li",[v("strong",[t._v("编写FeignClient接口")])]),t._v(" "),v("li",[v("strong",[t._v("使用FeignClient中定义的方法代替RestTemplate")])])]),t._v(" "),v("p",[v("strong",[t._v("自定义配置：")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务11.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务12.png")}}),t._v(" "),v("strong",[t._v("Feign性能优化：")]),t._v(" "),v("strong",[t._v("底层客户端实现：")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("URLConnection：默认实现，不支持连接池")])]),t._v(" "),v("li",[v("strong",[t._v("Apache HttpClient：支持连接池")])]),t._v(" "),v("li",[v("strong",[t._v("OKHttp：支持连接池")])])]),t._v(" "),v("p",[v("strong",[t._v("性能优化：")])]),t._v(" "),v("ol",[v("li",[v("strong",[t._v("使用连接池代替URLConnection")])]),t._v(" "),v("li",[v("strong",[t._v("日志级别，最好使用basic或者none")])])]),t._v(" "),v("p",[v("strong",[t._v("Feign最佳实现：")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务13.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务14.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务15.png")}})]),t._v(" "),v("h3",{attrs:{id:"_3-4-网关gateway"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-网关gateway"}},[t._v("#")]),t._v(" 3.4 网关Gateway")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务16.png")}}),t._v(" \n**网关技术实现：**\n"),v("ul",[v("li",[v("strong",[t._v("gateway：基于spring5中提供的WebFlux，属于响应式编程的实现，具备更好的性能")])]),t._v(" "),v("li",[v("strong",[t._v("zuul：基于servlet实现，属于阻塞时编程")])])]),t._v(" "),v("p",[v("strong",[t._v("路由断言工厂RoutePredicateFactory")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务17.png")}}),t._v("\n重点关注路由过滤器配置、全剧过滤器、过滤器链的执行顺序以及cors跨域配置。")]),t._v(" "),v("h2",{attrs:{id:"_4-docker"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_4-docker"}},[t._v("#")]),t._v(" 4. Docker")]),t._v(" "),v("h3",{attrs:{id:"_4-1-初识docker"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-初识docker"}},[t._v("#")]),t._v(" 4.1 初识docker")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务18.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务19.png")}}),t._v(" \n**Docker 和虚拟机的区别：**\n"),v("img",{attrs:{src:t.$withBase("/img/java/微服务20.png")}}),t._v(" \n**镜像和容器：**\n"),v("ul",[v("li",[v("strong",[t._v("镜像（Image）：")])])]),t._v(" "),v("p",[v("strong",[t._v("Docker 将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，成为镜像。")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("容器（container）：")])])]),t._v(" "),v("p",[v("strong",[t._v("镜像中的应用程序运行后形成的进程就是容器，只是Docker会给容器做隔离，对外不可见。")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("DockerHub：")])])]),t._v(" "),v("p",[v("strong",[t._v("是Docker镜像的托管平台，这样的平台称为Docker Registry")])]),t._v(" "),v("p",[v("strong",[t._v("自定义镜像：")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务21.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务22.png")}})]),t._v(" "),v("h2",{attrs:{id:"_5-mq"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_5-mq"}},[t._v("#")]),t._v(" 5. MQ")]),t._v(" "),v("p",[v("strong",[t._v("同步调用问题：（Feign调用就是同步调用）")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("耦合度高，违背开闭原则，每次加入新需求都需要修改代码。")])]),t._v(" "),v("li",[v("strong",[t._v("性能下降，调用者需要等待服务提供者响应，如果调用链过长则响应时间等于每次调用的时间之和。")])]),t._v(" "),v("li",[v("strong",[t._v("资源浪费，调用链中的每个服务在等待响应的过程中，不能释放请求占用的资源，高并发场景下会极度的浪费系统资源。")])]),t._v(" "),v("li",[v("strong",[t._v("级联失败，如果服务提供者出现问题，所有调用方都会跟着出问题，迅速导致整个微服务群故障。")])])]),t._v(" "),v("p",[v("strong",[t._v("异步调用优势：（事件驱动模式）")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("服务解耦")])]),t._v(" "),v("li",[v("strong",[t._v("性能提升，吞吐量提高")])]),t._v(" "),v("li",[v("strong",[t._v("服务间没有强依赖，不用担心级联失败的问题")])]),t._v(" "),v("li",[v("strong",[t._v("流量削峰")])])]),t._v(" "),v("p",[v("strong",[t._v("异步调用缺点：")])]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("依赖broker的可靠性、安全性、吞吐能力")])]),t._v(" "),v("li",[v("strong",[t._v("架构复杂，业务没有明显的流程线，不好跟踪管理")])])]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务23.png")}}),t._v(" \n**RabbitMQ**\n"),v("img",{attrs:{src:t.$withBase("/img/java/微服务24.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务25.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务26.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务27.png")}}),t._v(" "),v("p",[v("strong",[t._v("SpringAMQP")]),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务28.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务30.png")}}),t._v(" "),v("img",{attrs:{src:t.$withBase("/img/java/微服务29.png")}})])])}),[],!1,null,null,null);a.default=s.exports}}]);