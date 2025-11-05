import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeFilled, UnorderedListOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { tss } from './tss';

const { Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: '/', label: 'Home', icon: <HomeFilled /> },
  { key: '/list', label: 'List', icon: <UnorderedListOutlined /> },
];

export const LayoutWrapper = () => {
  const { classes } = useStyles();
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className={classes.rootLayout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth={80}
        className={classes.sider}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={(e) => {
            navigate(e.key);
            // Auto-collapse sidebar on mobile after navigation
            if (window.innerWidth < 992) {
              setCollapsed(true);
            }
          }}
        />
      </Sider>
      <Content className={classes.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};

const useStyles = tss.create(({ theme }) => ({
  rootLayout: {
    height: '100vh',
    backgroundColor: theme.color.surface,
    color: theme.color.text.primary,
    '& main': {
      padding: 16,
      overflowY: 'auto',
      '@media (max-width: 768px)': {
        padding: '12px',
      },
      '@media (max-width: 480px)': {
        padding: '8px',
      },
    },
  },
  sider: {
    '@media (max-width: 992px)': {
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
      '&.ant-layout-sider-collapsed': {
        width: '80px !important',
        minWidth: '80px !important',
        maxWidth: '80px !important',
      },
    },
  },
  content: {
    '@media (max-width: 992px)': {
      marginLeft: '80px !important',
    },
    '@media (max-width: 480px)': {
      marginLeft: '0 !important',
    },
  },
}));
