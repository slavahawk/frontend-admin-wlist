export const checkData = (data: any, error = "Not data") => {
  if (!data) {
    throw new Error(error);
  }
};
