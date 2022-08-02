const accounts = new Map([
  [
    'nunan',
    {
      name: 'nunan',
      balance: 33000,
    },
  ],
  [
    'nina',
    {
      name: 'nina',
      balance: 22000,
    },
  ],
]);

export function findAccount(accountName: string) {
  return accounts.get(accountName.toLowerCase());
}
