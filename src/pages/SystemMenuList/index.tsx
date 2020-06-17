import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Modal, Form, Upload } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { FormInstance } from 'antd/lib/form';

import CreateForm from './components/CreateForm';
import { menuItem } from './data.d';
import { getMenuList, addMenu, deleteMenu, updateMenu } from './service';

const { confirm } = Modal

/**
 * 添加菜单
 * @param fields
 */
const handleAdd = async (fields: menuItem) => {
  const hide = message.loading('正在添加');
  try {
    await addMenu({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: menuItem) => {
  const hide = message.loading('正在配置');
  try {
    await updateMenu(fields);
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: menuItem[]) => {
  const hide = message.loading('正在删除');
  const id = selectedRows.map((row) => row.id)
  if (!selectedRows) return true;
  try {
    await deleteMenu({
      id,
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

/**
 * 删除提示
 * @param selectedRows
 */
const removeConfirm = (selectedRows: menuItem[]) => {
  return new Promise((resolve, reject) => {
    confirm({
      title: '是否删除当前菜单?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      content: '删除后将无法还原，请谨慎处理',
      async onOk() {
        await handleRemove(selectedRows)
        resolve()
      },
      onCancel() {
        reject()
      },
    });
  })
}

const tableDataManage = async () => {
  return getMenuList().then(({ data }) => {
    const columnData = data.records.map((col: ProColumns<menuItem>) => {
      const keyData = col
      keyData.key = col.id
      return keyData
    })
    return {
      current: 1,
      pageSize: "20",
      success: true,
      data: columnData,
      total: 100
    }
  })
}

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const showEditModal = (item: Partial<menuItem>) => {
    handleModalVisible(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.setFieldsValue(item);
      }
    }, 0);
  };
  const columns: ProColumns<menuItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'menu_text',
      rules: [
        {
          required: true,
          message: '菜单名称为必填项',
        },
      ],
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      hideInSearch: true,
      render: (_) => (
        <img width="30" src={String(_)} alt="菜单图标" />
      ),
      // renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
      //   if (type !== 'form') {
      //     return null;
      //   }
      //   const status = form.getFieldValue('icon');
      //   if (!status) {
      //     return <input type="file" placeholder="请输入" />;
      //   }
      //   return defaultRender(_);
      // }
    },
    {
      title: '排序',
      dataIndex: 'list_order',
      hideInSearch: true,
      valueType: 'digit'
    },
    {
      title: '是否显示',
      dataIndex: 'display',
      valueEnum: {
        0: { text: '否' },
        1: { text: '是' }
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record, index, action) => (
        <>
          <a
            onClick={() => {
              showEditModal(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a onClick={() => {
            removeConfirm([record]).then(() => {
              action.reload();
            }).catch(() => { });
          }}>删除</a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<menuItem>
        headerTitle="菜单权限"
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
            </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={(e) => {
                    if (e.key === 'remove') {
                      removeConfirm(selectedRows).then(() => {
                        action.reload();
                      }).catch(() => { });
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        request={tableDataManage}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<menuItem, menuItem>
          formRef={formRef}
          onSubmit={async (value) => {
            let success = false
            if (value.id) {
              success = await handleUpdate(value);
            } else {
              success = await handleAdd(value);
            }
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
    </PageHeaderWrapper>
  );
};

export default TableList;
