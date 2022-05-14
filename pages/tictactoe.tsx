import { Flex } from '@chakra-ui/react';
import Layout from '../components/Layout';
import TicTacToe from '../components/tictactoe/TicTacToe';

function TicTacToePage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <TicTacToe />
            </Flex>
        </Layout>
    );
}

export default TicTacToePage;
