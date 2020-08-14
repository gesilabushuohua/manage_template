/*
 * @Description: 权限指令
 * @Date: 2020-06-28 17:11:00
 * @Author: LB
 */


const checkPermission = () => {
  /*  if(condition){
     return true;
   }
   return false; */

  return true;
};


/* 定义权限指令 */
const handlePermission = function (el, binding, vnode) {
  const { value } = binding;

  const hasPermission = checkPermission(value);

  if (hasPermission) {
  } else {
    el.style = 'display:none';
  }
};

const hasPermission = {
  bind: handlePermission
};

export default hasPermission;