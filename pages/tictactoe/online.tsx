import { Flex } from '@chakra-ui/react';
import Layout from '../../features/structural/components/Layout';
import SimpleOnlineTicTacToe from '../../features/tictactoe/components/SimpleOnlineTicTacToe';

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
