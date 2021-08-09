export const users = [
  {
    id: '1', // DB에서 id를 부여한다.
    username: 'bob',
    password: '$2b$12$vY3yZHxVBvsQiAXuaTTzB.ALXlDKGot/280YQ131aUGqXXfeAEJNy', // bob12345
    name: 'Bob',
    email: 'bob@gmail.com',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
  {
    id: '2', // DB에서 id를 부여한다.
    username: 'jay',
    password: 'jay12345',
    name: 'Jay',
    email: 'jay@gmail.com',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4-300x300.png',
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
