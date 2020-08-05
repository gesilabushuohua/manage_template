/*
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 */


export const base = process.env.BASE_URL
  ? process.env.BASE_URL
  : '/mock/5e05b63bc50dc9001f37d09f';

export const get = params => {
  let records = [];
  for (let i = 0; i < 100 ; i++) {
    records.push({
      label: `一级 ${i}`,
      children: [
        {
          label: `二级 ${i}-1`,
          children: [
            {
              label: `三级 ${i}-1-1`
            }
          ]
        }
      ]
    })
  }
  return new Promise((resolve, reject) => {
    resolve({
      data: records
    });
  });
};



