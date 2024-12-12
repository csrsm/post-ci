---
category: hello_world
title: Hello, world!
top: true
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
  - hello_world
date: 2019-01-21
---

小二，上酒

<!-- more -->

Don`t Worry Be Happy!





# Readme

## 博客服务运行环境

- node版本  v14+
- npm版本   6+



## 运行命令

```javascript
// 运行命令具体看 package.json文件种的script部分
// 构建命令
npm run build
// 本地运行命令
npm run start

// 约定优于配置 
// 按照需求合理建立文件夹结构
// md格式文件需要写清楚文件头，具体可以打开源码模式直接复制其它的md文件内容的头部
// 示例
---
category: hello_world                    // 类别
title: Hello, world!                     // 标题
top: true                                // 是否置顶
header-title: true                       // 是否显示标题
header-image:                            // 背景图
  - http://img.icoisini.xyz/background.jpg
tags:                                    // 所属标签，可以有多个
  - hello_world                     
date: 2019-01-21                         // 日期
---


// 新增文件后，运行构建命令，更新dist文件夹，运行时可能会报以下错误信息
# error Error rendering /posts/2020/11/23/vue.html: false
// 该错误信息是因为md文档没有解析成功，请检查md文件中是否包含一些带有特殊符号的内容，
// 例如网址、请求url等，如果有，请使用代码块进行包裹。

// 将构建后更新的dist文件夹以及修改的md文档更新至git即可
// 修改之前建议先进行pull操作，拉去最新的内容

// push成功之后，gitee页面，在csrsm-blog项目中，点击服务-> Gitee Pages
// 然后点击 更新 按钮即可部署更新后的内容到 http://csrsm.gitee.io/csrsm-blog

```
## 注意事项

vue-press相关配置说明参考

[掘金]: https://juejin.cn/post/6844903747479404557
[官方网站]: https://vuepress.vuejs.org/zh/guide/



```javascript
md文件中引入图片时，需要在.vuepress\public\img路径下建立对应的文件夹，将自己的图片文件放入对应文件夹中，md文件引用时，使用以下方式进行引用即可：
<img :src="$withBase('/img/java/双亲委派机制.png')" alt="双亲委派机制"> 
```

