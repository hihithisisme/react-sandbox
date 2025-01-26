import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Center,
    Divider,
    Heading,
    Image,
    Link,
    SimpleGrid,
    Spinner,
    Tag,
    TagLabel,
    TagLeftIcon,
    Text,
    VStack,
} from '@chakra-ui/react';
import { CrownSimple, User } from '@phosphor-icons/react';

interface AbilityInfo {
    title: string;
    description: string;
}

export interface HeroInfo {
    name: string;
    url: string;
    imgUrl: string;
    ability: AbilityInfo[]
}

interface HeroCardProps {
    hero: HeroInfo;
    onSubmit?: (hero: HeroInfo) => void;
    ownerUsername?: string;
    isRuler?: boolean;
}

function FilledUserIcon() {
    return <User weight='fill' opacity={0.64} />;
}

function FilledCrownSimpleIcon() {
    return <CrownSimple weight='fill' opacity={0.64} />;
}

function OwnerTag({ username, isRuler }: { username: string, isRuler?: boolean }) {
    return (
        <Tag variant={isRuler ? 'solid' : 'subtle'} size={'lg'} colorScheme='teal'>
            <TagLeftIcon mr={4} as={isRuler ? FilledCrownSimpleIcon : FilledUserIcon} />
            <TagLabel>{username}</TagLabel>
        </Tag>
    );
}

export function HeroCard(props: HeroCardProps) {
    const { hero, onSubmit } = props;
    return (
        <VStack p={5} rounded={10} borderWidth={2} shadow='md' spacing={3} bg={'blackAlpha.50'}        >
            <Heading as='h2'>
                <Link href={hero.url} isExternal>
                    {hero.name}
                    <ExternalLinkIcon mx={2} />
                </Link>
            </Heading>
            {
                props.ownerUsername && <OwnerTag username={props.ownerUsername} isRuler={props.isRuler} />
            }
            <Image src={hero.imgUrl} w='80%' />
            {
                hero.ability.map((a, idx) => {
                    return (
                        <Box key={idx}>
                            <Divider />
                            <Heading as={'h3'} size={'sm'}>{a.title}</Heading>
                            <Text>{a.description}</Text>
                        </Box>
                    )
                })
            }
            {
                onSubmit &&
                <Button colorScheme={'teal'} variant={"solid"} onClick={() => onSubmit(hero)}>Select!</Button>
            }
        </VStack >
    )
}

// TODO: shift functionality to websockets + cookies
// TODO: add in a replace hero functionality
// TODO: add in a I'm a ruler button to show the ruler cards

/* 
Use Cases for HeroCardsDisplay:
- Show a set of X random Heroes [deprioritized]
- Show a fixed selection of Heroes
- Have the ability to replace an individual Hero with a random one while keeping the rest

- Should draw from a limited deck [game logic]
 */
interface HeroCardsProps {
    heroes?: HeroInfo[];
    onSubmit?: (heroInfo: HeroInfo) => void;
}

export function HeroCards(props: HeroCardsProps) {
    // const [heroes, setHeroes] = useState<HeroInfo[] | undefined>(undefined);
    // useEffect(() => {
    //     setHeroes(Array('', '', '').map(() => randomlyChooseElement(heroes)));
    // }, [heroes]);

    if (!props.heroes) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }


    return (
        <SimpleGrid spacing={3} columns={{ base: 1, sm: 3 }}>
            {
                props.heroes.map(
                    (hero, idx) => <HeroCard key={idx} hero={hero} onSubmit={props.onSubmit} />
                )
            }
        </SimpleGrid>
    )
}

export default function SanGuoSha(props: HeroCardsProps) {
    return (
        <HeroCards heroes={props.heroes} />
    )
}
