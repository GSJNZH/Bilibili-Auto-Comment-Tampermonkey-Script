# Bilibili-Auto-Comment-Tampermonkey-Script
### B站自动评论油猴脚本，由DeepSeek编写



---

Bilibili Auto Comment - Tampermonkey Script / B站自动评论油猴脚本

https://img.shields.io/github/v/release/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script
https://img.shields.io/badge/Tampermonkey-Script-blue
https://img.shields.io/github/license/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script

一个功能强大的Tampermonkey用户脚本，用于在Bilibili（B站）实现自动评论。基于网络请求劫持（Hook）技术，支持自定义评论内容、定时发送、随机评论库等高级功能。

A powerful Tampermonkey userscript to automate comments on Bilibili. Based on network request hijacking (Hook) technology, it supports custom comment content, scheduled sending, random comment library, and other advanced features.

📖 简介 / Introduction

本脚本通过劫持Bilibili网页端发送评论的 XMLHttpRequest 请求，在用户点击发送或定时触发时，自动填充或追加预设的评论内容。它不依赖于页面元素变动，因此更加稳定、高效。

This script hijacks the XMLHttpRequest used by the Bilibili web interface to send comments. When you click send or a timer triggers, it automatically fills in or appends preset comment content. Independent of page element changes, it is more stable and efficient.

✨ 功能特点 / Features

· 自动填充 / Auto Fill：在评论区自动填入预设内容，支持一键发送。
· 评论后缀 / Comment Suffix：自动为每条评论添加自定义“小尾巴”。
· 随机评论库 / Random Comment Library：内置或自定义一个评论列表，每次发送时随机选择一条。
· 定时发布 / Scheduled Posting：设定特定时间，脚本自动完成评论填写与发送。
· 请求劫持 / Request Hijacking：核心技术，直接修改发送前的网络请求体，确保评论成功。
· 智能适配 / Smart Adaptation：自动适配B站新版和旧版页面，兼容动态、视频、专栏等不同场景的评论区。

🛠️ 安装方法 / Installation

1. 安装脚本管理器 / Install a Userscript Manager
   首先，你需要在浏览器中安装Tampermonkey（油猴）扩展。
   · Chrome Web Store
   · Microsoft Edge Add-ons
   · Firefox Add-ons
2. 安装本脚本 / Install This Script
   · 方法一：点击GitHub Releases中最新版本的 .user.js 文件链接，Tampermonkey会自动识别并提示安装。
   · 方法二：复制 src/bilibili-autocomment.user.js 的全部代码，然后在Tampermonkey管理面板中新建脚本并粘贴保存。

⚙️ 使用方法 / Usage

1. 登录B站：确保已在浏览器中登录你的Bilibili账号。
2. 进入评论区：打开任意B站视频、动态或专栏页面，向下滚动至评论区。
3. 配置脚本（可选） / Configuration (Optional)：
   · 点击页面左上角或右下角由脚本注入的“⚙️ 设置”按钮，打开配置面板。
   · 基础模式：在输入框中填写你希望自动发送的固定评论。
   · 随机模式：切换至“随机评论库”，以逗号或换行分隔多条评论。
   · 定时模式：开启定时器，设定发送时间（如 0 10 * * * 表示每天上午10点），并选择要发送的评论区。
4. 执行自动评论 / Execute：
   · 手动模式：在评论框中输入任何内容（或不输），脚本会在你点击“发送”时，根据规则替换/追加内容。
   · 自动模式：开启定时后，脚本会在后台自动寻找指定评论区并完成评论发送。

📁 项目结构 / Project Structure

```
Bilibili-Auto-Comment-Tampermonkey-Script/
├── src/
│   └── bilibili-autocomment.user.js    # 主脚本文件
├── README.md                            # 本文件
├── LICENSE                               # 开源许可证 (如 MIT)
└── screenshots/                          # 截图文件夹
    └── demo.png                          # 使用示例截图
```

⚠️ 注意事项 / Important Notes

· 请合理使用：本脚本旨在辅助个人日常使用，请勿用于恶意刷屏、发布违规内容等行为，遵守Bilibili社区规则。
· 账号安全：脚本仅在前端运行，不会收集或上传你的账号信息。所有配置数据均保存在浏览器本地。
· 兼容性：如遇B站页面更新导致脚本失效，欢迎提交 Issue 反馈。

🤝 贡献指南 / Contributing

欢迎提交 Pull Request 或 Issue 来帮助改进这个脚本。

1. Fork 本仓库。
2. 创建你的特性分支 (git checkout -b feature/AmazingFeature)。
3. 提交你的修改 (git commit -m 'Add some AmazingFeature')。
4. 推送至分支 (git push origin feature/AmazingFeature)。
5. 打开一个 Pull Request。

📄 许可证 / License

本项目采用 MIT 许可证 开源。

---

觉得好用的话，别忘了给个 ⭐Star 鼓励一下！
If you find it useful, please give it a ⭐Star!
<img width="467" height="600" alt="image" src="https://github.com/user-attachments/assets/6fb76cb4-2e12-443a-ad99-7e20f2ebc3f7" />
<img width="822" height="343" alt="image" src="https://github.com/user-attachments/assets/5326c0e6-bc8a-421e-a701-a7972996d399" />


