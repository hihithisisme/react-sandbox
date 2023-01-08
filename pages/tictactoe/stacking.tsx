import { Flex } from '@chakra-ui/react';
import Layout from '../../features/structural/components/Layout';
import StackingOnlineTicTacToe from '../../features/tictactoe/stacking/components/StackingOnlineTicTacToe';

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
