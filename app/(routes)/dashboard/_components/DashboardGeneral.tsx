import { User } from "@interfaces";

interface Props {
  user: User;
}

export const DashboardGeneral = ({ user }: Props) => {
  return (
    <div>
      DashboardGeneral {user.name} / {user.role}
    </div>
  );
};

export default DashboardGeneral;
