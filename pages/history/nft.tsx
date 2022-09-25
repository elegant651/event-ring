import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { NFTTransfers } from 'components/templates/transfers/NFT';
import Moralis from 'moralis';

const NFTHistoryPage: NextPage = (props) => {
  return (
    <Default pageName="NFT Transfers">
      <NFTTransfers {...props} />
    </Default>
  );
};

export default NFTHistoryPage;
