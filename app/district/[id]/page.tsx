import { DistrictDetailPage } from '@/fsd/pages/district-detail';

type DistrictPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: DistrictPageProps) {
  const { id } = await params;

  return <DistrictDetailPage districtId={id} />;
}
