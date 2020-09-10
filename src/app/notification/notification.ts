export class Notification {
    notificationId: number;
    notificationMessage: string;
    toUserId: number;
    fromUserId: number;
    isRead = 0;
    notificationFor;
}




// CREATE TABLE  NotificationTable (
//     notificationId BIGINT Primary key IDENTITY(1,1),
//     notificationMessage VARCHAR(1024),
// 	toUserId BIGINT,
// 	fromUserId BIGINT,
//     isRead BIT,
//     createdById BIGINT,
//     modifiedById BIGINT,
//     createdDate DATETIME2,
//     modifiedDate DATETIME2,
//     status TINYINT 
//  )