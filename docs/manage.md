
#### 后台管理不是很完善 但基本的应该都有了

1. 创建D1数据库 如图

<img src="./img/D1_1.png"   height="50%" width="50%"/>
<img src="./img/d10.png"   height="50%" width="50%"/>

2. 执行sql命令创建表（在控制台输入框粘贴下面语句执行即可）
```sql
DROP TABLE IF EXISTS tgimglog;
CREATE TABLE IF NOT EXISTS tgimglog (
	`id` integer PRIMARY KEY NOT NULL,
    `url` text,
    `referer` text,
	`ip` varchar(255),
	`time` DATE
);
DROP TABLE IF EXISTS imginfo;
CREATE TABLE IF NOT EXISTS imginfo (
	`id` integer PRIMARY KEY NOT NULL,
    `url` text,
    `referer` text,
	`ip` varchar(255),
	`rating` text,
	`total` integer,
	`time` DATE
);
```

<img src="./img/d3.png"   height="50%" width="50%"/>
<img src="./img/d4.png"   height="50%" width="50%"/>
<img src="./img/d5.png"   height="50%" width="50%"/>

3. 选择部署完成`telegraph-Image`项目，前往后台依次点击`设置`->`函数`->`D1 数据库绑定`->`编辑绑定`->`变量名称填写`：`IMG` 命名空间 选择你提前创建好的D1 数据库绑定

<img src="./img/d6.png"   height="50%" width="50%"/>

4. 后台管理页面新增登录验证功能，默认也是关闭的，如需开启请部署完成后前往后台依次点击`设置`->`环境变量`->`为生产环境定义变量`->`编辑变量` 添加如下表格所示的变量即可开启登录验证

*[鉴黄api部署](https://github.com/x-dr/nsfwjs-api)*

> `ModerateContentApiKey` 请前往 [https://moderatecontent.com/] (https://moderatecontent.com/)注册免费获取API key

| 变量名称      | 值 |
| ----------- | ----------- |
|BASIC_USER   | <后台管理页面登录用户名称>|
|BASIC_PASS   | <后台管理页面登录用户密码>|
|ModerateContentApiKey   | <审查图像内容的API key>|
|RATINGAPI   | <[自建的鉴黄api](https://github.com/x-dr/nsfwjs-api) >|

> 优先级 `RATINGAPI` > `ModerateContentApiKey`

> `RATINGAPI`的格式 `https://xxx.xxx/rating`

<img src="./img/fun.png"   height="50%" width="50%"/>



5. 返回最新部署完成`telegraph-Image`项目后台点击`重试部署` 使环境变量生效
<img src="./img/d1end.png"   height="50%" width="50%"/>


#### 访问http(s)://你的域名/admin 即可打开后台管理页面

#### 访问http(s)://你的域名/list 即可打开log管理页面
