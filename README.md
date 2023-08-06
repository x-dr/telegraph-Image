# telegraph-Image


### [Demo](https://img.131213.xyz/)


### 利用Cloudflare pages部署

1. 点击[Use this template](https://github.com/x-dr/telegraph-Image/generate)按钮创建一个新的代码库。

2. 登录到[Cloudflare](https://dash.cloudflare.com/)控制台.
3. 在帐户主页中，选择`pages`> ` Create a project` > `Connect to Git`
4. 选择你创建的项目存储库，在`Set up builds and deployments`部分中，全部默认即可。

<img src="https://i3.wp.com/telegra.ph/file/beb0385822e24c9a9d459.png" />

5. 点击`Save and Deploy`部署，然后点`Continue to project`即可看到访问域名




---
---
### 利用vercel部署(vercel分支)

[![Deploy with Vercel](https://vercel.com/button?utm_source=busiyi&utm_campaign=oss)](https://vercel.com/new/clone?utm_source=busiyi&utm_campaign=oss&repository-url=https://github.com/x-dr/telegraph-Image/tree/vercel)


---
### 自定义cdn加速
> 默认是使用cloudflare ,修改 `asset/js/upload.js#L219` 即可

+ 如用cachefly加速 

cachefly绑定cloudflare pages
<img src="https://i3.wp.com/telegra.ph/file/c19f7ea17ce2027b13dfa.png" />

修改代码

```diff
- const PROXYURL = ""  //自定义加速域名 默认是使用cloudflare
+ const PROXYURL = "https://xxxxxxxxxx.cachefly.net"  //自定义加速域名 默认是使用cloudflare
```




### 感谢

[@cf-pages](https://github.com/cf-pages/Telegraph-Image)

[@likebeta](https://github.com/likebeta/telegraph-image-hosting)




