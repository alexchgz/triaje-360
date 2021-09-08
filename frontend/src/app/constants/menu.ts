import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/auth.roles';
const adminRoot = environment.adminRoot;

export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
  roles?: UserRole[];
}

const data: IMenuItem[] = [
  // {
  //   icon: 'iconsminds-shop-4',
  //   label: 'menu.dashboards',
  //   to: `${adminRoot}/dashboards/all`,
  //   roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
  //   subs: [],
  // },
  {
    icon: 'iconsminds-digital-drawing',
    label: 'menu.schoolYears',
    to: `${adminRoot}/school-years/data-list`,
    roles: [UserRole.Admin],
  },
  {
    icon: 'iconsminds-air-balloon-1',
    label: 'menu.subjects',
    to: `${adminRoot}/subjects/data-list`,
    roles: [UserRole.Admin],
  },
  {
    icon: 'iconsminds-pantone',
    label: 'menu.users',
    to: `${adminRoot}/users/data-list`,
    roles: [UserRole.Admin],
  },
  // {
  //   icon: 'iconsminds-library',
  //   label: 'menu.exercises',
  //   to: `${adminRoot}/exercises/data-list`,
  //   roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
  // },
];
export default data;
