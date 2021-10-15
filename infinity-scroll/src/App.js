import React, { useEffect, useState, useRef, useCallback } from "react";
import getPostData from "./requestAPI";

function App() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [paginationParam, setPaginationParam] = useState('');
  const [postsData, setPostsData] = useState();
  const observedElement = useRef();

  async function executePagination() {
    setIsPageLoading(true);
    const newPostsData = await getPostData(paginationParam);
    setPaginationParam(newPostsData.after);
    setPostsData([...postsData, ...newPostsData.children]);
    setIsPageLoading(false);
  }

  const lastPostElementRef = useCallback((element) => {
    if (isPageLoading) return;

    if (observedElement.current) observedElement.current.disconnect();

    observedElement.current = new IntersectionObserver(async (elements) => {
      if (elements[0].isIntersecting && paginationParam) {
        await executePagination();
      }
    })

    if (element) observedElement.current.observe(element);
  }, [isPageLoading]);


  useEffect(() => {
    const getPostsData = async () => {
      setIsPageLoading(true);
      const postsData = await getPostData();
      setPaginationParam(postsData.after);
      setPostsData(postsData.children);
      setIsPageLoading(false);
    }

    getPostsData();
  }, []);

  function renderRedditPosts() {
    if (postsData) {
      return (
        postsData.map((post, index) => {
          if (postsData.length === index + 1) {
            return <p key={index} ref={lastPostElementRef}>{post.data.title}</p>
          }
          return <p key={index}>{post.data.title}</p>
        })
      )
    }
  }

  return (
    <div>
      <div>
        { isPageLoading ? <p>Loading...</p> : null }
        {renderRedditPosts()}
      </div>
    </div>
  );
}

export default App;
