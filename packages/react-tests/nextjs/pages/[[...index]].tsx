import { BuilderComponent, builder } from '@builder.io/react';
import { getAPIKey, getAllPathnames, getProps } from '@sdk/tests';
import type { GetStaticPathsResult, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import '@builder.io/widgets/dist/lib/builder-widgets-async';

builder.init(getAPIKey());

type StaticProps = { index: string[] };

export async function getStaticProps(x: GetStaticPropsContext<StaticProps>) {
  return {
    props: await getProps({ pathname: x.params?.index ? `/${x.params.index.join('/')}` : '/' }),
  };
}

export function getStaticPaths(): GetStaticPathsResult<StaticProps> {
  return {
    paths: getAllPathnames('gen1-next').map(path => {
      const output: StaticProps = {
        index: path === '/' ? [] : path.split('/').filter(Boolean),
      };

      return { params: output };
    }),
    fallback: true,
  };
}

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

// default to not tracking, and re-enable when appropriate
builder.canTrack = false;

export default function Page(props: PageProps & { apiVersion: any }) {
  const router = useRouter();

  if (props?.apiVersion) {
    builder.apiVersion = props?.apiVersion;
  }

  // only enable tracking if we're not in the `/can-track-false` and `symbol-tracking` test route
  useEffect(() => {
    if (!router.asPath.includes('can-track-false') && !router.asPath.includes('symbol-tracking')) {
      builder.canTrack = true;
    }
    if (router.asPath.includes('get-query')) {
      builder
        .get('', {
          ...props,
          ...props['options'],
        })
        .promise()
        .then();
    } else if (router.asPath.includes('get-content')) {
      builder.apiEndpoint = props.apiEndpoint;
      delete props.apiEndpoint;
      builder
        .get('', {
          ...props,
          ...props['options'],
        })
        .promise()
        .then();
    } else if (router.asPath.includes('with-fetch-options')) {
      builder
        .get('', {
          ...props,
          fetchOptions: {
            method: 'POST',
            body: JSON.stringify({
              test: 'test',
            }),
          },
        })
        .promise()
        .then();
    }
  }, []);

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {!props.content && <meta name="robots" content="noindex" />}
      </Head>
      {!props ? <DefaultErrorPage statusCode={404} /> : <BuilderComponent {...props} />}
    </>
  );
}
