---
category: csrsm
title: 修改阿里云服务器ssh端口
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
  - linux
date: 2021-11-19
---

修改阿里云服务器ssh端口

<!-- more -->

# 修改阿里云服务器ssh端口

今天发现有人对我的阿里云服务器进行了攻击,虽然自己使用了强密码 但感觉还是有点不放心,决定限制只能通过密钥访问,并更换ssh连接端口 

## 1.生成密钥对

首先是正常登陆 在服务器上制作密钥对,执行以下命令 

```
ssh-keygen -t rsa -C "xxxxx@xxxxx.com"     <==后面填写的是邮箱
```

首先提示的是密钥保存路径，此处可以直接Enter(默认/root/.ssh/文件下)。第二步和第三步是提示输入密钥锁码，我也直接Enter留空（当然为了私钥安全也可以输入密码）。
这样密钥对就生成成功了

```查看公钥
Your identification has been saved in /root/.ssh/id_rsa. <== 私钥
Your public key has been saved in /root/.ssh/id_rsa.pub. <== 公钥
```

查看公钥 

```
cat ~/.ssh/id_rsa.pub
```

## 2.在服务器上安装公钥

这一步操作在~/.ssh目录下操，作为了确保执行成功 先执行上面两个命令,设置文件权限。

```
chmod 600 authorized_keys
chmod 700 ~/.ssh
cat id_rsa.pub >> authorized_keys     <== 安装公钥
```

## 3.编辑 /etc/ssh/sshd_config 文件

```
RSAAuthentication yes
PubkeyAuthentication yes
PermitRootLogin yes   <==root能否通过ssh登录
```

重启ssh服务

```
systemctl restart sshd.service
```

## 4.下载私钥文件

将私钥文件 id_rsa 通过FTP等方式下载到本地机器上,测试密钥登录是否成功,推荐使用Xshell。 登录成功后回到sshd_config文件，设置禁用密码登陆！ 

```
PasswordAuthentication no
```

小心保管好私钥文件，这将是你连接服务器的唯一凭据！ 

## 5.修改SSH端口

还是修改 /etc/ssh/sshd_config，找到Port 22，为稳妥起见，我们先是使用多个端口连接，比如在Port 22在下面添加一行：Port 25，就增加了一个新的连接端口25 重启SSH服务后测试ssh连接： 

```
systemctl restart sshd.service          <==重启SSH服务
ssh localhost -p 你的端口号    <==本机上测试ssh连接
```

centOS7防火墙默认关闭

```
// 查看已开启的端口
firewall-cmd --list-ports
// 查看防火墙状态
firewall-cmd --state
// 开启防火墙
systemctl start firewalld
// 开启端口
firewall-cmd --zone=public --add-port=8888/tcp --permanent
// 删除端口
firewall-cmd --zone=public --remove-port=8888/tcp --permanent
// 重启防火墙
firewall-cmd --reload
```

此处可以使用semanage工具管理对端口、消息接口和网络接口等 配置

安装命令如下： 

```
yum install semanage

// 如果提示No package semanage available.
// 执行如下命令：
yum provides semanage 

yum -y install policycoreutils-python.x86_64
```

配置ssh端口命令如下

```
// 查看ssh端口
semanage port -l|grep ssh
// 增加ssh端口
semanage port -a -t ssh_port_t -p tcp 8888
```



## 6.修改阿里云安全策略

在控制台处，修改防火墙策略，自定义TCP连接端口。

## 7.阿里云相关配置记录

注意：轻量服务器只能通过私钥连接，密码登陆已关闭，ssh端口为2451

### （1）mysql

- 用户名密码：root/ cuiming@123

- 远程连接密码：Cuiming@123

- 端口：3323

- 允许所有人远程连接mysql

  ```
  – 允许所有远程连接到root权限下的所有数据库
  grant all privileges on *.* to root@"%" identified by '数据库密码';
  – 刷新(必要执行的语句)
  flush privileges;
  ```

  ```
  修改mysql root用户密码步骤：
  1.vim /etc/my.cnf   #find / -name "my.cnf"
  2.找到该文件中的[mysqld]，在下面插入一行：skip-grant-tables  #跳过密码登陆
  3.重启mysql服务器 service mysqld restart
  4.mysql –uroot –p 回车键
  5.mysql > use mysql  
    mysql > UPDATE user SET password = password(‘新密码’) WHERE User = ‘root’;
  6.mysql> flush privileges
  7.vim /etc/my.cnf 删除skip-grant-tables
  8.重启mysql服务器 service mysqld restart
  ```

  