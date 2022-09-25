import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Heading,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getEllipsisTxt } from 'utils/format';
import { useCovalent } from "hooks/useCovalent"

const History = ({ transfers }: { transfers : any}) => {
  const CONTRACT_ADDR = '0xB4967cb579330A89A285Fe6E875ac95ac09D7B3f'

  const [dataRows, setDataRows] = useState<any>([])
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => console.log('transfers: ', transfers), [transfers]);

    // covalent list
    const { 
      getNFTTokenIdsForContract, 
      getNFTTransactionsForContract, 
      getNFTExternalMetadataForContract 
    } = useCovalent()
  
    useEffect(() => {
      const fetch = async () => {
        const tokenIds = await getNFTTokenIdsForContract(CONTRACT_ADDR)
        console.log('t', tokenIds)
        
        setDataRows(tokenIds.data.items)
      }
      fetch()
    }, [])

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        NFT List
      </Heading>
      {dataRows?.length ? (
        <Box border="2px" borderColor={hoverTrColor} borderRadius="xl" padding="24px 18px">
          <TableContainer w={'full'}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Token Id</Th>
                  <Th>Contract Address</Th>
                  <Th>Contract Name</Th>
                  <Th>Contract Ticker Symbol</Th>
                  {/* <Th>Date</Th> */}
                  {/* <Th>Transactions</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {dataRows?.map((row : any, index: number) => (
                  <Tr key={index} _hover={{ bgColor: hoverTrColor }} cursor="pointer">
                    <Td>{row.token_id}</Td>
                    <Td>{getEllipsisTxt(row.contract_address || '')}</Td>
                    <Td>{row.contract_name}</Td>
                    <Td>{row.contract_ticker_symbol}</Td>
                    {/* <Td>{new Date(transfer.blockTimestamp).toLocaleDateString()}</Td> */}
                    {/* <Td isNumeric>{getEllipsisTxt(transfer.transactionHash, 2)}</Td> */}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>Looks Like you do not have any NFT transfers</Box>
      )}
    </>
  );
};

export default History;
