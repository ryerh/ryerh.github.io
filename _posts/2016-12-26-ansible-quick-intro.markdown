---
title: Ansible quick intro
date: 2016-12-26 11:40:00 +08:00
layout: post
---

# Ansible Official docs
[here](http://docs.ansible.com/)

# Ansible 关键词
[here](http://docs.ansible.com/ansible/playbooks_directives.html)

# Ansible 配置文件
## 查找规则
```
ANSIBLE_CONFIG
./ansible.cfg
~/.ansible.cfg
/etc/ansible/ansible.cfg
```

## 文件内容
```ini
remote_user = root
host_key_checking = False
roles_path = ./roles
host_file = ./inventories
```