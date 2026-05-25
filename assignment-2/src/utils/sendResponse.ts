const sendResponse = (
  res: any,
  statusCode: number,
  success: boolean,
  message: string,
  data?: any,
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;
