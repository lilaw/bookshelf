import faker from "faker";

type user = {
  id: string;
  username: string;
  password: string;
};
export function buildUser(): user {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
}
