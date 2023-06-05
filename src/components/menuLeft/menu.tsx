import { defineComponent, ref, computed } from 'vue';
import { ElMenu } from 'element-plus/lib/components/index.js';

import { useGlobalStore } from '@/store/global';

import { MenuListT } from '@/interface/menu';

import ElSubMenu from './elSubMenu.vue';
import ElMenuItem from './elMenuItem.vue';
import SettingSubMenu from "./settingSubMenu.vue";
import MenuItemHeader from './menuItemHeader.vue';

import { useI18n } from 'vue-i18n';

import "./menu.scss";

export default defineComponent({
  setup() {
    const globalStore = useGlobalStore();

    const isCollapse = ref(false);

    const handleOpen = () => {};
    
    const handleClose = () => {};

    const { t } = useI18n();
    
    const setIsCollapse = () => {
      isCollapse.value = !isCollapse.value;
    };

    const style = computed(() => {
      return {'width': isCollapse.value ? 'auto' : '280px'}
    })

    return () => (
        <ElMenu default-active="2" class="el-menu-vertical-demo" style={style.value}
            collapse={isCollapse.value} onOpen={handleOpen} onClose={handleClose}>

            <MenuItemHeader index='1' class="bottom-menu-item-first"></MenuItemHeader>

            {(globalStore.menuRoutes as Array<MenuListT[]>).map((item: any, index) => {
              if (item.child) {
                return (
                  <ElSubMenu index={index + 2 + ''} title={item.name} subMenuChild={item.child} lang={item.lang}></ElSubMenu>
                );
              } else {
                return <ElMenuItem index={index + 2 + ''} title={item.name}></ElMenuItem>;
              }
            })}

            <ElMenuItem index='10' title='SETTINGS' isShowIcon={false}></ElMenuItem>

            <ElMenuItem index='8' title='setting' iconName="setting"></ElMenuItem>

            <SettingSubMenu index='9' title='themes'></SettingSubMenu>

            <el-menu-item index='11' class="bottom-menu-item-last" onClick={setIsCollapse}>
              <el-icon>
                {
                  isCollapse.value? <span class="icon iconfont zhankai-you zhy">&#xe635;</span> :
                  <span class="icon iconfont zhankai-zuo zhz">&#xe636;</span>
                }
              </el-icon>
            </el-menu-item >
        </ElMenu>
        
    );
  },
});
