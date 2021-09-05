export const users = [
  {
    id: '1', // DB에서 id를 부여한다.
    username: 'bob',
    password: '$2b$12$mhnJ92tY/OyL0C63tEkrcuU9REMXU5t0FloNQFc1m0R3wl2nLI9DW', // 12345
    name: 'Bob',
    email: 'bob@gmail.com',
    url: '',
  },
  {
    id: '2', // DB에서 id를 부여한다.
    username: 'jay',
    password: '$2b$12$mhnJ92tY/OyL0C63tEkrcuU9REMXU5t0FloNQFc1m0R3wl2nLI9DW', // 12345
    name: 'Jay',
    email: 'jay@gmail.com',
    url: '',
  },
];

export async function findByUsername(username) {
  return users.find(user => user.username === username);
  // 없으면 undefined
}
export async function createUser(user) {
  const created = { ...user, id: Date.now().toString() };
  users.push(created);
  return created.id;
}

export async function findById(id) {
  return users.find(user => user.id === id);
  // 없으면 undefined
}
