import { NextApiRequest, NextApiResponse } from 'next';
import shortid from 'shortid';
import db from '../../../db';
import { Post } from '../../../src/api/types';
import { sleep } from '../../../utils';

// allows you to simulate flakey API's
const failureRate = 0;

async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (Math.random() < failureRate) {
    res.status(500);
    res.json({ message: 'An unknown error occurred!' });
    return;
  }

  const {
    query: { pageOffset, pageSize },
  } = req;

  const posts = (await db.get()).posts.map((post: Post) => ({
    ...post,
    body: post.body.substring(0, 50) + (post.body.length > 50 ? '...' : ''), // Don't return full body in list calls
  }));

  if (Number(pageSize)) {
    const start = Number(pageSize) * Number(pageOffset);
    const end = start + Number(pageSize);
    const page = posts.slice(start, end);

    return res.json({
      items: page,
      nextPageOffset: posts.length > end ? Number(pageOffset) + 1 : undefined,
    });
  }

  res.json(posts);
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (Math.random() < failureRate) {
    res.status(500);
    res.json({ message: 'An unknown error occurred!' });
    return;
  }

  const row = {
    id: shortid.generate(),
    ...req.body,
  };

  await db.set((old) => {
    if (!Array.isArray(old.posts)) return old;
    return {
      ...old,
      posts: [...old.posts, row],
    };
  });

  res.json(row);
}

export default async function PostsApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await sleep(1000);

  try {
    if (req.method === 'GET') {
      return await GET(req, res);
    }
    if (req.method === 'POST') {
      return await POST(req, res);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500);
    res.json({ message: 'An unknown error occurred!' });
  }
}
