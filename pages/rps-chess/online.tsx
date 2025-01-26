import { Flex } from '@chakra-ui/react';
import RpsChess from '../../features/rps-chess/components/RpsChess';
import Layout from '../../features/structural/components/Layout';

function RpcChessPage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <RpsChess />
            </Flex>
        </Layout>
    );
}

export default RpcChessPage;
