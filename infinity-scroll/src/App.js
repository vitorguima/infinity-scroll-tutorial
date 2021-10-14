import React, { useEffect, useState } from "react";
import getPostData from "./requestAPI";

function App() {
  const [paginationParam, setPaginationParam] = useState('');
  const [postsData, setPostsData] = useState();

  useEffect(() => {
    const getPostsData = async () => {
      const postsData = await getPostData();
      setPaginationParam(postsData.after);
      setPostsData(postsData.children)
    }

    getPostsData();
  }, []);

  function renderRedditPosts() {
    if (postsData) {
      return (
        postsData.map((post, index) => <p key={index}>{post.data.title}</p>)
      )
    }
  }

  async function executePagination() {
    const newPostsData = await getPostData(paginationParam);
    setPaginationParam(newPostsData.after);
    setPostsData([...postsData, ...newPostsData.children]);
  }

  return (
    <div>
      <div>
        {renderRedditPosts()}
      </div>
      <div>
        <button
          type="button"
          onClick={ () => executePagination() }
        >
          VER +
        </button>
      </div>
    </div>
  );
}

export default App;
