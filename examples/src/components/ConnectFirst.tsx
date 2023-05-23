import { Alert, AlertDescription, AlertIcon, AlertTitle, Heading, Text } from '@chakra-ui/react';

function ConnectFirst() {
  return (
    <Alert status="warning" variant="left-accent">
      <AlertIcon />
      <AlertTitle mr={2}>Wallet Required</AlertTitle>
      <AlertDescription>Please connect your wallet to continue</AlertDescription>
    </Alert>
  );
}

export default ConnectFirst;
