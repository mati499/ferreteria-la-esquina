import EditProductClient from './client'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditProductClient productId={id} />
}
