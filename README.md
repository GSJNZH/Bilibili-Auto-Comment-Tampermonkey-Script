### B站自动评论油猴脚本，由DeepSeek编写
# Bilibili 自动评论油猴脚本

一个功能强大的 Tampermonkey 脚本，帮助你在 B 站视频下方自动发送评论。支持自定义文案库、发送间隔，并且可以添加**随机组合的前置小尾巴**（表情包/标签等），让每条评论都与众不同。

## ⚖️ 免责声明
本脚本仅供**学习和交流使用**，请勿用于任何违反 Bilibili 社区规则或国家法律法规的用途。

使用本脚本所产生的任何后果（包括但不限于账号被禁言、封禁等）均由**用户自行承担**，开发者不承担任何责任。

请遵守 B 站的用户协议，合理设置发送间隔，避免对他人造成骚扰。

开发者保留在任何时候停止更新或删除本脚本的权利。

## ✨ 功能特点

- ✅ **自动发送评论** – 按照设定的时间间隔，循环从文案库中随机选择一条发送。
- ✅ **自定义文案库** – 在面板中按行输入多条评论文案，脚本会随机挑选。
- ✅ **灵活的间隔设置** – 可自由设定发送间隔（建议 ≥ 30 秒，避免风控）。
- ✅ **随机前置小尾巴** – 从预定义的元素列表中随机抽取 **5~18 个**元素，并随机排列后拼接在评论最前面，每条评论的小尾巴都独一无二。
- ✅ **精确定位** – 深入多层 Shadow DOM，精准找到 B 站最新的评论区输入框和发布按钮，兼容性高。
- ✅ **手动发送测试** – 提供“发一次”按钮，方便随时测试脚本是否正常工作。
- ✅ **自动停止机制** – 连续失败 3 次后自动停止，避免无限重试。
- ✅ **可拖拽面板** – 右上角的控制面板可随意拖动，不影响观看视频。

## 📥 安装方法

1. 确保你的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2. 点击以下链接直接安装脚本（需科学上网或直接访问 GitHub raw）：
   - [**安装最新版本**](https://raw.githubusercontent.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/refs/heads/main/bilibili-autocomment.user.js)
3. 或者，手动复制 [bilibili-autocomment.user.js](https://github.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/blob/main/bilibili-autocomment.user.js) 的全部代码，在 Tampermonkey 中新建脚本并粘贴保存。

## 📖 使用方法

1. 打开《明日方舟》夏日嘉年华限时活动宣传PV B 站视频页面（ `https://www.bilibili.com/video/BV1fy4y1L7Rq/`）。
2. 页面右上角会出现一个 **“📝 B站自动评论”** 的控制面板。
3. 在文本框中输入你的评论文案，**每行一条**（默认有示例）。
4. 设置**间隔秒数**（建议 30 秒以上）。
5. 点击 **“发一次”** 测试发送一条评论，观察控制台（F12）输出，确保能正常发送。
6. 测试成功后，点击 **“▶ 开始自动”** 启动循环发送；点击 **“⏹️ 停止”** 可随时终止。
7. 面板标题栏可**拖动**，避免遮挡视频。

## 🎨 自定义小尾巴

脚本内置了丰富的表情包标签（来自 Ave Mujica 和 Mygo），但你可以完全按自己的喜好修改。

### 修改小尾巴元素列表
在脚本开头找到 `TAIL_ELEMENTS` 数组，可以自由增删或更改其中的字符串（支持任何文本/表情/符号）：

```javascript
const TAIL_ELEMENTS = [
    '[Ave Mujica_挺好]',
    '[Ave Mujica_再等一下]',
    // ... 其他元素
];
```

### 修改每次发送的数量范围
在 `sendOneComment` 函数中，找到以下代码行：

```javascript
const tailCount = Math.floor(Math.random() * (18 - 5 + 1)) + 5; // 5~18 随机
```

修改 `5` 和 `18` 即可改变最小和最大抽取数量。

## ⚠️ 注意事项

- **请合理使用**：发送间隔不要太短（建议 ≥30 秒），否则容易触发 B 站风控，甚至导致账号受限。
- **需要登录**：脚本依赖你的 B 站登录状态，请确保已登录。
- **页面更新**：B 站可能会在未来更新页面结构，导致脚本失效。如果发现不能用，欢迎提 [Issue](https://github.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/issues) 反馈，我会尽力修复。
- **报错无关紧要**：控制台出现的 `ReporterPb 加载失败` 是 B 站自身的统计脚本错误，不影响本脚本运行。

## 📅 更新日志

### v6.7
- 小尾巴抽取数量随机范围设为 **5~18** 个。
- 优化抽取逻辑，确保每次组合更随机。

### v6.6
- 更换小尾巴元素为用户提供的完整表情包列表。
- 小尾巴前置，每次随机排列全部元素。

### v6.5
- 小尾巴改为前置，并实现随机排列组合（不再是单一后缀）。

### v6.4
- 增加随机小尾巴功能（后缀形式）。

### v6.3
- 修复间隔设置无效的问题，精确定位评论框。

## 📄 许可证

[MIT](LICENSE) © GSJNZH

## 🤝 贡献

如果你有好的建议或发现了 Bug，欢迎：
- 提交 [Issue](https://github.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/issues)
- 发起 [Pull Request](https://github.com/GSJNZH/Bilibili-Auto-Comment-Tampermonkey-Script/pulls)

如果觉得脚本对你有帮助，不妨点个 ⭐ 支持一下！
