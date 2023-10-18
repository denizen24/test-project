interface CreateSupportRequestParams {
  text: string;
}

interface CreateSupportRequestMessageParams {
  text: string;
}

interface MarkAsReadParams {
  createdBefore: string;
}

interface GetSupportRequestsQueryParams extends Paginated {
  isActive?: boolean;
}
