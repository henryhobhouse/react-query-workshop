import React, { FC } from 'react';
import { useRouter } from 'next/router';

import { Layout } from '../../src/components/layout';
import usePost from '../../src/hooks/usePost';
import { Loader } from '../../src/components/styled';

const Post: FC = () => {
  const { query } = useRouter();
  const postId = Array.isArray(query.postId) ? query.postId[0] : query.postId;
  const postQuery = usePost(postId ?? '');

  if (postQuery.isError) return <Layout>{postQuery.error.message}</Layout>;

  return (
    <Layout>
      {postQuery.isLoading && (
        <span>
          <Loader /> Loading...
        </span>
      )}
      {postQuery.isSuccess && !postQuery.isLoading && (
        <div>
          <h2>{postQuery.data.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: postQuery.data.body }} />
        </div>
      )}
    </Layout>
  );
};

export default Post;
