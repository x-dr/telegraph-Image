# telegraph-Image


### Demo
[https://img.131213.xyz](https://img.131213.xyz/)

### 测试
[https://testimg.131213.xyz/](https://testimg.131213.xyz/)
> 测试账号：admin

> 测试密码：admin



### 新版本dev分支

[https://telegraph-image-e49.pages.dev/](https://telegraph-image-e49.pages.dev/)
> 测试账号：admin

> 测试密码：admin


### 开发计划
- [x] 后台管理
- [x] 鉴黄
- [ ] 画廊
- [ ] referer、IP黑名单


### 优点

1. 无限图片储存数量，你可以上传不限数量的图片

2. 无需购买服务器，托管于Cloudflare的网络上，当使用量不超过Cloudflare的免费额度时，完全免费

3. 无需购买域名，可以使用Cloudflare Pages提供的*.pages.dev的免费二级域名，同时也支持绑定自定义域名

4. 支持图片审查API，可根据需要开启，开启后不良图片将自动屏蔽，不再加载

5. 支持后台图片管理，日志管理，查看访问前20的Referer、IP、img,可以对上传的图片进行在线预览，添加白名单，黑名单等操作


### 更新日志

+ 2023-8-21 : 支持自建鉴黄api

+ 2023-8-13 ：图片访问日志,数据库表已修改 更新时请先删除表`imginfo`重新创建

+ 2023-8-12 ：图片管理功能

### 利用Cloudflare pages部署

> [开启图片管理功能教程](./docs/manage.md)

1. 点击[Use this template](https://github.com/x-dr/telegraph-Image/generate)按钮创建一个新的代码库。

2. 登录到[Cloudflare](https://dash.cloudflare.com/)控制台.
3. 在帐户主页中，选择`pages`> ` Create a project` > `Connect to Git`
4. 选择你创建的项目存储库，在`Set up builds and deployments`部分中，全部默认即可。

<img src="https://img.131213.xyz/file/beb0385822e24c9a9d459.png"  height="50%" width="50%" />

5. 点击`Save and Deploy`部署，然后点`Continue to project`即可看到访问域名

>  访问http(s)://你的域名/admin 即可打开后台管理页面

>  访问http(s)://你的域名/list 即可打开log管理页面


#### 后台管理不是很完善 但基本的应该都有了 

**[开启图片管理功能教程](./docs/manage.md)**


---
---
### 利用vercel部署(vercel分支)

[![Deploy with Vercel](https://vercel.com/button?utm_source=busiyi&utm_campaign=oss)](https://vercel.com/new/clone?utm_source=busiyi&utm_campaign=oss&repository-url=https://github.com/x-dr/telegraph-Image/tree/vercel)

---





### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=x-dr/telegraph-Image&type=Date)](https://star-history.com/#x-dr/telegraph-Image&Date)





### 感谢

[@cf-pages](https://github.com/cf-pages/Telegraph-Image)

[@likebeta](https://github.com/likebeta/telegraph-image-hosting)




