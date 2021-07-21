import { useQuery } from 'react-query';

import { getPostById } from '../api/posts';

export default function usePost(postId) {
  return useQuery(['posts', postId], () => getPostById(postId));
}
