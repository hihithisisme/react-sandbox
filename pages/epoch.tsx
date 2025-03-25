import { Flex } from '@chakra-ui/react';
import EpochConverter from '../features/epoch';
import Layout from '../features/structural/components/Layout';

function EpochPage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <EpochConverter />
            </Flex>
        </Layout>
    );
}

export default EpochPage;
