import { InjectedConnector } from 'wagmi/connectors/injected';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import apiPost from 'utils/apiPost';
import { Button, Text, HStack, Avatar, useToast } from '@chakra-ui/react';
import { getEllipsisTxt } from 'utils/format';
import UAuth from '@uauth/js'
import { useState } from 'react';

const ConnectButton = () => {
  const { connectAsync } = useConnect({ connector: new InjectedConnector() });
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();
  const { data } = useSession();
  const [userAccount, setUserAccount] = useState<any>()

  const uauth = new UAuth({
    clientID: process.env.UAUTH_CLIENT_ID,
    redirectUri: process.env.UAUTH_REDIRECT_URI
  })

  const handleUAuth = async () => {
    try {
      const authorization = await uauth.loginWithPopup()
   
      const account = uauth.getAuthorizationAccount(authorization)
      setUserAccount(account);
      
    } catch (error) {
      toast({
        title: 'Oops, something is wrong...',
        description: (error as { message: string })?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  }


  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    try {
      const { account, chain } = await connectAsync();

      const userData = { address: account, chain: chain.id, network: 'evm' };

      const { message } = await apiPost('/auth/request-message', userData);

      const signature = await signMessageAsync({ message });

      await signIn('credentials', { message, signature, callbackUrl: '/' });
    } catch (e) {
      toast({
        title: 'Oops, something is wrong...',
        description: (e as { message: string })?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
      await uauth.logout()
    } catch (e) {
      console.error(e)
    }
    
    signOut({ callbackUrl: '/' });
  };

  if (data?.user || userAccount) {
    const address = data?.user ? data.user.address : userAccount.address
    return (
      <HStack onClick={handleDisconnect} cursor={'pointer'}>
        <Avatar size="xs" />
        <Text fontWeight="medium">{getEllipsisTxt(address)}</Text>
      </HStack>
    );
  }

  return (
    <HStack>
      <Button size="sm" onClick={handleAuth} colorScheme="blue">
        Connect Wallet
      </Button>
      <Button size="sm" onClick={handleUAuth} colorScheme="blue">
        Connect UAuth
      </Button>
    </HStack>
  );
};

export default ConnectButton;
