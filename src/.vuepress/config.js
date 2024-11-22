// .vuepress/config.js

module.exports = {
    // 网站 Title
    title: 'Csrsm',
  
    // 网站描述
    description: 'This is my blog',
    head:[
      ['link',{rel:'icon',href:'/img/favicon.ico'}]
    ],
    dest: './dist',

    base:'/post-ci/',
  
    // 网站语言
    locales: {
      '/': {
        lang: 'zh-CN',
      },
    },
  
    // 使用的主题
    theme: 'meteorlxy',
  
    // 主题配置
    themeConfig: {
      // 主题语言，参考下方 [主题语言] 章节
      lang: 'zh-CN',

      // 评论配置
      comments: false,
  
      // 个人信息（没有或不想设置的，删掉对应字段即可）
      personalInfo: {
        // 昵称
        nickname: '小二哥',
  
        // 个人简介 (支持 HTML)
        description: 'Don`t Worry Be Happy!',
  
        // 电子邮箱
        email: 'csrsming@163.com',
  
        // 所在地
        location: 'DaLian City, China',
  
        // 组织
        organization: 'DaLian University of Technology',
        avatar: '/img/cm.jpg',
        // 头像
        // 设置为外部链接
        // avatar: 'http://img.icoisini.xyz/cm.jpg',
        // 或者放置在 .vuepress/public 文件夹，例如 .vuepress/public/img/avatar.jpg
        // avatar: '/img/avatar.jpg',
        
  
        // 社交平台帐号信息
        sns: {
          // Github 帐号和链接
          github: {
            account: 'csrsm',
            link: 'https://github.com/csrsm',
          }
        }
      },
  
      // 上方 header 的相关设置 (可选)
      header: {
        // header 的背景，可以使用图片，或者随机变化的图案（geopattern）
        background: {
          // 使用图片的 URL，如果设置了图片 URL，则不会生成随机变化的图案，下面的 useGeo 将失效
          url: '/img/background.jpg',
          // url:'/img/background.jpg',
  
          // 使用随机变化的图案，如果设置为 false，且没有设置图片 URL，将显示为空白背景
          useGeo: true,
        },
  
        // 是否在 header 显示标题
        showTitle: true,
      },
  
      // 底部 footer 的相关设置 (可选)
      footer: {
        // 是否显示 Powered by VuePress
        poweredBy: false,
  
        // 是否显示使用的主题
        poweredByTheme: false,
  
        // 添加自定义 footer (支持 HTML)
        custom: 'Copyright 2016-present <a href="https://github.com/csrsm" target="_blank">csrsm</a>',
      },
  
      // 个人信息卡片相关设置 (可选)
      infoCard: {
        // 卡片 header 的背景，可以使用图片，或者随机变化的图案（geopattern）
        headerBackground: {
          // 使用图片的 URL，如果设置了图片 URL，则不会生成随机变化的图案，下面的 useGeo 将失效
          // url: '/img/wx-background.jpg',
          url: '/img/wx-background.jpg',

          // 使用随机变化的图案，如果设置为 false，且没有设置图片 URL，将显示为空白背景
          useGeo: true,
        },
      },
  
      // 是否显示文章的最近更新时间
      lastUpdated: true,
  
      // 顶部导航栏内容
      nav: [
        { text: '首页', link: '/', exact: true },
        { text: 'Csrsm', link: '/posts/', exact: false }
      ],
  
      // 是否开启平滑滚动
      smoothScroll: true,
  
      // vuepress-plugin-zooming 的配置项
      zooming: {
        // @see https://vuepress.github.io/en/plugins/zooming
      },
  
      // 评论配置，参考下方 [页面评论] 章节
      comments: {
        owner: 'meteorlxy',
        repo: 'vuepress-theme-meteorlxy',
        clientId: 'MY_CLIENT_ID',
        clientSecret: 'MY_CLIENT_SECRET',
      },
  
      // 分页配置 (可选)
      pagination: {
        perPage: 5,
      },
  
      // 默认页面（可选，默认全为 true）
      defaultPages: {
        // 是否允许主题自动添加 Home 页面 (url: /)
        home: true,
        // 是否允许主题自动添加 Posts 页面 (url: /posts/)
        posts: true
      },
    },
  }