import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Textarea,
  Tooltip,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { WorldIDWidget } from "@worldcoin/id";
import { useEthereumProvider } from 'hooks/useEthereumProvider';
import { useTableland, TABLE_NAME_COMMENT } from 'hooks/useTableland';
import { useAccount } from 'wagmi'


const WriteComment = () => {
  const { address, isConnected } = useAccount()
  const { ethereumProvider } = useEthereumProvider();
  const { writeQueryOnComment, readQuery } = useTableland();
  const [msg, setMsg] = useState('')

  const [successMsg, setSuccessMsg] = useState('');

  async function writeComment() {
    if (address && ethereumProvider) {
      const query = await readQuery(ethereumProvider, TABLE_NAME_COMMENT)
      console.log('row', query.rows.length)
      await writeQueryOnComment(ethereumProvider, TABLE_NAME_COMMENT, {
        id: query.rows.length,
        name: 'Ryan',
        address,
        amount: 0,
        message: msg,
      })
      setSuccessMsg('successful for Transaction..!')
    }
  }

  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      p={8}
      color={useColorModeValue('gray.700', 'whiteAlpha.900')}
      shadow="base">
      <VStack spacing={5}>
        <FormControl isRequired>
          <FormLabel>Message</FormLabel>

          <Textarea
            name="message"
            placeholder="Your Message"
            rows={6}
            resize="none"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </FormControl>

        <WorldIDWidget
          actionId={process.env.WORLD_COIN_ACTION_ID} // obtain this from developer.worldcoin.org
          signal="my_signal"
          enableTelemetry
          onSuccess={(verificationResponse) => console.log(verificationResponse)} // you'll actually want to pass the proof to the API or your smart contract
          onError={(error) => console.error(error)}
        />;

        <Button
          colorScheme="blue"
          bg="blue.400"
          color="white"
          _hover={{
            bg: 'blue.500',
          }}
          onClick={writeComment}
        >
          Send Message
        </Button>

        {successMsg && 
          <h2>
            {successMsg}
          </h2>
        }
      </VStack>
    </Box>
  )
}

export default WriteComment;