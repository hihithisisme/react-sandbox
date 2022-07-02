import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import { Center } from '@chakra-ui/react';

const DynamicComponent = dynamic(() => import('../../components/SVGSandbox'), {
    ssr: false,
});

const size = 600;

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
