---
category: csrsm
title: Vue
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - 前端
  - Vue
date: 2020-11-23
---


# vue-router

1. ### Vue Router 是干嘛的？ 

>  用 Vue.js + Vue Router 创建单页应用。

2. ### 什么是单页应用

> 单页应用的全称是 single-page application，简称 SPA，它是一种网站应用的模型，它可以动态重写当前的页面来与用户交互，而不需要重新加载整个页面。
> 说白就是无刷新，整个webapp就一个html文件，里面的各个功能页面是javascript通过hash,或者history api来进行路由，并通过ajax拉取数据来实现响应功能。因为整个webapp就一个html，所以叫单页面！

3. ### hash和history是啥？

    > `vue-router` 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。如果不想要很丑的 hash，我们可以用路由的 **history 模式**，这种模式充分利用 `history.pushState` API 来完成 URL 跳转而无须重新加载页面

    #### 3.1 为什么要有hash和history？

    > 对于 Vue 这类渐进式前端开发框架，为了构建 SPA（单页面应用），需要引入前端路由系统，这也就是 Vue-Router 存在的意义。前端路由的核心，就在于 —— 改变视图的同时不会向后端发出请求。为了达到这一目的，浏览器当前提供了以下两种支持：

    + hash —— 即地址栏 URL 中的 # 符号（此 hash 不是密码学里的散列运算）。

    比如这个 URL：

    ```
    http://localhost:8080/#/hello
    ```

    hash 的值为 #/hello。它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

    + history —— 利用了 HTML5 History Interface 中新增的 pushState() 和replaceState() 方法。（需要特定浏览器支持）

    > 这两个方法应用于浏览器的历史记录栈，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。只是当它们执行修改时，虽然改变了当前的 URL，但浏览器不会立即向后端发送请求。因此可以说，hash 模式和 history 模式都属于浏览器自身的特性，Vue-Router 只是利用了这两个特性（通过调用浏览器提供的接口）来实现前端路由。

    

    > history 也不是样样都好。SPA 虽然在浏览器里游刃有余，但真要通过 URL 向后端发起 HTTP 请求时，两者的差异就来了。尤其在用户手动输入 URL 后回车，或者刷新（重启）浏览器的时候。

    + hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 

      ```
      http://www.abc.com
      ```

      ，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。

    + history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如

      ```
      http://www.abc.com/book/id
      ```

      如果后端缺少对 /book/id 的路由处理，将返回 404 错误。[Vue-Router 官网](https://router.vuejs.org/zh-cn/essentials/history-mode.html)里如此描述：“不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。”

    

4. ### 单页面应用和多页面应用的区别是啥？各自使用场景是啥？

    > 单页面应用（SinglePage Web Application，SPA）
    > 只有一张Web页面的应用，是一种从Web服务器加载的富客户端，单页面跳转仅刷新局部资源 ，公共资源(js、css等)仅需加载一次，常用于PC端官网、购物等网站

  <img :src="$withBase('/img/one.png')" alt="单架构">

> 多页面应用（MultiPage Application，MPA）
> 多页面跳转刷新所有资源，每个公共资源(js、css等)需选择性重新加载，常用于 app 或 客户端等

  <img :src="$withBase('/img/more.png')" alt="单架构">

+ 区别：

  <img :src="$withBase('/img/more.png')" alt="单架构">

+ 备注：

> vue对seo太不友好了，单页面SPA应用就是实时渲染的，爬虫都爬不到SEO是搜索引擎优化的意思。
> 主要是优化好自己的网站，方zhi便搜索引擎找到你，让你的排名在搜索的时候可以排在前面。让更多的人知道你的网站，是网站推广的一种方式SSR服务端渲染：SSR的出现一定程度上解决了SPA首屏慢的问题，又极大的减少了SPA对于SEO的不利影响。

+ 优点：更快的响应时间，不用等待所有的js都下载完成，显示器便能显示出比较完整的页面；

​            更好的SSR，我们可以将SEO关键信息直接在后台渲染成html，从而保证了搜索引擎可以提取到相应数据。

+ 缺点：占用了大量的CPU和内存资源

>  vue的服务端渲染框架——NUXT

+ 课后问题：服务端渲染和客户端的渲染的区别和优缺点？


## 页面跳转
 1. 定义 (路由) 组件。
 2. 定义路由
 3. 创建 router 实例，然后传 `routes` 配置
 4. 创建和挂载根实例。

## 页面传值
### query ? id = 1  
```javascript
<router-link :to="`/foo?id=${item.id}`"> {{item.name}}</router-link>
```



### 获取query传递参数
```javascript
this.$route.query.id
```



### 动态路由传值

>  动态路由：我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 `User` 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。

```javascript
 { path: '/info/:id', component: info }
 <router-link to="/info/6"> 动态路由传值 菠萝</router-link>

 { path: '/info/:id/:name', component: info }  // 参数不能少
```



### 高级匹配

```javascript
 {
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}
```



> 优先级：同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。

 ## 嵌套路由 一个页面有多个子页面
```
  {
    path: '/names',
    component: names, 
    <!-- redirect:"/names/c",  //重定向  ：默认跳转页面   -->
    children: [{
        path: 'a',  // names/a    a前不加/ 以父元素为根节点   加/以域名为根节点
        component: a
      },
      {
        path: 'b', // names/b
        component: b
      },
      {
        path: 'c',
        component: c
      },
      {
        path: 'd',
        component: d
      }
    ]
  },

   <ul>
      <li>
          <router-link to="/names/a">a页面</router-link>
          <router-link to="/names/b">b页面</router-link>
          <router-link to="/names/c">c页面</router-link>
          <router-link to="/names/d">d页面</router-link>
          </li>
    </ul>
    <router-view></router-view>
```



## 路由跳转的几种写法
### 字符串的方式跳转
```javascript
<router-link :to="`/foo?id=${item.id}`"> {{item.name}}</router-link>
```



### 对象的方式跳转
```javascript
<router-link :to="{path: '/bar'}">Go to Bar</router-link>
```



### 对象的方式传值
```javascript
<router-link :to="{path: '/bar',query:{id:7}}">Go to Bar</router-link>
```



### 对象的方式动态路由
```javascript
不能直接传递  用到命名路由
<router-link :to="{name: 'info',params:{id:7,name:'测试'}}">Go to   Info<router-link>

{
    path: '/info/:id/:name',
    name: 'info', //命名路由
    component: info
  },

 注意：如果提供了 path，params 会被忽略，你需要提供路由的 name 或手写完整的带有参数的 path：
```



  ### js的方式传值

编程式导航

除了使用 `<router-link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现

| 声明式                    | 编程式             |
| ------------------------- | ------------------ |
| `<router-link :to="...">` | `router.push(...)` |

     <!-- window.location.href="" -->
    methods: {
      goto() {
        // this.$router   当前路由对象 获取当前路由属性和方法
        // this.$router  所有的路由对象 可以理解为routes 用于页面跳转
        // this.$router.push("/foo")
         this.$router.push({ path: '/foo' })
      },
      goto1() {
        
        //  this.$router.push("/info/6/daming")
         this.$router.push({ name: 'info', params: { id: 7, name: '测试' } })
      },
     
      goto2() {
        
        //  this.$router.push("/foo?id=1&name=大明" )
    
         this.$router.push({path: '/bar',query:{id:7}})
      }



## 导航守卫
控制页面间的跳转

### 全局守卫

+ 全局前置守卫
  用于控制路由的每一次跳转过程

  ```
  - //全局前置守卫
    router.beforeEach((to,from,next)=>{
        // to 代表去的路由 
        // from 代表来自于哪个路由
        // next 控制路由的跳转next()和取消跳转next(false) 
        // next 重新定向到某个页面 next("login")
        console.log(to,from,next);
        if(to.path == '/user' || to.path == '/goods'){
          var token = localStorage.getItem("token")
          if(token){
            next();
          }else{
            next("/login")
          }
          // next(false);
          // next("/login")
        }else{
          next();
        }
  
      })
  ```

  

+ 全局后置守卫 router.afterEach((to, from)  这些钩子不会接受 `next` 函数也不会改变导航本身

  修改title

+ 全局解析守卫 router.beforeResolve

  ```javascript
  //这里根据单页面name的指向不同，去访问的接口域名也不同
  router.beforeResolve((to, from, next) => {
    let url;
    if (
      to.matched[0].name == "broker-shop" ||
      to.matched[0].name == "information"
    ) {
      url = "https://ddd.zhaoshang800.com";
    } else if (to.matched[0].name == "brokerage-list") {
      url = "https://aaa.zhaoshang800.com";
    } else if (to.matched[0].name == "sellhot") {
      url = "https://bbb.zhaoshang800.com";
    } else if (to.matched[0].name == "enterprise-index") {
      url = "http://ccc.zhaoshang800.com";
    } else {
      url = "https://" + location.host;
    }
    axios.defaults.baseURL = url;
    next();
  });
  ```

  


### 路由守卫 :运行在路由上的守卫，只有进入到当前页面的时候才会执行的守卫函数
```
{
    path: '/user',
    component: user,
    beforeEnter(to,from,next){
        console.log(to,from,next);
        var token = localStorage.getItem("token")
    if(token){
      next();
    }else{
      next("/login")
    } 
    }
  },
```



### 组件守卫

+ beforeRouteEnter 进入组件之前执行的守卫函数
  //进入组件之前执行的守卫函数

  ```javascript
  //beforeRouteEnter 中不能访问当前组件实例的方法和属性
    beforeRouteEnter(to, from, next) {
      var token = localStorage.getItem("token")
      if (to.path == '/goods') {
        if (token) {
          next();
        } else {
          next("/login")
        }
      }
  
    },
  ```

  

+ beforeRouteUpdate 组件复用的时候执行的守卫函数 目前只有一种情况会复用 连续进入同一个动态路由页面的时候会复用
  复用就会导致组件创建阶段的生命周期钩子不会运行

  ```javascript
  // 组件被复用的时候调用的守卫函数
  beforeRouteUpdate(to,from,next){
    this.id=to.params.id;
    this.name=to.params.name;
    next()
  },
  ```

  


+ beforeRouteLeave 离开之前执行的守卫函数 beforeDestroy类似
  

  ```javascript
  
  // 在离开该组件执行的函数
    // next 不加就离不开当前页面 
    //   1. 浏览器前进后退 时提醒 阻止离开 不刷新  
    //   2. 清除页面定时器
  beforeRouteLeave(to, from, next) 
      var confirms = window.confirm('你是否填写完毕表单内容')
      if(confirms){
        next();
      }else{
        next(false);
      }   
  },
  ```
  

  

  ## 完整的导航解析流程

  1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。

  3. 调用全局的 `beforeEach` 守卫。

  4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。

  5. 在路由配置里调用 `beforeEnter`。

6. 解析异步路由组件。

  7. 在被激活的组件里调用 `beforeRouteEnter`。

8. 调用全局的 `beforeResolve` 守卫 (2.5+)。

  9. 导航被确认。

  10. 调用全局的 `afterEach` 钩子。

  11. 触发 DOM 更新。

  12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

      当点击切换路由时：beforeRouterLeave-->beforeEach-->beforeEnter-->beforeRouteEnter-->beforeResolve-->afterEach-->beforeCreate-->created-->beforeMount-->mounted-->beforeRouteEnter的next的回调

### 路由元信息

  路由元信息 定义在当前路由上面的自定义信息 这个可以被当前路由调用
  应用：页面标题的赋值


     {
        path: '/goods',
        // component: goods,
        meta:{
          title:"goods页面"
        },
        component: () => import('@/view/goods/index')
      },
    
    ### 过渡动画
      
     <transition :enter-active-class="currentClassname">
      <router-view></router-view>
    </transition>
      
    import '@/assets/css/animate.css' 
      
     watch: {
    $route: function (to, from) {
      console.log(to, from);
    //选用判断页面还是后退
      // 判断用户是进入还是离开的行为 可以通过地址栏长度进行判断
      // 如果to的路由长度 大于 from的路由长度 是进入行为   fadeInRight ，相反 是返回行为 fadeInLeft
      
      var toLength = to.path.split("/").length;
      var fromLength = from.path.split("/").length; 
        
      if (toLength > fromLength) {
        this.currentClassname = "fadeInRight animated";
      } else if (fromLength > toLength) {
      this.currentClassname = "fadeInLeft animated";
    } else {
        
        this.currentClassname = "fadeIn animated";
      } 
    },
  },

  ### 滚动行为
  传统开发 当页面切换的时候滚动条距离页面顶的高度为0
  单页面应用  当页面切换的时候滚动条距离页面顶的高度不变化


```javascript
export default new VueRouter({
  mode: "history", //hash history 默认hash url有#号
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes
  })
```



  ### 路由懒加载
```javascript
  () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
```


  通过这个写法 就大大的减少了初始化项目时app.js 文件的体积
