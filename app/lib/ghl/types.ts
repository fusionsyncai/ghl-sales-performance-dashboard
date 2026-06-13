/** What we persist (encrypted) in the session cookie. */
export interface GhlSession {
  accessToken: string;
  refreshToken: string;
  /** Epoch ms when the access token expires. */
  expiresAt: number;
  locationId: string;
  userId?: string;
  scope?: string;
}

/** Raw token response from POST /oauth/token. */
export interface GhlTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope?: string;
  userType?: string;
  locationId?: string;
  userId?: string;
  companyId?: string;
}

export type OpportunityStatus = "open" | "won" | "lost" | "abandoned";

export interface GhlOpportunity {
  id: string;
  name?: string;
  monetaryValue?: number;
  status: OpportunityStatus;
  pipelineId?: string;
  pipelineStageId?: string;
  assignedTo?: string;
  contactId?: string;
  contact?: { id?: string; name?: string; email?: string; phone?: string };
  createdAt?: string;
  updatedAt?: string;
  lastActionDate?: string;
  lastStatusChangeAt?: string;
}

export interface GhlUser {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface GhlPipelineStage {
  id: string;
  name?: string;
  position?: number;
}

export interface GhlPipeline {
  id: string;
  name?: string;
  stages?: GhlPipelineStage[];
}
