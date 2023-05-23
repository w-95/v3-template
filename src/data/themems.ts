import themesJson from "@/utils/themes";

const {THEME_DEFAULT: defaultTheme, THEME_DARK: darkTheme} = themesJson;

// 主题一 colors
export const THEME_DARK = [
    darkTheme["--el-bg-color"], 
    darkTheme["--el-border"], 
    darkTheme["--el-bg-color-page"], 
    darkTheme["--el-color-danger"],
    darkTheme["--el-color-warning"],
    darkTheme["--el-color-success"],
    darkTheme["--el-mask-color"],
    darkTheme["--el-fill-color"],
];

// 主题一 colors
export const THEME_DEFAULT = [
    defaultTheme["--el-bg-color"], 
    defaultTheme["--el-border"], 
    defaultTheme["--el-bg-color-page"], 
    defaultTheme["--el-color-danger"],
    defaultTheme["--el-color-warning"],
    defaultTheme["--el-color-success"],
    defaultTheme["--el-mask-color"],
    defaultTheme["--el-fill-color"],
]