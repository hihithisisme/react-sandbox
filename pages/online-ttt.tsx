import { Flex } from '@chakra-ui/react';
import Layout from '../components/Layout';
import OnlineTicTacToeProps from '../components/tictactoe/OnlineTicTacToe';

function OnlineTicTacToePage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <OnlineTicTacToeProps />
            </Flex>
        </Layout>
    );
}

export default OnlineTicTacToePage;
