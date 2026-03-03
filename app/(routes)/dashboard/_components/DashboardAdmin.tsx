import CriticalZonesAdmin from "./CriticalZonesAdmin";

interface Props {
  manufacturingPlantId: string;
}

export const DashboardAdmin = ({ manufacturingPlantId }: Props) => {
  return (
    <>
      <CriticalZonesAdmin manufacturingPlantId={manufacturingPlantId} />
    </>
  );
};

export default DashboardAdmin;
