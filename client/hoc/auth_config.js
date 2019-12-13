import auth from './auth';
import * as permissions from '../config/permissions';

export const superAdmin = auth(permissions.superAdmin);
export const admin = auth(permissions.admin);
export const operations = auth(permissions.operations);
export const operators = auth(permissions.operators);
export const trainers = auth(permissions.trainers);
export const trainees = auth(permissions.trainees);
export const all = auth(permissions.all);
export const any = auth(permissions.any);
