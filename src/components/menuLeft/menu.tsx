import {PropType, defineComponent} from "vue";
import { MenuListT } from "@/interface/menu";
import { ElSubMenu, ElMenuItemGroup, ElMenuItem } from "element-plus/lib/components/index.js";

const Menu = defineComponent({
    props: {
        menuList: {
            type: Array as PropType<MenuListT[]>,
            default: () => []
        }
    },
    
    setup( props ) {
        return () => (
           <>
            { props.menuList.map((item, index) => {
                if(item.child) {
                    return (
                        <div>456</div>
                        // <ElSubMenu index={index + 2}>
                        //     <template slot="title">{item.name}</template>
                        //     {item.child.map((subItem, sinx) => (
                        //         <ElMenuItemGroup index={subItem.name}>
                        //             <ElMenuItem index={index+2 + '-' + sinx + 1}>{subItem.name}</ElMenuItem>
                        //         </ElMenuItemGroup>
                        //     ))}
                        // </ElSubMenu>
                    )
                }else {
                    return (<div>123</div>)
                }
            })}
           </>
        )
    }
});

export default Menu;