# HTTP requests and responses

## axios

[axios](https://github.com/axios/axios) is a HTTP client for Node.js, and is thus used to perform HTTP requests and handle HTTP responses.

Because axios is promise-based, you can `await` a result, and then use the `.then` and `.catch` syntax to handle the response and error respectively. See the example below for context.

```js
const BACKEND_URL = "http://localhost:1337";

// POST payload to backend
await axios
  .post(`${BACKEND_URL}/sample/endpoint`, payload)
  .then((response) => {
    // You can do whatever you want with the response here
    console.log(response);
  })
  .catch((error) => {
    // You can do whatever you want with the error here
    console.log(error);
  });
```

Read more about axios how to use axios [here](https://github.com/axios/axios).
