import { ProWorkExperienceDetail } from './ProWorkExperienceDetail';
import { ProEducation, ProSkill, ProSoftwareKnowledge } from './pro-beans';

export class ProWorkExperience {
    proWorkExperienceId: number;
    selfDescription: string;
    isCA = false;
    proHighLights: string;
    workExperienceDetail = new Array<ProWorkExperienceDetail>();
    proEducation = new Array<ProEducation>();
    proSkill = new Array<ProSkill>();
    proKnowledge = new Array<ProSoftwareKnowledge>();
    professionalProfileId;

    constructor() {
        this.workExperienceDetail.push(new ProWorkExperienceDetail());
        this.proEducation.push(new ProEducation());
    }
}