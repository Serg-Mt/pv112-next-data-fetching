const config = {
  columns: [
    { title: 'ID', getVal: obj => obj.id },
    { title: 'Name', getVal: ({ name }) => name, setVal: name => ({ name }) },
    { title: 'Email', getVal: ({ email }) => email, setVal: email => ({ email }) },
    { title: 'Address', getVal: ({ address: { street, suite, city } }) => `${city}, ${street} ${suite}`, },
    { title: 'Website', getVal: ({ website }) => website, setVal: website => ({ website }) },
    { title: 'Phone number', getVal: ({ phone }) => phone },
  ],
  genObj() { return { id: Math.random(), address: {} }; },
  async fetcher() {
    const
      response = await fetch('https://jsonplaceholder.typicode.com/users/');
    if (!response.ok) throw new Error('fetch ' + response.status);
    return await response.json();
  }
};

export default config;

