import { Flex } from '@chakra-ui/react';
import Layout from '../components/Layout';
import OnlineTicTacToe from '../components/tictactoe/OnlineTicTacToe';

// const DynamicTTT = dynamic(
//     () => import('../components/tictactoe/OnlineTicTacToe'),
//     { ssr: false }
// );

function OnlineTicTacToePage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <OnlineTicTacToe />
            </Flex>
        </Layout>
    );
}

export default OnlineTicTacToePage;
