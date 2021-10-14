const getPostData = async (paginationParam) => {
  const ENDPOINT = `https://www.reddit.com/r/reactjs/hot.json?after=${paginationParam}&limit=30`;
  try {
    const getPostsRequest = await fetch(ENDPOINT);
    const response = await getPostsRequest.json();
    const data = response.data;
    return data;
  } catch (error) {
    return error;
  }
}

export default getPostData;
