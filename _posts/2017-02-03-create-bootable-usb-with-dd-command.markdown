---
title: Create bootable usb with `dd` command
date: 2017-02-03 18:07:00 +08:00
layout: post
---

``` bash
ryer:~$ diskutil list
/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:                            SSS_X64FREE_EN-US_DV9  *33.2 GB    disk2

ryer:~$ diskutil unmountDisk /dev/disk2

ryer:~$ sudo dd bs=1m if=IMAGE.ISO of=/dev/rdisk2  # C-t to view progress
```

> [INSTALLING OPERATING SYSTEM IMAGES ON MAC OS](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)