import { ApiError, Organization } from "../v1/types";

type BffApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
  message: string;
  success: boolean;
};

export type CreateOrg = BffApiResponse<Organization>;