import { v1Client } from '@/lib/clients/v1';
import { ListOrganizations, UserProfileResponse } from '@/lib/v1/types';
import { withAuth } from '@/lib/withAuth';
import Sentry from '@sentry/nextjs';

function OrgPage({ error }) {
    return <>{error}</>;
}

export const getServerSideProps = withAuth(async ({ authHeader }) => {
  // Check if the user has any existing organziation
  try {
    const currentUser = await v1Client.get<UserProfileResponse>(`/core/v1/users/me`, authHeader);
    const result = await v1Client.get<ListOrganizations>(
      `/dashboard/v1/organizations?created_by=${currentUser.data?.user.id}`,
      authHeader,
    );
    if (result && (result.data?.count || 0) > 0) {
      const org = result.data?.organizations[0];
      return {
        redirect: {
          destination: `/org/${org?.id}`,
          permanent: false,
        },
      };
    }
    return {
        redirect: {
            destination: '/org/onboard',
            permanent: false,
        }
    }
  } catch (error) {
    Sentry.logger.error(`Error while fetching orgs: ${JSON.stringify(error)}`);
    return {
        props: {
            error,
        }
    };
  }
});

export default OrgPage;