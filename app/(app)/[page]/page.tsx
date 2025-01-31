import ContactForm from 'components/contact/contact-form';
import Prose from 'components/prose';
import { prisma } from 'lib/prisma';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await prisma.page.findUnique({
    where: { slug: params.page }
  });

  if (!page) return notFound();

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.content.substring(0, 160),
    openGraph: {
      publishedTime: page.createdAt.toISOString(),
      modifiedTime: page.updatedAt.toISOString(),
      type: 'article'
    }
  };
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  const page = await prisma.page.findUnique({
    where: { slug: params.page }
  });

  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.content} />
      {params.page === 'contact' && <ContactForm />}
      <p className="text-sm italic mt-8">
        {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(page.updatedAt)}.`}
      </p>
    </>
  );
}
