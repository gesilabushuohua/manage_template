import beautifier from 'beautifier';

export const generateHtmlTemplate = (tableStruct, tableFunColumns, operateList) => {
  const FunColumns = tableFunColumns.map(key => {
    switch (key) {
      case 'selection':
        return `<el-table-column type="selection" width="55"></el-table-column>`;
      case 'index':
        return `<el-table-column type="index" width="50" label="编号">222</el-table-column>
          `;
      default:
        return '';
    }
  });

  const Operates = operateList.map(key => {
    switch (key) {
      case 'add':
        return `<el-button size="mini">新增</el-button>`;
      case 'edit':
        return `<el-button size="mini">编辑</el-button>`;
      case 'delete':
        return `<el-button size="mini">删除</el-button>`;
      default:
        return '';
    }
  });

  const OperateColumn = (() => {
    if (operateList.length < 1) {
      return '';
    }
    return `<el-table-column label="操作">
        <div slot-scope="scope">
         ${Operates.join('\n')}
        </div>
      </el-table-column>
      `;
  })();

  const { columns } = tableStruct;

  // 生成列函数
  const ColumnsTemplate = columns.map(column => {
    if (column.type) {
      switch (column.type) {
        case 'switch':
          return `<el-table-column label="${column.title}">
                <div slot-scope="scope">
                  <el-switch
                    v-model="${column.pro}"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </div>
              </el-table-column>
            `;
        case 'image':
          return `<el-table-column label="${column.title}">
                <template slot-scope="scope">
                  <img src=" " />
                </template>
              </el-table-column>
              `;
        default:
          return '';
      }
    }

    return `<el-table-column
          prop="${column.prop}'"
          label="${column.title}"
          type="${column.type ? column.type : ''}"
        ></el-table-column>
      `;
  });


  const template = `<el-table data="">
    ${ FunColumns.join('\n')}
    ${ ColumnsTemplate.join('\n')}
    ${ OperateColumn}
  </el-table>
`;

  const res = beautifier.js_beautify(template);


  return template;
};


