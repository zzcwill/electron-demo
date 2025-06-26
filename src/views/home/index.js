document.getElementById('screenshot')?.addEventListener('click', async () => {
  console.info('启动系统截图...');
  
  try {
    const result = await window.electWeb.systemScreenshot();
    
    if (result.success) {
      console.info('截图完成！');
      console.info('文件保存位置:', result.filepath);
      alert(`截图已保存到桌面：${result.filename}`);
    } else {
      console.error('截图失败:', result.error);
      alert(`截图失败: ${result.error}`);
    }
  } catch (error) {
    console.error('截图过程中出现错误:', error);
    alert(`截图失败: ${error.message}`);
  }
});