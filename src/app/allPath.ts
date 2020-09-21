import { FirmRest } from "./firm/firm.rest";
import { LoginRest } from './login/login.rest';
import { ProjectRest } from './project/projectRest';
import { ProRest } from './professional/pro.rest';
import { adminRest } from './admin/adminRest';
import { NotificationRest } from './professional/pro-dashboard/notification.rest';

export const allPath = {
    CLIENT_URL: {
        generalLogin: '/login-page',
        
        login: '/login',
        home: '/home',
        resetMailSendSuccess: '/reset-mail-success',
        forgotPassword: '/forgot-password',
        contact: '/contact',
        about: '/about',
        howItWorks: '/how-it-works',
        privacyPolicy: '/privacy-policy',
        
        
        
        firmSignUp: '/firm/sign-up',
        firmBusinessProfile: '/firm/profile/business',
        firmPersonalProfile: '/firm/profile/personal',
        firmDashBoard: '/firm/firm-main/dashboard',
        openProject: '/firm/firm-main/open-project',
        acceptedProject: '/firm/firm-main/accepted-project',
        historyProject: '/firm/firm-main/history-project',
        firmProfileComplete: '/firm/profile/complete',
        firmHelp: '/firm/help',

        /* PROFESSIONAL */
        proSignUp: '/professional/sign-up',
        proDashBoard: '/professional/pro-main/dashboard',
        proWrkAvailability: '/professional/work-availability',
        proPersonalProfile: '/professional/personal',
        proWorkExperience: '/professional/work-experience',
        proProfileComplete: '/professional/complete',
        requestedJob: '/professional/pro-main/requested-job',
        acceptedJob: '/professional/pro-main/accepted-job',
        historyJob: '/professional/pro-main/history-job',
        proHelp: '/professional/help',
        /* PROFESSIONAL */

        /* ADMIN */
        adminDashBoard: '/admin/admin-main/dashboard',
        adminSearchFirm: '/admin/admin-main/firm-search',
        adminFirmProfileList: '/admin/admin-main/firm-profiles',
        adminSearchPro: '/admin/admin-main/pro-search',
        adminProProfiles: '/admin/admin-main/prof-profiles',
        masterAdmin: '/admin/admin-main/addedit',
        
        
        /* ADMIN */
    },
    REST_URL: {
        firmRest: FirmRest,
        proRest: ProRest,
        adminRest: adminRest,
        loginRest: LoginRest,
        projectRest: ProjectRest,
        notificationRest: NotificationRest,
    },
}