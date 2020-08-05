
/* 
* @descrition 数据转换
*/

import { SEX } from '@/config/constant.js';

export const tableTranslator = data => {
  const { records } = data;
  const translatorRecords = [];
  for (let i = 0; i < records.length; i++) {
    let { date,
      name,
      province,
      city,
      sex,
      address,
      zip } = records[i];

    sex = SEX[sex];

    translatorRecords.push({
      date,
      name,
      province,
      city,
      sex,
      address,
      zip
    });
  }

  data.records = translatorRecords;
  return data;
};