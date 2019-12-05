export const responseHandler = {
  handle,
}

function handle(response) {
    return response.text().then(text => {
      let data = text;
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // remove user from local storage to log user out
                localStorage.removeItem('user');
                window.location.reload(true);
            }

            //const error = (data && data.message) || response.statusText;
            return Promise.reject(text);
        } else {
          const data = text && JSON.parse(text);
        }

        return data;
    });
}
