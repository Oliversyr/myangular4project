部署打包说明:
1. 进入打包服务器 192.168.10.11
  定位到目录: F:\front_end\slic-main
2. 执行脚本 run-ng-build-prod.bat
3. 打包成功后
  定位到目录: F:\front_end\slic-main\dist\threebear
4. 在目录: F:\front_end\slic-main\dist\threebear
执行以下操作: 根目录= F:\front_end\slic-main\dist\threebear
  1) 修改index.html 文件: 移除开发调试代码 <script src="z-config/dev-config-env.js"></script>
  2) 拷贝静态菜单base-framework/**.static.json目录到根目录中去