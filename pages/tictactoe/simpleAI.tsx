import { Flex } from '@chakra-ui/react';
import Layout from '../../features/structural/components/Layout';
import AITicTacToe from '../../features/tictactoe/components/AITicTacToe';

function TicTacToePage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <AITicTacToe />
            </Flex>
        </Layout>
    );
}

export default TicTacToePage;
