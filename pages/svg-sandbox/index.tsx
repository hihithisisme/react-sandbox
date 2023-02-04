import React from 'react';
import dynamic from 'next/dynamic';
import { Center } from '@chakra-ui/react';
import Layout from '../../features/structural/components/Layout';

const DynamicComponent = dynamic(() => import('../../features/structural/components/SVGSandbox'), {
    ssr: false,
});

const size = 800;

function SVGSandboxPage() {
    return (
        <Layout>
            <Center p={10}>
                <DynamicComponent height={size} width={size} />
            </Center>
        </Layout>
    );
}

export default SVGSandboxPage;
