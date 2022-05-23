import { Flex } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import SimpleOnlineTicTacToe from '../../components/tictactoe/SimpleOnlineTicTacToe';

function SimpleOnlineTicTacToePage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <SimpleOnlineTicTacToe />
            </Flex>
        </Layout>
    );
}

export default SimpleOnlineTicTacToePage;
