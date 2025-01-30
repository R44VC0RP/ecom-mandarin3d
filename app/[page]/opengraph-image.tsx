import OpengraphImage from 'components/opengraph-image';
import { prisma } from 'lib/prisma';

export const runtime = 'edge';

export default async function Image({ params }: { params: { page: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.page }
  });
  const title = page?.metaTitle || page?.title;

  return await OpengraphImage({ title });
}
