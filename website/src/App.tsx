import * as React from 'react';
import { ConfigProvider } from 'antd';
import antd_zh_cn from 'antd/es/locale/zh_CN';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import HomePage from '@pages/home/HomePage';
import 'antd/dist/antd.css';

const App: React.FC = () => {
  return (
    <ConfigProvider {...antdConfig}>
      <HomePage />
    </ConfigProvider>
  );
};

const antdConfig: ConfigProviderProps = {
  locale: antd_zh_cn,
};

export default App;
