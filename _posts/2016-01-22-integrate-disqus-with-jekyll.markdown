---
title: 给 Jekyll 集成 Disqus 评论系统
date: 2016-01-22 12:08:54 +08:00
categories:
- disqus
layout: post
---

# 1. 注册 Disqus

[https://disqus.com/](https://disqus.com/)

# 2. 添加你的站点

完善 `Site name`, `Disqus URL`, `Category`

# 3. 在 Jekyll 模板中嵌入代码

``` html
<div id="disqus_thread"></div>
<script>
    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
     */
    /*
    var disqus_config = function () {
        this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    (function() {  // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');

        s.src = '//{ 这里填 Disqus Short Name }.disqus.com/embed.js';

        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
```

# 参考链接
1. [configuration-variables](https://disqus.com/admin/universalcode/#configuration-variables)
