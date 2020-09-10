import { City } from '../../firm/firm-beans';

export class Project {
    projectId: number;
    /* step 1  */
    isShortOrLong = 'Short';
    projectName: string;
    expertise: string;
    city = new City();
    cityId;
    workLocation = 'select';
    hours: number;
    hoursDuration = 'Total';
    projectDescription: string;
    targetDate: Date;
    /* step 1  */
}