---
category: csrsm
title: Kubernetes部署
header-title: true
header-image:
  - http://img.icoisini.xyz/background.jpg
tags:
  - k8s
date: 2022-2-13
---

# Kubernetes部署 

centos7环境

## 确保每个节点上 MAC 地址和 product_uuid 的唯一性

## 关闭防火墙

```bash 
systemctl disable --now firewalld
```

## 允许 iptables 检查桥接流量

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

## 安装Docker

## 关闭swap分区

```bash
swapoff -a #临时
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab #永久
```

## 设置主机名称
```bash
$ hostnamectl set-hostname k8s-master
$ hostnamectl set-hostname k8s-node1
$ hostnamectl set-hostname k8s-node2
cat >> /etc/hosts << EOF
192.168.184.137 k8s-master
192.168.184.138 k8s-node1
192.168.184.139 k8s-node2
EOF
```

## 同步时间

```bash
yum install -y ntpdate
ntpdate time.windows.com
```

## 阿里源

```bash
cat > /etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

## 禁用SELinux

```bash
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
```

## 安装Kubeadm、Kubelet和Kubectl

```bash
yum install -y kubelet-1.18.0 kubeadm-1.18.0 kubectl-1.18.0
systemctl enable kubelet
```

## 部署Kubernetes Master

--apiserver-advertise-address 是Master节点ip

--pod-network-cidr如果网络插件安装kube-flannel，则为10.244.0.0/16，如果网络插件安装Calico ，则为192.168.0.0/16

```bash
kubeadm init --apiserver-advertise-address=192.168.184.137 --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.18.0 --service-cidr=10.1.0.0/16 --pod-network-cidr=10.244.0.0/16
```
输出如下：

```bash
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.184.137:6443 --token 60097g.611f9xsw0886dgn3 \
    --discovery-token-ca-cert-hash sha256:019015dc17e97d767dc778d41cf18932ae6092986fe3a644ff9d3121dae0d074

stat /var/lib/calico/nodename: no such file or directory: check that the calico/node container is running and has mounted /var/lib/calico/
```

后续需要用到 kubeadm join 192.168.184.137:6443 --token XXX --discovery-token-ca-cert-hash sha256:XXX 

要使非 root 用户可以运行 kubectl，请运行以下命令， 它们也是 `kubeadm init` 输出的一部分：

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

或者，如果你是 `root` 用户，则可以运行：

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
cat >> /etc/profile << EOF
export KUBECONFIG=/etc/kubernetes/admin.conf
EOF
```

## 安装网络插件

只需要在master上执行

```bash
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f kube-flannel.yml
```

卸载插件

```bash
kubectl delete -f xxx.yaml
```

## 加入Kubernetes Node

kubeadm init 会返回该命令，在工作节点上执行该命令

```bash
kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```
```bash
kubeadm get nodes #查看是否添加成功，在master节点
```

## 测试Kubernetes集群
```bash
[root@k8s-master ~]# kubectl create deployment nginx --image=nginx
deployment.apps/nginx created

[root@k8s-master ~]# kubectl expose deployment nginx --port=80 --type=NodePort
service/nginx exposed

[root@k8s-master ~]# kubectl get pods,svc
NAME READY STATUS RESTARTS AGE
pod/nginx-554b9c67f9-wf5lm 1/1 Running 0 24s

NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
service/kubernetes ClusterIP 10.1.0.1 <none> 443/TCP 39m
service/nginx NodePort 10.1.224.251 <none> 80:31745/TCP 9
```

访问 192.168.184.137:31745

```bash
kubectl get services
kubectl get deployment
kubectl get pods
kubectl delete service [name]
kubectl delete deployment [name]
```

## 查看Pod运行问题

```bash
kubectl describe pods -n [namespace] [name]
#例 kubectl describe pods -n kube-system coredns-5bfd685c78-mmjxc
#例 kubectl describe pod nginx-f89759699-9vpkg 
```

# Kubernetes卸载

前提网络插件安装无问题，网络连通无问题

```bash
# 卸载服务
kubeadm reset

# 删除rpm包
rpm -qa|grep kube*|xargs rpm --nodeps -e

# 删除容器及镜像
docker images -qa|xargs docker rmi -f
```

