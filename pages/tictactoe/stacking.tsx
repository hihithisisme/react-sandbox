import { Flex } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import StackingOnlineTicTacToe from '../../components/tictactoe/stacking/StackingOnlineTicTacToe';

function SimpleOnlineTicTacToePage() {
    return (
        <Layout>
            <Flex py={5} px={5} justify={'center'}>
                <StackingOnlineTicTacToe />
            </Flex>
        </Layout>
    );
}

export default SimpleOnlineTicTacToePage;
