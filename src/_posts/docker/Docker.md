---
category: csrsm
title: Docker常用命令
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - docker
date: 2020-11-23
---
![img](https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1884518406,3782778982&fm=26&gp=0.jpg)

![img](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607450905867&di=6d5ceb067597312ed726cbaf6d72e5aa&imgtype=0&src=http%3A%2F%2Fimages.linoxide.com%2Fdocker-commands-cheatsheet-part2-700x900.png)



### 安装Docker

---

```shell
# 1、卸载老版本
 yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
# 2、更新yum-utils
 yum install -y yum-utils 
# 3、设置镜像仓库--使用阿里云镜像
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 4、更新yum
 yum makecache fast
    
# 5、安装docker   docker-ce  ce是社区版  ee是企业版 推荐使用ce版本
yum install docker-ce docker-ce-cli containerd.io

# 6、启动docker
systemctl start docker
# 7、使用命令docker version查看docker是否安装成功
docker version
# 8、测试hello-word镜像
docker run hello-world
# 9、配置阿里云镜像加速
centos配置：
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://2vd8an7e.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### Docker常用命令

---

帮助命令

```shell
# 查看docker版本信息
docker version
docker info
docker [command] --help 万能命令
```

官网api：https://docs.docker.com/engine/reference/commandline

### 镜像命令

**docker images**  # 查看所有镜像

```shell
可选参数
-a 列出所有镜像 
-q 只显示镜像id
```

**docker search**   #镜像搜索

```shell
可选参数
--filter 条件过来
例如 docker search mysql --filter=stars=3000 搜索stars3000以上的
```

**docker pull**  #下载镜像

```shell
docker pull 镜像
docker pull 镜像:tag
```

**docker rmi  -f **#删除镜像

```shell
docker rmi -f $(docker images -aq) 删除全部容器
```

**设置镜像标签**

```shell
 docker tag 860c279d2fec runoob/centos:dev
```

**创建镜像**

```shell
docker build dockerfile  #通过dockerfile 生产一个镜像
docker commit            #将容器转化成镜像，类似快照
```

**查看镜像够建过程**

```shell
docker history 镜像id     #查看镜像够建过程
```

**启动所有容器**

```text
docker start $(docker ps -a | awk '{ print $1}' | tail -n +2)
```

**关闭所有容器**

```text
docker stop $(docker ps -a | awk '{ print $1}' | tail -n +2)
```

**删除所有容器**

```text
docker rm $(docker ps -a | awk '{ print $1}' | tail -n +2)
```

**删除所有镜像（慎用）**

```text
docker rmi $(docker images | awk '{print $3}' |tail -n +2)
```

### 容器命令

有了镜像才可以创建镜像。

 **创建容器**  

```shell

docker run [可选参数] imagesName/imagesId
可选项
--name name       #给容器起名字
-d                #后台启动方式 前提是必须有一个前台进程，否则容器就停止了 
-it               #使用交互方式启动 后面跟/bin/bash
-P                #随机指定端口映射
-p                #指定容器端口 -p 8080(主机端口):8080(容器端口)
-v                #容器卷，用来容器内和主机间文件同步用
-c                #传入要执行的命令 -c "while true; do echo hello world; sleep 1; done"
--net             #指定网络
docker create  # 创建容器 但不启动
```

**退出容器**

```shell
exit              #容器停止并退出到主机
Ctrl + p + q      #不终止容器退出容器
```

**查看容器**

```xhell
docker ps          # 列处正在运行的容器

docker ps -a       # 列出历史运行的容器

docker ps -n=1     # 显示最近一条创建的容器

docker ps -q       # 只显示容器编号
```

**docker rm -f**        #强制删除容器

**容器启动和停止**

```shell
docker start        #启动容器

docker restart      #重启容器

docker stop         #停止容器

docker kill         #暴力停止容器
```

**进入容器**

```shell
docker attach 容器id              #退出后会停止容器
docker exec -it 容器id /bin/bash  #退出后容器不会停止
```

**导出和导入容器**

```shell
docker export 容器id > 名字.tar    #导出容器到tar包
cat docker/ubuntu.tar | docker import - test/ubuntu:v1 #将快照文件 ubuntu.tar 导入到镜像 test/ubuntu:v1
```

**日志**

```shell
docker logs -ft bf08b7f2cd89      #像tail 一样查看所有日志
docker logs -ft --tail 10 bf08b7f2cd89      #像tail 一样查看10条日志
```

**查看容器中的进程信息**

```xhell
docker top 容器id       #查看容器中的进程信息
```

**查看镜像元数据**

```shell
docker inspect 容器id   #查看容器详细信息
```

**从容器内拷贝文件到主机上**

```shell
docker cp 容器id:容器内路径 目的主机路径   #拷贝容器内文件到主机
```

**从主机拷贝到容器内 使用卷挂载**

```shell
-v 容器卷技术 实现容器和主机间文件互相同步
```

### 容器卷相关

> 容器卷用于实现容器和主机间数据同步，也可以为容器数据做持久化

```shell
方式一： 直接使用命令 -v
docker run -it -v 主机目录:容器内目录 容器
```

#### 具名和匿名挂载

```shell
# 匿名挂载
docker run -it -v 容器内目录      #不写主机路径  就是匿名挂载
docker run -it -v 名字：容器内目录 # 指定名字就是具名挂载
docker volume [参数]  查看卷信息
可选参数
 ls                              #查看所有volume
 inspect [volume_name]           #查看某一个volume的挂载信息
```

```shell
方式二： 通过dockerfile初始化时候直接挂载好
```

#### Dockerfile相关

```shell
# 编写Dockerfile

FROM centos

MAINTAINER echooo<echoooo_@outlook.com>

