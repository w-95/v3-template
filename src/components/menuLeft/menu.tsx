import { defineComponent, ref, computed } from 'vue';
import { ElMenu } from 'element-plus/lib/components/index.js';

import { useGlobalStore } from '@/store/global';

import { MenuListT, MenuT } from '@/interface/menu';

import ElSubMenu from './elSubMenu.vue';
import ElMenuItem from './elMenuItem.vue';
import SettingSubMenu from "./settingSubMenu.vue";
import MenuItemHeader from './menuItemHeader.vue';
import { useRouter } from "vue-router";

import "./menu.scss";

export default defineComponent({
  setup() {
    const globalStore = useGlobalStore();

    const router = useRouter();

    const isCollapse = ref(false);

    const handleOpen = () => {};
    
    const handleClose = () => {};
    
    const setIsCollapse = () => {
      isCollapse.value = !isCollapse.value;
    };

    const style = computed(() => {
      return {'width': isCollapse.value ? 'auto' : '280px'}
    });

    const menuChange = ({ name }: MenuT) => {
      switch (name) {
        case "产品列表":
          router.push({ name: 'ProdList'})
          break;
      
        default:
          router.push({ name: 'Console'})
          break;
      }
    };

    return () => (
        <ElMenu default-active="2" class="el-menu-vertical-demo" style={style.value}
            collapse={isCollapse.value} onOpen={handleOpen} onClose={handleClose}>

            <MenuItemHeader index='1' class="bottom-menu-item-first"></MenuItemHeader>

            <ElMenuItem index='2' title='console' iconName="console" onMenuChange={(menu) => menuChange(menu)}></ElMenuItem>

            {(globalStore.menuRoutes as Array<MenuListT[]>).map((item: any, index) => {
              if (item.child) {
                return (
                  <ElSubMenu index={index + 3 + ''} title={item.name} subMenuChild={item.child} lang={item.lang} onMenuChange={(menu) => menuChange(menu)}></ElSubMenu>
                );
              } else {
                return <ElMenuItem index={index + 3 + ''} title={item.name}></ElMenuItem>;
              }
            })}

            <ElMenuItem index='100' title='SETTINGS' isShowIcon={false}></ElMenuItem>

            <ElMenuItem index={globalStore.menuRoutes.length + 4 + ''} title='setting' iconName="setting"></ElMenuItem>

            <SettingSubMenu index={globalStore.menuRoutes.length + 5 + ''} title='themes'></SettingSubMenu>

            <ElMenuItem index={globalStore.menuRoutes.length + 98 + ''} title='' iconName=""></ElMenuItem>

            <el-menu-item index='99' class={ !isCollapse.value ? 'bottom-menu-item-last': 'bottom-menu-item-last-shou'} onClick={setIsCollapse}>
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
