(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{510:function(e,r,a){"use strict";a.r(r);var s=a(5),t=Object(s.a)({},(function(){var e=this,r=e.$createElement,a=e._self._c||r;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("p",[e._v("Eureka的自我保护机制")]),e._v(" "),a("h3",{attrs:{id:"eureka的自我保护机制"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#eureka的自我保护机制"}},[e._v("#")]),e._v(" Eureka的自我保护机制")]),e._v(" "),a("p",[e._v("为什么会产生自我保护机制？")]),e._v(" "),a("p",[e._v("为防止EurekaClient可以正常运行，但是与EurekaServer网络不同的情况下，EurekaServer不会立刻将EurekaClient服务剔除。")]),e._v(" "),a("p",[e._v("什么是自我保护机制？")]),e._v(" "),a("p",[e._v("默认情况下，当Eureka server在一定时间内没有收到实例的心跳，便会把该实例从注册表中删除（默认是90秒），但是，如果短时间内丢失大量的实例心跳，便会触发eureka server的自我保护机制。")]),e._v(" "),a("p",[e._v("比如在开发测试时，需要频繁地重启微服务实例，但是我们很少会把eureka server一起重启（因为在开发过程中不会修改eureka注册中心），当一分钟内收到的心跳数大量减少时，会触发该保护机制。可以在eureka管理界面看到Renews threshold和Renews(last min)，当后者（最后一分钟收到的心跳数）小于前者（心跳阈值）的时候，触发保护机制，会出现红色的警告：")]),e._v(" "),a("p",[e._v("EMERGENCY!EUREKA MAY BE INCORRECTLY CLAIMING INSTANCES ARE UP WHEN THEY'RE NOT.RENEWALS ARE LESSER THAN THRESHOLD AND HENCE THE INSTANCES ARE NOT BEGING EXPIRED JUST TO BE SAFE.")]),e._v(" "),a("p",[e._v("从警告中可以看到，eureka认为虽然收不到实例的心跳，但它认为实例还是健康的，eureka会保护这些实例，不会把它们从注册表中删掉。")]),e._v(" "),a("p",[e._v("在自我保护模式中，EurekaServer会保护服务注册表中的信息，不再注销任何服务实例。")]),e._v(" "),a("p",[e._v("综上，自我保护模式是一种应对网络异常的安全保护措施它的架构哲学是宁可同时保留所有微服务，也不忙保姆注销如何健康的微服务，使用自我保护模式，可以让Eureka集群更加健壮，稳定。")]),e._v(" "),a("p",[e._v("署于CAP 的AP分支。")]),e._v(" "),a("p",[e._v("如何禁止自我保护机制")]),e._v(" "),a("p",[e._v("服务提供者：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("lease-renewal-interval-in-seconds: 1 # eureka客户端向服务端发送心跳的时间间隔 单位秒 默认30\nlease-expiration-duration-in-seconds: 2 # eureka\n")])])]),a("p",[e._v("注册中心配置：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("server:\n  enable-self-preservation: false # 关闭自我保护机制 保证不可用服务及时清除\n  eviction-interval-timer-in-ms: 2000\n")])])])])}),[],!1,null,null,null);r.default=t.exports}}]);