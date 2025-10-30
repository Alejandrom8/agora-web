// pages/verification.tsx
import * as React from 'react';
import Head from 'next/head';
import { Container } from '@mui/material';
import { withAuth } from '@/lib/withAuth';
import { ListOrganizations, Organization, UserProfileResponse, VerifyOrgInvitationCodeResponse } from '@/lib/v1/types';
import ValidateCode from '@/components/Org/Onboard/ValidateCode';
import { mockClient } from '@/lib/clients/mock';
import CreateOrgForm from '@/components/Org/Onboard/CreateOrgForm';
import { ApiError } from '@/lib/apiClient';
import { useRouter } from 'next/router';
import { v1Client } from '@/lib/clients/v1';
import Sentry from '@sentry/nextjs';

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
  };

  const handleOrgCreationSuccess = (org: Organization) => {
    router.push(`/org/${org.id}`);
  };

  return (
    <>
      <Head>
        <title>Agora | Crea tu organización</title>
      </Head>

      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {step === 1 && (
          <ValidateCode
            initialError={initialError}
            initialCode={initialCode}
            onCodeVerificationSuccess={handleCodeVerificationSuccess}
          />
        )}
        {step === 2 && <CreateOrgForm onOrgCreationSuccess={handleOrgCreationSuccess} />}
      </Container>
    </>
  );
}

export const getServerSideProps = withAuth<OrgOnboardProps>(async ({ authHeader, ...ctx}) => {
  const { code } = ctx.query;

  // Check if the user has any existing organziation
  try {
    const currentUser = await v1Client.get<UserProfileResponse>(`/core/v1/users/me`, authHeader);
    console.log(currentUser);
    const result = await v1Client.get<ListOrganizations>(`/dashboard/v1/organizations?created_by=${currentUser.data?.user.id}`, authHeader);
    console.log(result);
    if (result && (result.data?.count || 0) > 0) {
      const org = result.data?.organizations[0];
      return {
        redirect: {
          permanent: false,
          destination: `/org/${org?.id}`,
        }
      }
    }
  } catch (error) {
    console.error(error);
    Sentry.logger.error(`Error while fetching orgs: ${JSON.stringify(error)}`);
  };

  if (code) {
    try {
      //TODO: change to real api
      await mockClient.post<VerifyOrgInvitationCodeResponse>('/org-verify-code', { code });
      return {
        props: {
          validated: true,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          props: {
            initialError: error?.message,
            initialCode: String(code),
          },
        };
      }
    }
  }

  return {
    props: {},
  };
});

export default OrgOnboardPage;
