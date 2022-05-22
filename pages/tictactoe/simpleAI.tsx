import { Flex } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import AITicTacToe from '../../components/tictactoe/AITicTacToe';

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