VOLUME ["volume1","/home"]  #可以具名也可以匿名

CMD echo "-----end-----"
CMD /bin/bash

# 够建images
docker build -f ./Dockerfile -t echooo/centos:1.0 .
```

#### Dockfile相关指令

```shell
FROM        #定制的镜像都是基于 FROM 的镜像
MAINTAINER  #指定作者
CMD         #是容器启动时执行的命令
ENTRYPOINT  #启动时的默认命令，
RUN         #构件容器时就运行的命令以及提交运行结果
LABEL       #为镜像指定标签
EXPOSE      #暴漏容器运行时的监听端口给外部，如果想使得容器与主机的端口有映射关系，必须在容器启动的时候加上 -P参数
ENV         #设置环境变量
ARG         #构建参数，与 ENV 作用一至。不过作用域不一样。ARG 设置的环境变量仅对 Dockerfile 内有效
ADD         #把文件复制到镜像中，src可以是远程
COPY        #把文件复制到镜像中，与add的区别是 src只能是本地文件
VOLUME      #实现挂载功能
WORKDIR     #设置工作目录
HEALTHCHECK #用于指定某个程序或者指令来监控 docker 容器服务的运行状态
ONBUILD     #用于延迟构建命令的执行
```



#### 数据卷容器

> 多个容器之间做数据同步，而且可以互相同步
>
> 如：容器A从父容器B同步数据，使用--volumes-from

```shell
# 先启动父容器
docker run -itd --name contain01 容器id
# 启动子容器
docker run -itd --name contain02 --volumes-from contain01 容器id
当父容器修改数据后即可自动同步到子容器，反之也可
```

### 实战-创建自己的centos

```shell
# 编写自己的centos Dockerfile
FROM centos

MAINTAINER echooo<echoooo_@outlook.com>

ENV MYPATH /usr/local
WORKDIR $MYPATH

VOLUME ["volume1","volume2:/home"]

RUN yum -y install vim
RUN yum -y install net-tools

EXPOSE 80

CMD echo "----------MYPAHT=$MYPATH"
CMD echo "-----build finish-----"

CMD /bin/bash
```

### 网络

> 容器之间互联是怎么实现？

```shell
docker network #查看docker网络情况
```

#### 容器互联

```shell
# 先容器1
docker run -itd --name contain01 容器id /bin/bash
# 启动容器2 --link到容器1
docker run -itd --name contain02 --link contain01 容器id /bin/bash
# 现在进入到容器2后，即可通过name ping通
```

#### 自定义网络

> 使用自定义网络，可以不用--link手动建立，默认即可ping 通

```shell
# 创建自定义网络
docker network create
#例子
docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet
#查看网络详细信息
docker network inspect mynet
```

### 实战

#### 部署tomcat

```shell
docker run -d -p 8080:8080 tomcat
```

#### 部署redis集群

> 分片模式

```shell
# 编写脚本
for port in $(seq 1 6); \
do \
mkdir -p /mydata/redis/node-${port}/conf
touch /mydata/redis/node-${port}/conf/redis.conf
cat << EOF >//mydata/redis/node-${port}/conf/redis.conf
port 6379
bind 0.0.0.0
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip 192.168.0.1${port}
cluster-announce-port 6379
cluster-announce-bus-port 16379
appendonly yes
EOF
done

#启动redis
for port in $(seq 1 6); \
do \
docker run -p 637${port}:6379 -p 1637${port}:16379 --name redis-${port} \
-v /mydata/redis/node-${port}/data:/data \
-v /mydata/redis/node-${port}/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 192.168.0.1${port} redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf
done


#创建集群
redis-cli --cluster create 192.168.0.11:6379 192.168.0.12:6379 192.168.0.13:6379 192.168.0.14:6379 192.168.0.15:6379 192.168.0.16:6379 --cluster-replicas 1
```



#### 部署自己的springboot

```shell
# 编写dockerfile
FROM java:8

MAINTAINER echooo<echoooo_@outlook.com>
COPY *.jar /snowball.jar
CMD ["--server.port=8080"]
EXPOSE 8080

ENTRYPOINT ["java","-jar","/snowball.jar"]
# build 然后run
docker run -itd -p 8080:8080 584e346787a6
```

### Docker Compose

#### **docker compose** 安装

```shell
# 1、安装，使用国内镜像
curl -L https://get.daocloud.io/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
# 2、修改权限
chmod +x /usr/local/bin/docker-compose
# 3、验证
docker-compose --version
```

#### 体验(官网)

> https://docs.docker.com/compose/gettingstarted/

```shell
# 1、创建目录
 mkdir composetest
 cd composetest
# 2、创建app.py
import time

import redis
from flask import Flask

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)
# 3、编写requirements.txt
flask
redis
# 4、编写Dockerfile
FROM python:3.7-alpine
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run"]
# 5、编写docker-compose.yml
version: "3.9"
services:
  web:
    build: .
    ports:
      - "5000:5000"
  redis:
    image: "redis:alpine"
# 6、启动
docker-compose up
# 7、访问
localhost:5000
```

#### 开发自己的springboot服务

1、开发springboot服务

```java
@RestController
public class testController {

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @GetMapping("/hello")
    public String testRedis(){
        Long view = stringRedisTemplate.opsForValue().increment("view");
        return "welcome,views : " + view;
    }

}

```

2、编写Dockerfile

```shell
FROM java:8

COPY *.jar /app.jar

CMD ["--server.port=8080"]

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
```

3、编写docker-compose.yml

```shell
version: "3.9"
services:
  snowballredis:
    build: .
    image: snowball
    depends_on:
      - redis
    ports:
      - "8080:8080"
  redis:
    image: "redis:alpine"

```

4、启动

```shell
docker-compose up
```

