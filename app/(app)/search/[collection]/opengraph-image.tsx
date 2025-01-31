import OpengraphImage from 'components/opengraph-image';
import { prisma } from 'lib/prisma';

export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  const collection = await prisma.collection.findUnique({
    where: { handle: params.collection },
    include: { seo: true }
  });

  const title = collection?.seo?.title || collection?.title;

  return await OpengraphImage({ title });
}
