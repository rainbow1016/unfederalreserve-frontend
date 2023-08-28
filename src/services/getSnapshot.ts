/**
 * GQL doc: https://docs.snapshot.org/graphql-api
 */


const SNAPSHOT_BASE_URL = 'https://hub.snapshot.org/graphql?';

const BASE_HEADERS = {
  'Content-Type': 'application/json',
};

const handleError = <T>(response: Response) => {
  if (!response.ok) return Promise.reject(response);
  return response.json() as Promise<T>;
};

const requester = <T>(query: string) => {
  const url = `${SNAPSHOT_BASE_URL}`;

  const body = JSON.stringify({
    query,
    variables: null,
  });

  const init = {
    method: 'POST',
    headers: BASE_HEADERS,
    body,
  };

  return fetch(url, init).then((response) => (
    handleError<T>(response)
  ));
};

export type TProposal = {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  scores: number[];
  state: string;
  author: string;
  space: {
    id: string;
    name: string;
  };
};

export const getProposals = () => {
  const query = `
    query {
      proposals (
        first: 3,
        skip: 0,
        where: {
          space_in: ["unersdl.eth"]
        },
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        title
        body
        choices
        start
        end
        snapshot
        scores
        state
        author
        space {
          id
          name
        }
      }
    }
  `;

  type TResultGetBlocks = {
    data: {
      proposals: TProposal[];
    };
   }
  return requester<TResultGetBlocks>(query);
};

export const getSnapshot = async () => {
  const result = await getProposals();

  // proposalsInfo.proposals.forEach((el) => {
  //   const { id } = el;
  //   void getVote(id);
  // });

  return result.data;
};
