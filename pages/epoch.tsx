import { Flex } from '@chakra-ui/react';
import EpochConverter from '../features/epoch';
import Layout from '../features/structural/components/Layout';

function EpochPage() {
    return (
        <Layout>
            <Flex py={4} px={[8, 16]} justify={'start'}>
                <EpochConverter />
            </Flex>
        </Layout>
    );
}

export default EpochPage;
