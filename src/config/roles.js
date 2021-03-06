/*
    Roles
*/

// In this roles for an user is assigned.

const roles = ['user', 'admin', 'hr', 'manager', 'timeKeeper'];

const userArray = [
  'getUsers',
  'manageUsers',
  'getUser',
  'manageOrganization',
  'getOrganizations',
  'getOrganization',
  'manageCandidates',
  'getCandidates',
  'getCandidate',
  'manageOnboardingStatus',
  'getOnboardingStatus',
  'manageTeamInfo',
  'getTeamInfo',
  'manageRolesandAccess',
  'getRolesandAccess',
  'manageTemplates',
  'getTemplates',
  'manageLocation',
  'getLocation',
  'manageEmploymentType',
  'getEmploymentType',
  'manageRoles',
  'getRoles',
  'manageBenefitGroups',
  'getBenefitGroups',
  'getBenefit',
  'manageBenefitPlans',
  'getBenefitPlans',
  'manageExecutedDocument',
  'getExecutedDocument',
  'notifications',
  'manageUserProfile',
  'getUserProfile',
  'manageOrganizationMember',
  'getOrganizationMember',
  'manageEligibilityRule',
  'getEligibilityRule',
  'manageLocationOfOperation',
  'getLocationOfOperation',
  'manageSpecialty',
  'getSpecialty',
  'manageEmployeeFolder',
  'getEmployeeFolder',
  'manageEmployeeFile',
  'getEmployeeFile',
  'manageSignatures',
  'getSignatures',
  'manageTimeCards',
  'getTimeCards',
  'getTimeCard',
  'managetimeOffTypes',
  'gettimeOffTypes',
  'gettimeOffType',
  'managetimeOffPolicys',
  'gettimeOffPolicys',
  'gettimeOffPolicy',
  'managerequestTimeOffs',
  'getrequestTimeOffs',
  'getrequestTimeOff',
  'manageUserLeaves',
  'getUserLeaves',
  'manageOrganizationFile',
  'getOrganizationFile',
  'manageOrganizationFolder',
  'getOrganizationFolder',
  'getESignature',
  'manageESignatures',
  'managerequestTimeCards',
  'getrequestTimeCards',

  // roles and access from here
  'getWorkInfo',
  'getTeamInfo',
  'getEmployeeFolder',
  'getEmployeeFile',
  'manageTodos',
  'getTodo',
  'managePolicies',
  'getPolicies',
];
const adminArray = [
  'getUsers',
  'manageUsers',
  'getUser',
  'manageOrganization',
  'getOrganizations',
  'getOrganization',
  'manageCandidates',
  'getCandidates',
  'getCandidate',
  'manageOnboardingStatus',
  'getOnboardingStatus',
  'manageTeamInfo',
  'getTeamInfo',
  'manageRolesandAccess',
  'getRolesandAccess',
  'manageTemplates',
  'getTemplates',
  'manageLocation',
  'getLocation',
  'manageEmploymentType',
  'getEmploymentType',
  'manageRoles',
  'getRoles',
  'manageBenefitGroups',
  'getBenefitGroups',
  'getBenefit',
  'manageBenefitPlans',
  'getBenefitPlans',
  'manageExecutedDocument',
  'getExecutedDocument',
  'notifications',
  'manageUserProfile',
  'getUserProfile',
  'manageOrganizationMember',
  'getOrganizationMember',
  'manageEligibilityRule',
  'getEligibilityRule',
  'manageLocationOfOperation',
  'getLocationOfOperation',
  'manageSpecialty',
  'getSpecialty',
  'manageEmployeeFolder',
  'getEmployeeFolder',
  'manageEmployeeFile',
  'getEmployeeFile',
  'manageSignatures',
  'getSignatures',
  'manageTimeCards',
  'getTimeCards',
  'getTimeCard',
  'managetimeOffTypes',
  'gettimeOffTypes',
  'gettimeOffType',
  'managetimeOffPolicys',
  'gettimeOffPolicys',
  'gettimeOffPolicy',
  'managerequestTimeOffs',
  'getrequestTimeOffs',
  'getrequestTimeOff',
  'manageUserLeaves',
  'getUserLeaves',
  'manageOrganizationFile',
  'getOrganizationFile',
  'manageOrganizationFolder',
  'getOrganizationFolder',
  'getESignature',
  'manageESignatures',
  'managerequestTimeCards',
  'getrequestTimeCards',

  // roles and access from here
  'manageWorkInfo',
  'getWorkInfo',
  'manageTeamInfo',
  'getTeamInfo',
  'manageEmployeeFolder',
  'getEmployeeFolder',
  'manageEmployeeFile',
  'getEmployeeFile',
  'manageTodos',
  'getTodo',
  'manageTasks',
  'getTasks',
  'managePolicies',
  'getPolicies',
];
const hrArray = [
  'getUsers',
  'getUser',
  'manageOrganization',
  'getOrganization',
  'getOrganizations',
  'manageCandidates',
  'getCandidates',
  'getCandidate',
  'manageOnboardingStatus',
  'getOnboardingStatus',
  'manageTeamInfo',
  'getTeamInfo',
  'manageRolesandAccess',
  'getRolesandAccess',
  'manageTemplates',
  'getTemplates',
  'manageLocation',
  'getLocation',
  'manageEmploymentType',
  'getEmploymentType',
  'manageRoles',
  'getRoles',
  'manageBenefitGroups',
  'getBenefitGroups',
  'getBenefit',
  'manageBenefitPlans',
  'getBenefitPlans',
  'manageExecutedDocument',
  'getExecutedDocument',
  'notifications',
  'manageUserProfile',
  'getUserProfile',
  'manageOrganizationMember',
  'getOrganizationMember',
  'manageEligibilityRule',
  'getEligibilityRule',
  'manageLocationOfOperation',
  'getLocationOfOperation',
  'manageSpecialty',
  'getSpecialty',
  'manageEmployeeFolder',
  'getEmployeeFolder',
  'manageEmployeeFile',
  'getEmployeeFile',
  'manageSignatures',
  'getSignatures',
  'manageTimeCards',
  'getTimeCards',
  'getTimeCard',
  'managetimeOffTypes',
  'gettimeOffTypes',
  'gettimeOffType',
  'managetimeOffPolicys',
  'gettimeOffPolicys',
  'gettimeOffPolicy',
  'managerequestTimeOffs',
  'getrequestTimeOffs',
  'getrequestTimeOff',
  'manageUserLeaves',
  'getUserLeaves',
  'manageOrganizationFile',
  'getOrganizationFile',
  'manageOrganizationFolder',
  'getOrganizationFolder',
  'getESignature',
  'manageESignatures',
  'managerequestTimeCards',
  'getrequestTimeCards',

  // roles and access implemented from here
  'manageWorkInfo',
  'getWorkInfo',
  'manageTeamInfo',
  'getTeamInfo',
  'manageEmployeeFolder',
  'getEmployeeFolder',
  'manageEmployeeFile',
  'getEmployeeFile',
  'manageTodos',
  'getTodo',
  'manageTasks',
  'getTasks',
  'managePolicies',
  'getPolicies',
];
const managerArray = [
  'getUsers',
  'manageUsers',
  'getUser',
  'manageOrganization',
  'getOrganizations',
  'getOrganization',
  'manageCandidates',
  'getCandidates',
  'getCandidate',
  'manageOnboardingStatus',
  'getOnboardingStatus',
  'manageTeamInfo',
  'getTeamInfo',
  'manageRolesandAccess',
  'getRolesandAccess',
  'manageTemplates',
  'getTemplates',
  'manageLocation',
  'getLocation',
  'manageEmploymentType',
  'getEmploymentType',
  'manageRoles',
  'getRoles',
  'manageBenefitGroups',
  'getBenefitGroups',
  'getBenefit',
  'manageBenefitPlans',
  'getBenefitPlans',
  'manageExecutedDocument',
  'getExecutedDocument',
  'notifications',
  'manageUserProfile',
  'getUserProfile',
  'manageOrganizationMember',
  'getOrganizationMember',
  'manageEligibilityRule',
  'getEligibilityRule',
  'manageLocationOfOperation',
  'getLocationOfOperation',
  'manageSpecialty',
  'getSpecialty',
  'manageEmployeeFolder',
  'getEmployeeFolder',
  'manageEmployeeFile',
  'getEmployeeFile',
  'manageSignatures',
  'getSignatures',
  'manageTimeCards',
  'getTimeCards',
  'getTimeCard',
  'managetimeOffTypes',
  'gettimeOffTypes',
  'gettimeOffType',
  'managetimeOffPolicys',
  'gettimeOffPolicys',
  'gettimeOffPolicy',
  'managerequestTimeOffs',
  'getrequestTimeOffs',
  'getrequestTimeOff',
  'manageUserLeaves',
  'getUserLeaves',
  'manageOrganizationFile',
  'getOrganizationFile',
  'manageOrganizationFolder',
  'getOrganizationFolder',
  'getESignature',
  'manageESignatures',
  'managerequestTimeCards',
  'getrequestTimeCards',

  // roles and access from here
  'manageWorkInfo',
  'getWorkInfo',
  'manageTeamInfo',
  'getTeamInfo',
  'manageEmployeeFolder',
  'getEmployeeFolder',
  'manageEmployeeFile',
  'getEmployeeFile',
  'manageTodos',
  'getTodo',
  'manageTasks',
  'getTasks',
  'managePolicies',
  'getPolicies',
];

const roleRights = new Map();
roleRights.set(roles[0], userArray);
roleRights.set(roles[1], adminArray);
roleRights.set(roles[2], hrArray);
roleRights.set(roles[3], managerArray);

module.exports = {
  roles,
  roleRights,
};
