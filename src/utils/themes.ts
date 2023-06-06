export default {
  THEME_DEFAULT: {
    'color-scheme': 'light',
    '--el-color-white': '#ffffff', // 基础浅色
    '--el-color-black': '#000000', // 基础深色
    // 主题色变量
    '--el-color-primary': '#409eff', // 主题的主要颜色，用于按钮、链接等的背景色和文本颜色
    '--el-color-primary-light-3': '#79bbff',
    '--el-color-primary-light-5': '#a0cfff',
    '--el-color-primary-light-7': '#c6e2ff',
    '--el-color-primary-light-8': '#d9ecff',
    '--el-color-primary-light-9': '#ecf5ff',
    '--el-color-primary-dark-2': '#337ecc',
    '--el-color-success': '#67c23a', // 成功状态的颜色，例如成功的提示信息
    '--el-color-success-light-3': '#95d475',
    '--el-color-success-light-5': '#b3e19d',
    '--el-color-success-light-7': '#d1edc4',
    '--el-color-success-light-8': '#e1f3d8',
    '--el-color-success-light-9': '#f0f9eb',
    '--el-color-success-dark-2': '#529b2e',
    '--el-color-warning': '#e6a23c', // 警告状态的颜色，例如警告的提示信息
    '--el-color-warning-light-3': '#eebe77',
    '--el-color-warning-light-5': '#f3d19e',
    '--el-color-warning-light-7': '#f8e3c5',
    '--el-color-warning-light-8': '#faecd8',
    '--el-color-warning-light-9': '#fdf6ec',
    '--el-color-warning-dark-2': '#b88230',
    '--el-color-danger': '#f56c6c', // 危险状态的颜色，例如错误的提示信息
    '--el-color-danger-light-3': '#f89898',
    '--el-color-danger-light-5': '#fab6b6',
    '--el-color-danger-light-7': '#fcd3d3',
    '--el-color-danger-light-8': '#fde2e2',
    '--el-color-danger-light-9': '#fef0f0',
    '--el-color-danger-dark-2': '#c45656',
    '--el-color-error': '#f56c6c',
    '--el-color-error-light-3': '#f89898',
    '--el-color-error-light-5': '#fab6b6',
    '--el-color-error-light-7': '#fcd3d3',
    '--el-color-error-light-8': '#fde2e2',
    '--el-color-error-light-9': '#fef0f0',
    '--el-color-error-dark-2': '#c45656',
    '--el-color-info': '#909399',
    '--el-color-info-light-3': '#b1b3b8',
    '--el-color-info-light-5': '#c8c9cc',
    '--el-color-info-light-7': '#dedfe0',
    '--el-color-info-light-8': '#e9e9eb',
    '--el-color-info-light-9': '#f4f4f5',
    '--el-color-info-dark-2': '#73767a',
    '--el-bg-color': '#ffffff', // 背景颜色
    '--el-bg-color-page': '#f2f3f5',
    '--el-bg-color-overlay': '#ffffff',
    '--el-text-color-primary': '#303133', // 主要文字颜色
    '--el-text-color-regular': '#606266', // 主要文字颜色
    '--el-text-color-secondary': '#909399', // 次要文字颜色
    '--el-text-color-placeholder': '#a8abb2', // 占位文字颜色
    '--el-text-color-disabled': '#c0c4cc',
    '--el-border-color': '#dcdfe6', // 边框的颜色，用于大多数边框
    '--el-border-color-light': '#e4e7ed', // 二级边框颜色
    '--el-border-color-lighter': '#ebeef5', // 三级边框颜色
    '--el-border-color-extra-light': '#f2f6fc', // 四级边框颜色
    '--el-border-color-dark': '#d4d7de',
    '--el-border-color-darker': '#cdd0d6',
    '--el-fill-color': '#f0f2f5',
    '--el-fill-color-light': '#f5f7fa',
    '--el-fill-color-lighter': '#fafafa',
    '--el-fill-color-extra-light': '#fafcff',
    '--el-fill-color-dark': '#ebedf0',
    '--el-fill-color-darker': '#e6e8eb',
    '--el-fill-color-blank': '#ffffff',
    '--el-box-shadow': '0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08)',
    '--el-box-shadow-light': '0px 0px 12px rgba(0, 0, 0, .12)',
    '--el-box-shadow-lighter': '0px 0px 6px rgba(0, 0, 0, .12)',
    '--el-box-shadow-dark':
      '0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16)',
    '--el-disabled-bg-color': 'var(--el-fill-color-light)',
    '--el-disabled-text-color': 'var(--el-text-color-placeholder)',
    '--el-disabled-border-color': 'var(--el-border-color-light)',
    '--el-overlay-color': 'rgba(0, 0, 0, .8)',
    '--el-overlay-color-light': 'rgba(0, 0, 0, .7)',
    '--el-overlay-color-lighter': 'rgba(0, 0, 0, .5)',
    '--el-mask-color': 'rgba(255, 255, 255, .9)',
    '--el-mask-color-extra-light': 'rgba(255, 255, 255, .3)',
    '--el-border-width': '1px',
    '--el-border-style': 'solid',
    '--el-border-color-hover': 'var(--el-text-color-disabled)', // 鼠标悬停时边框的颜色。
    '--el-border': 'var(--el-border-width) var(--el-border-style) var(--el-border-color)',
    '--el-svg-monochrome-grey': 'var(--el-border-color)',
    // menu el-sub-menu__title
    '--el-sub-menu-bg': '#FFF',
    // 根下的右侧container
    '--el-root-right-container-bg': '#FFF',
    // 整体内容card的背景色
    '--el-main-bg-color': '#F0F1F5'
  },
  THEME_DARK: {
    'color-scheme': 'dark',
    '--el-color-white': '#d7c9c6',
    '--el-color-black': '#012447',
    '--el-color-primary': '#a04d66',
    '--el-color-primary-light-3': '#79bbff',
    '--el-color-primary-light-5': '#a0cfff',
    '--el-color-primary-light-7': '#c6e2ff',
    '--el-color-primary-light-8': '#d9ecff',
    '--el-color-primary-light-9': '#ecd2c5',
    '--el-color-primary-dark-2': '#337ecc',
    '--el-color-success': '#67c23a',
    '--el-color-success-light-3': '#95d475',
    '--el-color-success-light-5': '#b3e19d',
    '--el-color-success-light-7': '#d1edc4',
    '--el-color-success-light-8': '#e1f3d8',
    '--el-color-success-light-9': '#f0f9eb',
    '--el-color-success-dark-2': '#529b2e',
    '--el-color-warning': '#e6a23c',
    '--el-color-warning-light-3': '#eebe77',
    '--el-color-warning-light-5': '#f3d19e',
    '--el-color-warning-light-7': '#f8e3c5',
    '--el-color-warning-light-8': '#faecd8',
    '--el-color-warning-light-9': '#fdf6ec',
    '--el-color-warning-dark-2': '#b88230',
    '--el-color-danger': '#f56c6c',
    '--el-color-danger-light-3': '#f89898',
    '--el-color-danger-light-5': '#fab6b6',
    '--el-color-danger-light-7': '#fcd3d3',
    '--el-color-danger-light-8': '#fde2e2',
    '--el-color-danger-light-9': '#fef0f0',
    '--el-color-danger-dark-2': '#c45656',
    '--el-color-error': '#f56c6c',
    '--el-color-error-light-3': '#f89898',
    '--el-color-error-light-5': '#fab6b6',
    '--el-color-error-light-7': '#fcd3d3',
    '--el-color-error-light-8': '#fde2e2',
    '--el-color-error-light-9': '#fef0f0',
    '--el-color-error-dark-2': '#c45656',
    '--el-color-info': '#909399',
    '--el-color-info-light-3': '#b1b3b8',
    '--el-color-info-light-5': '#c8c9cc',
    '--el-color-info-light-7': '#dedfe0',
    '--el-color-info-light-8': '#e9e9eb',
    '--el-color-info-light-9': '#f4f4f5',
    '--el-color-info-dark-2': '#73767a',
    '--el-bg-color': '#d7c9c6',
    '--el-bg-color-page': '#d7c9c6',
    '--el-bg-color-overlay': '#d7c9c6',
    '--el-text-color-primary': '#4f2733', // 主要文字颜色
    '--el-text-color-regular': '#4f2733', // 常规文字颜色
    '--el-text-color-placeholder': '#685844', // 占位文字颜色
    '--el-text-color-secondary': '#FFFFFF', // 次要文字颜色
    '--el-text-color-disabled': '#c0c4cc',
    '--el-border-color': '#a04d66', //
    '--el-border-color-light': '#a04d66', // 二级边框颜色
    '--el-border-color-lighter': '#58A9F5', // 三级边框颜色
    '--el-border-color-extra-light': '#86B3F9', // 四级边框颜色
    '--el-border-color-dark': '#d4d7de',
    '--el-border-color-darker': '#cdd0d6',
    '--el-fill-color': '#012447',
    '--el-fill-color-light': '#d7c9c6',
    '--el-fill-color-lighter': '#d7c9c6',
    '--el-fill-color-extra-light': '#d7c9c6',
    '--el-fill-color-dark': '#d7c9c6',
    '--el-fill-color-darker': '#d7c9c6',
    '--el-fill-color-blank': '#FFF',  // 左侧侧边栏
    '--el-box-shadow': '0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .08)', // 元素的阴影效果
    '--el-box-shadow-light': '0px 0px 12px rgba(0, 0, 0, .12)',
    '--el-box-shadow-lighter': '0px 0px 6px rgba(0, 0, 0, .12)',
    '--el-box-shadow-dark':
      '0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16)',
    '--el-disabled-bg-color': 'var(--el-fill-color-light)',
    '--el-disabled-text-color': 'var(--el-text-color-placeholder)',
    '--el-disabled-border-color': 'var(--el-border-color-light)',
    '--el-overlay-color': 'rgba(0, 0, 0, .8)',
    '--el-overlay-color-light': 'rgba(0, 0, 0, .7)',
    '--el-overlay-color-lighter': 'rgba(0, 0, 0, .5)',
    '--el-mask-color': 'rgba(255, 255, 255, .9)',
    '--el-mask-color-extra-light': 'rgba(255, 255, 255, .3)',
    '--el-border-width': '1px',
    '--el-border-style': 'solid',
    '--el-border-color-hover': 'red',
    '--el-border': 'var(--el-border-width) var(--el-border-style) var(--el-border-color)',
    '--el-svg-monochrome-grey': 'var(--el-border-color)',
    // menu el-sub-menu__title
    '--el-sub-menu-bg': '#FFF',
    // 根下的右侧container#ecd2c5
    '--el-root-right-container-bg': '#fff9f6',
    // 整体内容card的背景色
    '--el-main-bg-color': '#FFF'
  },
};
