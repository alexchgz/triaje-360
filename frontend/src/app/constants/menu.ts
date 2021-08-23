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
  {
    icon: 'iconsminds-shop-4',
    label: 'menu.dashboards',
    to: `${adminRoot}/dashboards`,
    roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
    subs: [
      {
        icon: 'simple-icon-briefcase',
        label: 'menu.all',
        to: `${adminRoot}/dashboards/all`,
        roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
      },
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
        roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
      },
      {
        icon: 'iconsminds-pantone',
        label: 'menu.users',
        to: `${adminRoot}/users/data-list`,
        roles: [UserRole.Admin, UserRole.Teacher],
      },
      {
        icon: 'iconsminds-library',
        label: 'menu.exercises',
        to: `${adminRoot}/exercises/data-list`,
        roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
      },
    ],
  },
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
    roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
  },
  {
    icon: 'iconsminds-pantone',
    label: 'menu.users',
    to: `${adminRoot}/users/data-list`,
    roles: [UserRole.Admin, UserRole.Teacher],
  },
  {
    icon: 'iconsminds-library',
    label: 'menu.exercises',
    to: `${adminRoot}/exercises/data-list`,
    roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
  },
  {
    icon: 'iconsminds-digital-drawing',
    label: 'menu.profile',
    to: `${adminRoot}/pages`,
    roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student],
    subs: [
      {
        label: 'menu.authorization',
        to: '/user',
        // roles: [UserRole.Editor],
        subs: [
          {
            icon: 'simple-icon-user-following',
            label: 'menu.login',
            to: '/user/login',
            newWindow: true,
          },
          {
            icon: 'simple-icon-user-follow',
            label: 'menu.register',
            to: '/user/register',
            newWindow: true,
          },
          {
            icon: 'simple-icon-user-unfollow',
            label: 'menu.forgot-password',
            to: '/user/forgot-password',
            newWindow: true,
          },
          {
            icon: 'simple-icon-user-following',
            label: 'menu.reset-password',
            to: '/user/reset-password',
            newWindow: true,
          },
        ],
      },
      {
        label: 'menu.product',
        to: `${adminRoot}/pages/product`,
        subs: [
          {
            icon: 'simple-icon-credit-card',
            label: 'menu.data-list',
            to: `${adminRoot}/pages/product/data-list`,
          },
          {
            icon: 'simple-icon-list',
            label: 'menu.thumb-list',
            to: `${adminRoot}/pages/product/thumb-list`,
          },
          {
            icon: 'simple-icon-grid',
            label: 'menu.image-list',
            to: `${adminRoot}/pages/product/image-list`,
          },
          {
            icon: 'simple-icon-picture',
            label: 'menu.details',
            to: `${adminRoot}/pages/product/details`,
          },
          {
            icon: 'simple-icon-book-open',
            label: 'menu.details-alt',
            to: `${adminRoot}/pages/product/details-alt`,
          },
        ],
      },
      {
        label: 'menu.profile',
        to: `${adminRoot}/pages/profile`,
        subs: [
          {
            icon: 'simple-icon-share',
            label: 'menu.social',
            to: `${adminRoot}/pages/profile/social`,
          },
          {
            icon: 'simple-icon-link',
            label: 'menu.portfolio',
            to: `${adminRoot}/pages/profile/portfolio`,
          },
        ],
      },
      {
        label: 'menu.blog',
        to: `${adminRoot}/pages/blog`,
        subs: [
          {
            icon: 'simple-icon-share',
            label: 'menu.blog-list',
            to: `${adminRoot}/pages/blog/blog-list`,
          },
          {
            icon: 'simple-icon-link',
            label: 'menu.blog-detail',
            to: `${adminRoot}/pages/blog/blog-detail`,
          },
        ],
      },
      {
        label: 'menu.miscellaneous',
        to: `${adminRoot}/pages/miscellaneous`,
        subs: [
          {
            icon: 'simple-icon-question',
            label: 'menu.faq',
            to: `${adminRoot}/pages/miscellaneous/faq`,
          },
          {
            icon: 'simple-icon-graduation',
            label: 'menu.knowledge-base',
            to: `${adminRoot}/pages/miscellaneous/knowledge-base`,
          },

          {
            icon: 'simple-icon-diamond',
            label: 'menu.prices',
            to: `${adminRoot}/pages/miscellaneous/prices`,
          },
          {
            icon: 'simple-icon-magnifier',
            label: 'menu.search',
            to: `${adminRoot}/pages/miscellaneous/search`,
          },
          {
            icon: 'simple-icon-envelope-open',
            label: 'menu.mailing',
            to: `${adminRoot}/pages/miscellaneous/mailing`,
          },
          {
            icon: 'simple-icon-bag',
            label: 'menu.invoice',
            to: `${adminRoot}/pages/miscellaneous/invoice`,
          },

          {
            icon: 'simple-icon-exclamation',
            label: 'menu.error',
            to: '/error',
            newWindow: true,
          },
        ],
      },
    ],
  },
];
export default data;
