---
category: csrsm
title: Kubernetes命令
header-title: true
header-image:
- http://img.icoisini.xyz/background.jpg
  tags:
- k8s
  date: 2022-2-13
---

# Kubernetes命令

## pod命令

```bash
kubectl get pods
kubectl get pods -o wide #详细信息
kubectl exec -it [pod-name] bash #进入到一个pod中,pod只有一个容器
kubectl exec -it [pod-name] -c [container-name] bash #进入到一个pod中,pod有多个容器需要指定容器名称
kubectl delete pod [pod-name] -n [namesapce]
```

## label命令

```bash
kubectl lable node node1 env_role=dev  #配合nodeSelector使用，进行pod节点选择
```

## node命令

```bash
kubectl get nodes
kubectl get nodes k8snode1 --show-labels  #显示节点标签
```

## describe命令

```bash
kubectl describe node k8smaster |grep Taint  #查看节点污点信息
```

## taint命令

```bash
kubectl taint node [node] key=value:污点三个值 #NoSchedule 一定不被调度 PreferNoSchedule 尽量不被调度 NoExecute 不会调度，并且还会驱逐Node已有Pod

kubectl taint node [node] key:污点值-  #删除一个节点的污点
```

## controller命令

### deployment

```bash
kubectl create deployment web --image=nginx
kubectl create deployment web --image=nginx --dry-run -o yaml > web.yaml #不创建deployment，导出创建该deployment的yaml文件

kubectl set image deployment web nginx=nginx:1.15 #nginx版本滚动升级
kubectl rollout status deployment web #查看升级状态
kubectl rollout history deployment web #查看历史版本
kubectl rollout undo deployment web #还原到上一个版本
kubectl rollout undo deployment web --to-reverion=2 #还原到版本2
```

## Service命令

```bash
kubectl get svc
kubectl get service
kubectl edit svc [svc-name]
```

## Pod启动调试

```bash
#启动pod失败可以尝试通过以下两个命令查看失败原因
kubectl -n [namespaces] describe pod [pod-name] 
kubectl -n [namespaces] log [pod-name]
```

## Secret命令

```bash
kubectl create -f secret.yaml
kubectl get secret
```

## ConfigMap命令

```bash
kubectl create configmap redis-config --from-file=redis.properties
kubectl get cm
kubectl describe cm redis-config
```

## namespace命令

```bash
kubectl get ns
kubectl create ns [ns name]
```

## 万能重启Pod命令

```bash
kubectl get pod {podname} -n {namespace} -o yaml | kubectl replace --force -f -
```

## 进入pod
```bash
kubectl exec -ti <your-pod-name>  -n <your-namespace>  -- /bin/sh
```

## 查询Pod的yaml文件
```bash
kubectl get pod {podname} -n {naemspace} -o yaml > {文件名}.yml
```

## k8s 证书过期更新
```shell
kubeadm alpha certs renew all
```

