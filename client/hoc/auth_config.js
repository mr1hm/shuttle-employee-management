import auth from './auth';

export const superAdmin = auth(['super_admin']);
export const admin = auth(['super_admin', 'admin']);
export const operations = auth(['super_admin', 'admin', 'operations']);
export const operators = auth(['super_admin', 'admin', 'operations', 'operators']);
export const trainers = auth(['super_admin', 'admin', 'operations', 'operators', 'trainers']);
export const trainees = auth(['super_admin', 'admin', 'operations', 'operators', 'trainers', 'trainees']);
export const all = auth(['super_admin', 'admin', 'operations', 'operators', 'trainers', 'trainees']);
export const any = auth([]);
