---
title: Ansible quick intro
date: 2016-12-26 11:40:00 +08:00
layout: post
---

# Ansible [docs](http://docs.ansible.com/)

Ansible 是一个基于 SSH 的自动化 IT 运维工具，由 Python 语言编写，实际使用过程中面向 yaml 配置文件进行编排。

Ansible 的核心概念包含如下几点：

- ansible.cfg   Ansible 配置文件
- inventory     集群节点地址清单
- ad-hoc        单次执行命令
- moudle        Ansible 模块
- playbook      编排脚本
- role          打包后的 playbook

# ansible.cfg

`ansible.cfg` 的查找规则如下：

```
ANSIBLE_CONFIG
./ansible.cfg
~/.ansible.cfg
/etc/ansible/ansible.cfg
```

`ansible.cfg` 的基本内容，[完整例子](https://github.com/ansible/ansible/blob/devel/examples/ansible.cfg)：

```ini
[defaults]
host_key_checking = False
private_key_file = ~/.ssh/id_rsa
remote_user = root
inventory = ./inventory/hosts     # 默认 /etc/ansible/hosts
roles_path = ./roles              # 默认 /etc/ansible/roles
```

## Ansible inventory
```
localhost              ansible_connection=local
other1.example.com     ansible_connection=ssh        ansible_user=mpdehaan
other2.example.com     ansible_connection=ssh        ansible_user=mdehaan
```