export const rolesList = [
  {
    mid: 'super_admin',
    name: 'Super Admin',
    requireSuperAdmin: true
  },
  {
    mid: 'admin',
    name: 'Admin',
    requireSuperAdmin: true
  },
  {
    mid: 'operations',
    name: 'Operations'
  },
  {
    mid: 'operator',
    name: 'Operator'
  },
  {
    mid: 'trainer',
    name: 'Trainer'
  },
  {
    mid: 'trainee',
    name: 'Trainee'
  }
];

export const superAdmin = ['super_admin'];
export const admin = ['super_admin', 'admin'];
export const operations = ['super_admin', 'admin', 'operations'];
export const operators = ['super_admin', 'admin', 'operations', 'operator'];
export const trainers = ['super_admin', 'admin', 'operations', 'operator', 'trainer'];
export const trainees = ['super_admin', 'admin', 'operations', 'operator', 'trainer', 'trainee'];
export const all = ['super_admin', 'admin', 'operations', 'operator', 'trainer', 'trainee'];
export const any = [];
