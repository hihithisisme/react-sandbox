import React from 'react';
import WithSubnavigation from './Navbar';

const Layout = ({ children }: React.PropsWithChildren<any>) => (
    <>
        <WithSubnavigation />
        {children}
    </>
);

export default Layout;
