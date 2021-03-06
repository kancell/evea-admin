import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PageHeader } from 'antd';
import { Breadcrumb } from 'antd';
import { useLocation } from 'umi';
import { useRouteMatch } from 'umi';
import { withRouter, Switch } from 'umi';
import { Link } from 'umi';
import PhoneNav from '@/layouts/phoneNav';
import { useSpring, animated, useTransition } from 'react-spring';

//ant-page-header
/* import defaultRouter from '../../config/routes';
import React from 'react';
const breadRoutes = {
  itemRender: (route: any, params: any, routes: any, paths: any) => {
    const secondRoute = routes.indexOf(route) === 1;
    return secondRoute ? (
      <Link to={route.path} style={{ color: 'rgba(0,0,0,0.65)' }}>
        {route.name}
      </Link>
    ) : (
      <span>{route.name}</span>
    );
  },
};

const ANIMATION_MAP: any = {
  PUSH: 'forward',
  POP: 'back',
}; */

export default withRouter(({ location, children, history }: any) => {
  const transitions = useTransition(location, {
    enter: (item) => [{ life: '100%', translateX: '0px', display: 'block', opacity: '1' }],
    from: { life: '0%', translateX: '-100vw', display: 'none', opacity: '0' },
  });

  return transitions((props, item) => (
    <>
      <animated.div style={props}>
        <div className="p-4">{children}</div>
      </animated.div>
      <PhoneNav></PhoneNav>
    </>
  ));
});
