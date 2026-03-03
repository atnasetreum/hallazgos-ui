import { User } from "@interfaces";

interface Props {
  user: User;
}

export const DashboardSupervisor = ({ user }: Props) => {
  return (
    <div>
      DashboardSupervisor {user.name} / {user.role}
    </div>
  );
};

export default DashboardSupervisor;
