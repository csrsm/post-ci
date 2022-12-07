---
category: csrsm
title: 浅谈Shiro
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - java
  - shiro
date: 2020-11-23
---
## Shiro三个核心组件

1.Subject：表示当前跟软件交互的东西，可以认为是用户概念

2.SecurityManager：shiro框架的核心，典型的Facade模式（即为多个子系统提供一个共同的对外接口），shiro通过它来管理内部组件实例，并通过它来提供安全管理的各种服务。

3.Realm：当对用户执行认证（登录）和授权（访问控制）验证时，Shiro会从应用配置的Realm中查找用户及其权限信息。实质上是一个安全相关的DAO：它封装了数据源的连接细节，并在需要时将相关数据提供给Shiro。当配置Shiro时，你必须至少指定一个Realm，用于认证和（或）授权。配置多个Realm是可以的，但是至少需要一个。

## Shiro相关类介绍	

- principal 身份信息，通常是唯一的，一个主体还有多个身份信息，但是都有一个主身份信息（primary principal）
- credential 凭证信息，可以是密码 、证书、指纹。
- Authentication 认证 ---- 用户登录
- Authorization 授权 --- 用户具有哪些权限
- Cryptography 安全数据加密
- Session Management 会话管理
- Web Integration web系统集成
- Interations 集成其它应用，spring、缓存框架

## 特点：

（1）易于理解的 Java Security API；
（2）简单的身份认证（登录），支持多种数据源（LDAP，JDBC，Kerberos，ActiveDirectory 等）；
（3）对角色的简单的签权（访问控制），支持细粒度的签权；（数据级别的权限管理）
（4）支持一级缓存，以提升应用程序的性能；
（5）内置的基于 POJO 企业会话管理，适用于 Web 以及非 Web 的环境；
（6）异构客户端会话访问；
（7）非常简单的加密 API；
（8）不跟任何的框架或者容器捆绑，可以独立运行

## 构建流程：

CustomRealm：自定义Realm用于认证并查询用户的角色和权限信息并保存到权限管理器

```java
package com.wsl.shiro;

import com.wsl.bean.Permissions;
import com.wsl.bean.Role;
import com.wsl.bean.User;
import com.wsl.service.LoginService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

public class CustomRealm extends AuthorizingRealm {

    @Autowired
    private LoginService loginService;

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        //获取登录用户名
        String name = (String) principalCollection.getPrimaryPrincipal();
        //根据用户名去数据库查询用户信息
        User user = loginService.getUserByName(name);
        //添加角色和权限
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        for (Role role : user.getRoles()) {
            //添加角色
            simpleAuthorizationInfo.addRole(role.getRoleName());
            //添加权限
            for (Permissions permissions : role.getPermissions()) {
                simpleAuthorizationInfo.addStringPermission(permissions.getPermissionsName());
            }
        }
        return simpleAuthorizationInfo;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        //加这一步的目的是在Post请求的时候会先进认证，然后在到请求
        if (authenticationToken.getPrincipal() == null) {
            return null;
        }
        //获取用户信息
        String name = authenticationToken.getPrincipal().toString();
        User user = loginService.getUserByName(name);
        if (user == null) {
            //这里返回后会报出对应异常
            return null;
        } else {
            //这里验证authenticationToken和simpleAuthenticationInfo的信息
            SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(name, user.getPassword().toString(), getName());
            return simpleAuthenticationInfo;
        }
    }
}

```

ShiroConfig：把CustomRealm、ShiroFilterFactoryBean、DefaultAdvisorAutoProxyCreator和SecurityManager等注入到spring容器

```java
import com.wsl.shiro.CustomRealm;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class shiroConfig {
    
    @Bean
    @ConditionalOnMissingBean
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator defaultAAP = new DefaultAdvisorAutoProxyCreator();
        defaultAAP.setProxyTargetClass(true);
        return defaultAAP;
    }

    //将自己的验证方式加入容器
    @Bean
    public CustomRealm myShiroRealm() {
        CustomRealm customRealm = new CustomRealm();
        return customRealm;
    }

    //权限管理，配置主要是Realm的管理认证
    @Bean
    public SecurityManager securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(myShiroRealm());
        return securityManager;
    }

    //Filter工厂，设置对应的过滤条件和跳转条件
    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        Map<String, String> map = new HashMap<>();
        //登出
        map.put("/logout", "logout");
        //对所有用户认证
        map.put("/**", "authc");
        //登录
        shiroFilterFactoryBean.setLoginUrl("/login");
        //首页
        shiroFilterFactoryBean.setSuccessUrl("/index");
        //错误页面，认证不通过跳转
        shiroFilterFactoryBean.setUnauthorizedUrl("/error");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(map);
        return shiroFilterFactoryBean;
    }
  
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager) {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }
}
```

登陆时，获取subject，SecurityUtils.getSubject()，通过用户名密码生成UsernamePasswordToken，调用login方法，subject.login(usernamePasswordToken)，通过catch的异常判断认证结果。

## ⚠️当项目基于前后台分离时：

前端需要响应数据判断当前认证状态以及登出状态等

1. 用户认证失败时，需要自定义认证拦截，需要继承FormAuthenticationFilter类，重写onAccessDenied方法，返回自定义响应值，否则默认重定向跳转login请求，当后台没有跨域相关的配置时，可能存在跨域问题。自定义认证拦截需配置到shiroConfig类中，在shiroFilterFactoryBean工厂中filterMap.put("authc",new MyFilter())，并放到shiroFilterFactoryBean中。
2. 登出时，需要自定义登出拦截器，继承shiro的LogoutFilter重写preHandle，返回自定义响应值，否则默认重定向到logout，同样存在跨域问题，同样需要在shiroConfig中配置到shiroFilterFactoryBean中。

