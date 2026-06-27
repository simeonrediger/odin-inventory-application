export function handleServerError(error, req, res, next) {
  console.error(error);
  error.statusCode ||= 500;
  error.message ||= 'Unknown error occurred';
  res
    .status(error.statusCode)
    .render(
      'server-error',
      { pageName: 'Server Error', error },
      (renderError, html) => {
        if (renderError) {
          res.send(`Server Error ${error.statusCode}: ${error.message}`);
        }

        res.send(html);
      },
    );
}
