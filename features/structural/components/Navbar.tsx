import { useColorModeValue } from '@/components/ui/color-mode';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    CloseIcon,
    HamburgerIcon,
} from '@chakra-ui/icons';
import {
    Box,
    Button,
    Collapsible,
    Flex,
    Icon,
    IconButton,
    Link,
    LinkBox,
    LinkOverlay,
    Popover,
    PopoverTrigger,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { HouseSimple } from '@phosphor-icons/react';

export default function WithSubnavigation() {
    const { open, onToggle } = useDisclosure();

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    <NavIconButton onClick={onToggle} open={open} />
                </Flex>

                <Flex flex={1} justify={{ base: 'center', md: 'start' }}>
                    <NavLogo />

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav />
                    </Flex>
                </Flex>

                <Flex flex={{ base: 1, md: 0 }} />
                {/*<NavRightSide />*/}
            </Flex>

            <Collapsible.Root open={open} animateOpacity>
                <Collapsible.Content>
                    <MobileNav />
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    );
}

const NavRightSide = () => {
    return (
        <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            gap={6}
        >
            <Button asChild fontSize={'sm'} fontWeight={400}>
                <a href="#">Sign in</a>
            </Button>
            <Button
                asChild
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'pink.400'}
                _hover={{
                    bg: 'pink.300',
                }}
            >
                <a href="#">Sign up</a>
            </Button>
        </Stack>
    );
};

function NavIconButton(props: { onClick: () => void; open: boolean }) {
    return (
        <IconButton
            onClick={props.onClick}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
        >
            {props.open ? (
                <CloseIcon w={3} h={3} />
            ) : (
                <HamburgerIcon w={5} h={5} />
            )}
        </IconButton>
    );
}

function NavLogo() {
    return (
        <LinkBox>
            <LinkOverlay href={'/'} />
            <Icon as={HouseSimple} boxSize={6} verticalAlign={'middle'} />
        </LinkBox>
    );
}

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} gap={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover.Root trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize={'sm'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>
                        <Popover.Positioner>
                            {navItem.children && (
                                <Popover.Content
                                    border={0}
                                    boxShadow={'xl'}
                                    bg={popoverContentBgColor}
                                    p={4}
                                    rounded={'xl'}
                                    minW={'sm'}
                                >
                                    <Popover.Body>
                                        <Stack>
                                            {navItem.children.map((child) => (
                                                <DesktopSubNav
                                                    key={child.label}
                                                    {...child}
                                                />
                                            ))}
                                        </Stack>
                                    </Popover.Body>
                                </Popover.Content>
                            )}
                        </Popover.Positioner>
                    </Popover.Root>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
        >
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}
                    >
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{
                        opacity: '100%',
                        transform: 'translateX(0)',
                    }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}
                >
                    <Icon
                        color={'pink.400'}
                        w={5}
                        h={5}
                        as={ChevronRightIcon}
                    />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = () => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}
        >
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { open, onToggle } = useDisclosure();

    return (
        <Stack gap={4} onClick={children && onToggle}>
            <Flex
                asChild
                py={2}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}
            >
                <Link href={href ?? '#'}>
                    <Text
                        fontWeight={600}
                        color={useColorModeValue('gray.600', 'gray.200')}
                    >
                        {label}
                    </Text>
                    {children && (
                        <Icon
                            as={ChevronDownIcon}
                            transition={'all .25s ease-in-out'}
                            transform={open ? 'rotate(180deg)' : ''}
                            w={6}
                            h={6}
                        />
                    )}
                </Link>
            </Flex>

            <Collapsible.Root
                open={open}
                animateOpacity
                style={{ marginTop: '0!important' }}
            >
                <Collapsible.Content>
                    <Stack
                        mt={2}
                        pl={4}
                        borderLeft={1}
                        borderStyle={'solid'}
                        borderColor={useColorModeValue('gray.200', 'gray.700')}
                        align={'start'}
                    >
                        {children &&
                            children.map((child) => (
                                <Link
                                    key={child.label}
                                    py={2}
                                    href={child.href}
                                >
                                    {child.label}
                                </Link>
                            ))}
                    </Stack>
                </Collapsible.Content>
            </Collapsible.Root>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Timezone Converter',
        href: '/epoch',
    },
    {
        label: 'Spirit Blights',
        href: '/spirit-island/blights',
    },
    {
        label: 'Generative Squiggles',
        href: '/generative/squiggles',
    },
    {
        label: 'Tic-Tac-Toe',
        href: '/tictactoe/simpleAI',
    },
    {
        label: 'Online Tic-Tac-Toe',
        href: '/tictactoe/online',
    },
    {
        label: 'Stacking Tic-Tac-Toe',
        href: '/tictactoe/stacking',
    },
    {
        label: 'SanGuoSha',
        href: '/sanguosha',
        children: [
            {
                label: 'Play with Friends',
                href: '/sanguosha/online',
            },
        ],
    },
    // {
    //     label: 'Find Work',
    //     children: [
    //         {
    //             label: 'Job Board',
    //             subLabel: 'Find your dream design job',
    //             href: '#',
    //         },
    //         {
    //             label: 'Freelance Projects',
    //             subLabel: 'An exclusive list for contract work',
    //             href: '#',
    //         },
    //     ],
    // },
    // {
    //     label: 'Learn Design',
    //     href: '#',
    // },
];
