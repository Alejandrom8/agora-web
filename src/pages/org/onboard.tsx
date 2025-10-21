// pages/verification.tsx
import * as React from 'react';
import Head from 'next/head';
import { Container } from '@mui/material';
import { withAuth } from '@/lib/authSSR';
import { Organization, VerifyOrgInvitationCodeResponse } from '@/lib/bff/types';
import ValidateCode from '@/components/Org/Onboard/ValidateCode';
import { mockClient } from '@/lib/clients/mock';
import CreateOrgForm from '@/components/Org/Onboard/CreateOrgForm';
import { ApiError } from '@/lib/apiClient';
import { useRouter } from 'next/router';

type OrgOnboardProps = {
  initialError?: string;
  validated?: boolean;
  initialCode?: string;
};

function OrgOnboardPage({ initialError, validated, initialCode }: OrgOnboardProps) {
  const [step, setStep] = React.useState(validated ? 2 : 1);
  const router = useRouter();

  const handleCodeVerificationSuccess = () => {
    setStep(2);
  }

  const handleOrgCreationSuccess = (org: Organization) => {
    router.push(`/org/${org.identifier}`);
  };

  return (
    <>
      <Head>
        <title>Agora | Crea tu organización</title>
      </Head>

      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {
          step === 1 && (
            <ValidateCode
              initialError={initialError}
              initialCode={initialCode}
              onCodeVerificationSuccess={handleCodeVerificationSuccess}
            />
          )
        }
        {
          step === 2 && (
            <CreateOrgForm 
              onOrgCreationSuccess={handleOrgCreationSuccess}
            />
          )
        }
      </Container>
    </>
  );
}

export const getServerSideProps = withAuth<OrgOnboardProps>(async (ctx) => {
  const { code } = ctx.query;

  if (code) {
    try {
      //TODO: change to real api
      await mockClient.post<VerifyOrgInvitationCodeResponse>('/org-verify-code', { code });
      return {
        props: {
          validated: true,
        } 
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          props: {
            initialError: error?.message,
            initialCode: String(code),
          }
        };
      }
    }
  }

  return {
    props: {}
  };
});

export default OrgOnboardPage;
