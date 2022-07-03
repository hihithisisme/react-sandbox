import React from 'react';
import WithSubnavigation from './Navbar';
import { Box } from '@chakra-ui/react';

const Layout = ({ children, background }: React.PropsWithChildren<{ background?: string }>) => (
    <Box background={background} minH={background ? '100vh' : undefined}>
        <WithSubnavigation />
        {children}
    </Box>
);

export default Layout;
