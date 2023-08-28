
export const enum LegalTypes {
  loan_agreement = 'loan_agreement',
  terms_of_service = 'terms_of_service',
}

type IRequestOk = {
  message: string;
  length: never;
}

const handleError = <T>(response: Response, get?: boolean) => {
  const isFail = (
    (get && !response.ok && response.status !== 451)
    || (!get && !response.ok)
  );

  if (isFail) return Promise.reject(response);
  return response.json() as Promise<T>;
};

const requester = <T>(path: string, get?: boolean, data?: RequestInit) => {
  const url = process.env.VUE_APP_LEGAL_API + path;

  return fetch(url, data).then((response) => (
    handleError<T>(response, get)
  ));
};


export const getLegal = (address: string) => {
  const path = `legal?wallet=${address}`;
  return requester<LegalTypes[] | IRequestOk>(path, true);
};

export const setLegal = (
  wallet_address: string,
  legal_name: string,
  legal_version: number,
) => {
  const path = 'legal';

  const body = JSON.stringify({
    legal_name,
    legal_version,
    wallet_address,
  });

  const data = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return requester<IRequestOk>(path, false, data);
};
