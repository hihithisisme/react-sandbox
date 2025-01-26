import { Flex } from '@chakra-ui/react';
import RpsChess from '../../features/rps-chess/components/RpsChess';
import Layout from '../../features/structural/components/Layout';

function RpcChessOfflinePage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <RpsChess isOnline={false} />
            </Flex>
        </Layout>
    );
}

export default RpcChessOfflinePage;
