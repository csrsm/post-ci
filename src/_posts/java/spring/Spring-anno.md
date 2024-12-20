---
category: csrsm
title: Spring自定义注解
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

## 自定义注解

定义自定义注解：@interface

指定自定义注解允许出现的位置：@Target，可以定义多种类型

```
@Target({ElementType.TYPE,ElementType.FIELD})
public @interface Entity {
    public String value() default "";
}
```

#### **自定义注解的生命周期**

自定义注解仅存在于java源码中，当被jvm编译成字节码时，会自动丢失。

在自定义注解中加入以下注解可以解决：

```
@Retention(RetentionPolicy.RUNTIME)
```

#### **使用自定义注解**

1. 判断自定义注解是否存在

   ```
   clazz.isAnnotationPresent(Entity.class
   ```

2. 得到注解实例

   ```
   Entity entity = (Entity)clazz.getAnnotation(Entity.class);
   ```

3. 通过实例调用方法

   ```
   String entityName = entity.value();
   ```

