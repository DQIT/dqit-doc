---
lang: zh-CN
title: 安装K8S集群(VM虚拟机)
lastUpdated: true
sidebarDepth: 2
---
# 搭建K8S集群(本地)

## 本地基本环境搭建

### 环境搭建
1. 为了加快安装速度，首先配置安装源
```shell
# 安装 yum-utils
yum -y install yum-utils

# 修改 Docker 安装源
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 修改 K8S 相关包的安装源
cat <<EOF > kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
mv kubernetes.repo /etc/yum.repos.d/
```

2. 安装相关组件
```shell
yum install -y kubelet kubeadm kubectl docker-ce
```
::: tip 如果提示包冲突，导致无法继续安装，可使用如下命令覆盖安装
`yum install --allowerasing -y kubelet kubeadm kubectl docker-ce`
:::

### 相关配置
:::danger 注意
配置很重要，否则会有各种各样的问题导致你的集群无法启动
:::
1. 修改 hostname
要保证集群中每个节点的hostname都需要不同，分别进行配置，例如我这边 master 节点的hostname要配置成 master
```shell
hostnamectl set-hostname master
```

其他Node节点配置例如 node1
```shell
hostnamectl set-hostname node1
```

2. 修改hosts: 上述节点的 hosts 添加配置到每个机器中
例如我的主节点IP为: 192.168.31.130，则我需要在 hosts 中添加：
```hosts
192.168.31.130 master
```

3. 集群的必要配置
```shell
# 将 SELinux 设置为 permissive 模式（相当于将其禁用）
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

#关闭swap
swapoff -a  
sed -ri 's/.*swap.*/#&/' /etc/fstab

#允许 iptables 检查桥接流量
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --syst
```

4. 关闭防火墙(或者手动开放一些端口)
```shell
systemctl stop firewalld
systemctl disable firewalld
```

5. 启动相关服务
```shell
# 启动 kubelet 并设置开机自启
systemctl enable kubelet
systemctl start kubelet
# 启动 docker 并设置开机自启
systemctl enable docker
systemctl start docker
```

<br />
<br />


## 初始化 Master 节点
### 初始化 Master
```shell
kubeadm init \
--apiserver-advertise-address=192.168.31.132 \
--control-plane-endpoint=master \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.23.5 \
--service-cidr=10.96.0.0/16 \
--pod-network-cidr=10.244.0.0/16 
```
参数含义:
- apiserver-advertise-address: 
- control-plane-endpoint: 
- image-repository: 
- kubernetes-version: 
- service-cidr:
- pod-network-cidr: 

### 复制授权文件

这一步是为了让 kubectl 有权限访问集群

如果其他节点需要访问集群，需要从主节点复制这个文件过去其他节点
```shell
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

### 安装网络插件
```shell
# 下载yml
curl https://docs.projectcalico.org/manifests/calico.yaml -O
# 安装
kubectl apply -f calico.yaml
```

### 查看集群节点状态
```shell
kubectl get nodes
```

<br />
<br />

## 子节点加入集群

```shell
kubeadm join master:6443 --token hbpcmo.300scvwh7wlxv3e9 \
        --discovery-token-ca-cert-hash sha256:a35112da54c18de43b0c5f5b05258a5bdd1abc24746645ef3ab14d0ecf95d28e
```

<br />
<br />


## 安装和访问 Dashboard
GitHub: https://github.com/kubernetes/dashboard

### 安装
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.1/aio/deploy/recommended.yaml
```

### 访问配置
1. 方式一：nodePort
```shell
# 修改 type:ClusterIP 为 type:ClusterIP
kubectl edit svc kubernetes-dashboard -n kubernetes-dashboard

# 查看访问端口
kubectl get svc -A |grep kubernetes-dashboard
```
正常情况下，每个集群的IP都能通过这个端口号访问到

2. 方式二：kubectl proxy
```shell
kubectl proxy -p 8001 --address='0.0.0.0' --accept-hosts='^\*$' --disable-filter=true
```
如果不加`--disable-filter=true`，一会儿打开的页面只显示"Forbidden"的空白页

访问地址：
http://masterIP:8001/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard


### 参考文档
1. [参考文档1](https://www.yuque.com/leifengyang/oncloud/ghnb83#SDlhV)
2. [参考文档2](https://k8s.easydoc.net/docs/dRiQjyTY/28366845/6GiNOzyZ/nd7yOvdY)
