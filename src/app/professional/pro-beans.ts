import { City, Province } from '../firm/firm-beans';

export class ProSignUp {
    firstName: string;
    lastName: string;
    password: string;
    workEmail: string;
    roleId = 3;
}

export class ProWorkAvailability {
    /* work availabilty */
    startDate;
    lastDate;
    dateRange;
    workAvailability: string;
    locationAvailability;
    isFullTime: boolean;
    professionalProfileId: number;
    /* work availabilty */
}

export class ProProfile {
    professionalProfileId: number;
    /* personal profile */
    firstName: string;
    lastName: string;
    address: string;
    cityNgModel;
    city = new City();
    provinceNgModel;
    province = new Province();
    zipCode;
    picBase64;
    //doc PAth
    hourlyFee;
    /* personal profile */
}

export class ProEducation {
    proEducationId;
    year = 'select';
    degree;
}

export class ProSkill {
    proSkillId;
    proSkillMasterId;
    proSkillCategoryId;
    proSkillDetailId;
}

export class ProfessionalDocument {
    professionalDocumentId;
    documentTitle;
    documentPath;
}

export class ProSoftwareKnowledge {
     proSoftwateKnowledgeId;
     knowledge;
     otherValue1: string;
     otherValue2: string;
     otherValue3: string;
     otherValue4: string;
     otherValue5: string;
}
